// local import
import { CoordinateXYZ } from "../utils/index.js";

const EQL_THRESHOLD = 0.005;

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

  public static solve(input: string[][]): number {
    // convert to the Coordinate
    const scannerReports = input.map((oneScanner) =>
      oneScanner.map((beacon) => {
        const [x, y, z] = beacon.split(",");
        return new CoordinateXYZ(Number(x!), Number(y!), Number(z!));
      }),
    );

    scannerReports;
    return 0;
  }
}

export { BeaconScanner as default, convertInputToCoordinateXYZ, isNumEql };
