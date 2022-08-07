'use strict'
import Debug from 'debug'

import { Coordinate } from '@aoc-2021/utils'

const log = {
  info: Debug('hydrothermal:info'),
  debug: Debug('hydrothermal:debug')
}

class HydrothermalVenture {
  private _maxWidth: number
  private _maxDepth: number
  private _inputs: string[]
  private _board: number[][]
  get maxWidth() {
    return this._maxWidth
  }
  get maxDepth() {
    return this._maxDepth
  }
  get inputs() {
    return this._inputs
  }
  get board() {
    return this._board
  }

  constructor(input: string[]) {
    this._inputs = [...input]
    this._maxWidth = 0
    this._maxDepth = 0

    // Find the _maxWidth and _maxDepth
    input.forEach((line) => {
      this.inputToCoords(line).forEach((point) => {
        if (point.y >= this._maxDepth) this._maxDepth = point.y + 1
        if (point.x >= this._maxWidth) this._maxWidth = point.x + 1
      })
    })

    // Initialize with an empty board
    this._board = Array(this._maxDepth)
      .fill(0)
      .map(() => Array(this._maxWidth).fill(0))

    // Filter non-horizontal line
    this._board = this._inputs
      .filter((input) => this.isHorizontalOrVertical(...this.inputToCoords(input)))
      .reduce((board, input) => {
        const [pt1, pt2] = this.inputToCoords(input)
        log.debug(`pt1: ${pt1.toString()}, pt2: ${pt2.toString()}`)
        if (pt1.x === pt2.x) {
          const [from, to] = pt1.y < pt2.y ? [pt1.y, pt2.y] : [pt2.y, pt1.y]
          for (let i = from; i <= to; i++) {
            ;(board[i] as number[])[pt1.x] += 1
          }
        } else {
          // pt1.y === pt2.y
          const [from, to] = pt1.x < pt2.x ? [pt1.x, pt2.x] : [pt2.x, pt1.x]
          for (let i = from; i <= to; i++) {
            ;(board[pt1.y] as number[])[i] += 1
          }
        }
        return board
      }, this._board)
  }

  private inputToCoords(input: string): [Coordinate, Coordinate] {
    const [y1, x1, y2, x2] = input.split(/->|,/).map((v) => Number(v.trim())) as [
      number,
      number,
      number,
      number
    ]

    return [new Coordinate(y1, x1), new Coordinate(y2, x2)]
  }

  private isHorizontalOrVertical(pt1: Coordinate, pt2: Coordinate): boolean {
    return pt1.y === pt2.y || pt1.x === pt2.x
  }

  public countOverlap(): number {
    return this._board
      .map((row) => row.filter((el) => el > 1).length)
      .reduce((memo, val) => memo + val, 0)
  }
}

export { HydrothermalVenture as default, HydrothermalVenture }
