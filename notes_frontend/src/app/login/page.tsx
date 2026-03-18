"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { getToken } from "@/lib/auth";

function LoginInner() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/app");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (getToken()) router.replace("/app");
  }, [router]);

  return (
    <main className="nm-container">
      <div className="nm-card" style={{ maxWidth: 520, margin: "64px auto", padding: 18 }}>
        <div className="nm-vstack">
          <div className="nm-title" style={{ fontSize: 22 }}>
            Sign in
          </div>
          <div className="nm-subtitle">
            Welcome back. Use your credentials to access your notes.
          </div>

          {err ? <div className="nm-error">{err}</div> : null}

          <form className="nm-vstack" onSubmit={onSubmit}>
            <label className="nm-vstack" style={{ gap: 6 }}>
              <div className="nm-subtitle">Email</div>
              <input
                className="nm-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="nm-vstack" style={{ gap: 6 }}>
              <div className="nm-subtitle">Password</div>
              <input
                className="nm-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button className="nm-btn nm-btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="nm-divider" />

          <div className="nm-subtitle">
            Don’t have an account? <Link href="/register">Create one</Link>.
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * PUBLIC_INTERFACE
 * LoginPage wraps the login UI with AuthProvider.
 */
export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginInner />
    </AuthProvider>
  );
}
