"""The artifact-only channel must fail closed without changing its checkout."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('payload.py')


class PayloadTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.payload = self.root/'payload'
        self.payload.mkdir()
        self.stage = self.root/'stage'
        self.before = {'index.html':b'live home', '.htaccess':b'live apache'}
        self.after = dict(self.before, **{
            'inmuebles/index.html':b'<a href="/inmuebles/test-home/">Property</a>',
            'inmuebles/test-home/index.html':b'approved property',
            'inmuebles/test-home/reportaje/guiada/index.html':b'approved tour',
            'inmuebles/media/ap-test/photo.webp':b'approved image',
            'sitemap-index.xml':b'index', 'sitemap-properties.xml':b'properties'})

    def write(self):
        inventory = {}
        for folder, values in (('site',self.after),('rollback',self.before)):
            inventory[folder] = {}
            for name, data in values.items():
                path = self.payload/folder/name
                path.parent.mkdir(parents=True,exist_ok=True)
                path.write_bytes(data)
                inventory[folder][name]=hashlib.sha256(data).hexdigest()
        self.document = {'schema':'ap-production-payload/1','destination':'https://alfaropartners.es',
                         'review_id':'a'*64, 'properties':[{'public_id':'ap-test','route_key':'test-home'}],
                         **inventory}
        self.blob = json.dumps(self.document,sort_keys=True).encode()
        (self.payload/'payload.json').write_bytes(self.blob)
        return hashlib.sha256(self.blob).hexdigest()

    def call(self, expected):
        return subprocess.run([sys.executable,str(SCRIPT),'--root',str(self.payload),
                               '--expected-payload',expected,'--stage',str(self.stage)],
                              capture_output=True,text=True)

    def test_validated_bytes_are_staged_only_with_exact_manifest_hash(self):
        expected=self.write()
        result=self.call(expected)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(json.loads(result.stdout)['status'],'validated_not_published')
        self.assertEqual((self.stage/'index.html').read_bytes(),b'live home')
        self.assertFalse((self.stage/'payload.json').exists())
        self.assertFalse((self.stage/'rollback').exists())

    def test_tamper_extra_file_symlink_and_wrong_hash_leave_no_stage(self):
        expected=self.write()
        for kind in ('tamper','extra','symlink','hash'):
            with self.subTest(kind=kind):
                path=self.payload/'site/index.html'
                extra=self.payload/'private.json'
                if kind=='tamper': path.write_bytes(b'changed')
                if kind=='extra': extra.write_bytes(b'private')
                if kind=='symlink': path.unlink();path.symlink_to(self.payload/'rollback/index.html')
                result=self.call('b'*64 if kind=='hash' else expected)
                self.assertEqual(result.returncode,1)
                self.assertEqual(json.loads(result.stdout)['reason'],'artifact_validation_refused')
                self.assertFalse(self.stage.exists())
                if extra.exists():extra.unlink()
                if path.is_symlink():path.unlink()
                path.write_bytes(b'live home')

    def test_unrelated_live_page_edit_or_draft_path_is_refused(self):
        for key in ('index.html','inmuebles/other-draft/index.html'):
            with self.subTest(path=key):
                self.after[key]=b'unapproved'
                expected=self.write()
                result=self.call(expected)
                self.assertEqual(result.returncode,1)
                self.assertFalse(self.stage.exists())
                if key=='index.html': self.after[key]=b'live home'
                else: del self.after[key]

    def test_private_manifest_fields_and_traversal_are_refused(self):
        self.write()
        for document in (dict(self.document,evidence='private office notes'),
                         dict(self.document,site=dict(self.document['site'],**{'../escape':'b'*64}))):
            blob=json.dumps(document).encode();(self.payload/'payload.json').write_bytes(blob)
            result=self.call(hashlib.sha256(blob).hexdigest())
            self.assertEqual(result.returncode,1)
            self.assertFalse(self.stage.exists())


if __name__=='__main__':
    unittest.main()


class WorkflowSafetyTest(unittest.TestCase):
    def test_manual_bound_transaction_has_no_source_build_or_automatic_trigger(self):
        source=(Path(__file__).resolve().parents[2]/'.github/workflows/deploy-ionos.yml').read_text()
        self.assertIn('workflow_dispatch:',source)
        self.assertNotRegex(source,r'(?m)^  (push|schedule|pull_request|workflow_run):')
        self.assertIn("refs/heads/automation/sheet-production",source)
        self.assertIn('ref: ${{ github.sha }}',source)
        self.assertIn('persist-credentials: false',source)
        self.assertIn('contents: read',source)
        self.assertIn('group: ionos-production',source)
        self.assertIn('cancel-in-progress: false',source)
        self.assertIn('validate:false|deploy:true|reconcile:true|recover:true',source)
        self.assertIn('--expected-payload "$AP_ARTIFACT_SHA"',source)
        self.assertIn('--expected-claim "$AP_CLAIM_SHA"',source)
        self.assertNotIn('bun run',source)
        self.assertLess(source.index('Validate exact launch binding without credentials'),source.index('secrets.IONOS_SFTP_PASSWORD'))
        self.assertIn('path: ${{ runner.temp }}/ap-worker-result.json',source)
        self.assertNotIn('path: .ap-release',source)
        self.assertNotRegex(source,r'run:.*\$\{\{ inputs\.')
