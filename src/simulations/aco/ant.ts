import { FoodItem } from "../../world/food-item";
import { Colony } from "../../world/colony";
import AcoConfig from "./aco.config";
import { Vector, MathUtils } from "../../math";
import type { World } from "../../world";

enum AntState {
  Wandering,
  ReturningHome,
}

type IAntennas = {
  leftAntenna: Vector;
  frontAntenna: Vector;
  rightAntenna: Vector;
};

export class Ant {
  public position: Vector;
  public velocity: Vector;

  private state: AntState;

  private world: World;
  private desiredVelocity: Vector;
  private angle: number;
  private colony: Colony;
  private targetFoodItem: FoodItem | null;
  private lastDepositedPheromone?: Pheromone;
  private steps: number;

  constructor(colony: Colony, world: World, spawnPosition: Vector) {
    this.world = world;
    this.colony = colony;

    this.steps = 0;

    this.state = AntState.Wandering;

    this.position = spawnPosition;
    this.angle = MathUtils.randomFloat(0, Math.PI * 2);
    this.velocity = MathUtils.fromAngle(this.angle);
    this.desiredVelocity = this.velocity.copy();
  }

  // private renderPerceptionRange() {
  //   this.p.push();
  //   this.p.strokeWeight(AcoConfig.antPerceptionStrokeWeight);
  //   this.p.fill(
  //     AcoConfig.antPerceptionColorGray,
  //     AcoConfig.antPerceptionColorAlpha,
  //   );
  //   const perception = this.getPerception();
  //   this.p.circle(perception.x, perception.y, AcoConfig.antPerceptionRange * 2);
  //   this.p.pop();
  // }

  public update() {
    this.decide();
    // this.handleBoundaries();
    this.handleObstacles();
    // this.handlePheromoneDeposit();

    // this.isReturningHome() && this.handleReturningHome();
    // this.isReturningHomeUsingPedometer() &&
    //   this.handleReturningHomeUsingPedometer();
    // this.handleWandering();
    this.move();
    this.clampToBounds();
    // this.steps += 1;
  }

  private decide(): void {
    switch (this.state) {
      case AntState.Wandering:
        this.handleWandering();
        break;
    }
  }

  // Randomly set the ant's initial orientation and velocity
  private setSpawnOrientation(): void {}

  private approachTarget(target: Vector): void {
    this.desiredVelocity = target.sub(this.position).normalize();
  }

  private getAntennas(): IAntennas {
    const leftAntenna = this.position.add(
      this.desiredVelocity
        .rotate(-AcoConfig.antAntennaRotation)
        .mult(AcoConfig.antAntennaRange),
    );
    const frontAntenna = this.position.add(
      this.desiredVelocity.mult(AcoConfig.antAntennaRange),
    );
    const rightAntenna = this.position.add(
      this.desiredVelocity
        .rotate(AcoConfig.antAntennaRotation)
        .mult(AcoConfig.antAntennaRange),
    );

    // AcoConfig.showAntAntennas &&
    //   this.p.circle(leftAntenna.x, leftAntenna.y, AcoConfig.antAntennaRadius) &&
    //   this.p.circle(
    //     frontAntenna.x,
    //     frontAntenna.y,
    //     AcoConfig.antAntennaRadius,
    //   ) &&
    //   this.p.circle(rightAntenna.x, rightAntenna.y, AcoConfig.antAntennaRadius);

    return { leftAntenna, frontAntenna, rightAntenna };
  }

  private getPerception(): Vector {
    return this.position
      .copy()
      .add(this.velocity.copy().normalize().mult(AcoConfig.antPerceptionRange));
  }

  // private handleObstacles(): void {
  //   let obstacleInRange: boolean;
  //   do {
  //     const perception = this.position.add(
  //       this.desiredVelocity.mult(AcoConfig.antPerceptionRange * 2),
  //     );
  //     obstacleInRange = this.world.isObstacleInAntPerceptionRange(
  //       this.position,
  //       perception,
  //     );
  //     if (obstacleInRange) {
  //       // randomly set positive or negative angleRange
  //       // TODO: turn left/right based on the angle of collision
  //       this.desiredVelocity.rotate(
  //         Math.random() < 0.5
  //           ? AcoConfig.antObstacleAngleRange
  //           : -AcoConfig.antObstacleAngleRange,
  //         true,
  //       );
  //     }
  //   } while (obstacleInRange);
  // }

