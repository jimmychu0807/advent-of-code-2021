import { Command } from 'commander'

// local import
import { readInput } from 'utils'
import SonarSweep from './sonar-sweep'

const command = new Command('sonar-sweep')
  .description('Day 01 - Sonar Sweep')
  .requiredOption('-i, --input <inputPath>', 'path to input data')
  .showHelpAfterError()
  .action((options) => {
    const input = readInput(options.input, { type: 'number' }) as number[]
    const ss = new SonarSweep(input)
    const result1 = ss.count()
    console.log('Part I result is:', result1)

    const result2 = ss.count(3)
    console.log('Part II result is:', result2)
  })

export { command as default }
