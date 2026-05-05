export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string | null;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar: string | null;
  bio: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
