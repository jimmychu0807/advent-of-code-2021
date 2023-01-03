import { expect } from "chai";

import Chiton from "./chiton.js";

const TEST1_SAMPLE = {
  // prettier-ignore
  input: [
    "639",
    "521",
    "581",
  ],
  topLeftBottomRightMinRisk: 7,
};

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
    it("works on test samples", () => {
      [TEST1_SAMPLE, SMALL_SAMPLE].forEach(({ input, topLeftBottomRightMinRisk }) => {
        const minRisk = Chiton.getMinRisk(input);
        expect(minRisk).to.eql(topLeftBottomRightMinRisk);
      });
    });
  });
});
