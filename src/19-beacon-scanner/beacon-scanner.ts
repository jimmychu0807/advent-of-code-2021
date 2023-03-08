// local import
import { CoordinateXYZ } from "../utils/index.js";

type Set1OrSet2 = 1 | 2;

function convertInputToCoordinateXYZ(input: string[]): CoordinateXYZ[][] {
  return input
    .join("")
    .replaceAll(/---.*---\n/g, "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.split("\n").map((ln) => CoordinateXYZ.fromStr(ln)));
}

class BeaconScanner {
  public static getMinDistBySwitching(
    set1: CoordinateXYZ[],
    set2: CoordinateXYZ[],
  ): [number, Set1OrSet2, CoordinateXYZ[]] {
    // actually have to return the long set
    let shortSet = set1,
      longSet = [...set2];
    let set1Or2: Set1OrSet2 = 2;

    if (set1.length > set2.length) {
      set1Or2 = 1;
      shortSet = set2;
      longSet = [...set1];
    }

    let accDist = 0;
    let switchedSet: CoordinateXYZ[] = [];
    for (let sIdx = 0; sIdx < shortSet.length; sIdx++) {

      let minDist: number | undefined = undefined;
      let minlIdx: number = 0;

      // note: taking the minDist for each shortSet doesn't necessarily get the min dist when
      //   summed up together
      for (let lIdx = 0; lIdx < longSet.length; lIdx++) {
        const dist = shortSet[sIdx]!.distTo(longSet[lIdx]!);

        if (!minDist || minDist > dist) {
          minDist = dist;
          minlIdx = lIdx;
        }
      }
      accDist += minDist!;
      switchedSet.push(longSet[minlIdx]!);
      longSet.splice(minlIdx, 1);
    }

    // Copy the rest of the array to switchedSet
    switchedSet = switchedSet.concat(
      longSet.filter((pt) => switchedSet.some((switchedPt) => switchedPt.eql(pt))),
    );

    return [accDist, set1Or2, switchedSet];
  }

  public static shiftSetByCoordXYZ(set: CoordinateXYZ[], shiftBy: CoordinateXYZ): CoordinateXYZ[] {
    // NEXT: implement this
  }

  public static getMinDist(set1: CoordinateXYZ[], set2: CoordinateXYZ[]): number {
    // NEXT: implement this
  }

  public static getMinDistByShifting(
    set1: CoordinateXYZ[],
    set2: CoordinateXYZ[],
  ): [number, Set1OrSet2, CoordinateXYZ[]] {
    // TODO
    set1;
    set2;
    throw new Error("Not implemented yet");
    // return [0, 0, [new CoordinateXYZ(0, 0, 0)]];
  }

  public static getMinDistByRotating(
    set1: CoordinateXYZ[],
    set2: CoordinateXYZ[],
  ): [number, Set1OrSet2, CoordinateXYZ[]] {
    // TODO
    set1;
    set2;
    throw new Error("Not implemented yet");
    // return [0, 0, [new CoordinateXYZ(0, 0, 0)]];
  }

  public static numOverlapped(set1: CoordinateXYZ[], set2: CoordinateXYZ[]): number {
    let shortSet = set1,
      longSet = set2;
    if (set1.length > set2.length) {
      shortSet = set2;
      longSet = set1;
    }
    return shortSet.reduce((memo, coord, idx) => (coord.eql(longSet[idx]!) ? memo + 1 : memo), 0);
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

export { BeaconScanner as default, convertInputToCoordinateXYZ };
