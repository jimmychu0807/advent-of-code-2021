import { Direction } from "../utils/index.js";

interface Node {
  left: Node | number;
  right: Node | number;
}

type ExplodePayload = [number, number] | undefined;

const CharCode = {
  "0": "0".charCodeAt(0),
  "9": "9".charCodeAt(0),
};

const SPLIT_THRESHOLD = 10;
const EXPLODE_DEPTH = 4;

class Snailfish {
  static parseToTree(input: string): [Node, number] {
    let cursor = 1;
    let bComma = false;

    let left: Node | number | undefined;
    let right: Node | number | undefined;
    let endCursor: number | undefined;

    while (cursor < input.length) {
      if (input.charAt(cursor) === "[") {
        if (bComma) {
          [right, endCursor] = this.parseToTree(input.slice(cursor));
        } else {
          [left, endCursor] = this.parseToTree(input.slice(cursor));
        }

        cursor += endCursor;
        continue;
        //
      } else if (input.charAt(cursor) === ",") {
        bComma = true;
        cursor += 1;
        continue;
        //
      } else if (input.charAt(cursor) === "]") {
        return [{ left: left!, right: right! }, cursor + 1];
        //
      } else {
        // handling numbers
        endCursor = cursor;
        while (
          input.charCodeAt(endCursor) >= CharCode["0"] &&
          input.charCodeAt(endCursor) <= CharCode["9"]
        ) {
          endCursor++;
        }

        if (bComma) {
          right = Number(input.slice(cursor, endCursor));
        } else {
          left = Number(input.slice(cursor, endCursor));
        }

        cursor = endCursor;
      }
    }

    throw new Error("Unexpected end of input");
  }

  // The return value is a tuple: [boolean, ExplodePayload]:
  // - `boolean`: indicates there there is a node reduection in this level or below.
  // - `ExplodePayload`: indicates the unprocessed exploded values, both on left and
  //    right side. `Split` operation has no payload, i.e. `undefined`.
  static recReduce(node: Node | number, depth = 0): [boolean, ExplodePayload] {
    if (typeof node === "number" && node >= SPLIT_THRESHOLD) {
      // Handling split
      const left = Math.floor(node / 2);
      node = { left, right: node - left };
      return [true, undefined];
    } else if (typeof node === "object") {
      if (depth >= EXPLODE_DEPTH) {
        const payload: ExplodePayload = [node.left as number, node.right as number];
        node = 0;
        return [true, payload];
      }

      // dealing on the left children
      let [updated, payload] = this.recReduce(node.left, depth + 1);
      if (updated) {
        if (!payload) return [updated, undefined];

        if (payload[1] > 0) this.pushToChildren(payload[1], node.right, Direction.Left);
        return [updated, [payload[0], 0]];
      }

      // dealing on the right children
      [updated, payload] = this.recReduce(node.right, depth + 1);
      if (updated) {
        if (!payload) return [updated, undefined];

        if (payload[0] > 0) this.pushToChildren(payload[0], node.left, Direction.Right);
        return [updated, [0, payload[1]]];
      }
    }

    return [false, undefined];
  }

  static pushToChildren(value: number, node: Node | number, dir: Direction): void {
    if (typeof node === "number") {
      node += value;
    } else {
      this.pushToChildren(value, dir === Direction.Left ? node.left : node.right, dir);
    }
  }

  static reduceTree(tree: Node): Node {
    let updated = true;

    while (updated) {
      updated = false;
      [updated] = this.recReduce(tree);
    }

    return tree;
  }

  static magnitude(node: Node | number): number {
    if (typeof node === "number") return node;
    return this.magnitude(node.left) * 3 + this.magnitude(node.right) * 2;
  }
}

export { Snailfish as default, Node };
