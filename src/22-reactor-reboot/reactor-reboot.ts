const BOUNDARY = 50;

const COUNTS = {
  intersectionVol: 0,
  sumOfPickVolume: 0,
  combination: 0,
};

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

const COMBINATION_CACHE: { [key: string]: number[][] } = {};
const NULL_INTERSECTION_CACHE: { [key: string]: boolean } = {};

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

  static fullReboot(input: string[] | Cuboid[]): number {
    const instructions: Cuboid[] = input.map((ln) =>
      typeof ln === "string" ? this.parseInstruction(ln) : ln,
    );

    return this.sumOfPickVolume(instructions);
  }

  static sumOfPickVolume(set: Cuboid[], pick = 1): number {
    if (pick > set.length) return 0;

    console.log(
      `sumOfPickVolume, count: ${COUNTS.sumOfPickVolume++}, setLen: ${set.length}, pick: ${pick}`,
    );

    return (
      this.combination(0, set.length - 1, pick).reduce((memo, com) => {
        const subset = com.map((idx) => set[idx]!);
        return !subset[0]!.on || this.nullPrevIntersection(subset)
          ? memo
          : memo + this.intersectionVol(subset);
      }, 0) - this.sumOfPickVolume(set, pick + 1)
    );
  }

  static nullPrevIntersection(set: Cuboid[]): boolean {
    if (set.length < 3) return false;
    for (let i = 2; i < set.length; i++) {
      const searchKey = JSON.stringify(set.slice(0, i));
      if (NULL_INTERSECTION_CACHE[searchKey]) return true;
    }
    return false;
  }

  static combination(start: number, end: number, pick: number): number[][] {
    const key = `${start},${end},${pick}`;
    if (COMBINATION_CACHE[key]) return COMBINATION_CACHE[key]!;

    // console.log(`combination, count: ${COUNTS.combination++}`);

    const indices = new Array(end - start + 1).fill(0).map((_, idx) => idx + start);

    const prepend = (set: number[][], el: number): number[][] => set.map((one) => [el, ...one]);

    if (pick <= 0 || pick > indices.length) {
      throw new Error(`Invalid pick: ${pick} out of array length: ${indices.length}`);
    }

    if (pick === indices.length) return [[...indices]];
    if (pick === 1) return indices.map((idx) => [idx]);

    let result: number[][] = [];
    for (let idx = 0; idx <= indices.length - pick; idx++) {
      const res = prepend(
        this.combination(indices[idx + 1]!, indices.slice(-1)[0]!, pick - 1),
        indices[idx]!,
      );
      result = result.concat(res);
    }

    COMBINATION_CACHE[key] = result;
    return result;
  }

  static intersectionVol(set: Cuboid[]): number {
    // if (set.length > 2) {
    //   const searchKey = JSON.stringify(set.slice(0, -1));
    //   if (ZERO_INTERSECTION_VOL[searchKey]) {
    //     ZERO_INTERSECTION_VOL[key] = true;
    //     return 0;
    //   }
    // }

    // console.log(`intersectionVol, count: ${COUNTS.intersectionVol++}, setLen: ${set.length}, json: ${JSON.stringify(set)}`);
    console.log(`intersectionVol, count: ${COUNTS.intersectionVol++}, setLen: ${set.length}`);
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
        // There is no intersection point among this cuboid set.
        console.log(`  L 0`);
        NULL_INTERSECTION_CACHE[JSON.stringify(set)] = true;
        return 0;
      }
    }

    console.log(`  L ${(x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1)}`);
    return (x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1);
  }
}

export { ReactorReboot as default, BOUNDARY };
