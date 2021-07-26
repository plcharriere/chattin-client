import { Packet, PacketData, PacketMessage, PacketType } from "@/dto/Packet";

export function sendPacket(
  ws: WebSocket | null,
  type: PacketType,
  data: PacketData = ""
): void {
  if (ws) {
    const packet: Packet = {
      type: type,
      data: data,
    };
    ws.send(JSON.stringify(packet));
  }
}

export function sendPacketMessage(
  ws: WebSocket | null,
  channelUuid: string,
  content: string,
  files: string[]
): void {
  sendPacket(ws, PacketType.MESSAGE, {
    channelUuid,
    content,
    files,
  } as PacketMessage);
}
