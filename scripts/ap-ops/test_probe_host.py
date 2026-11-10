"""Host identity checks never authenticate or publish."""
import contextlib
import io
import json
import unittest
from unittest.mock import Mock, patch

import probe_host


class PublicKey:
    def get_name(self):
        return 'ssh-ed25519'

    def asbytes(self):
        return b'synthetic-public-key'


class AllowedEnvironment(dict):
    def get(self, key, default=None):
        if key not in ('IONOS_SFTP_SERVER', 'IONOS_SFTP_PORT'):
            raise AssertionError('Unexpected environment read')
        return super().get(key, default)


class ProbeHostTest(unittest.TestCase):
    def setUp(self):
        self.env = AllowedEnvironment(IONOS_SFTP_SERVER='host.example.test', IONOS_SFTP_PORT='22')
        self.socket = Mock()
        self.transport = Mock()
        self.transport.get_remote_server_key.return_value = PublicKey()
        self.socket_factory = Mock(return_value=self.socket)
        self.transport_factory = Mock(return_value=self.transport)

    def call(self, apply=True):
        return probe_host.probe(self.env, apply=apply, socket_factory=self.socket_factory,
                                transport_factory=self.transport_factory)

    def test_default_plan_has_no_network_or_authentication(self):
        result = self.call(apply=False)
        self.assertEqual(result['status'], 'planned')
        self.assertEqual(result['schema'], 'ap-ionos-hostkey-probe/1')
        self.assertFalse(result['authenticated'])
        self.assertFalse(result['publication'])
        self.socket_factory.assert_not_called()
        self.transport_factory.assert_not_called()

    def test_trusted_key_compared_before_any_auth_and_bounded_cleanup(self):
        with patch.object(probe_host.host_policy, 'verify_host_key', return_value='SHA256:trusted') as verify:
            result = self.call()
        verify.assert_called_once_with(self.transport.get_remote_server_key.return_value)
        self.assertEqual(result['status'], 'verified')
        self.assertTrue(result['pin_match'])
        self.assertEqual(result['algorithm'], 'ssh-ed25519')
        self.assertEqual(result['fingerprint'], 'SHA256:trusted')
        self.socket_factory.assert_called_once_with(('host.example.test', 22), timeout=10)
        self.transport.start_client.assert_called_once_with(timeout=10)
        self.assertEqual(self.transport.banner_timeout, 10)
        self.assertFalse(any('auth' in call[0] or 'sftp' in call[0] or 'session' in call[0]
                             for call in self.transport.mock_calls))
        self.transport.close.assert_called_once()
        self.socket.close.assert_called_once()
        self.assertNotIn('host.example.test', json.dumps(result))

    def test_actual_policy_rejects_unknown_key_with_public_identity_only(self):
        result = self.call()
        self.assertEqual(result['status'], 'not_trusted')
        self.assertFalse(result['pin_match'])
        self.assertEqual(result['algorithm'], 'ssh-ed25519')
        self.assertTrue(result['fingerprint'].startswith('SHA256:'))
        self.assertFalse(result['authenticated'])
        self.transport.close.assert_called_once()
        self.socket.close.assert_called_once()

    def test_invalid_or_missing_endpoint_refuses_before_network(self):
        for host, port in ((None, '22'), ('good.test', None), ('-oProxyCommand=x', '22'),
                           ('user@host.test', '22'), ('host.test/path', '22'),
                           ('host.test\nSECRET', '22'), ('host.test', '0'),
                           ('host.test', '65536'), ('host.test', '22;echo SECRET'),
                           ('a' * 64 + '.test', '22')):
            with self.subTest(host=host, port=port):
                self.env = AllowedEnvironment(IONOS_SFTP_SERVER=host, IONOS_SFTP_PORT=port)
                result = self.call()
                self.assertEqual(result['status'], 'refused')
                self.assertNotIn('SECRET', json.dumps(result))
        self.socket_factory.assert_not_called()

    def test_timeout_transport_creation_and_key_failures_close_resources(self):
        for phase in ('create_transport', 'negotiate', 'get_key'):
            with self.subTest(phase=phase):
                self.setUp()
                if phase == 'create_transport':
                    self.transport_factory.side_effect = RuntimeError('SECRET_ENDPOINT_FAILURE')
                elif phase == 'negotiate':
                    self.transport.start_client.side_effect = TimeoutError('SECRET_ENDPOINT_FAILURE')
                else:
                    self.transport.get_remote_server_key.side_effect = RuntimeError('SECRET_ENDPOINT_FAILURE')
                result = self.call()
                self.assertEqual(result['status'], 'refused')
                self.assertNotIn('SECRET', json.dumps(result))
                self.socket.close.assert_called_once()
                if phase != 'create_transport':
                    self.transport.close.assert_called_once()

    def test_socket_failure_and_cleanup_failure_stay_safe(self):
        self.socket_factory.side_effect = TimeoutError('PRIVATE_HOST')
        result = self.call()
        self.assertEqual(result['status'], 'refused')
        self.assertNotIn('PRIVATE_HOST', json.dumps(result))
        self.setUp()
        self.transport.close.side_effect = RuntimeError('CLOSE_SECRET')
        self.call()
        self.socket.close.assert_called_once()

    def test_cli_default_and_apply_failure_exit_codes_and_safe_output(self):
        for args, expected in (([], 0), (['--apply'], 1)):
            with self.subTest(args=args), patch.dict(probe_host.os.environ, self.env, clear=True), \
                 patch.object(probe_host.socket, 'create_connection', self.socket_factory), \
                 patch.object(probe_host, 'default_transport', self.transport_factory):
                stream, error = io.StringIO(), io.StringIO()
                with contextlib.redirect_stdout(stream), contextlib.redirect_stderr(error):
                    code = probe_host.main(args)
                self.assertEqual(code, expected)
                result = json.loads(stream.getvalue())
                self.assertFalse(result['authenticated'])
                self.assertNotIn('host.example.test', stream.getvalue() + error.getvalue())
                self.assertEqual(error.getvalue(), '')

    def test_cli_help_explains_negotiation_only(self):
        stream = io.StringIO()
        with contextlib.redirect_stdout(stream), self.assertRaises(SystemExit) as stopped:
            probe_host.main(['--help'])
        self.assertEqual(stopped.exception.code, 0)
        self.assertIn('--apply', stream.getvalue())
        self.assertIn('authentication', stream.getvalue())


if __name__ == '__main__':
    unittest.main()
