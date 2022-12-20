import * as fs from "fs";
import * as path from "path";

interface ReadInputOpts {
  type: "string" | "number";
}

function readInput(inputPathOrUrl: string | URL, opts: ReadInputOpts): string[] | number[] {
  let absPathOrUrl: string | URL = "";

  if (typeof inputPathOrUrl === "string") {
    absPathOrUrl = path.isAbsolute(inputPathOrUrl)
      ? inputPathOrUrl
      : path.resolve(process.cwd(), inputPathOrUrl);
  } else {
    absPathOrUrl = inputPathOrUrl;
  }

  const reducedResult = fs
    .readFileSync(absPathOrUrl, { encoding: "utf-8" })
    .split("\n")
    .map((l) => l.trim())
    .reduce<[string[], string[], boolean]>(
      (mem, l) => {
        const [accum, buf, bStarted] = mem;
        return l.length > 0
          ? [bStarted ? accum.concat(...buf, l) : [l], [], true]
          : [accum, buf.concat(l), bStarted];
      },
      [[], [], false],
    ); // Discard beginning and trailing empty lines

  if (opts.type === "string") return reducedResult[0];

  // Convert all values to number
  return reducedResult[0].map((l) => Number(l));
}

// Type guard
function isNotNullOrUndefined<T>(input: T | null | undefined): input is T {
  return input != null;
}

function capitalize(input: string): string {
  const arr = input.split(" ");
  return arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export { readInput, isNotNullOrUndefined, capitalize };
