import { expect } from "chai";

import { toBitStr } from "./packet-decoder.js";

const SAMPLE1 = {
  input: "D2FE28",
  bitStr: "110100101111111000101000",
  versionSum: 6,
};

const SAMPLE2 = {
  input: "38006F45291200",
  bitStr: "00111000000000000110111101000101001010010001001000000000",
  versionSum: 9,
};

describe("Day 16 - Packet Decoder", () => {
  describe("Part I", () => {
    it("return the bits string correctly", () => {
      const { input: input1, bitStr: bitStr1 } = SAMPLE1;
      const { input: input2, bitStr: bitStr2 } = SAMPLE2;

      expect(toBitStr(input1)).eq(bitStr1);
      expect(toBitStr(input2)).eq(bitStr2);
    });
  });
});
