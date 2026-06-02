"use client"

import * as React from "react"
import { Plus, X, RotateCcw, Check, AlertTriangle, Loader2, Sparkles } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const STORAGE_KEY = "campusq-degree-plan-v2"

const TERMS = [
  "Year 1 · Fall", "Year 1 · Winter",
  "Year 2 · Fall", "Year 2 · Winter",
  "Year 3 · Fall", "Year 3 · Winter",
  "Year 4 · Fall", "Year 4 · Winter",
]

interface PlannedCourse {
  id: string
  code: string
  name: string
  credits: number
  prerequisites: string[]
}

type Plan = PlannedCourse[][]

const COURSE_CODE_RE = /\b[A-Z]{2,4}\s?\d{4}\b/g

function emptyPlan(): Plan {
  return Array.from({ length: TERMS.length }, () => [])
}

// ── Validation engine ────────────────────────────────────────────────────────
type Status = "ok" | "warning"
interface Validation { status: Status; missing: string[] }

function validateCourse(course: PlannedCourse, termIdx: number, plan: Plan): Validation {
  const earlier = new Set<string>()
  for (let t = 0; t < termIdx; t++) {
    for (const c of plan[t]) earlier.add(c.code.replace(/\s/g, ""))
  }
  const referenced = new Set<string>()
  for (const p of course.prerequisites) {
    const matches = (p.toUpperCase().match(COURSE_CODE_RE) || []).map((m) => m.replace(/\s/g, ""))
    matches.forEach((m) => referenced.add(m))
  }
  const missing = [...referenced].filter((code) => !earlier.has(code))
  return { status: missing.length === 0 ? "ok" : "warning", missing }
}

