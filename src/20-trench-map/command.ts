import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import TrenchMap, { countBits } from "./trench-map.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("trench-map").description("Day 20 - Trench Map").showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const algoStr = input[0] as string;
    const inputMap = input.slice(2);
    const outMap = TrenchMap.simulate(algoStr, inputMap, 2);

    console.log(`Part I result: ${countBits(outMap)}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
