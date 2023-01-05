import { expect } from "chai";

import PacketDecoder, { toBitString, sumPacketVersions } from "./packet-decoder.js";

const SAMPLE1 = {
  input: "D2FE28",
  bitStr: "110100101111111000101000",
  versionSum: 6,
  packet: {
    bits: "110100101111111000101",
    version: 6,
    type: 4,
    literalVal: 2021,
  },
};

const SAMPLE2 = {
  input: "38006F45291200",
  bitStr: "00111000000000000110111101000101001010010001001000000000",
  versionSum: 9,
  packet: {
    bits: "0011100000000000011011110100010100101001000100100",
    version: 1,
    type: 6,
    lenType: 0,
    subPackets: [
      {
        bits: "11010001010",
        version: 6,
        type: 4,
        literalVal: 10,
      },
      {
        bits: "0101001000100100",
        version: 2,
        type: 4,
        literalVal: 20,
      },
    ],
  },
};

const SAMPLE3 = {
  input: "EE00D40C823060",
  bitStr: "11101110000000001101010000001100100000100011000001100000",
  versionSum: 14,
  packet: {
    bits: "111011100000000011010100000011001000001000110000011",
    version: 7,
    type: 3,
    lenType: 1,
    subPackets: [
      {
        bits: "01010000001",
        version: 2,
        type: 4,
        literalVal: 1,
      },
      {
        bits: "10010000010",
        version: 4,
        type: 4,
        literalVal: 2,
      },
      {
        bits: "00110000011",
        version: 1,
        type: 4,
        literalVal: 3,
      },
    ],
  },
};

const TEST_SAMPLES = [
  {
    input: "8A004A801A8002F478",
    versionSum: 16,
  },
  {
    input: "620080001611562C8802118E34",
    versionSum: 12,
  },
  {
    input: "C0015000016115A2E0802F182340",
    versionSum: 23,
  },
  {
    input: "A0016C880162017C3686B18A3D4780",
    versionSum: 31,
  },
];

describe("Day 16 - Packet Decoder", () => {
  describe("Part I", () => {
    it("return the bits string correctly", () => {
      const { input: input1, bitStr: bitStr1 } = SAMPLE1;
      const { input: input2, bitStr: bitStr2 } = SAMPLE2;

      expect(toBitString(input1)).eq(bitStr1);
      expect(toBitString(input2)).eq(bitStr2);
    });

    it("parse SAMPLE1 packet correctly", () => {
      const { input, packet } = SAMPLE1;
      const resPacket = PacketDecoder.parsePacket(input);
      expect(resPacket).to.eql(packet);
    });

    it("parse SAMPLE2 packet correctly", () => {
      const { input, packet } = SAMPLE2;
      const resPacket = PacketDecoder.parsePacket(input);
      expect(resPacket).to.eql(packet);
    });

    it("parse SAMPLE3 packet correctly", () => {
      const { input, packet } = SAMPLE3;
      const resPacket = PacketDecoder.parsePacket(input);
      expect(resPacket).to.eql(packet);
    });

    it("sumPacketVersions() works", () => {
      const { input: input3, versionSum: versionSum3 } = SAMPLE3;
      const resPacket = PacketDecoder.parsePacket(input3);
      expect(sumPacketVersions(resPacket)).to.eql(versionSum3);

      TEST_SAMPLES.forEach(({ input, versionSum }) => {
        const packet = PacketDecoder.parsePacket(input);
        expect(sumPacketVersions(packet)).to.eql(versionSum);
      });
    });
  });
});
