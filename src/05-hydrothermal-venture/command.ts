import { Command } from 'commander'
import { readInput } from 'utils'
import { HydrothermalVenture } from './hydrothermal-venture'

const command = new Command('hydrothermal-venture')
  .description('Day 05 - Hydrothermal Venture')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const inputs = readInput(options.input, { type: 'string' }) as string[]
    const hv1 = new HydrothermalVenture(inputs)
    console.log('Part I result is:', hv1.countOverlap())

    const hv2 = new HydrothermalVenture(inputs, { horizontalVertical: true, diagonal: true })
    console.log('Part II result is:', hv2.countOverlap())
  })

export { command as default }
