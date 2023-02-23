import { Command } from "commander";
import { exit } from "process";

// local import
import Amphipod, { InitConfig } from "./amphipod.js";

const initConfig1: InitConfig = {
  roomCapacity: 2,
  roomLoc: [2, 4, 6, 8],
  roomContent: [
    ["A", "D"],
    ["C", "D"],
    ["B", "A"],
    ["B", "C"],
  ],
  cost: {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
  },
  corridorLen: 11,
}

// const InitConfig2: InitConfig = {

// }

const command = new Command("amphipod")
  .description("Day 23 - Amphipod")
  .showHelpAfterError();

command.action(() => {
  try {
    const sol1 = Amphipod.solve(initConfig1);
    console.log(`solution of part I: ${sol1!.totalCost}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
