import { isMocking, apiFetch } from './config';
import { generateUser } from '../mock/data';
import type { LoginCredentials, RegisterCredentials, User } from '../types';

// Reload the authenticated user from the server (e.g. on app restart with a stored token).
// In mock mode the user is kept in AuthContext memory — call this only in real mode.
export async function fetchProfile(token: string): Promise<User> {
  if (isMocking) throw new Error('fetchProfile not available in mock mode');
  return apiFetch<User>('/auth/profile', {}, token);
}

// Register the Expo push token for this device so the backend can send server-side notifications.
export async function registerPushToken(pushToken: string, token: string): Promise<void> {
  if (isMocking) return;
  return apiFetch<void>('/auth/push-token', {
    method: 'POST',
    body: JSON.stringify({ pushToken }),
  }, token);
}

export async function forgotPassword(email: string): Promise<void> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 800));
    if (!email) throw new Error('Email is required');
    return;
  }
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function updateProfile(
  data: { firstName?: string; lastName?: string; username?: string; location?: string; password?: string; avatarUri?: string },
  currentUser: User | null,
): Promise<User> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 600));
    if (!currentUser) throw new Error('Not authenticated');
    return {
      ...currentUser,
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.username ? { username: data.username } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.avatarUri !== undefined ? { avatarUri: data.avatarUri } : {}),
    };
  }
  return apiFetch<User>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function login(credentials: LoginCredentials): Promise<User> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    return generateUser({ email: credentials.email });
  }

  return apiFetch<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  if (isMocking) {
    await new Promise((r) => setTimeout(r, 800));
    if (!credentials.username || !credentials.email || !credentials.password) {
      throw new Error('All fields are required');
    }
    return generateUser({
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      username: credentials.username,
      dateOfBirth: credentials.dateOfBirth,
    });
  }

  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
