import { expect } from "chai";

import DumboOctopus from "./dumbo-octopus.js";

// prettier-ignore
const SMALL_SAMPLE = {
  inputMap: [
    '11111',
    '19991',
    '19191',
    '19991',
    '11111',
  ],
  result: [
    {
      step: 1,
      map: [
        '34543',
        '40004',
        '50005',
        '40004',
        '34543',
      ],
      flashes: 9
    },
    {
      step: 2,
      map: [
        '45654',
        '51115',
        '61116',
        '51115',
        '45654',
      ],
      flashes: 9
    }
  ]
}

const LARGE_SAMPLE = {
  inputMap: [
    "5483143223",
    "2745854711",
    "5264556173",
    "6141336146",
    "6357385478",
    "4167524645",
    "2176841721",
    "6882881134",
    "4846848554",
    "5283751526",
  ],
  syncStep: 195,
  result: [
    {
      step: 1,
      map: [
        "6594254334",
        "3856965822",
        "6375667284",
        "7252447257",
        "7468496589",
        "5278635756",
        "3287952832",
        "7993992245",
        "5957959665",
        "6394862637",
      ],
      flashes: 0,
    },
    {
      step: 2,
      map: [
        "8807476555",
        "5089087054",
        "8597889608",
        "8485769600",
        "8700908800",
        "6600088989",
        "6800005943",
        "0000007456",
        "9000000876",
        "8700006848",
      ],
      flashes: 35,
    },
    {
      step: 3,
      map: [
        "0050900866",
        "8500800575",
        "9900000039",
        "9700000041",
        "9935080063",
        "7712300000",
        "7911250009",
        "2211130000",
        "0421125000",
        "0021119000",
      ],
      flashes: 80,
    },
    {
      step: 4,
      map: [
        "2263031977",
        "0923031697",
        "0032221150",
        "0041111163",
        "0076191174",
        "0053411122",
        "0042361120",
        "5532241122",
        "1532247211",
        "1132230211",
      ],
      flashes: 96,
    },
    {
      step: 5,
      map: [
        "4484144000",
        "2044144000",
        "2253333493",
        "1152333274",
        "1187303285",
        "1164633233",
        "1153472231",
        "6643352233",
        "2643358322",
        "2243341322",
      ],
      flashes: 104,
    },
    {
      step: 10,
      map: [
        "0481112976",
        "0031112009",
        "0041112504",
        "0081111406",
        "0099111306",
        "0093511233",
        "0442361130",
        "5532252350",
        "0532250600",
        "0032240000",
      ],
      flashes: 204,
    },
    {
      step: 100,
      map: [
        "0397666866",
        "0749766918",
        "0053976933",
        "0004297822",
        "0004229892",
        "0053222877",
        "0532222966",
        "9322228966",
        "7922286866",
        "6789998766",
      ],
      flashes: 1656,
    },
  ],
};

describe("Day 11 - Dumbo Octopus", () => {
  describe("Part I", () => {
    it("dumbo-octopus modeling() SMALL_SAMPLE", () => {
      SMALL_SAMPLE.result.forEach((res, idx) => {
        const { step, map, flashes } = res;
        expect(DumboOctopus.modeling(SMALL_SAMPLE.inputMap, step)).eql(
          [flashes, map],
          `Case ${idx + 1} fails`,
        );
      });
    });

    it("dumbo-octopus modeling() LARGE_SAMPLE", () => {
      LARGE_SAMPLE.result.forEach((res, idx) => {
        const { step, map, flashes } = res;
        expect(DumboOctopus.modeling(LARGE_SAMPLE.inputMap, step)).eql(
          [flashes, map],
          `Case ${idx + 1} fails`,
        );
      });
    });
  });

  describe("Part II", () => {
    it("dumbo-octopus findSyncStep() LARGE_SAMPLE", () => {
      const { inputMap, syncStep } = LARGE_SAMPLE;
      expect(DumboOctopus.findSyncStep(inputMap)).eq(syncStep);
    });
  });
});
