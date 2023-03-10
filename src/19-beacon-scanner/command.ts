import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import BeaconScanner from "./beacon-scanner.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("beacon-scanner")
  .description("Day 19 - Beacon Scanner")
  .showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const [knownPts] = BeaconScanner.solve(input.join("\n"));
    console.log(`Part I result: ${knownPts.length}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
