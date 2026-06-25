# PR Review Agent

Automatically reviews GitHub pull requests assigned to you — **no manual steps after one-time setup**.

---

## How it works

```
PR assigned to you (or review requested)
        ↓
GitHub Action fires (.github/workflows/pr-review-agent.yml)
        ↓
Checks: right user? already reviewed this commit?
        ↓
Spawns Cursor Cloud Agent on the PR
        ↓
Agent reads CampusQ rubric → posts review on GitHub
```

You assign yourself (or get requested as reviewer) on a PR. The agent reviews it and posts feedback within a few minutes. You don't open Cursor or run any commands.

---

## One-time setup (5 minutes)

### 1. Add GitHub secrets & variables

In [github.com/Retriive/campusQ/settings/secrets/actions](https://github.com/Retriive/campusQ/settings/secrets/actions):

| Name | Type | Value |
|------|------|-------|
| `CURSOR_API_KEY` | Secret | From [cursor.com/dashboard](https://cursor.com/dashboard) → **API Keys** |

In [Settings → Variables → Actions](https://github.com/Retriive/campusQ/settings/variables/actions):

| Name | Value |
|------|-------|
| `PR_REVIEW_USER` | Your GitHub username (e.g. `mahadmyonis`) |

### 2. Merge this PR

The workflow file ships with the repo. Once merged to `main`, it runs automatically.

### 3. Test it

1. Open any PR on the repo
2. Assign yourself (or request yourself as reviewer)
3. Watch **Actions → PR Review Agent** — should trigger within ~1 minute
4. Agent posts a review tagged `<!-- campusq-pr-review-agent -->`

Manual test:

```bash
gh workflow run pr-review-agent.yml -f pr_number=12
```

---

## What triggers a review

| Event | When |
|-------|------|
| PR assigned to you | Someone assigns you on GitHub |
| Review requested | You're added as a reviewer |
| PR opened / updated | You're already assignee or reviewer |
| Every 30 min (cron) | Catches anything webhooks missed |

**Skipped when:**

- PR is a draft
- You're the PR author
- Latest commit already has an automated review

---

## What it checks

| Area | Source |
|------|--------|
| PR description template | [HOW_WE_WORK.md](HOW_WE_WORK.md) |
| Deploy / expansion gates | [TEAM_RULES.md](TEAM_RULES.md) |
| Which tests to run | [QUALITY_GATE.md](QUALITY_GATE.md) |
| File ownership & risk | [PROJECT_MAP.md](PROJECT_MAP.md) |

### Automatic gate detection

| Changed files | Required gate |
|---------------|---------------|
| `main.py`, `retrieval.py`, `citations.py`, scrapers, `golden.csv` | **core** (≥27/32) |
| Other `backend/` files | **smoke** (10/10) |
| `docs/` or `frontend/` only | **none** (N/A OK) |

---

## Alternative: Cursor Automation (no GitHub Action)

If you prefer managing this in the Cursor dashboard instead of GitHub Actions:

1. Go to [cursor.com/automations](https://cursor.com/automations) → **New automation**
2. **Trigger:** GitHub → `Retriive/campusQ` → PR opened / PR pushed / Review requested
3. **Repository:** `Retriive/campusQ`
4. **Tools:** enable **Comment on pull request**
5. **Prompt:** paste contents of `.cursor/automations/pr-review-assigned.prompt.md`
6. Save and enable

This runs entirely in Cursor's cloud — no `CURSOR_API_KEY` in GitHub needed.

---

## Manual use (optional)

```bash
# List PRs waiting for you
python3 scripts/pr_review/review_assigned_prs.py list --include-reviewer

# Inspect one PR
python3 scripts/pr_review/review_assigned_prs.py context --number 12

# Trigger agent manually
python3 scripts/pr_review/trigger_cursor_review.py --pr-url https://github.com/Retriive/campusQ/pull/12
```

---

## Files

| Path | Purpose |
|------|---------|
| `.github/workflows/pr-review-agent.yml` | Automatic trigger on GitHub |
| `.cursor/automations/pr-review-assigned.prompt.md` | Agent prompt (automation mode) |
| `.cursor/skills/review-assigned-prs/SKILL.md` | Full review rubric |
| `scripts/pr_review/select_prs.py` | Picks PRs that need review |
| `scripts/pr_review/trigger_cursor_review.py` | Starts Cursor Cloud Agent |
| `scripts/pr_review/review_assigned_prs.py` | CLI helpers (list, context, post) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Workflow doesn't run | Check `PR_REVIEW_USER` matches your GitHub username exactly |
| "CURSOR_API_KEY not set" | Add secret in repo Settings → Secrets |
| Agent runs but no review posted | Check agent run at cursor.com/agents — may need GitHub app permissions |
| Duplicate reviews on every push | Should only re-review new commits; check for `campusq-pr-review-agent` marker |
| Want to review as yourself, not bot | Use Cursor Automation (uses your auth) instead of GitHub Action |
