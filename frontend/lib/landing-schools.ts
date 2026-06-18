export type SchoolId = "carleton" | "uottawa" | "uoft" | "waterloo" | "western"

export interface SchoolConfig {
  id: SchoolId
  name: string
  shortName: string
  live: boolean
  accent: string
  accentHover: string
  accentText: string
  accentBg: string
  badge: string
  demoMessages: { role: "user" | "assistant"; text: string }[]
  stats: { value: string; label: string }[]
}

export const SCHOOLS: Record<SchoolId, SchoolConfig> = {
  carleton: {
    id: "carleton",
    name: "Carleton University",
    shortName: "Carleton",
    live: true,
    accent: "bg-red-600",
    accentHover: "hover:bg-red-700",
    accentText: "text-red-600",
    accentBg: "bg-red-50",
    badge: "Live for Carleton students",
    demoMessages: [
      { role: "user", text: "Can I take COMP 2401 without finishing COMP 1405?" },
      { role: "assistant", text: "No — COMP 2401 requires either COMP 1405 or COMP 1406 as a prerequisite. You'll need to complete one of those first before registering." },
      { role: "user", text: "What's the last day to drop a course this fall?" },
      { role: "assistant", text: "For Fall 2026, the last day to withdraw from a full fall course without academic notation is November 15th." },
    ],
    stats: [
      { value: "3,782", label: "courses indexed" },
      { value: "84", label: "programs covered" },
      { value: "498", label: "degree variants" },
      { value: "0", label: "advisor queues" },
    ],
  },
  uottawa: {
    id: "uottawa",
    name: "University of Ottawa",
    shortName: "uOttawa",
    live: false,
    accent: "bg-rose-700",
    accentHover: "hover:bg-rose-800",
    accentText: "text-rose-700",
    accentBg: "bg-rose-50",
    badge: "Coming soon for uOttawa students",
    demoMessages: [
      { role: "user", text: "What's the prerequisite for ITI 1121?" },
      { role: "assistant", text: "uOttawa's course catalog isn't indexed yet — join the waitlist to get notified when it's ready." },
    ],
    stats: [],
  },
  uoft: {
    id: "uoft",
    name: "University of Toronto",
    shortName: "UofT",
    live: false,
    accent: "bg-blue-900",
    accentHover: "hover:bg-blue-800",
    accentText: "text-blue-900",
    accentBg: "bg-blue-50",
    badge: "Coming soon for UofT students",
    demoMessages: [
      { role: "user", text: "What are the prereqs for CSC236?" },
      { role: "assistant", text: "UofT's course catalog isn't indexed yet — join the waitlist to get notified when it's ready." },
    ],
    stats: [],
  },
  waterloo: {
    id: "waterloo",
    name: "University of Waterloo",
    shortName: "Waterloo",
    live: false,
    accent: "bg-amber-500",
    accentHover: "hover:bg-amber-600",
    accentText: "text-amber-600",
    accentBg: "bg-amber-50",
    badge: "Coming soon for Waterloo students",
    demoMessages: [
      { role: "user", text: "Is CS 135 a prereq for CS 136?" },
      { role: "assistant", text: "Waterloo's course catalog isn't indexed yet — join the waitlist to get notified when it's ready." },
    ],
    stats: [],
  },
  western: {
    id: "western",
    name: "Western University",
    shortName: "Western",
    live: false,
    accent: "bg-purple-700",
    accentHover: "hover:bg-purple-800",
    accentText: "text-purple-700",
    accentBg: "bg-purple-50",
    badge: "Coming soon for Western students",
    demoMessages: [
      { role: "user", text: "What are the prerequisites for CS 2210?" },
      { role: "assistant", text: "Western's course catalog isn't indexed yet — join the waitlist to get notified when it's ready." },
    ],
    stats: [],
  },
}

export const SCHOOL_LIST = Object.values(SCHOOLS)
