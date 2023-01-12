import { expect } from "chai";
import { DiracDice, Dice } from "./dirac-dice.js";

const TEST_CASE = {
  p1InitPos: 4,
  p2InitPos: 8,
  result: [0, 739785],
};

describe("Day 21 - Dirac Dice", () => {
  describe("Part I", () => {
    it("Dice works", () => {
      const dice = new Dice(5);
      const rolls = [dice.roll(), dice.roll(), dice.roll(), dice.roll(), dice.roll(), dice.roll()];

      expect(rolls).to.eql([1, 2, 3, 4, 5, 1]);
      expect(dice.rollNum()).to.eq(6);
    });

    it("DiracDice.newPosWithRoll() works", () => {
      const res1 = DiracDice.newPosWithRoll(1, 8);
      expect(res1).to.eq(9);

      const res2 = DiracDice.newPosWithRoll(2, 8);
      expect(res2).to.eq(10);

      const res3 = DiracDice.newPosWithRoll(3, 8);
      expect(res3).to.eq(1);
    });

    it("Works for TEST_CASE", () => {
      const { p1InitPos, p2InitPos, result: expected } = TEST_CASE;
      const res = DiracDice.simulate(p1InitPos, p2InitPos);
      expect(res).to.eql(expected);
    });
  });
});
