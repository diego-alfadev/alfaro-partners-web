"""Recoverable withdrawal under the existing exact-owner shared lease."""
import json

from withdrawal_payload import owned_directories


SCHEMA = 'ap-prod-withdrawal-worker/1'
RECORD = 'ap-production-withdrawal-transaction/1'


def receipt(bundle, owner, *, status='withdrawn'):
    return {'schema': SCHEMA, 'operation': 'withdraw', 'status': status,
            'attempt': owner['attempt'], 'review': bundle['claim']['review'],
            'payload': bundle['payload'], 'claim': bundle['claim_sha'],
            'run_id': owner['run_id'], 'commit': owner['commit'],
            'control_commit': bundle['claim']['control_commit'],
            'origin': bundle['document']['destination'],
            'predecessor': bundle['document']['predecessor'],
            'properties': bundle['document']['properties'],
            'files': bundle['document']['site'] if status == 'withdrawn' else bundle['document']['rollback'],
            'deleted': bundle['document']['deleted'] if status == 'withdrawn' else {},
            'verified': True, 'publication': False}


def control(api, lease, http):
    api.directory(lease.sftp, lease.control)
    api.require(api.read(lease.sftp, lease.control + '/.htaccess') == api.DENY
                and api.read(lease.sftp, lease.control + '/probe.txt') == api.PROBE
                and api.read(lease.sftp, lease.control + '/marker') == api.MARKER
                and http('.ap-ops/probe.txt')[0] in (403, 404))


def prove(bundle, api, sftp, root, http, *, withdrawn):
    document = bundle['document']
    api.proof(sftp, root, document['site'] if withdrawn else document['rollback'], http)
    if not withdrawn:
        return
    for name in document['deleted']:
        api.require(api.current_hash(sftp, root, name) is None)
    for name in owned_directories(document):
        api.require(api.exists(sftp, root.rstrip('/') + '/' + name) is None)
    route = 'inmuebles/' + document['properties'][0]['route_key']
    urls = set(document['deleted']) | {route, route + '/'}
    if route + '/reportaje/guiada/index.html' in document['deleted']:
        urls.update({route + '/reportaje/guiada', route + '/reportaje/guiada/'})
    for name in sorted(urls):
        api.require(http(name)[0] in (404, 410))


def validate_record(record, bundle, owner, api, lease):
    api.require(record['schema'] == RECORD and record['owner'] == owner
                and record['origin'] == api.PUBLIC_ORIGIN
                and record['payload'] == bundle['payload'] and record['claim'] == bundle['claim_sha']
                and record['review'] == bundle['claim']['review']
                and record['predecessor'] == bundle['document']['predecessor']
                and record['baseline'] == bundle['document']['rollback']
                and record['candidate'] == bundle['document']['site']
                and record['deleted'] == bundle['document']['deleted']
                and record['stage'] == lease.control + '/withdrawal-' + owner['attempt']
                and record['phase'] in ('staged', 'withdrawing', 'verified', 'recovering', 'rolled_back'))
    expected_dirs = owned_directories(bundle['document'])
    api.require(record['directories'] == expected_dirs
                and isinstance(record['removed_dirs'], list)
                and len(record['removed_dirs']) == len(set(record['removed_dirs']))
                and set(record['removed_dirs']) <= set(expected_dirs))
    api.require(record['backups'] == {n: record['stage'] + '/b-' + str(i)
                                      for i, n in enumerate(sorted(record['baseline']))})
    intent = record['directory_intent']
    if intent is not None:
        api.require(isinstance(intent, dict) and set(intent) == {'operation', 'path'}
                    and intent['operation'] in ('remove', 'create')
                    and intent['path'] in expected_dirs)


def checkpoint(api, lease, record, path, *, phase, intent=None):
    record['phase'], record['intent'] = phase, intent
    api.record_write(lease, record, path)


