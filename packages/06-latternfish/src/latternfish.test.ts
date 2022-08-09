import { strict as assert } from 'node:assert'
import { Latternfish, LatternfishConfig } from './latternfish'

interface TestCase {
  config: LatternfishConfig
  modelDay: number
  expect: number[]
}

const testCases: Record<string, TestCase> = {
  simpleNoSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 1,
    expect: [2, 1, 0]
  },
  simpleWithSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 2,
    expect: [1, 0, 6, 8]
  },
  givenExample: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8
    },
    modelDay: 18,
    expect: [6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8, 8]
  }
}

describe('Day 06 - Latternfish', () => {
  describe('Part I', () => {
    it('test for fish of no spawning', () => runTestCase('simpleNoSpawning'))
    it('test for fish with spawning', () => runTestCase('simpleWithSpawning'))
    it('test for the given example', () => runTestCase('givenExample'))
  })
})

function runTestCase(testName: string) {
  if (Object.keys(testCases).includes(testName)) {
    const { modelDay, config, expect } = testCases[testName] as TestCase
    const result = Latternfish.modeling(config, modelDay)
    // We sort both result, because the order doesn't matter, as long as all the elements in one set exist in another set.
    assert.deepEqual(result.sort(), expect.sort())
  } else {
    throw new Error(`Test case "${testName}" not found.`)
  }
}
