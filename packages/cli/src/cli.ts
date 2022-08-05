import { Command } from 'commander'
import { SonarSweepCommand } from '@aoc-2021/sonar-sweep'
import { DiveCommand } from '@aoc-2021/dive'
import { BinaryDiagnosticCommand } from '@aoc-2021/binary-diagnostic'
import GiantSquid from '@aoc-2021/giant-squid'

// Read the package.json info
const name = process.env['npm_package_name'] ?? ''
const description = process.env['npm_package_description'] ?? ''
const version = process.env['npm_package_version'] ?? ''

const program = new Command()
  .name(name)
  .description(description)
  .version(version)
  .showHelpAfterError()

program
  .addCommand(SonarSweepCommand)
  .addCommand(DiveCommand)
  .addCommand(BinaryDiagnosticCommand)

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
