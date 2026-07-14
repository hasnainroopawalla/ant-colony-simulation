export const ANT_ANTENNA_RADIUS = 4;
export const ANT_ANTENNA_RANGE = 12;
export const ANT_ANTENNA_ROTATION = 0.7;
export const ANT_OBSTACLE_ANGLE_RANGE = 0.7;
export const ANT_HOME_BIAS = 0.1;
export const ANT_TURN_JITTER = 0.4; // max random deviation (rad) on U-turns
export const ANT_CONTACT_RADIUS = 5;

// Rate (rad/s) at which an ant steers toward a pheromone trail when one
// antenna scores higher than the other. Kept well below the antenna spread
// so the ant curves smoothly instead of snapping onto trails.
export const ANT_PHEROMONE_STEERING_RATE = 4;

// Pheromone behavior
export const PHEROMONE_DISTANCE_BETWEEN = 50;
export const PHEROMONE_EVAPORATION_RATE = 10; // strength units per second
export const PHEROMONE_INITIAL_STRENGTH = 500;

// Pheromone Field
export const PHEROMONE_FIELD_CELL_SIZE = 8;
