import { expect } from "chai";

import { isSetEq } from "../utils/index.js";
import PassagePathing from "./passage-pathing.js";

const SMALL_SAMPLE: {
  input: string[],
  caveMap: {[key: string]: string[]},
  paths: string[]
} = {
  input: ["start-A", "start-b", "A-c", "A-b", "b-d", "A-end", "b-end"],
  caveMap: {
    start: ["A", "b"],
    A: ["start", "b", "c", "end"],
    b: ["start", "A", "d", "end"],
    c: ["A"],
    d: ["b"],
    end: ["A", "b"],
  },
  paths: [
    "start,A,b,A,c,A,end",
    "start,A,b,A,end",
    "start,A,b,end",
    "start,A,c,A,b,A,end",
    "start,A,c,A,b,end",
    "start,A,c,A,end",
    "start,A,end",
    "start,b,A,c,A,end",
    "start,b,A,end",
    "start,b,end",
  ],
};

describe("Day 12 - Passage Pathing", () => {
  describe("Part I", () => {
    it("passage-pathing mapCave() works", () => {
      const { input, caveMap } = SMALL_SAMPLE;
      const res = PassagePathing.mapCave(input);

      // check caveMap is equivalent to res;
      const expectKeys = Object.keys(caveMap);
      const resKeys = Object.keys(res);

      expect(isSetEq(new Set(expectKeys), new Set(resKeys))).is.true;
      expectKeys.forEach(key => {
        expect(isSetEq(new Set(caveMap[key]), new Set(res[key]))).is.true;
      });
    });
  });

  describe("Part II", () => {
    it("pending test");
  });
});
