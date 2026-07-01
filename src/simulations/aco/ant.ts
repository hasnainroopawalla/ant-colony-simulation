import { FoodItem } from "../../world/food-item";
import { Colony } from "../../world/colony";
import AcoConfig from "./aco.config";
import {
  areCirclesIntersecting,
  distance,
  randomFloat,
} from "../../math/utils";
import { Vector, fromAngle } from "../../math/vector";
import type { World } from "../../world";

export enum IAntState {
  ReturningHome,
  SearchingForFood,
  ReturningHomeUsingPedometer,
}

type IAntennas = {
  leftAntenna: Vector;
  frontAntenna: Vector;
  rightAntenna: Vector;
};

export class Ant {
  public position: Vector;
  public velocity: Vector;

  private world: World;
  private desiredVelocity: Vector;
  private angle: number;
  private state: IAntState;
  private colony: Colony;
  private targetFoodItem: FoodItem | null;
  private lastDepositedPheromone?: Pheromone;
  private steps: number;

  constructor(colony: Colony, world: World) {
    this.world = world;
    this.colony = colony;

    this.position = new Vector(this.colony.position.x, this.colony.position.y);
    this.setSpawnOrientation();
    this.searchingForFood();
  }

  private setSpawnOrientation() {
    this.steps = 0;
    this.angle = randomFloat(0, Math.PI * 2);
    this.velocity = fromAngle(this.angle);
    this.desiredVelocity = this.velocity.copy();
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
    return this.position.add(this.velocity.mult(AcoConfig.antPerceptionRange));
  }

  private handleObstacles(): void {
    let obstacleInRange: boolean;
    do {
      const perception = this.position.add(
        this.desiredVelocity.mult(AcoConfig.antPerceptionRange * 2),
      );
      obstacleInRange = this.world.isObstacleInAntPerceptionRange(
        this.position,
        perception,
      );
      if (obstacleInRange) {
        // randomly set positive or negative angleRange
        // TODO: turn left/right based on the angle of collision
        this.desiredVelocity.rotate(
          Math.random() < 0.5
            ? AcoConfig.antObstacleAngleRange
            : -AcoConfig.antObstacleAngleRange,
          true,
        );
      }
    } while (obstacleInRange);
  }

  private handleWandering() {
    const angle = randomFloat(-1, 1);
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

  private handleSearchingForFood() {
    // force ant to use its pedometer to go back to the colony if max steps reached
    if (this.steps >= AcoConfig.antMaxSteps) {
      return this.returningHomeUsingPedometer();
    }

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
    return areCirclesIntersecting(
      this.position,
      AcoConfig.antPerceptionRange * 2,
      this.colony.position,
      AcoConfig.colonySize,
    );
  }

  private shouldPheromoneBeDeposited() {
    if (this.state === IAntState.ReturningHomeUsingPedometer) {
      return false;
    }
    if (!this.lastDepositedPheromone) {
      return true;
    }
    return (
      distance(this.position, this.lastDepositedPheromone.position) >
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

  private updatePosition() {
    const subtracted = this.desiredVelocity.sub(this.velocity);
    const desiredSteer = subtracted.mult(AcoConfig.antSteeringLimit);
    const acceleration = desiredSteer.limit(AcoConfig.antSteeringLimit);

    this.velocity.add(acceleration, true).limit(AcoConfig.antMaxSpeed);
    this.position.add(this.velocity.mult(AcoConfig.antMaxSpeed), true);
  }

  // private renderAnt() {
  //   this.p.push();
  //   this.p.strokeWeight(AcoConfig.antStrokeWeight);
  //   this.p.fill(AcoConfig.antColor);
  //   this.p.translate(this.position.x, this.position.y);
  //   this.p.rotate(this.velocity.heading());
  //   this.p.ellipse(0, 0, AcoConfig.antSize * 2, AcoConfig.antSize / 1.5);
  //   this.isReturningHome() && this.renderAntWithFoodItem();
  //   this.p.pop();
  // }

  // private renderAntWithFoodItem() {
  //   this.p.push();
  //   this.p.fill(AcoConfig.foodItemColor);
  //   this.p.strokeWeight(AcoConfig.foodItemStrokeWeight);
  //   this.p.circle(AcoConfig.antSize / 2, 0, AcoConfig.foodItemSize);
  //   this.p.pop();
  // }

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

  public returningHome() {
    this.state = IAntState.ReturningHome;
  }

  public searchingForFood() {
    this.state = IAntState.SearchingForFood;
  }

  public returningHomeUsingPedometer() {
    this.state = IAntState.ReturningHomeUsingPedometer;
  }

  public isSearchingForFood() {
    return this.state === IAntState.SearchingForFood;
  }

  public isReturningHome() {
    return this.state === IAntState.ReturningHome;
  }

  public isReturningHomeUsingPedometer() {
    return this.state === IAntState.ReturningHomeUsingPedometer;
  }

  public update() {
    // this.handleObstacles();
    // this.handlePheromoneDeposit();
    // this.isSearchingForFood() && this.handleSearchingForFood();
    // this.isReturningHome() && this.handleReturningHome();
    // this.isReturningHomeUsingPedometer() &&
    //   this.handleReturningHomeUsingPedometer();
    // this.handleWandering();
    // this.updatePosition();
    // this.steps += 1;
  }
}
