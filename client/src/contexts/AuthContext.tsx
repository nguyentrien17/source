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

  const hasCookie = (name: string) => {
    try {
      return document.cookie.split(';').some((p) => p.trim().startsWith(`${name}=`));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        // If there's no CSRF cookie, we can safely assume there's no active session.
        // (We issue csrf_token only on successful login.)
        if (!hasCookie('csrf_token')) {
          if (!cancelled) setUser(null);
          return;
        }

        const res = await api.get('/auth/me');
        const apiUser = res?.data?.user as User | undefined;
        if (!cancelled) setUser(apiUser || null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    // Fire-and-forget logout; CSRF header will be added by axios interceptor
    api.post('/auth/logout').catch(() => {});
    setUser(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const apiUser = res?.data?.user as User | undefined;
      if (!apiUser) return false;

      setUser(apiUser);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // Sai credentials / dữ liệu thiếu: trả về false để UI hiển thị "Sai tài khoản/mật khẩu"
        if (error.response.status === 401) {
          return false;
        }
        // Lỗi validate (422) cần để UI map lỗi theo field
        if (error.response.status === 422) {
          throw error;
        }
      }
      // Lỗi mạng/500: để UI bắt và hiển thị thông báo lỗi kết nối
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}