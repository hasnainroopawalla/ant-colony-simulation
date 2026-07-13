import { Colony } from "../../world/colony";
import * as AcoConstants from "./aco.constants";
import type { AcoSettings } from "./aco.settings";
import { Vector, MathUtils } from "../../math";
import type { FoodItem, World } from "../../world";
import { PheromoneType } from "./pheromone";
import type { AntColonySimulation } from "./aco";
import { Antenna } from "./antenna";
import { Circle } from "../../math/types";

export enum AntStateKind {
  Wandering,
  ApproachingFood,
  ReturningHomeWithFood,
}

type AntState =
  | {
      kind: AntStateKind.Wandering;
    }
  | {
      kind: AntStateKind.ApproachingFood;
      targetFoodItem: FoodItem;
    }
  | {
      kind: AntStateKind.ReturningHomeWithFood;
    };

type AntennaSet = {
  left: Antenna;
  front: Antenna;
  right: Antenna;
};

export class Ant {
  public position: Vector;
  public velocity: Vector;
  public antennas: AntennaSet;
  public state: AntState;

  private settings: AcoSettings;

  private sim: AntColonySimulation;
  private world: World;

  // Running path-integration estimate of the displacement from here back to the nest.
  private homeVector: Vector;

  private desiredVelocity: Vector;
  private angle: number;
  private colony: Colony;

  private lastDroppedPheromonePosition: Vector;

  // Sweep outward from the current heading: center first, then alternating
  // sides at increasing magnitudes. Finds the closest clear direction.
  private static readonly OBSTACLE_SWEEP_OFFSETS = [0, 1, -1, 2, -2, 3, -3, 4];

  constructor(
    colony: Colony,
    world: World,
    sim: AntColonySimulation,
    spawnPosition: Vector,
    settings: AcoSettings,
  ) {
    this.world = world;
    this.colony = colony;
    this.sim = sim;

    this.settings = settings;

    this.state = { kind: AntStateKind.Wandering };

    // initialize antennas at spawn position - will be updated in the next frame
    this.antennas = {
      left: new Antenna(spawnPosition),
      front: new Antenna(spawnPosition),
      right: new Antenna(spawnPosition),
    };

    this.position = spawnPosition;
    this.angle = MathUtils.randomFloat(0, Math.PI * 2);
    this.velocity = MathUtils.fromAngle(this.angle).mult(
      this.settings.antSpeed,
    );
    this.desiredVelocity = MathUtils.fromAngle(this.angle);

    this.lastDroppedPheromonePosition = spawnPosition;

    this.homeVector = this.colony.position.sub(spawnPosition);
  }

  public update(dt: number): void {
    this.updateAntennas();

    this.decide(dt);
    this.handleObstacles(dt);

    this.move(dt);
    this.clampToBounds();
  }

  private decide(dt: number): void {
    switch (this.state.kind) {
      case AntStateKind.Wandering:
        this.handleWandering(dt);
        break;
      case AntStateKind.ApproachingFood:
        this.handleApproachingFood(this.state.targetFoodItem);
        break;
      case AntStateKind.ReturningHomeWithFood:
        this.handleReturningHome(dt);
        break;
    }
  }

  private approachTarget(target: Vector): void {
    this.desiredVelocity = target.sub(this.position).normalize();
  }

  private updateAntennas(): void {
    this.antennas.left.position = this.getAntennaPosition(
      -AcoConstants.ANT_ANTENNA_ROTATION,
    );
    this.antennas.front.position = this.getAntennaPosition(0);
    this.antennas.right.position = this.getAntennaPosition(
      AcoConstants.ANT_ANTENNA_ROTATION,
    );
  }

  private getAntennaPosition(angle: number): Vector {
    return this.position.add(
      this.desiredVelocity.rotate(angle).mult(AcoConstants.ANT_ANTENNA_RANGE),
    );
  }

  private getPerception(): Circle {
    return {
      center: this.position.add(
        this.velocity.normalize().mult(this.settings.antPerceptionRange),
      ),
      radius: this.settings.antPerceptionRange,
    };
  }

  private handleObstacles(dt: number): void {
    const speed = this.velocity.getMagnitude();
    const lookahead = Math.max(
      this.settings.antPerceptionRange,
      speed * dt * 2,
    );

    // TODO: add jitter
    for (const step of Ant.OBSTACLE_SWEEP_OFFSETS) {
      const angle = step * AcoConstants.ANT_OBSTACLE_ANGLE_RANGE;
      const candidate = this.desiredVelocity.rotate(angle);

      if (this.isDirectionClear(candidate, lookahead)) {
        this.desiredVelocity = candidate;
        this.velocity = candidate.setMagnitude(speed);
        return;
      }
    }

    // No clear direction — reverse.
    this.flipDirection();
    this.velocity = this.velocity.rotate(Math.PI);
  }

