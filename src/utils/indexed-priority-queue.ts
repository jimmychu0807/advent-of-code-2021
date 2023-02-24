// Min indexed priority queue

// Ref: https://www.youtube.com/watch?v=jND_WJ8r7FE

function swapEls(arr: Array<number>, idx1: number, idx2: number) {
  const tmp = arr[idx1]!;
  arr[idx1] = arr[idx2]!;
  arr[idx2] = tmp;
}

class IndexedPriorityQueue<K, V> {
  // `Ki` stands for key-index
  readonly keyToKi: Map<K, number>; // key -> ki lookup
  readonly kiToKey: Array<K | undefined>; // ki -> key lookup
  readonly heapLookup: Array<number>; // ki -> heap position lookup
  readonly inverseLookup: Array<number>; // heap position -> ki lookup
  readonly values: Array<V | undefined>; // ki -> value lookup
  readonly comparator: (v1: V, v2: V) => number;

  constructor(com: (v1: V, v2: V) => number) {
    this.keyToKi = new Map();
    this.kiToKey = [];
    this.heapLookup = [];
    this.inverseLookup = [];
    this.values = [];
    this.comparator = com;
  }

  public insert(key: K, val: V): void {
    if (this.keyToKi.has(key)) {
      throw new Error(`The queue already contains entry with key: ${key}.`);
    }
    this.kiToKey.push(key);
    const ki = this.kiToKey.length - 1;

    this.keyToKi.set(key, ki);
    this.values.push(val);
    this.heapLookup.push(ki);
    this.inverseLookup.push(ki);

    // Do a `swim up` operation
    let heapIdx = this.heapLookup.length - 1;
    while (heapIdx > 0) {
      const parentIdx = heapIdx % 2 === 0 ? (heapIdx - 2) / 2 : (heapIdx - 1) / 2;
      const idxKi = this.inverseLookup[heapIdx]!;
      const idxVal = this.values[idxKi]!;
      const parentKi = this.inverseLookup[parentIdx]!;
      const parentVal = this.values[parentKi]!;
      if (this.comparator(parentVal, idxVal) <= 0) break;

      // swap the heapLookup and inverseLookup table
      swapEls(this.heapLookup, idxKi, parentKi);
      swapEls(this.inverseLookup, heapIdx, parentIdx);

      heapIdx = parentIdx;
    }
  }

  public size(): number {
    return this.heapLookup.length;
  }

  // public update(key: K, val: V): void {
  // }

  public contains(key: K): boolean {
    const ki = this.keyToKi.get(key);
    return ki !== undefined;
  }

  public valueOf(key: K): V | undefined {
    const ki = this.keyToKi.get(key);
    return ki ? this.values[ki] : undefined;
  }

  public peekMinEntry(): [K, V] | undefined {
    if (this.heapLookup.length === 0) return undefined;

    const ki = this.inverseLookup[0]!;
    return [this.kiToKey[ki]!, this.values[ki]!];
  }

  public popMinEntry(): [K, V] | undefined {
    const rootIdx = 0;
    let rootIdxKi = this.inverseLookup[rootIdx]!;

    const key = this.kiToKey[rootIdxKi]!;
    const value = this.values[rootIdxKi]!;

    const lastIdx = this.heapLookup.length - 1;
    const lastIdxKi = this.inverseLookup[lastIdx]!;

    swapEls(this.heapLookup, rootIdxKi, lastIdxKi);
    swapEls(this.inverseLookup, rootIdx, lastIdx);

    // Remove the last entry and its bookkeeping
    this.keyToKi.delete(key);
    this.kiToKey[rootIdxKi] = undefined;
    this.heapLookup[lastIdxKi] = -1;
    this.inverseLookup[lastIdx] = -1;
    this.values[rootIdxKi] = undefined;

    // TODO: swim down from rootIdx in the heap
    rootIdxKi = this.inverseLookup[rootIdx]!;
    const idx = rootIdx;
    while (idx < this.heapLookup.length) {
      const curVal = this.values[idx];
      const leftChildIdx = idx * 2 + 1;
      const leftChildVal =
        leftChildIdx < this.heapLookup.length
          ? this.values[this.inverseLookup[leftChildIdx]!]
          : undefined;
      const rightChildIdx = idx * 2 + 2;
      const rightChildVal =
        rightChildIdx < this.heapLookup.length
          ? this.values[this.inverseLookup[rightChildIdx]!]
          : undefined;

      // check the heap invariant
      if (
        (!leftChildVal || this.comparator(curVal!, leftChildVal) <= 0) &&
        (!rightChildVal || this.comparator(curVal!, rightChildVal) <= 0)
      )
        break;

      // find the idx with lowest value, assume to be the left child idx first.
      let swapIdx = leftChildIdx;
      if (rightChildVal !== undefined && this.comparator(leftChildVal!, rightChildVal) > 0) {
        swapIdx = rightChildIdx;
      }

      // swap idx and swapIdx
      swapEls(this.heapLookup, this.heapLookup[idx]!, this.heapLookup[swapIdx]!);
      swapEls(this.inverseLookup, idx, swapIdx);
    }

    return [key, value];
  }
}

export { IndexedPriorityQueue as default };
