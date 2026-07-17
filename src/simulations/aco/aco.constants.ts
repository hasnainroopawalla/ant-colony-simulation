export const ANT_ANTENNA_RADIUS = 4;
export const ANT_ANTENNA_RANGE = 12;
export const ANT_ANTENNA_ROTATION = 0.7;
export const ANT_OBSTACLE_ANGLE_RANGE = 0.7;
export const ANT_HOME_BIAS = 0.1;
export const ANT_TURN_JITTER = 0.4; // max random deviation (rad) on U-turns
export const ANT_CONTACT_RADIUS = 5;
export const ANT_SPAWN_RADIUS = 30;

// Rate (rad/s) at which an ant steers toward a pheromone trail when one
// antenna scores higher than the other. Kept well below the antenna spread
// so the ant curves smoothly instead of snapping onto trails.
export const ANT_PHEROMONE_STEERING_RATE = 4;

// Pheromone Field
export const PHEROMONE_FIELD_CELL_SIZE = 8;

export const PHEROMONE_MAX_STRENGTH = 1;
export const PHEROMONE_DEPOSIT_AMOUNT = 0.08;
export const PHEROMONE_EVAPORATION_RATE = 0.05;
export const PHEROMONE_DISTANCE_BETWEEN = PHEROMONE_FIELD_CELL_SIZE * 0.6; // ~5
