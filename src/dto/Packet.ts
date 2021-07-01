export interface Packet {
  type: PacketType;
  data: any;
}

export enum PacketType {
  AUTH = 0,
  USER_LIST = 1,
  ONLINE_USERS = 2,
  OFFLINE_USERS = 3,
  CHANNEL_LIST = 4,
  MESSAGE = 5,
}
