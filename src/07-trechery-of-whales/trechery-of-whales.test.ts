import { expect } from 'chai'

// local import
import TrecheryOfWhales from './trechery-of-whales'

const TEST_INPUT = '16,1,2,0,4,2,7,1,2,14'

describe('Day 07 - The Trechery of Whales', () => {
  it('test for the given example - Part I', () => {
    const [pos, value] = TrecheryOfWhales.getMinFuelPos({
      input: TEST_INPUT,
      distCal: 'normal'
    })

    expect(pos).eq(2)
    expect(value).eq(37)
  })

  it('test for the given example - Part II', () => {
    const [pos, value] = TrecheryOfWhales.getMinFuelPos({
      input: TEST_INPUT,
      distCal: 'incremental'
    })

    expect(pos).eq(5)
    expect(value).eq(168)
  })
})
