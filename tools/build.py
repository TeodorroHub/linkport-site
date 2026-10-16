#!/usr/bin/env python3
"""Build site/ from the design folder, with the image optimisations applied.

Usage:  python3 tools/build.py <design-folder>

The design folder is the one with index.html, the CSS and JS files and assets/.
Only files that index.html, the CSS and the JS actually reference are published.

What the build changes, and why:
- PNG images become WebP (photographs and sketches at quality 82, images with
  transparency at quality 90). Logos listed in RESIZE are scaled down to about three
  times their displayed width.
- linkport-symbol-reference.png stays PNG: the script reads its pixels to trace it.
- SVG files that embed PNG drawings keep their markup; each embedded PNG becomes a
  lossless WebP. When the drawing is only shown through clip paths, everything outside
  the visible clip regions is blanked, and when its filter only reads the red channel,
  only that channel is kept. The pixels that can be seen do not change.
- Every local CSS, JS, image and SVG reference gets ?v=<content hash>, so a browser
  never keeps an old copy after an update.
- <html> gets data-background="electronics" when the script defaults to that artwork,
  so the browser does not download the classic artwork first.
- The canonical link and the favicons are added to <head>.
"""
import base64, hashlib, io, re, sys, xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageDraw

SRC = Path(sys.argv[1]).resolve()
OUT = Path(__file__).resolve().parent.parent / 'site'
TEXT = ['index.html', 'styles.css', 'materials.css', 'materials.js', 'script.js', 'engineering-network.js']
KEEP_PNG = {'linkport-symbol-reference.png'}
RESIZE = {'linkport-logo.png': 430}
# Files the build does not manage; they are never deleted.
OWN = {'favicon-32.png', 'robots.txt', 'sitemap.xml', 'assets/icon-192.png', 'assets/apple-touch-icon.png'}
HEAD = ['<link rel="canonical" href="https://linkport.cz/">',
        '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">',
        '<link rel="icon" type="image/png" sizes="192x192" href="assets/icon-192.png">',
        '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">']

def h8(data): return hashlib.md5(data).hexdigest()[:8]
def kb(n): return f'{n / 1024:,.0f} KB'

texts = {name: (SRC / name).read_text(encoding='utf-8') for name in TEXT if (SRC / name).exists()}
refs = sorted({m for t in texts.values() for m in re.findall(r'assets/[\w.-]+\.(?:png|svg)', t)})
report, made = [], {}

def webp(im, **kw):
    b = io.BytesIO(); im.save(b, 'WEBP', method=6, **kw); return b.getvalue()

def raster(name):
    src = (SRC / name).read_bytes()
    if Path(name).name in KEEP_PNG:
        return name, src
    im = Image.open(io.BytesIO(src))
    alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    im = im.convert('RGBA' if alpha else 'RGB')
    width = RESIZE.get(Path(name).name)
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    data = webp(im, quality=90, alpha_quality=100) if alpha else webp(im, quality=82)
    return name[:-4] + '.webp', data

def num(v, default=0.0):
    try: return float(v)
    except (TypeError, ValueError): return default

def translate(el):
    t = el.get('transform')
    if not t: return 0.0, 0.0
    m = re.fullmatch(r'\s*translate\(\s*([-\d.]+)[\s,]*([-\d.]*)\s*\)\s*', t)
    return (float(m.group(1)), float(m.group(2) or 0)) if m else None

def red_only(root, fid):
    """True when the filter only reads the red channel (constant colour, alpha from R)."""
    for f in root.iter('{http://www.w3.org/2000/svg}filter'):
        if f.get('id') != fid: continue
        prims = list(f)
        if len(prims) != 1 or not prims[0].tag.endswith('feColorMatrix') or prims[0].get('type', 'matrix') != 'matrix':
            return False
        v = [float(x) for x in prims[0].get('values').split()]
        return len(v) == 20 and all(v[r * 5 + c] == 0 for r in range(3) for c in range(4)) and v[16] == v[17] == v[18] == 0
    return False

