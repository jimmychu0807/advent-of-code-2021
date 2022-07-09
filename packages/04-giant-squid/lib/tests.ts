import { strict as assert } from 'node:assert'
import { GiantSquid } from './giant-squid'

const testCases = {
  oneBoardNoWinning: ['10, 11', '', '10 9', '8 11']
}

describe('Day 04 - Giant Squid', () => {
  it('test for a single input', () => {
    const gs = new GiantSquid(testCases.oneBoardNoWinning)
    assert.deepEqual(gs.findWinningBoard(), undefined)
  })
})
