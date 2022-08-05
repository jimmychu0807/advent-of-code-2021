import { strict as assert } from 'node:assert'
import { isNotNullOrUndefined, capitalize } from './index'

describe('@aoc-2021/utils', () => {
  it('test isNotNullOrUndefined()', () => {
    assert.strictEqual(isNotNullOrUndefined(null), false)
    assert.strictEqual(isNotNullOrUndefined(undefined), false)
    assert.strictEqual(isNotNullOrUndefined(0), true)
    assert.strictEqual(isNotNullOrUndefined(false), true)
    assert.strictEqual(isNotNullOrUndefined(''), true)
  })

  it('test capitalize()', () => {
    assert.strictEqual(capitalize(''), '')
    assert.strictEqual(capitalize('quick brown fox'), 'Quick Brown Fox')
    assert.strictEqual(capitalize('QUICK'), 'QUICK')
  })

  // pending test
  it('test readInput()')
})
