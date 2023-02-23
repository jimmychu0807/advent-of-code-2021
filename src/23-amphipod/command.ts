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
};

const initConfig2: InitConfig = {
  roomCapacity: 4,
  roomLoc: [2, 4, 6, 8],
  roomContent: [
    ["A", "D", "D", "D"],
    ["C", "C", "B", "D"],
    ["B", "B", "A", "A"],
    ["B", "A", "C", "C"],
  ],
  cost: {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
  },
  corridorLen: 11,
};

const command = new Command("amphipod").description("Day 23 - Amphipod").showHelpAfterError();

command.action(() => {
  try {
    const sol1 = Amphipod.solve(initConfig1);
    console.log(`solution of part I: ${sol1!.totalCost}`);
    console.dir(sol1, { depth: null });

    const sol2 = Amphipod.solve(initConfig2);
    console.log(`solution of part II: ${sol2!.totalCost}`);
    console.dir(sol2, { depth: null });
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
