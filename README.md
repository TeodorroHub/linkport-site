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
