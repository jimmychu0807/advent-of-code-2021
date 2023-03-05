import { Command, Option } from "commander";

// local import
import { readInput } from "../utils/index.js";

interface DCOpts {
  default: boolean;
  file: boolean;
  input: boolean;
}

interface CommandOptionsDF {
  default: boolean;
  file: string;
}

interface CommandOptionsDFI extends CommandOptionsDF {
  input: string;
}

function decorateCommand(command: Command, opts: DCOpts): void {
  if (opts.default) {
    command.addOption(
      new Option("-d, --default", "using default quest data")
        .default(true)
        .conflicts(["file", "input"]),
    );
  }

  if (opts.file) {
    command.addOption(
      new Option("-f, --file <inputPath>", "path to input data").conflicts([
        "input",
        "defaultQuestData",
      ]),
    );
  }

  if (opts.input) {
    command.addOption(
      new Option("-i, --input <inputString>", "input string").conflicts([
        "file",
        "defaultQuestData",
      ]),
    );
  }
}

function parseArgsDF(opts: CommandOptionsDF, defaultUrl: URL): string[] {
  if (!opts.file && !opts.default) throw new Error("Please specify one argument from below.");
  return readInput(opts.file || defaultUrl, { type: "string" }) as string[];
}

export { CommandOptionsDF, CommandOptionsDFI, decorateCommand, parseArgsDF };
