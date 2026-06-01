# Youth Ai Lab — Success Stories

A static site hosting the success stories from the four Youth Ai Lab partner labs across Europe. Each story is a self-contained carnet (HTML page) generated from a markdown source filled in by the lab team.

Production URL: configured via GitHub Pages (see Deployment below).

## Structure

```
SuccessStories/
├── index.html                  Landing page listing the four countries
├── README.md
├── CommonVisuals/              Shared assets (logos, banner, EU emblem)
│   ├── banner.png
│   ├── youthailab_rounded.png
│   ├── LogoLabFrance.png
│   ├── LogoLabItaly.png
│   ├── LogoLabSpain.png        (to add)
│   └── LogoLabBelgium.png      (to add)
├── italy/                      One folder per country
│   ├── index.html              Country landing: list of stories
│   └── 01/                     One folder per story, two-digit padding
│       ├── index.html          The success story carnet
│       ├── hero.jpg            Story-specific media
│       └── …
├── france/
│   ├── index.html
│   ├── 01/                     Le retour des Pacman's
│   └── …
├── spain/
│   └── index.html
├── belgium/
│   └── index.html
├── success-story-template.md   Markdown template for partners
└── generate-pdf.js             Puppeteer script to export a carnet to PDF
```

## URL conventions

- `/` — landing with four country cards
- `/{country}/` — country landing with its list of stories
- `/{country}/{NN}/` — a single story (carnet)

Country slugs: `italy`, `france`, `spain`, `belgium` (lowercase English, no accents).
Story numbers: two-digit padding (`01`, `02`, …, `12`) for natural sort order.

## Adding a new success story

1. **Get the markdown template**

   Send the partner the file `success-story-template.md`. They fill in the frontmatter and each section, then return the filled `.md` plus the media files (hero image, video, productions).

2. **Generate the carnet**

   (Once the generator script is wired) run:
   ```bash
   node generate-from-md.js path/to/filled.md italy/02/
   ```
   This drops the carnet `index.html` into the destination, copies the media files, and updates the country index.

3. **Update the country index**

   Edit `{country}/index.html` and add a card linking to the new story.

4. **Commit and push** — GitHub Pages will redeploy automatically.

## Local preview

Any modern browser can open the HTML files directly:

```bash
open SuccessStories/index.html
```

For a more accurate Pages-like preview that handles relative paths cleanly:

```bash
cd SuccessStories
python3 -m http.server 8000
# then open http://localhost:8000/
```

## PDF export

Two paths:

- **In-browser**: open a carnet (e.g. `france/01/`), click the *Download this story as PDF* button. The print stylesheet flattens the book into A4 pages.
- **Headless / batch**: from the `SuccessStories/` folder, install dependencies once and run:
  ```bash
  npm init -y && npm install puppeteer pdf-lib
  node generate-pdf.js france/01/index.html france/01/story.pdf
  ```
  This renders each spread of the carnet at 1500×950 and stitches them into a single PDF.

## Deployment (GitHub Pages)

1. Push the `SuccessStories/` content to a public GitHub repo (e.g. `youthailab/success-stories`). It can be the whole project or this folder copied as the repo root.
2. In the repo settings → Pages, set the source to `main` branch / `/` (root) — or `/docs` if you nest one level.
3. Default URL: `https://{org}.github.io/{repo}/`.
4. **Custom domain (recommended)**: add a `CNAME` file at the root containing e.g. `stories.youth-ai-lab.eu`, then point a CNAME DNS record `stories` → `{org}.github.io`. Enable HTTPS in Pages settings once the cert provisions.

## Editorial guidelines

See `success-story-template.md` for the writing principles partners follow when filling a story:

- Dignify, do not glorify
- Go beyond the *what*, reach the *why*
- Concrete shifts, not broad statements
- Numbers that show the shift
- Final word in the mentors' voice

## Co-funding

Co-funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
