import { strict as assert } from 'node:assert'
import { BinaryDiagnostic } from '../src/binary-diagnostic'

describe('Day 03 - Binary Diagnostic', () => {
  it('test gamma() on a single input', () => {
    const bg = new BinaryDiagnostic(['111'])
    assert.strictEqual(bg.gamma(), 7)
  })

  it('test gamma() on three input', () => {
    const bg = new BinaryDiagnostic(['111', '001', '010'])
    assert.strictEqual(bg.gamma(), 3)
  })

  it('test epsilon() on a single input', () => {
    const bg = new BinaryDiagnostic(['111'])
    assert.strictEqual(bg.epsilon(), 0)
  })

  it('test epsilon() on three input', () => {
    const bg = new BinaryDiagnostic(['111', '001', '010'])
    assert.strictEqual(bg.epsilon(), 4)
  })
})
