// Min indexed priority queue

// Ref: https://www.youtube.com/watch?v=jND_WJ8r7FE

function swapEls(arr: Array<number>, idx1: number, idx2: number) {
  let tmp = arr[idx1]!;
  arr[idx1] = arr[idx2]!;
  arr[idx2] = tmp;
}

class IndexedPriorityQueue<K, V> {
  protected keyToKi: Map<K, number>;  // `Ki` stands for key-index
  protected kiToKey: Array<K>;
  protected heapLookup: Array<number>;
  protected inverseLookup: Array<number>;
  protected values: Array<V>;
  protected comparator: (v1: V, v2: V) => number;

  constructor(com: (v1: V, v2: V) => number) {
    this.keyToKi = new Map();
    this.kiToKey = new Array();
    this.heapLookup = new Array();
    this.inverseLookup = new Array();
    this.values = new Array();
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
      const parentIdx = heapIdx % 2 === 0 ? (heapIdx - 2)/2 : (heapIdx - 1)/2;
      const idxKi  = this.inverseLookup[heapIdx]!;
      const idxVal = this.values[idxKi]!;
      const parentKi  = this.inverseLookup[parentIdx]!;
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
    const rootKi = this.inverseLookup[]
    const lastIdx = this.heapLookup.length - 1;
  }
}
