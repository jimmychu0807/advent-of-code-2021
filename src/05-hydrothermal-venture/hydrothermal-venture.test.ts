import { expect } from 'chai'

// local import
import { readInput } from '../utils/index.js'
import { HydrothermalVenture } from './hydrothermal-venture.js'

const QUEST_INPUT_URL = new URL('input/test.dat', import.meta.url)

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
      expect(hv.countOverlap()).eq(0)
    })

    it('test a simple case with overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleWithOverlap)
      expect(hv.countOverlap()).eq(1)
    })

    it('test the given example', () => {
      const inputs = readInput(QUEST_INPUT_URL, { type: 'string' }) as string[]
      const hv = new HydrothermalVenture(inputs)
      expect(hv.countOverlap()).eq(5)
    })
  })

  describe('Part II', () => {
    it('test a simple case no overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleDiagonalNoOverlap, fullOpts)
      expect(hv.countOverlap()).eq(0)
      expect(hv.board).eql([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ])
    })

    it('test a simple case with overlap', () => {
      const hv = new HydrothermalVenture(tests.simpleDiagonalWithOverlap, fullOpts)
      expect(hv.countOverlap()).eq(1)
      expect(hv.board).eql([
        [1, 0, 1],
        [0, 2, 0],
        [1, 0, 1]
      ])
    })

    it('test the given example', () => {
      const inputs = readInput(QUEST_INPUT_URL, { type: 'string' }) as string[]
      const hv = new HydrothermalVenture(inputs, fullOpts)
      expect(hv.countOverlap()).eq(12)
    })
  })
})
