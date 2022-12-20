const toMap = (input: string[]): number[][] =>
  input.map((ln) => ln.split("").map((c) => Number(c)));

class DumboOctopus {
  static modelOneStep(map: number[][]): number {
    const height = map.length;
    const width = map[0]!.length;

    // all entries in map increment by 1
    for (let rowIdx = 0; rowIdx < height; rowIdx++) {
      for (let colIdx = 0; colIdx < width; colIdx++) {
        map[rowIdx]![colIdx] += 1;
      }
    }

    const affectMap: boolean[][] = Array(height)
      .fill(0)
      .map(() => Array(width).fill(false));
    let affected = true;

    while (affected) {
      affected = false;

      // scan if there is any flashing
      for (let rowIdx = 0; rowIdx < height; rowIdx++) {
        for (let colIdx = 0; colIdx < width; colIdx++) {
          if (map[rowIdx]![colIdx]! < 10 || affectMap[rowIdx]![colIdx]!) continue;

          affectMap[rowIdx]![colIdx] = true;
          affected = true;

          // This spot flashes, increase the energy of surrounding spots by 1.
          // top-left
          if (rowIdx > 0 && colIdx > 0 && map[rowIdx - 1]![colIdx - 1]! < 10) {
            map[rowIdx - 1]![colIdx - 1] += 1;
          }
          // top
          if (rowIdx > 0 && map[rowIdx - 1]![colIdx]! < 10) {
            map[rowIdx - 1]![colIdx] += 1;
          }
          // top-right
          if (rowIdx > 0 && colIdx < width - 1 && map[rowIdx - 1]![colIdx + 1]! < 10) {
            map[rowIdx - 1]![colIdx + 1] += 1;
          }
          // left
          if (colIdx > 0 && map[rowIdx]![colIdx - 1]! < 10) {
            map[rowIdx]![colIdx - 1] += 1;
          }
          // right
          if (colIdx < width - 1 && map[rowIdx]![colIdx + 1]! < 10) {
            map[rowIdx]![colIdx + 1] += 1;
          }
          // bottom-left
          if (rowIdx < height - 1 && colIdx > 0 && map[rowIdx + 1]![colIdx - 1]! < 10) {
            map[rowIdx + 1]![colIdx - 1] += 1;
          }
          // bottom
          if (rowIdx < height - 1 && map[rowIdx + 1]![colIdx]! < 10) {
            map[rowIdx + 1]![colIdx] += 1;
          }
          // bottom-right
          if (rowIdx < height - 1 && colIdx < width - 1 && map[rowIdx + 1]![colIdx + 1]! < 10) {
            map[rowIdx + 1]![colIdx + 1] += 1;
          }
        }
      }
    }

    // count all the flash spots and reset them to 0
    let flashes = 0;

    for (let rowIdx = 0; rowIdx < height; rowIdx++) {
      for (let colIdx = 0; colIdx < width; colIdx++) {
        if (map[rowIdx]![colIdx]! < 10) continue;

        flashes += 1;
        map[rowIdx]![colIdx] = 0;
      }
    }
    return flashes;
  }

  static modeling(input: string[], days: number): [number, string[]] {
    const map = toMap(input);

    let flashes = 0;
    while (days > 0) {
      flashes += this.modelOneStep(map);
      days -= 1;
    }

    const resultMap: string[] = map.map((row) => row.map((v) => v.toString()).join(""));
    return [flashes, resultMap];
  }

  static findSyncStep(input: string[]): number {
    const map = toMap(input);
    let step = 0;
    let run = true;
    while (run) {
      this.modelOneStep(map);
      step += 1;
      if (map.every((row) => row.every((val) => val === 0))) run = false;
    }
    return step;
  }
}

export { DumboOctopus as default };
