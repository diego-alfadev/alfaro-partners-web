"""Closed withdrawal payloads never broaden publication v1."""
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import unittest

from payload import validate


ORIGIN = 'https://alfaropartners.es'


class WithdrawalPayloadTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.payload = self.root / 'payload'
        self.payload.mkdir()
        self.before = {
            'index.html': b'live home', '.htaccess': b'protected policy',
            'inmuebles/index.html': b'<a href="/inmuebles/test-home/">Target</a><a href="/inmuebles/other-home/">Other</a>',
            'inmuebles/test-home/index.html': b'approved home',
            'inmuebles/test-home/reportaje/guiada/index.html': b'approved tour',
            'inmuebles/media/ap-test/photo.webp': b'approved photo',
            'inmuebles/media/ap-test/clip.mp4': b'approved clip',
            'inmuebles/other-home/index.html': b'other home',
            'sitemap-index.xml': b'<sitemapindex><sitemap><loc>https://alfaropartners.es/sitemap-properties.xml</loc></sitemap></sitemapindex>',
            'sitemap-properties.xml': b'<urlset><url><loc>https://alfaropartners.es/inmuebles/test-home/</loc></url><url><loc>https://alfaropartners.es/inmuebles/other-home/</loc></url></urlset>',
        }
        self.deleted = {n: b for n, b in self.before.items()
                        if n.startswith(('inmuebles/test-home/', 'inmuebles/media/ap-test/'))}
        self.after = {n: b for n, b in self.before.items() if n not in self.deleted}
        self.after['inmuebles/index.html'] = b'<a href="/inmuebles/other-home/">Other</a>'
        self.after['sitemap-properties.xml'] = b'<urlset><url><loc>https://alfaropartners.es/inmuebles/other-home/</loc></url></urlset>'

    def write(self, *, schema='ap-production-withdrawal/1'):
        for folder in ('site', 'rollback'):
            path = self.payload / folder
            if path.exists():
                shutil.rmtree(path)
        inventories = {}
        for folder, files in (('site', self.after), ('rollback', self.before)):
            inventories[folder] = {}
            for name, blob in files.items():
                path = self.payload / folder / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(blob)
                inventories[folder][name] = hashlib.sha256(blob).hexdigest()
        self.document = {'schema': schema, 'destination': ORIGIN, 'review_id': 'a' * 64,
                         'predecessor': 'c' * 64,
                         'properties': [{'public_id': 'ap-test', 'route_key': 'test-home'}],
                         'deleted': {n: hashlib.sha256(b).hexdigest() for n, b in self.deleted.items()},
                         **inventories}
        return self.rewrite()

    def rewrite(self):
        blob = json.dumps(self.document, sort_keys=True).encode()
        (self.payload / 'payload.json').write_bytes(blob)
        return hashlib.sha256(blob).hexdigest()

    def test_valid_withdrawal_keeps_other_property_and_all_protected_bytes(self):
        expected = self.write()
        self.assertEqual(validate(self.payload, expected), self.after)

    def test_v1_still_refuses_deleted_paths(self):
        self.write()
        self.document = {k: v for k, v in self.document.items() if k not in ('predecessor', 'deleted')}
        self.document['schema'] = 'ap-production-payload/1'
        with self.assertRaises(ValueError):
            validate(self.payload, self.rewrite())

    def test_extra_deleted_target_changed_protected_file_and_addition_refuse(self):
        for kind in ('foreign_delete', 'protected', 'addition', 'other_link', 'sitemap', 'invalid_xml'):
            with self.subTest(kind=kind):
                self.setUp()
                if kind == 'foreign_delete':
                    self.deleted['inmuebles/other-home/index.html'] = self.before['inmuebles/other-home/index.html']
                    self.after.pop('inmuebles/other-home/index.html')
                if kind == 'protected':
                    self.after['index.html'] = b'unrelated edit'
                if kind == 'addition':
                    self.after['unrelated.html'] = b'new'
                if kind == 'other_link':
                    self.after['inmuebles/index.html'] = b'no remaining properties'
                if kind == 'sitemap':
                    self.after['sitemap-properties.xml'] = b'<urlset/>'
                if kind == 'invalid_xml':
                    self.after['sitemap-properties.xml'] = b'<broken'
                expected = self.write()
                with self.assertRaises(ValueError):
                    validate(self.payload, expected)

    def test_missing_deleted_entry_wrong_hash_and_reserved_route_refuse(self):
        self.write()
        original = json.loads(json.dumps(self.document))
        for kind in ('missing', 'hash', 'reserved'):
            self.document = json.loads(json.dumps(original))
            if kind == 'missing':
                self.document['deleted'].pop(next(iter(self.document['deleted'])))
            if kind == 'hash':
                self.document['deleted'][next(iter(self.document['deleted']))] = 'f' * 64
            if kind == 'reserved':
                self.document['properties'][0]['route_key'] = 'media'
            with self.subTest(kind=kind), self.assertRaises(ValueError):
                validate(self.payload, self.rewrite())

    def test_encoded_surviving_target_reference_and_symlink_refuse(self):
        self.after['inmuebles/index.html'] += b'<a href="/inmuebles%2ftest-home%2f">stale</a>'
        expected = self.write()
        with self.assertRaises(ValueError):
            validate(self.payload, expected)
        self.after['inmuebles/index.html'] = b'<a href="/inmuebles/other-home/">Other</a>'
        expected = self.write()
        path = self.payload / 'site/index.html'
        path.unlink()
        path.symlink_to(self.payload / 'rollback/index.html')
        with self.assertRaises(ValueError):
            validate(self.payload, expected)

    def test_last_property_can_leave_an_empty_catalogue(self):
        self.before.pop('inmuebles/other-home/index.html')
        self.before['inmuebles/index.html'] = b'<a href="/inmuebles/test-home/">Target</a>'
        self.before['sitemap-properties.xml'] = b'<urlset><url><loc>https://alfaropartners.es/inmuebles/test-home/</loc></url></urlset>'
        self.before['sitemap-properties.xml'] = b'<urlset><url><loc>https://alfaropartners.es/inmuebles/test-home/</loc></url></urlset>'
        self.after.pop('inmuebles/other-home/index.html')
        self.after['inmuebles/index.html'] = b'<p>No properties</p>'
        self.after['sitemap-properties.xml'] = b'<urlset/>'
        self.assertEqual(validate(self.payload, self.write()), self.after)
