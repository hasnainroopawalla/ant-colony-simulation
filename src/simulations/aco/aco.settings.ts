import type { SettingSchema } from "../../settings-provider";

export type AcoSettings = {
  antWanderStrength: number;
  antSpeed: number;
  antSteeringLimit: number;
  antPerceptionRange: number;
};

export const acoSettingsSchema: Record<keyof AcoSettings, SettingSchema> = {
  antSpeed: {
    kind: "number",
    label: "Ant Speed",
    default: 120,
    min: 10,
    max: 500,
    step: 10,
  },
  antWanderStrength: {
    kind: "number",
    label: "Wander",
    default: 6,
    min: 0,
    max: 20,
    step: 0.5,
  },
  antSteeringLimit: {
    kind: "number",
    label: "Steering Limit",
    default: 720,
    min: 100,
    max: 2000,
    step: 50,
  },
  antPerceptionRange: {
    kind: "number",
    label: "Perception Range",
    default: 35,
    min: 10,
    max: 100,
    step: 5,
  },
};

export const defaultAcoSettings = (): AcoSettings =>
  Object.fromEntries(
    Object.entries(acoSettingsSchema).map(([key, schema]) => [
      key,
      schema.default,
    ]),
  ) as AcoSettings;
