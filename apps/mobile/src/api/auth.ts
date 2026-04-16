import { mockProfile } from "../mock/profile";
import { LoginCredentials, RegisterCredentials } from "../types/auth";
import { User } from "../types/user";
import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";

// Reload the authenticated user from the server (e.g. on app restart with a stored token).
// In mock mode returns the editable mockProfile object from src/mock/data.ts.
export async function fetchProfile(token: string): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_PROFILE)
    return { ...mockProfile };
  return apiFetch<User>("/auth/profile", {}, token);
}

// Register the Expo push token for this device so the backend can send server-side notifications.
export async function registerPushToken(
  pushToken: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_REGISTER_PUSH_TOKEN) return;
  return apiFetch<void>(
    "/auth/push-token",
    {
      method: "POST",
      body: JSON.stringify({ pushToken }),
    },
    token,
  );
}

export async function forgotPassword(email: string): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_FORGOT_PASSWORD) {
    await new Promise((r) => setTimeout(r, 800));
    if (!email) throw new Error("Email is required");
    return;
  }
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function updateProfile(
  data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    location?: string;
    password?: string;
    avatarUrl?: string;
  },
  token: string,
  currentUser: User | null,
): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_UPDATE_PROFILE) {
    await new Promise((r) => setTimeout(r, 600));
    if (!currentUser) throw new Error("Not authenticated");
    return {
      ...currentUser,
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.username ? { username: data.username } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
    };
  }
  return apiFetch<User>(
    "/auth/profile",
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );
}

export async function login(credentials: LoginCredentials): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_LOGIN) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }
    return { ...mockProfile, email: credentials.email };
  }

  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(
  credentials: RegisterCredentials,
): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_REGISTER) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.username || !credentials.email || !credentials.password) {
      throw new Error("All fields are required");
    }
    return {
      ...mockProfile,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      username: credentials.username,
      dateOfBirth: credentials.dateOfBirth,
    };
  }

  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
