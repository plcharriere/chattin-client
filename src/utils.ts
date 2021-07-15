import { Channel } from "@/dto/Channel";
import { User } from "@/dto/User";
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
