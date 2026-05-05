import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login as apiLogin,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
  fetchProfile,
  logout as apiLogout,
} from "../api/auth";
import { OrganizerProfile, User, UserProfile, UserRole } from "../types/user";
import {
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
} from "../types/auth";
import { AppUser } from "../types/team";

const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentProfile = useMemo<UserProfile | null>(
    () =>
      user?.profiles?.find((p) => p.id === user.currentProfileId) ??
      user?.profiles?.[0] ??
      null,
    [user?.profiles, user?.currentProfileId],
  );

  // Bootstrap: restore session from SecureStore on app start
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

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiLogin(credentials),
    onSuccess: async (userData) => {
      await SecureStore.setItemAsync(TOKEN_KEY, userData.token);
      if (userData.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, userData.refreshToken);
      }
      setUser(userData);
      setError(null);
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => apiRegister(credentials),
    onSuccess: async (userData) => {
      await SecureStore.setItemAsync(TOKEN_KEY, userData.token);
      if (userData.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, userData.refreshToken);
      }
      setUser(userData);
      setError(null);
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Registration failed";
      setError(msg);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) =>
      apiUpdateProfile(data, user?.token ?? "", user),
    onSuccess: (updated) => {
      setUser(updated);
      if (updated.location !== undefined)
        setLocation(updated.location || undefined);
      setError(null);
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Update failed";
      setError(msg);
    },
  });

  // loading reflects any in-flight auth mutation
  const loading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    updateProfileMutation.isPending;

  // ─── Public API ─────────────────────────────────────────────────────────────

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (credentials: RegisterCredentials) => {
    setError(null);
    await registerMutation.mutateAsync(credentials);
  };

  const logout = () => {
    const token = user?.token ?? "";
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
      .then((refreshToken) => {
        if (refreshToken) {
          apiLogout(refreshToken, token).catch(() => {});
        }
      })
      .catch(() => {});
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
    setUser(null);
    setLocation(undefined);
    qc.clear();
  };

  const clearError = () => setError(null);

  const updateLocation = (loc: string) => {
    setLocation(loc);
    setUser((prev) => (prev ? { ...prev, location: loc } : prev));
  };

  const switchProfile = (profileId: string) => {
    setUser((prev) => (prev ? { ...prev, currentProfileId: profileId } : prev));
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setError(null);
    await updateProfileMutation.mutateAsync(data);
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
