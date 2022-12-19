import { expect } from 'chai'

// local import
import SmokeBasin from './smoke-basin.js'

// prettier-ignore
const TEST_SAMPLE = {
  input: [
    '2199943210',
    '3987894921',
    '9856789892',
    '8767896789',
    '9899965678',
  ],
  lowPoints: [1, 0, 5, 5],
  riskLevel: 15
}

describe('Day 09 - Smoke Basin', () => {
  describe('Part I', () => {
    it('test smoke-basin getLowPoints()', () => {
      const lowPts = SmokeBasin.getLowPoints(TEST_SAMPLE.input)
      expect(lowPts).to.eql(TEST_SAMPLE.lowPoints)
    })

    it('test smoke-basin getTotalRiskLevel()', () => {
      const riskLevel = SmokeBasin.getTotalRiskLevel(TEST_SAMPLE.input)
      expect(riskLevel).to.eql(TEST_SAMPLE.riskLevel)
    })
  })

  describe('Part II', () => {
    it('test for Part II')
  })
})
