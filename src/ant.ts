import * as p5 from "p5";
import { FoodItem, IFoodItemState } from "./food-item";
import { World } from "./world";

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
  perceptionRange: number = 50;
  wanderAngle: number = 0;
  wanderStrength: number = 1;
  maxSpeed: number = 3;
  steeringLimit: number = 0.4;
  antSize: number = 4;
  showPerceptionRange: boolean = false;
  state: IAntState = IAntState.SearchingForFood;
  targetFoodItem: FoodItem | null;

  constructor(p: p5, world: World) {
    this.p = p;
    this.world = world;
    this.position = p.createVector(p.windowWidth / 2, p.windowHeight / 2);
    this.angle = p.random(this.p.TWO_PI);
    this.velocity = p5.Vector.fromAngle(this.angle);
    this.acceleration = p.createVector();
  }

  private approachTarget(target: p5.Vector) {
    // speed control (maxSpeed)
    const speedControl = target.copy().sub(this.position).setMag(this.maxSpeed);
    // steering control (steeringLimit)
    return speedControl.sub(this.velocity).limit(this.steeringLimit);
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
    circlePos.setMag(this.perceptionRange).add(this.position);
    const circleOffset = p5.Vector.fromAngle(
      this.wanderAngle + this.velocity.heading()
    );
    circleOffset.mult(this.wanderStrength);
    const target = circlePos.add(circleOffset);
    const wander = this.approachTarget(target);
    this.applyForce(wander);
  }

  private handleSearchingForFood() {
    // check if food item exists within perception range
    this.targetFoodItem = this.world.getFoodItemInPerceptionRange(
      this.position,
      this.perceptionRange
    );

    if (!this.targetFoodItem) {
      return;
    }

    // check if food picked up by ant
    if (
      this.p.abs(this.position.x - this.targetFoodItem.position.x) < 1 &&
      this.p.abs(this.position.y - this.targetFoodItem.position.y) < 1
    ) {
      this.targetFoodItem.state = IFoodItemState.PickedUp;
      this.state = IAntState.ReturningHome;
    }

    const approachFood = this.approachTarget(this.targetFoodItem.position);
    this.applyForce(approachFood);
  }

  private handleReturningHome() {
    this.targetFoodItem.position = this.position;
  }

  public update() {
    this.handleEdgeCollision();
    this.handleWandering();

    this.state === IAntState.SearchingForFood && this.handleSearchingForFood();
    this.state === IAntState.ReturningHome && this.handleReturningHome();

    // update values
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0);
  }

  public render() {
    // ant
    this.p.push();
    this.p.translate(this.position.x, this.position.y);
    this.angle = this.velocity.heading();
    this.p.rotate(this.angle);
    // this.p.triangle(
    //   -this.antSize,
    //   -this.antSize / 2,
    //   -this.antSize,
    //   this.antSize / 2,
    //   this.antSize,
    //   0
    // );
    this.p.ellipse(0, 0, this.antSize * 2, this.antSize / 1.5);
    // this.p.circle(this.antSize / 2, 0, this.antSize);
    // this.p.ellipse(-this.antSize / 2, 0, this.antSize * 2, this.antSize);
    this.p.pop();

    // perception range
    if (this.showPerceptionRange) {
      this.p.push();
      this.p.strokeWeight(1);
      this.p.fill(255);
      this.p.circle(this.position.x, this.position.y, this.perceptionRange * 2);
      this.p.pop();
    }
  }

  // perceptionRange() {
  //   this.p.beginShape();
  //   this.p.vertex(this.position.x, this.position.y);
  //   for (let angle = -1 / 2; angle <= 1 / 2; angle += this.p.PI / 16) {
  //     let x = this.p.cos(angle) * this.perceptionRange + this.position.x;
  //     let y = this.p.sin(angle) * this.perceptionRange + this.position.y;
  //     this.p.vertex(x, y);
  //   }
  //   this.p.endShape(this.p.CLOSE);
  // }
}
