"""Only fake account state and synthetic credentials are used."""
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import legacy_upload as upload
from test_sftp_session import FakeSFTP, OWNER


class UploadTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        (self.root/'index.html').write_bytes(b'new page')
        (self.root/'asset.css').write_bytes(b'asset')
        (self.root/'sitemap.xml').write_bytes(b'map')
        (self.root/'.htaccess').write_bytes(b'old rules')
        self.s=FakeSFTP()
        self.s.files['/web/.htaccess']=b'old rules'
        self.s.files['/web/unrelated.html']=b'preserve'
        self.get=lambda name:(403,b'') if name.startswith('.ap-ops/') else (200,self.s.files.get('/web/'+name,b''))
    def apply(self,http=None):
        return upload.upload(upload.collect(self.root),self.s,'/web',OWNER,http or self.get)
    def test_plan_is_offline_and_legacy_root_dotfiles_are_not_published(self):
        (self.root/'.nojekyll').write_bytes(b'')
        (self.root/'.private').mkdir(); (self.root/'.private/secret').write_bytes(b'ignored')
        with patch.object(upload,'open_sftp',side_effect=AssertionError):
            with patch('sys.stdout') as output:
                code=upload.main(['--source',str(self.root)])
        self.assertEqual(code,0)
        files=upload.collect(self.root)
        self.assertIn('.htaccess',files); self.assertNotIn('.nojekyll',files)
        self.assertFalse(any(k.startswith('.private/') for k in files))
    def test_refuses_symlinks_and_private_control_paths_before_remote(self):
        (self.root/'bad').symlink_to(self.root/'index.html')
        with self.assertRaises(ValueError): upload.collect(self.root)
        (self.root/'bad').unlink()
        (self.root/'nested').mkdir(); (self.root/'nested/.env').write_bytes(b'synthetic')
        with self.assertRaises(ValueError): upload.collect(self.root)
    def test_complete_verifies_hashes_preserves_unrelated_and_orders_assets_first(self):
        result=self.apply()
        self.assertEqual(result['status'],'verified')
        self.assertEqual(self.s.files['/web/unrelated.html'],b'preserve')
        live=[p for p in self.s.replacements if not p.startswith('/web/.ap-ops/')]
        self.assertLess(live.index('/web/asset.css'),live.index('/web/index.html'))
        self.assertNotIn('/web/.ap-ops/lock',self.s.dirs)
    def test_wrong_root_and_unsupported_rename_never_replace_public_file(self):
        with self.assertRaises(ValueError): self.apply(lambda name:(200,b'wrong'))
        self.assertFalse(self.s.replacements)
        self.s.support_rename=False
        with self.assertRaises(OSError): self.apply()
        self.assertEqual(self.s.files['/web/index.html'],b'live')
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)
    def test_uncertain_public_write_and_failed_http_retain_lock(self):
        original=self.s.posix_rename
        def uncertain(source,target):
            original(source,target)
            if not target.startswith('/web/.ap-ops/'): raise TimeoutError('synthetic secret')
        self.s.posix_rename=uncertain
        with self.assertRaises(TimeoutError): self.apply()
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)
        journal=json.loads(self.s.files['/web/.ap-ops/lock/journal.json'])
        self.assertTrue(journal['public_intent'])
        self.s=FakeSFTP(); self.s.files['/web/.htaccess']=b'old rules'
        def bad_http(name):
            if name.startswith('.ap-ops/'): return 403,b''
            return 200,b'live'  # root check passes; post-write verification does not.
        with self.assertRaises(ValueError): self.apply(bad_http)
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)
    def test_symlink_live_parent_refuses_without_public_replacement(self):
        (self.root/'a').mkdir(); (self.root/'a/file.css').write_bytes(b'css')
        self.s.links.add('/web/a')
        with self.assertRaises(ValueError): self.apply()
        self.assertFalse(any(not p.startswith('/web/.ap-ops/') for p in self.s.replacements))
    def test_direct_upload_api_cannot_write_control_or_traversal(self):
        before=dict(self.s.files)
        for name in ('.ap-ops/owner.json','../outside.html','nested/.env'):
            files={'index.html':b'page',name:b'bad'}
            with self.assertRaises(ValueError):
                upload.upload(files,self.s,'/web',OWNER,self.get)
            self.assertEqual(before,self.s.files)
            self.assertNotIn('/web/.ap-ops',self.s.dirs)

    def test_cli_refusal_is_generic_and_input_unchanged(self):
        before={str(p.relative_to(self.root)):p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
        with patch.object(upload,'open_sftp',side_effect=RuntimeError('NEVER-EXPOSE')), patch('sys.stdout') as output:
            code=upload.main(['--source',str(self.root),'--apply','--run-id','123','--commit','a'*40])
        self.assertEqual(code,1)
        text=''.join(c.args[0] for c in output.write.call_args_list)
        self.assertNotIn('NEVER-EXPOSE',text); self.assertIn('reconciliation',text)
        self.assertEqual(before,{str(p.relative_to(self.root)):p.read_bytes() for p in self.root.rglob('*') if p.is_file()})


if __name__=='__main__': unittest.main()
