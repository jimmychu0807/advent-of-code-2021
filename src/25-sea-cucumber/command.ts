import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import SeaCucumber from "./sea-cucumber.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("sea-cucumber")
  .description("Day 25 - Sea Cucumber")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const result1 = SeaCucumber.stopIteration(input);
    console.log(`Part I result: ${result1}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
