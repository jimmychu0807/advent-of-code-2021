import { strict as assert } from 'node:assert'
import * as path from 'path'
import { readInput } from '@aoc-2021/utils'
import { HydrothermalVenture } from './hydrothermal-venture'

const testFilePath = path.join(__dirname, '../input/test.dat')

const tests = {
  simpleNoOverlap: ['0,0 -> 0,1', '1,0 -> 1,1'],
  simpleWithOverlap: ['0,0 -> 0,1', '0,1 -> 1,1']
}


describe('Day 05 - Hydrothermal Venture', () => {
  describe('Part I', () => {
    it('works for a simple case no overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleNoOverlap)
      assert.equal(hv.countOverlap(), 0)
    })

    it('works for a simple case with overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleWithOverlap)
      assert.equal(hv.countOverlap(), 1)
    })

    it('works for the given example', () => {
      const inputs = readInput(testFilePath, { type: 'string' }) as string[]
      const hv = new HydrothermalVenture(inputs)
      assert.equal(hv.countOverlap(), 5)
    })
  })

  describe('Part II', () => {

  })
})
