import { expect } from "chai";

import Snailfish from "./snailfish.js";

const SAMPLE1 = {
  input: "[[1,2],[[3,4],5]]",
  // prettier-ignore
  tree: {
    left: { left: 1, right: 2 },
    right: { left: { left: 3, right: 4 }, right: 5},
  },
  magnitude: 143,
};

describe("Day 18 - Snailfish", () => {
  describe("Part I", () => {
    it("Snailfish.parseToTree() works", () => {
      const { input, tree } = SAMPLE1;
      const [resTree, cursor] = Snailfish.parseToTree(input);

      console.log(resTree);

      expect(cursor).to.eq(input.length);
      expect(resTree).to.eql(tree);
    });

    it("Snailfish.magnitude() works", () => {
      const { input, magnitude } = SAMPLE1;
      const res = Snailfish.parseToTree(input);
      expect(Snailfish.magnitude(res[0])).to.eq(magnitude);
    });
  });
});
