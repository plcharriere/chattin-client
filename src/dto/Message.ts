export interface Message {
  uuid: string;
  channelUuid: string;
  userUuid: string;
  date: Date;
  edited: number;
  content: string;
}

export interface MessageInput {
  channelUuid: string;
  content: string;
}
