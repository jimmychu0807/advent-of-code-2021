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
    const result1 = ss.count()
    console.log('Part I result is:', result1)

    const result2 = ss.count(3)
    console.log('Part II result is:', result2)
  })

program.parse()
