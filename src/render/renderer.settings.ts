import type { SettingsSchema } from "../settings";

export type RendererSettings = {
  showPheromones: boolean;
  showAntAntennas: boolean;
};

export const rendererSettingsSchema: SettingsSchema<RendererSettings> = {
  showPheromones: {
    kind: "boolean",
    label: "Show Pheromones",
    default: false,
  },
  showAntAntennas: {
    kind: "boolean",
    label: "Show Ant Antennas",
    default: false,
  },
};
