import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import api, { isAxiosError } from "@/utils/api";

export interface User {
  id: string;
  username: string;
  fullname: string | null;
  role: 'admin' | 'landlord' | 'tenant';
  email: string | null;
  phone: string | null;
  avatar: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        // Luôn gọi API check me khi khởi tạo để xác thực từ phía Server
        const res = await api.get('/auth/me');
        const apiUser = res?.data?.user as User | undefined;
        if (!cancelled) setUser(apiUser || null);
      } catch (error) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initAuth();
    return () => { cancelled = true; };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const apiUser = res?.data?.user as User | undefined;
      if (!apiUser) return false;

      setUser(apiUser);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      throw error;
    }
  }, []);

  const memoizedValue = useMemo(() => ({
    user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}