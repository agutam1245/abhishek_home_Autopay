# Maths, Made Clear

A responsive, static Class 10 CBSE maths study companion. It includes chapter-wise concept summaries, quick-reference formulas, original worked examples, chapter search, and local review progress.

The site is an independent study aid, not affiliated with CBSE or NCERT. Its examples are original and it does not reproduce the textbook or provide a complete textbook answer key.

## Run locally

From the repository root, start Python's static file server:

```powershell
python -m http.server 8000 --directory abhishek_home
```

Then open <http://127.0.0.1:8000>.

Progress is saved in the browser's local storage. No backend or package installation is required.

## Deploy to Render

The repository-root `render.yaml` defines this folder as a separate static site
named `maths-made-clear`, alongside the existing Autopay service. Create or sync
the repository's Render Blueprint to provision the site. Once synced, Render
publishes this folder and can deploy future commits automatically.
