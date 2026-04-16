import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import {
  login as apiLogin,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
  fetchProfile,
} from "../api/auth";
import { OrganizerProfile, User, UserProfile } from "../types/user";
import {
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
} from "../types/auth";
import { UserRole } from "../constants/user";
import { AppUser } from "../types/team";

const TOKEN_KEY = "authToken";

interface AuthContextType {
  user: User | null;
  currentProfile: UserProfile | null;
  location: string | undefined;
  loading: boolean;
  bootstrapping: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateLocation: (location: string) => void;
  switchProfile: (profileId: string) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateOrgProfileData: (
    profileId: string,
    updates: Partial<OrganizerProfile>,
  ) => void;
  addCollaborator: (profileId: string, appUser: AppUser) => void;
  addOrganizerProfile: (orgName: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always derived from user — single source of truth for the active profile
  const currentProfile = useMemo<UserProfile | null>(
    () =>
      user?.profiles?.find((p) => p.id === user.currentProfileId) ??
      user?.profiles?.[0] ??
      null,
    [user?.profiles, user?.currentProfileId],
  );

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
      const msg = e instanceof Error ? e.message : "Login failed";
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
      const msg = e instanceof Error ? e.message : "Registration failed";
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
  const switchProfile = (profileId: string) => {
    setUser((prev) => (prev ? { ...prev, currentProfileId: profileId } : prev));
  };

  const addCollaborator = (profileId: string, appUser: AppUser) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profiles: prev.profiles?.map((p) => {
          if (p.id !== profileId || p.role !== UserRole.ORGANIZER) return p;
          const org = p as OrganizerProfile;
          if (org.collaborators?.some((c) => c.id === appUser.id)) return p;
          return {
            ...org,
            collaborators: [...(org.collaborators ?? []), appUser],
          } as OrganizerProfile;
        }),
      };
    });
  };

  const addOrganizerProfile = (orgName: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newProfile: OrganizerProfile = {
        id: `org-${Date.now()}`,
        role: UserRole.ORGANIZER,
        orgName,
        isCreator: true,
        collaborators: [],
        pendingApproval: true,
      };
      return {
        ...prev,
        profiles: [...(prev.profiles ?? []), newProfile],
        currentProfileId: newProfile.id,
      };
    });
  };

  const updateOrgProfileData = (
    profileId: string,
    updates: Partial<OrganizerProfile>,
  ) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            profiles: prev.profiles?.map((p) =>
              p.id === profileId && p.role === UserRole.ORGANIZER
                ? ({ ...p, ...updates } as OrganizerProfile)
                : p,
            ),
          }
        : prev,
    );
  };

  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    location?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiUpdateProfile(data, user);
      setUser(updated);
      if (data.location !== undefined) setLocation(data.location || undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentProfile,
        location,
        loading,
        bootstrapping,
        error,
        login,
        register,
        logout,
        clearError,
        updateLocation,
        switchProfile,
        updateProfile,
        updateOrgProfileData,
        addCollaborator,
        addOrganizerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
