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
    <div data-school={schoolId} className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-card/70 backdrop-blur-2xl border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              Campus<span className="transition-colors duration-500 text-primary">Q</span>
            </span>
            {school.live && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground transition-colors duration-500">
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              About
            </Link>
            {school.live ? (
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-strong text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-resting"
              >
                Open app <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background tint that shifts with school color */}
        <div className="absolute inset-0 bg-primary-soft opacity-50 transition-colors duration-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--card),transparent)]" />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-16 md:pt-8 md:pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left */}
            <div>
              {/* School selector label */}
              <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-widest mb-3">
                Select your university
              </p>

              <div className="mb-8">
                <UniversityToggle activeId={schoolId} onSelect={setSchoolId} />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-500 text-primary-ink border-primary-line bg-card/80">
                  <Sparkles className="size-3" />
                  {school.badge}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
                Every answer your advisor would give.{" "}
                <span className="transition-colors duration-500 text-primary">In seconds.</span>
              </h1>

              <p className="mt-5 text-muted-foreground text-base max-w-[400px]">
                {school.live
                  ? "Prerequisites, deadlines, degree requirements — answered from official university documents, with sources you can check."
                  : `CampusQ is coming to ${school.shortName}. Drop your email and we'll tell you the moment it's ready.`}
              </p>

              <div className="mt-8">
                {school.live ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-strong text-primary-foreground text-sm font-semibold px-6 py-3 rounded-xl transition-[background-color,transform,box-shadow] duration-200 ease-[var(--ease-out)] shadow-raised hover:shadow-overlay hover:-translate-y-px"
                    >
                      Ask your first question
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Learn more →
                    </Link>
                  </div>
                ) : (
                  <WaitlistCta school={school.shortName} />
                )}
              </div>

              <p className="mt-5 text-xs text-muted-foreground/80">
                {school.live
                  ? `Free to sign up · Built on official ${school.shortName} documents`
                  : `Not affiliated with ${school.name}`}
              </p>
            </div>

            {/* Right — chat mockup */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-6 rounded-[2rem] blur-2xl opacity-20 transition-colors duration-500 bg-primary" />

              <div className="relative rounded-2xl border border-border overflow-hidden shadow-overlay bg-card">
                {/* Window chrome */}
                <div className="bg-secondary/60 border-b border-border/60 px-4 py-3 flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <span className="size-2.5 rounded-full bg-border" />
                  <div className="mx-auto flex items-center gap-1.5 bg-card border border-border rounded-md px-3 py-1">
                    <span className="size-1.5 rounded-full transition-colors duration-500 bg-primary" />
                    <span className="text-[11px] text-muted-foreground font-medium">campusq.retriive.com</span>
                  </div>
                  <span className="size-2.5 opacity-0" />
                </div>

                {/* Inner app nav */}
                <div className="px-4 py-2.5 border-b border-border/60 flex items-center gap-2">
                  <div className="size-5 rounded-md bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground transition-colors duration-500">
                    Q
                  </div>
                  <span className="text-xs font-semibold text-secondary-foreground">CampusQ</span>
                  <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-soft text-primary-ink transition-colors duration-500">
                    {school.shortName}
                  </span>
                </div>

                {/* Messages */}
                <div className="bg-card px-5 py-5 flex flex-col gap-4 min-h-[200px]">
                  {school.demoMessages.map((msg, i) => (
                    <div key={`${schoolId}-${i}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2.5"}`}>
                      {msg.role === "assistant" && (
                        <div className="shrink-0 size-6 rounded-lg bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground mt-0.5 transition-colors duration-500">
                          Q
                        </div>
                      )}
                      <div className={`max-w-[80%] text-sm rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-secondary border border-border text-foreground rounded-br-sm"
                          : "bg-background text-secondary-foreground rounded-bl-sm border border-border/60"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="bg-card border-t border-border/60 px-4 py-3 flex items-center gap-2">
                  {school.live ? (
                    <>
                      <Link href="/sign-up" className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/80 hover:bg-secondary transition-colors">
                        Ask anything about {school.shortName}…
                      </Link>
                      <Link href="/sign-up" className="size-8 bg-primary hover:bg-primary-strong rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
                        <ArrowRight className="size-3.5 text-primary-foreground" />
                      </Link>
                    </>
                  ) : (
                    <div className="flex-1 bg-background border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground/80">
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
      <div className="border-y border-border/60 bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          {school.live ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {school.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-primary transition-colors duration-500" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-secondary-foreground">{school.shortName}</span>'s catalog is being indexed — join the waitlist to get notified first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="mx-6 my-16 md:mx-auto md:max-w-6xl md:w-full md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary-soft border border-primary-line/60 transition-colors duration-500">
          {/* Decorative blob */}
          <div className="absolute -top-16 -right-16 size-64 rounded-full bg-primary opacity-10 blur-3xl transition-colors duration-500" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-primary opacity-5 blur-3xl transition-colors duration-500" />

          <div className="relative px-8 py-14 md:px-14 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 transition-colors duration-500 text-primary-ink">
              {school.live ? "Get started free" : "Be first to know"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight max-w-lg text-balance">
              {school.live
                ? "Your questions, answered instantly."
                : `${school.shortName} is next on the list.`}
            </h2>
            <p className="mt-4 text-muted-foreground text-base max-w-sm">
              {school.live
                ? "No advisor queue. No calendar rabbit holes. Just ask."
                : `We're indexing ${school.shortName}'s catalog now. Join the waitlist and we'll email you the day it opens.`}
            </p>

            <div className="mt-8">
              {school.live ? (
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-strong text-primary-foreground text-sm font-semibold px-6 py-3 rounded-xl transition-[background-color,transform,box-shadow] duration-200 ease-[var(--ease-out)] shadow-raised hover:shadow-overlay hover:-translate-y-px"
                >
                  Open CampusQ free
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <WaitlistCta school={school.shortName} />
              )}
            </div>

            <p className="mt-5 text-xs text-muted-foreground/80">
              Not affiliated with {school.name}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              Campus<span className="transition-colors duration-500 text-primary">Q</span>
            </span>
            <span className="text-border">·</span>
            <a href="https://retriive.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              by Retriive
            </a>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/chat" className="hover:text-foreground transition-colors">App</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <a href="mailto:mahadmyonis@gmail.com" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
