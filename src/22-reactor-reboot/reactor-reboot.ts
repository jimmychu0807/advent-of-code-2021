const BOUNDARY = 50;

interface Range {
  min: number;
  max: number;
}

class ReactorReboot {
  static getLineInfo(line: string): [boolean, Range, Range, Range] {
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

  static processOneLine(domains: boolean[][][], lineInfo: [boolean, Range, Range, Range]) {
    const [xFrom, xTo] = [lineInfo[1].min + BOUNDARY, lineInfo[1].max + BOUNDARY];
    const [yFrom, yTo] = [lineInfo[2].min + BOUNDARY, lineInfo[2].max + BOUNDARY];
    const [zFrom, zTo] = [lineInfo[3].min + BOUNDARY, lineInfo[3].max + BOUNDARY];

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

  static initDomains(len: number): boolean[][][] {
    return new Array(len)
      .fill(0)
      .map(() => new Array(len).fill(0).map(() => new Array(len).fill(0).map(() => false)));
  }

  static processRebootSteps(input: string[]): number {
    // init the cube
    const domains: boolean[][][] = this.initDomains(BOUNDARY * 2 + 1);

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

      this.processOneLine(domains, res);
    });

    return this.countOn(domains);
  }
}

export { ReactorReboot as default };
