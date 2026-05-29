import Link from "next/link"
import { ArrowRight, MessageSquare, BookOpen, BarChart2, Zap } from "lucide-react"

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Ask anything",
    description: "Course details, prerequisites, graduation requirements, policies — answered instantly from the official calendar.",
  },
  {
    icon: BookOpen,
    title: "Program Explorer",
    description: "Browse every Carleton program and stream. See exactly what courses you need, year by year.",
  },
  {
    icon: BarChart2,
    title: "Compare Courses",
    description: "Put up to 3 courses side by side. Credits, prerequisites, descriptions — all in one view.",
  },
  {
    icon: Zap,
    title: "Instant answers",
    description: "No waiting, no PDFs, no 3-week advisor queue. The calendar, made searchable.",
  },
]

const QUESTIONS = [
  "What are the prerequisites for SYSC 3110?",
  "What courses are in year 2 of Computer Systems Engineering?",
  "What is the CGPA requirement to stay in Engineering?",
  "How many credits do I need to graduate from Computer Science?",
  "What is COMP 2804 about?",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[#fafaf9]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">
            Campus<span className="text-red-600">Q</span>
          </span>
          <div className="flex items-center gap-5">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-800 transition-colors hidden sm:block">
              About
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Try the beta <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-36">

        {/* Beta badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full size-1.5 bg-red-500" />
          </span>
          Now in beta · Carleton University
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.06] max-w-3xl text-zinc-900">
          Your AI assistant
          <br />
          <span className="text-red-600">for Carleton.</span>
        </h1>

        <p className="mt-5 text-base md:text-xl text-zinc-500 max-w-xl leading-relaxed px-2">
          Instant answers about courses, prerequisites, programs, and regulations — sourced directly from the official academic calendar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
          <Link
            href="/chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Try it free — sign up in seconds
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className="text-sm text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            Learn more →
          </Link>
        </div>

        <p className="mt-7 text-xs text-zinc-400 tracking-wide">
          3,800+ courses · 84 programs · Academic regulations · Free account · Beta
        </p>
      </section>

      {/* Example questions */}
      <section className="border-t border-zinc-200/60 py-14 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest text-center mb-8">
            Questions students actually ask
          </p>
          <div className="flex flex-col gap-2">
            {QUESTIONS.map((q) => (
              <Link
                key={q}
                href="/chat"
                className="group flex items-center justify-between px-5 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all text-sm text-zinc-600 hover:text-zinc-900"
              >
                <span>{q}</span>
                <ArrowRight className="size-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200/60 py-20 px-6 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              Everything you need. Nothing you don't.
            </h2>
            <p className="mt-3 text-zinc-500 text-sm max-w-md mx-auto">
              Built specifically for Carleton students. No general AI fluff — just your calendar, made useful.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="shrink-0 size-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                    <Icon className="size-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{f.title}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">{f.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-zinc-200/60 py-20 px-6 bg-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            We're in beta and we want your feedback.
          </h2>
          <p className="mt-4 text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
            Try CampusQ, ask real questions, and tell us what's wrong. Every report makes it better.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-zinc-100 transition-colors mt-8"
          >
            Open CampusQ
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 px-6 py-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold text-white">
            Campus<span className="text-red-500">Q</span>
          </span>
          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <Link href="/chat" className="hover:text-white transition-colors">App</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>Not affiliated with Carleton University</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
