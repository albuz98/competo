import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, fetchProfile } from '../api/auth';

const TOKEN_KEY = 'authToken';

interface AuthContextType {
  user: User | null;
  location: string | undefined;
  loading: boolean;
  bootstrapping: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateLocation: (location: string) => void;
  updateProfile: (data: { firstName?: string; lastName?: string; username?: string; location?: string; password?: string; avatarUri?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const userData = await fetchProfile(token);
          setUser({ ...userData, token });
          if (userData.location) setLocation(userData.location);
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiLogin(credentials);
      await SecureStore.setItemAsync(TOKEN_KEY, userData.token);
      setUser(userData);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiRegister(credentials);
      await SecureStore.setItemAsync(TOKEN_KEY, userData.token);
      setUser(userData);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    setUser(null);
  };
  const clearError = () => setError(null);
  const updateLocation = (loc: string) => {
    setLocation(loc);
    setUser((prev) => (prev ? { ...prev, location: loc } : prev));
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; username?: string; location?: string; password?: string; avatarUri?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiUpdateProfile(data, user);
      setUser(updated);
      if (data.location !== undefined) setLocation(data.location || undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, location, loading, bootstrapping, error, login, register, logout, clearError, updateLocation, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
