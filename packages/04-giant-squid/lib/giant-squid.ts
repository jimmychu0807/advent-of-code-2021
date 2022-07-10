'use strict'

import { readInput } from '@aoc-2021/utils'

type MarkedBoard = boolean[][]
type BingoBoard = number[][]
interface WinningCondition {
  winningInd: number
  markedBoard: MarkedBoard
  score: number
  inputStreamRead: number
}

class GiantSquid {
  private _inputStream: string
  private _boards: BingoBoard[]

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

  get boards(): BingoBoard[] {
    return this._boards
  }

  get inputStream(): string {
    return this._inputStream
  }

  public findWinningBoardAndCondition(
    inputStream: string = this._inputStream,
    boards: BingoBoard[] = this._boards
  ): WinningCondition | null {
    const markedBoards: MarkedBoard[] = this.initMarkedBoards(boards.length, boards[0]?.length ?? 0)
    const nums: number[] = this.convertStreamToNumArr(inputStream)

    for (const [inputInd, num] of nums.entries()) {
      boards.forEach((board, ind) => {
        const pos = this.boardPositionFromNumber(board, num)

        if (pos) {
          const row = markedBoards[ind]?.[pos[0]] as boolean[]
          row[pos[1]] = true
        }
      })

      // note: key state for checking
      //console.log(`after ${num}:`, markedBoards)

      let indAndBoard = markedBoards.map<[number, MarkedBoard]>((board, ind) => [ind, board])
      indAndBoard = indAndBoard.filter(([, board]) => this.isBoardWinning(board))
      if (indAndBoard.length > 0) {
        if (indAndBoard.length > 1) {
          throw new Error('Not handling the case that multiple boards are winning.')
        }
        const [winningInd, markedBoard] = indAndBoard[0] as [number, MarkedBoard]
        return {
          winningInd,
          markedBoard,
          score: this.score(boards[winningInd] as BingoBoard, markedBoard, num),
          inputStreamRead: inputInd + 1
        }
      }
    }

    return null
  }

  public findLastWinningBoardAndCondition(
    inputStream: string = this._inputStream,
    boards: BingoBoard[] = this._boards
  ): WinningCondition | null {
    let remainingStream = Object.assign('', inputStream) as string
    const boardsWon = Array(boards.length).fill(false)
    let lastWinningCond: WinningCondition | undefined = undefined
    let adjustedWinningInd: number | undefined = undefined

    while (remainingStream.length > 0 && boardsWon.some((val) => !val)) {
      const remainingBoards = boards.filter((_, ind) => !boardsWon[ind])
      const cond = this.findWinningBoardAndCondition(remainingStream, remainingBoards)

      // Iterate thru the remaining stream and boards and no winning board
      if (!cond) break

      // A winning condition occured
      // note: need to adjust winningInd
      adjustedWinningInd = this.adjustIndex(boardsWon, cond.winningInd)
      if (!adjustedWinningInd) throw new Error('Finding adjustedIndex return undefined value.')
      boardsWon[adjustedWinningInd] = true
      remainingStream = this.convertStreamToNumArr(remainingStream)
        .slice(cond.inputStreamRead)
        .join(',')
      // Save the winning condition
      lastWinningCond = Object.assign({}, cond)

      console.log('Current winning condition', cond)
      console.log('boards won', boardsWon)
    }

    if (!lastWinningCond) return null

    lastWinningCond.winningInd = adjustedWinningInd as number
    return lastWinningCond
  }

  protected adjustIndex(boardsWon: boolean[], ind: number): number | undefined {
    let count = ind

    for (const [adjustedInd, val] of boardsWon.entries()) {
      if (val) continue
      if (count === 0) return adjustedInd
      count -= 1
    }
    return undefined
  }

  protected initMarkedBoards(numBoard: number, boardLen: number): MarkedBoard[] {
    const markedBoards: MarkedBoard[] = []

    for (let i = 0; i < numBoard; i++) {
      markedBoards[i] = Array(boardLen)
        .fill(false)
        .map(() => Array(boardLen).fill(false))
    }

    return markedBoards
  }

  protected boardPositionFromNumber(board: BingoBoard, num: number): [number, number] | null {
    for (const [y, row] of board.entries()) {
      for (const [x, val] of row.entries()) {
        if (val === num) return [y, x]
      }
    }
    return null
  }

  protected isBoardWinning(board: MarkedBoard): boolean {
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

  protected score(winningBoard: BingoBoard, markedBoard: MarkedBoard, lastNum: number): number {
    const sum = (m: number, n: number) => m + n

    const total = winningBoard
      .map((row, y) => row.map((val, x) => (markedBoard[y]?.[x] ? 0 : val)).reduce(sum, 0))
      .reduce(sum, 0)

    return total * lastNum
  }

  protected convertStreamToNumArr(inputStream: string): number[] {
    return inputStream.split(',').map((v) => Number(v.trim()))
  }
}

export { GiantSquid as default, GiantSquid, WinningCondition }
