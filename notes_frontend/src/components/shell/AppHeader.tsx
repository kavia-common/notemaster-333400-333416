"use client";

import React from "react";
import { LogOut, Plus, Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * PUBLIC_INTERFACE
 * AppHeader renders the top navigation bar.
 */
export function AppHeader({
  query,
  onQueryChange,
  onNewNote,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onNewNote: () => void;
}) {
  const { logout } = useAuth();

  return (
    <header className="nm-header">
      <div className="nm-header-inner">
        <div className="nm-brand" aria-label="NoteMaster">
          <span className="nm-brand-dot" />
          <span>NoteMaster</span>
          <span className="nm-chip" style={{ marginLeft: 6 }}>
            Light • Modern
          </span>
        </div>

        <div className="nm-hstack" style={{ flex: 1, maxWidth: 520 }}>
          <div
            className="nm-hstack"
            style={{
              flex: 1,
              border: "1px solid var(--nm-border)",
              borderRadius: 12,
              padding: "0 10px",
              background: "#fff",
            }}
          >
            <Search size={18} color="var(--nm-muted)" />
            <input
              className="nm-input"
              style={{
                border: "none",
                boxShadow: "none",
                padding: "10px 0",
              }}
              placeholder="Search notes…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search notes"
            />
            <span className="nm-kbd">⌘K</span>
          </div>

          <button className="nm-btn nm-btn-primary" onClick={onNewNote}>
            <Plus size={18} />
            New Note
          </button>

          <button className="nm-btn" onClick={logout} aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
