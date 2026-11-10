"""Pinned password-only session and shared protected deployment lease."""
from contextlib import contextmanager
import errno
import hashlib
import json
import posixpath
import re
import stat
import urllib.error
import urllib.parse
import urllib.request

from host_policy import verify_host_key

PUBLIC_ORIGIN = 'https://alfaropartners.es'
DENY = b'Require all denied\nDeny from all\n'
MARKER = b'ap-shared-deployment-control/1\n'
PROBE = b'AP nonsecret protection probe\n'


def require(value):
    if not value:
        raise ValueError('Deployment guard refused')


def canonical_bytes(value):
    return (json.dumps(value,sort_keys=True,separators=(',',':'))+'\n').encode()


def owner_bytes(owner):
    require(set(owner)=={'run_id','commit','attempt'}
            and re.fullmatch(r'[0-9]{1,24}',owner['run_id'])
            and re.fullmatch(r'[0-9a-f]{40}',owner['commit'])
            and re.fullmatch(r'[0-9a-f]{32}',owner['attempt']))
    return canonical_bytes(owner)


def exists(sftp, path):
    try:
        return sftp.lstat(path)
    except OSError as exc:
        if exc.errno == errno.ENOENT:
            return None
        raise


def regular(sftp, path):
    require(stat.S_ISREG(sftp.lstat(path).st_mode))


def directory(sftp, path):
    require(stat.S_ISDIR(sftp.lstat(path).st_mode))


def safe_path(sftp, root, relative, *, create_parents=False):
    require(isinstance(relative,str) and relative and not relative.startswith('/')
            and all(re.fullmatch(r'[A-Za-z0-9_@.-]+',p) and p not in ('.','..')
                    for p in relative.split('/')))
    directory(sftp,root)
    path=root
    pieces=relative.split('/')
    for i,part in enumerate(pieces):
        path=posixpath.join(path,part)
        mode=exists(sftp,path)
        if i<len(pieces)-1:
            if mode is None and create_parents:
                sftp.mkdir(path); mode=sftp.lstat(path)
            require(mode is not None and stat.S_ISDIR(mode.st_mode))
        elif mode is not None:
            require(stat.S_ISREG(mode.st_mode))
    return path


def canonical_root(sftp, raw):
    require(isinstance(raw,str) and raw and '\\' not in raw
            and all(p!='..' for p in raw.split('/')))
    absolute=raw if raw.startswith('/') else posixpath.join(sftp.normalize('.'),raw)
    absolute=posixpath.normpath(absolute)
    path='/'
    directory(sftp,path)
    for part in absolute.split('/')[1:]:
        path=posixpath.join(path,part); directory(sftp,path)
    canonical=sftp.normalize(raw)
    require(canonical==absolute)
    return absolute


def read(sftp,path,limit=128*1024*1024):
    regular(sftp,path)
    with sftp.file(path,'rb') as stream:
        data=stream.read(limit+1)
    require(len(data)<=limit)
    return data


def write(sftp,path,data):
    mode=exists(sftp,path)
    require(mode is None or stat.S_ISREG(mode.st_mode))
    with sftp.file(path,'wb') as stream:
        stream.write(data)
    require(read(sftp,path)==data)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):
        return None


def http_get(relative,limit=128*1024*1024):
    require(relative and not relative.startswith('/') and '..' not in relative.split('/'))
    url=PUBLIC_ORIGIN+'/'+urllib.parse.quote(relative,safe='/')
    request=urllib.request.Request(url,headers={'Cache-Control':'no-cache','Accept-Encoding':'identity'})
    opener=urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(request,timeout=45) as response:
            data=response.read(limit+1); require(len(data)<=limit)
            return response.status,data
    except urllib.error.HTTPError as exc:
        code=exc.code; exc.close()
        return code,b''


def pinned_policy(paramiko):
    class Policy(paramiko.MissingHostKeyPolicy):
        def missing_host_key(self,client,hostname,key):
            verify_host_key(key)
    return Policy()


@contextmanager
def open_sftp(environ):
    """Read only the five IONOS variables; no agent, local keys or TOFU."""
    import paramiko
    names=('SERVER','PORT','USERNAME','PASSWORD','REMOTE_PATH')
    values={n:environ['IONOS_SFTP_'+n] for n in names}
    require(all(isinstance(v,str) and v for v in values.values()))
    port=int(values['PORT']); require(1<=port<=65535)
    client=paramiko.SSHClient()
    sftp=None
    try:
        client.set_missing_host_key_policy(pinned_policy(paramiko))
        client.connect(hostname=values['SERVER'],port=port,username=values['USERNAME'],
                       password=values['PASSWORD'],allow_agent=False,look_for_keys=False,
                       timeout=30,banner_timeout=30,auth_timeout=30)
        sftp=client.open_sftp()
        sftp.get_channel().settimeout(45)
        root=canonical_root(sftp,values['REMOTE_PATH'])
        class Session: pass
        session=Session(); session.sftp=sftp; session.root=root
        yield session
    finally:
        if sftp is not None:
            sftp.close()
        client.close()


class Lease:
    """Never break an existing lock; callers retain it on unknown outcomes.

    acquire() may create protection only in a previously absent control directory.
    complete() requires verified state; release_no_write() rejects any write intent.
    Neither is an exception/finally unlock.
    """
    def __init__(self,sftp,root,owner,http=http_get):
        self.sftp,self.root,self.owner,self.http=sftp,root,owner,http
        self.encoded_owner=owner_bytes(owner)
        self.control=posixpath.join(root,'.ap-ops')
        self.lock=posixpath.join(self.control,'lock')
        self.owner_path=posixpath.join(self.lock,'owner.json')

    def acquire(self):
        s=self.sftp
        if exists(s,self.control) is None:
            s.mkdir(self.control)
            write(s,self.control+'/.htaccess',DENY)
            write(s,self.control+'/probe.txt',PROBE)
            require(self.http('.ap-ops/probe.txt')[0] in (403,404))
            write(s,self.control+'/marker',MARKER)
        else:
            directory(s,self.control)
            require(read(s,self.control+'/.htaccess')==DENY
                    and read(s,self.control+'/probe.txt')==PROBE
                    and read(s,self.control+'/marker')==MARKER)
            require(self.http('.ap-ops/probe.txt')[0] in (403,404))
        s.mkdir(self.lock)  # Atomic exclusive acquisition, never stale-lock removal.
        write(s,self.owner_path,self.encoded_owner)
        self.journal('acquired')

    def check_owner(self):
        directory(self.sftp,self.control); directory(self.sftp,self.lock)
        require(read(self.sftp,self.owner_path)==self.encoded_owner)

    def journal(self,phase,path=None,*,public_intent=False):
        self.check_owner()
        journal_path=self.lock+'/journal.json'
        previous=exists(self.sftp,journal_path)
        state=json.loads(read(self.sftp,journal_path)) if previous else {}
        value={'owner':self.owner,'phase':phase,'path':path,
               'public_intent':bool(public_intent or state.get('public_intent'))}
        write(self.sftp,journal_path,canonical_bytes(value))

    def _release(self,verified):
        self.check_owner()
        data=read(self.sftp,self.lock+'/journal.json')
        state=json.loads(data)
        require(data==canonical_bytes(state) and state['owner']==self.owner)
        require(state['phase']=='verified' if verified else state['public_intent'] is False)
        self.sftp.remove(self.lock+'/journal.json')
        self.sftp.remove(self.owner_path)
        self.sftp.rmdir(self.lock)

    def release_no_write(self):
        self._release(False)

    def complete(self):
        self._release(True)
