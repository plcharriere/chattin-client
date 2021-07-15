import { Channel } from "@/dto/Channel";
import { Message } from "@/dto/Message";
import { httpUrl } from "@/env";
import axios from "axios";

export async function getChannels(token: string): Promise<Channel[]> {
  const res = await axios.get(`${httpUrl}/channels`, {
    headers: {
      token,
    },
  });
  return res.data;
}

export async function getChannelMessages(
  token: string,
  channelUuid: string,
  fromMessageUuid: string,
  count: number
): Promise<Message[]> {
  const res = await axios.get(`${httpUrl}/channels/${channelUuid}/messages`, {
    params: {
      from: fromMessageUuid,
      count: count,
    },
    headers: {
      token,
    },
  });
  const messages = res.data as Message[];
  messages.forEach((message) => {
    message.date = new Date(message.date);
  });
  return messages;
}
