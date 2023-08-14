export const config = {
  sketch: {
    frameRate: 60,
  },
  world: {
    background: "#78624f",
  },
  foodItem: {
    size: 3, // diameter
    color: "#39FF14",
    strokeWeight: 0,
  },
  foodCluster: {
    spacing: 0,
  },
  colony: {
    size: 70, // diameter
    color: "#ffffff",
    strokeWeight: 1,
    textSize: 20,
  },
  ant: {
    wanderStrength: 1,
    maxSpeed: 2.5,
    steeringLimit: 0.4,
    size: 2,
    color: "#000000",
    strokeWeight: 2,
    perception: {
      show: false,
      range: 50, // radius
      gray: 255,
      alpha: 30,
      strokeWeight: 1,
    },
  },
  pheromone: {
    size: 3,
    strokeWeight: 0,
    distanceBetween: 20,
    evaporationRate: 1,
    wander: {
      show: false,
      colorRGB: [26, 166, 236],
    },
    food: {
      show: true,
      colorRGB: [210, 31, 61],
    },
  },
};
