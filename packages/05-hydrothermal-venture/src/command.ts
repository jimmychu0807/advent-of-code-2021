import { Command } from 'commander'
import { readInput } from '@aoc-2021/utils'
import { HydrothermalVenture } from './hydrothermal-venture'

const command = new Command('hydrothermal-venture')
  .description('Day 05 - Hydrothermal Venture')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const inputs = readInput(options.input, { type: 'string' }) as string[]
    const hv = new HydrothermalVenture(inputs)
    console.log('Part I result is:', hv.countOverlap())
  })

export { command as default }
