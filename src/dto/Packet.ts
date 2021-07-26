import { Channel } from "./Channel";
import { Message } from "./Message";
import { User } from "./User";

export type PacketData =
  | string
  | string[]
  | Channel[]
  | User[]
  | Message[]
  | PacketAuth
  | PacketMessage
  | PacketSendEditMessage
  | PacketReceiveEditMessage;

export interface Packet {
  type: PacketType;
  data: PacketData;
}

export enum PacketType {
  AUTH = 0,
  ONLINE_USERS = 1,
  OFFLINE_USERS = 2,
  ADD_USERS = 3,
  REMOVE_USERS = 4,
  UPDATE_USERS = 5,
  MESSAGE = 6,
  SET_CHANNEL_UUID = 7,
  TYPING = 8,
  DELETE_MESSAGE = 9,
  EDIT_MESSAGE = 10,
}

export interface PacketAuth {
  userUuid: string;
  channelUuid: string;
}

export interface PacketMessage {
  channelUuid: string;
  content: string;
  files: string[];
}

export interface PacketSendEditMessage {
  messageUuid: string;
  content: string;
}

export interface PacketReceiveEditMessage {
  messageUuid: string;
  content: string;
  date: Date;
}
