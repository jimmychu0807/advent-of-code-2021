const DICE_FACES1 = 100;
const DICE_FACES2 = 3;
const ROLLS_ONE_TURN = 3;
const WIN_SCORE1 = 1000;
const WIN_SCORE2 = 21;
const BOARD_SPACES = 10;

import Debug from "debug";
const log = Debug("dirac-dice");

interface PlayerRecord {
  score: number;
  pos: number;
  freq: number;
}

type RollAndFreq = { [key: number]: number };

const enum NextRoll {
  P1,
  P2,
}

const enum Ops {
  Multiply,
  Replace,
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

  static simulate2OneTurn(
    prevMoves: PlayerRecord[],
    opts = {
      diceFaces: DICE_FACES2,
      rollsOneTurn: ROLLS_ONE_TURN,
    },
  ): PlayerRecord[] {
    const rollAndFreq = permutateAndSum(opts.diceFaces, opts.rollsOneTurn);
    const newMoves: PlayerRecord[] = [];

    prevMoves.forEach((prevMove) => {
      Object.entries(rollAndFreq).forEach(([roll, freq]) => {
        const newPos = this.newPosWithRoll(prevMove.pos, Number(roll));
        const newScore = prevMove.score + newPos;
        const newFreq = prevMove.freq * freq;
        newMoves.push({ score: newScore, pos: newPos, freq: newFreq });
      });
    });

    return newMoves;
  }

  static countWinning(moves: PlayerRecord[], winScore: number): [number, number[]] {
    const winningIdc: number[] = [];
    let wonFreq = 0;
    moves.forEach((move, idx) => {
      if (move.score < winScore) return;
      wonFreq += move.freq;
      winningIdc.push(idx);
    });
    return [wonFreq, winningIdc];
  }

  static opsFreq(targetMoves: PlayerRecord[], baseMoves: PlayerRecord[], ops: Ops) {
    // When we apply this op, ensure both moves array has the same length
    if (targetMoves.length !== baseMoves.length) {
      throw new Error("Expect newMoves length to equal p1PrevMoves, but actually not.");
    }

    for (let i = 0; i < targetMoves.length; i++) {
      if (ops === Ops.Multiply) {
        targetMoves[i]!.freq *= baseMoves[i]!.freq;
      } else if (ops === Ops.Replace) {
        targetMoves[i]!.freq = baseMoves[i]!.freq;
      }
    }
  }

  static simulate2(
    p1InitPos: number,
    p2InitPos: number,
    winScore: number = WIN_SCORE2,
  ): [number, number] {
    let p1WonFreq = 0,
      p2WonFreq = 0;
    let p1PrevMoves: PlayerRecord[] = [{ score: 0, pos: p1InitPos, freq: 1 }];
    let p2PrevMoves: PlayerRecord[] = [{ score: 0, pos: p2InitPos, freq: 1 }];
    let state = NextRoll.P1;
    let wonFreq: number,
      skipIdc: number[] = [];

    while (p1PrevMoves.length !== 0 || p2PrevMoves.length !== 0) {
      if (state === NextRoll.P1) {
        // remove from p1PrevMoves because they have been won by p2.
        p1PrevMoves = p1PrevMoves.filter((_, idx) => !skipIdc.includes(idx));
        this.opsFreq(p1PrevMoves, p2PrevMoves, Ops.Replace);

        const newMoves = this.simulate2OneTurn(p1PrevMoves);

        // count number of winning freq there, also remember the winning pos index, so the other
        //   player will skip for that dice rolling.
        [wonFreq, skipIdc] = this.countWinning(newMoves, winScore);
        p1WonFreq += wonFreq;
        // remove the winning move
        p1PrevMoves = newMoves.filter((move) => move.score < winScore);
      } else {
        // replace all freq in p2PrevMoves to 1
        p2PrevMoves.forEach(move => {
          move.freq = 1;
        });

        let newMoves = this.simulate2OneTurn(p2PrevMoves);

        // remove the move that p1 have already won
        newMoves = newMoves.filter((_, idx) => !skipIdc.includes(idx));

        // multiply the freq of newMoves with those from p1PrevMoves
        this.opsFreq(newMoves, p1PrevMoves, Ops.Multiply);

        [wonFreq, skipIdc] = this.countWinning(newMoves, winScore);
        p2WonFreq += wonFreq;
        p2PrevMoves = newMoves.filter((move) => move.score < winScore);
      }

      log(`-- ${state} --`);
      log("p1PrevMoves:", p1PrevMoves);
      log("p1WonFreq:", p1WonFreq);
      log("p2PrevMoves:", p2PrevMoves);
      log("p2WonFreq:", p2WonFreq);
      log("skipIdc", skipIdc);

      // switching the state
      state = state === NextRoll.P1 ? NextRoll.P2 : NextRoll.P1;
    }

    return [p1WonFreq, p2WonFreq];
  }
}

export { DiracDice, Dice, permutateAndSum };
