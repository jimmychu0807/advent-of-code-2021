const DICE_FACES1 = 100;
const DICE_FACES2 = 3;
const ROLLS_ONE_TURN = 3;
const WIN_SCORE1 = 1000;
const WIN_SCORE2 = 21;
const BOARD_SPACES = 10;

interface PlayerInfo {
  score: number;
  pos: number;
}

const enum NextRoll {
  P1,
  P2,
}

interface Options {
  diceFaces: number;
  rollsOneTurn: number;
  winningScore: number;
}

type RollAndFreq = { [key: number]: number };

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

// Return value [sum, the frequency]
function permutateAndSum(diceFace: number, rollTimes: number): RollAndFreq {
  let rollsResult: number[][] = [[]];

  for (let rollIdx = 0; rollIdx < rollTimes; rollIdx++) {
    const newResult: number[][] = [];
    while (rollsResult.length > 0) {
      const prevRoll = rollsResult.shift();
      for (let roll = 1; roll <= diceFace; roll++) {
        const withNewRoll = [...prevRoll!, roll];
        newResult.push(withNewRoll);
      }
    }
    rollsResult = newResult;
  }

  const sumCount: { [key: number]: number } = {};
  rollsResult.forEach((rolls) => {
    const sumRolls = rolls.reduce((prev, roll) => prev + roll);
    sumCount[sumRolls] = sumCount[sumRolls] ? sumCount[sumRolls]! + 1 : 1;
  });

  return sumCount;
}

class DiracDice {
  static newPosWithRoll(pos: number, roll: number): number {
    const idx = pos - 1;
    const newIdx = (idx + roll) % BOARD_SPACES;
    return newIdx + 1;
  }

  static simulate1(p1InitPos: number, p2InitPos: number): [number, number] {
    let p1Score = 0,
      p2Score = 0;
    let p1Pos = p1InitPos,
      p2Pos = p2InitPos;

    let state = NextRoll.P1;
    const dice = new Dice(DICE_FACES1);

    while (p1Score < WIN_SCORE1 && p2Score < WIN_SCORE1) {
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

    return p1Score >= WIN_SCORE1 ? [0, p2Score * dice.rollNum()] : [1, p1Score * dice.rollNum()];
  }

  static recSimulate2(
    movePlayer: PlayerInfo,
    nextPlayer: PlayerInfo,
    accFreq: number,
    lv: number,
    opts: Options,
  ): [number, number] {
    // Terminal condition
    if (nextPlayer.score >= opts.winningScore) return [0, accFreq];

    let totResult: [number, number] = [0, 0];

    const rollAndFreq = permutateAndSum(opts.diceFaces, opts.rollsOneTurn);

    for (const [roll, freq] of Object.entries(rollAndFreq)) {
      const newPos = this.newPosWithRoll(movePlayer.pos, Number(roll));
      const newScore = movePlayer.score + newPos;

      const moved: PlayerInfo = { pos: newPos, score: newScore };
      const res = this.recSimulate2(nextPlayer, moved, accFreq * freq, lv + 1, opts);

      totResult = [totResult[0] + res[1], totResult[1] + res[0]];
    }

    return totResult;
  }

  static simulate2(
    p1InitPos: number,
    p2InitPos: number,
    opts: Options = {
      diceFaces: DICE_FACES2,
      rollsOneTurn: ROLLS_ONE_TURN,
      winningScore: WIN_SCORE2,
    },
  ): [number, number] {
    const p1: PlayerInfo = { score: 0, pos: p1InitPos };
    const p2: PlayerInfo = { score: 0, pos: p2InitPos };

    return this.recSimulate2(p1, p2, 1, 1, opts);
  }
}

export { DiracDice, Dice, permutateAndSum };
