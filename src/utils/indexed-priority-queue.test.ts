// Min indexed priority queue
// Ref: https://www.youtube.com/watch?v=jND_WJ8r7FE

import { expect } from "chai";
import IndexedPriorityQueue from "./indexed-priority-queue.js";

// prettier-ignore
const TEST_DATA: [string, number, number][] = [ // key, ki, value
  ['Alice',   0,  3],
  ['Bob',     1, 15],
  ['Charlie', 2, 11],
  ['Dave',    3, 17],
  ['Eve',     4,  7],
  ['Fred',    5,  9],
  ['Grace',   6,  2],
];

describe("Indexed Priority Queue test", () => {
  it("can insert data correctly", () => {
    const ipq = new IndexedPriorityQueue<string, number>((v1, v2) => v1 - v2);
    const resultKeyToKi: Map<string, number> = new Map();
    TEST_DATA.forEach(([key, ki, val]) => {
      ipq.insert(key, val);
      resultKeyToKi.set(key, ki);
    });

    expect(ipq.keyToKi).to.eql(resultKeyToKi);
    expect(ipq.kiToKey).to.eql(["Alice", "Bob", "Charlie", "Dave", "Eve", "Fred", "Grace"]);
    expect(ipq.values).to.eql([3, 15, 11, 17, 7, 9, 2]);
    expect(ipq.heap).to.eql([6, 4, 0, 3, 1, 2, 5]);
    expect(ipq.reverseLookup).to.eql([2, 4, 5, 3, 1, 6, 0]);
  });

  it("can check and look up value properly", () => {
    const ipq = new IndexedPriorityQueue<string, number>((v1, v2) => v1 - v2);
    TEST_DATA.forEach(([key, , val]) => ipq.insert(key, val));

    expect(ipq.size()).to.eq(7);
    expect(ipq.contains("Grace")).to.true;
    expect(ipq.contains("Gilbert")).to.false;
    expect(ipq.valueOf("Fred")).to.eq(9);
    expect(ipq.peekMinEntry()).to.eql(["Grace", 2]);
  });

  it("can pop the min entry properly", () => {
    const ipq = new IndexedPriorityQueue<string, number>((v1, v2) => v1 - v2);
    TEST_DATA.forEach(([key, , val]) => ipq.insert(key, val));

    const sorted = [...TEST_DATA].sort((a, b) => a[2] - b[2]);

    for (let idx = 0; idx < TEST_DATA.length; idx++) {
      const [expectKey, , expectVal] = sorted[idx]!;
      const result = ipq.popMinEntry();
      expect(result).to.eql([expectKey, expectVal]);
    }
    expect(ipq.size()).to.eq(0);
  });

  it("can update the IPQ properly", () => {
    const ipq = new IndexedPriorityQueue<string, number>((v1, v2) => v1 - v2);
    TEST_DATA.forEach(([key, , val]) => ipq.insert(key, val));

    ipq.update("Eve", 18);

    const sorted: [string, number, number][] = JSON.parse(JSON.stringify(TEST_DATA));
    sorted[4]![2] = 18;
    sorted.sort((a, b) => a[2] - b[2]);

    for (let idx = 0; idx < TEST_DATA.length; idx++) {
      const [expectKey, , expectVal] = sorted[idx]!;
      const result = ipq.popMinEntry();
      expect(result).to.eql([expectKey, expectVal]);
    }
    expect(ipq.size()).to.eq(0);
  });

  // TODO: test doing all ops at once
  it("test mixing all operations at once", () => {
    const ipq = new IndexedPriorityQueue<string, number>((v1, v2) => v1 - v2);
    const arr1 = TEST_DATA.slice(0, 4);
    const arr2 = TEST_DATA.slice(4);

    arr1.forEach(([key, , val]) => ipq.insert(key, val));

    let res = ipq.popMinEntry();
    expect(res).to.eql(["Alice", 3]);
    res = ipq.popMinEntry();
    expect(res).to.eql(["Charlie", 11]);

    ipq.update("Bob", 18);
    arr2.forEach(([key, , val]) => ipq.insert(key, val));

    const keyOrder = [
      ["Grace", 2],
      ["Eve", 7],
      ["Fred", 9],
      ["Dave", 17],
      ["Bob", 18],
    ];
    while (ipq.size() > 0) {
      const res = ipq.popMinEntry();
      const expectRes = keyOrder.shift();
      expect(res).to.eql(expectRes);
    }
  });
});
