# PySteps

A colorful, beginner-first Python course with 17 chapters. Each chapter
includes a plain-language foundation, concept notes, five original code
examples with sample output, and a short knowledge check. The course covers
core Python plus virtual environments, NumPy, pandas, and SciPy. Chapter search
and lesson progress are saved in the browser.

## Run locally

From the repository root, start Python's static file server:

```powershell
python -m http.server 8000 --directory abhishek_home
```

Open <http://127.0.0.1:8000>. The learning site itself needs no backend or
packages. Core examples use Python 3; the NumPy, pandas, and SciPy examples also
need those packages installed in the environment where you run the code.

To prepare a project environment in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install numpy pandas scipy
```

On macOS or Linux, activate the environment with
`source .venv/bin/activate` instead.
Choose a Python release supported by all three libraries. If pip cannot find a
compatible package build, check the libraries' current Python-version
requirements.

## Deploy to Render

The root `render.yaml` publishes this folder as a static site. Sync the
repository's Render Blueprint to deploy updates. The current public URL is
<https://maths-made-clear.onrender.com>.
