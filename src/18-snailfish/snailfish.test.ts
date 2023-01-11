import { expect } from "chai";
import Debug from "debug";
import Snailfish from "./snailfish.js";

const log = Debug("test:snailfish");

const PARSE_TO_TREE_SAMPLE = {
  input: "[[1,2],[[3,4],5]]",
  magnitude: 143,
};

const SPLIT_SAMPLE = [
  "[[[[0,7],4],[15,[0,13]]],[1,1]]",
  "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]",
  "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]",
  "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]",
];

const REDUCTION_SAMPLE = {
  input: "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]",
  reducedResult: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
};

const SUM_SAMPLE1 = {
  input: ["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]", "[6,6]"],
  result: [
    "[[1,1],[2,2]]",
    "[[[1,1],[2,2]],[3,3]]",
    "[[[[1,1],[2,2]],[3,3]],[4,4]]",
    "[[[[3,0],[5,3]],[4,4]],[5,5]]",
    "[[[[5,0],[7,4]],[5,5]],[6,6]]",
  ],
  magnitude: 1137,
};

const SUM_SAMPLE2 = {
  input: [
    "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
    "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
    "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
    "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
    "[7,[5,[[3,8],[1,4]]]]",
    "[[2,[2,2]],[8,[8,1]]]",
    "[2,9]",
    "[1,[[[9,3],9],[[9,0],[0,7]]]]",
    "[[[5,[7,4]],7],1]",
    "[[[[4,2],2],6],[8,7]]",
  ],
  result: [
    "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]",
    "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]",
    "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]",
    "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]",
    "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]",
    "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]",
    "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]",
    "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]",
    "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
  ],
  magnitude: 3488,
};

const SUM_SAMPLE3 = {
  input: [
    "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
    "[[[5,[2,8]],4],[5,[[9,9],0]]]",
    "[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
    "[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
    "[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
    "[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
    "[[[[5,4],[7,7]],8],[[8,3],8]]",
    "[[9,3],[[9,9],[6,[4,9]]]]",
    "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
    "[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]",
  ],
  sumStr: "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]",
  magnitude: 4140,
  biggestSum: 3993,
};

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

    it("Node.split() works", () => {
      SPLIT_SAMPLE.reduce((memo, currVal) => {
        const node = Snailfish.parse(memo);
        const updated = node.split();

        expect(updated).to.eq(memo !== currVal);
        expect(node.toString()).to.eq(currVal);

        return currVal;
      });
    });

    it("Node.reduce() works", () => {
      const { input, reducedResult } = REDUCTION_SAMPLE;
      const node = Snailfish.parse(input);
      expect(node.reduce().toString()).to.eq(reducedResult);
    });

    it("Node.add() and Node.magnitide() works for SUM_SAMPLE1", () => {
      const { input, result, magnitude } = SUM_SAMPLE1;

      const node = input.slice(1).reduce((node, ln, idx) => {
        log(`${idx}: summing ${node.toString()} and ${ln}`);
        const sum = node.add(ln);
        expect(sum.toString()).to.eq(result[idx]);
        return sum;
      }, Snailfish.parse(input[0]!));
      expect(node.magnitude()).to.eq(magnitude);
    });

    it("Node.add() and Node.magnitide() works for SUM_SAMPLE2", () => {
      const { input, magnitude, result } = SUM_SAMPLE2;

      const node = input.slice(1).reduce((node, ln, idx) => {
        log(`${idx}: summing ${node.toString()} and ${ln}`);
        const sum = node.add(ln);
        expect(sum.toString()).to.eq(result[idx]);
        return sum;
      }, Snailfish.parse(input[0]!));
      expect(node.magnitude()).to.eq(magnitude);
    });

    it("Node.add() and Node.magnitide() works for SUM_SAMPLE3", () => {
      const { input, magnitude, sumStr } = SUM_SAMPLE3;
      const node = input.slice(1).reduce((node, ln) => node.add(ln), Snailfish.parse(input[0]!));
      expect(node.magnitude()).to.eq(magnitude);
      expect(node.toString()).to.eq(sumStr);
    });
  });

  describe("Part II", () => {
    it("Snailfish.findBiggestSum() works", () => {
      const { input, biggestSum } = SUM_SAMPLE3;
      expect(Snailfish.findBiggestSum(input)).to.eq(biggestSum);
    });
  });
});
