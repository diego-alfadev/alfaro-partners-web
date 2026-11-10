# Verify the IONOS server identity without a password

The host-key probe checks the public identity offered by the configured IONOS
server. It does not authenticate, open SFTP, run shell commands or upload files.
It does not require anyone to send a password or a private key.

## Actions procedure

Once the guarded workflow is installed, open **Deploy to IONOS Web Hosting** in
the repository's Actions page and choose its **host-key** operation. This is a
manual diagnostic, not a property publication or a production release.

The workflow should pass only `IONOS_SFTP_SERVER` and `IONOS_SFTP_PORT` to:

```sh
python3 scripts/ap-ops/probe_host.py --apply
```

No username, password, remote directory or Google credential belongs in that
step's environment. With no `--apply`, the command validates configuration and
prints `status: planned` without making a connection. Paramiko is imported only
for the explicit connection.

## Interpret the result

The public JSON uses schema `ap-ionos-hostkey-probe/1` and reports an algorithm,
SHA-256 fingerprint and `pin_match`, when negotiation reached the key. It omits
the configured hostname, port and raw exception text. It always reports
`authenticated: false`, `publication: false` and `remote_writes: false`.

| Status | Meaning | Next action |
|---|---|---|
| `planned` | Configuration accepted; no network check performed | Run the explicit diagnostic when authorized |
| `verified` | Algorithm and fingerprint match the reviewed IONOS policy | Retain this public evidence; other release gates still apply |
| `not_trusted` | Offered identity is not in the reviewed policy | Stop and contact IONOS support for the exact endpoint |
| `refused` | Configuration or negotiation failed | Investigate the safe failure; do not bypass verification |

Published keys and pin date are maintained in `host_policy.py`, the shared policy
used by deployment helpers. The trusted reference is the [official IONOS
webhosting fingerprint table](https://www.ionos.de/hilfe/hosting/ssh-zugaenge-einrichten-und-verwalten/uebersicht-der-ssh-fingerabdruecke-im-ionos-webhosting/).
IONOS also documents comparison in its [connection procedure](https://www.ionos.com/help/hosting/setting-up-and-managing-ssh-accounts/connecting-to-your-webspace-via-secure-shell-ssh-using-putty/).

These are provider-published webhosting identities, not proof that every IONOS
product or custom endpoint uses the same key. A mismatch is never automatic
permission to trust the newly observed key. Ask IONOS support to confirm the
fingerprint for the configured endpoint through a trusted channel. Review the
evidence and policy change before updating a pin after provider rotation.

## Safety boundary

A scan observes what a server presents; it cannot establish trust on its own.
There is no trust-on-first-use option, environment override or accept-any-key
switch. The probe closes its transport and socket on success and failure, with
bounded socket, banner and negotiation timeouts. Verification of a public host
key does not prove login access, permissions, safe rollback, property approval or
successful deployment.
