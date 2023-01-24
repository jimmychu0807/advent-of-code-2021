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

  static processRebootInit(
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

  static initRebootSteps(input: string[]): number {
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

      this.processRebootInit(domains, ins, [BOUNDARY * -1, BOUNDARY * -1, BOUNDARY * -1]);
    });

    return this.countOn(domains);
  }

  static processRebootSteps(input: string[]): number {
    const intersectionSets: Cuboid[][] = []

    input.forEach(ln => {
      const ins = this.parseInstruction(ln);
      for(let i = 0; i < intersectionSets.length; i ++) {
        if (this.hasIntersection(intersectionSets[i]!, ins)) {
          intersectionSets[i]!.push(ins);
          return;
        }
      }
      // we don't need to push an OFF cuboid in a new set.
      if (ins.on) intersectionSets.push([ins]);
    });

    return intersectionSets.reduce((memo, set) => memo + this.recGetOnVolume(set), 0);
  }

  static hasIntersection(set: Cuboid[], cuboid: Cuboid): boolean {
    for (let i = 0; i < set.length; i++) {
      if (set[i]!.x.max >= cuboid.x.min && set[i]!.x.min <= cuboid.x.max
        && set[i]!.y.max >= cuboid.y.min && set[i]!.y.min <= cuboid.y.max
        && set[i]!.z.max >= cuboid.z.min && set[i]!.z.min <= cuboid.z.max) return true;
    }
    return false;
  }

  static recGetOnVolume(set: Cuboid[], pick: number = 1): number {
    return pick < set.length
      ? this.sumOfIntersectionVol(set, pick) - this.recGetOnVolume(set, pick + 1)
      : this.sumOfIntersectionVol(set, pick);
  }

  static sumOfIntersectionVol(set: Cuboid[], pick: number): number {
    const indices = new Array(set.length).fill(0).map((_, idx) => idx);
    return this.setCombination(indices, pick).reduce((memo, com) => {
      const subset = com.map(idx => set[idx]!);
      return pick === 1 && !subset[0]!.on ? memo : memo + this.intersectionVol(subset);
    }, 0);
  }

  static setCombination(array: number[], pick: number): number[][] {
    if (pick === array.length) return [[...array]];
    if (pick === 0) return new Array(array.length).fill(0).map(() => []);

    let result: number[][] = [];
    for(let idx = 0; idx < array.length; idx++) {
      const skipIdxArr = array.filter((_, i) => i !== idx);
      let res = this.setCombination(skipIdxArr, pick - 1).map(set => set.concat([array[idx]!]));
      result = result.concat(res);
    }
    return result;
  }

  static intersectionVol(set: Cuboid[]): number {
    const x: Range = { min: set[0]!.x.min, max: set[0]!.x.max };
    const y: Range = { min: set[0]!.y.min, max: set[0]!.y.max };
    const z: Range = { min: set[0]!.z.min, max: set[0]!.z.max };

    for (let i = 1; i < set.length; i++) {
      if (set[i]!.x.max >= x.min && set[i]!.x.min <= x.max
        && set[i]!.y.max >= y.min && set[i]!.y.min <= y.max
        && set[i]!.z.max >= z.min && set[i]!.z.min <= z.max) {

        x.min = Math.max(x.min, set[i]!.x.min);
        x.max = Math.min(x.max, set[i]!.x.max);
        y.min = Math.max(y.min, set[i]!.y.min);
        y.max = Math.min(y.max, set[i]!.y.max);
        z.min = Math.max(z.min, set[i]!.z.min);
        z.max = Math.min(z.max, set[i]!.z.max);
      } else {
        // There is no intersection point among this cuboid set.
        return 0;
      }
    }

    return (x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1);
  }
}

export { ReactorReboot as default, BOUNDARY };
