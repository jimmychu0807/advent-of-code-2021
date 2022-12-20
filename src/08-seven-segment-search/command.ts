import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import SevenSegmentSearch from "./seven-segment-search.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("seven-segment-search")
  .description("Day 08 - Seven Segment Search")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);

    const cnt = SevenSegmentSearch.cntOutputUniqueValue(input);
    console.log(`Part I - times that 1, 4, 7, 8 appear: ${cnt}`);

    const sum = SevenSegmentSearch.getSumFromMultilineInput(input);
    console.log(`Part II - sum of the input digits: ${sum}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
