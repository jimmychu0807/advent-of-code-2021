import { Command } from 'commander'
import { readInput } from '@aoc-2021/utils'
import BinaryDiagnostic from './binary-diagnostic'

const command = new Command('binary-diagnostic')
  .description('Day 03 - Binary Diagnostic')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const input: string[] = readInput(options.input, { type: 'string' }) as string[]
    const bd = new BinaryDiagnostic(input)
    const result1 = bd.powerConsumption
    console.log('Part I result is:', result1)

    const result2 = bd.lifeSupportRating
    console.log('Part II result is:', result2)
  })

export { command as default }
