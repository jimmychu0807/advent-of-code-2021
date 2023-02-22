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

interface Move {
  pcState: PieceState;
  pcIdx: number;
  dest: Loc;
  cost: number;
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

  static solve(initConfig: InitConfig): Path | undefined {
    const gameState: GameState = this.constructGameState(initConfig);
    const startPath: Path = { moves: [], totalCost: 0 };
    return this.recSolve(initConfig, gameState, startPath);
  }

  static recSolve(initConfig: InitConfig, gameState: GameState, path: Path): Path | undefined {
    if (this.gameCompleted(initConfig, gameState)) return path;

    console.log("path:");
    console.dir(path, { depth: null });

    console.log("gameState:");
    console.dir(gameState, { depth: null });

    // backup `gameState` and `path`, we will restore them later
    const curGameState = JSON.parse(JSON.stringify(gameState));
    const curPath = JSON.parse(JSON.stringify(path));

    // Trying out all possible moves
    const validMoves = this.getValidMoves(initConfig, gameState);

    console.log("validMoves:");
    console.dir(validMoves, { depth: null });

    for (let movIdx = 0; movIdx < validMoves.length; movIdx++) {
      const nextMove = validMoves[movIdx]!;
      const { pcState, pcIdx, dest, cost: moveCost } = nextMove;
      const { type: destLocType, at: destLocAt } = dest;

      // Updating the state: path
      const step: PieceState = { pc: pcState.pc, loc: dest };
      path.moves.push(step);
      path.totalCost += moveCost;

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

      // 2. update the pc corridor & room state for the destination
      if (destLocType === "c") {
        gameState.corridor[destLocAt as number] = pcState.pc;
      } else {
        const [roomIdx, pos] = destLocAt as [number, number];
        gameState.rooms[roomIdx]![pos] = pcState.pc;
      }

      // 3. update the state: pcs itself
      gameState.pcs[pcIdx]!.loc = dest;

      // The first solution is the one we want
      const solution = this.recSolve(initConfig, gameState, path);
      if (solution) return solution;

      // restore the gameState back and try out another move, from the same or another piece
      gameState = JSON.parse(JSON.stringify(curGameState));
      path = JSON.parse(JSON.stringify(curPath));
    }
    return undefined;
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

  static getValidMoves(initConfig: InitConfig, gameState: GameState): Move[] {
    const moves: Move[] = [];
    const { pcs, rooms, corridor } = gameState;

    pcs.forEach((pcState, pcIdx) => {
      // destRoom for this pc
      const destRoom = pcState.pc.charCodeAt(0) - BEGIN_PC_CODE;
      const { type, at } = pcState.loc;

      // check if the pc is on corridor, if yes, check the path from its corridor to its room is unblocked. If yes return the single path
      if (type === "c") {
        const destRoomLoc = initConfig.roomLoc[destRoom]!;
        const startLoc = at as number;
        // check if corridor blocked
        if (startLoc < destRoomLoc) {
          for (let cIdx = startLoc + 1; cIdx <= destRoomLoc; cIdx++) {
            if (gameState.corridor[cIdx]!.length > 0) return;
          }
        } else {
          for (let cIdx = startLoc - 1; cIdx >= destRoomLoc; cIdx--) {
            if (gameState.corridor[cIdx]!.length > 0) return;
          }
        }

        // Check if the pc can enter the room
        for (let pos = initConfig.roomCapacity - 1; pos >= 0; pos--) {
          if (rooms[destRoom]![pos]!.length === 0) {
            const dest: Loc = { type: "r", at: [destRoom, pos] };
            moves.push({
              pcState: JSON.parse(JSON.stringify(pcState)),
              pcIdx,
              dest,
              cost: this.getMoveCost(initConfig, pcState, dest),
            });
            return;
          }

          // there are still pcs that need to move out from the room, so the pc cannot enter the room
          if (rooms[destRoom]![pos] !== pcState.pc) return;
        }
      } else {
        // type === 'r'
        const [roomNum, roomPos] = at as [number, number];
        // console.log(`roomNum: ${roomNum}, rooms:`, rooms[roomNum]);

        // Check if the pc is already at its destination room. If yes, return
        if (roomNum === destRoom) {
          let bSame = true;
          // check everything and below are correct
          for (let pos = roomPos + 1; pos < initConfig.roomCapacity; pos++) {
            if (rooms[destRoom]![pos] !== pcState.pc) {
              bSame = false;
              break;
            }
          }
          if (bSame) return;
        }

        // Check if the path to the corridor is blocked
        for (let pos = roomPos - 1; pos >= 0; pos--) {
          if (rooms[roomNum]![pos]!.length > 0) return;
        }

        // By this point, return all unblocked corridor location that the pc can reach from its
        //   curent room.
        const curCorrLoc = initConfig.roomLoc[roomNum]!;

        // check and add corridor loc to the left
        for (let cIdx = curCorrLoc - 1; cIdx >= 0; cIdx--) {
          if (corridor[cIdx]!.length > 0) break;
          // we don't allow stopping in front of a room
          if (!initConfig.roomLoc.includes(cIdx)) {
            const dest: Loc = { type: "c", at: cIdx };
            moves.push({
              pcState: JSON.parse(JSON.stringify(pcState)),
              pcIdx,
              dest,
              cost: this.getMoveCost(initConfig, pcState, dest),
            });
          }
        }

        // check and add corridor loc to the right
        for (let cIdx = curCorrLoc + 1; cIdx < initConfig.corridorLen; cIdx++) {
          if (corridor[cIdx]!.length > 0) break;
          if (!initConfig.roomLoc.includes(cIdx)) {
            const dest: Loc = { type: "c", at: cIdx };
            moves.push({
              pcState: JSON.parse(JSON.stringify(pcState)),
              pcIdx,
              dest,
              cost: this.getMoveCost(initConfig, pcState, dest),
            });
          }
        }
      }
    });

    // we get all the moves, then sort them by the move cost
    return moves.sort((a, b) => a.cost - b.cost);
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
