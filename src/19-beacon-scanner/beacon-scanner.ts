import Debug from "debug";

// local import
import { CoordinateXYZ } from "../utils/index.js";

interface TwoPairIndices {
  refIds: [number, number];
  targetIds: [number, number];
}

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
  ): TwoPairIndices | undefined {
    const set1Dists = BeaconScanner.getPairDistance(set1);
    const set2Dists = BeaconScanner.getPairDistance(set2);

    const set1Len = set1Dists.length;
    const set2Len = set2Dists.length;
    for (let set1rIdx = 0; set1rIdx < set1Len - 1; set1rIdx++) {
      for (let set1cIdx = set1rIdx + 1; set1cIdx < set1Len; set1cIdx++) {
        for (let set2rIdx = 0; set2rIdx < set2Len - 1; set2rIdx++) {
          for (let set2cIdx = set2rIdx + 1; set2cIdx < set2Len; set2cIdx++) {
            if (isNumEql(set1Dists[set1rIdx]![set1cIdx]!, set2Dists[set2rIdx]![set2cIdx]!))
              return {
                refIds: [set1rIdx, set1cIdx],
                targetIds: [set2rIdx, set2cIdx],
              };
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
    const rotatedOffsetReports: (CoordinateXYZ[] | undefined)[] = new Array(
      scannerReports.length,
    ).fill(undefined);
    rotatedOffsetReports[0] = [...scannerReports[0]!];

    const scannerLocs: (CoordinateXYZ | undefined)[] = new Array(scannerReports.length).fill(
      undefined,
    );
    scannerLocs[0]! = new CoordinateXYZ(0, 0, 0);

    while (rotatedOffsetReports.some((report) => report === undefined)) {
      for (let scannerIdx = 1; scannerIdx < scannerReports.length; scannerIdx++) {
        for (let refIdx = 0; refIdx < rotatedOffsetReports.length; refIdx++) {
          if (rotatedOffsetReports[refIdx] === undefined) continue;

          const refReport = rotatedOffsetReports[refIdx]!;
          // comparing scanners[scannerIdx] with refReport
          const newReport = scannerReports[scannerIdx]!;

          if (this.hasOverlappingPts(refReport, newReport, OVERLAP_PTS_THRESHOLD)) {
            // pick two points from the scanner report that has the same distance
            const { refIds, targetIds } = this.pickTwoPairSameDistPts(refReport, newReport)!;
            const refPair = refIds.map((idx) => refReport[idx]!) as [CoordinateXYZ, CoordinateXYZ];
            const newPair = targetIds.map((idx) => newReport[idx]!) as [
              CoordinateXYZ,
              CoordinateXYZ,
            ];
            const rotationIdx = this.rotateForEqlOrientation(refPair, newPair)!;

            // Apply the rotational matrix to all points in `newReport`
            const rotatedReport = newReport.map((pt) => this.rotateOrientation(pt, rotationIdx));

            let rotatedPair = [rotatedReport[targetIds[0]]!, rotatedReport[targetIds[1]]!] as [
              CoordinateXYZ,
              CoordinateXYZ,
            ];

            // Get the right order for the `rotatedPair`
            if (rotatedPair[0].x - rotatedPair[1].x !== refPair[0].x - refPair[1].x) {
              // reverse the order of rotatedPair
              rotatedPair = [rotatedPair[1], rotatedPair[0]];
            }

            // by here we have identified the two points that should be overlapping to each others:
            //   (refPair[0], rotatedPair[0]), and (refPair[1], rotatedPair[1])
            const scannerLoc = new CoordinateXYZ(
              refPair[0].x - rotatedPair[0].x,
              refPair[0].y - rotatedPair[0].y,
              refPair[0].z - rotatedPair[0].z,
            );

            log(`scannerIdx:`, scannerIdx);
            log(`refIdx:`, refIdx);
            log(`refPair:`, refPair);
            log(`newPair:`, newPair);
            log(`rotationIdx:`, rotationIdx);
            log(`rotatedPair:`, rotatedPair);
            log(`scanner coord:`, scannerLoc, "\n\n");

            // Add a check here
            if (!rotatedPair[1].offset(scannerLoc).eql(refPair[1])) {
              throw new Error("Point offsetting between refPair and newPair are not consistent");
            }

            scannerLocs[scannerIdx] = scannerLoc;
            rotatedOffsetReports[scannerIdx] = rotatedReport.map((pt) => pt.offset(scannerLoc));

            break;
          }
        }
      }
    }

    // Consolidate all rotatedOffsetReports points to knownPts
    const knownPts: CoordinateXYZ[] = [];
    rotatedOffsetReports.forEach((report) => {
      report!.forEach((pt) => {
        if (!knownPts.some((knownPt) => knownPt.eql(pt))) knownPts.push(pt);
      });
    });
    // sort all points
    knownPts.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y !== b.y ? a.y - b.y : a.z - b.z);

    return [knownPts, scannerLocs];
  }
}

export { BeaconScanner as default, convertInputToCoordinateXYZ, isNumEql, ROTATION_MATRICES };
