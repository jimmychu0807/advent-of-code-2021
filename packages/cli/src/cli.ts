import { Command } from 'commander'
import { SonarSweepCommand } from '@aoc-2021/sonar-sweep'
import { DiveCommand } from '@aoc-2021/dive'
import { BinaryDiagnosticCommand } from '@aoc-2021/binary-diagnostic'
import { GiantSquidCommand } from '@aoc-2021/giant-squid'

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
  .addCommand(GiantSquidCommand)

program.parse()
