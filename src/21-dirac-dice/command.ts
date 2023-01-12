import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import { DiracDice } from "./dirac-dice.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("dirac-dice").description("Day 21 - Dirac Dice").showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const p1InitPos = Number(input[0]!.split(":")[1]!.trim());
    const p2InitPos = Number(input[1]!.split(":")[1]!.trim());
    const result1 = DiracDice.simulate(p1InitPos, p2InitPos);
    console.log(`Part I result: ${result1[1]}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
