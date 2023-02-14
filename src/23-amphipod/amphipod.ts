interface Config {
  rooms: string[][];
  costs: { [key: string]: number };
};

const config = {
  rooms: [
    ['A', 'D', 'D', 'D'],
    ['C', 'C', 'B', 'D'],
    ['B', 'B', 'A', 'A'],
    ['B', 'A', 'C', 'C']
  ],
  costs: {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
  }
};

class Amphipod {
  static solve(initConfig: Config) {
    const buffer = new Array(7).fill('');

    const { rooms, costs } = initConfig;
    let currentRooms = [...rooms];

  }
}
