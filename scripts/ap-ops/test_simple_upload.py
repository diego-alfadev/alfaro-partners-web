"""Only fake account state and synthetic credentials are used."""
from contextlib import contextmanager
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import simple_upload as upload
from test_sftp_session import FakeSFTP


class SimpleUploadTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        (self.root/'index.html').write_bytes(b'new page')
        (self.root/'_astro').mkdir(); (self.root/'_astro/a.css').write_bytes(b'asset')
        (self.root/'sitemap.xml').write_bytes(b'map')
        (self.root/'.htaccess').write_bytes(b'rules')
        self.s=FakeSFTP()
        self.s.files['/web/unrelated.html']=b'preserve'
        self.written=[]
        original=self.s.file
        def tracked(path,mode):
            if 'w' in mode: self.written.append(path)
            return original(path,mode)
        self.s.file=tracked
        self.get=lambda name:(200,self.s.files.get('/web/'+name,b''))

    def run_cli(self,sftp=None):
        @contextmanager
        def session(_environ):
            yield SimpleNamespace(sftp=sftp or self.s,root='/web')
        with patch.object(upload,'open_sftp',session), patch.object(upload,'http_get',self.get), \
                patch('sys.stdout') as output:
            code=upload.main(['--source',str(self.root),'--apply'])
        lines=''.join(c.args[0] for c in output.write.call_args_list).strip().splitlines()
        return code,json.loads(lines[-1]),'\n'.join(lines)

    def test_overwrites_in_place_assets_first_without_lock_or_rename(self):
        code,result,_=self.run_cli()
        self.assertEqual((code,result['status'],result['files']),(0,'uploaded',4))
        self.assertEqual(self.s.files['/web/index.html'],b'new page')
        self.assertEqual(self.s.files['/web/unrelated.html'],b'preserve')
        self.assertEqual(self.written,['/web/.htaccess','/web/_astro/a.css','/web/index.html','/web/sitemap.xml'])
        self.assertFalse(any(p.startswith('/web/.ap-ops') for p in self.s.dirs|set(self.s.files)))

    def test_wrong_document_root_writes_nothing(self):
        self.get=lambda name:(200,b'another site')
        code,result,_=self.run_cli()
        self.assertEqual((code,result['phase'],result['file']),(1,'root-check','index.html'))
        self.assertFalse(self.written)

    def test_failed_write_names_phase_and_file_but_not_the_error_text(self):
        original=self.s.file
        def broken(path,mode):
            if path.endswith('index.html') and 'w' in mode: raise OSError(13,'NEVER-EXPOSE host')
            return original(path,mode)
        self.s.file=broken
        code,result,text=self.run_cli()
        self.assertEqual((code,result['phase'],result['file'],result['error'],result['errno']),
                         (1,'write','index.html','PermissionError',13))
        self.assertNotIn('NEVER-EXPOSE',text)
        self.assertIn('2/4 _astro/a.css',text)

    def test_public_mismatch_is_reported_after_upload(self):
        self.get=lambda name:(200,b'new page') if name=='index.html' else (200,b'stale')
        self.s.files['/web/index.html']=b'new page'
        code,result,_=self.run_cli()
        self.assertEqual((code,result['phase']),(1,'http-verify'))
        self.assertEqual(result['mismatches'],[['_astro/a.css',200],['sitemap.xml',200]])

    def test_collect_skips_root_dotfiles_but_keeps_htaccess_and_audio(self):
        (self.root/'.nojekyll').write_bytes(b'')
        (self.root/'.private').mkdir(); (self.root/'.private/secret').write_bytes(b'ignored')
        (self.root/'media').mkdir(); (self.root/'media/interview.mp3').write_bytes(b'ID3')
        files=upload.collect(self.root)
        self.assertIn('.htaccess',files); self.assertNotIn('.nojekyll',files)
        self.assertFalse(any(k.startswith('.private/') for k in files))
        self.assertEqual(files['media/interview.mp3'],b'ID3')

    def test_collect_refuses_symlinks_and_nested_dotfiles(self):
        (self.root/'bad').symlink_to(self.root/'index.html')
        with self.assertRaises(ValueError): upload.collect(self.root)
        (self.root/'bad').unlink()
        (self.root/'nested').mkdir(); (self.root/'nested/.env').write_bytes(b'synthetic')
        code,result,_=self.run_cli()
        self.assertEqual((code,result['phase']),(1,'collect'))
        self.assertFalse(self.written)

    def listing(self,*names):
        for name in names:
            path=self.root/name; path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(b'page')

    def remote(self,*names):
        for name in names:
            parts=name.split('/')
            for i in range(1,len(parts)):
                self.s.dirs.add('/web/'+'/'.join(parts[:i]))
            self.s.files['/web/'+name]=b'old'

    def test_withdrawn_listing_files_and_empty_folders_are_removed(self):
        self.listing('inmuebles/index.html','inmuebles/lope-ap-1/index.html')
        self.remote('inmuebles/old-ap-2/index.html','inmuebles/old-ap-2/reportaje/index.html',
                    'inmuebles/media/ap-2/a.webp','inmuebles/lope-ap-1/index.html')
        code,result,_=self.run_cli()
        self.assertEqual((code,result['status'],result['pruned']),(0,'uploaded',3))
        self.assertEqual(self.s.files['/web/inmuebles/lope-ap-1/index.html'],b'page')
        self.assertFalse(any('old-ap-2' in p or 'ap-2/' in p for p in self.s.dirs|set(self.s.files)))
        self.assertNotIn('/web/inmuebles/media',self.s.dirs)
        self.assertIn('/web/inmuebles/lope-ap-1',self.s.dirs)
        self.assertEqual(self.s.files['/web/unrelated.html'],b'preserve')

    def test_build_without_catalogue_prunes_nothing(self):
        self.remote('inmuebles/index.html','inmuebles/old-ap-2/index.html')
        code,result,_=self.run_cli()
        self.assertEqual((code,result['pruned']),(0,0))
        self.assertIn('/web/inmuebles/old-ap-2/index.html',self.s.files)

    def test_prune_keeps_dotfiles_and_never_follows_links(self):
        self.listing('inmuebles/index.html')
        self.remote('inmuebles/.htaccess','inmuebles/old/index.html')
        self.s.links.add('/web/inmuebles/link')
        code,result,_=self.run_cli()
        self.assertEqual((code,result['pruned']),(0,1))
        self.assertIn('/web/inmuebles/.htaccess',self.s.files)
        self.assertIn('/web/inmuebles/link',self.s.links)

    def test_failed_verification_prunes_nothing(self):
        self.listing('inmuebles/index.html')
        self.remote('inmuebles/old/index.html')
        self.get=lambda name:(200,b'new page') if name=='index.html' else (200,b'stale')
        self.s.files['/web/index.html']=b'new page'
        code,result,_=self.run_cli()
        self.assertEqual((code,result['phase']),(1,'http-verify'))
        self.assertIn('/web/inmuebles/old/index.html',self.s.files)

    def test_failed_delete_names_phase_and_file(self):
        self.listing('inmuebles/index.html')
        self.remote('inmuebles/old/index.html')
        def denied(path): raise OSError(13,'NEVER-EXPOSE')
        self.s.remove=denied
        code,result,text=self.run_cli()
        self.assertEqual((code,result['phase'],result['file'],result['errno']),
                         (1,'prune','inmuebles/old/index.html',13))
        self.assertNotIn('NEVER-EXPOSE',text)

    def test_plan_is_offline(self):
        with patch.object(upload,'open_sftp',side_effect=AssertionError), patch('sys.stdout') as output:
            code=upload.main(['--source',str(self.root)])
        self.assertEqual(code,0)
        self.assertEqual(json.loads(output.write.call_args_list[0].args[0])['status'],'planned')


if __name__=='__main__': unittest.main()
