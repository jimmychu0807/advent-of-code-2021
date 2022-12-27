type Direction = "row" | "col";
type Paper = number[][];

const sum = (a: number, b: number): number => a + b;
const sumPaperDots = (paper: Paper): number =>
  paper.map((row) => row.reduce(sum, 0)).reduce(sum, 0);

const printPaperDots = (paper: Paper): string =>
  paper
    .map((ln) => ln.join(""))
    .join("\n")
    .replaceAll("0", " ")
    .replaceAll("1", "#");

class TransparentOrigami {
  static initPaper(input: string[]): Paper {
    const maxColIdx = Math.max(...input.map((ln) => Number(ln.split(",")[0])));
    const maxRowIdx = Math.max(...input.map((ln) => Number(ln.split(",")[1])));

    const paper = Array(maxRowIdx + 1)
      .fill(0)
      .map(() => Array(maxColIdx + 1).fill(0));
    input.forEach((ln) => {
      const [colIdx, rowIdx] = ln.split(",").map((v) => Number(v));
      paper[rowIdx!]![colIdx!] = 1;
    });

    return paper;
  }

  static parseFoldIns(paper: Paper, ins: string): Paper {
    const [first, second] = ins.split("=");
    const dir = first!.slice(-1);
    const axis = Number(second);
    return this.fold(paper, dir === "y" ? "row" : "col", axis);
  }

  // `paper` is modified in this function and it is returned also as a reference.
  static fold(paper: Paper, dir: Direction, axis: number): Paper {
    if (dir === "row") {
      const colLen = paper[0]!.length;
      let dist = 2;

      for (let rowIdx = axis - 1; rowIdx >= 0; rowIdx--) {
        for (let colIdx = 0; colIdx < colLen; colIdx++) {
          paper[rowIdx]![colIdx] = Math.min(
            1,
            paper[rowIdx]![colIdx]! + paper[rowIdx + dist]![colIdx]!,
          );
        }
        dist += 2;
      }
      // Cut the paper and only keep the upper half
      paper.splice(axis);
    } else {
      // dir === ' col'
      const rowLen = paper.length;

      for (let rowIdx = 0; rowIdx < rowLen; rowIdx++) {
        let dist = 2;
        for (let colIdx = axis - 1; colIdx >= 0; colIdx--) {
          paper[rowIdx]![colIdx] = Math.min(
            1,
            paper[rowIdx]![colIdx]! + paper[rowIdx]![colIdx + dist]!,
          );
          dist += 2;
        }
        // cut the row of the paper and only keep the left half
        paper[rowIdx]!.splice(axis);
      }
    }

    return paper;
  }
}

export { TransparentOrigami as default, sumPaperDots, printPaperDots };
