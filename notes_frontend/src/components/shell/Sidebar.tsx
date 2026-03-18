"use client";

import React from "react";
import { Pin, Star, Tags } from "lucide-react";

/**
 * PUBLIC_INTERFACE
 * Sidebar provides filters for tags and pinned/favorites.
 */
export function Sidebar({
  tags,
  activeTag,
  onSelectTag,
  filter,
  onFilterChange,
}: {
  tags: { name: string; count: number }[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  filter: "all" | "pinned" | "favorites";
  onFilterChange: (v: "all" | "pinned" | "favorites") => void;
}) {
  return (
    <aside className="nm-card nm-sidebar">
      <div className="nm-vstack">
        <div className="nm-title">Filters</div>

        <div className="nm-vstack" style={{ gap: 8 }}>
          <button
            className="nm-btn"
            onClick={() => onFilterChange("all")}
            style={{
              justifyContent: "space-between",
              borderColor:
                filter === "all"
                  ? "rgba(59,130,246,0.45)"
                  : "var(--nm-border)",
              background: filter === "all" ? "rgba(59,130,246,0.06)" : "#fff",
            }}
          >
            <span className="nm-hstack">
              <Tags size={16} />
              All notes
            </span>
            <span className="nm-chip">A</span>
          </button>

          <button
            className="nm-btn"
            onClick={() => onFilterChange("pinned")}
            style={{
              justifyContent: "space-between",
              borderColor:
                filter === "pinned"
                  ? "rgba(59,130,246,0.45)"
                  : "var(--nm-border)",
              background:
                filter === "pinned" ? "rgba(59,130,246,0.06)" : "#fff",
            }}
          >
            <span className="nm-hstack">
              <Pin size={16} />
              Pinned
            </span>
            <span className="nm-chip">P</span>
          </button>

          <button
            className="nm-btn"
            onClick={() => onFilterChange("favorites")}
            style={{
              justifyContent: "space-between",
              borderColor:
                filter === "favorites"
                  ? "rgba(59,130,246,0.45)"
                  : "var(--nm-border)",
              background:
                filter === "favorites" ? "rgba(59,130,246,0.06)" : "#fff",
            }}
          >
            <span className="nm-hstack">
              <Star size={16} />
              Favorites
            </span>
            <span className="nm-chip">F</span>
          </button>
        </div>

        <div className="nm-divider" />

        <div className="nm-hstack" style={{ justifyContent: "space-between" }}>
          <div className="nm-title" style={{ fontSize: 16 }}>
            Tags
          </div>
          <span className="nm-chip">{tags.length}</span>
        </div>

        <div className="nm-vstack" style={{ gap: 8 }}>
          <button
            className="nm-btn"
            onClick={() => onSelectTag(null)}
            style={{
              justifyContent: "space-between",
              borderColor: !activeTag
                ? "rgba(6,182,212,0.5)"
                : "var(--nm-border)",
              background: !activeTag ? "rgba(6,182,212,0.06)" : "#fff",
            }}
          >
            <span>All tags</span>
            <span className="nm-chip">∅</span>
          </button>

          {tags.map((t) => (
            <button
              key={t.name}
              className="nm-btn"
              onClick={() => onSelectTag(t.name)}
              style={{
                justifyContent: "space-between",
                borderColor:
                  activeTag === t.name
                    ? "rgba(6,182,212,0.5)"
                    : "var(--nm-border)",
                background:
                  activeTag === t.name ? "rgba(6,182,212,0.06)" : "#fff",
              }}
            >
              <span className="nm-hstack" style={{ gap: 8 }}>
                <span className="nm-chip">#</span>
                <span>{t.name}</span>
              </span>
              <span className="nm-chip">{t.count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
