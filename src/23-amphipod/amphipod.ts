type Cost = { [key: string]: number };

interface InitConfig {
  roomCapacity: number;
  roomLoc: number[];
  roomContent: string[][];
  cost: Cost;
  corridorLen: number;
}

const BEGIN_PC_CODE = 65; // this is the charCode of 'A'

// This is how the initial config looks like:
//
// const INIT_CONFIG: InitConfig = {
//   roomCapacity: 2,
//   roomLoc: [2, 4, 6, 8],
//   roomContent: [
//     ["B", "A"],
//     ["C", "D"],
//     ["B", "C"],
//     ["D", "A"],
//   ],
//   cost: {
//     A: 1,
//     B: 10,
//     C: 100,
//     D: 1000,
//   },
//   corridorLen: 11,
// };

interface Loc {
  type: "c" | "r"; // terrain type, c = in the corridor, r = in a room
  at: number | [number, number];
}

interface PieceState {
  pc: string;
  loc: Loc;
}

interface Path {
  moves: PieceState[];
  totalCost: number;
}

interface GameState {
  rooms: string[][];
  corridor: string[];
  pcs: PieceState[];
}

class Amphipod {
  static constructGameState(config: InitConfig): GameState {
    const corridor = new Array(config.corridorLen).fill("");
    const rooms = JSON.parse(JSON.stringify(config.roomContent));
    const pcs = config.roomContent.reduce(
      (acc: PieceState[], room, roomIdx) =>
        acc.concat(room.map((pc, pos) => ({ pc, loc: { type: "r", at: [roomIdx, pos] } }))),
      [],
    );
    pcs.sort((a, b) => a.pc.charCodeAt(0) - b.pc.charCodeAt(0));
    return { rooms, corridor, pcs };
  }

  static solve(initConfig: InitConfig) {
    const gameState: GameState = this.constructGameState(initConfig);
    const startPath: Path = { moves: [], totalCost: 0 };
    const sols = this.recSolve(initConfig, gameState, startPath);
    console.log(sols);
  }

  static recSolve(initConfig: InitConfig, gameState: GameState, path: Path): Path[] {
    if (this.gameCompleted(initConfig, gameState)) return [path];

    const solutions: Path[] = [];
    const currentGameState = JSON.parse(JSON.stringify(gameState));

    // Trying out all possible moves
    const pcs = gameState.pcs;
    for (let pcIdx = 0; pcIdx < pcs.length; pcIdx++) {
      const validMoves = this.getValidMoves(pcIdx, initConfig, gameState);
      const pcState = pcs[pcIdx]!;

      for (let movIdx = 0; movIdx < validMoves.length; movIdx++) {
        const dest = validMoves[movIdx]!;
        const { type, at } = dest;

        // Updating the state: path
        const step = { pc: pcState.pc, loc: { type, at } };
        path.moves.push(step);
        path.totalCost += this.getMoveCost(initConfig, pcState, dest);

        // Updating the state: corridor & rooms
        // 1. remove the existing pc corridor & room state
        if (pcState.loc.type === "c") {
          // originally in a corridor
          gameState.corridor[pcState.loc.at as number] = "";
        } else {
          // originally in a room
          const [roomIdx, pos] = pcState.loc.at as [number, number];
          gameState.rooms[roomIdx]![pos] = "";
        }

        // 2. update the pc corridor & room state for next step
        if (type === "c") {
          gameState.corridor[at as number] = pcState.pc;
        } else {
          const [roomIdx, pos] = at as [number, number];
          gameState.rooms[roomIdx]![pos] = pcState.pc;
        }

        // 3. update the state: pcs itself
        pcs[pcIdx]!.loc = { type, at };

        solutions.push(...this.recSolve(initConfig, gameState, path));

        // restore the gameState back and try out another move, from the same or another piece
        gameState = JSON.parse(JSON.stringify(currentGameState));
      }
    }
    return solutions;
  }

  static getMoveCost(initConfig: InitConfig, pcState: PieceState, dest: Loc): number {
    const corrLoc = pcState.loc.type === "c" ? pcState.loc : dest;
    const roomLoc = pcState.loc.type === "c" ? dest : pcState.loc;

    const [roomIdx, pos] = roomLoc.at as [number, number];
    const roomCorrLoc = initConfig.roomLoc[roomIdx]!;
    let dist = Math.abs((corrLoc.at as number) - roomCorrLoc);
    dist += pos + 1;

    return dist * initConfig.cost[pcState.pc]!;
  }

  static getValidMoves(pcIdx: number, initConfig: InitConfig, gameState: GameState): Loc[] {
    const pcState = gameState.pcs[pcIdx]!;
    const rooms = gameState.rooms;
    const destRoom = pcState.pc.charCodeAt(0) - BEGIN_PC_CODE;
    const { type, at } = pcState.loc;

    // check if the pc is in its destination, if yes, return empty array
    if (
      type === "r" &&
      (at as [number, number])[0] === destRoom &&
      gameState.rooms[destRoom]!.every((content) => content === pcState.pc)
    )
      return [];

    // check if the pc is on corridor, if yes, check the path from its corridor to its room is unblocked. If yes return the single path
    if (type === "c") {
      const destRoomLoc = initConfig.roomLoc[destRoom]!;
      const [small, large] =
        (at as number) > destRoomLoc ? [destRoomLoc, at as number] : [at as number, destRoomLoc];
      // check if corridor blocked
      for (let cIdx = small; cIdx <= large; cIdx++) {
        if (gameState.corridor[cIdx]!.length > 0) return [];
      }

      for (let pos = initConfig.roomCapacity - 1; pos >= 0; pos--) {
        if (rooms[destRoom]![pos]!.length === 0) return [{ type: "r", at: [destRoom, pos] }];
        if (rooms[destRoom]![pos] !== pcState.pc) return [];
      }
      return [];
    }

    // if not, return all unblocked corridor location that the pc can reach from its curent room
    const moves: Loc[] = [];
    const [roomNum, roomPos] = at as [number, number];
    for (let pos = roomPos - 1; pos >= 0; pos--) {
      if (rooms[roomNum]![roomPos]!.length > 0) return [];
    }

    const curCorrLoc = initConfig.roomLoc[roomNum]!;
    // check and add corridor loc to the left
    for (let cIdx = curCorrLoc - 1; cIdx >= 0; cIdx--) {
      if (gameState.corridor[cIdx]!.length > 0) break;
      if (!initConfig.roomLoc.includes(cIdx)) {
        // we don't allow stopping in front of a room
        moves.push({ type: "c", at: cIdx });
      }
    }

    // check and add corridor loc to the right
    for (let cIdx = curCorrLoc + 1; cIdx < initConfig.corridorLen; cIdx++) {
      if (gameState.corridor[cIdx]!.length > 0) break;
      if (!initConfig.roomLoc.includes(cIdx)) {
        // we don't allow stopping in front of a room
        moves.push({ type: "c", at: cIdx });
      }
    }

    return moves;
  }

  static gameCompleted(initConfig: InitConfig, gameState: GameState): boolean {
    const roomNum = initConfig.roomLoc.length;
    const roomCapacity = initConfig.roomCapacity;

    for (let roomIdx = 0; roomIdx < roomNum; roomIdx++) {
      const room = gameState.rooms[roomIdx]!;
      for (let pos = 0; pos < roomCapacity; pos++) {
        if (room[pos] != String.fromCharCode(BEGIN_PC_CODE + roomIdx)) return false;
      }
    }
    return true;
  }
}

export { Amphipod as default, InitConfig };
