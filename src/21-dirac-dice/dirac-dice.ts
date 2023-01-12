const DICE_FACES = 100;
const WIN_SCORE = 1000;
const BOARD_SPACES = 10;

const enum NextRoll {
  P1,
  P2,
}

class Dice {
  private faces: number;
  private prevRoll: number | undefined;
  private _rollNum: number;

  constructor(faces: number) {
    this.faces = faces;
    this._rollNum = 0;
    this.prevRoll = undefined;
  }

  roll(): number {
    this.prevRoll =
      this.prevRoll === undefined || this.prevRoll === this.faces ? 1 : this.prevRoll + 1;
    this._rollNum++;
    return this.prevRoll;
  }

  rollNum(): number {
    return this._rollNum;
  }
}

class DiracDice {
  static newPosWithRoll(pos: number, roll: number): number {
    const idx = pos - 1;
    const newIdx = (idx + roll) % BOARD_SPACES;
    return newIdx + 1;
  }

  static simulate(p1InitPos: number, p2InitPos: number): [number, number] {
    let p1Score = 0,
      p2Score = 0;
    let p1Pos = p1InitPos,
      p2Pos = p2InitPos;

    let state = NextRoll.P1;
    const dice = new Dice(DICE_FACES);

    while (p1Score < WIN_SCORE && p2Score < WIN_SCORE) {
      const rolls: [number, number, number] = [dice.roll(), dice.roll(), dice.roll()];
      const sumRolls = rolls.reduce((prev, roll) => prev + roll);
      if (state == NextRoll.P1) {
        p1Pos = this.newPosWithRoll(p1Pos, sumRolls);
        p1Score += p1Pos;
      } else {
        p2Pos = this.newPosWithRoll(p2Pos, sumRolls);
        p2Score += p2Pos;
      }
      state = state === NextRoll.P1 ? NextRoll.P2 : NextRoll.P1;
    }

    return p1Score >= WIN_SCORE ? [0, p2Score * dice.rollNum()] : [1, p1Score * dice.rollNum()];
  }
}

export { DiracDice, Dice };
