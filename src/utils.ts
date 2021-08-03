import { Channel } from "@/dto/Channel";
import { User } from "@/dto/User";
import { Embed, EmbedType } from "./dto/Embed";
import { Message } from "./dto/Message";

export function getChannelByUuid(
  channels: Channel[],
  uuid: string
): Channel | undefined {
  return channels.find((channel) => channel.uuid === uuid);
}

export function getUserByUuid(users: User[], uuid: string): User | undefined {
  return users.find((user) => user.uuid === uuid);
}

export function getMessagesByChannelUuid(
  messages: Message[],
  channelUuid: string
): Message[] {
  return messages.filter((message) => message.channelUuid == channelUuid);
}

export function getUserName(user: User): string {
  return user.nickname.length > 0 ? user.nickname : user.login;
}

export function getEmbedsByType(embeds: Embed[], type: EmbedType): Embed[] {
  return embeds.filter((embed) => embed.type == type);
}

export function datesAreOnSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function bytesToReadable(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
