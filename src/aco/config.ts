export const config = {
  // sketch
  frameRate: 60,
  // world
  worldBackground: "#78624f",
  // food item
  foodItemSize: 4, // diameter
  foodItemColor: "#39FF14",
  foodItemStrokeWeight: 0,
  // food cluster
  foodClusterSpacing: 10,
  // colony
  colonySize: 70, // diameter
  colonyColor: "#ffffff",
  colonyStrokeWeight: 1,
  colonyTextSize: 20,
  antWanderStrength: 0.2,
  antMaxSpeed: 2.5,
  antSteeringLimit: 0.1,
  antSize: 4,
  antColor: "#000000",
  antStrokeWeight: 2,
  showAntPerceptionRange: false,
  antPerceptionRange: 35, //radius
  antPerceptionColorGray: 255,
  antPerceptionColorAlpha: 30,
  antPerceptionStrokeWeight: 1,
  showAntAntennas: false,
  antAntennaRadius: 70,
  antObstacleAngleRange: 0.7,
  // pheromone
  pheromoneSize: 4,
  pheromoneStrokeWeight: 0,
  pheromoneDistanceBetween: 200,
  pheromoneEvaporationRate: 0.3,
  showHomePheromones: false,
  homePheromoneColorRGB: [26, 166, 236],
  showFoodPheromones: true,
  pheromoneFoodColorRGB: [210, 31, 61],
  // quadtree
  showFoodItemsQuadtree: false,
  showHomePheromonesQuadtree: false,
  showFoodPheromonesQuadtree: false,
  showHighlightedQuadtree: false,
  quadtreeDefaultColor: "#FFFF00",
  quadtreeDefaultStrokeWeight: 1,
  quadtreeHighlightedColor: "#FF0000",
  quadtreeHighlightedStrokeWeight: 2,
  quadtreeMaxDepth: 7,
};
