import { Direction } from "../utils/index.js";
import Debug from "debug";

type Payload = [number, number] | undefined;

const log = Debug("snailfish");
const SPLIT_THRESHOLD = 10;
const EXPLODE_DEPTH = 4;

class Node {
  branches: [Node, Node] | undefined;
  value: number | undefined;

  constructor(param1: number | string | Node, param2?: Node) {
    if ((typeof param1 === "number" || typeof param1 === "string") && param2 === undefined) {
      this.branches = undefined;
      this.value = Number(param1);
    } else if (param1 instanceof Node && param2 instanceof Node) {
      this.branches = [param1, param2];
      this.value = undefined;
    } else {
      throw new Error(`Error construction parameters: ${param1}, ${param2}`);
    }
  }

  get left(): Node {
    if (this.isLeaf()) throw new Error("Cannot called left getter on a leaf node.");
    return this.branches![0];
  }

  get right(): Node {
    if (this.isLeaf()) throw new Error("Cannot called right getter on a leaf node.");
    return this.branches![1];
  }

  isLeaf(): this is { value: number } {
    return this.value !== undefined;
  }

  isNode(): this is { branches: [Node, Node] } {
    return !this.isLeaf();
  }

  magnitude(): number {
    if (this.isLeaf()) return this.value;
    return this.left.magnitude() * 3 + this.right.magnitude() * 2;
  }

  toString(): string {
    return this.isLeaf()
      ? String(this.value)
      : `[${this.left.toString()},${this.right.toString()}]`;
  }

  // boolean result indicates if the tree has been updated. It will only split at most one node
  //   per call.
  split(): boolean {
    if (this.isNode()) return this.left.split() || this.right.split();

    // Reaching here means the node is a leaf node.
    const nodeVal = this.value as number;
    if (nodeVal >= SPLIT_THRESHOLD) {
      const leftVal = Math.floor(nodeVal / 2);
      const rightVal = nodeVal - leftVal;
      // Update the node
      this.branches = [new Node(leftVal), new Node(rightVal)];
      this.value = undefined;
      return true;
    }
    return false;
  }

  pushToLeaf(value: number, dir: Direction): void {
    if (this.isNode())
      return dir == Direction.Left
        ? this.left.pushToLeaf(value, dir)
        : this.right.pushToLeaf(value, dir);

    this.value! += value;
  }

  explode(depth = 0): [boolean, Payload] {
    // checking of `this.isNode()`, but couldn't use it as we have logic to set `this.branches` inside.
    if (Array.isArray(this.branches)) {
      if (depth >= EXPLODE_DEPTH) {
        const payload: [number, number] = [this.left.value!, this.right.value!];
        this.branches = undefined;
        this.value = 0;
        return [true, payload];
      }
      // Handling left branch
      let [updated, payload] = this.left.explode(depth + 1);
      if (updated && payload) {
        if (payload[1] > 0) this.right.pushToLeaf(payload[1], Direction.Left);
        return [true, [payload[0], 0]];
      }
      // Handling right branch
      [updated, payload] = this.right.explode(depth + 1);
      if (updated && payload) {
        if (payload[0] > 0) this.left.pushToLeaf(payload[0], Direction.Right);
        return [true, [0, payload[1]]];
      }
    } else if (depth > EXPLODE_DEPTH) {
      // This logic should never be reach - a leaf node and its depth is greater than EXPLODE_DEPTH. It can only be at most === EXPLODE_DEPTH.
      throw new Error(
        "Node is a leaf node and its depth is greater than EXPLODE_DEPTH - should not reach here",
      );
    }

    return [false, undefined];
  }

  reduce(): Node {
    let updated = true;
    let iter = 1;

    while (updated) {
      [updated] = this.explode();
      updated = updated || this.split();

      log(`iter ${iter}: ${this.toString()}`);
      iter++;
    }

    return this;
  }

  sum(input: string | Node): Node {
    if (this.isLeaf()) throw new Error("Cannot perform sum() operation on a leaf node.");

    const inputNode = typeof input === "string" ? Snailfish.parse(input) : input;
    return new Node(this, inputNode).reduce();
  }
}

const enum ParseState {
  Start,
  NewNode,
  Comma,
}

function parseVal(input: string): [string, number] {
  for (let idx = 0; idx < input.length; idx++) {
    if (!isNaN(Number.parseInt(input.charAt(idx)))) continue;
    return [input.slice(0, idx), idx];
  }
  return [input.slice(0, input.length), input.length];
}

class Snailfish {
  static recParse(input: string): [Node, number] {
    let cursor = 0;
    let state = ParseState.Start;
    let left: Node | undefined;
    let right: Node | undefined;

    while (cursor < input.length) {
      if (input.charAt(cursor) === "[") {
        if (state === ParseState.Start) {
          state = ParseState.NewNode;
          cursor++;
        } else {
          const [node, endCursor] = this.recParse(input.slice(cursor));
          state === ParseState.NewNode ? (left = node) : (right = node);
          cursor += endCursor;
        }
      } else if (input.charAt(cursor) === "]") {
        return [new Node(left!, right!), cursor + 1];
      } else if (input.charAt(cursor) === ",") {
        state = ParseState.Comma;
        cursor++;
      } else {
        // parsing number
        if (state === ParseState.Start) {
          const [val, endCursor] = parseVal(input.slice(cursor));
          return [new Node(val), cursor + endCursor];
        } else {
          const [node, endCursor] = this.recParse(input.slice(cursor));
          state === ParseState.NewNode ? (left = node) : (right = node);
          cursor += endCursor;
        }
      }
    }

    throw new Error("Unexpected end of input");
  }

  static parse(input: string): Node {
    return this.recParse(input)[0];
  }
}

export { Snailfish as default, Node };
