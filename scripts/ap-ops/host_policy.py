"""Pinned IONOS webhosting identities; never learn trust from a key scan."""
import base64
import hashlib
import hmac

OFFICIAL_SOURCE = 'https://www.ionos.de/hilfe/hosting/ssh-zugaenge-einrichten-und-verwalten/uebersicht-der-ssh-fingerabdruecke-im-ionos-webhosting/'
PINNED_ON = '2026-11-10'
TRUSTED_FINGERPRINTS = {
    'ssh-ed25519':'SHA256:1gx2w8Rtv3wCgi7Jh8myf/KVd72cRQbow03UP8P095Q',
    'ssh-rsa':'SHA256:psLDE8kfhoS9GWrc/GTrdlPvyKPcWcGZv2JxOCvwF3w',
    'ecdsa':'SHA256:J4oM+B2g7zZWAI3DolXR1e4vdIMrGO301kEN14/slsQ',
}


def fingerprint(key):
    return 'SHA256:'+base64.b64encode(hashlib.sha256(key.asbytes()).digest()).decode().rstrip('=')


def verify_host_key(key):
    name=key.get_name()
    kind='ecdsa' if name.startswith('ecdsa-sha2-') else name
    actual=fingerprint(key)
    if kind not in TRUSTED_FINGERPRINTS or not hmac.compare_digest(actual,TRUSTED_FINGERPRINTS[kind]):
        raise ValueError('IONOS host identity not verified')
    return actual
