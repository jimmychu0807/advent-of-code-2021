import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import Snailfish from "./snailfish.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("snailfish").description("Day 18 - Snailfish").showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const sumNode = input.slice(1).reduce((node, ln) => node.add(ln), Snailfish.parse(input[0]!));
    console.log(`Part I result: ${sumNode.magnitude()}`);

    console.log(`Part II result: ${Snailfish.findBiggestSum(input)}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
