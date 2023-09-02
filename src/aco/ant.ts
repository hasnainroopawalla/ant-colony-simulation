import { FoodItem } from "./food-item";
import { World } from "./world";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { areCirclesIntersecting, distance, randomFloat } from "./utils";
import { Vector, fromAngle } from "./vector";

export enum IAntState {
  ReturningHome,
  SearchingForFood,
}

type IAntennas = {
  leftAntenna: Vector;
  frontAntenna: Vector;
  rightAntenna: Vector;
};

export class Ant {
  p: p5;
  world: World;
  position: Vector;
  velocity: Vector;
  desiredVelocity: Vector;
  acceleration: Vector;
  angle: number;
  wanderAngle: number;
  state: IAntState;
  colony: Colony;
  targetFoodItem: FoodItem | null;
  lastDepositedPheromone?: Pheromone;

  constructor(p: p5, colony: Colony, world: World) {
    this.p = p;
    this.world = world;
    this.colony = colony;
    this.position = new Vector(this.colony.position.x, this.colony.position.y);
    this.wanderAngle = 0;
    this.angle = randomFloat(0, this.p.TWO_PI);
    this.velocity = fromAngle(this.angle);
    this.desiredVelocity = this.velocity.copy();
    this.acceleration = new Vector();
    this.searchingForFood();
  }

  private approachTarget(target: Vector): void {
    this.desiredVelocity = target.sub(this.position).normalize();
  }

  private getAntennas(): IAntennas {
    const leftAntenna = this.position.add(
      this.desiredVelocity
        .rotate(-config.antAntennaRotation)
        .mult(config.antAntennaRange)
    );
    const frontAntenna = this.position.add(
      this.desiredVelocity.mult(config.antAntennaRange)
    );
    const rightAntenna = this.position.add(
      this.desiredVelocity
        .rotate(config.antAntennaRotation)
        .mult(config.antAntennaRange)
    );

    config.showAntAntennas &&
      this.p.circle(leftAntenna.x, leftAntenna.y, config.antAntennaRadius) &&
      this.p.circle(frontAntenna.x, frontAntenna.y, config.antAntennaRadius) &&
      this.p.circle(rightAntenna.x, rightAntenna.y, config.antAntennaRadius);

    return { leftAntenna, frontAntenna, rightAntenna };
  }

  private getPerception(): Vector {
    return this.position.add(this.velocity.mult(config.antPerceptionRange));
  }

  private handleObstacles(): void {
    let obstacleInRange: boolean;
    do {
      const perception = this.position.add(
        this.desiredVelocity.mult(config.antPerceptionRange * 2)
      );
      obstacleInRange = this.world.isObstacleInAntPerceptionRange(
        this.position,
        perception
      );
      if (obstacleInRange) {
        // randomly set positive or negative angleRange
        // TODO: turn left/right based on the angle of collision
        this.desiredVelocity.rotate(
          Math.random() < 0.5
            ? config.antObstacleAngleRange
            : -config.antObstacleAngleRange,
          true
        );
      }
    } while (obstacleInRange);
  }

  private handleWandering() {
    const angle = randomFloat(-1, 1);
    this.desiredVelocity.rotate(angle * config.antWanderStrength, true);
  }

  private handleAntennaSteering(pheromoneType: IPheromoneType) {
    const antennas = this.getAntennas();
    const [leftAntenna, frontAntenna, rightAntenna] =
      this.world.computeAntAntennasPheromoneValues(
        [antennas.leftAntenna, antennas.frontAntenna, antennas.rightAntenna],
        config.antAntennaRadius,
        pheromoneType
      );

    if (frontAntenna > leftAntenna && frontAntenna > rightAntenna) {
      // do nothing
    } else if (leftAntenna > rightAntenna) {
      this.desiredVelocity.rotate(-2.35 / 2, true);
    } else if (rightAntenna > leftAntenna) {
      this.desiredVelocity.rotate(2.35 / 2, true);
    }
  }

  private handleSearchingForFood() {
    // check if food item exists within perception range
    if (!this.targetFoodItem) {
      this.targetFoodItem = this.world.getFoodItemInAntPerceptionRange(
        this.getPerception(),
        config.antPerceptionRange
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
      // this.applyForce(approachColony);

      // check if food item is delivered to colony
      if (this.colony.collide(this.position)) {
        // rotate 180 degrees
        this.velocity.rotate(Math.PI, true);
        this.targetFoodItem.delivered();
        this.targetFoodItem = null;
        this.colony.incrementFoodCount();
        this.searchingForFood();
        return;
      }
    } else {
      // follow home pheromones to deliver food
      this.handleAntennaSteering(IPheromoneType.Home);
    }
  }

  private colonyInPerceptionRange(): boolean {
    return areCirclesIntersecting(
      this.position,
      config.antPerceptionRange * 2,
      this.colony.position,
      config.colonySize
    );
  }

  private shouldPheromoneBeDeposited() {
    if (!this.lastDepositedPheromone) {
      return true;
    }
    return (
      distance(this.position, this.lastDepositedPheromone.position) >
      config.pheromoneDistanceBetween
    );
  }

  private handlePheromoneDeposit() {
    if (!this.shouldPheromoneBeDeposited()) {
      return;
    }
    this.lastDepositedPheromone = new Pheromone(
      this.p,
      this.position.copy(),
      this.isSearchingForFood() ? IPheromoneType.Home : IPheromoneType.Food
    );
    this.world.depositPheromone(this.lastDepositedPheromone);
  }

  private updatePosition() {
    const subtracted = this.desiredVelocity.sub(this.velocity);
    const desiredSteer = subtracted.mult(config.antSteeringLimit);
    const acceleration = desiredSteer.limit(config.antSteeringLimit);

    this.velocity.add(acceleration, true).limit(config.antMaxSpeed);
    this.position.add(this.velocity.mult(config.antMaxSpeed), true);
  }

  private renderAnt() {
    this.p.push();
    this.p.strokeWeight(config.antStrokeWeight);
    this.p.fill(config.antColor);
    this.p.translate(this.position.x, this.position.y);
    this.p.rotate(this.velocity.heading());
    this.p.ellipse(0, 0, config.antSize * 2, config.antSize / 1.5);
    this.isReturningHome() && this.renderAntWithFoodItem();
    this.p.pop();
  }

  private renderAntWithFoodItem() {
    this.p.push();
    this.p.fill(config.foodItemColor);
    this.p.strokeWeight(config.foodItemStrokeWeight);
    this.p.circle(config.antSize / 2, 0, config.foodItemSize);
    this.p.pop();
  }

  private renderPerceptionRange() {
    this.p.push();
    this.p.strokeWeight(config.antPerceptionStrokeWeight);
    this.p.fill(config.antPerceptionColorGray, config.antPerceptionColorAlpha);
    const perception = this.getPerception();
    this.p.circle(perception.x, perception.y, config.antPerceptionRange * 2);
    this.p.pop();
  }

  public returningHome() {
    this.state = IAntState.ReturningHome;
  }

  public searchingForFood() {
    this.state = IAntState.SearchingForFood;
  }

  public isSearchingForFood() {
    return this.state === IAntState.SearchingForFood;
  }

  public isReturningHome() {
    return this.state === IAntState.ReturningHome;
  }

  public update() {
    this.handleObstacles();
    this.handlePheromoneDeposit();

    this.isSearchingForFood() && this.handleSearchingForFood();
    this.isReturningHome() && this.handleReturningHome();
    this.handleWandering();

    this.updatePosition();
  }

  public render() {
    this.renderAnt();
    config.showAntPerceptionRange && this.renderPerceptionRange();
  }
}
