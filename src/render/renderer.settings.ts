import type { SettingsSchema } from "../settings";

export type RendererSettings = {
  showPheromones: boolean;
};

export const rendererSettingsSchema: SettingsSchema<RendererSettings> = {
  showPheromones: {
    kind: "boolean",
    label: "Show Pheromones",
    default: false,
  },
};