def svg(name):
    text = (SRC / name).read_text(encoding='utf-8')
    if 'data:image/png;base64,' not in text:
        return name, text.encode()
    ns = '{http://www.w3.org/2000/svg}'
    root = ET.fromstring(text.encode())
    parent = {c: p for p in root.iter() for c in p}
    clips = {c.get('id'): [(num(r.get('x')), num(r.get('y')), num(r.get('width')), num(r.get('height')))
                           for r in c.iter(ns + 'rect')] for c in root.iter(ns + 'clipPath')}
    vb = [float(x) for x in root.get('viewBox', f"0 0 {root.get('width')} {root.get('height')}").split()]
    for image in list(root.iter(ns + 'image')):
        href = image.get('href') or image.get('{http://www.w3.org/1999/xlink}href') or ''
        if not href.startswith('data:image/png;base64,'): continue
        payload = href.split(',', 1)[1]
        im = Image.open(io.BytesIO(base64.b64decode(payload))).convert('RGB')
        regions, exact = [], (num(image.get('x')) == num(image.get('y')) == 0 and
                              num(image.get('width'), im.width) == im.width and num(image.get('height'), im.height) == im.height)
        iid = image.get('id')
        users = [u for u in root.iter(ns + 'use') if (u.get('href') or u.get('{http://www.w3.org/1999/xlink}href')) == f'#{iid}'] if iid else []
        in_defs = any(a.tag == ns + 'defs' for a in [parent.get(image)] if a is not None)
        if not in_defs: users.append(image)
        for u in users:
            el, between_ok = u, not (u is not image and (u.get('x') or u.get('y') or u.get('transform')))
            while el is not None and not el.get('clip-path'):
                el = parent.get(el)
                if el is not None and not el.get('clip-path') and el.get('transform'): between_ok = False
            if el is None or not between_ok: exact = False; break
            cid = re.search(r'#([^)]+)', el.get('clip-path')).group(1)
            dx = dy = 0.0; a = el
            while a is not None:
                t = translate(a)
                if t is None: exact = False; break
                dx += t[0]; dy += t[1]; a = parent.get(a)
            for x, y, w, hh in clips.get(cid, []):
                # Visible part = clip rect, shifted into display space, cut to the viewBox.
                x0, y0 = max(x, vb[0] - dx), max(y, vb[1] - dy)
                x1, y1 = min(x + w, vb[0] + vb[2] - dx), min(y + hh, vb[1] + vb[3] - dy)
                if x1 > x0 and y1 > y0: regions.append((x0, y0, x1, y1))
        fid = re.search(r'#([^)]+)', image.get('filter') or '')
        if exact and users:
            mask = Image.new('L', im.size, 0); d = ImageDraw.Draw(mask)
            for x0, y0, x1, y1 in regions: d.rectangle([x0 - 2, y0 - 2, x1 + 2, y1 + 2], fill=255)
            im = Image.composite(im, Image.new('RGB', im.size, (255, 255, 255)), mask)
        if fid and red_only(root, fid.group(1)):
            r = im.split()[0]; im = Image.merge('RGB', (r, r, r))
        data = base64.b64encode(webp(im, lossless=True)).decode()
        text = text.replace('data:image/png;base64,' + payload, 'data:image/webp;base64,' + data)
    return name, text.encode()

for ref in refs:
    if not (SRC / ref).exists():
        sys.exit(f'Missing in the design folder: {ref}')
    out, data = (svg if ref.endswith('.svg') else raster)(ref)
    (OUT / out).parent.mkdir(parents=True, exist_ok=True)
    (OUT / out).write_bytes(data)
    made[ref] = f'{out}?v={h8(data)}'
    report.append((ref, (SRC / ref).stat().st_size, out, len(data)))

def rewrite(t):
    return re.sub(r'assets/[\w.-]+\.(?:png|svg)(?:\?v=[\w.-]+)?',
                  lambda m: made.get(m.group(0).split('?')[0], m.group(0)), t)

for name in TEXT:
    if name == 'index.html' or name not in texts: continue
    (OUT / name).write_text(rewrite(texts[name]), encoding='utf-8')

html = rewrite(texts['index.html'])
for name in TEXT:
    if name != 'index.html' and (OUT / name).exists():
        v = h8((OUT / name).read_bytes())
        html = re.sub(rf'(["\']){re.escape(name)}(?:\?v=[^"\']*)?\1', rf'\g<1>{name}?v={v}\1', html)
if "!==\"classic\"" in texts.get('engineering-network.js', '') and 'data-background=' not in html.split('>', 2)[1]:
    html = re.sub(r'<html\b([^>]*)>', r'<html\1 data-background="electronics">', html, count=1)
for logo, width in RESIZE.items():
    out = made.get(f'assets/{logo}')
    if out:
        w, hgt = Image.open(OUT / out.split('?')[0]).size
        html = re.sub(rf'(<img[^>]*src="{re.escape(out)}"[^>]*?)width="\d+" height="\d+"',
                      rf'\g<1>width="{w}" height="{hgt}"', html)
if HEAD[0] not in html:
    m = re.search(r'<meta name="theme-color"[^>]*>\r?\n?', html)
    nl = '\r\n' if '\r\n' in html else '\n'
    html = html[:m.end()] + nl.join(HEAD) + nl + html[m.end():]
(OUT / 'index.html').write_text(html, encoding='utf-8')

# Remove published assets the design no longer references.
keep = {v.split('?')[0] for v in made.values()} | set(TEXT) | OWN
for f in OUT.rglob('*'):
    rel = f.relative_to(OUT).as_posix()
    if f.is_file() and rel not in keep:
        f.unlink(); print('removed', rel)

total_src = sum(s for _, s, _, _ in report); total_out = sum(o for _, _, _, o in report)
for ref, s, out, o in report:
    print(f'{ref:45} {kb(s):>10} -> {out.split("/")[-1]:38} {kb(o):>9}')
print(f'{"images total":45} {kb(total_src):>10} -> {"":38} {kb(total_out):>9}')
