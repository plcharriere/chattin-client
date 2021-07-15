import { Channel } from "./Channel";
import { Message, MessageInput } from "./Message";
import { User } from "./User";

export type PacketData =
  | string
  | string[]
  | Channel[]
  | User[]
  | Message[]
  | MessageInput;

export interface Packet {
  type: PacketType;
  data: PacketData;
}

export enum PacketType {
  AUTH = 0,
  USER_LIST = 1,
  ONLINE_USERS = 2,
  OFFLINE_USERS = 3,
  ADD_USERS = 4,
  REMOVE_USERS = 5,
  UPDATE_USERS = 6,
  MESSAGE = 7,
}
