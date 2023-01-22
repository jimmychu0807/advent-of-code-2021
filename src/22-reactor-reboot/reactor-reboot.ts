const BOUNDARY = 50;

interface Range {
  min: number;
  max: number;
}

type Instruction = [boolean, Range, Range, Range];

class ReactorReboot {
  static getLineInfo(line: string): Instruction {
    const [onOffStr, afterSpace] = line.split(" ");
    const [xStr, yStr, zStr] = afterSpace!.split(",");
    const [xMin, xMax] = xStr!.slice(2).split("..");
    const [yMin, yMax] = yStr!.slice(2).split("..");
    const [zMin, zMax] = zStr!.slice(2).split("..");

    return [
      onOffStr === "on",
      { min: Number(xMin), max: Number(xMax) },
      { min: Number(yMin), max: Number(yMax) },
      { min: Number(zMin), max: Number(zMax) },
    ];
  }

  static processOneLine(
    domains: boolean[][][],
    lineInfo: [boolean, Range, Range, Range],
    offset: [number, number, number],
  ) {
    const [xOffset, yOffset, zOffset] = offset;
    const [xFrom, xTo] = [lineInfo[1].min - xOffset, lineInfo[1].max - xOffset];
    const [yFrom, yTo] = [lineInfo[2].min - yOffset, lineInfo[2].max - yOffset];
    const [zFrom, zTo] = [lineInfo[3].min - zOffset, lineInfo[3].max - zOffset];

    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        for (let z = zFrom; z <= zTo; z++) {
          domains[x]![y]![z] = lineInfo[0];
        }
      }
    }
  }

  static countOn(domains: boolean[][][]): number {
    return domains.reduce(
      (memo, area) =>
        memo +
        area.reduce((memo, ln) => memo + ln.reduce((memo, val) => (val ? memo + 1 : memo), 0), 0),
      0,
    );
  }

  static initDomains(xLen: number, yLen?: number, zLen?: number): boolean[][][] {
    return new Array(xLen)
      .fill(0)
      .map(() =>
        new Array(yLen ?? xLen).fill(0).map(() => new Array(zLen ?? xLen).fill(0).map(() => false)),
      );
  }

  static getOffsetAndLen(ranges: Range[]): [number, number] {
    const minMin = Math.min(...ranges.map((r) => r.min));
    const maxMax = Math.max(...ranges.map((r) => r.max));
    return [minMin, maxMax - minMin + 1];
  }

  static processRebootSteps(input: string[]): number {
    // init the cube
    const sideLen = BOUNDARY * 2 + 1;
    const domains: boolean[][][] = this.initDomains(sideLen, sideLen, sideLen);

    input.forEach((ln) => {
      const res = this.getLineInfo(ln);
      if (
        res[1]!.min > BOUNDARY ||
        res[1]!.max < BOUNDARY * -1 ||
        res[2]!.min > BOUNDARY ||
        res[2]!.max < BOUNDARY * -1 ||
        res[3]!.min > BOUNDARY ||
        res[3]!.max < BOUNDARY * -1
      )
        return;

      this.processOneLine(domains, res, [BOUNDARY * -1, BOUNDARY * -1, BOUNDARY * -1]);
    });

    return this.countOn(domains);
  }

  static processFullReboot(input: string[]): number {
    // Find the offset and length for x, y, z axis.
    const instructions = input.map(this.getLineInfo);
    const [xOffset, xLen] = this.getOffsetAndLen(instructions.map((i) => i[1]));
    const [yOffset, yLen] = this.getOffsetAndLen(instructions.map((i) => i[2]));
    const [zOffset, zLen] = this.getOffsetAndLen(instructions.map((i) => i[3]));

    const domains: boolean[][][] = this.initDomains(xLen, yLen, zLen);

    instructions.forEach((ins) => {
      this.processOneLine(domains, ins, [xOffset, yOffset, zOffset]);
    });

    return this.countOn(domains);
  }
}

export { ReactorReboot as default, BOUNDARY };
