export type SchoolId = "carleton" | "uottawa" | "mcgill"

export interface SchoolConfig {
  id: SchoolId
  name: string
  shortName: string
  path: string
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
    path: "/",
    live: true,
    accent: "bg-red-600",
    accentHover: "hover:bg-red-700",
    accentText: "text-red-600",
    accentBg: "bg-red-50",
    badge: "Built for Carleton students",
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
    path: "/uottawa",
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
  mcgill: {
    id: "mcgill",
    name: "McGill University",
    shortName: "McGill",
    path: "/mcgill",
    live: false,
    accent: "bg-red-800",
    accentHover: "hover:bg-red-900",
    accentText: "text-red-800",
    accentBg: "bg-red-50",
    badge: "Coming soon for McGill students",
    demoMessages: [
      { role: "user", text: "What's the prerequisite for COMP 250?" },
      { role: "assistant", text: "McGill's course catalog isn't indexed yet — join the waitlist to get notified when it's ready." },
    ],
    stats: [],
  },
}

export const SCHOOL_LIST = Object.values(SCHOOLS)
