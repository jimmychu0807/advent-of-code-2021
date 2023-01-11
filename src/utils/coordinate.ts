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

export { Coordinate as default, CoordinateRC, Rect, Direction };
