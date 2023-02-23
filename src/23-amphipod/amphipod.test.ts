import { expect } from "chai";
import Amphipod, { InitConfig } from "./amphipod.js";

const TEST_CASE1: InitConfig = {
  roomCapacity: 2,
  roomLoc: [2, 4, 6, 8],
  roomContent: [
    ["B", "A"],
    ["C", "D"],
    ["B", "C"],
    ["D", "A"],
  ],
  cost: {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
  },
  corridorLen: 11,
};

// const TEST_CASE1_ANS = 12521;

const TEST_CASE2: InitConfig = {
  roomCapacity: 2,
  roomLoc: [2, 4],
  roomContent: [
    ["A", "A"],
    ["B", "B"],
  ],
  cost: {
    A: 1,
    B: 10,
  },
  corridorLen: 11,
};

const TEST_CASE3: InitConfig = {
  roomCapacity: 2,
  roomLoc: [1, 3],
  roomContent: [
    ["B", "B"],
    ["A", "A"],
  ],
  cost: {
    A: 1,
    B: 10,
  },
  corridorLen: 5,
};

describe("Day 23 - Amphipod", () => {
  describe("Part I", () => {
    it("Amphipod.constructGameState() works", () => {
      const gameState = Amphipod.constructGameState(TEST_CASE1);
      expect(gameState).to.eql({
        rooms: [
          ["B", "A"],
          ["C", "D"],
          ["B", "C"],
          ["D", "A"],
        ],
        corridor: ["", "", "", "", "", "", "", "", "", "", ""],
        pcs: [
          { pc: "A", loc: { type: "r", at: [0, 1] } },
          { pc: "A", loc: { type: "r", at: [3, 1] } },
          { pc: "B", loc: { type: "r", at: [0, 0] } },
          { pc: "B", loc: { type: "r", at: [2, 0] } },
          { pc: "C", loc: { type: "r", at: [1, 0] } },
          { pc: "C", loc: { type: "r", at: [2, 1] } },
          { pc: "D", loc: { type: "r", at: [1, 1] } },
          { pc: "D", loc: { type: "r", at: [3, 0] } },
        ],
        path: { moves: [], totalCost: 0 },
      });
    });

    it("Amphipod.solve() works for already solved case", () => {
      const sol = Amphipod.solve(TEST_CASE2);
      expect(sol).to.eql({ moves: [], totalCost: 0 });
    });

    it("Amphipod.solve() works for simple case", () => {
      const sol = Amphipod.solve(TEST_CASE3);
      expect(sol!.totalCost).to.eq(114);
    });

    // it("Amphipod.solve() works for given test case", () => {
    //   const sol = Amphipod.solve(TEST_CASE1);
    //   expect(sol!.totalCost).to.eq(TEST_CASE1_ANS);
    // });
  });
});
