import Link from "next/link"
import { ArrowRightIcon, PlayCircleIcon } from "lucide-react"

import { MarvaIsotype } from "@/components/marva-isotype"
import { AmbientOrb } from "@/components/landing/ambient-orb"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingHero() {
  return (
    <section className="relative px-4 pb-16 pt-6 md:px-6 md:pb-24">
      <AmbientOrb
        tone="chart"
        size="lg"
        className="-right-20 top-10 hidden md:block"
      />
      <AmbientOrb tone="primary" className="-left-16 top-48" />

      <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Know.ly home">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <MarvaIsotype size={20} variant="light" />
          </span>
          <span className="font-heading text-lg font-medium">Know.ly</span>
        </Link>
        <Link href="/auth" className={buttonVariants({ variant: "outline" })}>
          Sign in
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="relative z-10 space-y-6">
          <Badge data-landing-reveal variant="secondary">
            Agent-ready knowledge systems
          </Badge>
          <div data-landing-reveal className="space-y-4">
            <h1 className="font-heading text-5xl font-medium tracking-tight text-balance md:text-7xl">
              Turn scattered knowledge into agents your team can trust.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Know.ly maps the decisions, context, and workflows your team
              already uses, then shapes them into focused agents that help work
              move forward.
            </p>
          </div>
          <div
            data-landing-reveal
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/auth" className={buttonVariants({ size: "lg" })}>
              Start with Know.ly
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              href="#workflow"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              <PlayCircleIcon className="size-4" />
              See how it works
            </Link>
          </div>
        </div>

        <div
          data-landing-reveal
          className="relative rounded-[min(var(--radius-4xl),32px)] border border-border/70 bg-card/75 p-4 shadow-2xl shadow-foreground/10 backdrop-blur"
        >
          <div className="rounded-[min(var(--radius-4xl),24px)] border border-border bg-gradient-to-br from-primary/5 to-card p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Knowledge map</p>
                <p className="text-xs text-muted-foreground">
                  Conceptual landing preview
                </p>
              </div>
              <Badge variant="outline">Preview</Badge>
            </div>
            <div className="space-y-3">
              {["Support playbooks", "Sales objections", "Ops decisions"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3 ring-1 ring-border"
                  >
                    <span className="text-sm">{item}</span>
                    <span className="text-xs text-muted-foreground">
                      Agent block 0{index + 1}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
