# RI Library

An open shelf of computer science books. Browse by **category**, **title (A–Z)** or **author**, search across everything, and **read each book in the browser** (or download the PDF).

The UI follows the RI Research Lab design system, retuned for a library: paper-cream surfaces, library-green ink, brass accents, and a serif display face.

## Run

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # outputs dist/ (includes the PDFs)
npm run deploy     # publish dist/ to GitHub Pages via gh-pages
```

## Deploy (GitHub Pages)

The site is published at **https://mdrakibtrofder.github.io/library/** by `.github/workflows/deploy.yml`.

1. Push this repo to `github.com/mdrakibtrofder/library` (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** (one time only).
3. Every push to `main` now type-checks, builds and deploys. You can also run it by hand from the **Actions** tab.

The app uses a relative base (`./`) and `HashRouter`, so it works under `/library/` without further config.

## Add a book

1. Drop the PDF into `public/resources/` (use a lowercase-kebab-case file name, e.g. `clean-architecture.pdf`).
2. Add an entry to `src/data/books.json`:

```json
{
  "id": "clean-architecture",
  "title": "Clean Architecture",
  "subtitle": "A Craftsman's Guide to Software Structure and Design",
  "authors": ["Robert C. Martin"],
  "category": "software-engineering",
  "pages": 432,
  "sizeMB": 9.1,
  "edition": "",
  "description": "One or two sentences about the book.",
  "file": "clean-architecture.pdf"
}
```

`id` must equal the file name without `.pdf`. Valid `category` ids are defined in `src/lib/catalog.ts`
(`algorithms`, `programming`, `software-engineering`, `systems`, `networking`, `databases`, `system-design`,
`devops`, `ai-ml`, `theory`, `guides`). Add a new category there to create a new shelf.

## Notes

- Routing uses `HashRouter` (`/#/read/<id>`), so deep links work on GitHub Pages without extra config.
- `_duplicates/` holds two byte-identical PDFs that were removed from the catalogue; it is not published.
- GitHub rejects single files over 100 MB and recommends sites under 1 GB; the current set is ~580 MB.
