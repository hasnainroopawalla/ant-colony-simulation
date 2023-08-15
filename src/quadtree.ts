import { p5i } from "./sketch";
import { circleCollision } from "./utils";

type Point = { x: number; y: number };

export class Circle {
  x: number;
  y: number;
  r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  contains(point: Point) {
    return circleCollision(
      p5i.createVector(point.x, point.y),
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

  public contains(point: Point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  public intersectsRect(range: Rectangle): boolean {
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
  points: Point[];
  divided: boolean;
  topLeft?: Quadtree;
  bottomLeft?: Quadtree;
  bottomRight?: Quadtree;
  topRight?: Quadtree;

  constructor(boundary: Rectangle) {
    this.capacity = 4;
    this.boundary = boundary;
    this.divided = false;
    this.points = [];
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
    p5i.push();
    p5i.stroke(100);
    p5i.rectMode(p5i.CENTER);
    p5i.rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.w * 2,
      this.boundary.h * 2
    );
    if (this.divided) {
      this.topLeft.render();
      this.bottomLeft.render();
      this.bottomRight.render();
      this.topRight.render();
    }
    this.points.map((point) => {
      p5i.strokeWeight(3);
      p5i.stroke("blue");
      p5i.point(point.x, point.y);
      p5i.strokeWeight(1);
    });
    p5i.pop();
  }

  public query(range: Circle, found?: Point[]) {
    if (!found) {
      found = [];
    }

    if (!this.boundary.intersects(range)) {
      return;
    }

    this.points.map((point) => {
      if (range.contains(point)) {
        found.push(point);
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

  public insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
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
