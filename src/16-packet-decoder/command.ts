import { Command } from "commander";
import { exit } from "process";

// local import
import { CommandOptionsDF, decorateCommand, parseArgsDF } from "../utils/index.js";
import PacketDecoder, { sumPacketVersions } from "./packet-decoder.js";

const QUEST_INPUT_URL = new URL("input/input.dat", import.meta.url);

const command = new Command("packet-decoder")
  .description("Day 16 - Packet Decoder")
  .showHelpAfterError();

decorateCommand(command, { file: true, default: true, input: false });

command.action((options: CommandOptionsDF) => {
  try {
    const input = parseArgsDF(options, QUEST_INPUT_URL);
    const packet = PacketDecoder.parsePacket(input[0]!);
    const sum = sumPacketVersions(packet);
    console.log(`Part I result: ${sum}`);

    const result = PacketDecoder.operateOnPacket(packet);
    console.log(`Part II result: ${result}`);
  } catch (err) {
    console.log((err as Error).message);
    command.help();
    exit(1);
  }
});

export { command as default };
