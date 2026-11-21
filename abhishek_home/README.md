# PySteps

A colorful, beginner-friendly Python course with 13 chapters. Each chapter
includes concept notes, four commented code examples with sample output, and a
short knowledge check. Chapter search and lesson progress are saved in the
browser.

## Run locally

From the repository root, start Python's static file server:

```powershell
python -m http.server 8000 --directory abhishek_home
```

Open <http://127.0.0.1:8000>. Copy an example into a Python 3 interpreter to
experiment with it. The learning site itself needs no backend or packages.

## Deploy to Render

The root `render.yaml` publishes this folder as a static site. Sync the
repository's Render Blueprint to deploy updates. The current public URL is
<https://maths-made-clear.onrender.com>.
