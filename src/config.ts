export const config = {
  sketch: {
    frameRate: 60,
  },
  world: {
    background: "#78624f",
  },
  foodItem: {
    size: 4, // diameter
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
    steeringLimit: 0.4,
    size: 3,
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
};
