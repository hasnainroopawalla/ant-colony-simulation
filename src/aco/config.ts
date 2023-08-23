export const config = {
  // sketch
  frameRate: 60,
  // world
  worldBackground: "#78624f",
  // food item
  foodItemSize: 3, // diameter
  foodItemColor: "#39FF14",
  foodItemStrokeWeight: 0,
  // food cluster
  foodClusterSpacing: 7,
  // colony
  colonySize: 70, // diameter
  colonyColor: "#ffffff",
  colonyStrokeWeight: 1,
  colonyTextSize: 20,
  antWanderStrength: 1,
  antMaxSpeed: 2.5,
  antSteeringLimit: 0.4,
  antSize: 2,
  antColor: "#000000",
  antStrokeWeight: 2,
  showAntPerceptionRange: false,
  antPerceptionRange: 50, //radius
  antPerceptionColorGray: 255,
  antPerceptionColorAlpha: 30,
  antPerceptionStrokeWeight: 1,
  // pheromone
  pheromoneSize: 3,
  pheromoneStrokeWeight: 0,
  pheromoneDistanceBetween: 20,
  pheromoneEvaporationRate: 1,
  showPheromoneWander: false,
  pheromoneWanderColorRGB: [26, 166, 236],
  showPheromoneFood: true,
  pheromoneFoodColorRGB: [210, 31, 61],
  // quadtree
  showQuadtree: false,
  quadtreeDefaultColor: "red", // TODO: Change to hex
  quadtreeDefaultStrokeWeight: 1,
  quadtreeHighlightedColor: "white", // TODO: Change to hex
  quadtreeHighlightedStrokeWeight: 2,
};
