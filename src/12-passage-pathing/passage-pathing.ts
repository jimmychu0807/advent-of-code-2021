// Type guard for a valid path
function validPath(path: (string | undefined)[]): path is string[] {
  return path.every((el) => el);
}

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
  ): (string | undefined)[][] {
    if (node === "end") return [["end"]];
    if (noRepeat.includes(node)) return [[undefined]];
    if (node.toLowerCase() === node) noRepeat.push(node);

    return caveMap[node]!.reduce((memo: (string | undefined)[][], child: string) => {
      const paths = this.#recSearchPaths(caveMap, child, [...noRepeat])
        .filter(validPath) // filter out paths with `undefined` node
        .map((path) => [node, ...path]);

      return memo.concat(paths);
    }, []);
  }

  static searchPaths(input: string[]): string[] {
    const caveMap = this.mapCave(input);

    return this.#recSearchPaths(caveMap, "start", [])
      .filter(validPath)
      .map((path) => path.join(","));
  }
}

export { PassagePathing as default };
