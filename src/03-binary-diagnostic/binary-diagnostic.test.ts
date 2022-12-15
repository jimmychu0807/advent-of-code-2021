import { expect } from 'chai'

// local import
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
  describe('Part I', () => {
    it('test gamma on a single input', () => {
      const bg = new BinaryDiagnostic(['111'])
      expect(bg.gamma).eq(7)
    })

    it('test gamma on three input', () => {
      const bg = new BinaryDiagnostic(['111', '001', '010'])
      expect(bg.gamma).eq(3)
    })

    it('test gamma on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      expect(bg.gamma).eq(22)
    })

    it('test epsilon on a single input', () => {
      const bg = new BinaryDiagnostic(['111'])
      expect(bg.epsilon).eq(0)
    })

    it('test epsilon on three input', () => {
      const bg = new BinaryDiagnostic(['111', '001', '010'])
      expect(bg.epsilon).eq(4)
    })

    it('test epsilon on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      expect(bg.epsilon).eq(9)
    })

    it('test powerConsumption on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      expect(bg.powerConsumption).eq(198)
    })
  })

  describe('Part II', () => {
    it('test oxygenRating on a dual input', () => {
      const bg = new BinaryDiagnostic(['000', '110'])
      expect(bg.oxygenRating).eq(6)
    })

    it('test co2Rating on a dual input', () => {
      const bg = new BinaryDiagnostic(['000', '110'])
      expect(bg.co2Rating).eq(0)
    })

    it('test oxygenRating on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      expect(bg.oxygenRating).eq(23)
    })

    it('test co2Rating on test input', () => {
      const bg = new BinaryDiagnostic(testInput)
      expect(bg.co2Rating).eq(10)
    })
  })
})
