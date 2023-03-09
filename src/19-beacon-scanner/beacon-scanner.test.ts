import { expect } from "chai";
import { CoordinateXYZ } from "../utils/index.js";
import BeaconScanner, { convertInputToCoordinateXYZ, isNumEql } from "./beacon-scanner.js";

//prettier-ignore
const TEST_CASE1 = {
  input: [
`--- scanner 0 ---
0,2,0
4,1,0
3,3,0

--- scanner 1 ---
-1,-1,0
-5,0,0
-2,1,0`
  ],
  expResMinDistSwitching: {
    dist: 16.16,
    set1OrSet2: 2,
    coord: [
      "-5,0",
      "-1,-1",
      "-2,1",
    ],
  }
};

describe("Day 19 - Beacon Scanner", () => {
  describe("Part I", () => {
    it("convertInputToCoordinateXYZ() works", () => {
      const { input } = TEST_CASE1;
      expect(convertInputToCoordinateXYZ(input)).to.eql([
        [
          CoordinateXYZ.fromStr("0,2,0"),
          CoordinateXYZ.fromStr("4,1,0"),
          CoordinateXYZ.fromStr("3,3,0"),
        ],
        [
          CoordinateXYZ.fromStr("-1,-1,0"),
          CoordinateXYZ.fromStr("-5,0,0"),
          CoordinateXYZ.fromStr("-2,1,0"),
        ],
      ]);
    });

    it("BeaconScanner.getPairDistance() works", () => {
      const { input } = TEST_CASE1;
      const expectedDist = [
        [-1, 4.123, 3.162],
        [-1, -1, 2.236],
        [-1, -1, -1],
      ];
      const scanners = convertInputToCoordinateXYZ(input);
      const dist = BeaconScanner.getPairDistance(scanners[0]!);
      const rowLen = dist.length;
      const colLen = dist[0]!.length;
      for (let rIdx = 0; rIdx < rowLen; rIdx++) {
        for (let cIdx = 0; cIdx < colLen; cIdx++) {
          expect(isNumEql(dist[rIdx]![cIdx]!, expectedDist[rIdx]![cIdx]!)).to.true;
        }
      }
    });

    it("BeaconScanner.numDistOverlapped() works", () => {
      const { input } = TEST_CASE1;
      const scanners = convertInputToCoordinateXYZ(input);
      expect(BeaconScanner.numDistOverlapped(scanners[0]!, scanners[1]!)).to.eq(3);
    });
  });
});
