# linkport.cz

The public website of LinkPort Systems s.r.o., the company behind Quotiflex CPQ.
This repository holds the website only.

- Website: https://linkport.cz (www.linkport.cz redirects to it)
- Product website: https://quotiflex.com
- Product sign-in: https://app.quotiflex.com

The custom domain is set in the repository's Pages settings. Because the site is published by a
GitHub Actions workflow, it needs no CNAME file. DNS for linkport.cz is managed at GoDaddy:
four A records for the apex pointing to GitHub Pages and `www` as a CNAME to `teodorrohub.github.io`.

## What is here

| Path | What |
|---|---|
| `site/` | The published website: plain HTML, CSS and JavaScript, no framework, no build step |
| `site/assets/` | Logos and background artwork |
| `site/cs.html`, `site/cs-script.js`, `site/cs-video.js` | The Czech page, served at https://linkport.cz/cs, and its scripts; made by the build |
| `tools/seo.py`, `tools/cs.py` | Search engine tags, registration details and the Czech page (see below) |
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages on every push to `main` |

## Rules the site keeps

- No analytics, no trackers, no cookies, no third-party fonts. Everything is served from this site.
- A Content-Security-Policy in `index.html` allows scripts, styles and images from this site only,
  and network requests only to Formspree.
- Every asset path is relative.
- The company's registration details are on the page, as § 435 of the Civil Code asks of a company's
  website: IČO 30152496, the commercial register at the Municipal Court in Prague, file C 458045, and the
  registered address as the register writes it (Vlkova 532/8, Žižkov, 130 00 Praha 3). `tools/seo.py`
  adds them, so they stay when the design changes. No phone numbers or company email are published
  until they exist.

## Contact form

The form posts to the Quotiflex Formspree endpoint `https://formspree.io/f/mljgbndd` with the subject
"Enquiry from the LinkPort Systems website", so enquiries from both sites arrive in the same inbox and
are told apart by the subject.

## Background artwork

The page uses the "electronics" background collage by default (`assets/engineering-mixed-v3*.svg`).
Adding `?background=classic` to the address switches to the earlier sketch artwork.
On wide sections the script adds `.engineering-spread`, and the CSS then shows the left and right
halves (`engineering-mixed-v3-left.svg`, `-right.svg`) at the two edges.

## The product videos (extras/)

The videos in "Our product" are not part of the design folder: they live in `extras/`, and
`tools/build.py` inserts them on every build, so a new version of the design keeps them.

| File | What |
|---|---|
| `extras/product-video.html` | the block inside `<section class="product-intro">`: one player, the text of the chosen video, the list of all videos, the note about YouTube |
| `extras/privacy-video.html` | the paragraph in "Privacy & website information" about how a video plays |
| `extras/video.css`, `extras/video.js` | the look; the click that puts YouTube's privacy-enhanced player (youtube-nocookie.com) in place of the poster; choosing a video in the list |
| `extras/assets/video-N-{640,1280,1920}.webp` | the posters, from the cover frame of each video |

The build also adds `frame-src https://www.youtube-nocookie.com` to the page's CSP. Before the
visitor presses play, the page requests nothing from YouTube; without script the poster and the
list entries are plain links to YouTube. If the design ever drops the product section or the
privacy paragraph, the build stops and says so, instead of publishing the page without the videos.

The player runs across the full width of the section, 1180 px: YouTube picks 1080p only for a wide
player (at about 750 px it plays 720p). Choosing a video in the list puts it in the player and starts
it, and the address gets its anchor (`#video-accessory-rules`), so a link with it opens the page with
that video in the player. Only one video plays at a time. To add a video, add its posters, add a
`<span class="video-anchor" id="video-...">` next to the others at the top of the block (the browser
scrolls a link with that anchor there), and copy a `<li>` of `<ol class="video-list">`: the same
anchor in `data-anchor`, the YouTube id in `href` and `data-youtube`, the
poster base in `data-poster`, the length in `data-length` and `data-length-label`, the text in
`data-desc`, and the picture, topic, title and length shown in the entry. The same videos are on
quotiflex.com/#videos.

