import { strict as assert } from 'node:assert'
import TrecheryOfWhales from './trechery-of-whales'

const TEST_INPUT = '16,1,2,0,4,2,7,1,2,14'

describe('Day 07 - The Trechery of Whales', () => {
  it('test for the given example - Part I', () => {
    const [pos, value] = TrecheryOfWhales.getMinFuelPos({
      input: TEST_INPUT,
      distCal: 'normal'
    })

    assert.equal(pos, 2)
    assert.equal(value, 37)
  })

  it('test for the given example - Part II', () => {
    const [pos, value] = TrecheryOfWhales.getMinFuelPos({
      input: TEST_INPUT,
      distCal: 'incremental'
    })

    assert.equal(pos, 5)
    assert.equal(value, 168)
  })
})
