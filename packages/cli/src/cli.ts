import { Command } from 'commander'

import { readInput } from '@aoc-2021/utils'
import SonarSweep from '@aoc-2021/sonar-sweep'
import Dive from '@aoc-2021/dive'
import BinaryDiagnostic from '@aoc-2021/binary-diagnostic'
import GiantSquid from '@aoc-2021/giant-squid'

// Read the package.json info
const name = process.env['npm_package_name'] ?? ''
const description = process.env['npm_package_description'] ?? ''
const version = process.env['npm_package_version'] ?? ''

const program = new Command().name(name).description(description).version(version)

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

program
  .command('dive')
  .description('Day 02 - Dive!')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .action((options) => {
    const input: string[] = readInput(options.input, { type: 'string' }) as string[]
    const dive = new Dive(input)
    const result1 = dive.execute({ op: 'multiplication' })
    console.log('Part I result is:', result1)

    const result2 = dive.execute({ op: 'aimWithMultiplication' })
    console.log('Part II result is:', result2)
  })

program
  .command('binary-diagnostic')
  .description('Day 03 - Binary Diagnostic')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .action((options) => {
    const input: string[] = readInput(options.input, { type: 'string' }) as string[]
    const bd = new BinaryDiagnostic(input)
    const result1 = bd.powerConsumption
    console.log('Part I result is:', result1)

    const result2 = bd.lifeSupportRating
    console.log('Part II result is:', result2)
  })

program
  .command('giant-squid')
  .description('Day 04 - Giant Squid')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .action((options) => {
    const gs = new GiantSquid(options.input)
    const result1 = gs.findWinningBoardAndCondition()
    console.log('Part I result is:', result1)

    const result2 = gs.findLastWinningBoardAndCondition()
    console.log('Part II result is:', result2)
  })

program.parse()