  private handleObstacles(): void {
    const maxAttempts = 8;
    const originalDesired = this.desiredVelocity.copy();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Sweep outward from the original heading: 0, +Δ, -Δ, +2Δ, -2Δ, ...
      // This finds the closest clear direction instead of drifting randomly,
      // which prevents sudden large swings when a rotation finally clears.
      const step = Math.ceil(attempt / 2);
      const sign = attempt % 2 === 0 ? 1 : -1;
      const angle = sign * step * AcoConfig.antObstacleAngleRange;

      this.desiredVelocity = originalDesired.copy().rotate(angle, true);

      // Look along the direction we intend to move next, not the stale
      // velocity — otherwise rotating desiredVelocity below has no effect on
      // what we're testing on the next iteration.
      const perception = this.position.add(
        this.desiredVelocity
          .copy()
          .normalize()
          .mult(AcoConfig.antPerceptionRange),
      );

      const obstacleInRange = this.world.isObstacleInAntPerceptionRange(
        this.position,
        perception,
      );

      if (!obstacleInRange) {
        if (attempt > 0) {
          // Snap the velocity value, so it immediately follows the new desired direction,
          // rather than slowly turning toward it.
          this.velocity = this.desiredVelocity
            .copy()
            .setMagnitude(this.velocity.getMagnitude());
        }
        return;
      }
    }

    // Couldn't find a clear direction — turn around outright.
    this.desiredVelocity.rotate(Math.PI, true);
    this.velocity.rotate(Math.PI, true);
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

  private handleWandering(): void {
    const angle = MathUtils.randomFloat(-1, 1);
    this.desiredVelocity.rotate(angle * AcoConfig.antWanderStrength, true);
  }

  private handleAntennaSteering(pheromoneType: IPheromoneType) {
    const antennas = this.getAntennas();
    const [leftAntenna, frontAntenna, rightAntenna] =
      this.world.computeAntAntennasPheromoneValues(
        [antennas.leftAntenna, antennas.frontAntenna, antennas.rightAntenna],
        AcoConfig.antAntennaRadius,
        pheromoneType,
      );

    if (frontAntenna > leftAntenna && frontAntenna > rightAntenna) {
      // do nothing
    } else if (leftAntenna > rightAntenna) {
      this.desiredVelocity.rotate(-AcoConfig.antAntennaRotation, true);
    } else if (rightAntenna > leftAntenna) {
      this.desiredVelocity.rotate(AcoConfig.antAntennaRotation, true);
    }
  }

  private handleWandering1() {
    // check if food item exists within perception range
    if (!this.targetFoodItem) {
      this.targetFoodItem = this.world.getFoodItemInAntPerceptionRange(
        this.getPerception(),
        AcoConfig.antPerceptionRange,
      );
    }

    if (!this.targetFoodItem) {
      // follow food pheromones if no food item is found within perception range
      this.handleAntennaSteering(IPheromoneType.Food);
    } else {
      // check if reserved food item is picked up
      if (this.targetFoodItem.collide(this.position)) {
        // rotate 180 degrees
        this.desiredVelocity.rotate(Math.PI, true);
        this.targetFoodItem.pickedUp();
        this.returningHome();
      } else {
        this.approachTarget(this.targetFoodItem.position);
      }
    }
  }

  private handleReturningHome() {
    if (this.colonyInPerceptionRange()) {
      this.approachTarget(this.colony.position);
      // check if food item is delivered to colony
      if (this.colony.collide(this.position)) {
        // rotate 180 degrees
        this.desiredVelocity.rotate(Math.PI, true);
        this.targetFoodItem.delivered();
        this.targetFoodItem = null;
        this.colony.incrementFoodCount();
        this.searchingForFood();
      }
    } else {
      // follow home pheromones to deliver food
      this.handleAntennaSteering(IPheromoneType.Home);
    }
  }

  private handleReturningHomeUsingPedometer() {
    this.approachTarget(this.colony.position);
    if (this.colony.collide(this.position)) {
      // ant leaves the colony at a random angle
      this.setSpawnOrientation();
      this.searchingForFood();
    }
  }

  private colonyInPerceptionRange(): boolean {
    return MathUtils.areCirclesIntersecting(
      this.position,
      AcoConfig.antPerceptionRange * 2,
      this.colony.position,
      this.colony.radius * 2,
    );
  }

  private shouldPheromoneBeDeposited() {
    if (this.state === AntState.ReturningHomeUsingPedometer) {
      return false;
    }
    if (!this.lastDepositedPheromone) {
      return true;
    }
    return (
      MathUtils.distance(this.position, this.lastDepositedPheromone.position) >
      AcoConfig.pheromoneDistanceBetween
    );
  }

  private handlePheromoneDeposit() {
    if (!this.shouldPheromoneBeDeposited()) {
      return;
    }
    this.lastDepositedPheromone = new Pheromone(
      this.p,
      this.position.copy(),
      this.isReturningHome() ? IPheromoneType.Food : IPheromoneType.Home,
    );
    this.world.depositPheromone(this.lastDepositedPheromone);
  }

  private move(): void {
    const subtracted = this.desiredVelocity.sub(this.velocity);
    const desiredSteer = subtracted.mult(AcoConfig.antSteeringLimit);
    const acceleration = desiredSteer.limit(AcoConfig.antSteeringLimit);

    this.velocity.add(acceleration, true).limit(AcoConfig.antMaxSpeed);
    this.position.add(this.velocity.mult(AcoConfig.antMaxSpeed), true);
  }
}
