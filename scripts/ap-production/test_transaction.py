"""Offline transaction proofs with synthetic public payload and in-memory SFTP."""
import contextlib
import io
import json
from pathlib import Path
import sys
import time
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'ap-ops'))
from test_sftp_session import FakeSFTP, OWNER
import test_payload as fixtures
import transaction as tx


class TransactionTest(unittest.TestCase):
    def setUp(self):
        self.fixture=fixtures.PayloadTest();self.fixture.setUp();self.addCleanup(self.fixture.doCleanups)
        self.fixture.before['sitemap-index.xml']=b'old sitemap'
        self.expected=self.fixture.write(); self.root=self.fixture.payload
        now=int(time.time())
        self.claim={'schema':'ap-production-claim/1','attempt':OWNER['attempt'],'review':'a'*64,
                    'payload':self.expected,'control_commit':OWNER['commit'],'origin':tx.PUBLIC_ORIGIN,
                    'issued_at':now-10,'expires_at':now+600}
        self.claim_path=self.fixture.root/'claim.json'
        self.claim_path.write_bytes(tx.canonical_bytes(self.claim))
        self.claim_sha=tx.sha(self.claim_path.read_bytes())
        self.s=FakeSFTP();self.s.files={'/web/'+n:b for n,b in self.fixture.before.items()}
        self.http=lambda n:(403,b'') if n.startswith('.ap-ops/') else ((200,self.s.files['/web/'+n]) if '/web/'+n in self.s.files else (404,b''))
        self.bundle=tx.load(self.root,self.expected,self.claim_path,self.claim_sha,OWNER['attempt'],OWNER['commit'])
    def run_tx(self,operation='deploy'):
        return tx.execute(self.bundle,self.s,'/web',OWNER,operation,self.http)
    def test_success_receipt_requires_actual_proof_and_reconcile_rechecks(self):
        result=self.run_tx();self.assertTrue(result['verified']);self.assertTrue(result['publication'])
        self.assertEqual(result['files'],self.fixture.document['site'])
        self.assertEqual(self.run_tx('reconcile'),result)
        self.s.files['/web/index.html']=b'third party'
        with self.assertRaises(ValueError):self.run_tx('reconcile')
    def test_baseline_mismatch_and_unknown_lock_never_replace(self):
        self.s.files['/web/index.html']=b'changed'
        with self.assertRaises(ValueError):self.run_tx()
        self.assertFalse(self.s.replacements)
        self.s.files['/web/index.html']=self.fixture.before['index.html']
        self.s.dirs.update({'/web/.ap-ops','/web/.ap-ops/lock'})
        with self.assertRaises(Exception):self.run_tx()
        self.assertFalse(self.s.replacements)
    def test_bad_or_expired_claim_before_auth(self):
        for sha in ('0'*64,self.claim_sha):
            if sha==self.claim_sha:
                self.claim['expires_at']=1;self.claim_path.write_bytes(tx.canonical_bytes(self.claim));sha=tx.sha(self.claim_path.read_bytes())
            with patch.object(tx,'open_sftp',side_effect=AssertionError('AUTH CALLED')) as opened,contextlib.redirect_stdout(io.StringIO()):
                code=tx.main(['--root',str(self.root),'--expected-payload',self.expected,'--claim',str(self.claim_path),'--expected-claim',sha,'--attempt',OWNER['attempt'],'--control-commit',OWNER['commit'],'--commit',OWNER['commit'],'--run-id',OWNER['run_id'],'--apply'])
            self.assertEqual(code,1);opened.assert_not_called()
    def test_uncertain_replace_recovery_restores_and_removes_added_paths(self):
        original=self.s.posix_rename
        def kill(source,target):
            original(source,target)
            if not target.startswith('/web/.ap-ops/'):raise KeyboardInterrupt()
        self.s.posix_rename=kill
        with self.assertRaises(KeyboardInterrupt):self.run_tx()
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)
        self.s.posix_rename=original
        result=self.run_tx('recover');self.assertEqual(result['status'],'rolled_back');self.assertFalse(result['publication'])
        live={n:b for n,b in self.s.files.items() if not n.startswith('/web/.ap-ops/')}
        self.assertEqual(live,{'/web/'+n:b for n,b in self.fixture.before.items()})
    def test_thirdparty_collision_is_never_overwritten_by_recovery(self):
        original=self.s.posix_rename
        def kill(source,target):
            original(source,target)
            if not target.startswith('/web/.ap-ops/'):raise KeyboardInterrupt()
        self.s.posix_rename=kill
        with self.assertRaises(KeyboardInterrupt):self.run_tx()
        self.s.posix_rename=original;self.s.files['/web/inmuebles/media/ap-test/photo.webp']=b'foreign'
        with self.assertRaises(ValueError):self.run_tx('recover')
        self.assertEqual(self.s.files['/web/inmuebles/media/ap-test/photo.webp'],b'foreign')
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)
    def test_http_failure_recovers_without_publication_receipt(self):
        def http(n):
            if n=='sitemap-properties.xml' and '/web/'+n in self.s.files:return 200,b'incorrect'
            return self.http(n)
        result=tx.execute(self.bundle,self.s,'/web',OWNER,'deploy',http)
        self.assertEqual(result['status'],'rolled_back');self.assertFalse(result['publication'])
    def test_plan_offline(self):
        with patch.object(tx,'open_sftp',side_effect=AssertionError) as opened,contextlib.redirect_stdout(io.StringIO()):
            code=tx.main(['--root',str(self.root),'--expected-payload',self.expected,'--claim',str(self.claim_path),'--expected-claim',self.claim_sha,'--attempt',OWNER['attempt'],'--control-commit',OWNER['commit'],'--commit',OWNER['commit']])
        self.assertEqual(code,0);opened.assert_not_called()

    def test_caught_partial_failure_rolls_back_and_cannot_emit_true_receipt(self):
        original=self.s.posix_rename
        once=[True]
        def uncertain(source,target):
            original(source,target)
            if not target.startswith('/web/.ap-ops/') and once[0]:
                once[0]=False
                raise TimeoutError('PRIVATE_PROVIDER_DATA')
        self.s.posix_rename=uncertain
        result=self.run_tx()
        self.assertEqual(result['status'],'rolled_back')
        self.assertFalse(result['publication'])
        self.assertNotIn('PRIVATE_PROVIDER_DATA',json.dumps(result))
        for name,data in self.fixture.before.items():
            self.assertEqual(self.s.files['/web/'+name],data)

    def test_expiry_between_staging_and_write_releases_only_no_write_lease(self):
        expires=self.bundle['claim']['expires_at']
        with patch.object(tx.time,'time',side_effect=[expires-1,expires+1]):
            with self.assertRaises(ValueError):self.run_tx()
        self.assertNotIn('/web/.ap-ops/lock',self.s.dirs)
        self.assertEqual({n:b for n,b in self.s.files.items() if not n.startswith('/web/.ap-ops/')},
                         {'/web/'+n:b for n,b in self.fixture.before.items()})

    def test_unknown_partial_state_never_auto_releases_or_steals_owner(self):
        original=self.s.posix_rename
        def killed(source,target):
            original(source,target)
            if not target.startswith('/web/.ap-ops/'):raise KeyboardInterrupt()
        self.s.posix_rename=killed
        with self.assertRaises(KeyboardInterrupt):self.run_tx()
        foreign=dict(OWNER,run_id='999')
        with self.assertRaises(ValueError):tx.execute(self.bundle,self.s,'/web',foreign,'recover',self.http)
        self.assertIn('/web/.ap-ops/lock',self.s.dirs)

    def test_late_failure_restores_overwritten_sitemap_and_new_files(self):
        original=self.s.posix_rename
        def killed(source,target):
            original(source,target)
            if target=='/web/sitemap-index.xml':raise KeyboardInterrupt()
        self.s.posix_rename=killed
        with self.assertRaises(KeyboardInterrupt):self.run_tx()
        self.s.posix_rename=original
        result=self.run_tx('recover')
        self.assertFalse(result['publication'])
        self.assertEqual(self.s.files['/web/sitemap-index.xml'],b'old sitemap')
        self.assertFalse(any(n.startswith('/web/inmuebles/') for n in self.s.files))

    def test_unsupported_rename_releases_only_proven_no_write_lock(self):
        self.s.support_rename=False
        with self.assertRaises(OSError):self.run_tx()
        self.assertNotIn('/web/.ap-ops/lock',self.s.dirs)
        self.assertEqual(self.s.files['/web/index.html'],b'live home')
