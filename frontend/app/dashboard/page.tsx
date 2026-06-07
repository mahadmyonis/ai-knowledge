"use client"

import * as React from "react"
import { ArrowUp, ArrowDown, Minus, RefreshCw, AlertTriangle, ThumbsDown, Loader2, MessageSquare } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface IntentRow { intent: string; label: string; count: number; example: string; trend: "up" | "down" | "flat"; prev_count: number }
interface UnansweredGroup { theme: string; count: number; examples: string[] }
interface NegativeItem { question: string; answer: string; department: string }
interface TopQuestion { question: string; count: number }

const TIMEFRAMES = [
  { label: "24h",      days: 1   },
  { label: "7d",       days: 7   },
  { label: "30d",      days: 30  },
  { label: "90d",      days: 90  },
  { label: "All time", days: 0   },
]

interface DashboardData {
  snapshot: {
    total_questions: number
    accuracy: number | null
    thumbs_up: number
    thumbs_down: number
    top_department: string
  }
  intents: IntentRow[]
  top_questions: TopQuestion[]
  unanswered: UnansweredGroup[]
  negative_feedback: NegativeItem[]
}

function Trend({ t }: { t: "up" | "down" | "flat" }) {
  if (t === "up")   return <ArrowUp className="size-3 text-emerald-400" />
  if (t === "down") return <ArrowDown className="size-3 text-rose-400" />
  return <Minus className="size-3 text-slate-300" />
}

const INTENT_SHORT: Record<string, string> = {
  "Prerequisites & Course Requirements": "Prereqs",
  "Program Requirements":                "Programs",
  "Deadlines & Dates":                   "Deadlines",
  "Course Lookups":                      "Courses",
  "Registration Procedures":             "Reg.",
  "Academic Regulations & GPA":          "GPA",
  "Services & Campus Life":              "Services",
  "General / Other":                     "Other",
}

const BAR_COLORS = [
  "bg-violet-300",
  "bg-blue-300",
  "bg-sky-300",
  "bg-teal-300",
  "bg-emerald-300",
  "bg-amber-300",
  "bg-orange-300",
  "bg-rose-300",
]

