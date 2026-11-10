# Exact public property transaction

This branch is a **manual artifact transaction**, not the normal source-site
build. It never reads Google, builds the website, schedules work, or establishes
Sheet/editorial approval. The local publisher must prove those gates first.

## Public input and dispatch binding

Commit only the validated public export at `.ap-release/`:

- `payload.json`, schema `ap-production-payload/1`;
- `site/` candidate public bytes and `rollback/` exact previous public bytes.

Never include the private outer manifest, office workbook, technical checks,
service key, local configuration or supplier identifiers. `payload.py` rejects
extra paths, altered inventory, symlinks and unapproved scope. Its validation
contract and four artifact tests remain unchanged.

Place a separate, short-lived **public** launch claim at `.ap-claim.json`:

```json
{
  "schema": "ap-production-claim/1",
  "attempt": "0123456789abcdef0123456789abcdef",
  "review": "64-lowercase-hex-review-id",
  "payload": "64-lowercase-hex-payload-json-sha256",
  "control_commit": "40-lowercase-hex-trusted-implementation-commit",
  "origin": "https://alfaropartners.es",
  "issued_at": 1900000000,
  "expires_at": 1900000600
}
```

Placeholder hashes above are deliberately non-executable. Use real exact hashes.
`control_commit` identifies the trusted transport implementation, **not a Git
commit of approved property source**: property approval is bound by review and
payload hashes. The local dispatcher must separately validate the payload-carrying
commit's non-payload source against its trusted control snapshot/ancestry. The
hosted checkout is pinned to `github.sha`. A claim does not attest Sheet truth;
it binds an already authorized launch. Its SHA-256 must be independently recorded
and supplied as `expected_claim`, never derived from the file inside the worker.
The initial deployment requires current timestamps and a maximum1800-second TTL;
expiry is checked again before every public replacement. Reconciliation/recovery
may use the exact original expired claim, but never initiates new publication.

## Manual workflow inputs

The workflow runs only by `workflow_dispatch` on
`automation/sheet-production`, with `contents: read`, exact-SHA checkout,
`ionos-production` concurrency and cancellation disabled. There is no source build.

| Input | Meaning |
|---|---|
| `operation=validate`, `deploy=false` | Offline validation, no credentials/authentication; empty payload checks installation only. |
| `operation=deploy`, `deploy=true` | Explicit transaction using exact payload/claim hashes, attempt and control commit. |
| `operation=reconcile`, `deploy=true` | Inspect original attempt's actual bytes and HTTP results; never blindly redeploy. |
| `operation=recover`, `deploy=true` | Restore exact baseline/remove candidate additions for original attempt only. |
| `expected_payload`, `expected_claim`, `attempt`, `control_commit` | Independent exact launch binding. |
| `original_run_id`, `original_commit` | Required original deployment run ID/head SHA for reconcile/recover. Not a new owner. |

The initial deploy owner uses the actual hosted `GITHUB_RUN_ID` and `GITHUB_SHA`.
Recovery retains that exact owner: a different run cannot steal a foreign lease.
All inputs enter shell through environment variables and quoted arguments.
Dependencies use the shared hash-locked requirements; tests and offline claim
validation run before the credential-bearing step. No password goes into results.

## Local/public CLI

```sh
python scripts/ap-production/transaction.py \
  --root "$PUBLIC_PAYLOAD" --expected-payload "$PAYLOAD_SHA" \
  --claim "$PUBLIC_CLAIM" --expected-claim "$CLAIM_SHA" \
  --attempt "$ATTEMPT" --control-commit "$CONTROL_COMMIT"
```

Default is offline. Add `--operation deploy --run-id "$ORIGINAL_RUN_ID"
--commit "$ORIGINAL_HEAD_SHA" --apply` only inside the authorized hosted channel.
For inspection/recovery use the same inputs and `--operation reconcile|recover`.
Malformed/expired initial claims refuse before opening credentials. Unknown
errors are reported generically, with `publication=false` and reconciliation
required; never treat an exception or a failed Actions run as successful delivery.

## Transaction and recovery guarantees

The shared transport verifies official IONOS pins before password authentication;
it never uses ambient SSH agents or keys. Before public writes the worker proves
the fixed HTTPS index matches the canonical SFTP root, verifies every baseline
file (including dotfiles), and proves every added candidate target absent.

Under the exclusive owned `.ap-ops/lock`, it checks HTTP protection, stages and
reads back all candidate and baseline bytes, and probes POSIX overwrite rename
inside inert protected storage. A canonical protected transaction record binds
owner/review/payload/claim, exact hash sets, retained backups and created-directory
intents. Each public replacement has persisted intent and expected hash; assets
precede HTML and sitemap. Atomicity is **per file, not whole site**.

Caught partial failures inspect actual hashes before recovery. Baseline files
are restored only from retained hash-verified backups when current hashes are
baseline or candidate; added files are removed only when candidate-matching.
Only recorded empty created directories may be removed. Foreign bytes, unknown
owners, timeouts or unproved HTTP results retain the lock for reconciliation.
Cancellation/hard kill cannot run cleanup; explicit same-attempt recovery handles
it. No stale-lock deletion, unconditional unlock or blind redeploy exists.

Success requires all candidate SFTP hashes and fixed-origin HTTP bytes, with no
redirect following. Dotfiles have SFTP proof only. Recovery requires baseline
SFTP/HTTP proof and404 for removed added paths. Control staging/backups are retained.

## Worker result contract

The sole uploaded artifact is `ap-prod-worker-result` containing the bounded
`ap-worker-result.json` stdout result. Only complete proof returns:

- schema `ap-prod-worker/1`;
- exact `attempt`, `review`, `payload`, `claim`, original `run_id`;
- `commit`: actual original hosted run head SHA;
- `control_commit`: trusted implementation commit from the launch claim;
- fixed `origin`, exact `files` hash map, `verified=true`, `publication=true`.

A verified rollback has `status=rolled_back`, `verified=true`, `publication=false`
and exits1. Refusals also exit1 and never return a publication receipt. Reconcile
rechecks live bytes rather than trusting stored `verified`. The local publisher
must validate this exact receipt against its persisted dispatch/run/head/attempt
before returning `URL FINAL`; a successful artifact validation is insufficient.

## Verification and changed installation test

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s scripts/ap-production -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s scripts/ap-ops -p 'test_*.py' -v
```

The old `WorkflowSafetyTest` asserted no SFTP secrets and false-only deployment.
That installation-only assertion is intentionally replaced by manual-operation,
branch/SHA/credential-order and result-only-artifact guards now that actual
transport is authorized. Payload validation tests were not weakened.
Synthetic proofs do not establish an actual IONOS deployment. Real Sheet gates,
accepted technical checks, hosted execution and final URL confirmation remain
outside these offline tests. No scheduler or group announcement is enabled here.
