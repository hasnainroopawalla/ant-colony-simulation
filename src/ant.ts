import * as p5 from "p5";
import { FoodItem } from "./food-item";
import { World } from "./world";
import { Colony } from "./colony";
import { config } from "./config";

export enum IAntState {
  ReturningHome,
  SearchingForFood,
}

export class Ant {
  p: p5;
  world: World;
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  angle: number;
  wanderAngle: number;
  state: IAntState;
  colony: Colony;
  targetFoodItem: FoodItem | null;

  constructor(p: p5, colony: Colony, world: World) {
    this.p = p;
    this.world = world;
    this.colony = colony;
    this.position = p.createVector(
      this.colony.position.x,
      this.colony.position.y
    );
    this.wanderAngle = 0;
    this.angle = p.random(this.p.TWO_PI);
    this.velocity = p5.Vector.fromAngle(this.angle);
    this.acceleration = p.createVector();
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
    if (this.position.x > this.p.windowWidth - 10 || this.position.x < 10) {
      this.velocity.x *= -1;
    }
    if (this.position.y > this.p.windowHeight - 10 || this.position.y < 10) {
      this.velocity.y *= -1;
    }
  }

  private handleWandering() {
    this.wanderAngle += this.p.random(-0.5, 0.5);
    const circlePos = this.velocity.copy();
    circlePos.setMag(config.ant.perception.range).add(this.position);
    const circleOffset = p5.Vector.fromAngle(
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
        this.position,
        config.ant.perception.range
      );
    }

    // noop if no food item is found within perception range
    if (!this.targetFoodItem) {
      return;
    }

    // check if the food item is picked up
    if (this.targetFoodItem.collide(this.position)) {
      this.targetFoodItem.pickedUp();
      this.returningHome();
    }

    const approachFood = this.approachTarget(this.targetFoodItem.position);
    this.applyForce(approachFood);
  }

  private handleReturningHome() {
    // TODO: improve rendering of ant with food particle
    this.targetFoodItem.position.set(this.position);

    // check if the food item is delivered to the colony
    if (this.colony.collide(this.position)) {
      this.targetFoodItem.delivered();
      this.targetFoodItem = null;
      this.searchingForFood();
    }

    const approachColony = this.approachTarget(this.colony.position);
    this.applyForce(approachColony);
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

  public update() {
    this.handleEdgeCollision();
    this.handleWandering();

    this.isSearchingForFood() && this.handleSearchingForFood();
    this.isReturningHome() && this.handleReturningHome();

    // update values
    this.velocity.add(this.acceleration);
    this.velocity.limit(config.ant.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0);
  }

  public render() {
    // ant
    this.p.push();
    this.p.strokeWeight(2);
    this.p.fill(config.ant.color);
    this.p.translate(this.position.x, this.position.y);
    this.angle = this.velocity.heading();
    this.p.rotate(this.angle);
    this.p.ellipse(0, 0, config.ant.size * 2, config.ant.size / 1.5);
    this.p.pop();

    // perception range
    if (config.ant.perception.show) {
      this.p.push();
      // TODO: add to config
      this.p.strokeWeight(config.ant.perception.strokeWeight);
      // TODO: add to config
      this.p.fill(config.ant.perception.gray, config.ant.perception.alpha);
      this.p.circle(
        this.position.x,
        this.position.y,
        config.ant.perception.range * 2
      );
      this.p.pop();
    }
  }
}
