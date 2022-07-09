import { strict as assert } from 'node:assert'
import { Dive } from './dive'

describe('Day 02 - Dive', () => {
  describe('noop / multiplication mode', () => {
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

  describe('aim / multiplication with aim mode', () => {
    it('test for empty input', () => {
      const dive = new Dive([])
      assert.deepEqual(dive.execute({ op: 'aim' }), [0, 0])
    })

    it('test for forward', () => {
      const dive = new Dive(['forward 10'])
      assert.deepEqual(dive.execute({ op: 'aim' }), [10, 0])
    })

    it('test for down', () => {
      const dive = new Dive(['down 5', 'forward 10'])
      assert.deepEqual(dive.execute({ op: 'aim' }), [10, 50])
    })

    it('test for down and accumulating aim', () => {
      const dive = new Dive(['down 5', 'down 3', 'forward 10'])
      assert.deepEqual(dive.execute({ op: 'aim' }), [10, 80])
    })
  })
})
