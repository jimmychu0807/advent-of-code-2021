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

describe("Day 23 - Amphipod", () => {
  describe("Part I", () => {
    it("constructGameState() works", () => {
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
      });
    });
  });
});
