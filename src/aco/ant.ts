import * as p5m from "p5";
import { p5i } from "../sketch";
import { FoodItem } from "./food-item";
import { World } from "./world";
import { Colony } from "./colony";
import { config } from "./config";
import { IPheromoneType, Pheromone } from "./pheromone";
import { distance } from "./utils";

export enum IAntState {
  ReturningHome,
  SearchingForFood,
}

export class Ant {
  world: World;
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  angle: number;
  wanderAngle: number;
  state: IAntState;
  colony: Colony;
  targetFoodItem: FoodItem | null;
  lastDepositedPheromone?: Pheromone;

  constructor(colony: Colony, world: World) {
    this.world = world;
    this.colony = colony;
    this.position = p5i.createVector(
      this.colony.position.x,
      this.colony.position.y
    );
    this.wanderAngle = 0;
    this.angle = p5i.random(p5i.TWO_PI);
    this.velocity = p5m.Vector.fromAngle(this.angle);
    this.acceleration = p5i.createVector();
    this.searchingForFood();
  }

  private approachTarget(target: p5.Vector) {
    // speed control
    const speedControl = target
      .copy()
      .sub(this.position)
      .setMag(config.ant.maxSpeed);
    // steering control
    return speedControl.sub(this.velocity).limit(config.ant.steeringLimit);
  }

  private applyForce(force: p5.Vector) {
    this.acceleration.add(force);
  }

  private handleEdgeCollision() {
    // left / right
    if (this.position.x > p5i.windowWidth - 10 || this.position.x < 10) {
      this.velocity.x *= -1;
    }
    // top / bottom
    if (this.position.y > p5i.windowHeight - 10 || this.position.y < 10) {
      this.velocity.y *= -1;
    }
    // TODO: ants should not be rendered over colonies
  }

  private handleWandering() {
    this.wanderAngle += p5i.random(-0.5, 0.5);
    const circlePos = this.velocity.copy();
    circlePos.setMag(config.ant.perception.range).add(this.position);
    const circleOffset = p5m.Vector.fromAngle(
      this.wanderAngle + this.velocity.heading()
    );
    circleOffset.mult(config.ant.wanderStrength);
    const target = circlePos.add(circleOffset);
    const wander = this.approachTarget(target);
    this.applyForce(wander);
  }

  private handleSearchingForFood() {
    // check if food item exists within perception range
    if (!this.targetFoodItem) {
      this.targetFoodItem = this.world.getFoodItemInPerceptionRange(
        this.position
      );
    }

    // noop if no food item is found within perception range
    if (!this.targetFoodItem) {
      return;
    }

    // check if reserved food item is picked up
    if (this.targetFoodItem.collide(this.position)) {
      this.targetFoodItem.pickedUp();
      this.returningHome();
    }

    const approachFood = this.approachTarget(this.targetFoodItem.position);
    this.applyForce(approachFood);
  }

  private handleReturningHome() {
    // check if food item is delivered to colony
    if (this.colony.collide(this.position)) {
      this.targetFoodItem.delivered();
      this.targetFoodItem = null;
      this.colony.incrementFoodCount();
      this.searchingForFood();
    }

    const approachColony = this.approachTarget(this.colony.position);
    this.applyForce(approachColony);
  }

  private shouldPheromoneBeDeposited() {
    if (!this.lastDepositedPheromone) {
      return true;
    }
    return (
      distance(this.position, this.lastDepositedPheromone.position, true) >
      config.pheromone.distanceBetween
    );
  }

  private handlePheromoneDeposit() {
    if (!this.shouldPheromoneBeDeposited()) {
      return;
    }
    this.lastDepositedPheromone = new Pheromone(
      this.position.copy(),
      // TODO: remove IPheromone dependency
      this.isSearchingForFood() ? IPheromoneType.Wander : IPheromoneType.Food
    );
    this.world.depositPheromone(this.lastDepositedPheromone);
  }

  public searchingForFood() {
    this.state = IAntState.SearchingForFood;
  }

  public returningHome() {
    this.state = IAntState.ReturningHome;
  }

  public isSearchingForFood() {
    return this.state === IAntState.SearchingForFood;
  }

  public isReturningHome() {
    return this.state === IAntState.ReturningHome;
  }

  private updatePosition() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(config.ant.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0);
  }

  public update() {
    this.handleEdgeCollision();
    this.handleWandering();
    this.handlePheromoneDeposit();

    this.isSearchingForFood() && this.handleSearchingForFood();
    this.isReturningHome() && this.handleReturningHome();

    this.updatePosition();
  }

  // TODO: Create a wrapper for render methods to handle push/pop logic
  private renderAnt() {
    p5i.push();
    p5i.strokeWeight(config.ant.strokeWeight);
    p5i.fill(config.ant.color);
    p5i.translate(this.position.x, this.position.y);
    this.angle = this.velocity.heading();
    p5i.rotate(this.angle);
    p5i.ellipse(0, 0, config.ant.size * 2, config.ant.size / 1.5);
    this.isReturningHome() && this.renderAntWithFoodItem();
    p5i.pop();
  }

  private renderAntWithFoodItem() {
    p5i.push();
    p5i.fill(config.foodItem.color);
    p5i.strokeWeight(config.foodItem.strokeWeight);
    p5i.circle(config.ant.size / 2, 0, config.foodItem.size);
    p5i.pop();
  }

  private renderPerceptionRange() {
    p5i.push();
    p5i.strokeWeight(config.ant.perception.strokeWeight);
    p5i.fill(config.ant.perception.gray, config.ant.perception.alpha);
    p5i.circle(
      this.position.x,
      this.position.y,
      config.ant.perception.range * 2
    );
    p5i.pop();
  }

  public render() {
    this.renderAnt();
    config.ant.perception.show && this.renderPerceptionRange();
  }
}
