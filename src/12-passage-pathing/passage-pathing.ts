// Type guard for a valid path
const validPath = (path: (string | undefined)[]): path is string[] => path.every((el) => el);

const countOccurrence = (arr: string[], target: string): number =>
  arr.filter((el) => el === target).length;

class PassagePathing {
  static mapCave(input: string[]): { [key: string]: string[] } {
    const caveMap: { [key: string]: string[] } = {};
    input.forEach((ln) => {
      const [start, end] = ln.split("-");
      if (!start || !end) throw new Error("Parsing map error.");

      caveMap[start] = (
        caveMap[start]
          ? caveMap[start]!.includes(end)
            ? caveMap[start]
            : caveMap[start]!.concat(end)
          : [end]
      )!;

      caveMap[end] = (
        caveMap[end]
          ? caveMap[end]!.includes(start)
            ? caveMap[end]
            : caveMap[end]!.concat(start)
          : [start]
      )!;
    });

    return caveMap;
  }

  static #recSearchPaths(
    caveMap: { [key: string]: string[] },
    node: string,
    noRepeat: string[],
    repeatSmallCave = "",
  ): (string | undefined)[][] {
    if (node === "end") return [["end"]];

    const occur = countOccurrence(noRepeat, node);
    if ((repeatSmallCave !== node && occur > 0) || (repeatSmallCave === node && occur > 1)) {
      return [[undefined]];
    }

    if (node.toLowerCase() === node) noRepeat.push(node);

    return caveMap[node]!.reduce((memo: (string | undefined)[][], child: string) => {
      const paths = this.#recSearchPaths(caveMap, child, [...noRepeat], repeatSmallCave)
        .filter(validPath) // filter out paths with `undefined` node
        .map((path) => [node, ...path]);

      return memo.concat(paths);
    }, []);
  }

  static searchPaths(input: string[], oneCaveRepeat = false): string[] {
    const caveMap = this.mapCave(input);

    if (!oneCaveRepeat) {
      return this.#recSearchPaths(caveMap, "start", [])
        .filter(validPath)
        .map((path) => path.join(","));
    } else {
      // Small cave can repeat once
      const smallCaves = Object.keys(caveMap).filter(
        (cave) => cave === cave.toLowerCase() && cave !== "start" && cave !== "end",
      );

      return smallCaves.reduce((memo: string[], sc: string) => {
        const paths = this.#recSearchPaths(caveMap, "start", [], sc)
          .filter(validPath)
          .map((path) => path.join(","));

        return memo.concat(paths.filter((path) => !memo.includes(path)));
      }, []);
    }
  }
}

export { PassagePathing as default };
