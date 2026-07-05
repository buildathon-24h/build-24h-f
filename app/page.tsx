import type { Metadata } from "next"

import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Know.ly | Agent-ready knowledge systems",
  description:
    "Turn scattered operating knowledge into structured context for focused, trustworthy agents.",
}

export default function Page() {
  return <LandingPage />
}
