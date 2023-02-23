import Debug from "debug";

const log = Debug("amphipod");

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
  pcIdx: number;
  dest: Loc;
  accCost: number;
}

interface Path {
  moves: PieceState[];
  totalCost: number;
}

interface GameState {
  rooms: string[][];
  corridor: string[];
  pcs: PieceState[];
  path: Path;
}

interface Edge {
  gameState: GameState;
  move: Move;
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

    const startPath: Path = { moves: [], totalCost: 0 };
    return { rooms, corridor, pcs, path: startPath };
  }

  static solve(initConfig: InitConfig): Path | undefined {
    let latestState: GameState | undefined = this.constructGameState(initConfig);
    const edges: Map<string, Edge> = new Map();
    let iter = 0;
    // Dijkstra's algorithm:
    //
    // while (latestState && !gameComplete(latestState)) {
    //   [{ gameState, move }] = get all valid moves from the gameState;
    //   edges.push(...[{ gameState, move }];
    //   let [ gameState, move] = pick from edges the one with min accCost;
    //   if (there is a next move) {
    //     Update the gameState from the move;
    //     latestState = updated gameState
    //   } else {
    //     latestState = undefined;
    //   }
    // }
    //
    // return latestState ? latestState.path : undefined;

    while (latestState && !this.gameCompleted(initConfig, latestState)) {
      //   edges.push(...[{ gameState, move }];
      this.insertEdges(edges, latestState, this.getValidMoves(initConfig, latestState));

      //   let [ gameState, move] = pick from edges the one with min accCost;
      const minEdge = this.popMinEdge(edges);

      // Verbose debugging output
      if (iter % 5000 === 0) {
        log(`iter: ${iter}, edge #: ${edges.size}, minAccCost: ${minEdge?.move?.accCost}`);
      }
      iter++;

      if (minEdge) {
        const { move } = minEdge;
        latestState = minEdge.gameState;

        // -- update the gameState: remove the previous trace --
        const pcState = latestState.pcs[move.pcIdx]!;
        if (pcState.loc.type === "c") {
          latestState.corridor[pcState.loc.at as number] = "";
        } else {
          // in a room
          const [roomIdx, pos] = pcState.loc.at as [number, number];
          latestState.rooms[roomIdx]![pos] = "";
        }

        // -- update the gameState: add to the new trace --
        if (move.dest.type === "c") {
          latestState.corridor[move.dest.at as number] = pcState.pc;
        } else {
          const [roomIdx, pos] = move.dest.at as [number, number];
          latestState.rooms[roomIdx]![pos] = pcState.pc;
        }

        // -- update the gameState: latestState.pcs --
        pcState.loc = move.dest;

        // -- update the gameState: latestState.path --
        const { path: latestPath } = latestState;
        latestPath.moves.push(pcState);
        latestPath.totalCost = move.accCost;
      } else {
        latestState = undefined;
      }
    }

    return latestState?.path;
  }

  static popMinEdge(edges: Map<string, Edge>): Edge | undefined {
    if (edges.size === 0) return undefined;

    let minKey = undefined;
    let minCost = undefined;

    for (const [key, edge] of edges.entries()) {
      if (!minCost || minCost > edge.move.accCost) {
        minKey = key;
        minCost = edge.move.accCost;
      }
    }

    const minEdge = edges.get(minKey!);
    edges.delete(minKey!);
    return minEdge;
  }

  static insertEdges(edges: Map<string, Edge>, gameState: GameState, moves: Move[]) {
    const getEdgeKey = (edge: Edge): string => {
      const { rooms, corridor } = edge.gameState;
      const { pcIdx, dest } = edge.move;

      const roomStr = rooms
        .flat()
        .map((c) => (c === "" ? "_" : c))
        .join("");
      const corrStr = corridor.map((c) => (c === "" ? "_" : c)).join("");
      const moveStr = `${pcIdx}${dest.type}${Array.isArray(dest.at) ? dest.at.join("-") : dest.at}`;

      return `${roomStr}-${corrStr}-${moveStr}`;
    };

    moves.forEach((move) => {
      const edge = {
        gameState: JSON.parse(JSON.stringify(gameState)),
        move,
      };

      const key = getEdgeKey(edge);

      const existing = edges.get(key);
      if (!existing || existing.move.accCost > edge.move.accCost) {
        edges.set(key, edge);
      }
    });
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
    const { pcs, rooms, corridor, path } = gameState;

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
            if (corridor[cIdx]!.length > 0) return;
          }
        } else {
          for (let cIdx = startLoc - 1; cIdx >= destRoomLoc; cIdx--) {
            if (corridor[cIdx]!.length > 0) return;
          }
        }

        // Check if the pc can enter the room
        for (let pos = initConfig.roomCapacity - 1; pos >= 0; pos--) {
          if (rooms[destRoom]![pos]!.length === 0) {
            const dest: Loc = { type: "r", at: [destRoom, pos] };
            const cost = this.getMoveCost(initConfig, pcState, dest);
            moves.push({
              pcIdx,
              dest,
              accCost: cost + path.totalCost,
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
            const cost = this.getMoveCost(initConfig, pcState, dest);
            moves.push({
              pcIdx,
              dest,
              accCost: cost + path.totalCost,
            });
          }
        }

        // check and add corridor loc to the right
        for (let cIdx = curCorrLoc + 1; cIdx < initConfig.corridorLen; cIdx++) {
          if (corridor[cIdx]!.length > 0) break;
          if (!initConfig.roomLoc.includes(cIdx)) {
            const dest: Loc = { type: "c", at: cIdx };
            const cost = this.getMoveCost(initConfig, pcState, dest);
            moves.push({
              pcIdx,
              dest,
              accCost: cost + path.totalCost,
            });
          }
        }
      }
    });

    // we get all the moves, then sort them by the move cost
    return moves.sort((a, b) => a.accCost - b.accCost);
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
