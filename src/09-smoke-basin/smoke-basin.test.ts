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
  riskLevel: 15,
  basinScanMap: [
    [0, 0, undefined, undefined, undefined, 1, 1, 1, 1, 1],
    [0, undefined, 2, 2, 2, undefined, 1, undefined, 1, 1],
    [undefined, 2, 2, 2, 2, 2, undefined, 3, undefined, 1],
    [2, 2, 2, 2, 2, undefined, 3, 3, 3, undefined],
    [undefined, 2, undefined, undefined, undefined, 3, 3, 3, 3, 3],
  ]
}

describe('Day 09 - Smoke Basin', () => {
  describe('Part I', () => {
    it('test smoke-basin getLowPoints()', () => {
      const lowPts = SmokeBasin.getLowPoints(TEST_SAMPLE.input)
      expect(lowPts.map((el) => el.value)).eql(TEST_SAMPLE.lowPoints)
    })

    it('test smoke-basin getTotalRiskLevel()', () => {
      const riskLevel = SmokeBasin.getTotalRiskLevel(TEST_SAMPLE.input)
      expect(riskLevel).to.eql(TEST_SAMPLE.riskLevel)
    })
  })

  describe('Part II', () => {
    it('test smoke-basin scanBasin()', () => {
      const scanMap = SmokeBasin.scanBasin(TEST_SAMPLE.input)
      expect(scanMap).to.eql(TEST_SAMPLE.basinScanMap)
    })
  })
})
