import { expect } from "chai";

import TransparentOrigami, { sumPaperDots } from "./transparent-origami.js";

const SMALL_SAMPLE = {
  // prettier-ignore
  paperSetting: [
    "6,10",
    "0,14",
    "9,10",
    "0,3",
    "10,4",
    "4,11",
    "6,0",
    "6,12",
    "4,1",
    "0,13",
    "10,12",
    "3,4",
    "3,0",
    "8,4",
    "1,10",
    "2,14",
    "8,10",
    "9,0",
  ],
  // prettier-ignore
  foldInstructions: [
    "fold along y=7",
    "fold along x=5",
  ],
  numDots: [18, 17, 16],
};

describe("Day 13 - Transparent Origami", () => {
  describe("Part I", () => {
    it("works for initial paper config", () => {
      const { paperSetting, numDots } = SMALL_SAMPLE;
      const paper = TransparentOrigami.initPaper(paperSetting);
      expect(sumPaperDots(paper)).to.eq(numDots[0]);
    });

    it("works for the first fold", () => {
      const { paperSetting, foldInstructions, numDots } = SMALL_SAMPLE;
      const paper = TransparentOrigami.initPaper(paperSetting);
      TransparentOrigami.parseFoldIns(paper, foldInstructions[0]!);
      expect(sumPaperDots(paper)).to.eq(numDots[1]);
    });
  });
});
