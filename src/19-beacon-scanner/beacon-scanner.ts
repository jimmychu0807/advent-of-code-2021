import Debug from "debug";

// local import
import { CoordinateXYZ } from "../utils/index.js";

const EQL_THRESHOLD = 0.005;
const OVERLAP_PTS_THRESHOLD = 12;

// prettier-ignore
const ROTATION_MATRICES = [
  [[1,0,0],[0,1,0],[0,0,1]], [[0,1,0],[0,0,1],[1,0,0]], [[0,0,1],[1,0,0],[0,1,0]],
  [[1,0,0],[0,0,1],[0,-1,0]], [[0,1,0],[1,0,0],[0,0,-1]], [[0,0,1],[0,1,0],[-1,0,0]],
  [[-1,0,0],[0,0,1],[0,1,0]], [[0,-1,0],[1,0,0],[0,0,1]], [[0,0,-1],[0,1,0],[1,0,0]],
  [[1,0,0],[0,0,-1],[0,1,0]], [[0,1,0],[-1,0,0],[0,0,1]], [[0,0,1],[0,-1,0],[1,0,0]],
  [[-1,0,0],[0,1,0],[0,0,-1]], [[0,-1,0],[0,0,1],[-1,0,0]], [[0,0,-1],[1,0,0],[0,-1,0]],
  [[1,0,0],[0,-1,0],[0,0,-1]], [[0,1,0],[0,0,-1],[-1,0,0]], [[0,0,1],[-1,0,0],[0,-1,0]],
  [[-1,0,0],[0,-1,0],[0,0,1]], [[0,-1,0],[0,0,-1],[1,0,0]], [[0,0,-1],[-1,0,0],[0,1,0]],
  [[-1,0,0],[0,0,-1],[0,-1,0]], [[0,-1,0],[-1,0,0],[0,0,-1]], [[0,0,-1],[0,-1,0],[-1,0,0]],
];

const log = Debug("beacon-scanner");

