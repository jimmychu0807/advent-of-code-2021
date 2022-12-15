import { expect } from 'chai'
import * as path from 'path'

// local import
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

const testFilePath = path.join(__dirname, 'input', 'test.dat')

describe('Day 04 - Giant Squid', () => {
  describe('Part I', () => {
    it('test for one board no winning', () => {
      const gs = new GiantSquid(testCases.oneBoardNoWinning)
      expect(gs.findWinningBoardAndCondition()).is.null
    })

    it('test for one board with winning', () => {
      const gs = new GiantSquid(testCases.oneBoardWithWinning)
      expect(gs.findWinningBoardAndCondition()).eql({
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
      expect(gs.findWinningBoardAndCondition()).is.null
    })

    it('test for two boards with winning', () => {
      const gs = new GiantSquid(testCases.twoBoardsWithWinning)
      expect(gs.findWinningBoardAndCondition()).eql({
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
      expect(cond).have.property('winningInd', 2)
      expect(cond).have.property('score', 4512)
      expect(cond).have.property('inputStreamRead', 12)
    })
  })

  describe('Part II', () => {
    it('test for the given example', () => {
      const gs = new GiantSquid(testFilePath)
      const cond = gs.findLastWinningBoardAndCondition()
      expect(cond).have.property('winningInd', 1)
      expect(cond).have.property('score', 1924)
    })
  })
})
