const BOUNDARY = 50;

interface Range {
  min: number;
  max: number;
}

interface Instruction {
  on: boolean;
  x: Range;
  y: Range;
  z: Range;
}

type Cuboid = Instruction;

class ReactorReboot {
  static parseInstruction(line: string): Instruction {
    const [onOffStr, afterSpace] = line.split(" ");
    const [xStr, yStr, zStr] = afterSpace!.split(",");
    const [xMin, xMax] = xStr!.slice(2).split("..");
    const [yMin, yMax] = yStr!.slice(2).split("..");
    const [zMin, zMax] = zStr!.slice(2).split("..");

    return {
      on: onOffStr === "on",
      x: { min: Number(xMin), max: Number(xMax) },
      y: { min: Number(yMin), max: Number(yMax) },
      z: { min: Number(zMin), max: Number(zMax) },
    };
  }

  static rebootInitOneIns(
    domains: boolean[][][],
    ins: Instruction,
    offset: [number, number, number],
  ) {
    const [xOffset, yOffset, zOffset] = offset;
    const [xFrom, xTo] = [ins.x.min - xOffset, ins.x.max - xOffset];
    const [yFrom, yTo] = [ins.y.min - yOffset, ins.y.max - yOffset];
    const [zFrom, zTo] = [ins.z.min - zOffset, ins.z.max - zOffset];

    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        for (let z = zFrom; z <= zTo; z++) {
          domains[x]![y]![z] = ins.on;
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
      .map(() => new Array(yLen ?? xLen).fill(0).map(() => new Array(zLen ?? xLen).fill(false)));
  }

  static rebootInit(input: string[]): number {
    // init the cube
    const sideLen = BOUNDARY * 2 + 1;
    const domains: boolean[][][] = this.initDomains(sideLen);

    input.forEach((ln) => {
      const ins = this.parseInstruction(ln);
      if (
        ins.x.min > BOUNDARY ||
        ins.x.max < BOUNDARY * -1 ||
        ins.y.min > BOUNDARY ||
        ins.y.max < BOUNDARY * -1 ||
        ins.z.min > BOUNDARY ||
        ins.z.max < BOUNDARY * -1
      )
        return;

      this.rebootInitOneIns(domains, ins, [BOUNDARY * -1, BOUNDARY * -1, BOUNDARY * -1]);
    });

    return this.countOn(domains);
  }

  static addOrConcat<El>(arr: El[][], idx: number, els: El[]) {
    arr[idx] = typeof arr[idx] === "undefined" ? els : arr[idx]!.concat(els);
  }

  static fullReboot(input: string[] | Cuboid[]): number {
    const instructions: Cuboid[] = input.map((ln) =>
      typeof ln === "string" ? this.parseInstruction(ln) : ln,
    );

    let totalVol = 0;
    const intersectVols: Cuboid[][][] = [];

    instructions.forEach((cuboid) => {
      const addIntersectVols: Cuboid[][][] = [];
      totalVol -= intersectVols
        .map((list, numIntersect) => {
          const sumRowIntersectVol = list.reduce((accu, set) => {
            const newSet = [...set, cuboid];
            const intersectVol = this.intersectionVol(newSet);

            if (intersectVol > 0) this.addOrConcat(addIntersectVols, newSet.length - 1, [newSet]);

            return accu + intersectVol;
          }, 0);
          return sumRowIntersectVol * (numIntersect % 2 === 0 ? 1 : -1);
        })
        .reduce((accu, num) => accu + num, 0);

      if (cuboid.on) {
        this.addOrConcat(intersectVols, 0, [[cuboid]]);
        const { x, y, z } = cuboid;
        totalVol += (x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1);
      }

      // merge `addIntersectVols` into `intersectVols`
      addIntersectVols.forEach((row, numIntersect) => {
        if (typeof row === "undefined") return;
        this.addOrConcat(intersectVols, numIntersect, row);
      });
    });

    return totalVol;
  }

  static intersectionVol(set: Cuboid[]): number {
    if (set.length < 1) return 0;

    const x: Range = { min: set[0]!.x.min, max: set[0]!.x.max };
    const y: Range = { min: set[0]!.y.min, max: set[0]!.y.max };
    const z: Range = { min: set[0]!.z.min, max: set[0]!.z.max };

    for (let i = 1; i < set.length; i++) {
      if (
        set[i]!.x.max >= x.min &&
        set[i]!.x.min <= x.max &&
        set[i]!.y.max >= y.min &&
        set[i]!.y.min <= y.max &&
        set[i]!.z.max >= z.min &&
        set[i]!.z.min <= z.max
      ) {
        x.min = Math.max(x.min, set[i]!.x.min);
        x.max = Math.min(x.max, set[i]!.x.max);
        y.min = Math.max(y.min, set[i]!.y.min);
        y.max = Math.min(y.max, set[i]!.y.max);
        z.min = Math.max(z.min, set[i]!.z.min);
        z.max = Math.min(z.max, set[i]!.z.max);
      } else {
        return 0;
      }
    }

    return (x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1);
  }
}

export { ReactorReboot as default, BOUNDARY };
