import { CoordinateRC } from "../utils/index.js";

interface Step {
  dir: "U" | "R" | "L" | "D";
  risk: number;
}

const toMap = (input: string[]): number[][] =>
  input.map((ln) => ln.split("").map((char) => Number(char)));

const getRiskFromPath = (path: Step[]): number => path.reduce((memo, step) => memo + step.risk, 0);

class Chiton {
  static recSearchMinPath(map: number[][], loc: CoordinateRC): [number, Step[]] {
    const rowHeight = map.length;
    const colWidth = map[0]!.length;

    const [destRow, destCol] = [rowHeight - 1, colWidth - 1];
    if (loc.row === destRow && loc.col === destCol) return [0, []];

    const pathDown =
      loc.row < rowHeight - 1
        ? this.recSearchMinPath(map, new CoordinateRC(loc.row + 1, loc.col))
        : null;

    const pathRight =
      loc.col < colWidth - 1
        ? this.recSearchMinPath(map, new CoordinateRC(loc.row, loc.col + 1))
        : null;

    if (pathDown && pathRight) {
      const downRisk = map[loc.row + 1]![loc.col] as number;
      const rightRisk = map[loc.row]![loc.col + 1] as number;

      return pathDown[0] + downRisk < pathRight[0] + rightRisk
        ? [pathDown[0] + downRisk, pathDown[1].concat({ dir: "D", risk: downRisk })]
        : [pathRight[0] + rightRisk, pathRight[1].concat({ dir: "R", risk: rightRisk })];
    } else if (pathDown) {
      const risk = map[loc.row + 1]![loc.col] as number;
      return [pathDown[0] + risk, pathDown[1].concat({ dir: "D", risk })];
    }
    const risk = map[loc.row]![loc.col + 1] as number;
    return [pathRight![0] + risk, pathRight![1].concat({ dir: "R", risk })];
  }

  static searchMinPath(input: string[], start: CoordinateRC): Step[] {
    const floorMap = toMap(input);

    const pathDown = this.recSearchMinPath(floorMap, new CoordinateRC(start.row + 1, start.col));
    const pathRight = this.recSearchMinPath(floorMap, new CoordinateRC(start.row, start.col + 1));

    const downRisk = floorMap[start.row + 1]![start.col]!;
    const rightRisk = floorMap[start.row]![start.col + 1]!;

    const stepsReversed =
      pathDown[0] + downRisk < pathRight[0] + rightRisk
        ? pathDown[1].concat({ dir: "D", risk: downRisk })
        : pathRight[1].concat({ dir: "R", risk: rightRisk });

    return stepsReversed.reverse();
  }
}

export { Chiton as default, getRiskFromPath };
