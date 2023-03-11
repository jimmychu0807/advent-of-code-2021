import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import ALU from "./alu.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("alu")
  .description("Day 24 - Arithmetic Logic Unit")
  .showHelpAfterError();
decorateCommand(command, { file: true, default: true, input: false });
command.action((options: CommandOptionsDF) => {
  // Break down a number to an array of digits
  const toInput = (val: number): number[] => {
    const res: number[] = [];
    while (val > 0) {
      const arrVal = val % 10;
      res.unshift(arrVal);
      val = Math.trunc(val / 10);
    }
    return res;
  };

  // This problem eventually is solved not by writing a program,
  // but by figuring out what the MONAD program does. Ref:
  //   1. https://www.reddit.com/r/adventofcode/comments/rom5l5/2021_day_24pen_paper_monad_deparsed/
  //   2. Over-engineering 1: https://www.reddit.com/r/adventofcode/comments/rnwz9p/2021_day_24_solving_the_alu_programmatically_with/
  //   3. Over-engineering 2: https://www.mattkeeter.com/blog/2021-12-27-brute/
  const inputs = [99429795993929, 18113181571611];

  try {
    const instructions = parseArgsDF(options, QUEST_INPUT_URL);
    const alu = new ALU();

    const [sol1, sol2] = inputs;

    let state = alu.parse(instructions, toInput(sol1!));
    console.log(`Part I result: ${sol1}, state:`, state);

    state = alu.parse(instructions, toInput(sol2!));
    console.log(`Part II result: ${sol2}, state:`, state);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
