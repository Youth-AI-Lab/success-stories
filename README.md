# Youth Ai Lab — Success Stories

A repository hosting the success stories written by the four Youth Ai Lab partner labs. Each story is a self-contained static page, deployed on GitHub Pages, with its own unique URL. There is no global index — each carnet stands alone.

The carnet in `template/` is the master template. Every new story copies it as a starting point, lives in its own folder at the root of the repo, and is published as a fresh URL.

## Structure

```
success-stories/
├── README.md
├── CommonVisuals/              Shared assets (logos, banner, EU emblem)
│   ├── banner.png
│   ├── youthailab_rounded.png
│   ├── LogoLabFrance.png
│   ├── LogoLabItaly.png
│   ├── LogoLabSpain.png        (to add)
│   └── LogoLabBelgium.png      (to add)
├── template/
│   └── index.html              Master template (currently demoed with "Le retour des Pacman's")
├── success-story-template.md   Markdown source partners fill in
├── generate-pdf.js             Puppeteer script that exports a carnet to a clean PDF
├── {story-slug-1}/             One folder per published story, slug chosen freely
│   ├── index.html
│   ├── hero.jpg
│   └── …
├── {story-slug-2}/
└── …
```

## URL convention

Each story has its own URL, no central hub:

- `…/success-stories/template/` — the master template
- `…/success-stories/{slug}/` — a single published story

The slug is whatever the lab and the coordinator agree on for that story. Keep it readable, lowercase, hyphenated, e.g. `france-pacmans-niveau-2`, `italy-bias-bot`, `belgium-wolfpack-debate`.

## Publishing a new story

1. **Partner fills the markdown template**

   Send the partner `success-story-template.md`. They fill in the frontmatter and each section, then return the filled `.md` plus the media files (hero, video, productions, logos).

2. **Generate the carnet folder**

   - Copy `template/index.html` to a new folder named with the story slug, e.g. `france-pacmans-niveau-2/index.html`.
   - Replace the placeholder content in the HTML with the partner's filled content (period, country, title, lab name, lab logo path, the five chapters, the quote, the numbers, the gallery photos).
   - Drop the media files in the same folder. Update the paths in the HTML so they point to the local files.

3. **Commit and push** — GitHub Pages redeploys automatically. The new story is live at `…/success-stories/{slug}/`.

## Local preview

```bash
cd success-stories
python3 -m http.server 8000
# then open http://localhost:8000/template/
```

## PDF export

Two paths:

- **In-browser**: open a carnet, click the *Download this story as PDF* button. The print stylesheet flattens the book into A4 pages and the Pacman avatar plus the lab logo float to the right of the content.
- **Headless / batch**: install the dependencies once and run Puppeteer:
  ```bash
  npm init -y && npm install puppeteer pdf-lib
  node generate-pdf.js template/index.html template/story.pdf
  ```
  This renders each spread of the carnet at 1500×950 and stitches them into a single PDF.

## Deployment (GitHub Pages)

The repo is published as a GitHub Pages site:

- Default URL: `https://youth-ai-lab.github.io/success-stories/`
- Custom domain (optional): add a `CNAME` file at the root containing the target host (e.g. `stories.youth-ai-lab.eu`), then point a CNAME DNS record `stories` → `youth-ai-lab.github.io`. Enable HTTPS in Pages settings once the cert provisions.

## Editorial guidelines for partners

See `success-story-template.md` for the writing principles partners follow when filling a story:

- Dignify, do not glorify
- Go beyond the *what*, reach the *why*
- Concrete shifts, not broad statements
- Numbers that show the shift
- Final word in the mentors' voice

## Co-funding

Co-funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
