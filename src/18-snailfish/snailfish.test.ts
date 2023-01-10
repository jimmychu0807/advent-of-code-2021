import { expect } from "chai";

import Snailfish from "./snailfish.js";

const PARSE_TO_TREE_SAMPLE = {
  input: "[[1,2],[[3,4],5]]",
  magnitude: 143,
};

// const REDUCTION_SAMPLE = {
//   input: "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]",
//   reducedResult: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
// };

// const SUM_SAMPLE1 = {
//   input: [
//     "[1,1]",
//     "[2,2]",
//     "[3,3]",
//     "[4,4]",
//     "[5,5]",
//     "[6,6]",
//   ],
//   sumString: "[[[[5,0],[7,4]],[5,5]],[6,6]]",
//   magnitude: 1137,
// };

// const SUM_SAMPLE2 = {
//   input: [
//     "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
//     "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
//     // "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
//     // "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
//     // "[7,[5,[[3,8],[1,4]]]]",
//     // "[[2,[2,2]],[8,[8,1]]]",
//     // "[2,9]",
//     // "[1,[[[9,3],9],[[9,0],[0,7]]]]",
//     // "[[[5,[7,4]],7],1]",
//     // "[[[[4,2],2],6],[8,7]]",
//   ],
//   sumString: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
//   magnitude: 3488,
// };

describe("Day 18 - Snailfish", () => {
  describe("Part I", () => {
    it("Snailfish.parse() works", () => {
      const { input } = PARSE_TO_TREE_SAMPLE;
      const node = Snailfish.parse(input);
      expect(node.toString()).to.eq(input);
    });

    it("Node.magnitude() works", () => {
      const { input, magnitude } = PARSE_TO_TREE_SAMPLE;
      const node = Snailfish.parse(input);
      expect(node.magnitude()).to.eq(magnitude);
    });

    // it("Snailfish.reduceTree() works", () => {
    //   const { input, reducedResult } = REDUCTION_SAMPLE;
    //   const result = Snailfish.reduce(Snailfish.parse(input));
    //   expect(result).to.eql(Snailfish.parse(reducedResult));
    // });

    // it("Snailfish.sum() and Snailfish.magnitide() works for SUM_SAMPLES", () => {
    //   [SUM_SAMPLE2].forEach((sample, idx) => {
    //     console.log(`SUM_SAMPLE${idx + 1} test.`);
    //     const { input, sumString, magnitude } = sample;
    //     const sumNode = input.slice(1).reduce((memo, ln) => {
    //       const res = Snailfish.sum(memo, ln);

    //       console.log(`final`);
    //       console.dir(res, { depth: null });

    //       return res;
    //     }, Snailfish.parse(input[0]!));

    //     expect(sumNode).to.eql(
    //       Snailfish.parse(sumString),
    //       `SUM_SAMPLE${idx + 1} don't match with expected`,
    //     );
    //     expect(Snailfish.magnitude(sumNode)).to.eq(magnitude);
    //   });
    // });
  });
});
