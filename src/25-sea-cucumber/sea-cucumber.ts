import Debug from "debug";

const log = Debug("sea-cucumber");

const MAX_ITERATION = 9999;

class SeaCucumber {
  public static isMapEqual(map1: string[][], map2: string[][]): boolean {
    const map1Str = map1.map((ln) => ln.join("")).join("|");
    const map2Str = map2.map((ln) => ln.join("")).join("|");
    return map1Str === map2Str;
  }

  public static toMapStr(map: string[][]): string {
    const res = map.map((ln) => ln.slice(0, -1).join(""));
    return "\n" + res.slice(0, -1).join("\n");
  }

  public static stopIteration(input: string[]): number {
    let prevIteration: string[][] | undefined = undefined;
    let currentIteration: string[][] = input.map((ln) => ln.split(""));

    // duplicate the top row to the bottom of the map, and left column to the right-most column of the map
    currentIteration.push([...currentIteration[0]!]);
    currentIteration = currentIteration.map((ln) => [...ln, ln[0]!]);

    const rowLen = currentIteration.length;
    const colLen = currentIteration[0]!.length;
    let itNum = 0;

    log(`start:`, this.toMapStr(currentIteration));

    while (!prevIteration || !this.isMapEqual(prevIteration, currentIteration)) {
      const movedRight: string[][] = new Array(rowLen)
        .fill(0)
        .map(() => new Array(colLen).fill(""));
      const movedDown: string[][] = new Array(rowLen).fill(0).map(() => new Array(colLen).fill(""));

      // shift corresponding pieces to right first
      for (let rIdx = 0; rIdx < rowLen; rIdx++) {
        // indicating the start pos `0` has moved
        let bStart = false;
        let bEnd = false;
        for (let cIdx = 0; cIdx < colLen - 1; cIdx++) {
          if (currentIteration[rIdx]![cIdx] !== ">" || currentIteration[rIdx]![cIdx + 1] !== ".") {
            movedRight[rIdx]![cIdx] = currentIteration[rIdx]![cIdx]!;
            continue;
          }
          // this pc need to move
          if (cIdx === 0) bStart = true;
          if (cIdx === colLen - 2) bEnd = true;
          movedRight[rIdx]![cIdx] = ".";
          movedRight[rIdx]![cIdx + 1] = ">";
          cIdx++;
        }
        // dealing w. the last piece in the row
        if (bStart) {
          movedRight[rIdx]![colLen - 1] = movedRight[rIdx]![0]!;
        } else if (bEnd) {
          movedRight[rIdx]![0] = movedRight[rIdx]![colLen - 1]!;
        } else {
          // both `bStart` and `bEnd` are false
          movedRight[rIdx]![colLen - 1] = currentIteration[rIdx]![colLen - 1]!;
        }
      }

      // shift corresponding pieces down
      for (let cIdx = 0; cIdx < colLen; cIdx++) {
        let bStart = false;
        let bEnd = false;
        for (let rIdx = 0; rIdx < rowLen - 1; rIdx++) {
          if (movedRight[rIdx]![cIdx] !== "v" || movedRight[rIdx + 1]![cIdx] !== ".") {
            movedDown[rIdx]![cIdx] = movedRight[rIdx]![cIdx]!;
            continue;
          }
          if (rIdx === 0) bStart = true;
          if (rIdx === rowLen - 2) bEnd = true;
          movedDown[rIdx]![cIdx] = ".";
          movedDown[rIdx + 1]![cIdx] = "v";
          rIdx++;
        }
        // dealing w. the last pc in the column
        if (bStart) {
          movedDown[rowLen - 1]![cIdx] = movedDown[0]![cIdx]!;
        } else if (bEnd) {
          movedDown[0]![cIdx] = movedDown[rowLen - 1]![cIdx]!;
        } else {
          movedDown[rowLen - 1]![cIdx] = movedRight[rowLen - 1]![cIdx]!;
        }
      }

      // Update the bookkeeping
      prevIteration = currentIteration;
      currentIteration = movedDown;
      itNum += 1;

      if (itNum > MAX_ITERATION) {
        throw new Error(`Program doesn't stop within ${MAX_ITERATION} iterations.`);
      }

      log(`after ${itNum} iter`, this.toMapStr(currentIteration));
    }

    return itNum;
  }
}

export { SeaCucumber as default };
