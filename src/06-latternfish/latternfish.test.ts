import { expect } from 'chai'

// local import
import { Latternfish, Config } from './latternfish.js'

interface TestCase {
  config: Config
  expect: number
}

const testCases: Record<string, TestCase> = {
  simpleNoSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8,
      daySimulation: 1
    },
    expect: 3
  },
  simpleWithSpawning: {
    config: {
      fishes: [3, 2, 1],
      dayToSpawn: 6,
      initDayToSpawn: 8,
      daySimulation: 2
    },
    expect: 4
  },
  givenExampleOne: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8,
      daySimulation: 18
    },
    expect: 26
  },
  givenExampleTwo: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8,
      daySimulation: 80
    },
    expect: 5934
  },
  givenExampleThree: {
    // Come from the problem
    config: {
      fishes: [3, 4, 3, 1, 2],
      dayToSpawn: 6,
      initDayToSpawn: 8,
      daySimulation: 256
    },
    expect: 26984457539
  }
}

describe('Day 06 - Latternfish', () => {
  it('test for fish of no spawning', () => runTestCase('simpleNoSpawning'))
  it('test for fish with spawning', () => runTestCase('simpleWithSpawning'))
  it('test for the given example I', () => runTestCase('givenExampleOne'))
  it('test for the given example II', () => runTestCase('givenExampleTwo'))
  it('test for the given example III', () => runTestCase('givenExampleThree'))
})

async function runTestCase(testName: string) {
  if (Object.keys(testCases).includes(testName)) {
    const { config, expect: expectedResult } = testCases[testName] as TestCase
    const result = Latternfish.modeling(config)
    expect(result).eql(expectedResult)
  } else {
    throw new Error(`Test case "${testName}" not found.`)
  }
}
