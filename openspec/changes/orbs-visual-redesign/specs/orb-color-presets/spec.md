# Delta for orb-color-presets

## ADDED Requirements

### Requirement: Preset Module Exports

The system MUST provide a preset module (`components/orbs/orb-presets.ts`) exporting a typed `OrbPresetName` union and an `ORB_PRESETS` map of named two-stop palettes: `elevenLabs`, `blueGreen`, `lilacPeach`, `coralOrange`, `oliveBlue`. Each preset MUST expose a base `[string, string]` color tuple.

#### Scenario: Named presets are importable

- GIVEN a consumer imports from `orb-presets`
- WHEN it reads `ORB_PRESETS`
- THEN all five presets exist with their base hex tuples (`blueGreen` = `["#2C7DA0","#7FA650"]`)
- AND `OrbPresetName` types every preset key

### Requirement: Default Preset

The orb MUST default to the `blueGreen` preset when neither `colors`, `colorsRef`, nor `preset` is provided.

#### Scenario: No color input

- GIVEN an `<Orb />` rendered without color props
- WHEN it initializes
- THEN it renders with the `blueGreen` base tuple

#### Scenario: Preset prop selects palette

- GIVEN an `<Orb preset="coralOrange" />`
- WHEN it initializes
- THEN it renders with the `coralOrange` palette

### Requirement: Explicit Colors Override (Backward Compatible)

The orb MUST prioritize explicit `colors`/`colorsRef` over any `preset`, and the `preset` prop MUST be additive and non-breaking.

#### Scenario: Explicit colors win

- GIVEN an `<Orb preset="blueGreen" colors={["#000","#fff"]} />`
- WHEN it initializes
- THEN it renders with `["#000","#fff"]`, ignoring the preset

#### Scenario: Existing callers unchanged

- GIVEN a pre-existing caller passing only `colors`/`colorsRef`
- WHEN the preset feature ships
- THEN its rendering is identical to before

### Requirement: Per-agentState Intra-Palette Variants

Each preset MUST define per-`agentState` variants that shift lightness/saturation/blend WITHIN the same color family. `null`/`idle` MUST map to a passive variant; `listening`/`talking`/`thinking` MUST map to more active variants. Variants MUST NOT change the hue family, and transitions MUST be smooth via the existing target-color lerp.

#### Scenario: Passive vs active tones

- GIVEN an orb using `oliveBlue`
- WHEN `agentState` changes from `null` (passive) to `talking` (active)
- THEN tones shift within the olive/blue family
- AND the hue family is preserved (no cross-family jump)

#### Scenario: Smooth transition

- GIVEN an active `agentState` change
- WHEN the color updates
- THEN the change lerps smoothly rather than snapping

### Requirement: Dark-Mode Inversion Per Preset

Dark-mode inversion (`uInverted`) MUST continue to work for every preset without breaking hue identity.

#### Scenario: Inversion toggled

- GIVEN any preset rendered
- WHEN `uInverted` is enabled
- THEN the orb renders its dark-mode appearance without shader errors

### Requirement: Visual Fidelity Preserved

The orb MUST preserve its existing shape, grainy noise, and soft blended two-stop gradient. No shader math, geometry, or agent-state/volume ring behavior MAY change.

#### Scenario: No visual regression

- GIVEN a preset applied
- WHEN the orb renders
- THEN shape, grain, and blended gradient match the pre-change baseline
- AND volume/agent-state rings behave unchanged

### Requirement: Remote Perlin-Noise Texture

The orb MUST continue loading the perlin-noise texture from its existing remote URL.

#### Scenario: Texture loads

- GIVEN any preset rendered
- WHEN the orb mounts
- THEN the remote perlin-noise texture loads and drives the grain
