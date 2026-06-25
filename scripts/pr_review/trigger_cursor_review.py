#!/usr/bin/env python3
"""Trigger a Cursor Cloud Agent to review pull requests automatically."""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

CURSOR_API_URL = "https://api.cursor.com/v1/agents"
DEFAULT_REPO_URL = "https://github.com/Retriive/campusQ"
PROMPT_FILE = Path(__file__).resolve().parents[2] / ".cursor" / "automations" / "pr-review-assigned.prompt.md"


def load_prompt() -> str:
    if PROMPT_FILE.exists():
        return PROMPT_FILE.read_text(encoding="utf-8")
    return """You are the CampusQ PR review agent (automation mode).

Review the pull request using .cursor/skills/review-assigned-prs/SKILL.md.

AUTOMATION RULES:
- Do NOT ask for confirmation — post the review automatically
- Use scripts/pr_review/review_assigned_prs.py for context
- Post via: gh pr review --event APPROVE|REQUEST_CHANGES|COMMENT
- Include <!-- campusq-pr-review-agent --> in the review body
- Skip if that marker already exists on the latest commit
"""


def trigger_agent(*, pr_url: str, repo_url: str, api_key: str) -> dict[str, Any]:
    payload = {
        "prompt": {"text": load_prompt()},
        "repos": [
            {
                "url": repo_url,
                "prUrl": pr_url,
            }
        ],
    }
    data = json.dumps(payload).encode("utf-8")
    token = base64.b64encode(f"{api_key}:".encode()).decode()
    request = urllib.request.Request(
        CURSOR_API_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {token}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode()
        raise RuntimeError(f"Cursor API {exc.code}: {body}") from exc


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr-url", help="Single PR URL to review")
    parser.add_argument("--from-file", type=Path, help="JSON file from select_prs.py")
    parser.add_argument("--repo-url", default=os.environ.get("REPO_URL", DEFAULT_REPO_URL))
    args = parser.parse_args()

    api_key = os.environ.get("CURSOR_API_KEY")
    if not api_key:
        print(
            "Error: CURSOR_API_KEY not set. Add it in GitHub → Settings → Secrets → Actions.\n"
            "Get a key from cursor.com/dashboard → API Keys.\n"
            "Alternative: set up a Cursor Automation in the dashboard (see docs/PR_REVIEW_AGENT.md).",
            file=sys.stderr,
        )
        return 1

    prs: list[dict[str, Any]] = []
    if args.from_file:
        prs = json.loads(args.from_file.read_text(encoding="utf-8"))
    elif args.pr_url:
        prs = [{"url": args.pr_url}]
    else:
        parser.error("Provide --pr-url or --from-file")

    for pr in prs:
        url = pr["url"]
        number = pr.get("number", "?")
        print(f"Triggering Cursor agent for PR #{number}: {url}")
        result = trigger_agent(pr_url=url, repo_url=args.repo_url, api_key=api_key)
        agent = result.get("agent", {})
        agent_url = agent.get("url", "(no url)")
        print(f"  Agent started: {agent_url}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
