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
    it("extendPolymerStr() works for the first 4 steps", () => {
      const { initPolymer, rules, resPolymer } = SMALL_SAMPLE;

      Array(4)
        .fill(0)
        .map((_, idx) => idx + 1)
        .forEach((step) => {
          const res = ExtendedPolymerization.extendPolymerStr(initPolymer, rules, step);
          expect(res).to.eql(resPolymer[step - 1], `step ${step} result doesn't match`);
        });
    });

    it("extendPolymerStr() works for step10 for SMALL_SAMPLE", () => {
      const { initPolymer, rules, step10 } = SMALL_SAMPLE;

      const polymer = ExtendedPolymerization.extendPolymerStr(initPolymer, rules, 10);
      expect(polymer.length).to.eq(step10.len);

      const freqMap = ExtendedPolymerization.getFreqMapFromStr(polymer);
      Object.entries(step10.freqMap).forEach(([k, v]) => {
        expect(freqMap.get(k)).to.eq(
          v,
          `key ${k} values don't match, expect ${v} to equal ${freqMap.get(k)}`,
        );
      });

      // Check freqMaxMinDiff
      expect(freqMaxMinDiff(freqMap)).to.eq(step10.freqMaxMinDiff);
    });
  });

  describe("Part II", () => {
    it("extendPolymerMap() works for day 4 for SMALL_SAMPLE", () => {
      const { initPolymer, rules, resPolymer } = SMALL_SAMPLE;
      const polymerMap = ExtendedPolymerization.extendPolymerMap(initPolymer, rules, 4);
      const resPolymerMap = ExtendedPolymerization.toPolymerMap(resPolymer[3] as string);

      expect(polymerMap.size).to.eq(resPolymerMap.size);
      polymerMap.forEach((v, k) => {
        expect(v).to.eq(
          resPolymerMap.get(k),
          `key ${k} values don't match, expect ${v} to equal ${resPolymerMap.get(k)}`,
        );
      });
    });

    it("extendPolymerMap() works for day 10 for SMALL_SAMPLE", () => {
      const { initPolymer, rules, step10 } = SMALL_SAMPLE;
      const polymerMap = ExtendedPolymerization.extendPolymerMap(initPolymer, rules, 10);
      const freqMap = ExtendedPolymerization.getFreqMapFromMap(polymerMap, initPolymer);
      Object.entries(step10.freqMap).forEach(([k, v]) => {
        expect(freqMap.get(k)).to.eq(
          v,
          `key ${k} values don't match, expect ${v} to equal ${freqMap.get(k)}`,
        );
      });
    });
  });
});
