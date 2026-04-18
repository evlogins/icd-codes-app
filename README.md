# ICD Code Explorer

A static reference site for the US **ICD-10-CM** diagnosis code set. Search by keyword or code number, read descriptions, billability, and category detail, and link out to canonical sources. Every code has its own URL and its own prerendered HTML page for SEO.

Live: **https://icd-codes-git.pages.dev**

## Stack

- **Vite 5** + **React 18** (single-page app, hydrated)
- **React Router v6** (real routes: `/`, `/search?q=`, `/code/:code`)
- **vite-react-ssg** — renders every route to static HTML at build time
- **Cloudflare Pages** — hosts the `frontend/build/` output; connected to GitHub for per-push builds
- **NLM Clinical Tables API** — browser-side fetch for any code outside the bundled dataset

No backend. No database. The code dataset is a committed JSON file; everything else is static.

## Project layout

```
icd-codes-app/
├── CLAUDE.md                       # Contributor guidelines
├── README.md
└── frontend/
    ├── index.html                  # Vite entry (head/meta are per-page via SEO.jsx)
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   ├── _redirects              # Cloudflare SPA fallback
    │   └── robots.txt              # Points at /sitemap.xml
    ├── scripts/
    │   ├── fetch-icd-codes.mjs     # One-shot: pull the full code list from NLM
    │   └── build-sitemap.mjs       # Post-build: write build/sitemap.xml
    └── src/
        ├── main.jsx                # ViteReactSSG entry
        ├── Layout.jsx              # Header + <Outlet/> + Footer
        ├── routes.jsx              # Data routes (+ getStaticPaths for /code/:code)
        ├── App.css                 # Design tokens, base, dark mode
        ├── api/icdApi.js           # NLM client (runtime fallback)
        ├── data/
        │   ├── icd10cm-codes.json  # Committed ICD-10-CM dataset
        │   └── codes.js            # getCodeFromDataset() lookup
        ├── state/AppContext.jsx    # Purpose (clinical/billing/research/public_health)
        ├── components/
        │   ├── Header.jsx          # Brand + nav
        │   ├── Footer.jsx          # Attribution line
        │   ├── SearchBar.jsx       # / keyboard shortcut, navigates to /search?q=
        │   ├── ResultsList.jsx     # Row-per-result, <Link> to /code/:code
        │   ├── ContextSelector.jsx # Purpose pill row
        │   └── SEO.jsx             # <title>, meta, OG, Twitter, canonical, MedicalCode JSON-LD
        └── pages/
            ├── HomePage.jsx
            ├── SearchPage.jsx
            ├── CodePage.jsx
            └── NotFoundPage.jsx
```

## Develop

```bash
cd frontend
npm install
npm run dev      # CSR, localhost:3000
```

Fast iteration runs in standard Vite dev (no SSR). The build verifies SSG.

## Build

```bash
npm run build    # vite-react-ssg build && node scripts/build-sitemap.mjs
npm run preview  # serve the built build/ directory
```

Build output goes to `frontend/build/`. Cloudflare Pages is configured with root `frontend` and output directory `build`.

Each code in `src/data/icd10cm-codes.json` becomes a prerendered HTML page (`build/code/E11.9.html` etc.) with real content in the body — no empty `<div id="root">`, no JS required for Google to read it. Every page ships with unique `<title>`, `<meta>`, Open Graph, Twitter Card, canonical URL, and — for code pages — schema.org `MedicalCode` JSON-LD.

## Refresh the code dataset

The sandbox can't reach NLM, so the full dataset refresh is a local task. Run from your machine when CMS publishes FY updates:

```bash
cd frontend
npm run fetch-codes    # ~2–5 min, prefix-walks NLM Clinical Tables
# writes src/data/icd10cm-codes.json
git add src/data/icd10cm-codes.json
git commit -m "data: refresh ICD-10-CM codes (FY xxxx)"
git push
```

The next CI build will prerender every new code and regenerate the sitemap (sitemap auto-splits into an index + chunks once past 50,000 URLs).

## Environment

- `VITE_SITE_URL` (optional) — base URL used in canonical/OG tags and sitemap entries. Defaults to `https://icd-codes-git.pages.dev`.

## Contributor guidelines

See `CLAUDE.md` for the four principles we work by — think before coding, simplicity first, surgical changes, goal-driven execution.

## Data source

- **NLM Clinical Tables ICD-10-CM API** — https://clinicaltables.nlm.nih.gov/
- **CMS** — https://www.cms.gov/Medicare/Coding/ICD10 (canonical FY descriptor files)

Informational use only. Not medical advice.

## License

MIT
