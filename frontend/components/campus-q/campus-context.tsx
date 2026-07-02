"use client"

import * as React from "react"

export type Campus = "carleton" | "uottawa" | "mcgill"

// All accent colors come from the token layer in globals.css.
// The provider sets data-school on its wrapper, which swaps the
// --primary token family; these classes just reference the tokens.
interface CampusTheme {
  name: string
  bgClass: string
  hoverBgClass: string
  borderClass: string
  textClass: string
}

const TOKEN_THEME: Omit<CampusTheme, "name"> = {
  bgClass: "bg-primary",
  hoverBgClass: "hover:bg-primary-strong",
  borderClass: "border-primary",
  textClass: "text-primary",
}

export const campusThemes: Record<Campus, CampusTheme> = {
  carleton: { name: "Carleton University", ...TOKEN_THEME },
  uottawa: { name: "uOttawa", ...TOKEN_THEME },
  mcgill: { name: "McGill", ...TOKEN_THEME },
}

interface CampusContextType {
  selectedCampus: Campus
  setSelectedCampus: (campus: Campus) => void
  theme: CampusTheme
}

const CampusContext = React.createContext<CampusContextType | undefined>(undefined)

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [selectedCampus, setSelectedCampus] = React.useState<Campus>("carleton")
  const theme = campusThemes[selectedCampus]

  return (
    <CampusContext.Provider value={{ selectedCampus, setSelectedCampus, theme }}>
      <div data-school={selectedCampus} className="contents">
        {children}
      </div>
    </CampusContext.Provider>
  )
}

export function useCampus() {
  const context = React.useContext(CampusContext)
  if (context === undefined) {
    throw new Error("useCampus must be used within a CampusProvider")
  }
  return context
}
