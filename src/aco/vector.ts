export class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  private assign(value: Vector): void {
    this.x = value.x;
    this.y = value.y;
  }

  public add(value: Vector, assign?: boolean): Vector {
    const result = new Vector(this.x + value.x, this.y + value.y);
    assign && this.assign(result);
    return result;
  }

  public sub(value: Vector, assign?: boolean): Vector {
    const result = new Vector(this.x - value.x, this.y - value.y);
    assign && this.assign(result);
    return result;
  }

  public mult(scalar: number, assign?: boolean): Vector {
    const result = new Vector(this.x * scalar, this.y * scalar);
    assign && this.assign(result);
    return result;
  }

  public rotate(angle: number, assign?: boolean): Vector {
    const result = new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
    assign && this.assign(result);
    return result;
  }

  public direction(): number {
    return Math.atan2(this.y, this.x);
  }

  public setMagnitude(magnitude: number, assign?: boolean): Vector {
    const direction = this.direction();
    const result = new Vector(
      Math.cos(direction) * magnitude,
      Math.sin(direction) * magnitude
    );
    assign && this.assign(result);
    return result;
  }

  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public limit(max: number, assign?: boolean): Vector {
    const magnitude = this.getMagnitude();
    const result =
      magnitude > max ? this.setMagnitude(max) : new Vector(this.x, this.y);
    assign && this.assign(result);
    return result;
  }

  public heading(): number {
    return Math.atan2(this.y, this.x);
  }

  public normalize(assign?: boolean): Vector {
    const result = this.mult(1 / this.getMagnitude());
    assign && this.assign(result);
    return result;
  }

  public copy(): Vector {
    return new Vector(this.x, this.y);
  }

  public set(value: number) {
    this.x = value;
    this.y = value;
  }

  public translate() {}
}

export function fromAngle(angle: number) {
  return new Vector(Math.cos(angle), Math.sin(angle));
}
