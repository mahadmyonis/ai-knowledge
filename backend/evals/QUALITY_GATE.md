# Quality Gate (quick reference)

**Full team guide:** [docs/QUALITY_GATE.md](../../docs/QUALITY_GATE.md)

---

## Run tests

```powershell
cd backend
py -m uvicorn main:app --reload --port 8000   # Terminal 1

py evals\quality_gate.py --tier smoke          # Terminal 2 — must be 100%
py evals\quality_gate.py --tier core           # must be ≥ 85%
```

---

## Rules

| Tier | Pass? | Meaning |
|------|-------|---------|
| Smoke (10 Qs) | 100% | Safe to deploy |
| Core (32 Qs) | ≥ 85% | Safe to expand to school #2 |
| Core < 80% | — | Feature freeze |

---

## Files here

| File | Purpose |
|------|---------|
| `quality_gate.py` | Test runner |
| `datasets/golden.csv` | Test questions |
| `experiments/` | CSV + JSON reports after each run |
