import { strict as assert } from 'node:assert'
import * as path from 'path'
import { GiantSquid } from './giant-squid'

const testCases = {
  oneBoardNoWinning: ['10, 11', '', '10 9', '8 11'],
  oneBoardWithWinning: ['10, 11', '', '10 9', '11 8'],
  twoBoardsNoWinning: [
    '10, 11, 12, 14',
    '',
    '10 9  7',
    '11 8  6',
    '5  4 12',
    '',
    '10 9  7',
    '11 8  6',
    '5  2  1'
  ],
  twoBoardsWithWinning: [
    '10, 11, 12, 14',
    '',
    '10 9  7',
    '11 8  6',
    '5  4 12',
    '',
    '10 9  7',
    '11 8  6',
    '14 2  1'
  ]
}

const testFilePath = path.join(__dirname, '../input/test.dat')

describe('Day 04 - Giant Squid', () => {
  describe('Part I', () => {
    it('test for one board no winning', () => {
      const gs = new GiantSquid(testCases.oneBoardNoWinning)
      assert.deepEqual(gs.findWinningBoardAndCondition(), null)
    })

    it('test for one board with winning', () => {
      const gs = new GiantSquid(testCases.oneBoardWithWinning)
      assert.deepEqual(gs.findWinningBoardAndCondition(), {
        winningInd: 0,
        markedBoard: [
          [true, false],
          [true, false]
        ],
        score: 187,
        inputStreamRead: 2
      })
    })

    it('test for two boards no winning', () => {
      const gs = new GiantSquid(testCases.twoBoardsNoWinning)
      assert.deepEqual(gs.findWinningBoardAndCondition(), null)
    })

    it('test for two boards with winning', () => {
      const gs = new GiantSquid(testCases.twoBoardsWithWinning)
      assert.deepEqual(gs.findWinningBoardAndCondition(), {
        winningInd: 1,
        markedBoard: [
          [true, false, false],
          [true, false, false],
          [true, false, false]
        ],
        score: 462,
        inputStreamRead: 4
      })
    })

    it('test for the given example', () => {
      const gs = new GiantSquid(testFilePath)
      const cond = gs.findWinningBoardAndCondition()
      assert.deepEqual(cond?.winningInd, 2)
      assert.deepEqual(cond?.score, 4512)
      assert.deepEqual(cond?.inputStreamRead, 12)
    })
  })

  describe('Part II', () => {
    it('test for the given example', () => {
      const gs = new GiantSquid(testFilePath)
      const cond = gs.findLastWinningBoardAndCondition()
      assert.deepEqual(cond?.winningInd, 1)
      assert.deepEqual(cond?.score, 1924)
    })
  })
})