## Search engines and the Czech page

`tools/build.py` calls `tools/seo.py` after it has put the page together. It

- sets the title (up to 60 characters) and the meta description (up to 155),
- adds Open Graph and Twitter tags with `assets/og-image.jpg` (Czech page: `assets/og-image-cs.jpg`),
  1200 x 630, made from the first screen of the page,
- adds JSON-LD: `Organization` (LinkPort Systems s.r.o., address, IČO, logo `assets/icon-192.png`,
  the brand Quotiflex), `WebSite` and `WebPage`,
- links the two languages with `hreflang` (en, cs, x-default = English) and adds "Česky" / "English" to
  the menu,
- adds the registration details to "Company details", the privacy text and the footer, and writes the
  street as the register does,
- makes `cs.html` from the finished English page with the pairs of `tools/cs.py`, and `cs-script.js`,
  `cs-video.js` from the two scripts (the workflow texts, the form messages, the video labels). The
  Czech page lives at the root (`/cs`, not `/cs/`), so every relative address of the design, also the
  ones in `engineering-network.js`, works on it unchanged.

Every text that `seo.py` and `cs.py` replace must be found. When the design changes an English text,
the build stops and names it: add or change its pair in `tools/cs.py` and build again. The design
folder still writes the street as "Vlková" and the district as "Praha"; the build corrects both, and
once the design folder is corrected, that rule finds nothing to change.

`site/sitemap.xml` lists both pages with their `hreflang` alternates. Google Search Console: the domain
property `linkport.cz`, owned by vs@linkport.cz (verified through the Google Workspace TXT record);
the sitemap is submitted there.

## AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot)

- `site/robots.txt`, `site/llms.txt` and the key file are not part of the design; `tools/build.py`
  keeps them (`OWN`). `site/robots.txt` allows every crawler and names the AI search and assistant crawlers explicitly
  (OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot,
  Google-Extended, Applebot-Extended, Bingbot and others). Do not block them: ChatGPT and Copilot
  search through Bing, Claude through its own crawlers and Brave, Gemini through Google.
- `site/llms.txt` is the short description of the site for AI assistants (the llms.txt convention),
  `the full product description is on quotiflex.com (`llms-full.txt`)`. Keep them in step with the page when a text or a fact changes.
- `site/323dad004b99ba6e889335e7b6417e60.txt` is the IndexNow key. After a change, send the changed addresses to
  `https://api.indexnow.org/indexnow?url=<address>&key=323dad004b99ba6e889335e7b6417e60`; Bing, Seznam and Yandex share them.
- AI assistants quote plain, complete sentences: every important fact (what the product is, who makes
  it, what the AI does, what it changes for sales) is written out once in plain words in the page and
  in the questions and answers, not only in pictures or in text that a script shows later.

## Change the site

The design is edited in its own folder (on Vladimir's computer: `E:\LinkPort website\linkport-landing\linkport-landing`).
To publish a new version of it, build `site/` from that folder and push to `main`:

```
python3 tools/build.py <design folder>
git add -A && git commit -m "..." && git push
```

The workflow publishes the new version within a minute or two. Do not copy the design folder into
`site/` by hand: the build is what keeps the page light. It

- publishes index.html, every local stylesheet and script it links, and only the images those files
  reference (no image prompts, no unused drafts),
- turns PNG images into WebP (quality 82; images with transparency at 90) and scales the header logo
  to 430 px wide, about three times its displayed width,
- keeps `linkport-symbol-reference.png` as PNG, because the script traces its pixels,
- stores the pencil drawing embedded in the SVG backgrounds as lossless WebP, blank outside the clip
  regions that show it and with only the red channel its `classic-ink` filter reads, so every visible
  pixel stays the same,
- adds `?v=<content hash>` to every local CSS, JS and image reference, so browsers never keep an old copy,
- sets `data-background="electronics"` and `data-accent="amber"` on `<html>`, so the browser does not
  download the classic artwork, or paint the copper accent, before the scripts switch them,
- adds the canonical link and the favicons to `<head>`, and
- deletes published assets that the design no longer references.
