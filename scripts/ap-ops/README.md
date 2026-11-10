# Shared IONOS deployment protection

These helpers protect the existing static-site deployment. They do not implement
Sheet approval, property rollback, final-URL return or unattended property release.

## Installation does not publish the website

Pushes changing only `.github/workflows/deploy-ionos.yml` and `scripts/ap-ops/**`
are ignored by the existing source-deployment trigger. Normal content pushes
retain their deployment trigger. Manual `operation=host-key` skips both website
build and upload; `operation=standard` retains the existing `deploy` choice.

All participating deployments must use `ionos-production` with cancellation off
**and** the same remote lease. A failed/uncertain upload keeps its lease; a later
run must not break it or retry the upload blindly. The future property channel
must adopt this lease before activation; GitHub concurrency alone is not proof
of remote transaction completion.

## Trusted server identity

See [host-key verification](HOST-KEY.md). The server's offered public key must
match the provider-published fingerprint before password authentication. Existing
Actions credentials stay in their configured secret channel. No host, username,
password, local key or credential JSON is printed or transferred into artifacts.
The dependency and all transitive dependencies are hash-locked.

## Legacy artifact upload

```sh
python scripts/ap-ops/legacy_upload.py --source dist             # offline plan
python scripts/ap-ops/legacy_upload.py --source dist --apply \
  --run-id "$GITHUB_RUN_ID" --commit "$GITHUB_SHA"                # guarded apply
```

The apply path verifies the document-root mapping, rejects symlinks, establishes
an HTTP-protected `.ap-ops/` directory, acquires an exclusive owned lease, stages
and reads back payload bytes, tests atomic replacement support, journals before
live writes, uploads assets before documents, and verifies SFTP/HTTP results.
It does not remove unrelated live files. Root dotfiles retain the old selection
behavior: only the explicitly handled `.htaccess` is included.

A lock left after partial/uncertain writes is a recovery requirement, not a stale
file to delete. Inspect its owned journal and reconcile actual bytes before any
further deployment. There is no unconditional cleanup or automatic legacy
rollback. Property rollback remains a separate pending transaction capability.

## Offline checks

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s scripts/ap-ops -p 'test_*.py' -v
```

Tests use synthetic credentials and in-memory SFTP/SSH transports. Passing tests
or a public-host-key probe does not prove a real upload, production approval or
server support for the protection/atomic-rename behavior.
