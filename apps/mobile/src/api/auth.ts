import { mockProfile } from "../mock/profile";
import { LoginCredentials, RegisterCredentials } from "../types/auth";
import { Gender, PlayerProfile, User, UserRole } from "../types/user";
import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";

// Reload the authenticated user from the server (e.g. on app restart with a stored token).
// In mock mode returns the editable mockProfile object from src/mock/data.ts.
export async function fetchProfile(token: string): Promise<User> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_PROFILE)
    return { ...mockProfile };
  const userData = await apiFetch<User>("/api/v1/users/me", {}, token);
  if (!userData.profiles || userData.profiles.length === 0) {
    const playerProfile: PlayerProfile = {
      id: userData.id,
      role: UserRole.PLAYER,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      avatarUrl: userData.avatarUrl,
    };
    userData.profiles = [playerProfile];
    userData.currentProfileId = userData.id;
  }
  return userData;
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

interface UpdateMeApiResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  phone: string;
  avatar_url: string;
  is_active: boolean;
}

export async function updateProfile(
  data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    birthdate?: string;
    phone?: string;
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
      ...(data.first_name ? { first_name: data.first_name } : {}),
      ...(data.last_name ? { last_name: data.last_name } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.birthdate ? { birthdate: data.birthdate } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.username ? { username: data.username } : {}),
      ...(data.location ? { location: data.location } : {}),
      ...(data.gender ? { gender: data.gender } : {}),
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
    };
  }
  const body: Record<string, string> = {};
  if (data.email) body.email = data.email;
  if (data.first_name) body.first_name = data.first_name;
  if (data.last_name) body.last_name = data.last_name;
  if (data.birthdate) body.birthdate = data.birthdate;
  if (data.phone) body.phone = data.phone;
  const res = await apiFetch<UpdateMeApiResponse>(
    "/api/v1/users/me",
    { method: "PATCH", body: JSON.stringify(body) },
    token,
  );
  if (!currentUser) throw new Error("Not authenticated");
  return {
    ...currentUser,
    id: res.id,
    username: res.username,
    email: res.email,
    first_name: res.first_name,
    last_name: res.last_name,
    birthdate: res.birthdate,
    phone: res.phone,
    avatarUrl: res.avatar_url ?? currentUser.avatarUrl,
  };
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

  const { access_token, refresh_token } = await apiFetch<AuthTokenResponse>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
  const userData = await fetchProfile(access_token);
  return { ...userData, token: access_token, refreshToken: refresh_token };
}

export async function logout(
  refreshToken: string,
  token: string,
): Promise<void> {
  if (isMocking && mockFlags.IS_MOCKING_LOGOUT) return;
  return apiFetch<void>(
    "/api/v1/auth/logout",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
    token,
  );
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

  const { access_token, refresh_token } = await apiFetch<AuthTokenResponse>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );
  const userData = await fetchProfile(access_token);
  return { ...userData, token: access_token, refreshToken: refresh_token };
}
