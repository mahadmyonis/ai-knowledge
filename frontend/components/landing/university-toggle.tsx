import Link from "next/link"
import { SCHOOL_LIST, type SchoolId } from "@/lib/landing-schools"

export function UniversityToggle({ activeId }: { activeId: SchoolId }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-zinc-200 bg-zinc-50">
      {SCHOOL_LIST.map((s) => (
        <Link
          key={s.id}
          href={s.path}
          className={`relative text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
            activeId === s.id
              ? `${s.accent} text-white shadow-sm`
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {s.shortName}
          {!s.live && (
            <span className="ml-1 text-[9px] uppercase tracking-wide text-zinc-300">
              soon
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
