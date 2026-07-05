# Tasks: Orbs Visual Redesign (named presets + intra-palette agent states)

Change: `orbs-visual-redesign` · Project: `build24h-f` · Store mode: hybrid
Source artifacts: `proposal.md`, `specs/orb-color-presets/spec.md`, `design.md`

## Authoritative Decisions (locked)

- Default preset: `blueGreen`.
- Perlin-noise texture stays remote (unchanged).
- Per-`agentState` variants are **explicit per-state tuples** (idle/thinking/listening/talking) in the same hue family, fed through the **existing** target-color lerp. No new animation systems.
- `preset` prop is optional; explicit `colors`/`colorsRef` still win (non-breaking).
- Color resolution precedence: `colors` > `colorsRef` (live, per-frame) > `preset` by `agentState` > default `blueGreen`.

## Scope Guard (do NOT touch)

- Shader math / 4-stop ramp, geometry, `useFrame` lerp factor (`0.08`), volume/agent-state ring logic, `uInverted`/MutationObserver.
- `Scene` internals beyond receiving the resolved `colors` prop.
- `components/landing/ambient-orb.tsx` (decorative CSS orb).
- Auth, dashboard, and landing feature scope.
- No new dependencies. No refactors beyond what the tasks below require.

## Review Workload Forecast

- Net-new file: `components/orbs/orb-presets.ts` (~90–130 lines: types + 5 presets × 4 state tuples + `resolveOrbColors`). Mostly declarative color literals — low logical complexity, high glance-time.
- Edit: `components/orbs/orb.tsx` — small, surgical (prop signature + one resolution line + pass-through). ~10–15 changed lines.
- Reviewer focus: (1) hex tuples match spec anchors, (2) precedence order correct, (3) `null -> idle` mapping, (4) no `Scene`/shader diff. Estimated review: ~15–20 min, single reviewer.
- No migrations, no API/DB changes, no cross-cutting impact.

---

## Phase 1 — Preset module (`components/orbs/orb-presets.ts`)

- [x] **1.1** Create `components/orbs/orb-presets.ts` with a `"use client"`-safe (pure, no side effects) module. Export types:
  - `OrbColorPair = [string, string]`
  - `OrbPresetName = "elevenLabs" | "blueGreen" | "lilacPeach" | "coralOrange" | "oliveBlue"`
  - `OrbStateKey = "idle" | "thinking" | "listening" | "talking"`
  - `OrbPreset = { base: OrbColorPair; states: Record<OrbStateKey, OrbColorPair> }`
- [x] **1.2** Import `AgentState` type-only from `orb.tsx` (`import type { AgentState } from "./orb"`). If ESLint/TS flags a cycle, move `AgentState` into `orb-presets.ts` and re-export it from `orb.tsx` (fallback per design note).
- [x] **1.3** Export `export const DEFAULT_ORB_PRESET: OrbPresetName = "blueGreen"`.
- [x] **1.4** Define `ORB_PRESETS: Record<OrbPresetName, OrbPreset>` with the exact base anchors below, and author per-state variants **within each hue family** following the intensity rule: `idle` = calmest (lower saturation, softer contrast) and MUST equal `base`; `thinking` = subtle/mid; `listening` = brighter; `talking` = most saturated/high-contrast.
  - `elevenLabs` base `["#CADCFC", "#A0B9D1"]`
  - `blueGreen` base `["#2C7DA0", "#7FA650"]` (DEFAULT)
  - `lilacPeach` base `["#8A7FD6", "#F4B58E"]`
  - `coralOrange` base `["#F26D6B", "#F7A15C"]`
  - `oliveBlue` base `["#8FA85C", "#A9C0DA"]`
  - Constraint: variants shift only lightness/saturation; hue stays in-family (no cross-family jump). Keep `base === states.idle`.
- [x] **1.5** Implement `resolveOrbColors(preset: OrbPresetName, agentState: AgentState): OrbColorPair`:
  - `null` agentState → `states.idle`.
  - `"thinking"|"listening"|"talking"` → matching `states[...]`.
  - Return a fresh tuple (do not mutate the preset literal).

