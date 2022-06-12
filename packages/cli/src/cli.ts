import { Command } from 'commander'

import { readInput } from '@aoc-2021/utils'
import SonarSweep from '@aoc-2021/sonar-sweep'

// Read the current version
const version = process.env['npm_package_version'] || '0.0.0'

const program = new Command()
  .name('@aoc-2021/cli')
  .description('Running Advent of Code 2021')
  .version(version)

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
