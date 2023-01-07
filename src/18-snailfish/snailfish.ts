interface Tree {
  left: Tree | number;
  right: Tree | number;
}

const CharCode = {
  "0": "0".charCodeAt(0),
  "9": "9".charCodeAt(0),
};

class Snailfish {
  static parseToTree(input: string): [Tree, number] {
    let cursor = 1;
    let bComma = false;

    let left: Tree | number | undefined;
    let right: Tree | number | undefined;
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

  static reduce(tree: Tree): Tree {
    return tree;
  }

  static magnitude(node: Tree | number): number {
    if (typeof node === "number") return node;
    return this.magnitude(node.left) * 3 + this.magnitude(node.right) * 2;
  }
}

export { Snailfish as default, Tree };
