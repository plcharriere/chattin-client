export interface User {
  uuid: string;
  login: string;
  nickname: string;
  online: boolean;
}

export interface UserProfileEdit {
  nickname: string;
  bio: string;
}
