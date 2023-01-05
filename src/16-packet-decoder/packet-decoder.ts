interface Packet {
  bits: string;
  version: number;
  type: number;
  lenType?: number;
  literalVal?: number;
  subPackets?: Packet[];
}

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

// prettier-ignore
const Rules = {
  versionOffset: 0,
  versionLen: 3,

  typeOffset: 3,
  typeLen: 3,

  literalType: 4,
  literalOffset: 6,

  literalLen: 5, // 5 bits
  literalEndBit: "0",

  lenTypeOffset: 6,
  lenTypeLen: 1,

  bitsLenOffset: 7,
  bitsLenLen: 15,
  subPacket0Offset: 22,

  numPacketOffset: 7,
  numPacketLen: 11,
  subPacket1Offset: 18,
};

const toBitString = (input: string): string =>
  input
    .split("")
    .map((char) => bitsMap[char] as string)
    .join("");

const getNumericVal = (bitStr: string, start?: number, len?: number): number =>
  Number.parseInt(
    bitStr.slice(start, start !== undefined && len !== undefined ? start + len : len),
    2,
  );

const sumPacketVersions = (packet: Packet): number =>
  packet.subPackets
    ? packet.version +
      packet.subPackets.reduce((memo, sp) => memo + sumPacketVersions(sp), 0 as number)
    : packet.version;

class PacketDecoder {
  static parsePacketBitStr(bitStr: string, startCur: number): [number, Packet] {
    const version = getNumericVal(bitStr, startCur + Rules.versionOffset, Rules.versionLen);
    const type = getNumericVal(bitStr, startCur + Rules.typeOffset, Rules.typeLen);

    if (type === Rules.literalType) {
      // literal value
      let accLiteralBits = "";
      let literalEnd = false;
      let literalNum = 0;

      while (!literalEnd) {
        const startBit = startCur + Rules.literalOffset + literalNum * Rules.literalLen;
        const literalBits = bitStr.slice(startBit, startBit + Rules.literalLen);

        if (literalBits.charAt(0) === Rules.literalEndBit) literalEnd = true;

        accLiteralBits += literalBits.slice(1);
        literalNum++;
      }
      const literalVal = getNumericVal(accLiteralBits);
      const endCur = startCur + Rules.literalOffset + literalNum * Rules.literalLen;

      const packet: Packet = {
        bits: bitStr.slice(startCur, endCur),
        version,
        type,
        literalVal,
      };

      return [endCur, packet];
    }

    // operator
    const lenType = getNumericVal(bitStr, startCur + Rules.lenTypeOffset, Rules.lenTypeLen);
    const subPackets = [];
    let cursor = 0;

    if (lenType === 0) {
      // the next 15 bits are a number that represents the total length in bits of the sub-packets
      const bitsLen = getNumericVal(bitStr, startCur + Rules.bitsLenOffset, Rules.bitsLenLen);
      cursor = startCur + Rules.subPacket0Offset;
      let processBitLen = 0;

      while (processBitLen < bitsLen) {
        const [endCur, packet] = this.parsePacketBitStr(bitStr, cursor);
        processBitLen += endCur - cursor;
        cursor = endCur;
        subPackets.push(packet);
      }
    } else {
      // the next 11 bits are a number that represents the number of sub-packets immediately contained
      const numPackets = getNumericVal(
        bitStr,
        startCur + Rules.numPacketOffset,
        Rules.numPacketLen,
      );

      cursor = startCur + Rules.subPacket1Offset;

      for (let i = 0; i < numPackets; i++) {
        const [endCur, packet] = this.parsePacketBitStr(bitStr, cursor);
        cursor = endCur;
        subPackets.push(packet);
      }
    }

    const packet: Packet = {
      bits: bitStr.slice(startCur, cursor),
      version,
      type,
      lenType,
      subPackets,
    };

    return [cursor, packet];
  }

  static parsePacket(input: string): Packet {
    const [, packet] = this.parsePacketBitStr(toBitString(input), 0);
    return packet;
  }
}

export { PacketDecoder as default, Packet, toBitString, sumPacketVersions };
