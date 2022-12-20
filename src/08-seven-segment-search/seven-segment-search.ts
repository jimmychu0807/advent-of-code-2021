const UNIQ_CNTS = [2, 3, 4, 7];

// 7-segment display:
//       0
//     ────
//   1│    │2
//    │  3 │
//     ────
//    │    │
//   4│    │5
//     ────
//       6
// prettier-ignore
const DIGIT_SEGMENTS = [
  new Set([0, 1, 2, 4, 5, 6]), // 0
  new Set([2, 5]),             // 1
  new Set([0, 2, 3, 4, 6]),    // 2
  new Set([0, 2, 3, 5, 6]),    // 3
  new Set([1, 2, 3, 5]),       // 4
  new Set([0, 1, 3, 5, 6]),    // 5
  new Set([0, 1, 3, 4, 5, 6]), // 6
  new Set([0, 2, 5]),          // 7
  new Set([0, 1, 2, 3, 4, 5, 6]), // 8
  new Set([0, 1, 2, 3, 5, 6]), // 9
]

const permutate = (input: string): Set<string> => {
  const inputChars = input.split("");
  if (inputChars.length <= 1) return new Set([input]);
  return inputChars.reduce((memo: Set<string>, char: string) => {
    [...permutate(input.replaceAll(char, ""))]
      .map((el) => `${char}${el}`)
      .forEach((el) => memo.add(el));
    return memo;
  }, new Set());
};

const setEq = <T>(setA: Set<T>, setB: Set<T>): boolean =>
  setA.size === setB.size && [...setA].every((el) => setB.has(el));

function getDigit(config: string, subject: string): number | undefined {
  const configMap = config
    .split("")
    .reduce((memo: { [key: string]: number }, c: string, idx: number) => {
      memo[c] = idx;
      return memo;
    }, {});

  const subjectSet = new Set(subject.split("").map((c) => configMap[c]));
  const result = DIGIT_SEGMENTS.findIndex((set) => setEq(set, subjectSet));
  return result >= 0 ? result : undefined;
}

class SevenSegmentSearch {
  static cntOutputUniqueValue(input: string[]): number {
    const totalCnt = input.reduce((memo: number, line: string) => {
      const backPath = line.split("|")[1];
      if (backPath === undefined) return 0;

      const outputTokens = backPath
        .trim()
        .split(" ")
        .map((v) => v.trim());
      const cnt = outputTokens
        .map((t) => t.length)
        .filter((val) => UNIQ_CNTS.indexOf(val) >= 0).length;
      return memo + cnt;
    }, 0);
    return totalCnt;
  }

  static solveConfig(input: string): string | undefined {
    const words: Array<string> = input
      .split("|")
      .map((phrase) => phrase.split(" "))
      .flat()
      .filter((w) => w.length > 0)
      .map((w) => w.trim()) as string[];

    const solSpace = permutate("abcdefg");

    return [...solSpace].find((config) =>
      [...words].every((word) => getDigit(config, word) !== undefined),
    );
  }

  static getDigitsFromLine(input: string): number {
    const solvedConfig = this.solveConfig(input);
    if (!solvedConfig) throw new Error(`Unsolvable segment config from: ${input}`);

    const lastPart = (input.split("|")[1] as string)
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    const digitArr = lastPart.map((str) => getDigit(solvedConfig, str));
    if (digitArr.some((d) => d === undefined)) throw new Error(`Contain unsolvable digit segment.`);

    return Number(digitArr.join(""));
  }

  static getSumFromMultilineInput(input: string[]): number {
    const values = input.map((ln) => this.getDigitsFromLine(ln));
    return values.reduce((memo, val) => memo + val, 0);
  }
}

export { SevenSegmentSearch as default, getDigit, permutate };
