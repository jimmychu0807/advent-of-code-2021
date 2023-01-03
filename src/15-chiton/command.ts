import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import Chiton from "./chiton.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("chiton").description("Day 15 - Chiton").showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const part1Risk = Chiton.getMinRisk(input);
    console.log(`Part I result: ${part1Risk}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
