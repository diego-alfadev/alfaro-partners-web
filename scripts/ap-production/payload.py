"""Validate and stage a public AP artifact. No network, secrets or deployment."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import tempfile

HEX = re.compile(r'[0-9a-f]{64}')
KEY = re.compile(r'[a-z][a-z0-9-]{0,79}')
LINK = re.compile(rb'href=[\'"](/inmuebles/[a-z][a-z0-9-]*/)[\'"]')


def require(condition):
    if not condition:
        raise ValueError('Artifact validation refused')


def unique(pairs):
    value = {}
    for key, item in pairs:
        require(key not in value)
        value[key] = item
    return value


def path_name(value):
    require(isinstance(value,str) and len(value)<=512
            and re.fullmatch(r'[A-Za-z0-9_./@-]+',value)
            and all(p not in ('','.','..','.git') for p in value.split('/'))
            and (value in ('.htaccess','.nojekyll') or not any(p.startswith('.') for p in value.split('/'))))
    return value


def validate(root, expected):
    require(HEX.fullmatch(expected) and not root.is_symlink())
    root = root.resolve(strict=True)
    actual = set()
    for path in root.rglob('*'):
        require(not path.is_symlink() and (path.is_dir() or path.is_file()))
        if path.is_file():
            actual.add(path.relative_to(root).as_posix())
    manifest_path = root/'payload.json'
    require(manifest_path.stat().st_size<=1024*1024)
    blob = manifest_path.read_bytes()
    require(hashlib.sha256(blob).hexdigest()==expected)
    document = json.loads(blob,object_pairs_hook=unique)
    require(set(document)=={'schema','destination','review_id','properties','site','rollback'}
            and document['schema']=='ap-production-payload/1'
            and document['destination']=='https://alfaropartners.es'
            and HEX.fullmatch(document['review_id'])
            and isinstance(document['properties'],list) and len(document['properties'])==1)
    prop = document['properties'][0]
    require(set(prop)=={'public_id','route_key'} and KEY.fullmatch(prop['public_id'])
            and KEY.fullmatch(prop['route_key']))
    expected_files, values, total = {'payload.json'}, {}, 0
    for folder in ('site','rollback'):
        inventory = document[folder]
        require(isinstance(inventory,dict) and 0<len(inventory)<=4096)
        values[folder] = {}
        for name, checksum in inventory.items():
            path_name(name)
            require(isinstance(checksum,str) and HEX.fullmatch(checksum))
            path = root/folder/name
            require(path.stat().st_size<=64*1024*1024 and not path.stat().st_mode & 0o111)
            data = path.read_bytes()
            total += len(data)
            require(total<=256*1024*1024 and hashlib.sha256(data).hexdigest()==checksum)
            expected_files.add(folder+'/'+name)
            values[folder][name]=data
    require(actual==expected_files)
    site, before = values['site'], values['rollback']
    require(before.keys()<=site.keys() and before.get('.htaccess')
            and site['.htaccess']==before['.htaccess'])
    hub = 'inmuebles/'+prop['route_key']+'/'
    media = 'inmuebles/media/'+prop['public_id']+'/'
    pages = {'inmuebles/index.html',hub+'index.html',hub+'reportaje/guiada/index.html'}
    mutable = pages | {'sitemap-index.xml','sitemap-properties.xml'}
    require(pages<=site.keys())
    previous = set(LINK.findall(before.get('inmuebles/index.html',b'')))
    require(set(LINK.findall(site['inmuebles/index.html']))==previous | {('/'+hub).encode()})
    for name, data in site.items():
        if name in before and name not in mutable and not name.startswith(media):
            require(data==before[name])
        elif name not in before:
            require(name in mutable or name.startswith('_astro/')
                    or name.startswith(media) and name.endswith(('.webp','.mp4')))
    return site


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,required=True,help='Exported public payload directory only')
    parser.add_argument('--expected-payload',required=True,help='Exact SHA-256 supplied independently by dispatcher')
    parser.add_argument('--stage',type=Path,required=True,help='New staging directory outside payload; never overwritten')
    args = parser.parse_args(argv)
    try:
        require(not args.stage.exists() and not args.stage.is_symlink()
                and args.stage.parent.is_dir()
                and not args.stage.resolve().is_relative_to(args.root.resolve())
                and not args.root.resolve().is_relative_to(args.stage.resolve()))
        files = validate(args.root,args.expected_payload)
        with tempfile.TemporaryDirectory(prefix='ap-artifact-',dir=args.stage.parent) as tmp:
            stage=Path(tmp)/'site'
            stage.mkdir()
            for name, data in files.items():
                path=stage/name
                path.parent.mkdir(parents=True,exist_ok=True)
                path.write_bytes(data)
                path.chmod(0o644)
            stage.rename(args.stage)
        value, code = {'status':'validated_not_published','files':len(files),'publication':False},0
    except (OSError,ValueError,KeyError,TypeError,AttributeError):
        value, code = {'status':'refused','reason':'artifact_validation_refused','publication':False},1
    print(json.dumps(value))
    return code


if __name__=='__main__':
    raise SystemExit(main())
