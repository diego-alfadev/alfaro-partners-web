import base64
import hashlib
import unittest
from unittest.mock import patch

import host_policy


class Key:
    def get_name(self):return 'ssh-ed25519'
    def asbytes(self):return b'synthetic public SSH key'


class HostPolicyTest(unittest.TestCase):
    def test_computes_public_fingerprint_and_accepts_only_explicit_official_pin(self):
        value='SHA256:'+base64.b64encode(hashlib.sha256(Key().asbytes()).digest()).decode().rstrip('=')
        self.assertEqual(host_policy.fingerprint(Key()),value)
        with self.assertRaises(ValueError):host_policy.verify_host_key(Key())
        with patch.dict(host_policy.TRUSTED_FINGERPRINTS,{'ssh-ed25519':value}):
            self.assertEqual(host_policy.verify_host_key(Key()),value)

    def test_unknown_algorithms_cannot_reuse_a_known_pin(self):
        key=Key();key.get_name=lambda:'unknown-key'
        with self.assertRaises(ValueError):host_policy.verify_host_key(key)
