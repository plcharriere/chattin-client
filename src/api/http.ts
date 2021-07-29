import { Channel } from "@/dto/Channel";
import { Configuration } from "@/dto/Configuration";
import { File } from "@/dto/File";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { httpUrl } from "@/env";
import axios from "axios";

export async function getConfiguration(): Promise<Configuration> {
  const res = await axios.get(`${httpUrl}/configuration`);
  return res.data;
}

export async function getChannels(token: string): Promise<Channel[]> {
  const res = await axios.get(`${httpUrl}/channels`, {
    headers: {
      token,
    },
  });
  return res.data || [];
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
  if (res.data === null) return [];
  const messages = res.data as Message[];
  messages.forEach((message) => {
    message.date = new Date(message.date);
    message.edited = new Date(message.edited);
  });
  return messages;
}

export async function getUsers(token: string): Promise<User[]> {
  const res = await axios.get(`${httpUrl}/users`, {
    headers: {
      token,
    },
  });
  return res.data || [];
}

export async function getAvatars(token: string): Promise<string[]> {
  const res = await axios.get(`${httpUrl}/avatars`, {
    headers: {
      token,
    },
  });

  return res.data || [];
}

export async function getFileInformations(
  token: string,
  fileUuid: string
): Promise<File> {
  const res = await axios.get(`${httpUrl}/files/${fileUuid}`, {
    headers: {
      token,
    },
  });
  return {
    uuid: fileUuid,
    ...res.data,
  };
}
