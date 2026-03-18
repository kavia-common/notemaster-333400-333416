"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getToken, logout as doLogout, setToken } from "@/lib/auth";

type AuthContextValue = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to authentication methods.
 */
export function useAuth(): AuthContextValue {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages token lifecycle in localStorage.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      async login(email, password) {
        const res = await api.login(email, password);
        setToken(res.token);
        setTokenState(res.token);
      },
      async register(email, password) {
        const res = await api.register(email, password);
        setToken(res.token);
        setTokenState(res.token);
      },
      logout() {
        doLogout();
        setTokenState(null);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
