"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_COOKIE_NAME = "umamiui_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const validUser = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

    if (username === validUser && password === validPass) {
      const expires = new Date();
      expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
      document.cookie = `${SESSION_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/`;
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
