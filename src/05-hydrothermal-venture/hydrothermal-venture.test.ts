import { strict as assert } from 'node:assert'
import * as path from 'path'

// local import
import { readInput } from 'utils'
import { HydrothermalVenture } from './hydrothermal-venture'

const testFilePath = path.join(__dirname, 'input', 'test.dat')

const tests = {
  simpleNoOverlap: ['0,0 -> 0,1', '1,0 -> 1,1'],
  simpleWithOverlap: ['0,0 -> 0,1', '0,1 -> 1,1'],
  simpleDiagonalNoOverlap: ['2,2 -> 0,0'],
  simpleDiagonalWithOverlap: ['0,0 -> 2,2', '0,2 -> 2,0']
}

const fullOpts = { horizontalVertical: true, diagonal: true }

describe('Day 05 - Hydrothermal Venture', () => {
  describe('Part I', () => {
    it('test a simple case no overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleNoOverlap)
      assert.equal(hv.countOverlap(), 0)
    })

    it('test a simple case with overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleWithOverlap)
      assert.equal(hv.countOverlap(), 1)
    })

    it('test the given example', () => {
      const inputs = readInput(testFilePath, { type: 'string' }) as string[]
      const hv = new HydrothermalVenture(inputs)
      assert.equal(hv.countOverlap(), 5)
    })
  })

  describe('Part II', () => {
    it('test a simple case no overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleDiagonalNoOverlap, fullOpts)
      assert.equal(hv.countOverlap(), 0)
      assert.deepEqual(hv.board, [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ])
    })

    it('test a simple case with overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleDiagonalWithOverlap, fullOpts)
      assert.equal(hv.countOverlap(), 1)
      assert.deepEqual(hv.board, [
        [1, 0, 1],
        [0, 2, 0],
        [1, 0, 1]
      ])
    })

    it('test the given example', () => {
      const inputs = readInput(testFilePath, { type: 'string' }) as string[]
      const hv = new HydrothermalVenture(inputs, fullOpts)
      assert.equal(hv.countOverlap(), 12)
    })
  })
})
