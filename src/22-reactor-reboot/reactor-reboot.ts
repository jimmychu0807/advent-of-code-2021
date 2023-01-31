const BOUNDARY = 50;

// const COUNTS = {
//   combination: 0,
// };

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
      typeof ln === "string" ? this.parseInstruction(ln) : ln
    );

    return this.sumOfPickVolume(instructions);
  }

  static sumOfPickVolume(set: Cuboid[], pick = 1): number {
    if (pick > set.length) return 0;

    console.log(`sumOfPickVolume: ${set.length} choose ${pick}`);

    const combinations = this.combination(0, set.length - 1, pick);

    let totalVol = 0;
    let nonNullEls: number[] = [];

    combinations.forEach((combination) => {
      const comSet = combination.map(i => set[i]) as Cuboid[];

      const vol = this.intersectionVol(comSet);
      if (vol > 0) nonNullEls.push(...combination);
      if (comSet[0]!.on) totalVol += vol;
    });

    // optimization 1: Flatten the nonNullSet and map to get the instructions
    nonNullEls = this.dedupAndSort(nonNullEls);

    console.log("nonNullEls", nonNullEls);

    const nonNullSet = nonNullEls.map(i => set[i]!);

    return totalVol > 0 ? totalVol - this.sumOfPickVolume(nonNullSet, pick + 1) : 0;
  }

  static dedupAndSort(arr: number[]): number[] {
    const dup = [...arr].sort((a, b) => a - b);
    return dup.reduce((memo: number[], el) => el === memo[memo.length - 1] ? memo : [...memo, el], []);
  }

  static combination(start: number, end: number, pick: number): number[][] {

    // optimize2: better combination generation & caching. Generate the index.

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
