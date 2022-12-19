class Coordinate {
  y: number
  x: number

  constructor(y: number, x: number) {
    this.y = y
    this.x = x
  }

  public toString(): string {
    return `(${this.y}, ${this.x})`
  }
}

class CoordinateRC {
  row: number
  col: number

  constructor(row: number, col: number) {
    this.row = row
    this.col = col
  }

  public toString(): string {
    return `(${this.row}, ${this.col})`
  }
}

export { Coordinate as default, CoordinateRC }
