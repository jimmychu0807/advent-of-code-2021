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
  readonly heap: Array<number>; // heap position -> ki lookup
  readonly reverseLookup: Array<number>; // ki -> heap position lookup
  readonly values: Array<V | undefined>; // ki -> value lookup
  readonly comparator: (v1: V, v2: V) => number;

  constructor(com: (v1: V, v2: V) => number) {
    this.keyToKi = new Map();
    this.kiToKey = [];
    this.heap = [];
    this.reverseLookup = [];
    this.values = [];
    this.comparator = com;
  }

  public insert(key: K, val: V): void {
    if (this.contains(key)) return this.update(key, val);

    this.kiToKey.push(key);
    const ki = this.kiToKey.length - 1;

    this.keyToKi.set(key, ki);
    this.values.push(val);
    this.heap.push(ki);
    this.reverseLookup.push(ki);

    // Do a `swim up` operation
    this.heapNodeSwimUp(this.heap.length - 1);
  }

  public size(): number {
    return this.heap.length;
  }

  public update(key: K, val: V): void {
    if (!this.contains(key)) return this.insert(key, val);

    const ki = this.keyToKi.get(key)!;
    this.values[ki] = val;
    const curIdx = this.reverseLookup[ki]!;

    this.heapNodeSwimUp(curIdx);
    this.heapNodeSwimDown(curIdx);
  }

  public contains(key: K): boolean {
    const ki = this.keyToKi.get(key);
    return ki !== undefined;
  }

  public valueOf(key: K): V | undefined {
    const ki = this.keyToKi.get(key);
    return ki ? this.values[ki] : undefined;
  }

  public peekMinEntry(): [K, V] | undefined {
    if (this.heap.length === 0) return undefined;

    const ki = this.heap[0]!;
    return [this.kiToKey[ki]!, this.values[ki]!];
  }

  public popMinEntry(): [K, V] | undefined {
    if (this.heap.length === 0) return undefined;

    const rootIdxKi = this.heap[0]!;
    const key = this.kiToKey[rootIdxKi]!;
    const value = this.values[rootIdxKi]!;

    const lastIdx = this.heap.length - 1;
    const lastIdxKi = this.heap[lastIdx]!;

    swapEls(this.heap, 0, lastIdx);
    swapEls(this.reverseLookup, rootIdxKi, lastIdxKi);

    // Remove the last entry and its bookkeeping
    this.keyToKi.delete(key);
    this.kiToKey[rootIdxKi] = undefined;
    this.values[rootIdxKi] = undefined;
    this.reverseLookup[rootIdxKi] = -1;
    this.heap.pop(); // Using `pop` so heap.length will decrease by 1.

    this.heapNodeSwimDown(0);

    return [key, value];
  }

  protected heapNodeSwimUp(heapIdx: number) {
    let idx = heapIdx;

    while (idx > 0) {
      const idxKi = this.heap[idx]!;
      const idxVal = this.values[idxKi]!;

      const parentIdx = idx % 2 === 0 ? (idx - 2) / 2 : (idx - 1) / 2;
      const parentIdxKi = this.heap[parentIdx]!;
      const parentIdxVal = this.values[parentIdxKi]!;

      if (this.comparator(parentIdxVal, idxVal) <= 0) break;

      swapEls(this.heap, idx, parentIdx);
      swapEls(this.reverseLookup, idxKi, parentIdxKi);

      idx = parentIdx;
    }
  }

  protected heapNodeSwimDown(heapIdx: number) {
    let idx = heapIdx;

    while (idx < this.heap.length) {
      const curVal = this.values[this.heap[idx]!]!;
      const leftChildIdx = idx * 2 + 1;
      const leftChildVal =
        leftChildIdx < this.heap.length ? this.values[this.heap[leftChildIdx]!] : undefined;
      const rightChildIdx = idx * 2 + 2;
      const rightChildVal =
        rightChildIdx < this.heap.length ? this.values[this.heap[rightChildIdx]!] : undefined;

      // check the heap invariant
      if (
        (!leftChildVal || this.comparator(curVal, leftChildVal) <= 0) &&
        (!rightChildVal || this.comparator(curVal, rightChildVal) <= 0)
      )
        break;

      // find the idx with lowest value, assume to be the left child idx first.
      let swapIdx = leftChildIdx;
      if (rightChildVal !== undefined && this.comparator(leftChildVal!, rightChildVal) > 0) {
        swapIdx = rightChildIdx;
      }

      // swap idx and swapIdx
      const idxKi = this.heap[idx]!;
      const swapIdxKi = this.heap[swapIdx]!;
      swapEls(this.heap, idx, swapIdx);
      swapEls(this.reverseLookup, idxKi, swapIdxKi);

      idx = swapIdx;
    }
  }
}

export { IndexedPriorityQueue as default };
