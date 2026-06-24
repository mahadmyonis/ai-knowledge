# CampusQ Backend

FastAPI server that powers CampusQ chat, retrieval, and quality testing.

**New to the project?** Start at the [main README](../README.md) and [Getting Started](../docs/GETTING_STARTED.md).

---

## What this folder does

| File / folder | Purpose |
|---------------|---------|
| `main.py` | API routes, chat logic, system prompt |
| `retrieval.py` | Search Pinecone, rerank results |
| `citations.py` | Format and filter source links |
| `ingest.py` | Load Carleton calendar into Pinecone |
| `evals/` | Automated quality tests |
| `data/` | Scraped calendar text files |
| `requirements.txt` | Python dependencies |

---

## Run locally

```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

## Environment variables

Create `backend/.env`:

```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
COHERE_API_KEY=...   # optional — better reranking
```

---

## Main endpoints

| Endpoint | What it does |
|----------|--------------|
| `POST /chat` | Main chat (used by frontend) |
| `POST /chat/stream` | Streaming chat |
| `GET /health` | Health check |
| `GET /docs` | Interactive API docs |

---

## Re-index calendar data

Only needed when calendar content changes:

```powershell
py ingest.py
```

This wipes and rebuilds the Pinecone index. Takes several minutes.

---

## Run quality tests

Server must be running first.

```powershell
py evals\quality_gate.py --tier smoke
py evals\quality_gate.py --tier core
```

Full guide: [docs/QUALITY_GATE.md](../docs/QUALITY_GATE.md)

---

## Logs (useful for debugging)

| File | What's in it |
|------|--------------|
| `feedback.log` | User thumbs up/down |
| `no_context.log` | Questions where retrieval found nothing |
| `evals/experiments/` | Quality gate CSV + JSON reports |

---

## Key concepts

**Namespaces** — Pinecone stores data in buckets: `courses`, `programs`, `policies`, `services`, `general`.

**Intent routing** — Questions are classified (course, program, policy, etc.) so search looks in the right buckets.

**Reranking** — After initial search, results are re-scored so the best chunks reach the AI.

Details: [How the AI Works](../docs/HOW_THE_AI_WORKS.md)
