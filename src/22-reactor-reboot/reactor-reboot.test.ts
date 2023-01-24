import { expect } from "chai";
import ReactorReboot, { BOUNDARY } from "./reactor-reboot.js";

const TEST_CASE1 = {
  input: [
    "on x=10..12,y=10..12,z=10..12",
    "on x=11..13,y=11..13,z=11..13",
    "off x=9..11,y=9..11,z=9..11",
    "on x=10..10,y=10..10,z=10..10",
  ],
  expectedCountOn: 39,
};

const TEST_CASE2 = {
  input: [
    "on x=-20..26,y=-36..17,z=-47..7",
    "on x=-20..33,y=-21..23,z=-26..28",
    "on x=-22..28,y=-29..23,z=-38..16",
    "on x=-46..7,y=-6..46,z=-50..-1",
    "on x=-49..1,y=-3..46,z=-24..28",
    "on x=2..47,y=-22..22,z=-23..27",
    "on x=-27..23,y=-28..26,z=-21..29",
    "on x=-39..5,y=-6..47,z=-3..44",
    "on x=-30..21,y=-8..43,z=-13..34",
    "on x=-22..26,y=-27..20,z=-29..19",
    "off x=-48..-32,y=26..41,z=-47..-37",
    "on x=-12..35,y=6..50,z=-50..-2",
    "off x=-48..-32,y=-32..-16,z=-15..-5",
    "on x=-18..26,y=-33..15,z=-7..46",
    "off x=-40..-22,y=-38..-28,z=23..41",
    "on x=-16..35,y=-41..10,z=-47..6",
    "off x=-32..-23,y=11..30,z=-14..3",
    "on x=-49..-5,y=-3..45,z=-29..18",
    "off x=18..30,y=-20..-8,z=-3..13",
    "on x=-41..9,y=-7..43,z=-33..15",
    "on x=-54112..-39298,y=-85059..-49293,z=-27449..7877",
    "on x=967..23432,y=45373..81175,z=27513..53682",
  ],
  expectedCountOn: 590784,
};

describe("Day 22 - Reactor Reboot", () => {
  describe("Part I", () => {
    it("ReactorReboot.parseInstruction() works", () => {
      const testCase = "off x=9..11,y=9..11,z=9..11";
      const res = ReactorReboot.parseInstruction(testCase);
      expect(res).to.eql({
        on: false,
        x: { min: 9, max: 11 },
        y: { min: 9, max: 11 },
        z: { min: 9, max: 11 },
      });
    });

    it("ReactorReboot.rebootInitOneIns() and ReactorReboot.countOn() works", () => {
      const domains = ReactorReboot.initDomains(101);
      const ins = ReactorReboot.parseInstruction(TEST_CASE1.input[0]!);
      ReactorReboot.rebootInitOneIns(domains, ins, [BOUNDARY * -1, BOUNDARY * -1, BOUNDARY * -1]);
      const res = ReactorReboot.countOn(domains);

      expect(res).to.eq(27);
    });

    it("ReactorReboot.rebootInit() works for TEST_CASE1", () => {
      const { input, expectedCountOn } = TEST_CASE1;
      const res = ReactorReboot.rebootInit(input);

      expect(res).to.eq(expectedCountOn);
    });

    it("ReactorReboot.rebootInit() works for TEST_CASE2", () => {
      const { input, expectedCountOn } = TEST_CASE2;
      const res = ReactorReboot.rebootInit(input);

      expect(res).to.eq(expectedCountOn);
    });
  });

  describe("Part II", () => {
    it("ReactorReboot.processFullReboot works with simple test cases", () => {
      const insStrs = [
        "on x=16383..101554,y=4615..83635,z=-44907..18747",
        "off x=-95822..-15171,y=-19987..48940,z=10804..104439",
      ];
      insStrs;
    });
  });
});
