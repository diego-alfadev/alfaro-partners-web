"""Synthetic SFTP guards: never connect to a real account."""
import errno
import io
import stat
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch
import sftp_session as guard


class Writer(io.BytesIO):
    def __init__(self, fs, path):
        super().__init__(); self.fs, self.path = fs, path
    def set_pipelined(self, pipelined=True): pass
    def close(self):
        self.fs.files[self.path] = self.getvalue()
        super().close()


class FakeSFTP:
    def __init__(self):
        self.dirs = {'/', '/web'}
        self.files = {'/web/index.html': b'live'}
        self.links = set()
    def normalize(self, path):
        import posixpath
        return posixpath.normpath(path if path.startswith('/') else '/'+path)
    def lstat(self, path):
        if path in self.links: return SimpleNamespace(st_mode=stat.S_IFLNK | 0o777)
        if path in self.dirs: return SimpleNamespace(st_mode=stat.S_IFDIR | 0o755)
        if path in self.files: return SimpleNamespace(st_mode=stat.S_IFREG | 0o644)
        raise FileNotFoundError(errno.ENOENT, 'missing')
    def mkdir(self, path):
        if path in self.dirs or path in self.files: raise FileExistsError('exists')
        if path.rsplit('/',1)[0] not in self.dirs: raise FileNotFoundError('parent')
        self.dirs.add(path)
    def file(self, path, mode):
        if 'w' in mode: return Writer(self,path)
        return io.BytesIO(self.files[path])
    def listdir_attr(self, path):
        children={p for p in self.dirs|set(self.files)|self.links
                  if p!=path and p.rsplit('/',1)[0]==path}
        return [SimpleNamespace(filename=c.rsplit('/',1)[1],st_mode=self.lstat(c).st_mode)
                for c in sorted(children)]
    def remove(self, path): del self.files[path]
    def rmdir(self, path):
        if any(p.startswith(path+'/') for p in self.dirs|set(self.files)|self.links): raise OSError('not empty')
        self.dirs.remove(path)
    def get_channel(self): return Mock()
    def close(self): pass


class SessionTest(unittest.TestCase):
    def test_host_verified_before_password_and_no_ambient_auth(self):
        env = {'IONOS_SFTP_'+k:v for k,v in {'SERVER':'synthetic.invalid','PORT':'22','USERNAME':'synthetic','PASSWORD':'synthetic-only','REMOTE_PATH':'/web'}.items()}
        client=Mock(); client.open_sftp.return_value=FakeSFTP()
        events=[]
        def connect(**kwargs):
            self.assertFalse(kwargs['allow_agent']); self.assertFalse(kwargs['look_for_keys'])
            client.policy.missing_host_key(client,'synthetic.invalid',Mock())
            events.append('auth')
        client.connect.side_effect=connect
        client.set_missing_host_key_policy.side_effect=lambda value:setattr(client,'policy',value)
        fake=SimpleNamespace(SSHClient=lambda:client,MissingHostKeyPolicy=object)
        with patch.dict('sys.modules',paramiko=fake), patch.object(guard,'verify_host_key',side_effect=lambda _:events.append('pin')):
            with guard.open_sftp(env) as value: self.assertEqual(value.root,'/web')
        self.assertEqual(events,['pin','auth'])
        client.close.assert_called_once()

    def test_wrong_pin_refuses_before_auth(self):
        # The policy invocation is before Paramiko's authentication phase.
        fake=SimpleNamespace(SSHClient=Mock,MissingHostKeyPolicy=object)
        with patch.dict('sys.modules',paramiko=fake), patch.object(guard,'verify_host_key',side_effect=ValueError):
            policy=guard.pinned_policy(fake)
            with self.assertRaises(ValueError): policy.missing_host_key(None,'host',Mock())

    def test_symlink_ancestor_and_uncanonical_paths_refuse(self):
        s=FakeSFTP(); s.dirs.add('/web/sub'); s.links.add('/web')
        with self.assertRaises(ValueError): guard.canonical_root(s,'/web/sub')
        with self.assertRaises(ValueError): guard.canonical_root(FakeSFTP(),'/web/../web')

    def test_canonical_alias_and_symlink_target_are_refused(self):
        s=FakeSFTP()
        s.normalize=lambda _: '/different'
        with self.assertRaises(ValueError): guard.canonical_root(s,'/web')
        s=FakeSFTP(); s.links.add('/web/index.html')
        with self.assertRaises(ValueError): guard.safe_path(s,'/web','index.html')


if __name__=='__main__': unittest.main()
