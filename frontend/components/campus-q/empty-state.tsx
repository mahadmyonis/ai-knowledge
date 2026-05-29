"use client"

import * as React from "react"
import { BarChart2, BookOpen, MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import { useCampus, campusThemes } from "./campus-context"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void
  onViewChange?: (view: string) => void
}

const TYPEWRITER_QUERIES = [
  "What are the prerequisites for SYSC 3110?",
  "What courses do I need for Software Engineering?",
  "How many credits to graduate from Computer Science?",
  "What is COMP 2804 about?",
  "Can I take SYSC 4906 without SYSC 4101?",
  "What electives are available in third year?",
]

const QUICK_ASKS = [
  "What is SYSC 3110 about?",
  "Prerequisites for COMP 3000?",
  "How many credits to graduate?",
  "What courses are in Computer Systems Engineering?",
]

function useTypewriter(strings: string[], typingSpeed = 42, pauseDuration = 2000, deletingSpeed = 18) {
  const [displayed, setDisplayed] = React.useState("")
  const [index, setIndex] = React.useState(0)
  const [phase, setPhase] = React.useState<"typing" | "pausing" | "deleting">("typing")

  React.useEffect(() => {
    const current = strings[index]
    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase("pausing"), pauseDuration)
        return () => clearTimeout(t)
      }
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 100)
      return () => clearTimeout(t)
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed)
        return () => clearTimeout(t)
      } else {
        setIndex((i) => (i + 1) % strings.length)
        setPhase("typing")
      }
    }
  }, [displayed, phase, index, strings, typingSpeed, pauseDuration, deletingSpeed])

  return displayed
}

export function EmptyState({ onSuggestionClick, onViewChange }: EmptyStateProps) {
  const { selectedCampus, theme } = useCampus()
  const campusName = campusThemes[selectedCampus].name
  const typewriterText = useTypewriter(TYPEWRITER_QUERIES)

  return (
    <div className="flex flex-col items-center w-full min-h-full px-4 py-12 md:py-16">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">

        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "size-12 rounded-2xl flex items-center justify-center shadow-lg",
            theme.bgClass
          )}>
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Campus<span className={theme.textClass}>Q</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Academic assistant for <span className="font-medium text-foreground">{campusName}</span>
            </p>
          </div>
        </div>

        {/* Typewriter */}
        <div className="w-full">
          <div className="relative w-full px-4 py-3.5 rounded-xl border border-border bg-secondary/30 min-h-[48px] flex items-center gap-2">
            <MessageSquare className={cn("size-4 shrink-0 opacity-40", theme.textClass)} />
            <span className="text-sm text-muted-foreground">
              {typewriterText || <span className="opacity-0">|</span>}
              <span className="inline-block w-[2px] h-3.5 bg-muted-foreground/50 ml-0.5 align-middle animate-pulse" />
            </span>
          </div>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {[
            {
              icon: MessageSquare,
              title: "Ask anything",
              description: "Courses, prerequisites, policies, graduation requirements.",
              action: "chat",
              clickable: false,
            },
            {
              icon: BookOpen,
              title: "Program Explorer",
              description: "Browse all Carleton programs and required courses.",
              action: "programs",
              clickable: true,
            },
            {
              icon: BarChart2,
              title: "Compare Courses",
              description: "Compare up to 3 courses side by side.",
              action: "compare",
              clickable: true,
            },
          ].map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.title}
                onClick={() => {
                  if (!tool.clickable) return
                  if (onViewChange) onViewChange(tool.action)
                }}
                disabled={!tool.clickable}
                className={cn(
                  "group flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-150",
                  tool.clickable
                    ? "border-border bg-card hover:border-primary/30 hover:shadow-md cursor-pointer"
                    : "border-border/40 bg-card/40 cursor-default"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center",
                    tool.clickable ? theme.bgClass : "bg-secondary"
                  )}>
                    <Icon className={cn("size-4", tool.clickable ? "text-white" : "text-muted-foreground")} />
                  </div>
                  {tool.clickable && (
                    <ArrowRight className="size-3.5 text-muted-foreground/30 transition-all duration-150 group-hover:text-muted-foreground group-hover:translate-x-0.5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{tool.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{tool.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quick asks */}
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground/50 uppercase tracking-widest">
            Try asking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_ASKS.map((q) => (
              <button
                key={q}
                onClick={() => onSuggestionClick(q)}
                className="px-3.5 py-2 rounded-full text-xs border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-card hover:shadow-sm transition-all duration-150"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
