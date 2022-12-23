import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import PassagePathing from "./passage-pathing.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("passage-pathing")
  .description("Day 12 - Passage Pathing")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const part1Res = PassagePathing.searchPaths(input);
    console.log(`Part I result: ${part1Res.length}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
