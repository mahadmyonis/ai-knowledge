"use client"

import * as React from "react"
import { ArrowRight, Check } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface WaitlistCtaProps {
  school: string
  accent: string
  accentHover: string
}

export function WaitlistCta({ school, accent, accentHover }: WaitlistCtaProps) {
  const [email, setEmail] = React.useState("")
  const [joined, setJoined] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  if (joined) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
        <Check className="size-4 text-green-600" />
        You're on the list — we'll email you when {school} is ready.
      </div>
    )
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!email.trim() || submitting) return
        setSubmitting(true)
        setError("")
        try {
          const fd = new FormData()
          fd.append("email", email.trim())
          fd.append("school", school)
          const res = await fetch(`${API_URL}/api/waitlist`, { method: "POST", body: fd })
          const data = await res.json()
          if (data.ok) {
            setJoined(true)
          } else {
            setError("That email didn't look right — try again.")
          }
        } catch {
          setError("Something went wrong — try again.")
        } finally {
          setSubmitting(false)
        }
      }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.ca"
          className="text-sm px-4 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-zinc-400 transition-colors w-56"
        />
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center gap-2 ${accent} ${accentHover} text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shrink-0 disabled:opacity-60`}
        >
          {submitting ? "Joining…" : "Join waitlist"}
          <ArrowRight className="size-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  )
}
