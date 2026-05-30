import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "About — CampusQ",
  description: "CampusQ is an independent AI academic assistant for Carleton University students.",
}

const CAPABILITIES = [
  "Look up any course — description, prerequisites, and credit value",
  "Answer questions about program requirements for any Carleton program",
  "Show the full prerequisite chain for any course",
  "Help you understand graduation and credit requirements",
  "Compare courses side by side to help you choose",
  "Explain university policies in plain language",
  "Browse all Carleton programs and streams by faculty",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[#fafaf9]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight">
            Campus<span className="text-red-600">Q</span>
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Open app <ArrowRight className="size-3" />
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-20 w-full flex flex-col gap-14">

        {/* Header */}
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">About</p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            What is CampusQ?
          </h1>
          <p className="text-zinc-500 leading-relaxed text-base">
            CampusQ is an AI-powered academic assistant built for Carleton University students.
            It makes the official academic calendar searchable and conversational — so you can get answers in seconds instead of hours.
          </p>
        </section>

        {/* Origin */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900">Why we built it</h2>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Every semester at Carleton, students waste hours cross-referencing PDFs, hunting for prerequisites,
            decoding program requirements, and waiting weeks for advisor appointments to answer questions
            that should take 30 seconds. The information is all there — it's just completely inaccessible.
          </p>
          <p className="text-zinc-500 leading-relaxed text-sm">
            We indexed the entire Carleton academic calendar — every course, every program, every policy —
            and built an AI that answers questions from it directly. No fluff, no guessing, no Reddit threads from 2019.
          </p>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Built for Carleton students, by Carleton students. We know the problem because we lived it.
            CampusQ is currently in beta — we're testing it with real students, collecting feedback, and improving it every week.
          </p>
        </section>

        {/* Capabilities */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-zinc-900">What it can do</h2>
          <div className="flex flex-col gap-2">
            {CAPABILITIES.map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 bg-white">
                <span className="size-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span className="text-sm text-zinc-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-4 text-red-600 shrink-0" />
            <span className="text-sm font-semibold text-zinc-900">Important disclaimer</span>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            CampusQ is an <span className="text-zinc-800 font-medium">independent student tool</span> and
            is <span className="text-zinc-800 font-medium">not affiliated with, endorsed by, or operated
            by Carleton University</span>. While we strive for accuracy, always verify important academic
            decisions with your advisor or the official calendar at{" "}
            <a
              href="https://calendar.carleton.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 transition-colors underline underline-offset-2"
            >
              calendar.carleton.ca
            </a>.
          </p>
        </section>

        {/* Contact */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900">Contact & feedback</h2>
          <p className="text-sm text-zinc-500">
            Found an error, have feedback, or want to get involved? Use the feedback button inside
            the app, or reach out directly:
          </p>
          <a
            href="mailto:mahadmyonis@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <Mail className="size-4" />
            mahadmyonis@gmail.com
          </a>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 px-6 py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-bold">
            Campus<span className="text-red-600">Q</span>
          </Link>
          <span className="text-xs text-zinc-400">Not affiliated with Carleton University</span>
        </div>
      </footer>

    </div>
  )
}
