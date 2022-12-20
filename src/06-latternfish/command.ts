import { Command, Option } from "commander";
import { exit } from "process";

// local import
import { readInput } from "../utils/index.js";
import { Latternfish } from "./latternfish.js";

interface CommandOptions {
  input: string | undefined;
  file: string | undefined;
  defaultQuestData: boolean;
}

const DAY_TO_SPAWN = 6;
const INIT_DAY_TO_SPAWN = 8;
const SIMULATION_DAY_1 = 80;
const SIMULATION_DAY_2 = 256;
const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("latternfish")
  .description("Day 06 - Latternfish")
  .addOption(
    new Option("-i, --input <string>", "comma separated value of input (e.g. 1,2,3)").conflicts([
      "file",
      "defaultQuestData",
    ]),
  )
  .addOption(
    new Option("-f, --file <inputPath>", "path to input data").conflicts([
      "input",
      "defaultQuestData",
    ]),
  )
  .addOption(
    new Option("-d, --defaultQuestData", "using default quest data")
      .default(false)
      .conflicts(["input", "file"]),
  )
  .showHelpAfterError()
  .action(async (options: CommandOptions) => {
    const fishes = parseArgs(options)
      .split(",")
      .map((v) => Number(v.trim()));

    console.log("input:", fishes);

    const result1 = await Latternfish.modeling({
      fishes,
      dayToSpawn: DAY_TO_SPAWN,
      initDayToSpawn: INIT_DAY_TO_SPAWN,
      daySimulation: SIMULATION_DAY_1,
    });

    console.log("Part I result is:", result1);

    const result2 = Latternfish.modeling({
      fishes,
      dayToSpawn: DAY_TO_SPAWN,
      initDayToSpawn: INIT_DAY_TO_SPAWN,
      daySimulation: SIMULATION_DAY_2,
    });
    console.log("Part II result is:", result2);
  });

function parseArgs(options: CommandOptions): string {
  if (!options.input && !options.file && !options.defaultQuestData) {
    console.log("Please specify one argument from below.");
    command.help();
    exit(1);
  }

  if (options.input) return options.input as string;
  return readInput(options.file || QUEST_INPUT_URL, { type: "string" })[0] as string;
}

export { command as default };
