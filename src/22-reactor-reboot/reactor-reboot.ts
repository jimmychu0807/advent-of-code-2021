const BOUNDARY = 50;

interface Range {
  min: number;
  max: number;
}

type Instruction = [boolean, Range, Range, Range];

interface GridConfig {
  x: OffsetAndLen;
  y: OffsetAndLen;
  z: OffsetAndLen;
}

interface OffsetAndLen {
  offset: number;
  len: number;
}

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
    console.log("processOneLine:", lineInfo, offset);

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

  static toDomainIdxAndBitPos(x: number, y: number, z: number, gc: GridConfig): [number, number] {
    const pos =
      (x - gc.x.offset) * gc.y.len * gc.z.len + (y - gc.y.offset) * gc.z.len + (z - gc.z.offset);
    return [Math.floor(pos / 32), pos % 32];
  }

  static setDomainBit(domains: number[], di: number, dbp: number, onOff: boolean) {
    domains[di] = onOff ? domains[di]! | (1 << dbp) : domains[di]! & ~(1 << dbp);
  }

  static processOneLine2(
    domains: number[],
    lineInfo: [boolean, Range, Range, Range],
    gc: GridConfig,
  ) {
    const [xFrom, xTo] = [lineInfo[1].min, lineInfo[1].max];
    const [yFrom, yTo] = [lineInfo[2].min, lineInfo[2].max];
    const [zFrom, zTo] = [lineInfo[3].min, lineInfo[3].max];

    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        for (let z = zFrom; z <= zTo; z++) {
          const [di, dbp] = this.toDomainIdxAndBitPos(x, y, z, gc);
          this.setDomainBit(domains, di, dbp, lineInfo[0]);
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

  static countOn2(domains: number[]): number {
    let cnt = 0;
    for (let i = 0; i < domains.length; i++) {
      const val = domains[i]!;
      for (let j = 0; j < 32; j++) {
        if ((val & (1 << j)) !== 0) cnt++;
      }
    }
    return cnt;
  }

  static initDomains(xLen: number, yLen?: number, zLen?: number): boolean[][][] {
    console.log(`initDomains: ${xLen}, ${yLen}, ${zLen}`);

    return new Array(xLen)
      .fill(0)
      .map(() => new Array(yLen ?? xLen).fill(0).map(() => new Array(zLen ?? xLen).fill(false)));
  }

  static getOffsetAndLen(ranges: Range[]): [number, number] {
    const minMin = Math.min(...ranges.map((r) => r.min));
    const maxMax = Math.max(...ranges.map((r) => r.max));
    return [minMin, maxMax - minMin + 1];
  }

  static processRebootSteps(input: string[]): number {
    // init the cube
    const sideLen = BOUNDARY * 2 + 1;
    const domains: boolean[][][] = this.initDomains(sideLen);

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

  static initDomains2(xLen: number, yLen?: number, zLen?: number): number[] {
    const product = xLen * (yLen ?? xLen) * (zLen ?? xLen);
    return new Array(product % 32 === 0 ? product / 32 : Math.floor(product / 32) + 1).fill(0);
  }

  static getGridConfigFromIns(ins: Instruction[]): GridConfig {
    const [xOffset, xLen] = this.getOffsetAndLen(ins.map((i) => i[1]));
    const [yOffset, yLen] = this.getOffsetAndLen(ins.map((i) => i[2]));
    const [zOffset, zLen] = this.getOffsetAndLen(ins.map((i) => i[3]));

    return {
      x: { offset: xOffset, len: xLen },
      y: { offset: yOffset, len: yLen },
      z: { offset: zOffset, len: zLen },
    };
  }

  static processFullReboot(input: string[]): number {
    // Find the offset and length for x, y, z axis.
    const instructions = input.map(this.getLineInfo);
    const gc: GridConfig = this.getGridConfigFromIns(instructions);

    console.log("config", gc);

    const domains: number[] = this.initDomains2(gc.x.len, gc.y.len, gc.z.len);

    console.log(`domain len: ${domains.length}`);

    instructions.forEach((ins) => {
      this.processOneLine2(domains, ins, gc);
    });

    return this.countOn2(domains);
  }
}

export { ReactorReboot as default, BOUNDARY };
