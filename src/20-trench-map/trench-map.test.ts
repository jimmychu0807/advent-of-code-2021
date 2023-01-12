import { expect } from "chai";
import TrenchMap, { countBits, getNumber, ALGO_LEN } from "./trench-map.js";

function getAlgoBitOffExcept(onbits: number[]): string {
  const res = new Array(ALGO_LEN).fill(".");
  onbits.forEach((bit) => {
    res[bit] = "#";
  });
  return res.join("");
}

// prettier-ignore
const TEST_CASE = {
  algo: "..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#",

  initMap: [
    "#..#.",
    "#....",
    "##..#",
    "..#..",
    "..###",
  ],

  resultMaps: [
    [
      ".##.##.",
      "#..#.#.",
      "##.#..#",
      "####..#",
      ".#..##.",
      "..##..#",
      "...#.#.",
    ],
    [
      ".......#.",
      ".#..#.#..",
      "#.#...###",
      "#...##.#.",
      "#.....#.#",
      ".#.#####.",
      "..#.#####",
      "...##.##.",
      "....###..",
    ],
  ],

  onBitCnt: 35,
};

describe("Day 20 - Trench Map", () => {
  describe("Part I", () => {
    it("getNumber() works", () => {
      const testCase1: [number[], number] = [[0, 0, 1, 0, 1], 5];
      const testCase2: [number[], number] = [[1, 0, 1, 0, 0, 0, 1, 1, 0], 326];

      [testCase1, testCase2].forEach((tc) => {
        const [input, res] = tc;
        expect(getNumber(input)).to.eq(res);
      });
    });

    it("TrenchMap.enlargeMap() works", () => {
      // prettier-ignore
      const newMap = TrenchMap.enlargeMap([[1,0],[0,1]], 1);
      // prettier-ignore
      expect(newMap).to.eql([
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,0,1,1],
        [1,1,0,1,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
      ]);
    });

    it("TrenchMap.getAlgoIndexMap() works", () => {
      const inputMap = [[1]];
      const edgeBit = 0;
      const expectedMap = [
        [1, 2, 4],
        [8, 16, 32],
        [64, 128, 256],
      ];

      const newMap = TrenchMap.getAlgoIndexMap(inputMap, edgeBit);
      expect(newMap).to.eql(expectedMap);
    });

    it("TrenchMap.simulate() works on TEST_CASE", () => {
      const { algo, initMap, resultMaps, onBitCnt } = TEST_CASE;
      const res1 = TrenchMap.simulate(algo, initMap, 1);
      expect(res1).to.eql(resultMaps[0]!);

      const res2 = TrenchMap.simulate(algo, initMap, 2);
      expect(res2).to.eql(resultMaps[1]!);

      expect(countBits(res2)).to.eq(onBitCnt);
    });

    it("TrenchMap.simulate() works on edge case", () => {
      // The tricky part is the algo 0th bit is ON. So the canvas background bit is flipping ON and OFF at the end of each simualation step.
      const algo = getAlgoBitOffExcept([0]);
      const initMap = ["#"];
      const expectedRes1 = ["...", "...", "..."];
      const expectedRes2 = [".....", ".....", "..#..", ".....", "....."];
      const expectedRes3 = [
        "#######",
        "#######",
        "##...##",
        "##...##",
        "##...##",
        "#######",
        "#######",
      ];

      const res1 = TrenchMap.simulate(algo, initMap, 1);
      expect(res1).to.eql(expectedRes1);

      const res2 = TrenchMap.simulate(algo, initMap, 2);
      expect(res2).to.eql(expectedRes2);

      const res3 = TrenchMap.simulate(algo, initMap, 3);
      expect(res3).to.eql(expectedRes3);
    });
  });
});
