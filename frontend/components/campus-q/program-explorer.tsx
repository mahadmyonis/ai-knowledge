"use client"

import * as React from "react"
import { ChevronRight, Loader2, BookOpen, GraduationCap, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Program {
  name: string
  faculty: string
  description: string
}

const PROGRAMS: Program[] = [
  // Engineering & Design
  { name: "Aerospace Engineering", faculty: "Engineering & Design", description: "Aerodynamics, propulsion, and spacecraft systems" },
  { name: "Biomedical and Electrical Engineering", faculty: "Engineering & Design", description: "Engineering principles applied to medicine and biology" },
  { name: "Civil Engineering", faculty: "Engineering & Design", description: "Structures, infrastructure, and environmental systems" },
  { name: "Communications Engineering", faculty: "Engineering & Design", description: "Wireless systems, networks, and signal processing" },
  { name: "Computer Systems Engineering", faculty: "Engineering & Design", description: "Hardware, software, and embedded systems design" },
  { name: "Electrical Engineering", faculty: "Engineering & Design", description: "Circuits, power systems, and electromagnetic fields" },
  { name: "Mechanical Engineering", faculty: "Engineering & Design", description: "Mechanics, thermodynamics, and machine design" },
  { name: "Network Technology", faculty: "Engineering & Design", description: "Computer networks, security, and telecommunications" },
  { name: "Software Engineering", faculty: "Engineering & Design", description: "Software design, testing, and project management" },
  { name: "Sustainable and Renewable Energy Engineering", faculty: "Engineering & Design", description: "Green energy systems and sustainable design" },
  { name: "Architecture", faculty: "Engineering & Design", description: "Architectural design, history, and building technology" },
  { name: "Industrial Design", faculty: "Engineering & Design", description: "Product design, human factors, and manufacturing" },

  // Science
  { name: "Biochemistry", faculty: "Science", description: "Chemistry of biological processes and living systems" },
  { name: "Biology", faculty: "Science", description: "Life sciences from molecular to ecosystem level" },
  { name: "Bioinformatics", faculty: "Science", description: "Computational approaches to biological data" },
  { name: "Chemistry", faculty: "Science", description: "Molecular structure, reactions, and materials" },
  { name: "Computer Science", faculty: "Science", description: "Algorithms, AI, software, and theory of computation" },
  { name: "Computer Mathematics", faculty: "Science", description: "Mathematics and computing combined" },
  { name: "Data Science", faculty: "Science", description: "Statistics, machine learning, and big data analysis" },
  { name: "Earth Sciences", faculty: "Science", description: "Geology, geophysics, and earth systems" },
  { name: "Environmental Science", faculty: "Science", description: "Environmental systems, ecology, and sustainability" },
  { name: "Food Science and Nutrition", faculty: "Science", description: "Food chemistry, safety, and human nutrition" },
  { name: "Mathematics", faculty: "Science", description: "Pure and applied mathematics" },
  { name: "Neuroscience", faculty: "Science", description: "Brain function, cognition, and nervous system" },
  { name: "Physics", faculty: "Science", description: "Classical and modern physics, quantum mechanics" },
  { name: "Psychology", faculty: "Science", description: "Human behaviour, cognition, and mental processes" },
  { name: "Statistics", faculty: "Science", description: "Statistical theory, data analysis, and probability" },

  // Arts & Social Sciences
  { name: "Anthropology", faculty: "Arts & Social Sciences", description: "Human cultures, evolution, and social organization" },
  { name: "Art History", faculty: "Arts & Social Sciences", description: "Visual arts, architecture, and cultural heritage" },
  { name: "Canadian Studies", faculty: "Arts & Social Sciences", description: "Canadian history, culture, politics, and society" },
  { name: "Cognitive Science", faculty: "Arts & Social Sciences", description: "Mind, intelligence, and information processing" },
  { name: "Communication and Media Studies", faculty: "Arts & Social Sciences", description: "Media theory, journalism, and digital communication" },
  { name: "Criminology and Criminal Justice", faculty: "Arts & Social Sciences", description: "Crime, law, and the justice system" },
  { name: "Economics", faculty: "Arts & Social Sciences", description: "Microeconomics, macroeconomics, and economic policy" },
  { name: "English Language and Literature", faculty: "Arts & Social Sciences", description: "Literary analysis, writing, and cultural criticism" },
  { name: "Environmental Studies", faculty: "Arts & Social Sciences", description: "Environmental policy, sustainability, and society" },
  { name: "Film Studies", faculty: "Arts & Social Sciences", description: "Film theory, history, and production" },
  { name: "French", faculty: "Arts & Social Sciences", description: "French language, literature, and francophone cultures" },
  { name: "Geography", faculty: "Arts & Social Sciences", description: "Physical and human geography, GIS, and spatial analysis" },
  { name: "Global and International Studies", faculty: "Arts & Social Sciences", description: "International relations, global politics, and development" },
  { name: "History", faculty: "Arts & Social Sciences", description: "Historical analysis from ancient to contemporary" },
  { name: "Indigenous Studies", faculty: "Arts & Social Sciences", description: "Indigenous histories, cultures, and contemporary issues" },
  { name: "Journalism", faculty: "Arts & Social Sciences", description: "News writing, reporting, and digital media" },
  { name: "Law and Legal Studies", faculty: "Arts & Social Sciences", description: "Legal theory, justice systems, and policy" },
  { name: "Linguistics", faculty: "Arts & Social Sciences", description: "Language structure, acquisition, and cognitive linguistics" },
  { name: "Music", faculty: "Arts & Social Sciences", description: "Music theory, performance, history, and composition" },
  { name: "Philosophy", faculty: "Arts & Social Sciences", description: "Ethics, logic, metaphysics, and epistemology" },
  { name: "Political Science", faculty: "Arts & Social Sciences", description: "Political theory, government, and international relations" },
  { name: "Religion", faculty: "Arts & Social Sciences", description: "World religions, theology, and religious studies" },
  { name: "Sociology", faculty: "Arts & Social Sciences", description: "Social structures, inequality, and human society" },
  { name: "Women's and Gender Studies", faculty: "Arts & Social Sciences", description: "Gender, feminism, and social justice" },

  // Sprott Business
  { name: "Business (BCom)", faculty: "Sprott School of Business", description: "Core business fundamentals across all disciplines" },
  { name: "Accounting", faculty: "Sprott School of Business", description: "Financial reporting, auditing, and taxation" },
  { name: "Finance", faculty: "Sprott School of Business", description: "Investment, financial markets, and corporate finance" },
  { name: "Human Resources Management", faculty: "Sprott School of Business", description: "People management, organizational behaviour, and HR strategy" },
  { name: "International Business", faculty: "Sprott School of Business", description: "Global trade, multinational strategy, and cross-cultural management" },
  { name: "Management", faculty: "Sprott School of Business", description: "Organizational leadership, strategy, and operations" },
  { name: "Marketing", faculty: "Sprott School of Business", description: "Consumer behaviour, branding, and digital marketing" },
  { name: "Supply Chain Management", faculty: "Sprott School of Business", description: "Logistics, procurement, and operations management" },

  // Public Affairs
  { name: "Public Administration", faculty: "Public Affairs", description: "Government management, policy, and public service" },
  { name: "Public Affairs and Policy Management", faculty: "Public Affairs", description: "Policy analysis, advocacy, and government relations" },
  { name: "Social Work", faculty: "Public Affairs", description: "Social services, community development, and welfare policy" },
  { name: "Human Rights", faculty: "Public Affairs", description: "International human rights law and advocacy" },

  // Information Technology
  { name: "Information Technology (BIT)", faculty: "Information Technology", description: "IT systems, databases, networking, and software" },
  { name: "Interactive Multimedia and Design", faculty: "Information Technology", description: "Web, game, and interactive media design" },

  // Health Sciences
  { name: "Health Sciences", faculty: "Health Sciences", description: "Health systems, policy, and interdisciplinary health studies" },
]

const FACULTY_COLORS: Record<string, string> = {
  "Engineering & Design": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Science": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Arts & Social Sciences": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Sprott School of Business": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Public Affairs": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Information Technology": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "Health Sciences": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function ProgramExplorer() {
  const [selected, setSelected] = React.useState<Program | null>(null)
  const [result, setResult] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const faculties = [...new Set(PROGRAMS.map((p) => p.faculty))]

  const filtered = search.trim()
    ? PROGRAMS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.faculty.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : null // null = show grouped by faculty

  const loadProgram = async (program: Program) => {
    setSelected(program)
    setResult("")
    setLoading(true)

    const question = `What are all the required courses for the ${program.name} program at Carleton University? List the required courses organized by year, including course codes, credit values, and any important notes about electives or streams.`

    try {
      const formData = new FormData()
      formData.append("question", question)
      formData.append("history", "[]")

      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        body: formData,
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const jsonStr = line.slice(6)
          if (!jsonStr.trim()) continue
          try {
            const parsed = JSON.parse(jsonStr)
            if (parsed.type === "token") {
              fullText += parsed.content
              setResult(fullText)
            }
          } catch {}
        }
      }
    } catch {
      setResult("Failed to load program requirements. Please make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setSelected(null); setResult("") }}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FACULTY_COLORS[selected.faculty] || "bg-secondary text-secondary-foreground"}`}>
              {selected.faculty}
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-muted-foreground py-12 justify-center">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Loading program requirements...</span>
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-border bg-secondary/20 p-5">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <BookOpen className="size-4 text-primary" />
              Program Requirements
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Program Explorer</h2>
        <p className="text-sm text-muted-foreground">
          Browse all {PROGRAMS.length} Carleton programs and see their course requirements.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programs..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Search results */}
      {filtered ? (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No programs found for "{search}"</p>
          ) : (
            filtered.map((program) => (
              <ProgramRow key={program.name} program={program} onSelect={loadProgram} />
            ))
          )}
        </div>
      ) : (
        /* Grouped by faculty */
        faculties.map((faculty) => (
          <div key={faculty}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{faculty}</h3>
              <span className="text-xs text-muted-foreground/50">
                ({PROGRAMS.filter((p) => p.faculty === faculty).length})
              </span>
            </div>
            <div className="space-y-2">
              {PROGRAMS.filter((p) => p.faculty === faculty).map((program) => (
                <ProgramRow key={program.name} program={program} onSelect={loadProgram} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function ProgramRow({ program, onSelect }: { program: Program; onSelect: (p: Program) => void }) {
  return (
    <button
      onClick={() => onSelect(program)}
      className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/40 transition-all text-left group"
    >
      <div className="flex items-start gap-3 min-w-0">
        <GraduationCap className="size-4 text-primary mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{program.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{program.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden md:block ${FACULTY_COLORS[program.faculty] || "bg-secondary text-secondary-foreground"}`}>
          {program.faculty}
        </span>
        <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </button>
  )
}
