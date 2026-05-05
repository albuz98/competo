import { Gender } from "./user";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  email?: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  birthdate?: string;
  gender?: Gender;
  password?: string;
  avatarUrl?: string;
}