function CategoryChart({ intents }: { intents: IntentRow[] }) {
  if (!intents || intents.length === 0) return (
    <div className="flex items-center justify-center h-full text-xs text-slate-400">No data yet.</div>
  )
  const max = Math.max(...intents.map(r => r.count), 1)
  return (
    <div className="flex items-end gap-2 h-full w-full">
      {intents.map((r, i) => {
        const pct = r.count / max
        const shortLabel = INTENT_SHORT[r.label] ?? r.label.split(" ")[0]
        const color = BAR_COLORS[i % BAR_COLORS.length]
        return (
          <div key={r.intent} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              {r.label}: {r.count}
            </div>
            <div
              className={`w-full rounded-t-lg ${color} opacity-80 group-hover:opacity-100 transition-all cursor-default`}
              style={{ height: `${Math.max(pct * 100, 6)}px` }}
            />
            <span className="text-[9px] text-slate-400 text-center leading-tight w-full truncate">{shortLabel}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [selectedDays, setSelectedDays] = React.useState(7)

  const load = async (days: number = selectedDays) => {
    setLoading(true); setError("")
    try {
      const res = await fetch(`${API_URL}/api/dashboard?days=${days}`)
      const json = await res.json()
      if (!json.ok) { setError("Couldn't load dashboard data."); return }
      setData(json.data)
    } catch {
      setError("Couldn't reach the server.")
    } finally {
      setLoading(false)
    }
  }

  const handleTimeframe = (days: number) => {
    setSelectedDays(days)
    load(days)
  }

  React.useEffect(() => { load() }, [])

  if (loading && !data) return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="size-5 animate-spin text-slate-300" />
    </div>
  )

  if (error && !data) return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={() => load(selectedDays)} className="text-xs text-slate-900 underline">Retry</button>
      </div>
    </div>
  )

  if (!data) return null
  const s = data.snapshot
  const timeLabel = selectedDays === 0 ? "all time" : selectedDays === 1 ? "last 24h" : `last ${selectedDays}d`

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden">

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-8 h-14 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-slate-800">CampusQ</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">Advisor Dashboard</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.days}
              onClick={() => handleTimeframe(tf.days)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDays === tf.days
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {tf.label}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            onClick={() => load(selectedDays)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-all"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Grid body */}
      <div className="flex-1 min-h-0 p-5 grid grid-cols-12 grid-rows-2 gap-4">

        {/* ── Top row ── */}

        {/* Questions stat */}
        <div className="col-span-2 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-400">Questions asked</p>
          <div>
            <p className="text-4xl font-bold text-slate-900 tracking-tight">{s.total_questions.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{timeLabel}</p>
          </div>
        </div>

        {/* Helpfulness stat */}
        <div className="col-span-2 bg-emerald-50 rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-emerald-100">
          <p className="text-xs font-medium text-emerald-600">Helpfulness rate</p>
          <div>
            <p className="text-4xl font-bold text-emerald-700 tracking-tight">
              {s.accuracy !== null ? `${s.accuracy}%` : "—"}
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              {s.accuracy !== null ? `${s.thumbs_up} 👍 · ${s.thumbs_down} 👎` : "no ratings yet"}
            </p>
          </div>
        </div>

        {/* Top dept stat */}
        <div className="col-span-2 bg-violet-50 rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-violet-100">
          <p className="text-xs font-medium text-violet-500">Top department</p>
          <div>
            <p className="text-2xl font-bold text-violet-700 tracking-tight leading-tight">{s.top_department}</p>
            <p className="text-xs text-violet-400 mt-1">by question volume</p>
          </div>
        </div>

        {/* Category chart */}
        <div className="col-span-6 bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-400 mb-4 shrink-0">What students are confused about</p>
          <div className="flex-1 min-h-0">
            <CategoryChart intents={data.intents} />
          </div>
        </div>

        {/* ── Bottom row ── */}

        {/* Top questions */}
        <div className="col-span-4 bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-100">
          <div className="px-5 pt-5 pb-3 shrink-0 flex items-center gap-2">
            <MessageSquare className="size-3.5 text-slate-300" />
            <p className="text-xs font-semibold text-slate-500">Top questions</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {!data.top_questions?.length ? (
              <p className="text-xs text-slate-300 px-5 py-3">No data yet.</p>
            ) : data.top_questions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-bold text-slate-200 mt-0.5 shrink-0 tabular-nums w-4">{i + 1}</span>
                <p className="flex-1 text-xs text-slate-600 leading-relaxed line-clamp-2">"{q.question}"</p>
                {q.count > 1 && <span className="text-[10px] text-slate-300 shrink-0 tabular-nums bg-slate-50 px-1.5 py-0.5 rounded-full">×{q.count}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Category list */}
        <div className="col-span-4 bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-100">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <p className="text-xs font-semibold text-slate-500">By category</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {data.intents.length === 0 ? (
              <p className="text-xs text-slate-300 px-5 py-3">No data yet.</p>
            ) : data.intents.map((r, i) => (
              <div key={r.intent} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                <div className={`size-2 rounded-full shrink-0 ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-700 truncate">{r.label}</span>
                    <Trend t={r.trend} />
                  </div>
                  {r.example && <p className="text-[10px] text-slate-400 truncate mt-0.5">"{r.example}"</p>}
                </div>
                <span className="text-sm font-semibold text-slate-800 tabular-nums shrink-0">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs attention */}
        <div className="col-span-4 bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-slate-100">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <p className="text-xs font-semibold text-slate-500">Needs attention</p>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="size-3 text-amber-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Unanswered</p>
              </div>
              {data.unanswered.length === 0 ? (
                <p className="text-xs text-slate-300 bg-emerald-50 rounded-lg px-3 py-2 text-emerald-600">Every question found an answer ✓</p>
              ) : data.unanswered.map((g) => (
                <div key={g.theme} className="mb-2 bg-amber-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-amber-800">{g.theme} <span className="text-amber-400 font-normal">({g.count})</span></p>
                  {g.examples.slice(0, 2).map((ex, j) => (
                    <p key={j} className="text-[10px] text-amber-600 truncate mt-0.5">· {ex}</p>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsDown className="size-3 text-rose-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Thumbs down</p>
              </div>
              {data.negative_feedback.length === 0 ? (
                <p className="text-xs bg-emerald-50 rounded-lg px-3 py-2 text-emerald-600">No negative feedback ✓</p>
              ) : data.negative_feedback.map((n, i) => (
                <div key={i} className="bg-rose-50 rounded-lg px-3 py-2 mb-2">
                  <p className="text-xs font-medium text-rose-800 line-clamp-1">{n.question}</p>
                  <p className="text-[10px] text-rose-500 line-clamp-2 mt-0.5">{n.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-8 py-2.5 bg-white border-t border-slate-100">
        <p className="text-[10px] text-slate-300">All data is aggregated and anonymized · No student names, IDs, or individual tracking</p>
      </div>
    </div>
  )
}
