"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { getToken } from "@/lib/auth";

function RegisterInner() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== password2) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.replace("/app");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Register failed");
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
            Create account
          </div>
          <div className="nm-subtitle">
            Start organizing notes with tags, pinning, favorites, and search.
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
                placeholder="At least 6 characters"
                required
              />
            </label>

            <label className="nm-vstack" style={{ gap: 6 }}>
              <div className="nm-subtitle">Confirm password</div>
              <input
                className="nm-input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Repeat password"
                required
              />
            </label>

            <button className="nm-btn nm-btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <div className="nm-divider" />

          <div className="nm-subtitle">
            Already have an account? <Link href="/login">Sign in</Link>.
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * PUBLIC_INTERFACE
 * RegisterPage wraps register UI with AuthProvider.
 */
export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterInner />
    </AuthProvider>
  );
}
