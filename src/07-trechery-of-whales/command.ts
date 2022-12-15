import { resolve as resolve_path } from 'path'
import { Command, Option } from 'commander'
import { exit } from 'process'

// local import
import { readInput } from 'utils'
import TrecheryOfWhales from './trechery-of-whales'

interface CommandOptions {
  input: string | undefined
  file: string | undefined
  defaultQuestData: boolean
}

const QUEST_INPUT_PATH = resolve_path(__dirname, 'input', 'input.dat')

const command = new Command('trechery-of-whales')
  .description('Day 07 - The Trechery of Whales')
  .addOption(
    new Option('-i, --input <string>', 'comma separated value of input (e.g. 1,2,3)').conflicts([
      'file',
      'defaultQuestData'
    ])
  )
  .addOption(
    new Option('-f, --file <inputPath>', 'path to input data').conflicts([
      'input',
      'defaultQuestData'
    ])
  )
  .addOption(
    new Option('-d, --defaultQuestData', 'using default quest data')
      .default(false)
      .conflicts(['input', 'file'])
  )
  .showHelpAfterError()
  .action((options: CommandOptions) => {
    const input = parseArgs(options)
      .split(',')
      .map((v) => Number(v.trim()))

    const [pos1, value1] = TrecheryOfWhales.getMinFuelPos({ input, distCal: 'normal' })
    console.log(`Part I: pos: ${pos1}, cost: ${value1}`)

    const [pos2, value2] = TrecheryOfWhales.getMinFuelPos({ input, distCal: 'incremental' })
    console.log(`Part II: pos: ${pos2}, cost: ${value2}`)
  })

function parseArgs(options: CommandOptions): string {
  if (!options.input && !options.file && !options.defaultQuestData) {
    console.log('Please specify one argument from below.')
    command.help()
    exit(1)
  }

  if (options.input) return options.input as string
  return readInput(options.file || QUEST_INPUT_PATH, { type: 'string' })[0] as string
}

export { command as default }
