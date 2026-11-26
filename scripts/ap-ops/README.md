# Shared IONOS deployment protection

These helpers protect the existing static-site deployment. They do not implement
Sheet approval, property rollback, final-URL return or unattended property release.

## Installation does not publish the website

Pushes changing only `.github/workflows/deploy-ionos.yml` and `scripts/ap-ops/**`
are ignored by the existing source-deployment trigger. Normal content pushes
retain their deployment trigger. Manual `operation=host-key` skips both website
build and upload; `operation=standard` retains the existing `deploy` choice.

Production uploads are serialized only by the `ionos-production` concurrency
group (cancellation off). The deploy workflow is the only writer to IONOS.

## Trusted server identity

See [host-key verification](HOST-KEY.md). The server's offered public key must
match the provider-published fingerprint before password authentication. Existing
Actions credentials stay in their configured secret channel. No host, username,
password, local key or credential JSON is printed or transferred into artifacts.
The dependency and all transitive dependencies are hash-locked.

## Upload

```sh
python scripts/ap-ops/simple_upload.py --source dist           # offline plan
python scripts/ap-ops/simple_upload.py --source dist --apply   # deploy job
```

The apply path checks that the public `index.html` matches the remote one (the
right document root), then overwrites each file in place, assets before pages and
the sitemap last, and finally fetches every file over HTTPS to compare bytes. It
takes no lock, so a rerun after a failure is safe.

Only once every file is verified, it deletes the files under `inmuebles/` that the
build no longer contains, and the folders left empty: that is how a withdrawn
listing's page and media leave the server. It skips dotfiles and links, deletes
nothing outside `inmuebles/`, and deletes nothing when the build lacks
`inmuebles/index.html`.

Root dotfiles keep the old selection: only `.htaccess` is uploaded. A failure
prints its phase (`collect`, `connect`, `root-check`, `write`, `http-verify`,
`prune`), the relative file, the exception class and errno; never the exception
text.

The HTTP-denied `.ap-ops/` folder on IONOS is a leftover of the earlier staged
upload; nothing writes to it any more. The webspace is 50 MB, so never stage or
back up the site on the server.

## Offline checks

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s scripts/ap-ops -p 'test_*.py' -v
```

Tests use synthetic credentials and in-memory SFTP/SSH transports. Passing tests
or a public-host-key probe does not prove a real upload; the deploy job's public
byte comparison does.