def restore(bundle, api, sftp, root, lease, record, record_path, http):
    """Inspect the complete baseline before restoring any byte; never consume backups."""
    lease.check_owner()
    validate_record(record, bundle, lease.owner, api, lease)
    before, candidate = record['baseline'], record['candidate']
    directories = set(record['directories'])
    intent = record['directory_intent']
    if intent and intent['operation'] == 'create':
        # A lost mkdir acknowledgement cannot establish who created an existing path.
        api.require(api.exists(sftp, root.rstrip('/') + '/' + intent['path']) is None)
    for name in before:
        missing = api.inspect_paths(sftp, root, [name])
        api.require(set(missing) <= directories)
        allowed = {before[name], candidate[name]} if name in candidate else {before[name], None}
        api.require(api.current_hash(sftp, root, name) in allowed)
        api.require(api.sha(api.read(sftp, record['backups'][name])) == before[name])
    for name in record['directories']:
        path = root.rstrip('/') + '/' + name
        if api.exists(sftp, path) is not None:
            api.directory(sftp, path)
    record['directory_intent'] = None
    checkpoint(api, lease, record, record_path, phase='recovering')
    for name in record['directories']:
        path = root.rstrip('/') + '/' + name
        if api.exists(sftp, path) is not None:
            continue
        api.directory(sftp, path.rsplit('/', 1)[0])
        record['directory_intent'] = {'operation': 'create', 'path': name}
        api.record_write(lease, record, record_path)
        lease.journal('creating-withdrawal-directory', name, public_intent=True)
        lease.check_owner()
        api.require(api.exists(sftp, path) is None)
        sftp.mkdir(path)
        record['directory_intent'] = None
        api.record_write(lease, record, record_path)
    # Restore deleted routes/media before restoring catalogue/sitemap references.
    order = sorted(before, key=lambda n: (n in candidate, n))
    for name in order:
        current = api.current_hash(sftp, root, name)
        allowed = {before[name], candidate[name]} if name in candidate else {before[name], None}
        api.require(current in allowed)
        if current == before[name]:
            continue
        checkpoint(api, lease, record, record_path, phase='recovering',
                   intent={'operation': 'restore', 'path': name})
        lease.journal('restoring-withdrawn', name, public_intent=True)
        temporary = record['stage'] + '/restore'
        api.write(sftp, temporary, api.read(sftp, record['backups'][name]))
        api.require(api.sha(api.read(sftp, temporary)) == before[name])
        lease.check_owner()
        api.require(api.current_hash(sftp, root, name) in allowed)
        sftp.posix_rename(temporary, api.safe_path(sftp, root, name))
        api.require(api.current_hash(sftp, root, name) == before[name])
    prove(bundle, api, sftp, root, http, withdrawn=False)
    checkpoint(api, lease, record, record_path, phase='rolled_back')
    lease.journal('verified', public_intent=True)
    lease.complete()
    return receipt(bundle, lease.owner, status='rolled_back')


