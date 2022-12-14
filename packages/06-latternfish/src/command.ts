import { Command } from 'commander'
import { Latternfish } from './latternfish'
import { readInput } from '@aoc-2021/utils'
import { exit } from 'process'
import {resolve as resolve_path } from 'path'

const DAY_TO_SPAWN = 6
const INIT_DAY_TO_SPAWN = 8
const SIMULATION_DAY_1 = 80
const SIMULATION_DAY_2 = 256
const QUEST_INPUT_PATH = resolve_path(__dirname, '..', 'input', 'input.dat')

const command = new Command('latternfish')
  .description('Day 06 - Latternfish')
  .option('-i, --input <string>', 'comma separated value of lattern fish')
  .option('-f, --file <inputPath>', 'path to input data. If -i and -f are not specified, default input path will be used.', QUEST_INPUT_PATH)
  .showHelpAfterError()
  .action(async (options) => {
    const fishes = parse_from_args(options).split(',').map((v) => Number(v))

    console.log('input:', fishes)

    const result1 = await Latternfish.modeling({
      fishes,
      dayToSpawn: DAY_TO_SPAWN,
      initDayToSpawn: INIT_DAY_TO_SPAWN,
      daySimulation: SIMULATION_DAY_1
    })

    console.log('Part I result is:', result1)

    const result2 = Latternfish.modeling({
      fishes,
      dayToSpawn: DAY_TO_SPAWN,
      initDayToSpawn: INIT_DAY_TO_SPAWN,
      daySimulation: SIMULATION_DAY_2
    })
    console.log('Part II result is:', result2)
  })

function parse_from_args(options: any): string {
  if (options.input && options.file !== QUEST_INPUT_PATH) {
    // User has provided both --input and --file params
    console.log("Cannot specified both `--input` and `--file` arguments.")
    exit(1)
  }

  if (options.input) return options.input as string

  return readInput(options.file, { type: 'string' })[0] as string
}

export { command as default }

