// TODO: consider using p5.Vector instead of this custom Vector class
export class Vector {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public add(value: Vector): Vector {
    return new Vector(this.x + value.x, this.y + value.y);
  }

  public sub(value: Vector): Vector {
    return new Vector(this.x - value.x, this.y - value.y);
  }

  public mult(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public rotate(angle: number): Vector {
    return new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle),
    );
  }

  public direction(): number {
    return Math.atan2(this.y, this.x);
  }

  public setMagnitude(magnitude: number): Vector {
    const direction = this.direction();
    const result = new Vector(
      Math.cos(direction) * magnitude,
      Math.sin(direction) * magnitude,
    );

    return result;
  }

  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public limit(max: number): Vector {
    const magnitude = this.getMagnitude();
    const result =
      magnitude > max ? this.setMagnitude(max) : new Vector(this.x, this.y);

    return result;
  }

  public heading(): number {
    return Math.atan2(this.y, this.x);
  }

  public normalize(): Vector {
    return this.mult(1 / this.getMagnitude());
  }

  public set(value: number) {
    this.x = value;
    this.y = value;
  }
}