def execute(bundle, sftp, root, owner, operation, http, *, api):
    api.owner_bytes(owner)
    api.require(owner['attempt'] == bundle['claim']['attempt']
                and operation in ('deploy', 'reconcile', 'recover')
                and api.canonical_root(sftp, root) == root)
    api.require(http('index.html') == (200, api.read(sftp, root.rstrip('/') + '/index.html')))
    lease = api.Lease(sftp, root, owner, http)
    record_path = lease.control + '/transaction-' + owner['attempt'] + '.json'
    if operation != 'deploy':
        control(api, lease, http)
        blob = api.read(sftp, record_path)
        record = json.loads(blob, object_pairs_hook=api.unique)
        api.require(blob == api.canonical_bytes(record))
        validate_record(record, bundle, owner, api, lease)
        if api.exists(sftp, lease.lock):
            lease.check_owner()
        else:
            api.require(record['phase'] in ('verified', 'rolled_back'))
            lease.acquire()
        if operation == 'recover':
            return restore(bundle, api, sftp, root, lease, record, record_path, http)
        if record['phase'] == 'rolled_back':
            prove(bundle, api, sftp, root, http, withdrawn=False)
            lease.journal('verified', public_intent=True)
            lease.complete()
            return receipt(bundle, owner, status='rolled_back')
        prove(bundle, api, sftp, root, http, withdrawn=True)
        checkpoint(api, lease, record, record_path, phase='verified')
        lease.journal('verified', public_intent=True)
        lease.complete()
        return receipt(bundle, owner)

    def preflight():
        lease.check_owner()
        control(api, lease, http)
        api.require(not api.inspect_paths(sftp, root, bundle['before']))
        for name, checksum in bundle['document']['rollback'].items():
            api.require(api.current_hash(sftp, root, name) == checksum)
        api.require(api.exists(sftp, record_path) is None)

    api.require(int(api.time.time()) < bundle['claim']['expires_at'])
    api.require(not api.inspect_paths(sftp, root, bundle['before']))
    for name, checksum in bundle['document']['rollback'].items():
        api.require(api.current_hash(sftp, root, name) == checksum)
    api.require(api.exists(sftp, record_path) is None)
    lease.acquire()
    try:
        preflight()
        stage = lease.control + '/withdrawal-' + owner['attempt']
        stage_created = False
        sftp.mkdir(stage)
        stage_created = True
        backups, staged = {}, {}
        for i, name in enumerate(sorted(bundle['before'])):
            path = stage + '/b-' + str(i)
            api.write(sftp, path, bundle['before'][name])
            api.require(api.sha(api.read(sftp, path)) == bundle['document']['rollback'][name])
            backups[name] = path
        changed = sorted(n for n in bundle['site'] if bundle['site'][n] != bundle['before'][n])
        for i, name in enumerate(changed):
            path = stage + '/c-' + str(i)
            api.write(sftp, path, bundle['site'][name])
            api.require(api.sha(api.read(sftp, path)) == bundle['document']['site'][name])
            staged[name] = path
        api.write(sftp, stage + '/rename-a', b'new')
        api.write(sftp, stage + '/rename-b', b'old')
        sftp.posix_rename(stage + '/rename-a', stage + '/rename-b')
        api.require(api.read(sftp, stage + '/rename-b') == b'new'
                    and api.exists(sftp, stage + '/rename-a') is None)
        record = {'schema': RECORD, 'origin': api.PUBLIC_ORIGIN, 'owner': owner,
                  'payload': bundle['payload'], 'claim': bundle['claim_sha'],
                  'review': bundle['claim']['review'], 'predecessor': bundle['document']['predecessor'],
                  'baseline': bundle['document']['rollback'], 'candidate': bundle['document']['site'],
                  'deleted': bundle['document']['deleted'], 'stage': stage, 'backups': backups,
                  'directories': owned_directories(bundle['document']), 'removed_dirs': [],
                  'directory_intent': None, 'phase': 'staged', 'intent': None}
        api.record_write(lease, record, record_path)
        actions = [('replace', n) for n in sorted(changed, key=lambda n: (n != 'inmuebles/index.html', n))]
        actions += [('delete', n) for n in sorted(record['deleted'], key=lambda n: (not n.endswith('.html'), n))]
        for action, name in actions:
            lease.check_owner()
            api.require(int(api.time.time()) < bundle['claim']['expires_at']
                        and api.current_hash(sftp, root, name) == record['baseline'][name])
            checkpoint(api, lease, record, record_path, phase='withdrawing',
                       intent={'operation': action, 'path': name})
            lease.journal('withdrawing', name, public_intent=True)
            lease.check_owner()
            api.require(api.current_hash(sftp, root, name) == record['baseline'][name])
            target = api.safe_path(sftp, root, name)
            if action == 'replace':
                sftp.posix_rename(staged[name], target)
                api.require(api.current_hash(sftp, root, name) == record['candidate'][name])
            else:
                sftp.remove(target)
                api.require(api.current_hash(sftp, root, name) is None)
        for name in reversed(record['directories']):
            lease.check_owner()
            api.require(int(api.time.time()) < bundle['claim']['expires_at'])
            path = root.rstrip('/') + '/' + name
            api.directory(sftp, path)
            record['directory_intent'] = {'operation': 'remove', 'path': name}
            api.record_write(lease, record, record_path)
            lease.journal('removing-withdrawal-directory', name, public_intent=True)
            lease.check_owner()
            api.directory(sftp, path)
            sftp.rmdir(path)
            record['removed_dirs'].append(name)
            record['directory_intent'] = None
            api.record_write(lease, record, record_path)
        prove(bundle, api, sftp, root, http, withdrawn=True)
        control(api, lease, http)
        checkpoint(api, lease, record, record_path, phase='verified')
        lease.journal('verified', public_intent=True)
        lease.complete()
        return receipt(bundle, owner)
    except Exception:
        lease.check_owner()
        journal = json.loads(api.read(sftp, lease.lock + '/journal.json'))
        if journal['public_intent'] is False and 'record' not in locals():
            if 'stage' in locals() and api.exists(sftp, stage) is not None:
                # Only an acknowledged mkdir under our lease establishes ownership.
                api.require(stage_created)
                api.directory(sftp, stage)
                expected = {stage + '/b-' + str(i): {blob}
                            for i, (_, blob) in enumerate(sorted(bundle['before'].items()))}
                changed = sorted(n for n in bundle['site'] if bundle['site'][n] != bundle['before'][n])
                expected.update({stage + '/c-' + str(i): {bundle['site'][n]}
                                 for i, n in enumerate(changed)})
                expected.update({stage + '/rename-a': {b'new'},
                                 stage + '/rename-b': {b'old', b'new'}})
                # Validate every known byte before deleting any; unknown content
                # prevents empty-directory removal and retains the same owner.
                for path, allowed in expected.items():
                    if api.exists(sftp, path) is not None:
                        api.require(api.read(sftp, path) in allowed)
                for path, allowed in expected.items():
                    lease.check_owner()
                    if api.exists(sftp, path) is not None:
                        api.require(api.read(sftp, path) in allowed)
                        sftp.remove(path)
                lease.check_owner()
                api.directory(sftp, stage)
                sftp.rmdir(stage)
                api.require(api.exists(sftp, stage) is None)
            lease.release_no_write()
            raise
        if 'record' in locals():
            return restore(bundle, api, sftp, root, lease, record, record_path, http)
        raise
