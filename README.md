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

The page uses the "electronics" background collage by default (`assets/engineering-mixed-v2.svg`).
Adding `?background=classic` to the address switches to the earlier sketch artwork.

## Change the site

Edit the files in `site/`, open `site/index.html` in a browser to check, commit and push to `main`.
The workflow publishes the new version within a minute or two.
