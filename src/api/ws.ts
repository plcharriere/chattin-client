import { Packet, PacketData, PacketMessage, PacketType } from "@/dto/Packet";

export function sendPacket(
  ws: WebSocket | null,
  type: PacketType,
  data: PacketData = ""
): void {
  if (ws) {
    console.log("SEND PACKET:", type, data);
    const packet: Packet = {
      type: type,
      data: data,
    };
    ws.send(JSON.stringify(packet));
  } else {
    console.log("SEND PACKET: ws is null");
  }
}

export function sendPacketMessage(
  ws: WebSocket | null,
  channelUuid: string,
  message: string
): void {
  sendPacket(ws, PacketType.MESSAGE, {
    channelUuid: channelUuid,
    message: message,
  } as PacketMessage);
}
