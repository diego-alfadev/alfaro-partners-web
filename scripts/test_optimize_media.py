"""Synthetic assets and a fake encoder; never runs cwebp or ffmpeg."""
from pathlib import Path
import tempfile
import unittest

import optimize_media as media


def halve(source, target):
    target.write_bytes(source.read_bytes()[: len(source.read_bytes()) // 2])


class OptimizeMediaTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.assets = Path(tmp.name, 'assets')
        self.masters = Path(tmp.name, 'masters')
        self.photo = self.assets / 'properties/ap-1/hall-large.webp'
        self.compact = self.assets / 'properties/ap-1/hall-compact.webp'
        self.clip = self.assets / 'property-clips/ap-1/hall.mp4'
        for path, data in ((self.photo, b'P' * 100), (self.compact, b'C' * 10), (self.clip, b'V' * 60)):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        self.calls = []

    def run_once(self, encoder=halve, dry_run=False):
        def tracked(kind, source, target):
            self.calls.append(kind)
            encoder(source, target)
        return media.optimize(self.assets, self.masters, encode=tracked, dry_run=dry_run)

    def test_new_files_are_kept_as_masters_then_replaced(self):
        report = self.run_once()
        self.assertEqual(report['adopted'], 2)
        self.assertEqual((self.masters / 'properties/ap-1/hall-large.webp').read_bytes(), b'P' * 100)
        self.assertEqual((self.masters / 'property-clips/ap-1/hall.mp4').read_bytes(), b'V' * 60)
        self.assertEqual(self.photo.read_bytes(), b'P' * 50)
        self.assertEqual(self.clip.read_bytes(), b'V' * 30)
        self.assertEqual(self.compact.read_bytes(), b'C' * 10)
        self.assertFalse((self.masters / 'properties/ap-1/hall-compact.webp').exists())
        self.assertEqual(sorted(self.calls), ['clip', 'photo'])

    def test_second_run_changes_nothing(self):
        self.run_once()
        self.calls.clear()
        report = self.run_once()
        self.assertEqual((report['adopted'], report['optimized'], report['current']), (0, 0, 2))
        self.assertEqual(self.calls, [])

    def test_new_file_under_an_existing_master_name_stops_without_touching_either(self):
        self.run_once()
        self.photo.write_bytes(b'N' * 80)
        with self.assertRaises(media.Refused) as refused:
            self.run_once()
        self.assertIn('properties/ap-1/hall-large.webp', str(refused.exception))
        self.assertEqual((self.masters / 'properties/ap-1/hall-large.webp').read_bytes(), b'P' * 100)
        self.assertEqual(self.photo.read_bytes(), b'N' * 80)

    def test_master_already_present_with_the_same_bytes_is_encoded(self):
        master = self.masters / 'properties/ap-1/hall-large.webp'
        master.parent.mkdir(parents=True)
        master.write_bytes(b'P' * 100)
        report = self.run_once()
        self.assertEqual((report['adopted'], report['optimized']), (1, 2))
        self.assertEqual(self.photo.read_bytes(), b'P' * 50)

    def test_a_larger_encode_publishes_the_master_bytes(self):
        self.run_once(encoder=lambda source, target: target.write_bytes(source.read_bytes() * 2))
        self.assertEqual(self.photo.read_bytes(), b'P' * 100)
        self.calls.clear()
        self.assertEqual(self.run_once()['current'], 2)

    def test_dry_run_writes_nothing(self):
        report = self.run_once(dry_run=True)
        self.assertEqual(report['adopted'], 2)
        self.assertFalse(self.masters.exists())
        self.assertEqual(self.photo.read_bytes(), b'P' * 100)
        self.assertEqual(self.calls, [])


if __name__ == '__main__':
    unittest.main()
