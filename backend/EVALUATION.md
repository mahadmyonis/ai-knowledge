# Evaluation (developer reference)

**Team guide:** [docs/QUALITY_GATE.md](../docs/QUALITY_GATE.md)

This file is for developers who want technical detail on how evaluation works.

---

## Overview

CampusQ uses an automated **quality gate** — a script that sends real questions to the chat API and checks answers against rules.

- **Smoke tier** — 10 critical questions. Must pass 100% before deploy.
- **Core tier** — 32 questions covering common student needs. Must pass ≥ 85% before expanding to a second school.

---

## How checks work

Each question in `evals/datasets/golden.csv` has:

- `must_contain` — all phrases must appear (separated by `|`)
- `must_contain_any` — at least one phrase must appear
- `must_not_contain` — forbidden phrases
- `require_no_sources` — `yes` if "I don't know" answers must have zero sources
- `grading_notes` — used by the LLM judge for nuanced checks

---

## Run locally

```powershell
cd backend
py evals\quality_gate.py --tier smoke
py evals\quality_gate.py --tier core
py evals\quality_gate.py --tier full    # all questions
```

Against production:

```powershell
py evals\quality_gate.py --tier smoke --api-url https://your-api.onrender.com
```

---

## Add a test question

Edit `evals/datasets/golden.csv`:

```csv
tier,id,category,question,grading_notes,must_contain,must_contain_any,must_not_contain,require_no_sources
core,core-33,Registration,Your question here,Must explain X,expected phrase,,,
```

Run the gate again to verify.

---

## Results

CSV + JSON reports save to `evals/experiments/` with timestamp, pass/fail per question, and overall score.

---

## Policy

See [docs/TEAM_RULES.md](../docs/TEAM_RULES.md) for deploy, expansion, and freeze rules.
