"""Pinned password-only SFTP session and path guards for the IONOS docroot."""
from contextlib import contextmanager
import errno
import posixpath
import re
import stat
import urllib.error
import urllib.parse
import urllib.request

from host_policy import verify_host_key

PUBLIC_ORIGIN = 'https://alfaropartners.es'


def require(value):
    if not value:
        raise ValueError('Deployment guard refused')


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

