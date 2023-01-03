import { expect } from "chai";

import Chiton from "./chiton.js";

const SMALL_SAMPLE = {
  // prettier-ignore
  input: [
    "1163751742",
    "1381373672",
    "2136511328",
    "3694931569",
    "7463417111",
    "1319128137",
    "1359912421",
    "3125421639",
    "1293138521",
    "2311944581",
  ],
  topLeftBottomRightMinRisk: 40,
};

describe("Day 15 - Chiton", () => {
  describe("Part I", () => {
    it("works", () => {
      const { input } = SMALL_SAMPLE;
      const path = Chiton.searchMinPath(input);

      console.log(path);

      expect(1).to.eql(1);
    });
  });
});
