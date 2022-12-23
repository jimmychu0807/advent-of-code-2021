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
    if (!Array.isArray(caveMap[node])) {
      throw new Error(`Unknown ${node} passed in #recSearchPaths()`);
    }
    if (node === "end") return [["end"]];
    if (noRepeat.includes(node)) return [[undefined]];

    return caveMap[node]!.reduce((memo: string[][], child: string) => {
      if (child.toLowerCase() === child) noRepeat.push(child);

      const paths = this.#recSearchPaths(caveMap, child, noRepeat)
        .filter((path) => path.every((node) => node)) // filter out paths with `undefined` node
        .map((path) => [node, ...path]) as string[][];
      return memo.concat(paths);
    }, []);
  }

  static searchPaths(input: string[]): (string | undefined)[][] {
    const caveMap = this.mapCave(input);
    return this.#recSearchPaths(caveMap, "start", ["start"]);
  }
}

export { PassagePathing as default };
