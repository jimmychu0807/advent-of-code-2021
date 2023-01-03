import { CoordinateRC } from "../utils/index.js";

interface StepRecord {
  dir: "U" | "R" | "L" | "D" | null;
  minRisk: number;
}

const toMap = (input: string[]): number[][] =>
  input.map((ln) => ln.split("").map((char) => Number(char)));

class Chiton {
  static getMinRiskMap(floorMap: number[][], start: CoordinateRC): StepRecord[][] {
    const rowHeight = floorMap.length;
    const colWidth = floorMap[0]!.length;

    const minRiskMap: StepRecord[][] = [];

    for (let rowIdx = start.row; rowIdx < rowHeight; rowIdx++) {
      const minRiskRow: StepRecord[] = [];

      for (let colIdx = start.col; colIdx < colWidth; colIdx++) {
        if (rowIdx === start.row && colIdx === start.col) {
          minRiskRow.push({ dir: null, minRisk: 0 });
          continue;
        }

        const riskFromTop = rowIdx > 0 ? minRiskMap[rowIdx - 1]![colIdx]!.minRisk : undefined;
        const riskFromLeft = colIdx > 0 ? minRiskRow[colIdx - 1]!.minRisk : undefined;

        if (riskFromTop === undefined) {
          minRiskRow.push({ dir: "L", minRisk: riskFromLeft! + floorMap[rowIdx]![colIdx]! });
          continue;
        }

        if (riskFromLeft === undefined) {
          minRiskRow.push({ dir: "U", minRisk: riskFromTop! + floorMap[rowIdx]![colIdx]! });
          continue;
        }

        minRiskRow.push(
          riskFromTop < riskFromLeft
            ? { dir: "U", minRisk: riskFromTop + floorMap[rowIdx]![colIdx]! }
            : { dir: "L", minRisk: riskFromLeft + floorMap[rowIdx]![colIdx]! },
        );
      }

      minRiskMap.push(minRiskRow);
    }

    return minRiskMap;
  }

  static getMinRisk(input: string[]): number {
    const floorMap = toMap(input);
    const minRiskMap = this.getMinRiskMap(floorMap, new CoordinateRC(0, 0));

    // return the last row-th, col-th value
    return minRiskMap[minRiskMap.length - 1]![minRiskMap[0]!.length - 1]!.minRisk;
  }
}

export { Chiton as default };
