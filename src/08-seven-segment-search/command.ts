import { Command, Option } from 'commander'
import { exit } from 'process'

// local import
import { readInput } from '../utils/index.js'
import SevenSegmentSearch from './seven-segment-search.js'

interface CommandOptions {
  file: string | undefined
  defaultQuestData: boolean
}

const QUEST_INPUT_URL = new URL('input/input.dat', import.meta.url)

const command = new Command('seven-segment-search')
  .description('Day 08 - Seven Segment Search')
  .addOption(
    new Option('-f, --file <inputPath>', 'path to input data').conflicts(['defaultQuestData'])
  )
  .addOption(
    new Option('-d, --defaultQuestData', 'using default quest data')
      .default(false)
      .conflicts(['file'])
  )
  .showHelpAfterError()
  .action((options: CommandOptions) => {
    const input = parseArgs(options)

    const cnt = SevenSegmentSearch.cntOutputUniqueValue(input)
    console.log(`The output unique value count is: ${cnt}`)
  })

function parseArgs(options: CommandOptions): string[] {
  if (!options.file && !options.defaultQuestData) {
    console.log('Please specify one argument from below.')
    command.help()
    exit(1)
  }

  return readInput(options.file || QUEST_INPUT_URL, { type: 'string' }) as string[]
}

export { command as default }
