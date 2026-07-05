import { cn } from "@/lib/utils"

type AmbientOrbProps = {
  className?: string
  tone?: "primary" | "chart" | "muted"
  size?: "sm" | "md" | "lg"
}

const toneClasses = {
  primary: "from-primary/25 via-primary/10 to-transparent",
  chart: "from-chart-1/35 via-chart-2/15 to-transparent",
  muted: "from-muted-foreground/20 via-muted/20 to-transparent",
}

const sizeClasses = {
  sm: "size-28",
  md: "size-48",
  lg: "size-72",
}

export function AmbientOrb({
  className,
  tone = "primary",
  size = "md",
}: AmbientOrbProps) {
  return (
    <div
      aria-hidden
      data-landing-parallax
      className={cn(
        "pointer-events-none absolute rounded-full bg-radial blur-3xl",
        "opacity-70 dark:opacity-50",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
    />
  )
}
