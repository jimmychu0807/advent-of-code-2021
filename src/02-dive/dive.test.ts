import { expect } from 'chai'

// local import
import { Dive } from './dive'

describe('Day 02 - Dive', () => {
  describe('Part I', () => {
    it('test for empty input', () => {
      const dive = new Dive([])
      expect(dive.execute()).eql([0, 0])
    })

    it('test for forward', () => {
      const dive = new Dive(['forward 10'])
      expect(dive.execute()).eql([10, 0])
    })

    it('test for down', () => {
      const dive = new Dive(['down 10'])
      expect(dive.execute()).eql([0, 10])
    })

    it('test for up', () => {
      const dive = new Dive(['up 10'])
      expect(dive.execute()).eql([0, -10])
    })

    it('test for combination and multiplication op', () => {
      const dive = new Dive(['forward 10', 'down 10'])
      expect(dive.execute()).eql([10, 10])
      expect(dive.execute({ op: 'multiplication' })).eq(100)
    })
  })

  describe('Part II', () => {
    it('test for empty input', () => {
      const dive = new Dive([])
      expect(dive.execute({ op: 'aim' })).eql([0, 0])
    })

    it('test for forward', () => {
      const dive = new Dive(['forward 10'])
      expect(dive.execute({ op: 'aim' })).eql([10, 0])

    })

    it('test for down', () => {
      const dive = new Dive(['down 5', 'forward 10'])
      expect(dive.execute({ op: 'aim' })).eql([10, 50])
    })

    it('test for down and accumulating aim', () => {
      const dive = new Dive(['down 5', 'down 3', 'forward 10'])
      expect(dive.execute({ op: 'aim' })).eql([10, 80])
    })
  })
})
