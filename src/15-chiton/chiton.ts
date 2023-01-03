interface Step {
  dir: "U" | "R" | "L" | "D";
  risk: number;
}

const toMap = (input: string[]): number[][] =>
  input.map((ln) => ln.split("").map((char) => Number(char)));

class Chiton {
  static rightAndDownSteps(map: number[][]): Step[] {
    const height = map.length,
      width = (map[0] as number[]).length;

    const path: Step[] = [];

    // We are already at (0, 0), so start from x = 1.
    for (let x = 1; x < width; x++) {
      path.push({ dir: "R", risk: map[0]![x] as number });
    }

    // We are already at (0, width - 1), so start from x = 1.
    for (let y = 1; y < height; y++) {
      path.push({ dir: "D", risk: map[y]![width - 1]! });
    }

    return path;
  }

  static searchMinPath(input: string[]): Step[] {
    const floorMap = toMap(input);

    // we get one path as a ref first
    const minRiskPath = this.rightAndDownSteps(floorMap);

    return minRiskPath;
  }
}

export { Chiton as default };
