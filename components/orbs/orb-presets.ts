// Named orb color presets with per-agentState intra-palette variants.
// Pure module (no side effects) so it stays safe inside the "use client" chain.

import type { AgentState } from "./orb"

export type OrbColorPair = [string, string]

export type OrbPresetName =
  | "elevenLabs"
  | "blueGreen"
  | "lilacPeach"
  | "coralOrange"
  | "oliveBlue"

export type OrbStateKey = "idle" | "thinking" | "listening" | "talking"

export type OrbPreset = {
  base: OrbColorPair
  states: Record<OrbStateKey, OrbColorPair>
}

export const DEFAULT_ORB_PRESET: OrbPresetName = "blueGreen"

// Authoring rule per preset (same hue family, only lightness/saturation shift):
// idle == base (calmest), thinking = subtle/mid, listening = brighter,
// talking = most saturated/high-contrast. No cross-family hue jumps.
export const ORB_PRESETS: Record<OrbPresetName, OrbPreset> = {
  elevenLabs: {
    base: ["#CADCFC", "#A0B9D1"],
    states: {
      idle: ["#CADCFC", "#A0B9D1"],
      thinking: ["#B8D0F8", "#90AECB"],
      listening: ["#A6C4F5", "#7FA3C6"],
      talking: ["#93B8F2", "#6E98C2"],
    },
  },
  blueGreen: {
    base: ["#2C7DA0", "#7FA650"],
    states: {
      idle: ["#2C7DA0", "#7FA650"],
      thinking: ["#2A87AE", "#86B054"],
      listening: ["#2492BF", "#8FBC58"],
      talking: ["#1D9ED2", "#98C95C"],
    },
  },
  lilacPeach: {
    base: ["#8A7FD6", "#F4B58E"],
    states: {
      idle: ["#8A7FD6", "#F4B58E"],
      thinking: ["#8073DA", "#F6AC7F"],
      listening: ["#7566E0", "#F8A16D"],
      talking: ["#6A58E6", "#FA9459"],
    },
  },
  coralOrange: {
    base: ["#F26D6B", "#F7A15C"],
    states: {
      idle: ["#F26D6B", "#F7A15C"],
      thinking: ["#F45E5C", "#F9974C"],
      listening: ["#F64E4B", "#FB8C3B"],
      talking: ["#F83E3A", "#FD8028"],
    },
  },
  oliveBlue: {
    base: ["#8FA85C", "#A9C0DA"],
    states: {
      idle: ["#8FA85C", "#A9C0DA"],
      thinking: ["#93B057", "#9BB8D6"],
      listening: ["#97B851", "#8DB0D2"],
      talking: ["#9BC04A", "#7FA8CE"],
    },
  },
}

// Resolve a fresh color tuple for a preset given the current agent state.
// A null agentState maps to the passive "idle" variant.
export function resolveOrbColors(
  preset: OrbPresetName,
  agentState: AgentState
): OrbColorPair {
  const stateKey: OrbStateKey = agentState ?? "idle"
  const [c1, c2] = ORB_PRESETS[preset].states[stateKey]
  return [c1, c2]
}
