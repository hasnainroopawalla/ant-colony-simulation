const AcoConfig = {
  // ant
  antWanderStrength: 0.2,
  antMaxSpeed: 3,
  antSteeringLimit: 0.1,
  showAntPerceptionRange: false,
  antPerceptionRange: 35, //radius
  showAntAntennas: false,
  antAntennaRadius: 70,
  antAntennaRange: 90,
  antAntennaRotation: 1.1,
  antObstacleAngleRange: 0.7,
  antMaxSteps: 1000,
  // pheromone
  pheromoneSize: 4,
  pheromoneStrokeWeight: 0,
  pheromoneDistanceBetween: 200,
  pheromoneEvaporationRate: 0.3,
  pheromoneInitialStrength: 500,
  showHomePheromones: false,
  homePheromoneColorRGB: [26, 166, 236],
  showFoodPheromones: true,
  pheromoneFoodColorRGB: [210, 31, 61],
};

export default AcoConfig;
