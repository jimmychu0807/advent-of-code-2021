import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import TrickShot from "./trick-shot.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("trick-shot").description("Day 17 - Trick Shot").showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL)[0]!;
    const maxHeight = TrickShot.getMaxHeight(input);
    console.log(`Part I result: ${maxHeight}`);

    const numDirs = TrickShot.numDirs(input);
    console.log(`Part II result: ${numDirs}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
