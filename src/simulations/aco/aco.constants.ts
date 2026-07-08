export const ANT_ANTENNA_RADIUS = 10;
export const ANT_ANTENNA_RANGE = 20;
export const ANT_ANTENNA_ROTATION = 1;
export const ANT_OBSTACLE_ANGLE_RANGE = 0.7;

// Rate (rad/s) at which an ant steers toward a pheromone trail when one
// antenna scores higher than the other. Kept well below the antenna spread
// so the ant curves smoothly instead of snapping onto trails.
export const ANT_PHEROMONE_STEERING_RATE = 4;

// Pheromone behavior
export const PHEROMONE_DISTANCE_BETWEEN = 200;
export const PHEROMONE_EVAPORATION_RATE = 0; // strength units per second
export const PHEROMONE_INITIAL_STRENGTH = 500;
