import { LandingPage } from "@/components/landing/landing-page"
import { SCHOOLS } from "@/lib/landing-schools"

export default function Page() {
  return <LandingPage school={SCHOOLS.uottawa} />
}
