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

  static solve(initConfig: InitConfig): Path | undefined {
    const gameState: GameState = this.constructGameState(initConfig);
    const startPath: Path = { moves: [], totalCost: 0 };
    const sols = this.recSolve(initConfig, gameState, startPath, undefined);

    // console.dir(sols, {depth: null});

    // returning the min path
    if (sols.length === 0) return undefined;

    return sols.reduce((acc, sol) => (acc.totalCost > sol.totalCost ? sol : acc));
  }

  static recSolve(initConfig: InitConfig, gameState: GameState, path: Path, knownMinCost: number | undefined): Path[] {
    if (this.gameCompleted(initConfig, gameState)) {
      console.log('Game completed! Path:', JSON.stringify(path));
      process.exit(0);
      // return knownMinCost ? (knownMinCost > path.totalCost ? [path] : []) : [path];
    }

    console.log("path:");
    console.dir(path, { depth: null });
    console.log(`knownMinCost: ${knownMinCost}`);

    if (knownMinCost && path.totalCost > knownMinCost) return [];

    const solutions: Path[] = [];
    const curGameState = JSON.parse(JSON.stringify(gameState));
    const curPath = JSON.parse(JSON.stringify(path));

    // Trying out all possible moves
    for (let pcIdx = 0; pcIdx < gameState.pcs.length; pcIdx++) {
      const validMoves = this.getValidMoves(pcIdx, initConfig, gameState);
      let pcState = gameState.pcs[pcIdx]!;

      // console.log("recSolve pcState:", pcState);
      // console.log("recSolve validMoves:", validMoves);

      for (let movIdx = 0; movIdx < validMoves.length; movIdx++) {
        // console.log(`pcIdx: ${pcIdx}, movIdx: ${movIdx}`);

        const dest = validMoves[movIdx]!;
        const { type, at } = dest;

        const moveCost = this.getMoveCost(initConfig, pcState, dest);
        if (knownMinCost && knownMinCost <= path.totalCost + moveCost) {
          continue;
        }

        // Updating the state: path
        const step = { pc: pcState.pc, loc: { type, at } };
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

        // 2. update the pc corridor & room state for next step
        if (type === "c") {
          gameState.corridor[at as number] = pcState.pc;
        } else {
          const [roomIdx, pos] = at as [number, number];
          gameState.rooms[roomIdx]![pos] = pcState.pc;
        }

        // 3. update the state: pcs itself
        pcState.loc = { type, at };

        // save the solution
        solutions.push(...this.recSolve(initConfig, gameState, path, knownMinCost));
        knownMinCost = solutions.reduce((acc: number | undefined, sol) => acc
          ? (acc > sol.totalCost ? sol.totalCost : acc)
          : sol.totalCost
        , knownMinCost);

        // restore the gameState back and try out another move, from the same or another piece
        gameState = JSON.parse(JSON.stringify(curGameState));
        path = JSON.parse(JSON.stringify(curPath));
        pcState = gameState.pcs[pcIdx]!;
      }
    }
    return solutions;
  }

  static getMoveCost(initConfig: InitConfig, pcState: PieceState, dest: Loc): number {
    // console.log("getMoveCost pcState:", pcState);
    // console.log("getMoveCost dest:", dest);

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

    // console.log("getValidMoves pcState:", JSON.stringify(pcState));

    const rooms = gameState.rooms;
    const destRoom = pcState.pc.charCodeAt(0) - BEGIN_PC_CODE;
    const { type, at } = pcState.loc;

    // check if the pc is on corridor, if yes, check the path from its corridor to its room is unblocked. If yes return the single path
    if (type === "c") {
      const destRoomLoc = initConfig.roomLoc[destRoom]!;
      const startLoc = at as number;
      // check if corridor blocked
      if (startLoc < destRoomLoc) {
        for (let cIdx = startLoc + 1; cIdx <= destRoomLoc; cIdx++) {
          if (gameState.corridor[cIdx]!.length > 0) return [];
        }
      } else {
        for (let cIdx = startLoc - 1; cIdx >= destRoomLoc; cIdx--) {
          if (gameState.corridor[cIdx]!.length > 0) return [];
        }
      }

      // console.log("getValidMoves destRoom:", rooms[destRoom]);

      // Check if the pc can enter the room
      for (let pos = initConfig.roomCapacity - 1; pos >= 0; pos--) {
        if (rooms[destRoom]![pos]!.length === 0) return [{ type: "r", at: [destRoom, pos] }];

        // there are still pcs that need to move out from the room, so the pc cannot enter the room
        if (rooms[destRoom]![pos] !== pcState.pc) return [];
      }
      return [];
    }

    // By this point, type === 'r'
    const [roomNum, roomPos] = at as [number, number];
    // console.log(`roomNum: ${roomNum}, rooms:`, rooms[roomNum]);

    // Check if the pc is already at its destination room
    if (roomNum === destRoom) {
      let bSame = true;
      // check everything and below are correct
      for (let pos = roomPos + 1; pos < initConfig.roomCapacity; pos++) {
        if (rooms[destRoom]![pos] !== pcState.pc) {
          bSame = false;
          break;
        }
      }
      if (bSame) return [];
    }

    // if not, return all unblocked corridor location that the pc can reach from its curent room
    const moves: Loc[] = [];

    for (let pos = roomPos - 1; pos >= 0; pos--) {
      if (rooms[roomNum]![pos]!.length > 0) return [];
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
