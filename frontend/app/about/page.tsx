import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "About — CampusQ",
  description: "CampusQ is an AI academic assistant for Canadian university students.",
}

const SCHOOLS_STATUS = [
  { name: "Carleton University", short: "Carleton", status: "live" as const, color: "bg-red-600" },
  { name: "University of Ottawa", short: "uOttawa", status: "soon" as const, color: "bg-rose-700" },
  { name: "University of Toronto", short: "UofT", status: "soon" as const, color: "bg-blue-900" },
  { name: "University of Waterloo", short: "Waterloo", status: "soon" as const, color: "bg-amber-500" },
  { name: "Western University", short: "Western", status: "soon" as const, color: "bg-purple-700" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight">
            Campus<span className="text-red-600">Q</span>
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Open app <ArrowRight className="size-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,#fef2f2,transparent)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-5">About CampusQ</p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.04] text-zinc-900 max-w-2xl mb-6">
            Academic questions,<br />
            <span className="text-red-600">answered instantly.</span>
          </h1>
          <p className="text-zinc-500 text-[15px] leading-relaxed max-w-lg">
            CampusQ is an independent AI assistant built for Canadian university students. Ask anything
            about courses, prerequisites, programs, or deadlines — get a real answer in seconds, sourced
            directly from official university documents.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 w-full flex flex-col gap-20">

        {/* Why */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-5">Why we built it</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              The information exists.<br />It's just inaccessible.
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-[15px] text-zinc-500 leading-relaxed">
            <p>
              Every semester, students waste hours cross-referencing PDFs, hunting for prerequisites,
              decoding program requirements, and waiting weeks for advisor appointments — to answer
              questions that should take 30 seconds.
            </p>
            <p>
              We index every course, program, academic regulation, tuition policy, and campus resource
              at each university — and build an AI that answers questions from it directly.
              No guessing. No Reddit threads from 2019.
            </p>
            <p>
              We're rolling out to every major Canadian university. Same idea, every campus.
            </p>
          </div>
        </section>

        {/* Schools */}
        <section>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-8">Where we're at</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SCHOOLS_STATUS.map((s) => (
              <div
                key={s.name}
                className={`relative rounded-2xl border p-5 flex flex-col gap-3 overflow-hidden transition-all ${
                  s.status === "live"
                    ? "border-zinc-200 bg-white shadow-sm shadow-zinc-100"
                    : "border-zinc-100 bg-zinc-50"
                }`}
              >
                {/* color dot */}
                <div className={`size-2 rounded-full ${s.color}`} />
                <div>
                  <p className={`text-sm font-semibold ${s.status === "live" ? "text-zinc-900" : "text-zinc-500"}`}>
                    {s.name}
                  </p>
                </div>
                <div className="mt-auto">
                  {s.status === "live" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      Live
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Retriive — the company behind CampusQ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-5">The company behind it</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
              CampusQ is built by <span className="text-red-600">Retriive</span>.
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-[15px] text-zinc-500 leading-relaxed">
            <p>
              Retriive builds AI solutions for institutions and enterprises — systems that
              <span className="text-zinc-700 font-medium"> eliminate informational silos</span> and
              <span className="text-zinc-700 font-medium"> optimize administrative efficiency</span> across
              an organization.
            </p>
            <p>
              The problem is the same everywhere: the answer already exists, but it's buried across PDFs,
              portals, inboxes, and people's heads — so the person who needs it can't find it. Retriive
              unifies that scattered knowledge and puts a precise, source-grounded answer one question away.
            </p>
            <p>
              CampusQ is that idea applied to universities — the first of many domains where Retriive turns
              fragmented information into instant, trustworthy answers.
            </p>
          </div>
        </section>

        {/* Disclaimer + Contact side by side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-zinc-500 shrink-0" />
              <span className="text-sm font-semibold text-zinc-900">Heads up</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              CampusQ is an <span className="text-zinc-700 font-medium">independent tool</span> — not
              affiliated with, endorsed by, or operated by any university. Always verify important
              academic decisions with your advisor or official university sources.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 text-zinc-500 shrink-0" />
              <span className="text-sm font-semibold text-zinc-900">Get in touch</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Found an error, have feedback, or want to bring CampusQ to your school?
            </p>
            <a
              href="mailto:mahadmyonis@gmail.com"
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
            >
              mahadmyonis@gmail.com <ArrowRight className="size-3.5" />
            </a>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm font-bold">
              Campus<span className="text-red-600">Q</span>
            </Link>
            <span className="text-zinc-300">·</span>
            <a href="https://retriive.com" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              by Retriive
            </a>
          </div>
          <span className="text-xs text-zinc-400">Not affiliated with any university</span>
        </div>
      </footer>

    </div>
  )
}
