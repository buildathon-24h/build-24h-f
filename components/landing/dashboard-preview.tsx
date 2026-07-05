import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const previewMetrics = [
  { label: "Knowledge sources mapped", value: "12", tone: "bg-chart-1" },
  { label: "Agent-ready workflows", value: "4", tone: "bg-chart-2" },
  { label: "Open review loops", value: "2", tone: "bg-chart-3" },
]

const agentSteps = [
  "Collect team context",
  "Extract repeatable decisions",
  "Suggest next actions",
]

export function DashboardPreview() {
  return (
    <Card
      data-landing-reveal
      className="relative border-border/70 bg-card/85 shadow-2xl shadow-foreground/5 backdrop-blur"
    >
      <CardHeader className="border-b border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Agent workspace preview</CardTitle>
            <CardDescription>
              Conceptual interface mockup, not validated analytics.
            </CardDescription>
          </div>
          <Badge variant="outline">Illustrative data</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {previewMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-border/70 bg-background/70 p-4"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${metric.tone}`} />
                <span className="text-xs text-muted-foreground">
                  Concept metric
                </span>
              </div>
              <p className="mt-4 font-heading text-3xl font-medium">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted/40 p-4 md:grid-cols-[1fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-sm font-medium">Knowledge pipeline</p>
            <div className="space-y-2">
              {agentSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl bg-card px-3 py-2 text-sm shadow-sm ring-1 ring-foreground/5"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-background/80 p-4 ring-1 ring-border">
            <p className="text-sm font-medium">Preview signal</p>
            <div className="mt-4 flex h-28 items-end gap-2">
              {[42, 64, 52, 76, 68, 86].map((height, index) => (
                <span
                  key={height + index}
                  className="flex-1 rounded-t-2xl bg-primary/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Illustrative trend only. Replace with real data when validated.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