  private isDirectionClear(direction: Vector, lookahead: number): boolean {
    const perception = this.position.add(direction.normalize().mult(lookahead));

    return !this.world.isPathBlocked(this.position, perception);
  }

  private depositPheromone(pheromoneType: PheromoneType): void {
    if (this.shouldDepositPheromone()) {
      this.sim.depositPheromone(this.position, pheromoneType);
      this.lastDroppedPheromonePosition = this.position;
    }
  }

  private clampToBounds(): void {
    const { w, h } = this.world.dims;
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = Math.abs(this.velocity.x);
      this.desiredVelocity.x = Math.abs(this.desiredVelocity.x);
    } else if (this.position.x > w) {
      this.position.x = w;
      this.velocity.x = -Math.abs(this.velocity.x);
      this.desiredVelocity.x = -Math.abs(this.desiredVelocity.x);
    }
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = Math.abs(this.velocity.y);
      this.desiredVelocity.y = Math.abs(this.desiredVelocity.y);
    } else if (this.position.y > h) {
      this.position.y = h;
      this.velocity.y = -Math.abs(this.velocity.y);
      this.desiredVelocity.y = -Math.abs(this.desiredVelocity.y);
    }
  }

  private handleWandering(dt: number): void {
    this.depositPheromone(PheromoneType.Home);

    const foodItem = this.world.queryFood(this.getPerception());

    if (foodItem) {
      this.state = {
        kind: AntStateKind.ApproachingFood,
        targetFoodItem: foodItem,
      };
      return;
    }

    this.desiredVelocity = this.desiredVelocity.rotate(
      MathUtils.randomFloat(-1, 1) * this.settings.antWanderStrength * dt,
    );

    this.followPheromones(PheromoneType.Food, dt);
  }

  private handleApproachingFood(foodItem: FoodItem): void {
    // TODO: is this required here?
    this.depositPheromone(PheromoneType.Home);

    this.approachTarget(foodItem.position);

    if (this.hasReached(foodItem.position)) {
      foodItem.consume();
      this.flipDirection();
      this.state = { kind: AntStateKind.ReturningHomeWithFood };
    }
  }

  private followPheromones(pheromoneType: PheromoneType, dt: number): void {
    const leftScore = this.sim.samplePheromone(
      this.antennas.left,
      pheromoneType,
    );
    const rightScore = this.sim.samplePheromone(
      this.antennas.right,
      pheromoneType,
    );

    if (leftScore === rightScore) {
      return;
    }

    const step = AcoConstants.ANT_PHEROMONE_STEERING_RATE * dt;
    this.desiredVelocity = this.desiredVelocity.rotate(
      leftScore > rightScore ? -step : step,
    );
  }

  private handleReturningHome(dt: number): void {
    this.depositPheromone(PheromoneType.Food);

    // Once the colony is visible, home in on it directly so the ant
    // actually arrives instead of chasing nearby pheromone trails.
    if (this.colonyInPerceptionRange()) {
      this.approachTarget(this.colony.position);

      if (this.hasReached(this.colony.position)) {
        this.colony.incrementFoodCount();
        this.flipDirection();
        this.state = { kind: AntStateKind.Wandering };
      }
      return;
    }

    this.followPheromones(PheromoneType.Home, dt);

    const homeDirection = this.homeVector.normalize();
    this.desiredVelocity = this.desiredVelocity
      .add(homeDirection.mult(AcoConstants.ANT_HOME_BIAS))
      .normalize();
  }

  private colonyInPerceptionRange(): boolean {
    const perception = this.getPerception();

    return MathUtils.isPointInCircle(
      this.colony.position,
      perception.center,
      perception.radius,
    );
  }

  private shouldDepositPheromone(): boolean {
    return (
      MathUtils.distance(this.position, this.lastDroppedPheromonePosition) >
      AcoConstants.PHEROMONE_DISTANCE_BETWEEN
    );
  }

  private flipDirection(): void {
    this.desiredVelocity = this.desiredVelocity.rotate(
      Math.PI + MathUtils.randomFloat(-1, 1) * AcoConstants.ANT_TURN_JITTER,
    );
  }

  private move(dt: number): void {
    const desired = this.desiredVelocity.setMagnitude(this.settings.antSpeed);
    const steering = desired.sub(this.velocity);
    const acceleration = steering.limit(this.settings.antSteeringLimit);

    this.velocity = this.velocity
      .add(acceleration.mult(dt))
      .limit(this.settings.antSpeed);

    this.position = this.position.add(this.velocity.mult(dt));

    // Integrate the step just taken so homeVector keeps tracking (home - position).
    this.homeVector = this.homeVector.sub(this.velocity.mult(dt));
  }

  private hasReached(position: Vector): boolean {
    return MathUtils.arePointsClose(
      this.position,
      position,
      AcoConstants.ANT_CONTACT_RADIUS,
    );
  }
}