## Phase 2 — Wire into `components/orbs/orb.tsx`

- [x] **2.1** Import from presets: `import { resolveOrbColors, DEFAULT_ORB_PRESET, type OrbPresetName } from "./orb-presets"`.
- [x] **2.2** Update the public `Orb` prop type: change `colors?: [string, string]` (drop hardcoded default) and add `preset?: OrbPresetName`.
- [x] **2.3** Remove the literal default `colors = ["#CADCFC", "#A0B9D1"]` from the destructure; compute the effective tuple inside `Orb`:
  `const resolved = colors ?? resolveOrbColors(preset ?? DEFAULT_ORB_PRESET, agentState)`.
- [x] **2.4** Pass `colors={resolved}` to `<Scene />`. Keep `colorsRef` pass-through **unchanged** so the per-frame live override still wins.
- [x] **2.5** Confirm `Scene` still receives `colors: [string, string]` (non-optional) and that `initialColorsRef`/`targetColor*Ref`/`useEffect([colors])`/`useFrame` are untouched. Verify no diff in shader/geometry/ring code.

## Phase 3 — Verification

- [x] **3.1** `bun run typecheck` passes (verify `Record<OrbStateKey, ...>` completeness for all 5 presets and new prop types).
- [x] **3.2** Focused ESLint on `components/orbs/*` clean (no cycle warnings; if any, apply the 1.2 fallback). Note: no import-cycle warnings from the type-only import; the 7 remaining errors are pre-existing `react-hooks` purity/immutability/refs issues in the untouched `Scene`/shader code and are out of scope.
- [x] **3.3** `bun run build` succeeds (no SSR/client boundary issues in the `"use client"` chain).
- [ ] **3.4** Manual QA matrix — each preset × each state (`idle`/`thinking`/`listening`/`talking`) × light/dark:
  - Smooth lerp on state change (no snap).
  - No hue-family jump between states.
  - Dark-mode inversion (`uInverted`) renders correctly, no shader errors.
  - Existing `colors`/`colorsRef` callers render identically to pre-change.
  - Shape, grain, blended gradient, and volume/agent-state rings unchanged.

---

## Acceptance Mapping (tasks → spec scenarios)

| Spec Requirement / Scenario | Covered by |
|---|---|
| Preset Module Exports → "Named presets are importable" (`blueGreen`=`["#2C7DA0","#7FA650"]`, `OrbPresetName` types keys) | 1.1, 1.4, 3.1 |
| Default Preset → "No color input" (renders `blueGreen` base) | 1.3, 2.3, 2.4 |
| Default Preset → "Preset prop selects palette" (`preset="coralOrange"`) | 2.2, 2.3, 1.4 |
| Explicit Colors Override → "Explicit colors win" | 2.3 (`colors ??`) |
| Explicit Colors Override → "Existing callers unchanged" | 2.4 (`colorsRef` pass-through), 3.4 |
| Per-agentState Intra-Palette Variants → "Passive vs active tones" | 1.4, 1.5, 2.3 |
| Per-agentState Intra-Palette Variants → "Smooth transition" | 2.4, 2.5 (existing lerp), 3.4 |
| Dark-Mode Inversion Per Preset → "Inversion toggled" | 2.5, 3.4 |
| Visual Fidelity Preserved → "No visual regression" | 2.5, 3.4 |
| Remote Perlin-Noise Texture → "Texture loads" | 2.5 (untouched), 3.4 |

## Risks / Watch Items

- **1.4** is the largest task (20 color literals across 5×4 tuples). Not logically complex, but author carefully to keep each `states.idle === base` and stay in-family — this is the most error-prone spot for the reviewer to check.
- **1.2** hidden dependency: potential `AgentState` import cycle between `orb.tsx` and `orb-presets.ts`. Fallback (move + re-export) is pre-specified; apply only if lint/TS flags it.
- No phase needs splitting; total = 3 phases, 15 tasks.
