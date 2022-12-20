import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import SyntaxScoring from "./syntax-scoring.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("syntax-scoring")
  .description("Day 10 - Syntax Scoring")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const part1Res = SyntaxScoring.totalSyntaxErrorScore(input);
    console.log(`Part I result: ${part1Res}`);

    const part2Res = SyntaxScoring.middleIncompleteScore(input);
    console.log(`Part II result: ${part2Res}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
