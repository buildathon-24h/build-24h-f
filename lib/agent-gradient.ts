import type { CSSProperties } from 'react'

/** Subtle full-area ambient gradient keyed to the selected agent palette. */
export function agentAmbientStyle(gradient: [string, string]): CSSProperties {
  const [from, to] = gradient
  return {
    background: `
      radial-gradient(ellipse 90% 70% at 50% -10%, color-mix(in srgb, ${from} 28%, transparent) 0%, transparent 65%),
      radial-gradient(ellipse 70% 55% at 15% 85%, color-mix(in srgb, ${to} 18%, transparent) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 88% 60%, color-mix(in srgb, ${from} 14%, transparent) 0%, transparent 50%),
      linear-gradient(180deg, color-mix(in srgb, ${from} 6%, transparent) 0%, transparent 45%)
    `,
  }
}
