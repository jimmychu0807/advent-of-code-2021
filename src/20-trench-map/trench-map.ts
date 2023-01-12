const ALGO_LEN = 512;

const getNumber = (arr: number[]): number =>
  arr.reverse().reduce((acc, val, idx) => acc + val * Math.pow(2, idx));

function countBits(input: string[], bit: "." | "#" = "#"): number {
  const cntArr = input.map((ln) => ln.split("").filter((c) => c === bit).length);
  return cntArr.reduce((sum, val) => sum + val);
}

class TrenchMap {
  static calcAlgoIndex(inputMap: number[][], inputRi: number, inputCi: number): number {
    const cells9 = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    // Filling in the cells9 nine cells.
    for (let rOffset = -1; rOffset <= 1; rOffset++) {
      const ri = rOffset + 1;
      for (let cOffset = -1; cOffset <= 1; cOffset++) {
        const ci = cOffset + 1;
        cells9[ri]![ci] = inputMap[inputRi + rOffset]![inputCi + cOffset]!;
      }
    }
    // From `cell9` compose the index for algo.
    return getNumber(cells9.flat());
  }

  static enlargeMap(inputMap: number[][], edgeBit: number): number[][] {
    const outMap = new Array(inputMap.length + 4)
      .fill(edgeBit)
      .map(() => new Array(inputMap[0]!.length + 4).fill(edgeBit));

    const height = inputMap.length;
    const width = inputMap[0]!.length;

    for (let ri = 0; ri < height; ri++) {
      for (let ci = 0; ci < width; ci++) {
        outMap[ri + 2]![ci + 2] = inputMap[ri]![ci];
      }
    }

    return outMap;
  }

  static getAlgoIndexMap(map: number[][], edgeBit: number): number[][] {
    // every step we enlarge the original map by two rows and two cols on each side
    // enlarge the map for 2 rows and cols
    const enlargedMap = this.enlargeMap(map, edgeBit);

    const idxMap = new Array(map.length + 2)
      .fill(0)
      .map(() => new Array(map[0]!.length + 2).fill(0));

    const height = idxMap.length;
    const width = idxMap[0]!.length;

    for (let ri = 0; ri < height; ri++) {
      for (let ci = 0; ci < width; ci++) {
        idxMap[ri]![ci] = this.calcAlgoIndex(enlargedMap, ri + 1, ci + 1);
      }
    }

    return idxMap;
  }

  static simulate(algoStr: string, input: string[], step: number): string[] {
    const algo: number[] = algoStr.split("").map((char) => (char === "." ? 0 : 1));
    if (algo.length !== ALGO_LEN) throw new Error("Unexpected image enhancement algo length.");

    let map: number[][] = input.map((ln) => ln.split("").map((char) => (char === "." ? 0 : 1)));
    let edgeBit = 0;
    for (let curStep = 0; curStep < step; curStep++) {
      const idxMap = this.getAlgoIndexMap(map, edgeBit);
      // convert from index map back to bit inside the algo array
      map = idxMap.map((row) => row.map((idx) => algo[idx]!));
      // Update edgeBit
      edgeBit = algo[0]! === 0 ? 0 : curStep % 2 == 0 ? algo[0]! : algo[ALGO_LEN - 1]!;
    }

    return map.map((row) => row.map((digit) => (digit === 0 ? "." : "#")).join(""));
  }
}

export { TrenchMap as default, countBits, getNumber, ALGO_LEN };
