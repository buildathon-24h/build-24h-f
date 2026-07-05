import { AmbientOrb } from "@/components/landing/ambient-orb"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingMotion } from "@/components/landing/landing-motion"
import {
  BenefitsSection,
  FinalCtaSection,
  ProblemSection,
  PromiseSection,
  WorkflowSection,
} from "@/components/landing/landing-sections"

export function LandingPage() {
  return (
    <LandingMotion className="min-h-screen bg-background text-foreground">
      <main className="relative">
        <LandingHero />
        <ProblemSection />
        <PromiseSection />
        <div id="workflow">
          <WorkflowSection />
        </div>
        <section className="relative px-4 py-16 md:px-6">
          <AmbientOrb
            tone="muted"
            size="lg"
            className="-right-24 bottom-8 hidden md:block"
          />
          <div className="relative z-10 mx-auto max-w-6xl">
            <DashboardPreview />
          </div>
        </section>
        <BenefitsSection />
        <FinalCtaSection />
      </main>
    </LandingMotion>
  )
}
