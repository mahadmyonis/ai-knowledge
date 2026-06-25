# Task: School #2 waitlist landing pages

**Assigned to:** Abdulla  
**Reviewer:** Mahad  
**Area:** Frontend — one-off task, not a standing owner role  
**Status:** Assigned — not started

---

## Goal

Make the **coming-soon** university landing pages feel real and shareable so students at uOttawa, UofT, Waterloo, and Western can join the waitlist. Carleton is already live — don't change its live flow.

This is **frontend-only** copy, content, and routes. No backend or chatbot changes.

---

## What already exists

| Piece | Location |
|-------|----------|
| School configs (colors, demo messages, badges) | `frontend/lib/landing-schools.ts` |
| Shared landing layout | `frontend/components/landing/landing-page.tsx` |
| Waitlist signup form | `frontend/components/landing/waitlist-cta.tsx` |
| uOttawa route | `frontend/app/uottawa/page.tsx` → `/uottawa` |

**Gap today:** UofT, Waterloo, and Western are in `landing-schools.ts` but have **no dedicated URLs**. Demo messages for non-Carleton schools are thin (one exchange each, no stats).

---

## Your scope

### 1. Add missing routes

Create pages matching the uOttawa pattern:

| URL | File | `defaultSchool` |
|-----|------|-----------------|
| `/uoft` | `frontend/app/uoft/page.tsx` | `uoft` |
| `/waterloo` | `frontend/app/waterloo/page.tsx` | `waterloo` |
| `/western` | `frontend/app/western/page.tsx` | `western` |

Copy the structure from `frontend/app/uottawa/page.tsx`.

### 2. Polish school content in `landing-schools.ts`

For each coming-soon school (uOttawa, UofT, Waterloo, Western):

- **2–4 realistic demo chat messages** — use real course codes students at that school would ask about (prereqs, deadlines, program questions). Keep the assistant honest: catalog not indexed yet, join waitlist.
- **Badge / hero copy** — clear, school-specific (not generic "coming soon").
- **Optional stats row** — placeholder stats are fine (e.g. "Launching soon", "Course catalog indexing", "0 advisor queues") if you don't have real numbers yet. Match Carleton's stat card style or leave `stats: []` if the layout handles empty gracefully.

**Do not** claim any school is live or indexed unless `live: true`.

### 3. Quick UX pass on waitlist flow

Manual check on each school's page:

- [ ] Waitlist form submits (needs backend running locally, or test against prod API)
- [ ] Success state shows after join
- [ ] School name in confirmation matches the page
- [ ] Mobile layout looks OK (form doesn't overflow)

### 4. Link from main landing (if missing)

Confirm the university toggle on `/` lets users switch to each school and that shareable URLs work (`/uottawa`, `/uoft`, etc.).

---

## Files you will touch

| File | What to do |
|------|------------|
| `frontend/lib/landing-schools.ts` | Richer demo messages + copy per school |
| `frontend/app/uoft/page.tsx` | **Create** |
| `frontend/app/waterloo/page.tsx` | **Create** |
| `frontend/app/western/page.tsx` | **Create** |
| `frontend/app/uottawa/page.tsx` | Only if you need tweaks for consistency |

**Do not touch** without asking Mahad:

- `backend/` (chat, API, scrapers)
- `main.py`, `retrieval.py`, `golden.csv`
- Carleton `live: true` config or `/chat` flow

---

## How to work

### 1. Setup

Follow [GETTING_STARTED.md](../GETTING_STARTED.md). Frontend only:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 and each school path.

### 2. Branch

```bash
git checkout main
git pull
git checkout -b feature/waitlist-landings-abdulla
```

### 3. PR

Use the template from [HOW_WE_WORK.md](../HOW_WE_WORK.md).

**Quality gate:** N/A — frontend-only, no chat changes. Note that in the PR.

**How to test** (include in PR):

1. Visit `/`, `/uottawa`, `/uoft`, `/waterloo`, `/western`
2. Toggle schools on main landing — colors and copy update
3. Submit waitlist with a test email on one school page
4. Screenshot of each school's hero (optional but helpful)

---

## Definition of done

- [ ] `/uoft`, `/waterloo`, `/western` routes exist and render
- [ ] All four coming-soon schools have polished demo messages in `landing-schools.ts`
- [ ] Waitlist signup works on at least one school page (manual test)
- [ ] PR open with screenshots or short screen recording
- [ ] Mahad reviewed

---

## Examples (direction, not copy-paste)

**uOttawa** — ITI 1121 prereqs, bilingual campus question, co-op eligibility  
**UofT** — CSC108 → CSC148 path, St. George vs UTM (keep simple), PEY co-op  
**Waterloo** — CS 135/136 sequence, co-op streams, course overload rules  
**Western** — CS 1026/2210, Ivey AEO mention (light touch), module requirements

Stay factual about what CampusQ **can't** answer yet for those schools. The point is to show students what they'll get when data is indexed.

---

## Links

- [How we work](../HOW_WE_WORK.md)
- [Project map](../PROJECT_MAP.md)
- Carleton reference: `frontend/lib/landing-schools.ts` → `carleton` block
