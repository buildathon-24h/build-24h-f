import { cn } from "@/lib/utils"

type MarvaIsotypeProps = {
  size?: number
  className?: string
  /** auto: light logo on dark surfaces, dark logo on light surfaces */
  variant?: "auto" | "light" | "dark"
  /** Compensates for padding inside the PNG canvas */
  zoom?: number
}

/**
 * Marva isotype — white logo on a dark PNG canvas.
 * Blend modes drop the dark background so only the mark remains.
 */
export function MarvaIsotype({
  size = 24,
  className,
  variant = "auto",
  zoom = 2.6,
}: MarvaIsotypeProps) {
  const blendClass =
    variant === "auto"
      ? "invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen"
      : variant === "light"
        ? "invert mix-blend-multiply"
        : "mix-blend-screen"

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/marva-isotype.png"
        alt=""
        className={cn("h-full w-full object-contain", blendClass)}
        style={{ transform: `scale(${zoom})` }}
      />
    </span>
  )
}
