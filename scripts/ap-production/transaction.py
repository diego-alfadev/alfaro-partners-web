"""Publish an exact public payload under the shared lease; reconcile or recover that attempt only.

Default is offline validation. Claims bind dispatch intent, not independent Sheet truth.
Per-file rename is atomic; whole-site replacement is not. Unknown outcomes retain the lease.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys
import time

# Never search an ambient cwd for the trusted shared transport implementation.
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'ap-ops'))
from sftp_session import (Lease, PUBLIC_ORIGIN, DENY, PROBE, MARKER, canonical_bytes, canonical_root, directory,
                          exists, http_get, open_sftp, owner_bytes, read, require, safe_path, write)
from payload import validate, unique, HEX

MAX_TTL=1800


def sha(data):
    return hashlib.sha256(data).hexdigest()


def load(root,expected,claim_path,expected_claim,attempt,control_commit,*,fresh=True):
    site=validate(root,expected)
    document=json.loads((root/'payload.json').read_bytes(),object_pairs_hook=unique)
    require(not claim_path.is_symlink() and claim_path.stat().st_size<=4096)
    blob=claim_path.read_bytes()
    require(isinstance(expected_claim,str) and HEX.fullmatch(expected_claim) and sha(blob)==expected_claim)
    claim=json.loads(blob,object_pairs_hook=unique)
    require(set(claim)=={'schema','attempt','review','payload','control_commit','origin','issued_at','expires_at'})
    require(claim['schema']=='ap-production-claim/1' and claim['attempt']==attempt
            and re.fullmatch(r'[0-9a-f]{32}',attempt) and re.fullmatch(r'[0-9a-f]{40}',control_commit)
            and claim['control_commit']==control_commit and claim['payload']==expected
            and claim['review']==document['review_id'] and claim['origin']==PUBLIC_ORIGIN)
    require(type(claim['issued_at']) is int and type(claim['expires_at']) is int
            and 0<claim['expires_at']-claim['issued_at']<=MAX_TTL)
    if fresh:
        require(claim['issued_at']<=int(time.time())<claim['expires_at'])
    before={n:(root/'rollback'/n).read_bytes() for n in document['rollback']}
    return {'site':site,'before':before,'document':document,'claim':claim,'claim_sha':expected_claim,'payload':expected}


def hash_at(sftp,root,name):
    path=safe_path(sftp,root,name)
    return sha(read(sftp,path)) if exists(sftp,path) else None


def inspect_paths(sftp,root,names):
    """Check existing ancestors without creating public paths; return missing directories."""
    missing=set()
    for name in names:
        path=root
        absent=False
        for part in name.split('/')[:-1]:
            path=path.rstrip('/')+'/'+part
            mode=None if absent else exists(sftp,path)
            if mode is None:
                absent=True;missing.add(path[len(root.rstrip('/'))+1:])
            else:
                require(stat.S_ISDIR(mode.st_mode))
        if not absent:
            safe_path(sftp,root,name)
    return sorted(missing,key=lambda n:(n.count('/'),n))


def current_hash(sftp,root,name):
    # Missing ancestors mean absent, but symlinks/non-directory ancestors refuse.
    if inspect_paths(sftp,root,[name]):
        return None
    return hash_at(sftp,root,name)


def proof(sftp,root,inventory,http,*,absent=()):
    for name,checksum in inventory.items():
        require(current_hash(sftp,root,name)==checksum)
        if not name.startswith('.'):
            code,data=http(name);require(code==200 and sha(data)==checksum)
    for name in absent:
        require(current_hash(sftp,root,name) is None)
        if not name.startswith('.'):
            require(http(name)[0]==404)
    require(http('.ap-ops/probe.txt')[0] in (403,404))


def record_write(lease,record,path):
    lease.check_owner()
    write(lease.sftp,path,canonical_bytes(record))


def receipt(bundle,owner):
    return {'schema':'ap-prod-worker/1','attempt':owner['attempt'],'review':bundle['claim']['review'],
            'payload':bundle['payload'],'claim':bundle['claim_sha'],'run_id':owner['run_id'],
            'commit':owner['commit'],'control_commit':bundle['claim']['control_commit'],'origin':PUBLIC_ORIGIN,'files':bundle['document']['site'],
            'verified':True,'publication':True}


def restore(bundle,sftp,root,lease,record,record_path,http):
    """Preflight every target before restoring any byte; foreign bytes always stop recovery."""
    baseline=record['baseline'];candidate=record['candidate']
    if record.get('directory_intent'):
        # A lost mkdir acknowledgement cannot establish ownership of an existing directory.
        require(exists(sftp,root.rstrip('/')+'/'+record['directory_intent']) is None)
    for name in candidate:
        require(current_hash(sftp,root,name) in (baseline.get(name),candidate[name]))
    for name,checksum in baseline.items():
        require(sha(read(sftp,record['backups'][name]))==checksum)
    record['phase']='recovering';record_write(lease,record,record_path)
    for name in sorted(candidate,reverse=True):
        current=current_hash(sftp,root,name)
        if name in baseline:
            if current!=baseline[name]:
                lease.journal('restoring',name,public_intent=True)
                # Copy retained immutable backup; never consume recovery evidence.
                temporary=record['stage']+'/restore'
                write(sftp,temporary,read(sftp,record['backups'][name]))
                sftp.posix_rename(temporary,safe_path(sftp,root,name))
        elif current is not None:
            lease.journal('removing-added',name,public_intent=True)
            require(current_hash(sftp,root,name)==candidate[name])
            sftp.remove(safe_path(sftp,root,name))
    for name in reversed(record['created_dirs']):
        path=root.rstrip('/')+'/'+name
        if exists(sftp,path):
            directory(sftp,path)
            sftp.rmdir(path)  # Nonempty/foreign directories refuse, never recurse.
    proof(sftp,root,baseline,http,absent=set(candidate)-set(baseline))
    record['phase']='rolled_back';record_write(lease,record,record_path)
    lease.journal('verified',public_intent=True);lease.complete()
    return {'schema':'ap-prod-worker/1','attempt':lease.owner['attempt'],'status':'rolled_back',
            'verified':True,'publication':False,'payload':bundle['payload'],'claim':bundle['claim_sha']}


def execute(bundle,sftp,root,owner,operation='deploy',http=http_get):
    owner_bytes(owner);require(owner['attempt']==bundle['claim']['attempt'])
    require(operation in ('deploy','reconcile','recover') and canonical_root(sftp,root)==root)
    require(http('index.html')==(200,read(sftp,root.rstrip('/')+'/index.html')))
    lease=Lease(sftp,root,owner,http)
    record_path=lease.control+'/transaction-'+owner['attempt']+'.json'
    if operation!='deploy':
        directory(sftp,lease.control)
        require(read(sftp,lease.control+'/.htaccess')==DENY
                and read(sftp,lease.control+'/probe.txt')==PROBE
                and read(sftp,lease.control+'/marker')==MARKER
                and http('.ap-ops/probe.txt')[0] in (403,404))
        # Same attempt AND original owner only; a new workflow run cannot steal a lease.
        record_blob=read(sftp,record_path)
        record=json.loads(record_blob,object_pairs_hook=unique)
        require(record_blob==canonical_bytes(record) and record['schema']=='ap-production-transaction/1'
                and record['origin']==PUBLIC_ORIGIN and record['owner']==owner
                and record['payload']==bundle['payload'] and record['claim']==bundle['claim_sha']
                and record['review']==bundle['claim']['review']
                and record['baseline']==bundle['document']['rollback']
                and record['candidate']==bundle['document']['site'])
        require(record['stage']==lease.control+'/transaction-'+owner['attempt'])
        require(record['backups']=={n:record['stage']+'/b-'+str(i) for i,n in enumerate(sorted(record['baseline']))})
        require(record['created_dirs']==inspect_record_dirs(record['created_dirs']))
        prefixes={n.rsplit('/',i)[0] for n in record['candidate'] for i in range(1,n.count('/')+1)}
        require(set(record['created_dirs'])<=prefixes)
        if exists(sftp,lease.lock):
            lease.check_owner()
        else:
            require(record['phase'] in ('verified','rolled_back'))
            lease.acquire()
        if operation=='recover':
            return restore(bundle,sftp,root,lease,record,record_path,http)
        if record['phase']=='rolled_back':
            proof(sftp,root,record['baseline'],http,absent=set(record['candidate'])-set(record['baseline']))
            lease.release_no_write()
            return {'schema':'ap-prod-worker/1','status':'rolled_back','verified':True,'publication':False,'attempt':owner['attempt']}
        proof(sftp,root,record['candidate'],http)
        record['phase']='verified';record_write(lease,record,record_path)
        value=receipt(bundle,owner)
        lease.journal('verified',public_intent=True);lease.complete()
        return value
    require(int(time.time())<bundle['claim']['expires_at'])
    # Check known root and all baseline bytes and all additions before acquiring/writing public data.
    inspect_paths(sftp,root,bundle['site'])
    for name,checksum in bundle['document']['rollback'].items():
        require(current_hash(sftp,root,name)==checksum)
    for name in bundle['site'].keys()-bundle['before'].keys():
        require(current_hash(sftp,root,name) is None)
    require(exists(sftp,record_path) is None)
    lease.acquire()
    try:
        stage=lease.control+'/transaction-'+owner['attempt'];sftp.mkdir(stage)
        backups={}
        for i,name in enumerate(sorted(bundle['before'])):
            path=stage+'/b-'+str(i);write(sftp,path,bundle['before'][name]);backups[name]=path
        staged={}
        for i,name in enumerate(sorted(bundle['site'])):
            path=stage+'/c-'+str(i);write(sftp,path,bundle['site'][name]);staged[name]=path
        write(sftp,stage+'/rename-a',b'new');write(sftp,stage+'/rename-b',b'old')
        sftp.posix_rename(stage+'/rename-a',stage+'/rename-b')
        require(read(sftp,stage+'/rename-b')==b'new' and exists(sftp,stage+'/rename-a') is None)
        record={'schema':'ap-production-transaction/1','origin':PUBLIC_ORIGIN,'owner':owner,'payload':bundle['payload'],
                'claim':bundle['claim_sha'],'review':bundle['claim']['review'],'phase':'staged',
                'baseline':bundle['document']['rollback'],'candidate':bundle['document']['site'],
                'stage':stage,'backups':backups,'created_dirs':[]}
        record_write(lease,record,record_path)
        order=lambda n:(2 if n.endswith('.xml') else 1 if n.endswith('.html') else 0,n)
        for name in sorted(bundle['site'],key=order):
            if bundle['site'][name]==bundle['before'].get(name):
                continue
            require(int(time.time())<bundle['claim']['expires_at'])
            require(current_hash(sftp,root,name)==record['baseline'].get(name))
            for directory_name in inspect_paths(sftp,root,[name]):
                if directory_name not in record['created_dirs']:
                    record['directory_intent']=directory_name
                    record_write(lease,record,record_path)
                    lease.journal('creating-directory',directory_name,public_intent=True)
                    sftp.mkdir(root.rstrip('/')+'/'+directory_name)
                    record['created_dirs'].append(directory_name)
                    record['directory_intent']=None
                    record_write(lease,record,record_path)
            record['phase']='replacing';record['intent']={'path':name,'sha256':record['candidate'][name]}
            record_write(lease,record,record_path)
            lease.journal('replacing',name,public_intent=True)
            sftp.posix_rename(staged[name],safe_path(sftp,root,name))
            require(current_hash(sftp,root,name)==record['candidate'][name])
        proof(sftp,root,record['candidate'],http)
        record['phase']='verified';record_write(lease,record,record_path)
        value=receipt(bundle,owner)
        lease.journal('verified',public_intent=True);lease.complete()
        return value
    except Exception:
        # Never blindly retry an uncertain write. Inspect actual bytes before restoration.
        journal=json.loads(read(sftp,lease.lock+'/journal.json'))
        if journal['public_intent'] is False:
            lease.release_no_write()
            raise
        if 'record' in locals():
            return restore(bundle,sftp,root,lease,record,record_path,http)
        raise


def inspect_record_dirs(names):
    require(isinstance(names,list) and len(names)==len(set(names)))
    for name in names:
        require(isinstance(name,str) and name and all(re.fullmatch(r'[A-Za-z0-9_@.-]+',p)
                and p not in ('.','..') for p in name.split('/')))
    return names


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,required=True)
    parser.add_argument('--expected-payload',required=True)
    parser.add_argument('--claim',type=Path,required=True)
    parser.add_argument('--expected-claim',required=True,help='Independent dispatch claim SHA-256')
    parser.add_argument('--attempt',required=True,help='Exact 32 lowercase hex transaction identity')
    parser.add_argument('--control-commit',required=True,help='Exact trusted transport/control implementation commit, not property source')
    parser.add_argument('--commit',help='Exact original hosted workflow head SHA; required with --apply')
    parser.add_argument('--run-id',help='Original numeric deployment run ID (also required for recovery)')
    parser.add_argument('--operation',choices=('deploy','reconcile','recover'),default='deploy')
    parser.add_argument('--apply',action='store_true',help='Explicit authenticated operation; default offline validation')
    args=parser.parse_args(argv)
    try:
        bundle=load(args.root,args.expected_payload,args.claim,args.expected_claim,args.attempt,args.control_commit,
                    fresh=args.operation=='deploy')
        if not args.apply:
            value={'schema':'ap-prod-worker/1','status':'planned','publication':False,'attempt':args.attempt}
        else:
            owner={'run_id':args.run_id,'commit':args.commit,'attempt':args.attempt};owner_bytes(owner)
            with open_sftp(os.environ) as session:
                value=execute(bundle,session.sftp,session.root,owner,args.operation)
        code=0 if value.get('publication') or value.get('status')=='planned' else 1
    except Exception:
        value={'schema':'ap-prod-worker/1','status':'refused','verified':False,'publication':False,
               'reconciliation_required':bool(args.apply)};code=1
    print(json.dumps(value,sort_keys=True))
    return code


if __name__=='__main__':
    raise SystemExit(main())
