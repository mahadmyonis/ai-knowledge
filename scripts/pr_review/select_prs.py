#!/usr/bin/env python3
"""Select open PRs that need an automated review for the configured user."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from typing import Any

DEFAULT_REPO = "Retriive/campusQ"
DEFAULT_USER = "mahadmyonis"
REVIEW_MARKER = "campusq-pr-review-agent"
DEFAULT_REPO_URL = "https://github.com/Retriive/campusQ"


def run_gh(args: list[str], *, repo: str) -> Any:
    cmd = ["gh", *args, "--repo", repo]
    result = subprocess.run(cmd, capture_output=True, text=True, env={**os.environ})
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    if not result.stdout.strip():
        return None
    return json.loads(result.stdout)


def target_user() -> str:
    return os.environ.get("PR_REVIEW_USER") or DEFAULT_USER


def repo_slug() -> str:
    return os.environ.get("GITHUB_REPOSITORY") or DEFAULT_REPO


def already_reviewed(number: int, repo: str) -> bool:
    """Skip if the latest commit already has our automated review."""
    pr = run_gh(
        [
            "pr",
            "view",
            str(number),
            "--json",
            "commits,reviews",
        ],
        repo=repo,
    )
    commits = pr.get("commits") or []
    if not commits:
        return False
    latest_sha = commits[-1]["oid"]

    for review in reversed(pr.get("reviews") or []):
        body = review.get("body") or ""
        if REVIEW_MARKER not in body:
            continue
        commit_sha = review.get("commit", {}).get("oid")
        if commit_sha == latest_sha:
            return True
        # Older automated review on a previous commit — review again
        return False
    return False


def pr_matches_user(pr_number: int, user: str, repo: str) -> bool:
    pr = run_gh(
        [
            "pr",
            "view",
            str(pr_number),
            "--json",
            "assignees,reviewRequests,isDraft,author",
        ],
        repo=repo,
    )
    if pr.get("isDraft"):
        return False
    if pr.get("author", {}).get("login") == user:
        return False

    assignees = {a["login"] for a in pr.get("assignees") or []}
    if user in assignees:
        return True

    reviewers = {r["login"] for r in pr.get("reviewRequests") or []}
    return user in reviewers


def event_pr_numbers() -> list[int]:
    event = os.environ.get("EVENT_NAME", "")
    if event == "workflow_dispatch":
        raw = os.environ.get("PR_NUMBER", "").strip()
        return [int(raw)] if raw.isdigit() else []

    if event == "pull_request":
        user = target_user()
        action = os.environ.get("EVENT_ACTION", "")
        pr_number = int(os.environ["PR_NUMBER"])

        if action == "assigned":
            if os.environ.get("ASSIGNEE_LOGIN") == user:
                return [pr_number]
            return []

        if action == "review_requested":
            if os.environ.get("REQUESTED_REVIEWER") == user:
                return [pr_number]
            return []

        assignees = json.loads(os.environ.get("PR_ASSIGNEES") or "[]")
        reviewers = json.loads(os.environ.get("PR_REQUESTED_REVIEWERS") or "[]")
        assigned = any(a.get("login") == user for a in assignees)
        requested = any(r.get("login") == user for r in reviewers)
        if assigned or requested:
            return [pr_number]
        return []

    return []


def scan_assigned_prs(user: str, repo: str) -> list[int]:
    numbers: list[int] = []

    assignee_prs = run_gh(
        [
            "pr",
            "list",
            "--assignee",
            user,
            "--state",
            "open",
            "--json",
            "number,isDraft",
        ],
        repo=repo,
    )
    for pr in assignee_prs:
        if not pr.get("isDraft"):
            numbers.append(pr["number"])

    reviewer_prs = run_gh(
        [
            "pr",
            "list",
            "--search",
            f"review-requested:{user} is:open",
            "--json",
            "number,isDraft",
        ],
        repo=repo,
    )
    for pr in reviewer_prs:
        if not pr.get("isDraft") and pr["number"] not in numbers:
            numbers.append(pr["number"])

    return numbers


def select_prs() -> list[dict[str, Any]]:
    user = target_user()
    repo = repo_slug()
    event = os.environ.get("EVENT_NAME", "schedule")

    if event == "schedule":
        candidates = scan_assigned_prs(user, repo)
    else:
        candidates = event_pr_numbers()

    selected: list[dict[str, Any]] = []
    for number in candidates:
        if not pr_matches_user(number, user, repo):
            continue
        if already_reviewed(number, repo):
            continue
        pr = run_gh(["pr", "view", str(number), "--json", "url,title"], repo=repo)
        selected.append(
            {
                "number": number,
                "url": pr["url"],
                "title": pr["title"],
                "assignee": user,
            }
        )
    return selected


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    try:
        prs = select_prs()
    except RuntimeError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(prs, indent=2))
    else:
        for pr in prs:
            print(f"#{pr['number']} {pr['title']} — {pr['url']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
