import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import ExtendedPolymerization, { freqMaxMinDiff } from "./extended-polymerization.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("extended-polymerization")
  .description("Day 14 - Extended Polymerization")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);

    const initPolymer = input[0] as string;
    const rules = input.filter((ln) => ln.indexOf("->") >= 0);

    const part1Polymer = ExtendedPolymerization.extendPolymerStr(initPolymer, rules, 10);
    const part1FreqMap = ExtendedPolymerization.getFreqMapFromStr(part1Polymer);
    const part1Res = freqMaxMinDiff(part1FreqMap);
    console.log(`Part I result: ${part1Res}`);

    const part2Polymer = ExtendedPolymerization.extendPolymerMap(initPolymer, rules, 40);
    const part2FreqMap = ExtendedPolymerization.getFreqMapFromMap(part2Polymer, initPolymer);
    const part2Res = freqMaxMinDiff(part2FreqMap);
    console.log(`Part II result: ${part2Res}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
