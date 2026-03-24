import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AUTH_KEY } from "@/utils/constants";
import api, { isAxiosError } from "@/utils/api";

export interface User {
  id: string;
  username: string;
  fullname: string | null;
  role: 'admin' | 'landlord' | 'tenant';
  email: string | null;
  phone: string | null;
  avatar: string | null;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

interface JwtPayload {
  role: 'admin' | 'landlord' | 'tenant';
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

function getRoleFromToken(token: string): 'admin' | 'landlord' | 'tenant' | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    if (payload.exp * 1000 < Date.now()) return null;
    return payload.role;
  } catch {
    return null;
  }
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
    const initAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          const role = getRoleFromToken(parsed.token);
          
          if (role) {
            setUser({ ...parsed, role });
          } else {
            localStorage.removeItem(AUTH_KEY);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_KEY && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const token = res?.data?.token as string | undefined;
      const apiUser = res?.data?.user as Omit<User, 'token'> | undefined;

      if (!token || !apiUser) return false;

      const role = getRoleFromToken(token);
      if (!role) {
        logout();
        return false;
      }

      const safeUser: User = { ...apiUser, token, role };
      setUser(safeUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // Sai credentials / dữ liệu thiếu: trả về false để UI hiển thị "Sai tài khoản/mật khẩu"
        if (error.response.status === 400 || error.response.status === 401) {
          return false;
        }
      }
      // Lỗi mạng/500: để UI bắt và hiển thị thông báo lỗi kết nối
      throw error;
    }
  }, [logout]);

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