function convertInputToCoordinateXYZ(input: string[]): CoordinateXYZ[][] {
  return input
    .join("")
    .replaceAll(/---.*---\n/g, "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.split("\n").map((ln) => CoordinateXYZ.fromStr(ln)));
}

function isNumEql(num1: number, num2: number): boolean {
  return Math.abs(num1 - num2) < EQL_THRESHOLD;
}

class BeaconScanner {
  public static getPairDistance(set: CoordinateXYZ[]): number[][] {
    const setLen = set.length;
    const dists: number[][] = new Array(setLen).fill(0).map(() => new Array(setLen).fill(-1));

    for (let rIdx = 0; rIdx < setLen - 1; rIdx++) {
      for (let cIdx = rIdx + 1; cIdx < setLen; cIdx++) {
        dists[rIdx]![cIdx] = set[rIdx]!.distTo(set[cIdx]!);
      }
    }
    return dists;
  }

  // It is actually num possibly overlapped
  public static numDistOverlapped(set1: CoordinateXYZ[], set2: CoordinateXYZ[]): number {
    const set1Dists = BeaconScanner.getPairDistance(set1);
    const set2Dists = BeaconScanner.getPairDistance(set2);

    const set1DistArr = set1Dists.reduce((memo, row) => memo.concat(row).filter((val) => val > 0));
    const set2DistArr = set2Dists.reduce((memo, row) => memo.concat(row).filter((val) => val > 0));

    let numOverlapped = 0;
    set1DistArr.forEach((dist) => {
      const targetIdx = set2DistArr.findIndex((set2Dist) => isNumEql(set2Dist, dist));
      if (targetIdx >= 0) {
        numOverlapped += 1;
        set2DistArr.splice(targetIdx, 1);
      }
    });

    return numOverlapped;
  }

  public static hasOverlappingPts(
    set1: CoordinateXYZ[],
    set2: CoordinateXYZ[],
    numOverlapped: number,
  ): boolean {
    return this.numDistOverlapped(set1, set2) >= (numOverlapped * (numOverlapped - 1)) / 2;
  }

  public static pickTwoPairSameDistPts(
    set1: CoordinateXYZ[],
    set2: CoordinateXYZ[],
  ): [[number, number], [number, number]] | undefined {
    const set1Dists = BeaconScanner.getPairDistance(set1);
    const set2Dists = BeaconScanner.getPairDistance(set2);

    const set1Len = set1Dists.length;
    const set2Len = set2Dists.length;
    for (let set1rIdx = 0; set1rIdx < set1Len - 1; set1rIdx++) {
      for (let set1cIdx = 1; set1cIdx < set1Len; set1cIdx++) {
        for (let set2rIdx = 0; set2rIdx < set2Len - 1; set2rIdx++) {
          for (let set2cIdx = 1; set2cIdx < set2Len; set2cIdx++) {
            if (isNumEql(set1Dists[set1rIdx]![set1cIdx]!, set2Dists[set2rIdx]![set2cIdx]!))
              return [
                [set1rIdx, set1cIdx],
                [set2rIdx, set2cIdx],
              ];
          }
        }
      }
    }
    return undefined;
  }

  public static rotateForEqlOrientation(
    set1Pair: [CoordinateXYZ, CoordinateXYZ],
    set2Pair: [CoordinateXYZ, CoordinateXYZ],
  ): number | undefined {
    const set1PairDiffs = [
      new CoordinateXYZ(
        set1Pair[0].x - set1Pair[1].x,
        set1Pair[0].y - set1Pair[1].y,
        set1Pair[0].z - set1Pair[1].z,
      ),
      new CoordinateXYZ(
        set1Pair[1].x - set1Pair[0].x,
        set1Pair[1].y - set1Pair[0].y,
        set1Pair[1].z - set1Pair[0].z,
      ),
    ];

    for (let rIdx = 0; rIdx < ROTATION_MATRICES.length; rIdx++) {
      const rotatedPairs = set2Pair.map((pt) => this.rotateOrientation(pt, rIdx)) as [
        CoordinateXYZ,
        CoordinateXYZ,
      ];
      const set2PairDiff = new CoordinateXYZ(
        rotatedPairs[0].x - rotatedPairs[1].x,
        rotatedPairs[0].y - rotatedPairs[1].y,
        rotatedPairs[0].z - rotatedPairs[1].z,
      );
      if (set1PairDiffs.some((set1PairDiff) => set1PairDiff.eql(set2PairDiff))) return rIdx;
    }
    return undefined;
  }

  public static rotateOrientation(pt: CoordinateXYZ, rIdx: number): CoordinateXYZ {
    const matrix = ROTATION_MATRICES[rIdx]!;
    const x = matrix[0]![0]! * pt.x + matrix[0]![1]! * pt.y + matrix[0]![2]! * pt.z;
    const y = matrix[1]![0]! * pt.x + matrix[1]![1]! * pt.y + matrix[1]![2]! * pt.z;
    const z = matrix[2]![0]! * pt.x + matrix[2]![1]! * pt.y + matrix[2]![2]! * pt.z;
    return new CoordinateXYZ(x, y, z);
  }

  public static solve(
    input: string[] | CoordinateXYZ[][],
  ): [CoordinateXYZ[], (CoordinateXYZ | undefined)[]] {
    if (input.length === 0) return [[], []];

    const scannerReports =
      typeof input[0] === "string"
        ? convertInputToCoordinateXYZ(input as string[])
        : (input as CoordinateXYZ[][]);

    // Using the first report as the reference frame
    const knownPts = [...scannerReports[0]!];
    const knownScanners: (CoordinateXYZ | undefined)[] = new Array(scannerReports.length).fill(
      undefined,
    );
    knownScanners[0]! = new CoordinateXYZ(0, 0, 0);

    let scannerIdx = 1;
    while (knownScanners.some((coord) => coord === undefined)) {
      // comparing scanners[scannerIdx] with current coordinate
      const scannerReport = scannerReports[scannerIdx]!;
      if (this.hasOverlappingPts(knownPts, scannerReport, OVERLAP_PTS_THRESHOLD)) {
        // pick two points from the scanner report that has the same distance
        const twoPairs = this.pickTwoPairSameDistPts(knownPts, scannerReport)!;
        const set1Pair = twoPairs[0].map((idx) => knownPts[idx]!) as [CoordinateXYZ, CoordinateXYZ];
        const set2Pair = twoPairs[1].map((idx) => scannerReport[idx]!) as [
          CoordinateXYZ,
          CoordinateXYZ,
        ];
        const rotationIdx = this.rotateForEqlOrientation(set1Pair, set2Pair)!;

        log(`set1Pair:`, set1Pair);
        log(`set2Pair:`, set2Pair);
        log(`rotationIdx:`, rotationIdx);

        // Apply the rotational matrix to all points in `scannerReport`
        const rotatedScannerReport = scannerReport.map((pt) =>
          this.rotateOrientation(pt, rotationIdx),
        );

        let rotatedSet2Pairs = [
          rotatedScannerReport[twoPairs[1][0]]!,
          rotatedScannerReport[twoPairs[1][1]]!,
        ] as [CoordinateXYZ, CoordinateXYZ];

        // Get the right order for the `rotatedSet2Pairs`
        if (rotatedSet2Pairs[0].x - rotatedSet2Pairs[1].x !== set1Pair[0].x - set1Pair[1].x) {
          // reverse the order of rotatedSet2Pairs
          rotatedSet2Pairs = [rotatedSet2Pairs[1], rotatedSet2Pairs[0]];
        }

        // by here we have identified the two points that should be overlapping to each others:
        //   (set1Pair[0], rotatedSet2Pairs[0]), and (set1Pair[1], rotatedSet2Pairs[1])
        const scannerLoc = new CoordinateXYZ(
          set1Pair[0].x - rotatedSet2Pairs[0].x,
          set1Pair[0].y - rotatedSet2Pairs[0].y,
          set1Pair[0].z - rotatedSet2Pairs[0].z,
        );

        log(`scanner ${scannerIdx} coord:`, scannerLoc);

        // Add a check here
        if (!rotatedSet2Pairs[1].offset(scannerLoc).eql(set1Pair[1])) {
          throw new Error("Point offsetting between set1Pair and set2Pair are not consistent");
        }

        knownScanners[scannerIdx] = scannerLoc;
        const offsetScannerReport = rotatedScannerReport.map((pt) => pt.offset(scannerLoc));
        offsetScannerReport.forEach((pt) => {
          if (!knownPts.some((knownPt) => pt.eql(knownPt))) knownPts.push(pt);
        });
      }

      scannerIdx += 1;
      if (scannerIdx >= scannerReports.length) scannerIdx = 1;
    }

    return [knownPts, knownScanners];
  }
}

export { BeaconScanner as default, convertInputToCoordinateXYZ, isNumEql, ROTATION_MATRICES };
