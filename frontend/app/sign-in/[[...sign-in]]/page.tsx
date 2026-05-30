import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">

      {/* Nav */}
      <nav className="h-14 flex items-center px-6 border-b border-zinc-200/60">
        <Link href="/" className="text-sm font-bold tracking-tight text-zinc-900">
          Campus<span className="text-red-600">Q</span>
        </Link>
      </nav>

      {/* Sign in */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Sign in to access CampusQ
          </p>
        </div>

        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#dc2626",
              colorBackground: "#ffffff",
              colorText: "#18181b",
              colorTextSecondary: "#71717a",
              colorInputBackground: "#ffffff",
              colorInputText: "#18181b",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
              fontSize: "14px",
            },
            elements: {
              rootBox: "w-full max-w-sm",
              card: "shadow-sm border border-zinc-200 rounded-2xl p-8",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-medium rounded-xl h-11 transition-colors",
              socialButtonsBlockButtonText: "font-medium",
              dividerLine: "bg-zinc-200",
              dividerText: "text-zinc-400 text-xs",
              formFieldInput:
                "border border-zinc-200 rounded-xl h-11 px-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all",
              formFieldLabel: "text-xs font-medium text-zinc-700 mb-1",
              formButtonPrimary:
                "bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl h-11 transition-colors",
              footerActionLink: "text-red-600 hover:text-red-700 font-medium",
              identityPreviewText: "text-zinc-700",
              identityPreviewEditButton: "text-red-600",
              formFieldSuccessText: "text-emerald-600",
              formFieldErrorText: "text-red-500 text-xs",
              alertText: "text-sm",
              logoBox: "hidden",
              logoImage: "hidden",
            },
          }}
        />

        <p className="mt-6 text-xs text-zinc-400 text-center max-w-xs">
          By signing in you agree that CampusQ is an independent tool and not affiliated with Carleton University.
        </p>
      </div>

    </div>
  )
}
