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
  | PacketMessage;

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
}

export interface PacketAuth {
  userUuid: string;
  channelUuid: string;
}

export interface PacketMessage {
  channelUuid: string;
  message: string;
}
