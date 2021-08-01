export interface Channel {
  uuid: string;
  name: string;
  description: string;
  nsfw: boolean;
  saveMessages: boolean;
  unread: boolean;
}
