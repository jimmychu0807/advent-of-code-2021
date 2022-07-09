'use strict'

import { readInput } from '@aoc-2021/utils'

class GiantSquid {
  private _inputStream: string
  private _boards: number[][][]

  constructor(rawInput: string[] | string) {
    const input = Array.isArray(rawInput)
      ? Object.assign([], rawInput)
      : (readInput(rawInput, { type: 'string' }) as string[])

    this._inputStream = input.shift() as string
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
      const lineNumArr = line.split(/\s+/).map((v) => Number(v))
      this._boards[boardInd] = this._boards[boardInd] || []
      this._boards[boardInd]?.push(lineNumArr)
    })
  }

  get boards(): number[][][] {
    return this._boards
  }

  get inputStream(): string {
    return this._inputStream
  }

  public findWinningBoard(inputStream: string = this._inputStream): number | undefined {
    const markedBoards: boolean[][][] = this.initMarkedBoards()
    const nums: number[] = inputStream.split(',').map((v) => Number(v.trim()))

    for (const num of nums) {
      this._boards.forEach((board, ind) => {
        const pos = this.boardPositionFromNumber(board, num)

        if (pos) {
          const row = (markedBoards[ind] as boolean[][])[pos[0]] as boolean[]
          row[pos[1]] = true
        }
      })

      console.log(`after ${num}:`, markedBoards)

      let boardAndInd = markedBoards.map((board, ind) => [board, ind] as [boolean[][], number])
      boardAndInd = boardAndInd.filter(([board]) => this.isBoardWinning(board))
      if (boardAndInd.length > 0) return (boardAndInd[0] as [boolean[][], number])[1]
    }

    return undefined
  }

  protected initMarkedBoards(): boolean[][][] {
    const numBoard = this._boards.length
    const boardLen = this._boards[0]?.length || 0
    const markedBoards: boolean[][][] = []

    for (let i = 0; i < numBoard; i++) {
      markedBoards[i] = Array(boardLen)
        .fill(false)
        .map(() => Array(boardLen).fill(false))
    }

    return markedBoards
  }

  protected boardPositionFromNumber(board: number[][], num: number): [number, number] | undefined {
    for (const [y, row] of board.entries()) {
      for (const [x, val] of row.entries()) {
        if (val === num) return [y, x]
      }
    }
    return undefined
  }

  protected isBoardWinning(board: boolean[][]): boolean {
    // Check rows
    for (const row of board) {
      if (row.every((el) => el)) return true
    }

    // Check columns
    for (let colInd = 0; colInd < board.length; colInd++) {
      const col = board.map((row) => row[colInd])
      if (col.every((el) => el)) return true
    }
    return false
  }
}

export { GiantSquid as default, GiantSquid }
