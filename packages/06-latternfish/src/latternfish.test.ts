import { strict as assert } from 'node:assert'
import { Latternfish, LatternfishConfig, pushEl, merge } from './latternfish'

interface TestCase {
  config: LatternfishConfig
  modelDay: number
  expect: number[][] | number
}

const testCases: Record<string, TestCase> = {
  simpleNoSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 1,
    expect: [[2, 1, 0]]
  },
  simpleWithSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 2,
    expect: [[1, 0, 6, 8]]
  },
  givenExampleOne: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 18,
    expect: [[6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8, 8]]
  },
  givenExampleTwo: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 80,
    expect: 5934
  }
}

describe('Day 06 - Latternfish', () => {
  it('test for fish of no spawning', () => runTestCase('simpleNoSpawning'))
  it('test for fish with spawning', () => runTestCase('simpleWithSpawning'))
  it('test for the given example I', () => runTestCase('givenExampleOne'))
  it('test for the given example II', () => runTestCase('givenExampleTwo'))

  it('can count fishes', () => {
    const res = Latternfish.countFishes([[1, 2], [3, 4]])
    assert.deepEqual(res, 4n)
  })

  describe('test pushEl()', () => {
    it('test for empty array', () => {
      let arr: number[][] = [[]]
      arr = pushEl(arr, 3, 3)
      assert.deepEqual(arr, [[3]])
    })

    it('test for simple array, no splitting', () => {
      let arr: number[][] = [[1, 1]]
      arr = pushEl(arr, 3, 3)
      assert.deepEqual(arr, [[1, 1, 3]])
    })

    it('test for simple array, with splitting', () => {
      let arr: number[][] = [[1, 1, 1]]
      arr = pushEl(arr, 3, 3)
      assert.deepEqual(arr, [[1, 1, 1], [3]])
    })

    it('test for simple array maximum capacity', () => {
      let arr: number[][] = [[1, 1, 1], [1, 1, 1], [1, 1]]
      arr = pushEl(arr, 3, 3)
      assert.deepEqual(arr, [[1, 1, 1], [1, 1, 1], [1, 1, 3]])
    })

    it('test for simple array exceeding maximum capacity', () => {
      let arr: number[][] = [[1, 1, 1], [1, 1, 1], [1, 1, 1]]

      assert.throws(() => {
        arr = pushEl(arr, 3, 3)
      }, new Error('Array exceeds expected capacity'))
    })
  })

  describe('test merge()', () => {
    it('test for empty array', () => {
      let arr: number[][] = [[]]
      arr = merge(arr, [[1, 2]], 3)
      assert.deepEqual(arr, [[1, 2]])
    })

    it('test for simple array, simple merging', () => {
      let arr: number[][] = [[1, 2]]
      arr = merge(arr, [[3]], 3)
      assert.deepEqual(arr, [[1, 2, 3]])
    })

    it('test for simple array, merging with row added', () => {
      let arr: number[][] = [[1, 2, 3]]
      arr = merge(arr, [[4]], 3)
      assert.deepEqual(arr, [[1, 2, 3], [4]])
    })

    it('test for simple array, merging a full row', () => {
      let arr: number[][] = [[1, 2, 3], [4, 5, 6]]
      arr = merge(arr, [[7, 8, 9]], 3)
      assert.deepEqual(arr, [[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    })

    it('test for simple array, merging with a partial row', () => {
      let arr: number[][] = [[1, 2, 3], [4]]
      let mergeWith: number[][] = [[5, 6]]
      arr = merge(arr, mergeWith, 3)
      assert.deepEqual(arr, [[1, 2, 3], [4, 5, 6]])
    })

    it('test for simple array, merging with multiple rows, max capacity', () => {
      let arr: number[][] = [[1, 2, 3], [4]]
      let mergeWith: number[][] = [[5, 6, 7], [8, 9]]
      arr = merge(arr, mergeWith, 3)
      assert.deepEqual(arr, [[1, 2, 3], [5, 6, 7], [4, 8, 9]])
    })

    it('test for simple array, merging with multiple rows, exceeding max capacity', () => {
      let arr: number[][] = [[1, 2, 3], [4, 5]]
      let mergeWith: number[][] = [[5, 6, 7], [8, 9]]
      assert.throws(() => {
        arr = merge(arr, mergeWith, 3)
      }, new Error('Target array exceeds expected capacity'))
    })

    it('test for array, merging with multiple rows, last merged row fully occupied', () => {
      let arr: number[][] = [[1, 2, 3, 3], [4, 5, 6]]
      let mergeWith: number[][] = [[5, 6, 7, 7], [8]]
      arr = merge(arr, mergeWith, 4)
      assert.deepEqual(arr, [[1, 2, 3, 3], [5, 6, 7, 7], [4, 5, 6, 8]])
    })

    it('test for array, merging with multiple rows, last merged row expand to a second row', () => {
      let arr: number[][] = [[1, 2, 3, 3], [4, 5, 6]]
      let mergeWith: number[][] = [[5, 6, 7, 7], [8, 9]]
      arr = merge(arr, mergeWith, 4)
      assert.deepEqual(arr, [[1, 2, 3, 3], [5, 6, 7, 7], [4, 5, 6, 8], [9]])
    })
  })
})

function runTestCase(testName: string) {
  if (Object.keys(testCases).includes(testName)) {
    const { modelDay, config, expect } = testCases[testName] as TestCase
    const result = Latternfish.modeling(config, modelDay)
    // We sort both result, because the order doesn't matter, as long as all the elements in one set exist in another set.
    if (Array.isArray(expect)) {
      assert.deepEqual(result.sort(), expect.sort())
    } else {
      assert.deepEqual(Latternfish.countFishes(result), BigInt(expect))
    }

  } else {
    throw new Error(`Test case "${testName}" not found.`)
  }
}
