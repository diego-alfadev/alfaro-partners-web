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
        self.assertFalse(self.s.replacements)
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

    def test_plan_is_offline(self):
        with patch.object(upload,'open_sftp',side_effect=AssertionError), patch('sys.stdout') as output:
            code=upload.main(['--source',str(self.root)])
        self.assertEqual(code,0)
        self.assertEqual(json.loads(output.write.call_args_list[0].args[0])['status'],'planned')


if __name__=='__main__': unittest.main()
