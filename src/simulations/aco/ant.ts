import { FoodItem } from "../../world/food-item";
import { Colony } from "../../world/colony";
import AcoConfig from "./aco.config";
import { Vector, MathUtils } from "../../math";
import type { World } from "../../world";
import { Pheromone } from "./pheromone";
import type { AntColonySimulation } from "./aco";

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

  private sim: AntColonySimulation;
  private world: World;

  private state: AntState;
  private desiredVelocity: Vector;
  private angle: number;
  private colony: Colony;
  private targetFoodItem: FoodItem | null;
  private lastDepositedPheromone?: Pheromone;
  private steps: number;

  constructor(
    colony: Colony,
    world: World,
    sim: AntColonySimulation,
    spawnPosition: Vector,
  ) {
    this.world = world;
    this.colony = colony;
    this.sim = sim;

    this.steps = 0;

    this.state = AntState.Wandering;

    this.position = spawnPosition;
    this.angle = MathUtils.randomFloat(0, Math.PI * 2);
    this.velocity = MathUtils.fromAngle(this.angle).mult(AcoConfig.antMaxSpeed);
    this.desiredVelocity = MathUtils.fromAngle(this.angle);
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

  public update(dt: number): void {
    this.depositPheromone();

    this.decide(dt);
    this.handleObstacles(dt);

    // this.isReturningHome() && this.handleReturningHome();
    // this.isReturningHomeUsingPedometer() &&
    //   this.handleReturningHomeUsingPedometer();
    // this.handleWandering();
    this.move(dt);
    this.clampToBounds();
    // this.steps += 1;
  }

  private decide(dt: number): void {
    switch (this.state) {
      case AntState.Wandering:
        this.handleWandering(dt);
        break;
    }
  }

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

  private handleObstacles(dt: number): void {
    const maxAttempts = 8;
    const originalDesired = this.desiredVelocity.copy();
    const currentSpeed = this.velocity.getMagnitude();

    // Lookahead must always exceed the actual move step for this frame so
    // large dt spikes cannot tunnel through an obstacle.
    const stepDistance = currentSpeed * dt;
    const lookahead = Math.max(AcoConfig.antPerceptionRange, stepDistance * 2);

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
        this.desiredVelocity.copy().normalize().mult(lookahead),
      );

      const obstacleInRange = this.world.isObstacleInAntPerceptionRange(
        this.position,
        perception,
      );

      if (!obstacleInRange) {
        // Always snap velocity to the safe direction (including attempt 0)
        // so move() can't drift into an obstacle because velocity was still
        // lagging behind the previously-desired heading.
        this.velocity = this.desiredVelocity.copy().setMagnitude(currentSpeed);
        return;
      }
    }

    // Couldn't find a clear direction — turn around outright.
    this.desiredVelocity.rotate(Math.PI, true);
    this.velocity.rotate(Math.PI, true);
  }

  private depositPheromone(): void {
    const pheromone = this.sim.handlePheromoneDeposit(this.position.copy());
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
    const angle = MathUtils.randomFloat(-1, 1);
    this.desiredVelocity.rotate(angle * AcoConfig.antWanderStrength * dt, true);
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

  private colonyInPerceptionRange(): boolean {
    return MathUtils.areCirclesIntersecting(
      this.position,
      AcoConfig.antPerceptionRange,
      this.colony.position,
      this.colony.radius,
    );
  }

  // private shouldPheromoneBeDeposited() {
  //   if (this.state === AntState.ReturningHomeUsingPedometer) {
  //     return false;
  //   }
  //   if (!this.lastDepositedPheromone) {
  //     return true;
  //   }
  //   return (
  //     MathUtils.distance(this.position, this.lastDepositedPheromone.position) >
  //     AcoConfig.pheromoneDistanceBetween
  //   );
  // }

  private move(dt: number): void {
    const desired = this.desiredVelocity
      .copy()
      .setMagnitude(AcoConfig.antMaxSpeed);
    const steering = desired.sub(this.velocity);
    const acceleration = steering.limit(AcoConfig.antSteeringLimit);

    this.velocity.add(acceleration.mult(dt), true).limit(AcoConfig.antMaxSpeed);
    this.position.add(this.velocity.mult(dt), true);
  }
}
