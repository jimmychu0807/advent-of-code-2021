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
import { command as PassagePathingCommand } from "./12-passage-pathing/index.js";
import { command as TransparentOrigamiCommand } from "./13-transparent-origami/index.js";
import { command as ExtendedPolymerizationCommand } from "./14-extended-polymerization/index.js";
import { command as ChitonCommand } from "./15-chiton/index.js";
import { command as PacketDecoderCommand } from "./16-packet-decoder/index.js";
import { command as TrickShotCommand } from "./17-trick-shot/index.js";
import { command as SnailfishCommand } from "./18-snailfish/index.js";
import { command as TrenchMapCommand } from "./20-trench-map/index.js";

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
  .addCommand(DumboOctopusCommand)
  .addCommand(PassagePathingCommand)
  .addCommand(TransparentOrigamiCommand)
  .addCommand(ExtendedPolymerizationCommand)
  .addCommand(ChitonCommand)
  .addCommand(PacketDecoderCommand)
  .addCommand(TrickShotCommand)
  .addCommand(SnailfishCommand)
  .addCommand(TrenchMapCommand);

export { program as default };
