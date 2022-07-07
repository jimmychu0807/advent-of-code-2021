import { strict as assert } from 'node:assert'
import { Dive } from '../src/Dive'

describe('Dive test', () => {
  it('test for empty input', () => {
    const dive = new Dive([])
    assert.deepEqual(dive.execute(), [0, 0])
  })

  it('test for forward', () => {
    const dive = new Dive(['forward 10'])
    assert.deepEqual(dive.execute(), [10, 0])
  })

  it('test for down', () => {
    const dive = new Dive(['down 10'])
    assert.deepEqual(dive.execute(), [0, 10])
  })

  it('test for up', () => {
    const dive = new Dive(['up 10'])
    assert.deepEqual(dive.execute(), [0, -10])
  })

  it('test for combination and multiplication op', () => {
    const dive = new Dive(['forward 10', 'down 10'])
    assert.deepEqual(dive.execute(), [10, 10])
    assert.equal(dive.execute({ op: 'multiplication' }), 100)
  })
})
