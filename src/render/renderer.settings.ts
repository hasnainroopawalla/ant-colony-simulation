import type { SettingsSchema } from "../settings";

export type RendererSettings = {
  showPheromones: boolean;
  showAntAntennas: boolean;
  showFoodQuadtree: boolean;
  showAntPerception: boolean;
};

export const rendererSettingsSchema: SettingsSchema<RendererSettings> = {
  showPheromones: {
    kind: "boolean",
    label: "Show Pheromones",
    default: false,
  },
  showFoodQuadtree: {
    kind: "boolean",
    label: "Show Food Quadtree",
    default: false,
  },
  showAntAntennas: {
    kind: "boolean",
    label: "Show Ant Antennas",
    default: false,
  },
  showAntPerception: {
    kind: "boolean",
    label: "Show Ant Perception",
    default: false,
  },
};
