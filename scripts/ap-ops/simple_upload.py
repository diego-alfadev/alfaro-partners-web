"""Upload an existing dist/ to IONOS over the pinned SFTP session, overwriting in place.

No lock, journal or staging, so a rerun is idempotent. Files removed from dist stay
on the server. A failure prints its phase, the relative file, the exception class
and errno, never the exception text, host, user or remote root (logs are public).
"""
import argparse
import json
import os
from pathlib import Path
import posixpath

from legacy_upload import collect
from sftp_session import http_get, open_sftp, read, safe_path


class Failed(Exception):
    def __init__(self, phase, file=None, **extra):
        super().__init__(phase)
        self.report = {'status': 'refused', 'phase': phase, 'file': file, **extra}


def order(name):
    # Assets precede the pages that reference them; the sitemap goes last.
    return (2 if name.endswith('.xml') else 1 if name.endswith('.html') else 0, name)


def upload(files, sftp, root, http=http_get, log=print):
    try:
        same_root = http('index.html') == (200, read(sftp, posixpath.join(root, 'index.html')))
    except Exception as exc:
        raise Failed('root-check', 'index.html') from exc
    if not same_root:
        raise Failed('root-check', 'index.html')
    names = sorted(files, key=order)
    for index, name in enumerate(names, 1):
        try:
            target = safe_path(sftp, root, name, create_parents=True)
            with sftp.file(target, 'wb') as stream:
                stream.set_pipelined(True)
                stream.write(files[name])
        except Exception as exc:
            raise Failed('write', name) from exc
        log(f'{index}/{len(names)} {name}', flush=True)
    mismatches = []
    for name in names:
        if name == '.htaccess':
            continue
        try:
            status, body = http(name)
        except Exception as exc:
            raise Failed('http-verify', name) from exc
        if (status, body) != (200, files[name]):
            mismatches.append([name, status])
    if mismatches:
        raise Failed('http-verify', mismatches=mismatches[:20])
    return {'status': 'uploaded', 'files': len(names)}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='Existing dist artifact')
    parser.add_argument('--apply', action='store_true', help='Connect and overwrite the live files')
    args = parser.parse_args(argv)
    try:
        try:
            files = collect(args.source)
        except Exception as exc:
            raise Failed('collect') from exc
        if not args.apply:
            result = {'status': 'planned', 'files': len(files)}
        else:
            try:
                with open_sftp(os.environ) as session:
                    result = upload(files, session.sftp, session.root, http_get)
            except Failed:
                raise
            except Exception as exc:
                # upload() wraps its own errors, so this is opening or closing the session.
                raise Failed('connect') from exc
        code = 0
    except Failed as failure:
        cause = failure.__cause__
        result = dict(failure.report, error=type(cause).__name__ if cause else None,
                      errno=getattr(cause, 'errno', None))
        code = 1
    print(json.dumps(result), flush=True)
    return code


if __name__ == '__main__':
    raise SystemExit(main())
