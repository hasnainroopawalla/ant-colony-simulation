import p5 from "p5";
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
  lastDepositedPheromone?: Pheromone;

  constructor(p: p5, colony: Colony, world: World) {
    this.p = p;
    this.world = world;
    this.colony = colony;
    this.position = this.p.createVector(
      this.colony.position.x,
      this.colony.position.y
    );
    this.wanderAngle = 0;
    this.angle = this.p.random(this.p.TWO_PI);
    this.velocity = p5.Vector.fromAngle(this.angle);
    this.acceleration = this.p.createVector();
    this.searchingForFood();
  }

  private approachTarget(target: p5.Vector) {
    // speed control
    const speedControl = target
      .copy()
      .sub(this.position)
      .setMag(config.antMaxSpeed);
    // steering control
    return speedControl.sub(this.velocity).limit(config.antSteeringLimit);
  }

  private applyForce(force: p5.Vector) {
    this.acceleration.add(force);
  }

  // TODO: specify return type
  private getAntennas() {
    const leftAntenna = p5.Vector.add(
      this.position,
      p5.Vector.mult(p5.Vector.rotate(this.velocity, 150), 8)
    );

    const forwardAntenna = p5.Vector.add(
      this.position,
      p5.Vector.mult(this.velocity, 10)
    );

    const rightAntenna = p5.Vector.add(
      this.position,
      p5.Vector.mult(p5.Vector.rotate(this.velocity, -150), 8)
    );

    // this.p.circle(leftAntenna.x, leftAntenna.y, 15);
    // this.p.circle(forwardAntenna.x, forwardAntenna.y, 15);
    // this.p.circle(rightAntenna.x, rightAntenna.y, 15);

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
    this.wanderAngle += this.p.random(-0.5, 0.5);
    const circlePos = this.velocity.copy();
    circlePos.setMag(config.antPerceptionRange).add(this.position);
    const circleOffset = p5.Vector.fromAngle(
      this.wanderAngle + this.velocity.heading()
    );
    circleOffset.mult(config.antWanderStrength);
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

    if (this.targetFoodItem) {
      // check if reserved food item is picked up
      if (this.targetFoodItem.collide(this.position)) {
        // rotate 180 degrees
        this.velocity.rotate(this.p.PI);
        this.targetFoodItem.pickedUp();
        this.returningHome();
      }
      const approachFood = this.approachTarget(this.targetFoodItem.position);
      this.applyForce(approachFood);
    } else {
      // follow food pheromones if no food item is found within perception range
      const antennas = this.getAntennas();
      const [leftAntenna, frontAntenna, rightAntenna] =
        this.world.antennaPheromoneValues(
          [
            antennas.leftAntenna,
            antennas.forwardAntenna,
            antennas.rightAntenna,
          ],
          IPheromoneType.Food
        );

      if (frontAntenna > leftAntenna && frontAntenna > rightAntenna) {
        // do nothing
      } else if (leftAntenna > rightAntenna) {
        this.applyForce(this.approachTarget(antennas.leftAntenna));
      } else if (rightAntenna > leftAntenna) {
        this.applyForce(this.approachTarget(antennas.rightAntenna));
      }
    }
  }

  private handleReturningHome() {
    if (
      this.world.colonyInPerceptionRange(this.position, this.colony.position)
    ) {
      const approachColony = this.approachTarget(this.colony.position);
      this.applyForce(approachColony);

      // check if food item is delivered to colony
      if (this.colony.collide(this.position)) {
        // rotate 180 degrees
        this.velocity.rotate(this.p.PI);
        this.targetFoodItem.delivered();
        this.targetFoodItem = null;
        this.colony.incrementFoodCount();
        this.searchingForFood();
        return;
      }
    } else {
      const antennas = this.getAntennas();
      const [leftAntenna, frontAntenna, rightAntenna] =
        this.world.antennaPheromoneValues(
          [
            antennas.leftAntenna,
            antennas.forwardAntenna,
            antennas.rightAntenna,
          ],
          IPheromoneType.Home
        );

      if (frontAntenna > leftAntenna && frontAntenna > rightAntenna) {
        // do nothing
      } else if (leftAntenna > rightAntenna) {
        this.applyForce(this.approachTarget(antennas.leftAntenna));
      } else if (rightAntenna > leftAntenna) {
        this.applyForce(this.approachTarget(antennas.rightAntenna));
      }
    }
  }

  private shouldPheromoneBeDeposited() {
    if (!this.lastDepositedPheromone) {
      return true;
    }
    return (
      distance(this.position, this.lastDepositedPheromone.position, true) >
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
      // TODO: remove IPheromone dependency
      this.isSearchingForFood() ? IPheromoneType.Home : IPheromoneType.Food
    );
    this.world.depositPheromone(this.lastDepositedPheromone);
  }

  public searchingForFood() {
    this.state = IAntState.SearchingForFood;
  }

  private updatePosition() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(config.antMaxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0);
  }

  // TODO: Create a wrapper for render methods to handle push/pop logic
  private renderAnt() {
    this.p.push();
    this.p.strokeWeight(config.antStrokeWeight);
    this.p.fill(config.antColor);
    this.p.translate(this.position.x, this.position.y);
    this.angle = this.velocity.heading();
    this.p.rotate(this.angle);
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
