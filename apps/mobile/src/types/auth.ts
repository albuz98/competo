import { Gender } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  location?: string;
  gender?: Gender;
  password?: string;
  avatarUrl?: string;
}
