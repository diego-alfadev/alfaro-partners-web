"""Withdrawal and recovery use the existing lease and synthetic SFTP only."""
import contextlib
import io
import json
import contextlib
import io
from pathlib import Path
import sys
import time
import unittest
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'ap-ops'))
from test_sftp_session import FakeSFTP, OWNER
import test_withdrawal_payload as fixtures
import transaction as tx
from withdrawal_payload import owned_directories


class WithdrawalTransactionTest(unittest.TestCase):
    def setUp(self):
        self.fixture = fixtures.WithdrawalPayloadTest()
        self.fixture.setUp()
        self.addCleanup(self.fixture.doCleanups)
        self.expected = self.fixture.write()
        now = int(time.time())
        self.claim = {'schema': 'ap-production-claim/1', 'attempt': OWNER['attempt'],
                      'review': 'a' * 64, 'payload': self.expected,
                      'control_commit': OWNER['commit'], 'origin': tx.PUBLIC_ORIGIN,
                      'issued_at': now - 10, 'expires_at': now + 600}
        self.claim_path = self.fixture.root / 'claim.json'
        self.claim_path.write_bytes(tx.canonical_bytes(self.claim))
        self.claim_sha = tx.sha(self.claim_path.read_bytes())
        self.bundle = tx.load(self.fixture.payload, self.expected, self.claim_path,
                              self.claim_sha, OWNER['attempt'], OWNER['commit'])
        self.reset_remote()

    def reset_remote(self):
        self.s = FakeSFTP()
        self.s.files = {'/web/' + n: b for n, b in self.fixture.before.items()}
        for name in self.fixture.before:
            parts = name.split('/')
            self.s.dirs.update('/web/' + '/'.join(parts[:i]) for i in range(1, len(parts)))

    def http(self, name):
        if name.startswith('.ap-ops/'):
            return 403, b''
        path = '/web/' + name
        if path in self.s.files:
            return 200, self.s.files[path]
        directory = path.rstrip('/')
        if directory in self.s.dirs:
            if not name.endswith('/'):
                return 301, b'directory slash redirect'
            index = directory + '/index.html'
            return (200, self.s.files[index]) if index in self.s.files else (403, b'no index')
        return 404, b''

    def run_tx(self, operation='deploy', http=None):
        return tx.execute(self.bundle, self.s, '/web', OWNER, operation, http or self.http)

    def public(self):
        return {n: b for n, b in self.s.files.items() if not n.startswith('/web/.ap-ops/')}

    def test_verified_withdrawal_removes_alias_directories_and_reconciles_same_attempt(self):
        result = self.run_tx()
        self.assertEqual(result['schema'], 'ap-prod-withdrawal-worker/1')
        self.assertEqual(result['status'], 'withdrawn')
        self.assertTrue(result['verified'])
        self.assertFalse(result['publication'])
        self.assertEqual(result['deleted'], self.fixture.document['deleted'])
        self.assertEqual(self.public(), {'/web/' + n: b for n, b in self.fixture.after.items()})
        for alias in ('inmuebles/test-home', 'inmuebles/test-home/',
                      'inmuebles/test-home/reportaje/guiada', 'inmuebles/test-home/reportaje/guiada/'):
            self.assertEqual(self.http(alias)[0], 404)
        self.assertEqual(self.run_tx('reconcile'), result)
        self.assertIn('/web/inmuebles', self.s.dirs)
        self.assertNotIn('/web/.ap-ops/lock', self.s.dirs)

    def test_pre_record_staging_failure_cleans_owned_bytes_and_retries(self):
        stage = '/web/.ap-ops/withdrawal-' + OWNER['attempt']
        original = tx.write
        def failed(sftp, path, blob):
            original(sftp, path, blob)
            if path == stage + '/b-1':
                raise OSError('lost backup write acknowledgement')
        before = self.public()
        with patch.object(tx, 'write', failed), self.assertRaises(OSError):
            self.run_tx()
        self.assertEqual(self.public(), before)
        self.assertNotIn(stage, self.s.dirs)
        self.assertFalse(any(p.startswith(stage + '/') for p in self.s.files))
        self.assertNotIn('/web/.ap-ops/lock', self.s.dirs)
        self.assertEqual(self.run_tx()['status'], 'withdrawn')

    def test_foreign_or_partial_staging_bytes_retain_owner_on_failure(self):
        stage = '/web/.ap-ops/withdrawal-' + OWNER['attempt']
        original = tx.write
        for foreign in (True, False):
            with self.subTest(foreign=foreign):
                self.reset_remote()
                def failed(sftp, path, blob):
                    original(sftp, path, blob)
                    if path == stage + '/b-1':
                        self.s.files[stage + '/foreign' if foreign else path] = b'unknown'
                        raise OSError('uncertain staging')
                before = self.public()
                with patch.object(tx, 'write', failed), self.assertRaises((OSError, ValueError)):
                    self.run_tx()
                self.assertEqual(self.public(), before)
                self.assertIn(stage, self.s.dirs)
                self.assertIn('/web/.ap-ops/lock', self.s.dirs)
                self.assertIn(b'unknown', self.s.files.values())

    def test_uncertain_staging_mkdir_retains_owner_and_never_deletes(self):
        stage = '/web/.ap-ops/withdrawal-' + OWNER['attempt']
        mkdir = self.s.mkdir
        def failed(path):
            mkdir(path)
            if path == stage:
                raise OSError('lost mkdir acknowledgement')
        before = self.public()
        self.s.mkdir = failed
        with self.assertRaises((OSError, ValueError)):
            self.run_tx()
        self.assertEqual(self.public(), before)
        self.assertIn(stage, self.s.dirs)
        self.assertIn('/web/.ap-ops/lock', self.s.dirs)
        self.assertEqual(json.loads(self.s.files['/web/.ap-ops/lock/owner.json']), OWNER)

    def test_reference_removal_precedes_all_file_deletions(self):
        original = self.s.remove
        seen = []
        def remove(path):
            if not path.startswith('/web/.ap-ops/'):
                self.assertEqual(self.s.files['/web/inmuebles/index.html'],
                                 self.fixture.after['inmuebles/index.html'])
                self.assertEqual(self.s.files['/web/sitemap-properties.xml'],
                                 self.fixture.after['sitemap-properties.xml'])
                seen.append(path)
            return original(path)
        self.s.remove = remove
        self.run_tx()
        self.assertEqual(len(seen), len(self.fixture.deleted))

    def test_lost_acknowledgements_before_and_after_each_public_mutation_recover(self):
        for when in ('before', 'after'):
            changes = sum(self.fixture.after[n] != self.fixture.before[n] for n in self.fixture.after)
            mutations = changes + len(self.fixture.deleted) + len(owned_directories(self.bundle['document']))
            for stop in range(1, mutations + 1):
                with self.subTest(when=when, stop=stop):
                    self.reset_remote()
                    originals = {n: getattr(self.s, n) for n in ('posix_rename', 'remove', 'rmdir')}
                    count = [0]
                    def wrapper(method):
                        original = originals[method]
                        def call(*args):
                            target = args[-1]
                            public = not target.startswith('/web/.ap-ops/')
                            if public:
                                count[0] += 1
                                if count[0] == stop and when == 'before':
                                    raise KeyboardInterrupt()
                            result = original(*args)
                            if public and count[0] == stop and when == 'after':
                                raise KeyboardInterrupt()
                            return result
                        return call
                    for method in originals:
                        setattr(self.s, method, wrapper(method))
                    with self.assertRaises(KeyboardInterrupt):
                        self.run_tx()
                    for method, original in originals.items():
                        setattr(self.s, method, original)
                    result = self.run_tx('recover')
                    self.assertEqual(result['status'], 'rolled_back')
                    self.assertTrue(result['verified'])
                    self.assertEqual(self.public(), {'/web/' + n: b for n, b in self.fixture.before.items()})
                    self.assertNotIn('/web/.ap-ops/lock', self.s.dirs)

    def test_foreign_content_prevents_directory_cleanup_without_deleting_it(self):
        name = '/web/inmuebles/test-home/foreign.txt'
        self.s.files[name] = b'foreign'
        result = self.run_tx()
        self.assertEqual(result['status'], 'rolled_back')
        self.assertEqual(self.s.files[name], b'foreign')
        for path, blob in self.fixture.before.items():
            self.assertEqual(self.s.files['/web/' + path], blob)

    def test_recovery_foreign_collision_retains_owner_and_all_remaining_bytes(self):
        original = self.s.remove
        def killed(path):
            original(path)
            if path.startswith('/web/inmuebles/test-home/'):
                raise KeyboardInterrupt()
        self.s.remove = killed
        with self.assertRaises(KeyboardInterrupt):
            self.run_tx()
        self.s.remove = original
        missing = next('/web/' + n for n in self.fixture.deleted if '/web/' + n not in self.s.files)
        self.s.files[missing] = b'foreign collision'
        before = dict(self.s.files)
        with self.assertRaises(ValueError):
            self.run_tx('recover')
        self.assertEqual(self.s.files, before)
        self.assertIn('/web/.ap-ops/lock', self.s.dirs)

    def test_redirect_soft404_and_upstream_failure_never_verify_withdrawal(self):
        for status in (200, 301, 403, 500):
            with self.subTest(status=status):
                self.reset_remote()
                def http(name):
                    if name == 'inmuebles/test-home/' and '/web/inmuebles/test-home/index.html' not in self.s.files:
                        return status, b'not actually absent'
                    return self.http(name)
                result = self.run_tx(http=http)
                self.assertEqual(result['status'], 'rolled_back')
                self.assertFalse(result['publication'])
                self.assertEqual(self.public(), {'/web/' + n: b for n, b in self.fixture.before.items()})

    def test_race_under_lease_is_rejected_before_staging_or_public_writes(self):
        acquire = tx.Lease.acquire
        for name in ('index.html', 'inmuebles/test-home/index.html'):
            with self.subTest(name=name):
                self.reset_remote()
                def raced(lease):
                    acquire(lease)
                    self.s.files['/web/' + name] = b'foreign race'
                with patch.object(tx.Lease, 'acquire', raced), self.assertRaises(ValueError):
                    self.run_tx()
                self.assertFalse(any('/withdrawal-' in p for p in self.s.dirs))
                self.assertFalse([p for p in self.s.replacements if not p.startswith('/web/.ap-ops/')])
                self.assertEqual(self.s.files['/web/' + name], b'foreign race')

    def test_forged_recovery_directory_is_rejected_without_mutation(self):
        original = self.s.remove
        def killed(path):
            original(path)
            if not path.startswith('/web/.ap-ops/'):
                raise KeyboardInterrupt()
        self.s.remove = killed
        with self.assertRaises(KeyboardInterrupt):
            self.run_tx()
        self.s.remove = original
        name = '/web/.ap-ops/transaction-' + OWNER['attempt'] + '.json'
        record = json.loads(self.s.files[name])
        record['removed_dirs'] = ['inmuebles']
        self.s.files[name] = tx.canonical_bytes(record)
        before = dict(self.s.files)
        with self.assertRaises(ValueError):
            self.run_tx('recover')
        self.assertEqual(self.s.files, before)

    def test_rolled_back_record_reconciles_after_lost_completion_ack(self):
        original = self.s.remove
        def killed(path):
            original(path)
            if not path.startswith('/web/.ap-ops/'):
                raise KeyboardInterrupt()
        self.s.remove = killed
        with self.assertRaises(KeyboardInterrupt):
            self.run_tx()
        self.s.remove = original
        with patch.object(tx.Lease, 'complete', side_effect=KeyboardInterrupt):
            with self.assertRaises(KeyboardInterrupt):
                self.run_tx('recover')
        result = self.run_tx('reconcile')
        self.assertEqual(result['status'], 'rolled_back')
        self.assertEqual(self.public(), {'/web/' + n: b for n, b in self.fixture.before.items()})
        self.assertNotIn('/web/.ap-ops/lock', self.s.dirs)

    def test_lost_mkdir_ack_preserves_ambiguous_recovery_and_owner(self):
        original = self.s.rmdir
        def killed(path):
            original(path)
            if not path.startswith('/web/.ap-ops/'):
                raise KeyboardInterrupt()
        self.s.rmdir = killed
        with self.assertRaises(KeyboardInterrupt):
            self.run_tx()
        self.s.rmdir = original
        mkdir = self.s.mkdir
        def interrupted(path):
            mkdir(path)
            if not path.startswith('/web/.ap-ops/'):
                raise KeyboardInterrupt()
        self.s.mkdir = interrupted
        with self.assertRaises(KeyboardInterrupt):
            self.run_tx('recover')
        self.s.mkdir = mkdir
        before = dict(self.s.files)
        with self.assertRaises(ValueError):
            self.run_tx('recover')
        self.assertEqual(self.s.files, before)
        self.assertIn('/web/.ap-ops/lock', self.s.dirs)

    def test_cli_counts_only_verified_versioned_withdrawal_as_success(self):
        original = tx.execute
        def execute(bundle, sftp, root, owner, operation):
            return original(bundle, sftp, root, owner, operation, self.http)
        args = ['--root', str(self.fixture.payload), '--expected-payload', self.expected,
                '--claim', str(self.claim_path), '--expected-claim', self.claim_sha,
                '--attempt', OWNER['attempt'], '--control-commit', OWNER['commit'],
                '--commit', OWNER['commit'], '--run-id', OWNER['run_id'], '--apply']
        session = contextlib.nullcontext(SimpleNamespace(sftp=self.s, root='/web'))
        with patch.object(tx, 'open_sftp', return_value=session), patch.object(tx, 'execute', execute), contextlib.redirect_stdout(io.StringIO()) as stdout:
            code = tx.main(args)
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(stdout.getvalue())['status'], 'withdrawn')
        for result in ({'schema': 'ap-prod-worker/1', 'status': 'withdrawn', 'verified': True, 'publication': False},
                       {'schema': 'ap-prod-withdrawal-worker/1', 'status': 'withdrawn', 'verified': False, 'publication': False},
                       {'schema': 'ap-prod-withdrawal-worker/1', 'status': 'rolled_back', 'verified': True, 'publication': False}):
            session = contextlib.nullcontext(SimpleNamespace(sftp=self.s, root='/web'))
            with patch.object(tx, 'open_sftp', return_value=session), patch.object(tx, 'execute', return_value=result), contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(tx.main(args), 1)

    def test_offline_plan_never_authenticates_and_has_explicit_schema(self):
        with patch.object(tx, 'open_sftp', side_effect=AssertionError('AUTH')) as opened:
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                code = tx.main(['--root', str(self.fixture.payload),
                                '--expected-payload', self.expected,
                                '--claim', str(self.claim_path), '--expected-claim', self.claim_sha,
                                '--attempt', OWNER['attempt'], '--control-commit', OWNER['commit']])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(output.getvalue())['schema'], 'ap-prod-withdrawal-worker/1')
        opened.assert_not_called()
