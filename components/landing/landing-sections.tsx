import Link from "next/link"
import {
  ArrowRightIcon,
  BlocksIcon,
  CheckCircle2Icon,
  DatabaseZapIcon,
  NetworkIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const problems = [
  "Decisions live across docs, chats, tickets, and meetings.",
  "Teams repeat the same context gathering before every action.",
  "AI pilots stall because knowledge is scattered and hard to trust.",
]

const workflow = [
  {
    title: "Connect the source material",
    description:
      "Bring operational knowledge into one map without forcing teams into a new ritual.",
    icon: DatabaseZapIcon,
  },
  {
    title: "Shape reusable context",
    description:
      "Turn repeated decisions, constraints, and handoffs into agent-ready building blocks.",
    icon: BlocksIcon,
  },
  {
    title: "Launch focused agents",
    description:
      "Give each workflow a narrow, explainable agent that helps the team move with confidence.",
    icon: NetworkIcon,
  },
]

const benefits = [
  {
    title: "Less context tax",
    description: "Teams spend less time rebuilding the same brief from scratch.",
    icon: SparklesIcon,
  },
  {
    title: "Clearer operating memory",
    description: "Important decisions stay findable and reusable after the meeting ends.",
    icon: CheckCircle2Icon,
  },
  {
    title: "Safer agent adoption",
    description: "Agents stay grounded in the knowledge, limits, and workflows you define.",
    icon: ShieldCheckIcon,
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-6">
      <div data-landing-reveal className="space-y-4">
        <Badge variant="outline">The gap</Badge>
        <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
          Your business already knows the answer. It just lives everywhere.
        </h2>
        <p className="text-muted-foreground">
          Know.ly helps teams turn scattered operating knowledge into structured
          context that agents can use without losing the human judgment behind it.
        </p>
      </div>
      <div className="grid gap-3">
        {problems.map((problem) => (
          <Card key={problem} data-landing-reveal className="bg-card/70">
            <CardContent className="flex items-start gap-3">
              <span className="mt-1 size-2 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">{problem}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function PromiseSection() {
  return (
    <section className="px-4 py-16 md:px-6">
      <div
        data-landing-reveal
        className="mx-auto max-w-6xl rounded-[min(var(--radius-4xl),28px)] border border-border/70 bg-gradient-to-br from-primary/5 via-card to-card p-8 md:p-12"
      >
        <div className="max-w-3xl space-y-4">
          <Badge>Product promise</Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-5xl">
            Build agents from the way your team actually works.
          </h2>
          <p className="text-lg text-muted-foreground">
            Instead of starting with a blank bot, Know.ly starts with the
            knowledge patterns, review loops, and operating rules that already
            make your team effective.
          </p>
        </div>
      </div>
    </section>
  )
}

export function WorkflowSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <div data-landing-reveal className="mb-8 max-w-2xl space-y-3">
        <Badge variant="secondary">Workflow</Badge>
        <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
          From knowledge sprawl to useful agents in three moves.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {workflow.map((item, index) => {
          const Icon = item.icon

          return (
            <Card key={item.title} data-landing-reveal className="bg-card/80">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export function BenefitsSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 md:grid-cols-3 md:px-6">
      {benefits.map((benefit) => {
        const Icon = benefit.icon

        return (
          <Card key={benefit.title} data-landing-reveal>
            <CardHeader>
              <Icon className="size-5 text-primary" />
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </section>
  )
}

export function FinalCtaSection() {
  return (
    <section className="px-4 py-20 md:px-6">
      <div
        data-landing-reveal
        className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[min(var(--radius-4xl),32px)] border border-border/70 bg-card p-8 shadow-xl shadow-foreground/5 md:flex-row md:items-center md:justify-between md:p-10"
      >
        <div className="max-w-2xl space-y-3">
          <Badge variant="outline">Ready when you are</Badge>
          <h2 className="font-heading text-3xl font-medium tracking-tight">
            Start shaping your operating knowledge into agent-ready context.
          </h2>
          <p className="text-muted-foreground">
            Create a workspace and begin with the workflows your team already
            repeats every week.
          </p>
        </div>
        <Link
          href="/auth"
          className={cn(buttonVariants({ size: "lg" }), "self-start md:self-auto")}
        >
          Get started
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}
