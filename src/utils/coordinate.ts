const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

class Coordinate {
  y: number;
  x: number;

  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }

  public toString(): string {
    return `(${this.y}, ${this.x})`;
  }
}

class CoordinateXYZ {
  x: number;
  y: number;
  z: number;
  constructor(x: string | number, y: string | number, z: string | number) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }

  public static fromString(input: string): CoordinateXYZ {
    const xyz = input.split(",").map((v) => Number(v.trim()));
    if (xyz.length !== 3)
      throw new Error(`Unexpected input for creating a CoordinateXYZ: ${input}`);
    return new CoordinateXYZ(xyz[0]!, xyz[1]!, xyz[2]!);
  }

  public toString(): string {
    return `(${this.x}, ${this.y}), ${this.z}`;
  }

  public eql(pt: CoordinateXYZ): boolean {
    return this.x === pt.x && this.y === pt.y && this.z === pt.z;
  }

  public distTo(pt: CoordinateXYZ): number {
    return Math.sqrt(
      Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2) + Math.pow(this.z - pt.z, 2),
    );
  }

  public add(pt: CoordinateXYZ): CoordinateXYZ {
    return new CoordinateXYZ(this.x + pt.x, this.y + pt.y, this.z + pt.z);
  }

  public minus(pt: CoordinateXYZ): CoordinateXYZ {
    return new CoordinateXYZ(this.x - pt.x, this.y - pt.y, this.z - pt.z);
  }
}

class CoordinateRC {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  public toString(): string {
    return `(${this.row}, ${this.col})`;
  }
}

class Rect {
  topLeft: CoordinateRC;
  bottomRight: CoordinateRC;

  constructor(topLeft: CoordinateRC, bottomRight: CoordinateRC) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  public toString(): string {
    return `topLeft: ${this.topLeft}, bottomRight: ${this.bottomRight}`;
  }
}

export { Coordinate as default, CoordinateRC, Rect, Direction, CoordinateXYZ };
