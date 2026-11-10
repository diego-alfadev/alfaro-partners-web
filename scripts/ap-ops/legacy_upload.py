"""Guard an existing legacy static artifact; plan by default, never build source.

A failed apply requires reconciliation of the protected remote journal and lock.
There is no automatic unlock, stale-lock cleanup or rollback of a partial upload.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import uuid

from sftp_session import (Lease, canonical_root, directory, exists, http_get,
                          open_sftp, owner_bytes, read, require, safe_path, write)

PUBLIC_EXTENSIONS = {'.html','.css','.js','.mjs','.json','.xml','.txt','.svg','.png',
                     '.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf',
                     '.otf','.mp4','.webm','.pdf','.avif','.map'}


def public_name(name):
    require(isinstance(name,str) and name and not name.startswith('/')
            and len(name)<=512)
    require(name=='.htaccess' or
            all(re.fullmatch(r'[A-Za-z0-9_@.-]+',p) and not p.startswith('.')
                and p not in ('.','..') for p in name.split('/'))
            and Path(name).suffix.lower() in PUBLIC_EXTENSIONS)
    return name


def collect(source):
    require(not source.is_symlink())
    source=source.resolve(strict=True)
    require(source.is_dir())
    files={}
    total=0
    # Preserve the old dist/* selection: root dotfiles/folders are ignored,
    # except the explicitly retained Apache configuration.
    for path in sorted(source.rglob('*')):
        relative=path.relative_to(source)
        require(not path.is_symlink() and (path.is_file() or path.is_dir()))
        if relative.parts[0].startswith('.') and str(relative)!='.htaccess':
            continue
        if path.is_file():
            public_name(relative.as_posix())
            require(not path.stat().st_mode & 0o111 and path.stat().st_size<=64*1024*1024)
            data=path.read_bytes()
            total+=len(data); require(total<=256*1024*1024)
            files[relative.as_posix()]=data
    require(files.get('index.html') and len(files)<=4096)
    return files


def check_target(sftp,root,name):
    """Inspect all existing ancestors before any public mutation."""
    directory(sftp,root)
    path=root
    missing=False
    parts=name.split('/')
    for i,part in enumerate(parts):
        path=path.rstrip('/')+'/'+part
        mode=None if missing else exists(sftp,path)
        if mode is None:
            missing=True
        else:
            require(stat.S_ISDIR(mode.st_mode) if i<len(parts)-1 else stat.S_ISREG(mode.st_mode))
    return path


def upload(files,sftp,root,owner,http=http_get):
    owner_bytes(owner)
    require(isinstance(files,dict) and 0<len(files)<=4096 and files.get('index.html'))
    require(all(isinstance(blob,bytes) and len(blob)<=64*1024*1024 for blob in files.values())
            and sum(map(len,files.values()))<=256*1024*1024)
    for name in files:
        public_name(name)
    require(canonical_root(sftp,root)==root)
    # A pinned account is not enough: prove which document root is being changed.
    require(http('index.html')==(200,read(sftp,root.rstrip('/')+'/index.html')))
    for name in files:
        check_target(sftp,root,name)
    lease=Lease(sftp,root,owner,http)
    lease.acquire()
    # From here any failure retains the shared lock and journal for reconciliation.
    stage=lease.control+'/stage-'+owner['attempt']
    sftp.mkdir(stage)
    staged={}
    lease.journal('staging')
    for index,(name,data) in enumerate(sorted(files.items())):
        # Hash-shaped flat storage cannot introduce a staged .htaccess override.
        path=stage+'/'+str(index)+'-'+hashlib.sha256(data).hexdigest()
        write(sftp,path,data)
        staged[name]=path
    first,second=stage+'/rename-source',stage+'/rename-target'
    write(sftp,first,b'new'); write(sftp,second,b'old')
    sftp.posix_rename(first,second)
    require(read(sftp,second)==b'new' and exists(sftp,first) is None)
    lease.journal('staged')
    # Assets precede routable documents; sitemap comes last.
    def order(name):
        return (2 if name.endswith('.xml') else 1 if name.endswith('.html') else 0,name)
    for name in sorted(files,key=order):
        lease.journal('replacing',name,public_intent=True)
        target=safe_path(sftp,root,name,create_parents=True)
        sftp.posix_rename(staged[name],target)
        require(read(sftp,target)==files[name])
    lease.journal('verifying',public_intent=True)
    for name,data in files.items():
        require(read(sftp,safe_path(sftp,root,name))==data)
        if name!='.htaccess':
            require(http(name)==(200,data))
    require(http('.ap-ops/probe.txt')[0] in (403,404))
    lease.journal('verified',public_intent=True)
    lease.complete()
    return {'status':'verified','files':len(files),'remote_writes':True,
            'reconciliation_required':False}


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,required=True,help='Existing dist artifact; no build or source checkout')
    parser.add_argument('--apply',action='store_true',help='Explicit guarded legacy upload; failure retains shared lock')
    parser.add_argument('--run-id',help='Public GitHub run ID; required with --apply')
    parser.add_argument('--commit',help='Exact artifact source commit, 40 lowercase hex; required with --apply')
    parser.add_argument('--attempt',help='32 lowercase hex attempt identity; generated once if omitted')
    args=parser.parse_args(argv)
    try:
        files=collect(args.source)
        if not args.apply:
            value={'status':'planned','files':len(files),'remote_writes':False}
        else:
            owner={'run_id':args.run_id,'commit':args.commit,'attempt':args.attempt or uuid.uuid4().hex}
            owner_bytes(owner)
            with open_sftp(os.environ) as session:
                value=upload(files,session.sftp,session.root,owner)
        code=0
    except Exception:
        # No provider errors, addresses, usernames or passwords enter public logs.
        value={'status':'refused','reason':'guarded_upload_requires_reconciliation',
               'remote_writes_possible':bool(args.apply),'reconciliation_required':bool(args.apply)}
        code=1
    print(json.dumps(value))
    return code


if __name__=='__main__':
    raise SystemExit(main())
