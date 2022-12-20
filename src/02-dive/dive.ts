type Coordinate = [number, number];

interface Options {
  op: "noop" | "multiplication" | "aim" | "aimWithMultiplication";
}

class Dive {
  input: string[];

  constructor(input: string[]) {
    this.input = input;
  }

  execute(opts: Options = { op: "noop" }): Coordinate | number {
    let xPos = 0;
    let yPos = 0;
    let aim = 0;

    const bAim = opts.op === "aim" || opts.op === "aimWithMultiplication";

    this.input.forEach((line) => {
      // Ignore the empty lines
      if (line.match(/^\s*$/)) return;

      const [ins, step] = line.split(" ");
      const nStep = Number(step);

      switch (ins) {
        case "forward":
          if (bAim) {
            xPos += nStep;
            yPos += nStep * aim;
          } else {
            xPos += nStep;
          }
          break;
        case "up":
          if (bAim) {
            aim -= nStep;
          } else {
            yPos -= nStep;
          }
          break;
        case "down":
          if (bAim) {
            aim += nStep;
          } else {
            yPos += nStep;
          }
          break;
        default:
          throw new Error(`Unknown instruction ${ins}`);
      }
    });

    switch (opts.op) {
      case "noop":
      case "aim":
        return [xPos, yPos];
      case "multiplication":
      case "aimWithMultiplication":
        return xPos * yPos;
      default:
        throw new Error(`Unknown opts.op ${opts.op}`);
    }
  }
}

export { Dive as default, Dive };
