import { CoordinateRC, Rect } from "../utils/index.js";

const MAX_DIR_ROW = 1000;

class TrickShot {
  // The returned value is an array [
  //   shooting position,
  //   the top left of target area,
  //   the bottom right of the target area
  // ].
  static switchRefFrame(input: string): [CoordinateRC, Rect] {
    const xy = input.split(":")[1]!.split(",");
    const [x0, x1] = xy[0]!
      .split("=")[1]!
      .split("..")
      .map((c) => Number(c.trim()));
    const [y0, y1] = xy[1]!
      .split("=")[1]!
      .split("..")
      .map((c) => Number(c.trim()));

    const startPos = new CoordinateRC(Math.abs(y0!), 0);
    const topLeft = new CoordinateRC(Math.abs(y0!) - Math.abs(y1!), x0!);
    const bottomRight = new CoordinateRC(0, x1!);

    return [startPos, new Rect(topLeft, bottomRight)];
  }

  static simulatePath(
    startPos: CoordinateRC,
    targetArea: Rect,
    dir: CoordinateRC,
  ): [boolean, number | undefined] {
    let { row: currRow, col: currCol } = startPos;
    let { row: nextRowDelta, col: nextColDelta } = dir;
    const { topLeft, bottomRight } = targetArea;
    let maxRow = currRow;

    while (currRow >= 0 && currCol <= bottomRight.col) {
      // Check if this position is in the target area
      if (currRow <= topLeft.row && currCol >= topLeft.col) return [true, maxRow];

      // Check if we should update maxHeight
      if (currRow > maxRow) maxRow = currRow;

      currRow += nextRowDelta;
      currCol += nextColDelta;

      // Update the direction vector
      nextRowDelta -= 1;
      if (nextColDelta > 0) nextColDelta -= 1;

      // early termination
      if (currCol < topLeft.col && nextColDelta == 0) break;
    }
    return [false, undefined];
  }

  static searchAllDirs(startPos: CoordinateRC, targetArea: Rect): [number, CoordinateRC][] {
    const dirs: [number, CoordinateRC][] = [];

    const { bottomRight } = targetArea;

    for (let dir_row = startPos.row * -1; dir_row < MAX_DIR_ROW; dir_row++) {
      for (let dir_col = 1; dir_col <= bottomRight.col; dir_col++) {
        const dir = new CoordinateRC(dir_row, dir_col);
        const res = this.simulatePath(startPos, targetArea, dir);

        if (res[0]) dirs.push([res[1]!, dir]);
      }
    }
    return dirs;
  }

  static getMaxHeight(input: string): number {
    const [startPos, targetArea] = this.switchRefFrame(input);
    const dirs = this.searchAllDirs(startPos, targetArea);
    const maxHeightWithOffset = Math.max(...dirs.map(([maxHeight]) => maxHeight));
    return maxHeightWithOffset - startPos.row;
  }

  static numDirs(input: string): number {
    const [startPos, targetArea] = this.switchRefFrame(input);
    const dirs = this.searchAllDirs(startPos, targetArea);
    return dirs.length;
  }
}

export { TrickShot as default };
