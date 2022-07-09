import { strict as assert } from 'node:assert'
import { currentPathName } from '@aoc-2021/utils'
import { GiantSquid, WinningCondition } from './giant-squid'

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

const testFilePath = `${currentPathName(import.meta.url)[1]}/../input/test.dat`

describe('Day 04 - Giant Squid', () => {
  it('test for one board no winning', () => {
    const gs = new GiantSquid(testCases.oneBoardNoWinning)
    assert.deepEqual(gs.findWinningBoardAndCondition(), undefined)
  })

  it('test for one board with winning', () => {
    const gs = new GiantSquid(testCases.oneBoardWithWinning)
    assert.deepEqual(gs.findWinningBoardAndCondition(), [
      0,
      [
        [true, false],
        [true, false]
      ],
      187
    ])
  })

  it('test for two boards no winning', () => {
    const gs = new GiantSquid(testCases.twoBoardsNoWinning)
    assert.deepEqual(gs.findWinningBoardAndCondition(), undefined)
  })

  it('test for two boards with winning', () => {
    const gs = new GiantSquid(testCases.twoBoardsWithWinning)
    assert.deepEqual(gs.findWinningBoardAndCondition(), [
      1,
      [
        [true, false, false],
        [true, false, false],
        [true, false, false]
      ],
      462
    ])
  })

  it('test for the given example', () => {
    const gs = new GiantSquid(testFilePath)
    const [winningInd, , score] = gs.findWinningBoardAndCondition() as WinningCondition
    assert.deepEqual(winningInd, 2)
    assert.deepEqual(score, 4512)
  })
})
