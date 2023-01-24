import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import ReactorReboot from "./reactor-reboot.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("reactor-reboot")
  .description("Day 22 - Reactor Reboot")
  .showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const result1 = ReactorReboot.rebootInit(input);
    console.log(`Part I result: ${result1}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
