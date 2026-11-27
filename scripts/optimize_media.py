"""Publish lighter copies of listing photos and tour clips, always encoded from the masters.

Usage: AP_MEDIA_MASTERS=<private folder> python3 scripts/optimize_media.py [--dry-run]

The masters live outside this public repository. A large photo or clip in src/assets
that this script did not write is new material: it is copied to the masters and
checked before its lighter copy replaces it, so re-running never re-compresses a
compressed file. A master is never overwritten: a different file arriving under an
existing master's name stops the run. Compact photos are already small and stay as
they are. Requires cwebp and ffmpeg.
"""
import argparse
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

REPO = Path(__file__).resolve().parent.parent
MANIFEST = 'published.sha256'
PHOTOS = 'properties/*/*-large.webp'
CLIPS = 'property-clips/*/*.mp4'

PHOTO_ARGS = ['-quiet', '-q', '72', '-m', '6', '-metadata', 'none']
# Same keyframe interval and colour tags as encode-tour-clip.sh: scroll scrubbing and
# colour must not change, only the bitrate.
CLIP_ARGS = ['-an', '-vf', 'scale=1920:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow',
             '-crf', '30', '-g', '6', '-keyint_min', '6', '-sc_threshold', '0', '-pix_fmt', 'yuv420p',
             '-color_primaries', 'bt709', '-color_trc', 'iec61966-2-1', '-colorspace', 'bt709',
             '-color_range', 'tv', '-movflags', '+faststart+write_colr']


class Refused(Exception):
    pass


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def encode(kind, source, target):
    if kind == 'photo':
        command = ['cwebp', *PHOTO_ARGS, str(source), '-o', str(target)]
    else:
        command = ['ffmpeg', '-v', 'error', '-y', '-i', str(source), *CLIP_ARGS, str(target)]
    subprocess.run(command, check=True)


def read_manifest(masters):
    path = masters / MANIFEST
    if not path.exists():
        return {}
    pairs = (line.split('  ', 1) for line in path.read_text().splitlines() if line)
    return {relative: digest for digest, relative in pairs}


def write_manifest(masters, manifest):
    staged = masters / (MANIFEST + '.tmp')
    staged.write_text(''.join(f'{digest}  {relative}\n' for relative, digest in sorted(manifest.items())))
    staged.replace(masters / MANIFEST)


def optimize(assets, masters, encode=encode, dry_run=False):
    manifest = read_manifest(masters)
    report = {'adopted': 0, 'optimized': 0, 'current': 0, 'before': 0, 'after': 0}
    files = [('photo', p) for p in sorted(assets.glob(PHOTOS))] + [('clip', p) for p in sorted(assets.glob(CLIPS))]
    for kind, path in files:
        relative = path.relative_to(assets).as_posix()
        master = masters / relative
        digest = sha(path)
        if manifest.get(relative) == digest:
            if not master.exists():
                raise Refused(f'{relative} was optimized but its master is missing')
            report['current'] += 1
            continue
        if master.exists():
            if sha(master) != digest:
                raise Refused(f'{relative} differs from its master; move the old master aside first')
        else:
            report['adopted'] += 1
        report['optimized'] += 1
        report['before'] += path.stat().st_size
        if dry_run:
            continue
        if not master.exists():
            master.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, master)
            if sha(master) != digest:
                raise Refused(f'the master copy of {relative} does not match')
        with tempfile.TemporaryDirectory() as tmp:
            encoded = Path(tmp, path.name)
            encode(kind, master, encoded)
            if encoded.stat().st_size >= master.stat().st_size:
                shutil.copyfile(master, encoded)
            staged = path.with_name(path.name + '.tmp')
            shutil.copyfile(encoded, staged)
            staged.replace(path)
        manifest[relative] = sha(path)
        write_manifest(masters, manifest)
        report['after'] += path.stat().st_size
    return report


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--masters', type=Path, default=os.environ.get('AP_MEDIA_MASTERS'),
                        help='Private folder for the originals (default: $AP_MEDIA_MASTERS)')
    parser.add_argument('--dry-run', action='store_true', help='Report what would change, write nothing')
    args = parser.parse_args(argv)
    if not args.masters:
        parser.error('pass --masters or set AP_MEDIA_MASTERS')
    masters = args.masters.expanduser().resolve()
    if masters.is_relative_to(REPO):
        parser.error('the masters must live outside this public repository')
    try:
        report = optimize(REPO / 'src/assets', masters, dry_run=args.dry_run)
    except Refused as refused:
        print(f'Stopped: {refused}', file=sys.stderr)
        return 2
    mb = lambda value: f'{value / 1048576:.1f} MB'
    print(f"adopted {report['adopted']}, optimized {report['optimized']}, already current {report['current']}"
          + ('' if args.dry_run else f"; {mb(report['before'])} -> {mb(report['after'])}"))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
