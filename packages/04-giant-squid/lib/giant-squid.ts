'use strict'

import { readInput } from '@aoc-2021/utils'

class GiantSquid {
  private _numberStream: string
  private _boards: number[][][]

  constructor(inputFilePath: string) {
    const input = readInput(inputFilePath, { type: 'string' }) as string[]

    this._numberStream = input.shift() as string
    this._boards = []

    let bStarted = false
    let boardInd = 0

    input.forEach((line) => {
      if (line.length === 0) {
        if (bStarted) {
          boardInd += 1
        }
        bStarted = false
        return
      }

      bStarted = true
      const lineNumArr = line.split(' ').map((v) => Number(v))
      const board = this._boards[boardInd] as number[][]
      this._boards[boardInd] = [...board, lineNumArr]
    })
  }

  boards(): number[][][] {
    return this._boards
  }

  numberStream(): string {
    return this._numberStream
  }
}

export { GiantSquid as default, GiantSquid }
