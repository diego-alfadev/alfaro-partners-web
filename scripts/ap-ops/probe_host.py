"""Plan by default; --apply negotiates SSH host identity only, without authentication."""
import argparse
import json
import logging
import os
import re
import socket

import host_policy


TIMEOUT = 10
LOG_CHANNEL = 'ap.ionos_hostkey_probe'


def endpoint(environ):
    host = environ.get('IONOS_SFTP_SERVER')
    port = environ.get('IONOS_SFTP_PORT')
    if (not isinstance(host, str) or not 1 <= len(host) <= 253
            or any(not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?', label)
                   for label in host.split('.'))
            or not isinstance(port, str) or not re.fullmatch(r'[0-9]{1,5}', port)
            or not 1 <= int(port) <= 65535):
        raise ValueError('Host probe configuration refused')
    return host, int(port)


def default_transport(connection):
    # Import only after explicit network authorization; no SSHClient auto-auth.
    from paramiko import Transport
    return Transport(connection)


def probe(environ=None, *, apply=False, socket_factory=None, transport_factory=None):
    """Return public host identity only. Factories allow completely offline tests."""
    result = {'schema': 'ap-ionos-hostkey-probe/1', 'status': 'refused',
              'pin_match': False, 'authenticated': False, 'publication': False,
              'remote_writes': False, 'official_source': host_policy.OFFICIAL_SOURCE,
              'pinned_on': host_policy.PINNED_ON}
    connection, transport = None, None
    logger = logging.getLogger(LOG_CHANNEL)
    previous_logging = logger.disabled
    try:
        host, port = endpoint(os.environ if environ is None else environ)
        if not apply:
            return dict(result, status='planned')
        connection = (socket_factory or socket.create_connection)((host, port), timeout=TIMEOUT)
        connection.settimeout(TIMEOUT)
        transport = (transport_factory or default_transport)(connection)
        # Paramiko's transport logs can contain exception text. This probe emits
        # a bounded public result instead; no raw network exception is logged.
        logger.disabled = True
        transport.set_log_channel(LOG_CHANNEL)
        transport.banner_timeout = TIMEOUT
        transport.start_client(timeout=TIMEOUT)
        key = transport.get_remote_server_key()
        algorithm = key.get_name()
        if not isinstance(algorithm, str) or not re.fullmatch(r'[A-Za-z0-9@._+-]{1,80}', algorithm):
            raise ValueError('Invalid public key algorithm')
        result.update(algorithm=algorithm, fingerprint=host_policy.fingerprint(key))
        try:
            verified = host_policy.verify_host_key(key)
        except ValueError:
            return dict(result, status='not_trusted')
        return dict(result, status='verified', pin_match=True, fingerprint=verified)
    except Exception:
        # Endpoint, credential environment and raw exception values never escape.
        return result
    finally:
        for resource in (transport, connection):
            if resource is not None:
                try:
                    resource.close()
                except Exception:
                    pass
        logger.disabled = previous_logging


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true',
                        help='Connect only to compare the public server key; never authenticate or upload')
    args = parser.parse_args(argv)
    result = probe(apply=args.apply)
    print(json.dumps(result, sort_keys=True))
    return 0 if result['status'] in ('planned', 'verified') else 1


if __name__ == '__main__':
    raise SystemExit(main())
