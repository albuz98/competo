import { mockProfile } from "../mock/profile";
import { LoginCredentials, RegisterCredentials } from "../types/auth";
import { Gender, User } from "../types/user";
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
    first_name?: string;
    last_name?: string;
    username?: string;
    location?: string;
    gender?: Gender;
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
      ...(data.first_name !== undefined ? { first_name: data.first_name } : {}),
      ...(data.last_name !== undefined ? { last_name: data.last_name } : {}),
      ...(data.username ? { username: data.username } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.gender !== undefined ? { gender: data.gender } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
    };
  }
  return apiFetch<User>(
    "/auth/profile",
    { method: "PATCH", body: JSON.stringify(data) },
    token,
  );
}

interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_LOGIN) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.identifier || !credentials.password) {
      throw new Error("Identifier and password are required");
    }
    return { ...mockProfile };
  }

  const { access_token } = await apiFetch<AuthTokenResponse>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
  const userData = await fetchProfile(access_token);
  return { ...userData, token: access_token };
}

export async function register(
  credentials: RegisterCredentials,
): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_REGISTER) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.username || !credentials.password) {
      throw new Error("All fields are required");
    }
    return {
      ...mockProfile,
      username: credentials.username,
    };
  }

  const { access_token } = await apiFetch<AuthTokenResponse>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
  const userData = await fetchProfile(access_token);
  return { ...userData, token: access_token };
}
