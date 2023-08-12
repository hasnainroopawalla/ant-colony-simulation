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
    spacing: 17,
  },
  colony: {
    size: 70, // diameter
    color: "#ffffff",
    strokeWeight: 1,
    textSize: 20,
  },
  ant: {
    wanderStrength: 1,
    maxSpeed: 3,
    steeringLimit: 0.7,
    size: 2,
    color: "#000000",
    strokeWeight: 2,
    perception: {
      show: false,
      range: 50,
      gray: 255,
      alpha: 30,
      strokeWeight: 1,
    },
  },
  pheromone: {
    size: 3,
    strokeWeight: 0,
    distanceBetween: 10,
    show: true,
    evaporationRate: 0.007,
    wander: {
      color: "#1AA7EC",
    },
    food: {
      color: "#D21F3C",
    },
  },
};
