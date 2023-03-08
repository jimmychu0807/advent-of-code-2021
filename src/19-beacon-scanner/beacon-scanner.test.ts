import { expect } from "chai";
import { CoordinateXYZ } from "../utils/index.js";
import BeaconScanner, { convertInputToCoordinateXYZ } from "./beacon-scanner.js";

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

    it("BeaconScanner.getMinDistBySwitching() works", () => {
      const { input } = TEST_CASE1;
      const scanners = convertInputToCoordinateXYZ(input);
      const res = BeaconScanner.getMinDistBySwitching(scanners[0]!, scanners[1]!);
      console.log(res);
    });
  });
});
