import { expect } from "chai";

import TrickShot from "./trick-shot.js";
import { CoordinateRC, Rect } from "../utils/index.js";

const SAMPLE1 = {
  input: "target area: x=20..30, y=-10..-5",
  startPos: new CoordinateRC(10, 0),
  topLeft: new CoordinateRC(5, 20),
  bottomRight: new CoordinateRC(0, 30),
  bestDir: [55, new CoordinateRC(9, 6)],
  numDirs: 112,
  maxHeight: 45,
};

describe("Day 17 - Trick Shot", () => {
  describe("Part I", () => {
    it("swtichRefFrame() works", () => {
      const [startPos, targetArea] = TrickShot.switchRefFrame(SAMPLE1.input);
      expect(startPos).to.eql(SAMPLE1.startPos);

      const expectedTA = new Rect(SAMPLE1.topLeft, SAMPLE1.bottomRight);
      expect(targetArea).to.eql(expectedTA);
    });

    it("searchDirs() works", () => {
      const { input, bestDir } = SAMPLE1;
      const [startPos, targetArea] = TrickShot.switchRefFrame(input);
      const dirs = TrickShot.searchAllDirs(startPos, targetArea);
      expect(dirs).to.deep.include(bestDir);
    });

    it("getMaxHeight() works", () => {
      const { input, maxHeight } = SAMPLE1;
      expect(TrickShot.getMaxHeight(input)).eq(maxHeight);
    });
  });

  describe("Part II", () => {
    it("numDirs() works", () => {
      const { input, numDirs } = SAMPLE1;
      expect(TrickShot.numDirs(input)).eq(numDirs);
    });
  });
});
