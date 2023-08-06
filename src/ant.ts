import * as p5 from "p5";
import { FoodItem, IFoodItemState } from "./food-item";
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
  state: IAntState = IAntState.SearchingForFood;
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
  }

  private approachTarget(target: p5.Vector) {
    // speed control (maxSpeed)
    const speedControl = target
      .copy()
      .sub(this.position)
      .setMag(config.ant.maxSpeed);
    // steering control (steeringLimit)
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
    circlePos.setMag(config.ant.perceptionRange).add(this.position);
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
    this.targetFoodItem = this.world.getFoodItemInPerceptionRange(
      this.position,
      config.ant.perceptionRange
    );

    if (!this.targetFoodItem) {
      return;
    }

    // check if the food item is picked up
    if (this.targetFoodItem.collide(this.position)) {
      this.targetFoodItem.state = IFoodItemState.PickedUp;
      this.state = IAntState.ReturningHome;
    }

    const approachFood = this.approachTarget(this.targetFoodItem.position);
    this.applyForce(approachFood);
  }

  private handleReturningHome() {
    // TODO: improve rendering of ant with food particle
    this.targetFoodItem.position.set(this.position);

    // check if the food item is delivered to the colony
    if (this.colony.collide(this.position)) {
      this.targetFoodItem.state = IFoodItemState.Delivered;
      this.targetFoodItem = null;
      this.state = IAntState.SearchingForFood;
    }

    const approachColony = this.approachTarget(this.colony.position);
    this.applyForce(approachColony);
  }

  public update() {
    this.handleEdgeCollision();
    this.handleWandering();

    this.state === IAntState.SearchingForFood && this.handleSearchingForFood();
    this.state === IAntState.ReturningHome && this.handleReturningHome();

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
    if (config.ant.showPerceptionRange) {
      this.p.push();
      // TODO: add to config
      this.p.strokeWeight(1);
      // TODO: add to config
      this.p.fill(255, 30);
      this.p.circle(
        this.position.x,
        this.position.y,
        config.ant.perceptionRange * 2
      );
      this.p.pop();
    }
  }

  // perceptionRange() {
  //   this.p.beginShape();
  //   this.p.vertex(this.position.x, this.position.y);
  //   for (let angle = -1 / 2; angle <= 1 / 2; angle += this.p.PI / 16) {
  //     let x = this.p.cos(angle) * config.ant.perceptionRange + this.position.x;
  //     let y = this.p.sin(angle) * config.ant.perceptionRange + this.position.y;
  //     this.p.vertex(x, y);
  //   }
  //   this.p.endShape(this.p.CLOSE);
  // }
}
