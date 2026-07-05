# Proposal: Orbs Visual Redesign (ElevenLabs-inspired palettes)

## Intent

The WebGL orb (`components/orbs/orb.tsx`) ships with a single hardcoded ElevenLabs light-blue default (`["#CADCFC", "#A0B9D1"]`). There is no consistent way to apply brand-aligned, ElevenLabs-style color schemes across the app. We want a small named color-preset system so the orb can adopt curated two-stop palettes while keeping its exact shape, grainy noise, and soft blended gradient behavior.

## Scope

### In Scope
- New palette module `components/orbs/orb-presets.ts` exporting named two-stop presets.
- Update `orb.tsx` default to the `blueGreen` preset; keep ElevenLabs baseline available.
- Optional `preset?: OrbPresetName` prop resolving to `colors` (explicit `colors`/`colorsRef` still win).
- Per-`agentState` intra-palette variants: each preset defines state-driven color shifts (e.g., passive/idle vs listening/talking) that modulate lightness/saturation/blend WITHIN the same color family, never changing hue family.
- Preserve dark-mode inversion, volume/agent-state rings, noise texture (remote URL), and shape.

### Out of Scope
- Shader math, geometry, or agent-state/volume logic changes.
- `components/landing/ambient-orb.tsx` (CSS decorative orb).
- Auth, dashboard, and landing feature scope.

## Capabilities

### New Capabilities
- `orb-color-presets`: named two-stop palette system for the WebGL orb, a preset-selection prop API, and per-`agentState` intra-palette variants (passive vs active) that stay within each palette's tones.

### Modified Capabilities
- None (no existing spec-level orb behavior is documented; shape/behavior contract unchanged).

## Approach

Encode the extracted ElevenLabs palettes as a typed `presets` map. Each preset defines base `[string, string]` tuples plus per-`agentState` variants that shift only lightness/saturation/blend within the same family: `elevenLabs` (`#CADCFC`/`#A0B9D1`), `blueGreen` (`#2C7DA0`/`#7FA650`, DEFAULT), `lilacPeach` (`#8A7FD6`/`#F4B58E`), `coralOrange` (`#F26D6B`/`#F7A15C`), `oliveBlue` (`#8FA85C`/`#A9C0DA`). Export `OrbPresetName` + `ORB_PRESETS`. In `orb.tsx`, resolve `colors` from `preset` when `colors` is not passed; drive `agentState` transitions through the preset's variant tones (via the existing `colorsRef`/target-color lerp so shifts stay smooth). Default becomes `blueGreen`. No new dependencies; perlin-noise stays remote.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `components/orbs/orb-presets.ts` | New | Typed preset map + names, exported constants |
| `components/orbs/orb.tsx` | Modified | New default palette, optional `preset` prop, resolution logic |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Remote perlin-noise URL dependency (offline/CSP) | Med | Track as open question; option to vendor asset locally |
| Color contrast/legibility over app surfaces | Med | Validate presets over light/dark surfaces before default swap |
| Dark-mode inversion shifts saturated hues oddly | Med | Manually verify each preset with `uInverted` on/off |

## Rollback Plan

Revert `orb.tsx` default to `["#CADCFC", "#A0B9D1"]` and delete `orb-presets.ts`; preset prop is additive and non-breaking, so existing `colors`/`colorsRef` callers are unaffected.

## Dependencies

- `three`, `@react-three/fiber`, `@react-three/drei` — already installed.

## Success Criteria

- [ ] `ORB_PRESETS` exports all five named palettes with correct hex tuples.
- [ ] Orb renders each preset with faithful shape, grain, and blended gradient.
- [ ] Default palette is `blueGreen`; dark-mode inversion still works.
- [ ] Each preset shifts tones by `agentState` (passive vs active) without leaving its color family.
- [ ] No breaking change for existing `colors`/`colorsRef` consumers.

## Resolved Decisions

1. **Default preset** → `blueGreen`.
2. **Perlin-noise asset** → keep loading from the remote URL.
3. **Presets ↔ agent states** → each preset carries intra-palette variants; `agentState` shifts tones within its own family (passive/idle vs listening/talking) without leaving the palette. Multiple curated color combinations are provided.
4. **Preset prop API** → add optional `preset` prop; explicit `colors`/`colorsRef` still win (non-breaking).
