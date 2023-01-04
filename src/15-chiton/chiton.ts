import { CoordinateRC } from "../utils/index.js";

interface StepRecord {
  dir: "T" | "R" | "L" | "B" | undefined; // Top | Right | Left | Bottom | undefined
  minRisk: number | undefined;
}

const toMap = (input: string[], offset: number): number[][] =>
  input.map((ln) =>
    ln.split("").map((char) => {
      const sum = Number(char) + offset;
      return (sum % 10) + Math.floor(sum / 10);
    }),
  );

class Chiton {
  static getMinRiskMap(floorMap: number[][], start: CoordinateRC): StepRecord[][] {
    const rowHeight = floorMap.length;
    const colWidth = floorMap[0]!.length;

    // Initialize the minRiskMap
    const minRiskMap: StepRecord[][] = Array(rowHeight)
      .fill(0)
      .map(() =>
        Array(colWidth)
          .fill(0)
          .map(() => ({ dir: undefined, minRisk: undefined })),
      );
    minRiskMap[start.row]![start.col]!.minRisk = 0;

    // we continue update the risk map (going thru multiple pass) until no min risk value is updated.
    let updated = true;

    while (updated) {
      updated = false;

      for (let rowIdx = start.row; rowIdx < rowHeight; rowIdx++) {
        for (let colIdx = start.col; colIdx < colWidth; colIdx++) {
          if (rowIdx === start.row && colIdx === start.col) continue;

          const riskFromTop = rowIdx > 0 ? minRiskMap[rowIdx - 1]![colIdx]!.minRisk : undefined;
          const riskFromLeft = colIdx > 0 ? minRiskMap[rowIdx]![colIdx - 1]!.minRisk : undefined;
          const riskFromRight =
            colIdx < colWidth - 1 ? minRiskMap[rowIdx]![colIdx + 1]!.minRisk : undefined;
          const riskFromBottom =
            rowIdx < rowHeight - 1 ? minRiskMap[rowIdx + 1]![colIdx]!.minRisk : undefined;

          const minRiskDirs: StepRecord[] = [
            { dir: "T", minRisk: riskFromTop },
            { dir: "L", minRisk: riskFromLeft },
            { dir: "R", minRisk: riskFromRight },
            { dir: "B", minRisk: riskFromBottom },
          ];

          const minRiskDir = minRiskDirs
            .filter((riskDir) => riskDir.minRisk !== undefined)
            .reduce(
              (memo: StepRecord | undefined, riskDir) =>
                memo ? (memo.minRisk! < riskDir.minRisk! ? memo : riskDir) : riskDir,
              undefined,
            );

          if (!minRiskDir) {
            minRiskMap[rowIdx]![colIdx]!.dir = "L";
            minRiskMap[rowIdx]![colIdx]!.minRisk = floorMap[rowIdx]![colIdx]!;
            updated = true;
          } else if (
            minRiskMap[rowIdx]![colIdx]!.minRisk === undefined ||
            minRiskDir.minRisk! + floorMap[rowIdx]![colIdx]! < minRiskMap[rowIdx]![colIdx]!.minRisk!
          ) {
            minRiskMap[rowIdx]![colIdx]!.dir = minRiskDir.dir;
            minRiskMap[rowIdx]![colIdx]!.minRisk = minRiskDir.minRisk! + floorMap[rowIdx]![colIdx]!;
            updated = true;
          }
        }
      }
    }

    return minRiskMap;
  }

  static getMinRisk(input: string[], expansion: number): number {
    const floorMap = this.expandMap(input, expansion);
    const minRiskMap = this.getMinRiskMap(floorMap, new CoordinateRC(0, 0));

    // check map
    for (let row = 0; row < floorMap.length; row++) {
      for (let col = 0; col < floorMap[0]!.length; col++) {
        if (floorMap[row]![col]! < 1 || floorMap[row]![col]! > 9) {
          console.log(`${row}, ${col} - ${floorMap[row]![col]!}`);
        }
      }
    }

    // return the last row-th, col-th value
    return minRiskMap[minRiskMap.length - 1]![minRiskMap[0]!.length - 1]!.minRisk as number;
  }

  static expandMap(input: string[], expansion: number): number[][] {
    const floorMap: number[][] = [];
    const rowHeight = input.length;

    for (let exRowIdx = 0; exRowIdx < expansion; exRowIdx++) {
      for (let exColIdx = 0; exColIdx < expansion; exColIdx++) {
        const tileMap: number[][] = toMap(input, exRowIdx + exColIdx);

        if (exColIdx === 0) {
          tileMap.forEach((tileRow) => {
            floorMap.push(tileRow);
          });
        } else {
          // exColIdx !== 0
          tileMap.forEach((tileRow, rowIdx) => {
            floorMap[exRowIdx * rowHeight + rowIdx]!.push(...tileRow);
          });
        }
      }
    }

    return floorMap;
  }
}

export { Chiton as default, toMap };
