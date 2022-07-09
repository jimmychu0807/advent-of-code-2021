import { strict as assert } from 'node:assert'
import { BinaryDiagnostic } from './binary-diagnostic'

const testInput = [
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010'
]

describe('Day 03 - Binary Diagnostic', () => {
  describe('Tests of Part I', () => {
    it('test gamma on a single input', () => {
      const bg = new BinaryDiagnostic(['111'])
      assert.strictEqual(bg.gamma, 7)
    })

    it('test gamma on three input', () => {
      const bg = new BinaryDiagnostic(['111', '001', '010'])
      assert.strictEqual(bg.gamma, 3)
    })

    it('test gamma on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      assert.strictEqual(bg.gamma, 22)
    })

    it('test epsilon on a single input', () => {
      const bg = new BinaryDiagnostic(['111'])
      assert.strictEqual(bg.epsilon, 0)
    })

    it('test epsilon on three input', () => {
      const bg = new BinaryDiagnostic(['111', '001', '010'])
      assert.strictEqual(bg.epsilon, 4)
    })

    it('test epsilon on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      assert.strictEqual(bg.epsilon, 9)
    })

    it('test powerConsumption on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      assert.strictEqual(bg.powerConsumption, 198)
    })
  })

  describe('Tests of Part II', () => {
    it('test oxygenRating on a dual input', () => {
      const bg = new BinaryDiagnostic(['000', '110'])
      assert.strictEqual(bg.oxygenRating, 6)
    })

    it('test co2Rating on a dual input', () => {
      const bg = new BinaryDiagnostic(['000', '110'])
      assert.strictEqual(bg.co2Rating, 0)
    })

    it('test oxygenRating on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      assert.strictEqual(bg.oxygenRating, 23)
    })

    it('test co2Rating on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      assert.strictEqual(bg.co2Rating, 10)
    })
  })
})
