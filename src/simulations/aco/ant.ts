import { FoodItem } from "../../world/food-item";
import { Colony } from "../../world/colony";
import * as AcoConstants from "./aco.constants";
import type { AcoSettings } from "./aco.settings";
import { Vector, MathUtils } from "../../math";
import type { World } from "../../world";
import { PheromoneType } from "./pheromone";
import type { AntColonySimulation } from "./aco";
import { Antenna } from "./antenna";

enum AntStateKind {
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

  private settings: AcoSettings;

  private sim: AntColonySimulation;
  private world: World;

  private state: AntState;
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
  }

  // private renderPerceptionRange() {
  //   this.p.push();
  //   this.p.strokeWeight(AcoConfig.antPerceptionStrokeWeight);
  //   this.p.fill(
  //     AcoConfig.antPerceptionColorGray,
  //     AcoConfig.antPerceptionColorAlpha,
  //   );
  //   const perception = this.getPerception();
  //   this.p.circle(perception.x, perception.y, this.settings.antPerceptionRange * 2);
  //   this.p.pop();
  // }

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
        this.handleReturningHome();
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

  private getPerception(): Vector {
    return this.position.add(
      this.velocity.normalize().mult(this.settings.antPerceptionRange),
    );
  }

  private handleObstacles(dt: number): void {
    const speed = this.velocity.getMagnitude();
    const lookahead = Math.max(
      this.settings.antPerceptionRange,
      speed * dt * 2,
    );

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
    this.desiredVelocity = this.desiredVelocity.rotate(Math.PI);
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

    const foodItem = this.world.queryFood(
      this.getPerception(),
      this.settings.antPerceptionRange,
    );

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

    this.followPheromones(PheromoneType.Food);
  }

  private handleApproachingFood(foodItem: FoodItem): void {
    // TODO: is this required here?
    this.depositPheromone(PheromoneType.Home);

    this.approachTarget(foodItem.position);

    if (foodItem.collide(this.position)) {
      // TODO: add some jitter here for more natural movement
      this.desiredVelocity = this.desiredVelocity.rotate(Math.PI);
      this.state = { kind: AntStateKind.ReturningHomeWithFood };
    }
  }

  private followPheromones(pheromoneType: PheromoneType): void {
    const leftScore = this.sim.samplePheromone(
      this.antennas.left,
      pheromoneType,
    );
    const rightScore = this.sim.samplePheromone(
      this.antennas.right,
      pheromoneType,
    );

    if (leftScore > rightScore) {
      // steer left
      this.desiredVelocity = this.desiredVelocity.rotate(
        -AcoConstants.ANT_ANTENNA_ROTATION,
      );
    } else if (rightScore > leftScore) {
      // steer right
      this.desiredVelocity = this.desiredVelocity.rotate(
        AcoConstants.ANT_ANTENNA_ROTATION,
      );
    }
  }

  // private handleWandering1() {
  //   // check if food item exists within perception range
  //   if (!this.targetFoodItem) {
  //     this.targetFoodItem = this.world.getFoodItemInAntPerceptionRange(
  //       this.getPerception(),
  //       this.settings.antPerceptionRange,
  //     );
  //   }

  //   if (!this.targetFoodItem) {
  //     // follow food pheromones if no food item is found within perception range
  //     this.handleAntennaSteering(IPheromoneType.Food);
  //   } else {
  //     // check if reserved food item is picked up
  //     if (this.targetFoodItem.collide(this.position)) {
  //       // rotate 180 degrees
  //       this.desiredVelocity.rotate(Math.PI, true);
  //       this.targetFoodItem.pickedUp();
  //       this.returningHome();
  //     } else {
  //       this.approachTarget(this.targetFoodItem.position);
  //     }
  //   }
  // }

  private handleReturningHome(): void {
    this.depositPheromone(PheromoneType.Food);

    this.followPheromones(PheromoneType.Home);
    // this.approachTarget(this.colony.position);
    // if (this.colonyInPerceptionRange()) {
    //   this.approachTarget(this.colony.position);
    //   // check if food item is delivered to colony
    //   if (this.colony.collide(this.position)) {
    //     // rotate 180 degrees
    //     this.desiredVelocity.rotate(Math.PI, true);
    //     this.targetFoodItem.delivered();
    //     this.targetFoodItem = null;
    //     this.colony.incrementFoodCount();
    //     this.searchingForFood();
    //   }
    // } else {
    //   // follow home pheromones to deliver food
    //   this.handleAntennaSteering(IPheromoneType.Home);
    // }
  }

  private colonyInPerceptionRange(): boolean {
    return MathUtils.areCirclesIntersecting(
      this.position,
      this.settings.antPerceptionRange,
      this.colony.position,
      this.colony.radius,
    );
  }

  private shouldDepositPheromone(): boolean {
    return (
      MathUtils.distance(this.position, this.lastDroppedPheromonePosition) >
      AcoConstants.PHEROMONE_DISTANCE_BETWEEN
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
  }
}
