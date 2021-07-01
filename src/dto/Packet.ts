export interface Packet {
  type: PacketType;
  data: any;
}

export enum PacketType {
  AUTH = 0,
  CHANNEL_LIST = 1,
  USER_LIST = 2,
  ONLINE_USERS = 3,
  OFFLINE_USERS = 4,
  ADD_USERS = 5,
  REMOVE_USERS = 6,
  MESSAGE = 7,
	GET_MESSAGES = 8
}
