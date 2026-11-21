"""Closed, file-inventory-bound withdrawal payload. No authentication or writes."""
import hashlib
import html
from urllib.parse import unquote
from xml.etree import ElementTree

from payload import HEX, KEY, LINK, path_name, require


SCHEMA = 'ap-production-withdrawal/1'
MUTABLE = {'inmuebles/index.html', 'sitemap-index.xml', 'sitemap-properties.xml'}


def owned_directories(document):
    prop = document['properties'][0]
    require(prop['route_key'] != 'media')
    roots = ('inmuebles/' + prop['route_key'], 'inmuebles/media/' + prop['public_id'])
    require(not any(a.startswith(b + '/') for a in roots for b in roots if a != b))
    names = set()
    for name in document['deleted']:
        path_name(name)
        parent = name.rsplit('/', 1)[0]
        root = next((r for r in roots if parent == r or parent.startswith(r + '/')), None)
        require(root is not None)
        while True:
            names.add(parent)
            if parent == root:
                break
            parent = parent.rsplit('/', 1)[0]
    return sorted(names, key=lambda n: (n.count('/'), n))


def locations(blob):
    try:
        root = ElementTree.fromstring(blob)
    except ElementTree.ParseError:
        require(False)
    return {element.text for element in root.iter()
            if element.tag.rsplit('}', 1)[-1] == 'loc'}


def validate_document(root, document, actual):
    require(set(document) == {'schema', 'destination', 'review_id', 'predecessor',
                              'properties', 'site', 'rollback', 'deleted'}
            and document['schema'] == SCHEMA
            and document['destination'] == 'https://alfaropartners.es'
            and isinstance(document['review_id'], str) and HEX.fullmatch(document['review_id'])
            and isinstance(document['predecessor'], str) and HEX.fullmatch(document['predecessor'])
            and isinstance(document['properties'], list) and len(document['properties']) == 1)
    prop = document['properties'][0]
    require(set(prop) == {'public_id', 'route_key'}
            and isinstance(prop['public_id'], str) and KEY.fullmatch(prop['public_id'])
            and isinstance(prop['route_key'], str) and KEY.fullmatch(prop['route_key'])
            and prop['route_key'] != 'media')
    expected, values, total = {'payload.json'}, {}, 0
    for folder in ('site', 'rollback'):
        inventory = document[folder]
        require(isinstance(inventory, dict) and 0 < len(inventory) <= 4096)
        values[folder] = {}
        for name, checksum in inventory.items():
            path_name(name)
            require(isinstance(checksum, str) and HEX.fullmatch(checksum))
            path = root / folder / name
            require(path.stat().st_size <= 64 * 1024 * 1024 and not path.stat().st_mode & 0o111)
            data = path.read_bytes()
            total += len(data)
            require(total <= 256 * 1024 * 1024
                    and hashlib.sha256(data).hexdigest() == checksum)
            values[folder][name] = data
            expected.add(folder + '/' + name)
    require(actual == expected)
    site, before = values['site'], values['rollback']
    require(set(site) < set(before) and before.get('.htaccess')
            and site.get('.htaccess') == before['.htaccess']
            and 'index.html' in site and 'inmuebles/index.html' in site)
    hub = 'inmuebles/' + prop['route_key'] + '/'
    media = 'inmuebles/media/' + prop['public_id'] + '/'
    owned = {name for name in before if name.startswith((hub, media))}
    require(hub + 'index.html' in owned
            and set(document['deleted']) == owned == set(before) - set(site)
            and document['deleted'] == {n: document['rollback'][n] for n in owned})
    owned_directories(document)
    previous = set(LINK.findall(before['inmuebles/index.html']))
    require(('/' + hub).encode() in previous
            and set(LINK.findall(site['inmuebles/index.html'])) == previous - {('/' + hub).encode()})
    for name, data in site.items():
        if name not in MUTABLE:
            require(data == before[name])
        elif name.endswith('.xml') and data != before[name]:
            prior = locations(before[name])
            removed = {url for url in prior if isinstance(url, str)
                       and url.startswith(('https://alfaropartners.es/' + hub,
                                           'https://alfaropartners.es/' + media))}
            require(locations(data) == prior - removed)
        if name.endswith(('.html', '.js', '.json', '.xml', '.css', '.txt')):
            normalized = unquote(html.unescape(data.decode('utf-8'))).replace('\\/', '/')
            require(hub not in normalized and media not in normalized)
    return site
