import { expect } from "chai";
import { DiracDice, Dice, permutateAndSum } from "./dirac-dice.js";

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
      const res = DiracDice.simulate1(p1InitPos, p2InitPos);
      expect(res).to.eql(expected);
    });
  });

  describe("Part II", () => {
    it("permutateAndSum() works", () => {
      const expected2 = { "2": 1, "3": 2, "4": 3, "5": 2, "6": 1 };
      const expected3 = { "3": 1, "4": 3, "5": 6, "6": 7, "7": 6, "8": 3, "9": 1 };

      const res2 = permutateAndSum(3, 2);
      expect(res2).to.eql(expected2);

      const res3 = permutateAndSum(3, 3);
      expect(res3).to.eql(expected3);
    });

    it("DiracDice.simulate2OneTurn() works in simple case", () => {
      const input = [{ score: 0, pos: 1, freq: 2 }];
      const moves = DiracDice.simulate2OneTurn(input);
      const expectedMoves = [
        { score: 4, pos: 4, freq: 2 },
        { score: 5, pos: 5, freq: 6 },
        { score: 6, pos: 6, freq: 12 },
        { score: 7, pos: 7, freq: 14 },
        { score: 8, pos: 8, freq: 12 },
        { score: 9, pos: 9, freq: 6 },
        { score: 10, pos: 10, freq: 2 },
      ];
      expect(moves).to.eql(expectedMoves);

      const winningRes = DiracDice.countWinning(moves, 9);
      expect(winningRes).to.eql([8, [5, 6]]);
    });

    it("DiracDice.simulate2() works in simple case", () => {
      const p1InitPos = 1;
      const p2InitPos = 2;

      const res = DiracDice.simulate2(p1InitPos, p2InitPos, 9);
      console.log(res);
    });

    it("DiracDice.simulate2() works in test case", () => {
      const p1InitPos = 4;
      const p2InitPos = 8;

      const res = DiracDice.simulate2(p1InitPos, p2InitPos, 21);
      console.log(res);
    });
  });
});
