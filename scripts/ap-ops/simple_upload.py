"""Upload an existing dist/ to IONOS over the pinned SFTP session, overwriting in place.

No lock, journal or staging, so a rerun is idempotent. Files removed from dist stay
on the server. A failure prints its phase, the relative file, the exception class
and errno, never the exception text, host, user or remote root (logs are public).
"""
import argparse
import json
import os
from pathlib import Path
import posixpath
import re

from sftp_session import http_get, open_sftp, read, require, safe_path

PUBLIC_EXTENSIONS = {'.html','.css','.js','.mjs','.json','.xml','.txt','.svg','.png',
                     '.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf',
                     '.otf','.mp4','.webm','.mp3','.pdf','.avif','.map'}


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
    # Root dotfiles and dot-folders stay local; only the Apache configuration ships.
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


class Failed(Exception):
    def __init__(self, phase, file=None, **extra):
        super().__init__(phase)
        self.report = {'status': 'refused', 'phase': phase, 'file': file, **extra}


def order(name):
    # Assets precede the pages that reference them; the sitemap goes last.
    return (2 if name.endswith('.xml') else 1 if name.endswith('.html') else 0, name)


def upload(files, sftp, root, http=http_get, log=print):
    try:
        same_root = http('index.html') == (200, read(sftp, posixpath.join(root, 'index.html')))
    except Exception as exc:
        raise Failed('root-check', 'index.html') from exc
    if not same_root:
        raise Failed('root-check', 'index.html')
    names = sorted(files, key=order)
    for index, name in enumerate(names, 1):
        try:
            target = safe_path(sftp, root, name, create_parents=True)
            with sftp.file(target, 'wb') as stream:
                stream.set_pipelined(True)
                stream.write(files[name])
        except Exception as exc:
            raise Failed('write', name) from exc
        log(f'{index}/{len(names)} {name}', flush=True)
    mismatches = []
    for name in names:
        if name == '.htaccess':
            continue
        try:
            status, body = http(name)
        except Exception as exc:
            raise Failed('http-verify', name) from exc
        if (status, body) != (200, files[name]):
            mismatches.append([name, status])
    if mismatches:
        raise Failed('http-verify', mismatches=mismatches[:20])
    return {'status': 'uploaded', 'files': len(names)}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Existing dist artifact')
    parser.add_argument('--apply', action='store_true', help='Connect and overwrite the live files')
    args = parser.parse_args(argv)
    try:
        try:
            files = collect(args.source)
        except Exception as exc:
            raise Failed('collect') from exc
        if not args.apply:
            result = {'status': 'planned', 'files': len(files)}
        else:
            try:
                with open_sftp(os.environ) as session:
                    result = upload(files, session.sftp, session.root, http_get)
            except Failed:
                raise
            except Exception as exc:
                # upload() wraps its own errors, so this is opening or closing the session.
                raise Failed('connect') from exc
        code = 0
    except Failed as failure:
        cause = failure.__cause__
        result = dict(failure.report, error=type(cause).__name__ if cause else None,
                      errno=getattr(cause, 'errno', None))
        code = 1
    print(json.dumps(result), flush=True)
    return code


if __name__ == '__main__':
    raise SystemExit(main())
