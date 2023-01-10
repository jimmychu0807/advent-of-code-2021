import { Direction } from "../utils/index.js";

const CharCode = {
  "0": "0".charCodeAt(0),
  "9": "9".charCodeAt(0),
};

const SPLIT_THRESHOLD = 10;
const EXPLODE_DEPTH = 4;

class Node {
  private branches: [Node, Node] | undefined;
  private value: number | undefined;

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

  isLeaf(): boolean {
    return this.value !== undefined;
  }

  magnitude(): number {
    if (this.isLeaf()) return this.value as number;
    return this.left.magnitude() * 3 + this.right.magnitude() * 2;
  }

  toString(): string {
    return this.isLeaf()
      ? String(this.value)
      : `[${this.left.toString()},${this.right.toString()}]`;
  }

  reduce(): Node {
    return this;
  }

  sum(input: string | Node): Node {
    if (this.isLeaf()) throw new Error("Cannot perform sum() operation on a leaf node.");

    const inputNode = typeof input === "string" ? Snailfish.parse(input) : input;
    return new Node(this, inputNode).reduce();
  }

  // static reduce(tree: Node): Node {
  //   let updated = true;

  //   while (updated) {
  //     updated = this.recExplode(tree)[0] !== Op.Null;
  //     // If there is no explode, we start to handle split
  //     // ref: https://www.reddit.com/r/adventofcode/comments/rjqekd/2021_day_18_not_able_to_find_where_my_logic_goes/
  //     if (!updated) updated = this.recSplit(tree);

  //     console.dir(tree, {depth: null});

  //   }
  //   return tree;
  // }


}

// type Payload = [number, number] | undefined;

// const enum Op {
//   Split,
//   Explode,
//   ExplodeImmidiate,
//   Null,
// }

class Snailfish {
  static recParse(input: string): [Node, number] {
    let cursor = 1;
    let bComma = false;

    let left: Node | undefined;
    let right: Node | undefined;
    let endCursor: number = cursor;

    while (cursor < input.length) {
      if (input.charAt(cursor) === "[") {
        if (bComma) {
          [right, endCursor] = this.recParse(input.slice(cursor));
        } else {
          [left, endCursor] = this.recParse(input.slice(cursor));
        }
        cursor += endCursor;
        continue;
      } else if (input.charAt(cursor) === ",") {
        bComma = true;
        cursor += 1;
        continue;
      } else if (input.charAt(cursor) === "]") {
        return [new Node(left!, right!), cursor + 1];
      } else {
        // handling numbers
        endCursor = cursor;
        while (
          input.charCodeAt(endCursor) >= CharCode["0"] &&
          input.charCodeAt(endCursor) <= CharCode["9"]
        ) {
          endCursor++;
        }

        const leafNode = new Node(input.slice(cursor, endCursor));

        if (bComma) {
          right = leafNode;
        } else {
          left = leafNode;
        }
        cursor = endCursor;
      }
    }

    throw new Error("Unexpected end of input");
  }

  static parse(input: string): Node {
    return this.recParse(input)[0];
  }

  // The return value is a tuple: [boolean, Payload]:
  // - `boolean`: indicates there there is a node reduection in this level or below.
  // - `Payload`: indicates the unprocessed exploded values, both on left and
  //    right side. `Split` operation has no payload, i.e. `undefined`.
  // static recExplode(node: Node, depth = 0): [Op, Payload] {
  //   if (depth >= EXPLODE_DEPTH) {
  //     return [Op.ExplodeImmidiate, [node.left as number, node.right as number]];
  //   }

  //   // dealing on the left branch
  //   let [op, payload] = this.recExplode(node.left as Node, depth + 1);

  //   if (op === Op.ExplodeImmidiate) node.left = 0;

  //   if (op === Op.ExplodeImmidiate || op === Op.Explode) {
  //     if (payload![1] > 0) {
  //       // handle the right value of the payload
  //       typeof node.right === "number"
  //         ? (node.right += payload![1])
  //         : this.pushToChildren(payload![1], node.right, Direction.Left);
  //     }
  //     return [Op.Explode, [payload![0], 0]];
  //   }

  //   // dealing on the right branch
  //   [op, payload] = this.recExplode(node.right as Node, depth + 1);

  //   if (op === Op.ExplodeImmidiate) node.right = 0;

  //   if (op === Op.ExplodeImmidiate || op === Op.Explode) {
  //     if (payload![0] > 0) {
  //       // handle the left value of the payload
  //       typeof node.left === "number"
  //         ? (node.left += payload![0])
  //         : this.pushToChildren(payload![0], node.left, Direction.Right);
  //     }
  //     return [Op.Explode, [0, payload![1]]];
  //   }

  //   return [Op.Null, undefined];
  // }

  // static pushToChildren(value: number, node: Node, dir: Direction): void {
  //   if (dir === Direction.Left && typeof node.left === "number") {
  //     node.left += value;
  //     return;
  //   }

  //   if (dir === Direction.Right && typeof node.right === "number") {
  //     node.right += value;
  //     return;
  //   }

  //   return this.pushToChildren(
  //     value,
  //     dir === Direction.Left ? node.left as Node : node.right as Node,
  //     dir,
  //   );
  // }

  // static recSplit(node: Node): boolean {
  //   let updated = false;

  //   if (typeof node.left === "number" && node.left >= SPLIT_THRESHOLD) {
  //     const left = Math.floor(node.left / 2);
  //     node.left = { left, right: node.left - left };
  //     return true;
  //   }

  //   if (typeof node.right === "number" && node.right >= SPLIT_THRESHOLD) {
  //     const left = Math.floor(node.right / 2);
  //     node.right = { left, right: node.right - left };
  //     return true;
  //   }

  //   if (typeof node.left === "object" && typeof node.right === "object") {
  //     updated = this.recSplit(node.left);
  //     if (!updated) updated = this.recSplit(node.right);
  //   }

  //   return updated;
  // }
}

export { Snailfish as default, Node };
