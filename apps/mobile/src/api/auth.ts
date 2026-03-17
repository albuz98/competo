import { isMocking, apiFetch } from './config';
import { generateUser } from '../mock/data';
import type { LoginCredentials, RegisterCredentials, User } from '../types';

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
    return generateUser({ email: credentials.email, username: credentials.username });
  }

  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
