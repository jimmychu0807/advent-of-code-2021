import { Command } from 'commander'
import { exit } from 'process'

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from '../utils/index.js'
import DumboOctopus from './dumbo-octopus.js'

const QUEST_INPUT_URL = new URL('input/input.dat', import.meta.url)

const command = new Command('dumbo-octopus')
  .description('Day 11 - Dumbo Octopus')
  .showHelpAfterError()

decorateCommand(command, { file: true, default: true, input: false })

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL)
    const part1Res = DumboOctopus.modeling(input, 100)
    console.log(`Part I result: ${part1Res[0]!}`)
  } catch (err) {
    console.log((err as Error).message)
    command.help()
    exit(1)
  }
})

export { command as default }
