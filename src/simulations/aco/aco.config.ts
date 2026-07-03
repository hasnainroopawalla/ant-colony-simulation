const AcoConfig = {
  // ant behavior
  antWanderStrength: 6,
  antSpeed: 120,
  antSteeringLimit: 720,
  antPerceptionRange: 35, // radius
  antAntennaRadius: 70,
  antAntennaRange: 90,
  antAntennaRotation: 1.1,
  antObstacleAngleRange: 0.7,
  antMaxSteps: 1000,
  // pheromone behavior
  pheromoneDistanceBetween: 200,
  pheromoneEvaporationRate: 0.3,
  pheromoneInitialStrength: 500,
};

export default AcoConfig;
