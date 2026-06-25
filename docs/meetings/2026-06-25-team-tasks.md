# Meeting notes — June 25, 2026

**Attendees:** Mahad, Salama, Abdulla (and cofounders as needed)  
**Type:** Team sync — technical task handoff

---

## Summary

Mahad is assigning **one technical task each** to Salama and Abdulla. These are scoped pieces of work, not permanent ownership areas. Full specs live in [HOW_WE_WORK.md](../HOW_WE_WORK.md) → **Open tasks**. GitHub issues track progress.

---

## Technical tasks assigned

### Salama (CTO) — Prompt safety / guardrails

| | |
|---|---|
| **Issue** | [#13](https://github.com/Retriive/campusQ/issues/13) |
| **In one line** | Add safety rules to the chatbot system prompt so CampusQ refuses cheating, off-topic, crisis/medical/legal, and prompt-injection requests — without breaking normal Carleton answers. |
| **Touches** | `backend/main.py`, `backend/evals/datasets/golden.csv` |
| **Before merge** | Smoke 10/10, core ≥ 27/32 — Mahad reviews |

---

### Abdulla — Production smoke gate in CI

| | |
|---|---|
| **Issue** | [#16](https://github.com/Retriive/campusQ/issues/16) |
| **In one line** | GitHub Actions runs smoke (10/10) against production after every push to `main`, so we don't ship a broken chatbot. |
| **Touches** | `.github/workflows/smoke-gate.yml` (new) |
| **Blocked on** | Mahad adds `CAMPUSQ_API_URL` + `OPENAI_API_KEY` as repo secrets |
| **Before merge** | One green Actions run — Mahad reviews |

---

## How we work on these

1. Pick up the GitHub issue → branch → PR (see [HOW_WE_WORK.md](../HOW_WE_WORK.md))
2. Say in team chat when you start, so nobody duplicates work
3. Mahad reviews and merges — especially for prompt changes (Salama) and CI (Abdulla)

---

## Action items

| Who | Action |
|-----|--------|
| **Salama** | Start [#13](https://github.com/Retriive/campusQ/issues/13) — prompt guardrails + golden tests |
| **Abdulla** | Start [#16](https://github.com/Retriive/campusQ/issues/16) — GitHub Actions smoke on prod |
| **Mahad** | Add GitHub Actions secrets for Abdulla; review both PRs before merge |

---

## Links

- Task details: [HOW_WE_WORK.md → Open tasks](../HOW_WE_WORK.md#open-tasks)
- Deploy / test rules: [TEAM_RULES.md](../TEAM_RULES.md), [QUALITY_GATE.md](../QUALITY_GATE.md)
