export interface Message {
  uuid: string;
  channelUuid: string;
  userUuid: string;
  date: Date;
  edited: Date;
  content: string;
  files: string[];
}

export interface MessageInput {
  channelUuid: string;
  content: string;
}
