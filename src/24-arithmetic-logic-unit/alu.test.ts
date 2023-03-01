import { expect } from "chai";
import ALU from "./alu.js";

// prettier-ignore
const TEST1 = {
  instructions: [
    'inp x',
    'mul x -1',
  ],
  input: [13],
  expectedAns: {
    w: 0, x: -13, y: 0, z: 0
  },
}

// prettier-ignore
const TEST2 = {
  instructions: [
    'inp w',
    'add z w',
    'mod z 2',
    'div w 2',
    'add y w',
    'mod y 2',
    'div w 2',
    'add x w',
    'mod x 2',
    'div w 2',
    'mod w 2',
  ],
  input: [1023],
  expectedAns: {
    w: 1, x: 1, y: 1, z: 1
  },
}

describe("Day 24 - Arithmetic Logic Unit", () => {
  describe("Part I", () => {
    it("process TEST1 correctly", () => {
      const alu = new ALU();
      const { instructions, input, expectedAns } = TEST1;
      const state = alu.parse(instructions, input);
      expect(state).to.eql(expectedAns);
    });

    it("process TEST2 correctly", () => {
      const alu = new ALU();
      const { instructions, input, expectedAns } = TEST2;
      const state = alu.parse(instructions, input);
      expect(state).to.eql(expectedAns);
    });
  });
});
