import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AUTH_KEY } from "@/utils/constants";

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

interface JwtPayload {
  role: 'admin' | 'landlord' | 'tenant';
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
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
  login: () => {},
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

  const login = useCallback((userData: User) => {
    const role = getRoleFromToken(userData.token);
    if (!role) return;
    
    const safeUser = { ...userData, role };
    setUser(safeUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
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