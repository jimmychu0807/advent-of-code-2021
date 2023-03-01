type RegisterType = "w" | "x" | "y" | "z";

class ALU {
  protected w = 0;
  protected x = 0;
  protected y = 0;
  protected z = 0;

  get state() {
    const { w, x, y, z } = this;
    return { w, x, y, z };
  }

  public init(): void {
    this.w = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  public parse(instructions: string[], input: number[]) {
    const getOpVal = (operand: string): number => {
      const asNum = Number(operand);
      return Number.isNaN(asNum) ? this[operand as RegisterType]! : asNum;
    };

    this.init();
    instructions.forEach((ins) => {
      const splitted = ins.split(/\s+/);
      const [op, reg, operand] = splitted;

      // console.log(ins);

      switch (op) {
        case "inp":
          this[reg as RegisterType] = Number(input.shift()!);
          break;
        case "add": // this is add
          this[reg as RegisterType] += getOpVal(operand!);
          break;
        case "mul":
          this[reg as RegisterType] *= getOpVal(operand!);
          break;
        case "div":
          this[reg as RegisterType] = Math.trunc(this[reg as RegisterType] / getOpVal(operand!));
          break;
        case "mod":
          this[reg as RegisterType] = this[reg as RegisterType] % getOpVal(operand!);
          break;
        case "eql":
          this[reg as RegisterType] = this[reg as RegisterType] === getOpVal(operand!) ? 1 : 0;
          break;
      }

      // console.log(this.state);
    });

    return this.state;
  }
}

export { ALU as default };
