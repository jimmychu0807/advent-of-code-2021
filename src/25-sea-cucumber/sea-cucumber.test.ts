import { expect } from "chai";
import SeaCucumber from "./sea-cucumber.js";

const TEST_CASE1 = {
  input: [
    "v...>>.vv>",
    ".vv>>.vv..",
    ">>.>v>...v",
    ">>v>>.>.v.",
    "v>v.vv.v..",
    ">.>>..v...",
    ".vv..>.>v.",
    "v.v..>>v.v",
    "....v..v.>",
  ],
  expectedAns: 58,
};

describe("Day 25 - Sea Cucumber", () => {
  describe("Part I", () => {
    it("TEST_CASE1 works", () => {
      const { input, expectedAns } = TEST_CASE1;
      const res = SeaCucumber.stopIteration(input);
      expect(res).to.eq(expectedAns);
    });
  });
});
