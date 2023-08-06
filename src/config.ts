export const config = {
  sketch: {
    frameRate: 60,
  },
  world: {
    background: "#78624f",
  },
  foodItem: {
    size: 5, // diameter
    color: "#39FF14",
    strokeWeight: 0,
  },
  foodCluster: {
    spacing: 17,
  },
  colony: {
    size: 70, // diameter
  },
  ant: {
    perceptionRange: 50,
    wanderStrength: 1,
    maxSpeed: 3,
    steeringLimit: 0.4,
    size: 3,
    color: "#000000",
    showPerceptionRange: false,
  },
};