export function DegreePlanner() {
  const [plan, setPlan] = React.useState<Plan>(emptyPlan)
  const [drag, setDrag] = React.useState<{ courseId: string; from: number } | null>(null)
  const [dragOver, setDragOver] = React.useState<number | null>(null)
  const [addTo, setAddTo] = React.useState<number | null>(null)
  const [addInput, setAddInput] = React.useState("")
  const [loadingAdd, setLoadingAdd] = React.useState(false)
  const [addError, setAddError] = React.useState("")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPlan(JSON.parse(raw))
    } catch {}
  }, [])
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)) } catch {}
  }, [plan])

  const totalCredits = plan.flat().reduce((s, c) => s + c.credits, 0)
  const allValidations = plan.map((term, ti) => term.map((c) => validateCourse(c, ti, plan)))
  const warningCount = allValidations.flat().filter((v) => v.status === "warning").length

  const addCourse = async (termIdx: number) => {
    const code = addInput.trim().toUpperCase().replace(/\s+/, " ")
    if (!code) return
    setLoadingAdd(true)
    setAddError("")
    try {
      const res = await fetch(`${API_URL}/api/course/${encodeURIComponent(code.replace(/\s/g, ""))}`)
      const data = await res.json()
      if (!data.found) {
        setAddError(`${code} not found`)
        setLoadingAdd(false)
        return
      }
      const course: PlannedCourse = {
        id: Math.random().toString(36).slice(2),
        code: data.courseCode,
        name: data.courseName,
        credits: data.credits ?? 0.5,
        prerequisites: data.prerequisites ?? [],
      }
      setPlan((prev) => prev.map((t, i) => (i === termIdx ? [...t, course] : t)))
      setAddInput("")
      setAddTo(null)
    } catch {
      setAddError("Couldn't reach the server")
    } finally {
      setLoadingAdd(false)
    }
  }

  const removeCourse = (termIdx: number, id: string) => {
    setPlan((prev) => prev.map((t, i) => (i === termIdx ? t.filter((c) => c.id !== id) : t)))
  }

  const handleDrop = (toTerm: number) => {
    if (!drag) return
    setPlan((prev) => {
      const next = prev.map((t) => [...t])
      const moving = next[drag.from].find((c) => c.id === drag.courseId)
      if (!moving) return prev
      next[drag.from] = next[drag.from].filter((c) => c.id !== drag.courseId)
      next[toTerm] = [...next[toTerm], moving]
      return next
    })
    setDrag(null)
    setDragOver(null)
  }

  return (
    <div className="relative -mx-4 md:-mx-6 -my-8 px-4 md:px-6 py-8 min-h-full overflow-hidden">
      {/* Futuristic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#0a0a0f]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 size-[500px] rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 -z-10 size-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative text-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-4 text-red-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400/80">Degree Planner</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Build your path
            </h2>
            <p className="text-sm text-white/40 mt-1 max-w-md">
              Drag courses across terms. CampusQ checks your prerequisites live.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <CreditRing total={totalCredits} target={20} />
            <button
              onClick={() => { if (confirm("Clear your entire plan?")) setPlan(emptyPlan()) }}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 mb-6 text-sm backdrop-blur-sm transition-colors ${
          warningCount === 0
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}>
          {warningCount === 0 ? (
            <><Check className="size-4" /> All prerequisites satisfied in order</>
          ) : (
            <><AlertTriangle className="size-4" /> {warningCount} course{warningCount > 1 ? "s" : ""} with prerequisite issues — hover for details</>
          )}
        </div>

        {/* Term columns */}
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
          {TERMS.map((label, ti) => {
            const termCredits = plan[ti].reduce((s, c) => s + c.credits, 0)
            const isOver = dragOver === ti
            return (
              <div
                key={ti}
                onDragOver={(e) => { e.preventDefault(); setDragOver(ti) }}
                onDragLeave={() => setDragOver((c) => (c === ti ? null : c))}
                onDrop={() => handleDrop(ti)}
                className={`snap-start shrink-0 w-[230px] rounded-2xl border backdrop-blur-md transition-all duration-200 ${
                  isOver
                    ? "border-red-400/60 bg-red-500/10 scale-[1.02] shadow-[0_0_30px_rgba(220,38,38,0.25)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <span className="text-xs font-semibold text-white/70 tracking-wide">{label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    termCredits > 2.5 ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/50"
                  }`}>
                    {termCredits.toFixed(1)}
                  </span>
                </div>

                <div className="p-2.5 space-y-2 min-h-[80px]">
                  {plan[ti].map((course, idx) => {
                    const v = allValidations[ti][idx]
                    return (
                      <div
                        key={course.id}
                        draggable
                        onDragStart={() => setDrag({ courseId: course.id, from: ti })}
                        onDragEnd={() => { setDrag(null); setDragOver(null) }}
                        className={`group relative rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing transition-all ${
                          v.status === "ok"
                            ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                            : "border-amber-500/40 bg-amber-500/[0.07] hover:bg-amber-500/10"
                        }`}
                        title={v.status === "warning" ? `Needs first: ${v.missing.join(", ")}` : undefined}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold font-mono text-white">{course.code}</span>
                              {v.status === "ok"
                                ? <Check className="size-3 text-emerald-400 shrink-0" />
                                : <AlertTriangle className="size-3 text-amber-400 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-white/40 truncate mt-0.5">{course.name}</p>
                          </div>
                          <button
                            onClick={() => removeCourse(ti, course.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all shrink-0"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                        {v.status === "warning" && (
                          <p className="text-[10px] text-amber-400/80 mt-1.5 leading-tight">
                            Needs first: {v.missing.join(", ")}
                          </p>
                        )}
                        <span className="absolute top-2 right-7 text-[9px] font-mono text-white/25">{course.credits}</span>
                      </div>
                    )
                  })}

                  {addTo === ti ? (
                    <div className="rounded-xl border border-red-400/40 bg-white/[0.04] p-2">
                      <input
                        autoFocus
                        value={addInput}
                        onChange={(e) => setAddInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addCourse(ti); if (e.key === "Escape") { setAddTo(null); setAddInput(""); setAddError("") } }}
                        placeholder="e.g. COMP 2402"
                        className="w-full bg-transparent text-sm text-white font-mono outline-none placeholder:text-white/25"
                      />
                      {addError && <p className="text-[10px] text-red-400 mt-1">{addError}</p>}
                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={() => addCourse(ti)}
                          disabled={loadingAdd}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {loadingAdd ? <Loader2 className="size-3 animate-spin" /> : "Add"}
                        </button>
                        <button
                          onClick={() => { setAddTo(null); setAddInput(""); setAddError("") }}
                          className="px-2 text-white/40 hover:text-white/80 text-[11px]"
                        >Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddTo(ti); setAddInput(""); setAddError("") }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 hover:border-red-400/50 hover:bg-white/[0.03] text-white/40 hover:text-white/70 text-xs py-2.5 transition-all"
                    >
                      <Plus className="size-3.5" /> Add course
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-[11px] text-white/25 mt-6 max-w-xl">
          Suggested planning tool based on the current Carleton calendar. Prerequisite checks are a guide —
          compound rules and program-specific exceptions apply. Always confirm with your advisor or official program tree.
        </p>
      </div>
    </div>
  )
}

function CreditRing({ total, target }: { total: number; target: number }) {
  const pct = Math.min(total / target, 1)
  const r = 26
  const circ = 2 * Math.PI * r
  return (
    <div className="relative size-16">
      <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke="url(#grad)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-white leading-none">{total.toFixed(1)}</span>
        <span className="text-[8px] text-white/40">/ {target}</span>
      </div>
    </div>
  )
}
