const bitsMap: { [key: string]: string } = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

const toBitStr = (input: string): string =>
  input
    .split("")
    .map((char) => bitsMap[char] as string)
    .join("");

class PacketDecoder {
  static parsePacket(input: string) {
    const bitStr = toBitStr(input);

    // NEXT STEP
    // parse the packet so it determine its sub-packet
  }
}

export { PacketDecoder as default, toBitStr };
