import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile } from '../api/auth';

interface AuthContextType {
  user: User | null;
  location: string | undefined;
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiLogin(credentials);
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
      setUser(userData);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);
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
    <AuthContext.Provider value={{ user, location, loading, error, login, register, logout, clearError, updateLocation, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
