# Youth Ai Lab — Success Stories

A static site hosting the success stories from the four Youth Ai Lab partner labs. Each story is a self-contained carnet (HTML page) with its own unique URL, organised under a country folder.

Production URL: <https://youth-ai-lab.github.io/success-stories/>

## Structure

```
success-stories/
├── README.md
├── index.html                       Landing page with links to the template and the 4 countries
├── CommonVisuals/                   Shared assets (logos, banner, EU emblem)
│   ├── banner.png
│   ├── youthailab_rounded.png
│   ├── LogoLabFrance.png
│   ├── LogoLabItaly.png
│   ├── LogoLabSpain.png             (to add)
│   └── LogoLabBelgium.png           (to add)
├── template/
│   └── index.html                   Master template (currently demoed with the France Pacman's example)
├── france/
│   ├── index.html                   Country landing
│   ├── pacmans-success-01/          Per-story folder
│   │   ├── index.html
│   │   ├── hero.jpg
│   │   └── …
│   ├── pacmans-success-02/
│   └── …
├── italy/
│   ├── index.html
│   ├── faro-success-01/
│   └── …
├── spain/
│   ├── index.html
│   └── uab-success-01/
├── belgium/
│   ├── index.html
│   └── digitale-wolven-success-01/
├── success-story-template.md        Markdown source partners fill in
└── generate-pdf.js                  Puppeteer script to export a carnet to PDF
```

## URL conventions

- `/` — landing with links to the template and the four countries
- `/template/` — the master template carnet
- `/{country}/` — country landing with its list of stories
- `/{country}/{team-slug}-success-{NN}/` — a single published story

Country slugs: `france`, `italy`, `spain`, `belgium` (lowercase English, no accents).
Team slug: lowercase team identifier (`pacmans`, `faro`, `uab`, `digitale-wolven`).
Story number: two-digit padding (`01`, `02`, …).

Examples:

- `/france/pacmans-success-01/`
- `/italy/faro-success-03/`
- `/belgium/digitale-wolven-success-01/`
- `/spain/uab-success-02/`

## Publishing a new story

1. **Partner fills the markdown template**

   Send the partner `success-story-template.md`. They fill in the frontmatter and each section, then return the filled `.md` plus the media files (hero, video, productions, lab logo).

2. **Create the story folder**

   - Copy `template/index.html` to a new folder under the right country, named with the team+number slug, e.g. `france/pacmans-success-02/index.html`.
   - Replace the placeholder content in the HTML with the partner's filled content (period, country, title, lab name, lab logo path, the five chapters, the quote, the numbers, the gallery photos).
   - Drop the media files in the same folder. Update the paths in the HTML so they point to the local files.
   - Asset paths: from a story folder (depth 2), `CommonVisuals/` is referenced as `../../CommonVisuals/`.

3. **Update the country index**

   Edit `{country}/index.html` and add a story card linking to the new story.

4. **Commit and push** — GitHub Pages redeploys automatically. The new story is live at `/{country}/{slug}/`.

## Local preview

```bash
cd success-stories
python3 -m http.server 8000
# then open http://localhost:8000/
```

## PDF export

Two paths:

- **In-browser**: open a carnet (e.g. `template/`), click the *Download this story as PDF* button. The print stylesheet flattens the book into A4 pages and the Pacman avatar plus the lab logo float to the right of the content.
- **Headless / batch**: install the dependencies once and run Puppeteer:
  ```bash
  npm init -y && npm install puppeteer pdf-lib
  node generate-pdf.js template/index.html template/story.pdf
  ```
  This renders each spread of the carnet at 1500×950 and stitches them into a single PDF.

## Deployment (GitHub Pages)

- Default URL: `https://youth-ai-lab.github.io/success-stories/`
- **Custom domain (optional)**: add a `CNAME` file at the root containing e.g. `stories.youth-ai-lab.eu`, then point a CNAME DNS record `stories` → `youth-ai-lab.github.io`. Enable HTTPS in Pages settings once the cert provisions.

## Editorial guidelines for partners

See `success-story-template.md` for the writing principles partners follow when filling a story:

- Dignify, do not glorify
- Go beyond the *what*, reach the *why*
- Concrete shifts, not broad statements
- Numbers that show the shift
- Final word in the mentors' voice

## Co-funding

Co-funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
