import { Command } from 'commander'
import { command as SonarSweepCommand } from '01-sonar-sweep'
import { command as DiveCommand } from '02-dive'
import { command as BinaryDiagnosticCommand } from '03-binary-diagnostic'
import { command as GiantSquidCommand } from '04-giant-squid'
import { command as HydrothermalVentureCommand } from '05-hydrothermal-venture'
import { command as LatternfishCommand } from '06-latternfish'
import { command as TrecheryOfWhalesCommand } from '07-trechery-of-whales'

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
  .addCommand(HydrothermalVentureCommand)
  .addCommand(LatternfishCommand)
  .addCommand(TrecheryOfWhalesCommand)

program.parse()
