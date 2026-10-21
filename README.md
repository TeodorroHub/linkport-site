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
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages on every push to `main` |

## Rules the site keeps

- No analytics, no trackers, no cookies, no third-party fonts. Everything is served from this site.
- A Content-Security-Policy in `index.html` allows scripts, styles and images from this site only,
  and network requests only to Formspree.
- Every asset path is relative.
- No registration numbers, phone numbers or company email are published until they exist.

## Contact form

The form posts to the Quotiflex Formspree endpoint `https://formspree.io/f/mljgbndd` with the subject
"Enquiry from the LinkPort Systems website", so enquiries from both sites arrive in the same inbox and
are told apart by the subject.

## Background artwork

The page uses the "electronics" background collage by default (`assets/engineering-mixed-v3*.svg`).
Adding `?background=classic` to the address switches to the earlier sketch artwork.
On wide sections the script adds `.engineering-spread`, and the CSS then shows the left and right
halves (`engineering-mixed-v3-left.svg`, `-right.svg`) at the two edges.

## The product video (extras/)

The video in "Our product" is not part of the design folder: it lives in `extras/`, and
`tools/build.py` inserts it on every build, so a new version of the design keeps it.

| File | What |
|---|---|
| `extras/product-video.html` | the blocks inside `<section class="product-intro">`, one per video: our poster, a link to the video on YouTube, the text, links to YouTube and to quotiflex.com/#videos |
| `extras/privacy-video.html` | the paragraph in "Privacy & website information" about how the video plays |
| `extras/video.css`, `extras/video.js` | the look, and the click that puts YouTube's privacy-enhanced player (youtube-nocookie.com) in place of the poster |
| `extras/assets/video-N-*.webp` | the posters, from the cover frame of each video |

The build also adds `frame-src https://www.youtube-nocookie.com` to the page's CSP. Before the
visitor presses play, the page requests nothing from YouTube; without script the poster is a plain
link to YouTube. If the design ever drops the product section or the privacy paragraph, the build
stops and says so, instead of publishing the page without the video.

`extras/product-video.html` holds one `<div class="product-video">` per video, each across the full
width of the section (YouTube picks 1080p only for a wide player; at about 750 px it plays 720p).
To add a video, copy a block and change the YouTube id, the title, the length and the text, and add
its posters `extras/assets/video-N-{640,1280,1920}.webp` from the cover frame. Only one video plays
at a time: starting another puts the poster back on the first. All videos are on quotiflex.com.

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
