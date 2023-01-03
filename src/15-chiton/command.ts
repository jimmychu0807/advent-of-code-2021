import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF, CoordinateRC } from "../utils/index.js";
import Chiton, { getRiskFromPath } from "./chiton.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("chiton").description("Day 15 - Chiton").showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const part1Path = Chiton.searchMinPath(input, new CoordinateRC(0, 0));
    const part1Risk = getRiskFromPath(part1Path);

    console.log("Part I path:", part1Path);
    console.log(`Part I result: ${part1Risk}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
