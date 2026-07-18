export type Stats = {
  fps: number;
  antCount: {
    home: number;
    food: number;
  };
  foodAmount: number;
  elapsedTime: number; // seconds
};

export type IEvents = {
  "stats.update": Stats;
};
