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

export { Coordinate as default }
