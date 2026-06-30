"use client"

import { SCHOOL_LIST, type SchoolId } from "@/lib/landing-schools"

export function UniversityToggle({
  activeId,
  onSelect,
}: {
  activeId: SchoolId
  onSelect: (id: SchoolId) => void
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-zinc-200 bg-zinc-50">
      {SCHOOL_LIST.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`relative text-xs font-medium px-3.5 py-1.5 rounded-full transition-[color,background-color,box-shadow,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] ${
            activeId === s.id
              ? `${s.accent} text-white shadow-sm`
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {s.shortName}
          {!s.live && (
            <span className="ml-1 text-[9px] uppercase tracking-wide opacity-50">
              soon
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
