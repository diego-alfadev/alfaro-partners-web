"""Verify exact-attempt diagnosis without any filesystem mutation."""
import errno
from io import BytesIO
import stat
from types import SimpleNamespace
import unittest

from inspect_attempt import inspect_attempt
from sftp_session import canonical_bytes, DENY, MARKER, PROBE
from transaction import sha


OWNER = {'run_id': '43639457270', 'commit': 'a'*40, 'attempt': 'b'*32}
ROOT = '/web'
OPS = ROOT+'/.ap-ops'
RECORD = OPS+'/transaction-'+OWNER['attempt']+'.json'
HOME = b'existing home'
BUNDLE = {'claim': {'attempt': OWNER['attempt'], 'review': 'c'*64},
          'claim_sha': 'd'*64, 'payload': 'e'*64,
          'document': {'site': {'index.html': sha(HOME),
                                 'inmuebles/index.html': sha(b'new')},
                       'rollback': {'index.html': sha(HOME)}}}


class ReadOnlyServer:
    def __init__(self):
        self.files = {ROOT+'/index.html': HOME}
        self.dirs = {'/', ROOT}
        self.reads = []

    def normalize(self, p):
        return p

    def lstat(self, p):
        if p in self.dirs:
            return SimpleNamespace(st_mode=stat.S_IFDIR)
        if p in self.files:
            return SimpleNamespace(st_mode=stat.S_IFREG)
        raise OSError(errno.ENOENT, 'not found')

    def file(self, p, mode):
        if mode != 'rb':
            raise AssertionError('write attempt')
        self.reads.append(p)
        return BytesIO(self.files[p])

    def __getattr__(self, name):
        raise AssertionError('unexpected SFTP operation: '+name)


class InspectTest(unittest.TestCase):
    def test_apache_300_is_not_protection_and_missing_control_is_not_a_lock(self):
        s = ReadOnlyServer()
        before = (dict(s.files), set(s.dirs))
        result = inspect_attempt(BUNDLE,s,ROOT,OWNER,
                                 lambda p: (200, HOME) if p=='index.html' else (300,b''))
        self.assertEqual(result['probe_http'], 300)
        self.assertEqual(result['control'], 'absent')
        self.assertEqual(result['lock'], 'absent')
        self.assertEqual(result['attempt'], 'absent')
        self.assertTrue(result['baseline_matches'])
        self.assertTrue(result['additions_absent'])
        self.assertEqual((s.files,s.dirs), before)

    def test_partial_protection_and_foreign_lock_are_never_read_through(self):
        s = ReadOnlyServer()
        s.dirs |= {OPS, OPS+'/lock'}
        s.files.update({OPS+'/.htaccess': DENY, OPS+'/probe.txt': PROBE,
                        OPS+'/lock/owner.json': canonical_bytes(dict(OWNER,run_id='999')),
                        OPS+'/lock/journal.json': b'private foreign data'})
        result = inspect_attempt(BUNDLE,s,ROOT,OWNER,
                                 lambda p: (200, HOME) if p=='index.html' else (300,b''))
        self.assertEqual(result['control'], 'incomplete')
        self.assertEqual(result['lock'], 'foreign_or_unknown')
        self.assertNotIn(OPS+'/lock/journal.json', s.reads)
        self.assertNotIn('999', repr(result))

    def test_only_exact_attempt_record_and_lock_return_allowlisted_state(self):
        s = ReadOnlyServer()
        s.dirs |= {OPS, OPS+'/lock'}
        record={'schema':'ap-production-transaction/1','origin':'https://alfaropartners.es',
                'owner':OWNER,'payload':BUNDLE['payload'],'claim':BUNDLE['claim_sha'],
                'review':BUNDLE['claim']['review'],'phase':'replacing',
                'baseline':BUNDLE['document']['rollback'],'candidate':BUNDLE['document']['site'],
                'stage':OPS+'/transaction-'+OWNER['attempt'],
                'backups':{'index.html':OPS+'/transaction-'+OWNER['attempt']+'/b-0'},
                'created_dirs':['inmuebles']}
        s.files.update({OPS+'/.htaccess': DENY, OPS+'/probe.txt': PROBE, OPS+'/marker': MARKER,
                        OPS+'/lock/owner.json': canonical_bytes(OWNER),
                        OPS+'/lock/journal.json': canonical_bytes({'owner':OWNER,'public_intent':True,
                            'phase':'replacing','path':'inmuebles/index.html'}),
                        RECORD: canonical_bytes(record)})
        result = inspect_attempt(BUNDLE,s,ROOT,OWNER,
                                 lambda p: (200, HOME) if p=='index.html' else (403,b''))
        self.assertEqual((result['control'],result['lock'],result['attempt']),
                         ('protected','owned_public_intent','replacing'))
        self.assertNotIn(ROOT, repr(result))
        s.files[RECORD]=canonical_bytes(dict(record,payload='f'*64))
        self.assertEqual(inspect_attempt(BUNDLE,s,ROOT,OWNER,
                         lambda p: (200, HOME) if p=='index.html' else (403,b''))['attempt'],'mismatch')

        s.files[RECORD]=canonical_bytes({k:v for k,v in record.items() if k!='backups'})
        s.files[OPS+'/lock/journal.json']=canonical_bytes({'owner':OWNER,'public_intent':False})
        malformed = inspect_attempt(BUNDLE,s,ROOT,OWNER,
                         lambda p: (200, HOME) if p=='index.html' else (403,b''))
        self.assertEqual((malformed['attempt'],malformed['lock']),('mismatch','owned_unknown'))

    def test_baseline_detail_distinguishes_missing_and_changed_without_private_bytes(self):
        from copy import deepcopy
        s = ReadOnlyServer()
        bundle = deepcopy(BUNDLE)
        bundle['document']['rollback'].update({'.nojekyll':sha(b''),'.htaccess':sha(b'expected rules')})
        s.files[ROOT+'/.htaccess'] = b'unexpected private rules'
        result=inspect_attempt(bundle,s,ROOT,OWNER,
                             lambda p:(200, HOME) if p=='index.html' else (300,b''))
        self.assertEqual(result['baseline_detail'], {
            'missing':['.nojekyll'], 'different':['.htaccess'], 'matched':1})
        self.assertFalse(result['baseline_matches'])
        self.assertNotIn('private rules', repr(result))
        self.assertNotIn(ROOT, repr(result))
        self.assertEqual(s.files[ROOT+'/.htaccess'], b'unexpected private rules')
