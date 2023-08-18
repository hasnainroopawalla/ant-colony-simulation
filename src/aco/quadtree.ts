import { config } from "./config";
import { FoodItem } from "./food-item";
import { p5i } from "../sketch";
import { circleCollision } from "./utils";

export class Circle {
  x: number;
  y: number;
  r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  contains(point: FoodItem) {
    return circleCollision(
      p5i.createVector(point.position.x, point.position.y),
      p5i.createVector(this.x, this.y),
      this.r * 2
    );
  }
}

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public contains(point: FoodItem) {
    return (
      point.position.x >= this.x - this.w &&
      point.position.x <= this.x + this.w &&
      point.position.y >= this.y - this.h &&
      point.position.y <= this.y + this.h
    );
  }

  public intersectsRectangle(range: Rectangle): boolean {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }

  public intersects(range: Circle): boolean {
    return (
      range.x + range.r >= this.x - this.w &&
      range.x - range.r <= this.x + this.w &&
      range.y + range.r >= this.y - this.h &&
      range.y - range.r <= this.y + this.h
    );
  }
}

export class Quadtree {
  capacity: number;
  boundary: Rectangle;

  foodItems: FoodItem[];

  divided: boolean;
  topLeft?: Quadtree;
  bottomLeft?: Quadtree;
  bottomRight?: Quadtree;
  topRight?: Quadtree;

  constructor(boundary: Rectangle) {
    this.capacity = 4;
    this.boundary = boundary;
    this.divided = false;
    this.foodItems = [];
  }

  private subdivide() {
    this.topLeft = new Quadtree(
      new Rectangle(
        this.boundary.x - this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      )
    );
    this.bottomLeft = new Quadtree(
      new Rectangle(
        this.boundary.x - this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      )
    );
    this.bottomRight = new Quadtree(
      new Rectangle(
        this.boundary.x + this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      )
    );
    this.topRight = new Quadtree(
      new Rectangle(
        this.boundary.x + this.boundary.w / 2,
        this.boundary.y - this.boundary.h / 2,
        this.boundary.w / 2,
        this.boundary.h / 2
      )
    );
  }

  public render() {
    if (config.quadtree.show) {
      p5i.push();
      p5i.stroke(config.quadtree.base.color);
      p5i.strokeWeight(config.quadtree.base.strokeWeight);
      p5i.rectMode(p5i.CENTER);
      p5i.noFill();
      p5i.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w * 2,
        this.boundary.h * 2
      );
      p5i.pop();
    }
    if (this.divided) {
      this.topLeft.render();
      this.bottomLeft.render();
      this.bottomRight.render();
      this.topRight.render();
    }

    // TODO: Move to private render method
    for (let i = 0; i < this.foodItems.length; i++) {
      const foodItem = this.foodItems[i];
      if (foodItem.shouldBeDestroyed()) {
        this.foodItems.splice(i, 1);
      }
      foodItem.render();
    }
  }

  public query(range: Circle, found?: FoodItem[]) {
    if (!found) {
      found = [];
    }

    if (!this.boundary.intersects(range)) {
      return;
    }

    // TODO: Move to private render method
    // Highlight the quadtrees in the perception range of the ant
    if (config.quadtree.show) {
      p5i.push();
      p5i.stroke(config.quadtree.highlighted.color);
      p5i.strokeWeight(config.quadtree.highlighted.strokeWeight);
      p5i.rectMode(p5i.CENTER);
      p5i.noFill();
      p5i.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w * 2,
        this.boundary.h * 2
      );
      p5i.pop();
    }

    this.foodItems.map((foodItem) => {
      if (range.contains(foodItem)) {
        found.push(foodItem);
      }
    });

    if (this.divided) {
      this.topLeft.query(range, found);
      this.bottomLeft.query(range, found);
      this.bottomRight.query(range, found);
      this.topRight.query(range, found);
    }
    return found;
  }

  public insert(point: FoodItem): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.foodItems.length < this.capacity) {
      this.foodItems.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
      this.divided = true;
    }

    return (
      this.topLeft.insert(point) ||
      this.bottomLeft.insert(point) ||
      this.bottomRight.insert(point) ||
      this.topRight.insert(point)
    );
  }
}
