"""Read-only inspection of the exact failed AP deployment. No file writes."""
import argparse
import json
import os
from pathlib import Path

from transaction import current_hash, inspect_record_dirs, load, unique
from sftp_session import (DENY, MARKER, PROBE, PUBLIC_ORIGIN, canonical_bytes,
                          canonical_root, directory, exists, http_get, open_sftp,
                          owner_bytes, read, require)


PHASES = frozenset(('staged', 'replacing', 'verified', 'recovering', 'rolled_back'))


def inspect_attempt(bundle, sftp, root, owner, http=http_get):
    require(owner['attempt'] == bundle['claim']['attempt'])
    encoded_owner = owner_bytes(owner)
    require(canonical_root(sftp, root) == root)
    require(http('index.html') == (200, read(sftp, root.rstrip('/')+'/index.html')))
    code, _ = http('.ap-ops/probe.txt')
    require(type(code) is int and 100 <= code <= 599)
    result = {'schema': 'ap-prod-inspection/1', 'probe_http': code,
              'control': 'absent', 'lock': 'absent', 'attempt': 'absent',
              'baseline_matches': True, 'additions_absent': True}
    control = root.rstrip('/')+'/.ap-ops'
    if exists(sftp, control) is not None:
        directory(sftp, control)
        protections = {'.htaccess': DENY, 'probe.txt': PROBE, 'marker': MARKER}
        complete = all(exists(sftp, control+'/'+name) is not None
                       and read(sftp, control+'/'+name, 4096) == body
                       for name, body in protections.items())
        result['control'] = ('protected' if code in (403, 404) else 'probe_refused') if complete else 'incomplete'
        lock = control+'/lock'
        if exists(sftp, lock):
            directory(sftp, lock)
            path = lock+'/owner.json'
            result['lock'] = 'foreign_or_unknown'
            if exists(sftp, path) and read(sftp, path, 4096) == encoded_owner:
                result['lock'] = 'owned_unknown'
                journal = lock+'/journal.json'
                if exists(sftp, journal):
                    blob = read(sftp, journal, 8192)
                    state = json.loads(blob, object_pairs_hook=unique)
                    if (isinstance(state, dict) and canonical_bytes(state) == blob
                            and set(state) == {'owner', 'phase', 'path', 'public_intent'}
                            and state['owner'] == owner):
                        if state['phase'] == 'acquired' and state['path'] is None and state['public_intent'] is False:
                            result['lock'] = 'owned_no_public_intent'
                        elif state['public_intent'] is True:
                            phase, path = state['phase'], state['path']
                            if ((phase == 'verified' and path is None)
                                    or (phase in ('creating-directory', 'replacing', 'restoring', 'removing-added')
                                        and isinstance(path, str) and inspect_record_dirs([path]) == [path])):
                                result['lock'] = 'owned_public_intent'
        records = control+'/transaction-'+owner['attempt']+'.json'
        if exists(sftp, records):
            blob = read(sftp, records, 2*1024*1024)
            record = json.loads(blob, object_pairs_hook=unique)
            stage = control+'/transaction-'+owner['attempt']
            before, site = bundle['document']['rollback'], bundle['document']['site']
            prefixes = {n.rsplit('/', i)[0] for n in site for i in range(1, n.count('/')+1)}
            expected = {'schema': 'ap-production-transaction/1', 'origin': PUBLIC_ORIGIN,
                        'owner': owner, 'payload': bundle['payload'], 'claim': bundle['claim_sha'],
                        'review': bundle['claim']['review'], 'baseline': before, 'candidate': site,
                        'stage': stage, 'backups': {n: stage+'/b-'+str(i) for i,n in enumerate(sorted(before))}}
            result['attempt'] = 'mismatch'
            if (isinstance(record, dict) and canonical_bytes(record) == blob
                    and all(record.get(k) == v for k, v in expected.items())
                    and isinstance(record.get('phase'), str) and record['phase'] in PHASES
                    and isinstance(record.get('created_dirs'), list)
                    and set(inspect_record_dirs(record['created_dirs'])) <= prefixes):
                result['attempt'] = record['phase']
    before = bundle['document']['rollback']
    additions = bundle['document']['site'].keys() - before.keys()
    detail = {'missing': [], 'different': [], 'matched': 0}
    for name, expected in sorted(before.items()):
        observed = current_hash(sftp, root, name)
        if observed is None:
            detail['missing'].append(name)
        elif observed != expected:
            detail['different'].append(name)
        else:
            detail['matched'] += 1
    result['baseline_detail'] = detail
    result['baseline_matches'] = not (detail['missing'] or detail['different'])
    result['additions_absent'] = all(current_hash(sftp, root, n) is None for n in additions)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--claim', type=Path, required=True)
    for field in ('expected-payload', 'expected-claim', 'attempt', 'control-commit', 'run-id', 'commit'):
        parser.add_argument('--'+field, required=True)
    args = parser.parse_args()
    phase = 'binding'
    try:
        bundle = load(args.root, args.expected_payload, args.claim, args.expected_claim,
                      args.attempt, args.control_commit, fresh=False)
        owner = {'run_id': args.run_id, 'commit': args.commit, 'attempt': args.attempt}
        owner_bytes(owner)
        phase = 'connection_or_root'
        with open_sftp(os.environ) as session:
            phase = 'inspection'
            result = inspect_attempt(bundle, session.sftp, session.root, owner)
        print(json.dumps(result, sort_keys=True))
        return 0
    except Exception:
        print(json.dumps({'schema': 'ap-prod-inspection/1', 'status': 'refused', 'phase': phase}))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
