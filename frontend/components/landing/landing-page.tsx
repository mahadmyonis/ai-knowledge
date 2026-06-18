"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { UniversityToggle } from "@/components/landing/university-toggle"
import { WaitlistCta } from "@/components/landing/waitlist-cta"
import { SCHOOLS, type SchoolId } from "@/lib/landing-schools"


export function LandingPage({ defaultSchool = "carleton" }: { defaultSchool?: SchoolId }) {
  const [schoolId, setSchoolId] = useState<SchoolId>(defaultSchool)
  const school = SCHOOLS[schoolId]

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              Campus<span className={`transition-colors duration-500 ${school.accentText}`}>Q</span>
            </span>
            {school.live && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${school.accent} text-white`}>
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors hidden sm:block">
              About
            </Link>
            {school.live ? (
              <Link
                href="/sign-up"
                className={`inline-flex items-center gap-1.5 ${school.accent} ${school.accentHover} text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors`}
              >
                Open app <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-lg">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient that shifts with school color */}
        <div className={`absolute inset-0 ${school.accentBg} opacity-40 transition-colors duration-500`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.8),transparent)]" />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-16 md:pt-8 md:pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left */}
            <div>
              {/* School selector label */}
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                Select your university
              </p>

              <div className="mb-8">
                <UniversityToggle activeId={schoolId} onSelect={setSchoolId} />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 mb-6">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-500 ${school.accentText} border-current bg-white/80`}>
                  <Sparkles className="size-3" />
                  {school.badge}
                </span>
              </div>

              <h1 className="text-[44px] sm:text-5xl lg:text-[58px] font-bold tracking-tight leading-[1.04] text-zinc-900">
                Academic clarity,
                <br />
                <span className={`transition-colors duration-500 ${school.accentText}`}>instantly.</span>
              </h1>

              <p className="mt-5 text-zinc-500 text-[15px] leading-relaxed max-w-[360px]">
                {school.live
                  ? "Stop digging through calendars. Ask CampusQ — and get the answer in seconds."
                  : `CampusQ is coming to ${school.shortName}. Drop your email and we'll tell you the moment it's ready.`}
              </p>

              <div className="mt-8">
                {school.live ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/sign-up"
                      className={`inline-flex items-center gap-2 ${school.accent} ${school.accentHover} text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-black/10`}
                    >
                      Try it free
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
                      Learn more →
                    </Link>
                  </div>
                ) : (
                  <WaitlistCta school={school.shortName} accent={school.accent} accentHover={school.accentHover} />
                )}
              </div>

              <p className="mt-5 text-xs text-zinc-400">
                {school.live
                  ? `Free to sign up · Built on official ${school.shortName} documents`
                  : `Not affiliated with ${school.name}`}
              </p>
            </div>

            {/* Right — chat mockup */}
            <div className="relative">
              {/* Glow behind card */}
              <div className={`absolute -inset-6 rounded-[2rem] blur-2xl opacity-20 transition-colors duration-500 ${school.accent}`} />

              <div className="relative rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xl shadow-zinc-300/40 bg-white">
                {/* Window chrome */}
                <div className="bg-zinc-50/80 border-b border-zinc-100 px-4 py-3 flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-zinc-300" />
                  <span className="size-2.5 rounded-full bg-zinc-300" />
                  <span className="size-2.5 rounded-full bg-zinc-300" />
                  <div className="mx-auto flex items-center gap-1.5 bg-white border border-zinc-200 rounded-md px-3 py-1">
                    <span className={`size-1.5 rounded-full transition-colors duration-500 ${school.accent}`} />
                    <span className="text-[11px] text-zinc-500 font-medium">campusq.retriive.com</span>
                  </div>
                  <span className="size-2.5 opacity-0" />
                </div>

                {/* Inner app nav */}
                <div className={`px-4 py-2.5 border-b border-zinc-100 flex items-center gap-2`}>
                  <div className={`size-5 rounded-md ${school.accent} flex items-center justify-center text-[9px] font-bold text-white transition-colors duration-500`}>
                    Q
                  </div>
                  <span className="text-xs font-semibold text-zinc-700">CampusQ</span>
                  <span className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded ${school.accentBg} ${school.accentText} transition-colors duration-500`}>
                    {school.shortName}
                  </span>
                </div>

                {/* Messages */}
                <div className="bg-white px-5 py-5 flex flex-col gap-4 min-h-[200px]">
                  {school.demoMessages.map((msg, i) => (
                    <div key={`${schoolId}-${i}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2.5"}`}>
                      {msg.role === "assistant" && (
                        <div className={`shrink-0 size-6 rounded-lg ${school.accent} flex items-center justify-center text-[9px] font-bold text-white mt-0.5 transition-colors duration-500`}>
                          Q
                        </div>
                      )}
                      <div className={`max-w-[80%] text-[13px] leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-zinc-900 text-white rounded-br-sm"
                          : "bg-zinc-50 text-zinc-700 rounded-bl-sm border border-zinc-100"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="bg-white border-t border-zinc-100 px-4 py-3 flex items-center gap-2">
                  {school.live ? (
                    <>
                      <Link href="/sign-up" className="flex-1 bg-zinc-50 border border-zinc-150 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 hover:bg-zinc-100 transition-colors">
                        Ask anything about {school.shortName}…
                      </Link>
                      <Link href="/sign-up" className={`size-8 ${school.accent} ${school.accentHover} rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300`}>
                        <ArrowRight className="size-3.5 text-white" />
                      </Link>
                    </>
                  ) : (
                    <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400">
                      {school.shortName} coming soon…
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats / coming-soon strip */}
      <div className="border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          {school.live ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {school.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold text-zinc-900 tabular-nums">{s.value}</span>
                  <span className="text-xs text-zinc-400">{s.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className={`size-1.5 rounded-full ${school.accent} transition-colors duration-500`} />
              <p className="text-xs text-zinc-500">
                <span className="font-semibold text-zinc-700">{school.shortName}</span>'s catalog is being indexed — join the waitlist to get notified first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="mx-6 mb-16 md:mx-auto md:max-w-6xl md:w-full md:px-6">
        <div className={`relative overflow-hidden rounded-3xl ${school.accentBg} border border-zinc-200 transition-colors duration-500`}>
          {/* Decorative blob */}
          <div className={`absolute -top-16 -right-16 size-64 rounded-full ${school.accent} opacity-10 blur-3xl transition-colors duration-500`} />
          <div className={`absolute -bottom-16 -left-16 size-64 rounded-full ${school.accent} opacity-5 blur-3xl transition-colors duration-500`} />

          <div className="relative px-8 py-14 md:px-14 md:py-16">
            <p className={`text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-500 ${school.accentText}`}>
              {school.live ? "Get started free" : "Be first to know"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight leading-tight max-w-lg">
              {school.live
                ? "Your questions, answered instantly."
                : `${school.shortName} is next on the list.`}
            </h2>
            <p className="mt-4 text-zinc-500 text-[15px] leading-relaxed max-w-sm">
              {school.live
                ? "No advisor queue. No calendar rabbit holes. Just ask."
                : `We're indexing ${school.shortName}'s catalog now. Join the waitlist and we'll email you the day it opens.`}
            </p>

            <div className="mt-8">
              {school.live ? (
                <Link
                  href="/sign-up"
                  className={`inline-flex items-center gap-2 ${school.accent} ${school.accentHover} text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-black/10`}
                >
                  Open CampusQ free
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <WaitlistCta school={school.shortName} accent={school.accent} accentHover={school.accentHover} />
              )}
            </div>

            <p className="mt-5 text-xs text-zinc-400">
              Not affiliated with {school.name}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-800">
              Campus<span className={`transition-colors duration-500 ${school.accentText}`}>Q</span>
            </span>
            <span className="text-zinc-300">·</span>
            <a href="https://retriive.com" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              by Retriive
            </a>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/chat" className="hover:text-zinc-700 transition-colors">App</Link>
            <Link href="/about" className="hover:text-zinc-700 transition-colors">About</Link>
            <a href="mailto:mahadmyonis@gmail.com" className="hover:text-zinc-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
