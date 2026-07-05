# Design: Orbs Visual Redesign (named presets + intra-palette agent states)

## Context

`components/orbs/orb.tsx` renders a WebGL orb via `Canvas` → `Scene`. `Scene` keeps
`initialColorsRef`, `targetColor1Ref`, `targetColor2Ref` and a `useFrame` loop that
lerps `u.uColor1.value`/`u.uColor2.value` toward the targets (factor `0.08`), reads
`colorsRef.current` each frame, and modulates volume/anim by `agentState`. Colors feed
a 4-stop shader ramp (`black → uColor1 → uColor2 → white`); `uInverted` (MutationObserver
on `.dark`) handles dark surfaces. Default is hardcoded `["#CADCFC", "#A0B9D1"]`.

Goal: a small named-preset system with per-`agentState` intra-palette tone shifts, fully
non-breaking, no shader/geometry/animation-system changes.

## Architecture Decisions

**AD1 — Explicit per-state tuples over programmatic modulation.**
Each preset stores curated `[c1, c2]` tuples per state. Rejected: derive states by
programmatic HSL modulation of `base`. Explicit tuples give art-directable control over
each hue family and avoid saturated-hue drift under dark inversion. Cost: more literals;
mitigated by a shared shape and keeping `base` as the canonical idle anchor.

**AD2 — Resolve colors at the `Orb` boundary, reuse the existing lerp.**
`Orb` computes the effective `[string, string]` and passes it as `colors` to `Scene`.
When `agentState` changes, the resolved tuple changes, re-triggering the existing
`useEffect([colors])` that updates `targetColor*Ref`; `useFrame` lerps smoothly. No new
animation system, no `Scene` structural change. Rejected: resolving inside `Scene`
(more invasive, duplicates precedence logic).

**AD3 — Precedence.** `colors` (explicit) > `colorsRef` (live, per-frame, unchanged) >
`preset` variant-by-`agentState` > default `blueGreen`. `colorsRef` keeps winning each
frame exactly as today, so live callers are unaffected.

**AD4 — Variants authored in light space.** `uInverted` continues to invert for dark
surfaces; presets are validated with inversion on/off (no per-theme tuples).

## Interfaces / Contracts

New file `components/orbs/orb-presets.ts`:

```ts
export type OrbColorPair = [string, string]
export type OrbPresetName =
  | "elevenLabs" | "blueGreen" | "lilacPeach" | "coralOrange" | "oliveBlue"
// idle == passive (agentState null); thinking/listening/talking are more energetic
export type OrbStateKey = "idle" | "thinking" | "listening" | "talking"

export type OrbPreset = { base: OrbColorPair; states: Record<OrbStateKey, OrbColorPair> }

export const DEFAULT_ORB_PRESET: OrbPresetName = "blueGreen"
export const ORB_PRESETS: Record<OrbPresetName, OrbPreset>

// null -> "idle"; shifts tones WITHIN the palette family only
export function resolveOrbColors(
  preset: OrbPresetName,
  agentState: AgentState,
): OrbColorPair
```

State authoring rule (per preset, same hue family): `idle`/passive = calmest (lower
saturation, softer contrast); `thinking` = mid; `listening` = brighter; `talking` =
most saturated/high-contrast. `base` mirrors `idle`. Anchor hues from proposal:
`elevenLabs` `#CADCFC`/`#A0B9D1`, `blueGreen` `#2C7DA0`/`#7FA650`, `lilacPeach`
`#8A7FD6`/`#F4B58E`, `coralOrange` `#F26D6B`/`#F7A15C`, `oliveBlue` `#8FA85C`/`#A9C0DA`.

`orb.tsx` prop changes (non-breaking): drop the literal default on `colors` (now
`colors?: [string, string]`), add `preset?: OrbPresetName`. Resolution in `Orb`:

```ts
const resolved = colors ?? resolveOrbColors(preset ?? DEFAULT_ORB_PRESET, agentState)
// pass `resolved` to <Scene colors={resolved} .../>; colorsRef unchanged
```

## Flow

```
agentState / preset change
   -> Orb: colors ?? resolveOrbColors(preset ?? blueGreen, agentState)
   -> <Scene colors={resolved}>
   -> existing useEffect([colors]) sets targetColor1Ref / targetColor2Ref
   -> existing useFrame lerp (0.08) -> u.uColor1 / u.uColor2   (colorsRef still overrides per frame)
   -> shader ramp -> uInverted handles dark
```

## File Changes

| File | Change | Notes |
|------|--------|-------|
| `components/orbs/orb-presets.ts` | New | `OrbPresetName`/`OrbPreset`/`OrbStateKey` types, `ORB_PRESETS`, `DEFAULT_ORB_PRESET`, `resolveOrbColors`. Imports `AgentState` type from `orb.tsx` (or shared type) |
| `components/orbs/orb.tsx` | Modified | `colors?` (no default) + `preset?` props; resolve effective colors at `Orb`; pass to `Scene`. Shader/geometry/`useFrame`/`Scene` internals untouched |

Note: to avoid a circular import for `AgentState`, either import the type from `orb.tsx`
(type-only) or co-locate `AgentState` — prefer type-only import; if lint flags cycles,
move `AgentState` into `orb-presets.ts` and re-export from `orb.tsx`.

## Testing Strategy

- **Typecheck**: `tsc --noEmit` (or project script) — verify `Record` completeness and prop types.
- **Focused lint**: lint `components/orbs/*` only.
- **Build**: production build to confirm no SSR/client issues (module is `"use client"` chain).
- **Manual QA matrix**: each preset × each state (idle/thinking/listening/talking) × light/dark.
  Verify smooth lerp on state change, no hue-family jumps, correct dark inversion, existing
  `colors`/`colorsRef` callers unchanged.

## Open Questions

- None blocking. (Remote perlin-noise URL remains an accepted proposal-level risk, not part of this design.)
