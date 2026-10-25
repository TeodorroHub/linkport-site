"""Search engine and legal additions to the page that tools/build.py makes from the design.

They live here, not in the design folder, so a new version of the design keeps them:

- seo(html): the title, the description, Open Graph and Twitter tags, the JSON-LD of the
  company, the hreflang links to the Czech page, the company's registration details (IČO and
  the commercial register) and the link to the Czech page in the menu. The street is written
  as in the commercial register: Vlkova 532/8, 130 00 Praha 3.
- czech(html, hashes): the Czech page cs.html (served at https://linkport.cz/cs) and its
  two scripts, cs-script.js and cs-video.js, translated with the table in tools/cs.py.

Every replacement must find its text. When the design changes a text, the build stops and
names it, so the translation (tools/cs.py) or the rule here is updated instead of the page being
published half in English.
"""
import json
import re
import sys

from cs import HTML as CS_HTML, SCRIPT as CS_SCRIPT, VIDEO as CS_VIDEO, HEAD as CS_HEAD

SITE = 'https://linkport.cz/'
ICO = '30152496'
COMPANY = {
    '@type': 'Organization', '@id': f'{SITE}#organization',
    'name': 'LinkPort Systems', 'legalName': 'LinkPort Systems s.r.o.', 'url': SITE,
    'logo': {'@type': 'ImageObject', 'url': f'{SITE}assets/icon-192.png', 'width': 192, 'height': 192},
    'image': f'{SITE}assets/og-image.jpg',
    'description': 'LinkPort Systems s.r.o. develops Quotiflex, CPQ software with AI for manufacturers.',
    'address': {'@type': 'PostalAddress', 'streetAddress': 'Vlkova 532/8', 'addressLocality': 'Praha 3',
                'postalCode': '130 00', 'addressCountry': 'CZ'},
    'identifier': {'@type': 'PropertyValue', 'propertyID': 'IČO', 'value': ICO},
    'foundingDate': '2026-10-19',
    'brand': {'@type': 'Brand', 'name': 'Quotiflex', 'url': 'https://quotiflex.com/',
              'logo': 'https://quotiflex.com/img/logo-mark.png'},
    # The company's profiles on other sites, so search engines and AI assistants join them to this site.
    'sameAs': ['https://www.linkedin.com/company/linkport-systems/', 'https://www.crunchbase.com/organization/linkport-systems'],
}

EN = {
    'lang': 'en', 'url': SITE, 'locale': 'en_US',
    'title': 'LinkPort Systems · CPQ software and applied AI, Prague',
    'description': 'LinkPort Systems s.r.o. in Prague develops Quotiflex, CPQ software with AI for manufacturers, combining engineering expertise with applied AI.',
    'og_alt': 'LinkPort Systems: Complex products. Clear decisions.',
    'image': f'{SITE}assets/og-image.jpg',
}
CS = {
    'lang': 'cs', 'url': f'{SITE}cs', 'locale': 'cs_CZ',
    'title': CS_HEAD['title'], 'description': CS_HEAD['description'], 'og_alt': CS_HEAD['og_alt'],
    'image': f'{SITE}assets/og-image-cs.jpg',
}


def must(found, what):
    if not found:
        sys.exit(f'The design changed: {what} not found; update tools/seo.py or tools/cs.py.')


def replace(text, old, new, count=None, what=None):
    must(old in text, what or repr(old[:70]))
    if count is not None:
        must(text.count(old) == count, f'{count} times {old[:60]!r} (found {text.count(old)})')
    return text.replace(old, new)


def head(page):
    graph = {'@context': 'https://schema.org', '@graph': [
        COMPANY,
        {'@type': 'WebSite', '@id': f'{SITE}#website', 'url': SITE, 'name': 'LinkPort Systems',
         'inLanguage': ['en', 'cs'], 'publisher': {'@id': f'{SITE}#organization'}},
        {'@type': 'WebPage', '@id': page['url'], 'url': page['url'], 'name': page['title'],
         'description': page['description'], 'inLanguage': page['lang'],
         'isPartOf': {'@id': f'{SITE}#website'}, 'about': {'@id': f'{SITE}#organization'},
         'primaryImageOfPage': {'@type': 'ImageObject', 'url': page['image']}},
    ]}
    alt_locale = 'cs_CZ' if page['lang'] == 'en' else 'en_US'
    return '\n'.join([
        '<link rel="alternate" hreflang="en" href="https://linkport.cz/">',
        '<link rel="alternate" hreflang="cs" href="https://linkport.cz/cs">',
        '<link rel="alternate" hreflang="x-default" href="https://linkport.cz/">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="LinkPort Systems">',
        f'<meta property="og:title" content="{page["title"]}">',
        f'<meta property="og:description" content="{page["description"]}">',
        f'<meta property="og:url" content="{page["url"]}">',
        f'<meta property="og:locale" content="{page["locale"]}">',
        f'<meta property="og:locale:alternate" content="{alt_locale}">',
        f'<meta property="og:image" content="{page["image"]}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{page["og_alt"]}">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<link rel="icon" href="favicon.ico" sizes="32x32">',
        '<script type="application/ld+json">',
        json.dumps(graph, ensure_ascii=False, separators=(',', ':')),
        '</script>',
    ])


