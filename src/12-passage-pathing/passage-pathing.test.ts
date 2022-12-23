import { expect } from "chai";

import { isSetEq } from "../utils/index.js";
import PassagePathing from "./passage-pathing.js";

const SMALL_SAMPLE: {
  input: string[];
  caveMap: { [key: string]: string[] };
  paths1: string[];
  numPath1: number;
  numPath2: number;
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
  paths1: [
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
  numPath1: 10,
  numPath2: 36,
};

// prettier-ignore
const LARGE_SAMPLE = {
  input: [
    "fs-end",
    "he-DX",
    "fs-he",
    "start-DX",
    "pj-DX",
    "end-zg",
    "zg-sl",
    "zg-pj",
    "pj-he",
    "RW-he",
    "fs-DX",
    "pj-RW",
    "zg-RW",
    "start-pj",
    "he-WI",
    "zg-he",
    "pj-fs",
    "start-RW",
  ],
  numPath1: 226,
  numPath2: 3509
}

describe("Day 12 - Passage Pathing", () => {
  describe("Part I", () => {
    it("passage-pathing mapCave() works", () => {
      const { input, caveMap } = SMALL_SAMPLE;
      const res = PassagePathing.mapCave(input);

      // check caveMap is equivalent to res;
      const expectKeys = Object.keys(caveMap);
      const resKeys = Object.keys(res);

      expect(isSetEq(new Set(expectKeys), new Set(resKeys))).is.true;
      expectKeys.forEach((key) => {
        expect(isSetEq(new Set(caveMap[key]), new Set(res[key]))).is.true;
      });
    });

    it("passage-pathing searchPaths() without repeat works for SMALL_SAMPLE", () => {
      const { input, paths1, numPath1 } = SMALL_SAMPLE;
      const res = PassagePathing.searchPaths(input);

      expect(res.length).to.eq(numPath1);
      paths1.forEach((path) => expect(res).include(path));
    });

    it("passage-pathing searchPaths() without repeat works for LARGE_SAMPLE", () => {
      const { input, numPath1 } = LARGE_SAMPLE;
      const res = PassagePathing.searchPaths(input);

      expect(res.length).to.eq(numPath1);
    });
  });

  describe("Part II", () => {
    it("passage-pathing searchPaths() with repeat works for SMALL_SAMPLE", () => {
      const { input, numPath2 } = SMALL_SAMPLE;
      const res = PassagePathing.searchPaths(input, true);
      expect(res.length).to.eq(numPath2);
    });

    it("passage-pathing searchPaths() with repeat works for LARGE_SAMPLE", () => {
      const { input, numPath2 } = LARGE_SAMPLE;
      const res = PassagePathing.searchPaths(input, true);
      expect(res.length).to.eq(numPath2);
    });
  });
});
