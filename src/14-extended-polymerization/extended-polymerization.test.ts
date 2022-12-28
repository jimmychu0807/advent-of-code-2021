import { expect } from "chai";

import ExtendedPolymerization, { freqMaxMinDiff } from "./extended-polymerization.js";

const SMALL_SAMPLE = {
  initPolymer: "NNCB",
  // prettier-ignore
  rules: [
    "CH -> B",
    "HH -> N",
    "CB -> H",
    "NH -> C",
    "HB -> C",
    "HC -> B",
    "HN -> C",
    "NN -> C",
    "BH -> H",
    "NC -> B",
    "NB -> B",
    "BN -> B",
    "BB -> N",
    "BC -> B",
    "CC -> N",
    "CN -> C",
  ],
  // prettier-ignore
  resPolymer: [
    "NCNBCHB",
    "NBCCNBBBCBHCB",
    "NBBBCNCCNBBNBNBBCHBHHBCHB",
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB",
  ],
  step10: {
    len: 3073,
    freqMap: {
      B: 1749,
      C: 298,
      H: 161,
      N: 865,
    },
    freqMaxMinDiff: 1588,
  },
};

describe("Day 14 - Extended Polymerization", () => {
  describe("Part I", () => {
    it("works for the first 4 steps", () => {
      const { initPolymer, rules, resPolymer } = SMALL_SAMPLE;

      Array(4)
        .fill(0)
        .map((_, idx) => idx + 1)
        .forEach((step) => {
          const res = ExtendedPolymerization.extendPolymer(initPolymer, rules, step);
          expect(res).to.eql(resPolymer[step - 1], `step ${step} result doesn't match`);
        });
    });

    it("works for step10 for SMALL_SAMPLE", () => {
      const { initPolymer, rules, step10 } = SMALL_SAMPLE;

      const polymer = ExtendedPolymerization.extendPolymer(initPolymer, rules, 10);
      expect(polymer.length).to.eq(step10.len);

      const freqMap = ExtendedPolymerization.getFreqMap(polymer);
      Object.entries(step10.freqMap).forEach(([k, v]) => {
        expect(freqMap.get(k)).to.eq(
          v,
          `key ${k} not match, expect ${v}, but get ${freqMap.get(k)}`,
        );
      });

      // Check freqMaxMinDiff
      expect(freqMaxMinDiff(freqMap)).to.eq(step10.freqMaxMinDiff);
    });
  });
});
