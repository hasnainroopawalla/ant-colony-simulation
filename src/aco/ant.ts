import { FoodItem } from "./food-item";
import { World } from "./world";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { areCirclesOverlapping, distance, randomFloat } from "./utils";
import { Vector, fromAngle } from "./vector";

export enum IAntState {
  ReturningHome,
  SearchingForFood,
}

export class Ant {
  p: p5;
  world: World;
  position: Vector;
  velocity: Vector;
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
    this.acceleration = new Vector();
    this.searchingForFood();
  }

  private approachTarget(target: Vector) {
    const speedControl = target
      .sub(this.position)
      .setMagnitude(config.antMaxSpeed);
    return speedControl.sub(this.velocity).limit(config.antSteeringLimit);
  }

  private applyForce(force: Vector) {
    this.acceleration.add(force, true);
  }

  private getAntennas(): {
    leftAntenna: Vector;
    forwardAntenna: Vector;
    rightAntenna: Vector;
  } {
    const leftAntenna = this.position.add(this.velocity.rotate(150).mult(20));
    const forwardAntenna = this.position.add(this.velocity.mult(20));
    const rightAntenna = this.position.add(this.velocity.rotate(-150).mult(20));

    config.showAntAntenna &&
      this.p.circle(leftAntenna.x, leftAntenna.y, config.antAntennaRadius) &&
      this.p.circle(
        forwardAntenna.x,
        forwardAntenna.y,
        config.antAntennaRadius
      ) &&
      this.p.circle(rightAntenna.x, rightAntenna.y, config.antAntennaRadius);

    return { leftAntenna, forwardAntenna, rightAntenna };
  }

  private handleEdgeCollision() {
    // left / right
    if (this.position.x > this.p.windowWidth - 10 || this.position.x < 10) {
      this.velocity.x *= -1;
    }
    // top / bottom
    if (this.position.y > this.p.windowHeight - 10 || this.position.y < 10) {
      this.velocity.y *= -1;
    }
    // TODO: ants should not be rendered over colonies
  }

  private handleWandering() {
    this.wanderAngle += randomFloat(-0.5, 0.5);
    const circlePos = this.velocity
      .setMagnitude(config.antPerceptionRange)
      .add(this.position);
    const circleOffset = fromAngle(
      this.wanderAngle + this.velocity.heading()
    ).mult(config.antWanderStrength);
    const target = circlePos.add(circleOffset);
    const wander = this.approachTarget(target);
    this.applyForce(wander);
  }

  private handleAntennaSteering(pheromoneType: IPheromoneType) {
    const antennas = this.getAntennas();
    const [leftAntenna, frontAntenna, rightAntenna] =
      this.world.antennaPheromoneValues(
        [antennas.leftAntenna, antennas.forwardAntenna, antennas.rightAntenna],
        pheromoneType
      );

    if (frontAntenna > leftAntenna && frontAntenna > rightAntenna) {
      // do nothing
    } else if (leftAntenna > rightAntenna) {
      this.applyForce(this.approachTarget(antennas.leftAntenna));
    } else if (rightAntenna > leftAntenna) {
      this.applyForce(this.approachTarget(antennas.rightAntenna));
    }
  }

  private handleSearchingForFood() {
    // check if food item exists within perception range
    if (!this.targetFoodItem) {
      this.targetFoodItem = this.world.getFoodItemInPerceptionRange(
        this.position
      );
    }

    if (this.targetFoodItem) {
      // check if reserved food item is picked up
      if (this.targetFoodItem.collide(this.position)) {
        // rotate 180 degrees
        this.velocity.rotate(this.p.PI, true);
        this.targetFoodItem.pickedUp();
        this.returningHome();
      }
      const approachFood = this.approachTarget(this.targetFoodItem.position);
      this.applyForce(approachFood);
    } else {
      // follow food pheromones if no food item is found within perception range
      this.handleAntennaSteering(IPheromoneType.Food);
    }
  }

  private handleReturningHome() {
    if (this.colonyInPerceptionRange()) {
      const approachColony = this.approachTarget(this.colony.position);
      this.applyForce(approachColony);

      // check if food item is delivered to colony
      if (this.colony.collide(this.position)) {
        // rotate 180 degrees
        this.velocity.rotate(this.p.PI, true);
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
    return areCirclesOverlapping(
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
    this.velocity.add(this.acceleration, true);
    this.position.add(this.velocity, true);
    this.acceleration.set(0);
  }

  // TODO: Create a wrapper for render methods to handle push/pop logic
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
    this.p.circle(
      this.position.x,
      this.position.y,
      config.antPerceptionRange * 2
    );
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
    this.handleEdgeCollision();
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
