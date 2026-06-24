# Getting Started

Step-by-step guide to run CampusQ on your computer.

---

## What you need installed

| Tool | Check it works | Install |
|---|---|---|
| **Python 3.11+** | `py --version` (Windows) or `python3 --version` (Mac) | [python.org](https://www.python.org/downloads/) — check **"Add to PATH"** on Windows |
| **Node.js 18+** | `node --version` | [nodejs.org](https://nodejs.org/) |
| **Git** | `git --version` | [git-scm.com](https://git-scm.com/) |

**Windows tip:** Use `py -m` instead of `pip` or `uvicorn` directly:

```powershell
py -m pip install ...
py -m uvicorn main:app --reload
```

---

## 1. Get the code

```powershell
git clone https://github.com/Retriive/campusQ.git
cd campusQ
dir
```

You should see `backend` and `frontend` folders.

---

## 2. Set up API keys

Ask Mahad or check **Render → Environment** for the production keys.

Create a file: `backend\.env`

```
OPENAI_API_KEY=sk-your-key-here
PINECONE_API_KEY=your-pinecone-key-here
COHERE_API_KEY=your-cohere-key-here
```

| Key | Required? | What it does |
|---|---|---|
| `OPENAI_API_KEY` | **Yes** | Powers the chatbot + quality tests |
| `PINECONE_API_KEY` | **Yes** | Searches university data |
| `COHERE_API_KEY` | No | Better search ranking (reranker). Works without it. |

---

## 3. Start the backend (Terminal 1)

```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

**Success looks like:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Quick test** (new terminal):

```powershell
curl http://localhost:8000/
```

Expected: `{"status":"CampusQ Brain is active and listening."}`

**Leave Terminal 1 running.** Don't close it.

---

## 4. Start the frontend (Terminal 2)

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

- Landing page: http://localhost:3000  
- Chat: http://localhost:3000/chat  

---

## 5. Run the quality gate (Terminal 3)

With the backend running in Terminal 1:

```powershell
cd backend
py evals\quality_gate.py --tier smoke
```

| Result | Meaning |
|---|---|
| `✅ PASSED` + exit code 0 | Good — deploy is OK from a quality standpoint |
| `❌ FAILED` + exit code 1 | Don't deploy — read which questions failed |

Full guide: [QUALITY_GATE.md](QUALITY_GATE.md)

---

## Test production (no local backend)

If the app is already deployed on Render:

```powershell
cd backend
py -m pip install -r requirements.txt
$env:CAMPUSQ_API_URL = "https://your-render-url.onrender.com"
py evals\quality_gate.py --tier smoke
```

---

## Common problems

### `pip` or `uvicorn` not recognized (Windows)

Use `py -m`:

```powershell
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

### `Missing credentials` / OpenAI error on startup

Your `backend\.env` file is missing or `OPENAI_API_KEY` is empty. Create/fix `.env` and restart the backend.

### `Cannot find path backend`

You're in the wrong folder. Run `dir` — you should see `backend` and `frontend`. If not:

```powershell
cd C:\Users\YourName\path\to\campusQ
```

### Frontend can't reach API

Make sure backend is running on port 8000. Frontend defaults to `http://localhost:8000`.

### Quality gate can't connect

Backend must be running first (`uvicorn` in Terminal 1).

---

## Mac / Linux commands

Same steps — replace `py` with `python3` and use forward slashes:

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

```bash
python3 evals/quality_gate.py --tier smoke
```

---

## Next steps

- [How the AI works](HOW_THE_AI_WORKS.md)
- [Quality gate details](QUALITY_GATE.md)
- [Team rules for deploy](TEAM_RULES.md)
