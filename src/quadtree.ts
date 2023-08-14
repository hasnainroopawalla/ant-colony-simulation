import { p5i } from "./sketch";

type Point = { x: number; y: number };

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

  public containsPoint(point: Point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  //   public intersects(range) {}
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
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      p5i.strokeWeight(7);
      p5i.stroke("blue");
      p5i.point(point.x, point.y);
    }
    p5i.pop();
  }

  //   public query(range) {}

  public insert(point: Point): boolean {
    if (!this.boundary.containsPoint(point)) {
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
