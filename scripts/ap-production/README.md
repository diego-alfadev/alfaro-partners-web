# AP artifact delivery preflight

This technical branch validates an explicitly exported public property payload.
It **does not deploy** to IONOS, read Google, use SFTP secrets, build the website
source, or grant a publication approval. `main` keeps its existing workflow.

## Check the installation

The existing workflow path accepts a manual dispatch on
`automation/sheet-production` with `deploy=false` and empty `expected_payload`.
It runs the validator tests and requires `.ap-release` to be absent. No workflow
is triggered by creating or pushing this branch.

## Validate a future approved payload

The local pipeline must first prove exact Sheet approval, technical/editorial
checks, confirmed PRE and the current production baseline. Export only these
public files into `.ap-release/`:

- `payload.json`: `ap-production-payload/1` public inventory.
- `site/`: candidate bytes.
- `rollback/`: previous public bytes.

Do not copy the private outer manifest, workbook, checks, service key, local paths
or supplier UUID. The dispatcher supplies the exact `payload.json` SHA-256 as
`expected_payload`. The validator requires exact inventory/hash agreement,
rejects extra files/symlinks/traversal, preserves unrelated production bytes,
and stages only candidate public files. It refuses without creating its staging
directory when validation fails. A successful run retains `ap-validated-site`;
that artifact is **not proof of production publication**.

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s scripts/ap-production -p 'test_*.py' -v
python3 scripts/ap-production/payload.py --root "$PUBLIC_PAYLOAD" \
  --expected-payload "$EXACT_SHA256" --stage "$NEW_PRIVATE_STAGE"
```

## Before enabling production writes

The separately tracked Sheet-production feature still needs a fresh live Sheet
approval check, serialized durable dispatch/attempt state, current baseline
verification, recoverable SFTP delivery (including deletion of newly introduced
paths on rollback), live byte verification and a real publication receipt before
returning `URL FINAL`. No production trigger or unattended publication is
installed by this commit. Production activation is a separate verified step.

Rollback of this installation: restore the technical branch workflow to its
parent revision. Do not dispatch that old source-building workflow; it is not the
artifact channel. No live site files were changed by installing this preflight.