def seo(html):
    """The English page: head tags, registration details, the link to the Czech page."""
    html = re.sub(r'<title>.*?</title>', f'<title>{EN["title"]}</title>', html, count=1, flags=re.S)
    must(EN['title'] in html, '<title>')
    html, n = re.subn(r'<meta name="description" content="[^"]*">',
                      f'<meta name="description" content="{EN["description"]}">', html, count=1)
    must(n, 'the meta description')
    canonical = '<link rel="canonical" href="https://linkport.cz/">'
    html = replace(html, canonical, canonical + '\n' + head(EN), count=1)
    # The address as in the commercial register. The design folder writes "Vlková" and "Praha";
    # once it is corrected there, these three lines find nothing to change.
    html = html.replace('Vlková 532/8', 'Vlkova 532/8')
    html = html.replace('130 00 Praha<br>', '130 00 Praha 3<br>')
    html = html.replace('Žižkov, 130 00 Praha, Czech Republic,', 'Žižkov, 130 00 Praha 3, Czech Republic,')
    # Registration details, as the Civil Code (§ 435) asks of a company's website.
    html = replace(html, '<address>Vlkova 532/8, Žižkov<br>130 00 Praha 3<br>Czech Republic</address>',
                   '<address>Vlkova 532/8, Žižkov<br>130 00 Praha 3<br>Czech Republic<br>'
                   f'Company ID (IČO): {ICO}<br>Registered in the Commercial Register kept by the '
                   'Municipal Court in Prague, file C 458045</address>', count=1)
    html = replace(html, 'is responsible for the personal information',
                   f'Company ID (IČO) {ICO}, is responsible for the personal information', count=1)
    html = replace(html, '<span>© <span id="year">2026</span> LinkPort Systems s.r.o.</span>',
                   f'<span>© <span id="year">2026</span> LinkPort Systems s.r.o. · IČO {ICO}</span>', count=1)
    # The other language, just before the contact button of the menu.
    html = replace(html, '<a class="nav-contact" href="#contact">',
                   '<a class="nav-lang" href="cs" hreflang="cs" lang="cs">Česky</a><a class="nav-contact" href="#contact">', count=1)
    return html


def czech(html, hashes):
    """The Czech page and its scripts, from the finished English page."""
    for old, new in CS_HTML:
        html = replace(html, old, new)
    html = replace(html, '<html lang="en"', '<html lang="cs"', count=1)
    html = re.sub(r'<title>.*?</title>', f'<title>{CS["title"]}</title>', html, count=1, flags=re.S)
    html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{CS["description"]}">', html, count=1)
    html = replace(html, '<link rel="canonical" href="https://linkport.cz/">', '<link rel="canonical" href="https://linkport.cz/cs">', count=1)
    start = html.index('<link rel="alternate" hreflang="en"')
    end = html.index('</script>', start) + len('</script>')
    html = html[:start] + head(CS) + html[end:]
    html = replace(html, '<a class="nav-lang" href="cs" hreflang="cs" lang="cs">Česky</a>',
                   '<a class="nav-lang" href="./" hreflang="en" lang="en">English</a>', count=1)
    html = re.sub(r'src="script\.js\?v=[0-9a-f]+"', f'src="cs-script.js?v={hashes["cs-script.js"]}"', html, count=1)
    html = re.sub(r'src="video\.js\?v=[0-9a-f]+"', f'src="cs-video.js?v={hashes["cs-video.js"]}"', html, count=1)
    must('cs-script.js' in html and 'cs-video.js' in html, 'the script tags')
    left = [s for s in ('Skip to content', 'Our approach', 'Send enquiry', 'Czech Republic') if s in html]
    must(not left, f'a translation for {left}')
    return html


def czech_script(script):
    for old, new in CS_SCRIPT:
        script = replace(script, old, new)
    return script


def czech_video(video):
    for old, new in CS_VIDEO:
        video = replace(video, old, new)
    return video
