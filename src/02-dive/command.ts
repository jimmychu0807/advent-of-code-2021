import { Command } from 'commander'

// local import
import { readInput } from 'utils'
import Dive from './dive'

const command = new Command('dive')
  .description('Day 02 - Dive!')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const input: string[] = readInput(options.input, { type: 'string' }) as string[]
    const dive = new Dive(input)
    const result1 = dive.execute({ op: 'multiplication' })
    console.log('Part I result is:', result1)

    const result2 = dive.execute({ op: 'aimWithMultiplication' })
    console.log('Part II result is:', result2)
  })

export { command as default }
