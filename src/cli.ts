import { Command } from 'commander'

import { readInput } from '@aoc-2021/utils'
import SonarSweep from '@aoc-2021/sonar-sweep'

// cli sonar-sweep -i packages/01-sonar-sweep/input/input.dat

const program = new Command()
  .name('@aoc-2021/cli')
  .description('Running Advent of Code 2021')
  .version('0.0.1')

program
  .command('sonar-sweep')
  .description('Day 01 - Sonar Sweep')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .action((options) => {
    const input = readInput(options.input, { type: 'number' }) as number[]
    const ss = new SonarSweep(input)
    const result = ss.countIncreasing()
    console.log(`The result is: ${result}.`)
  })

program.parse()
