import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import TransparentOrigami, { sumPaperDots, printPaperDots } from "./transparent-origami.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("transparent-origami")
  .description("Day 13 - Transparent Origami")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);

    const paperIns = input.filter((ln) => !ln.startsWith("fold along") && ln.length > 0);
    const foldIns = input.filter((ln) => ln.startsWith("fold along") && ln.length > 0);

    const paper1 = TransparentOrigami.initPaper(paperIns);
    TransparentOrigami.parseFoldIns(paper1, foldIns[0]!);
    const part1Res = sumPaperDots(paper1);
    console.log(`Part I result: ${part1Res}`);

    const paper2 = TransparentOrigami.initPaper(paperIns);
    foldIns.forEach((ins) => {
      TransparentOrigami.parseFoldIns(paper2, ins);
    });
    console.log(`Part II result:\n${printPaperDots(paper2)}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
