export interface User {
  uuid: string;
  login: string;
  nickname: string;
  avatarUuid: string;
  bio: string;
  online: boolean;
}

export interface UserProfileEdit {
  nickname: string;
  bio: string;
}
