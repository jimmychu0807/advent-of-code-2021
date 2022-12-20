import { Command } from "commander";
import { command as SonarSweepCommand } from "./01-sonar-sweep/index.js";
import { command as DiveCommand } from "./02-dive/index.js";
import { command as BinaryDiagnosticCommand } from "./03-binary-diagnostic/index.js";
import { command as GiantSquidCommand } from "./04-giant-squid/index.js";
import { command as HydrothermalVentureCommand } from "./05-hydrothermal-venture/index.js";
import { command as LatternfishCommand } from "./06-latternfish/index.js";
import { command as TrecheryOfWhalesCommand } from "./07-trechery-of-whales/index.js";
import { command as SevenSegmentSearchCommand } from "./08-seven-segment-search/index.js";
import { command as SmokeBasinCommand } from "./09-smoke-basin/index.js";
import { command as SyntaxScoringCommand } from "./10-syntax-scoring/index.js";
import { command as DumboOctopusCommand } from "./11-dumbo-octopus/index.js";

// Read the package.json info
const name = process.env["npm_package_name"] ?? "";
const description = process.env["npm_package_description"] ?? "";
const version = process.env["npm_package_version"] ?? "";

const program = new Command()
  .name(name)
  .description(description)
  .version(version)
  .showHelpAfterError();

program
  .addCommand(SonarSweepCommand)
  .addCommand(DiveCommand)
  .addCommand(BinaryDiagnosticCommand)
  .addCommand(GiantSquidCommand)
  .addCommand(HydrothermalVentureCommand)
  .addCommand(LatternfishCommand)
  .addCommand(TrecheryOfWhalesCommand)
  .addCommand(SevenSegmentSearchCommand)
  .addCommand(SmokeBasinCommand)
  .addCommand(SyntaxScoringCommand)
  .addCommand(DumboOctopusCommand);

export { program as default };
