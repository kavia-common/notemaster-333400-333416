"use client";

import React from "react";
import { Pin, Star } from "lucide-react";
import type { Note } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";

/**
 * PUBLIC_INTERFACE
 * NotesList renders the list of notes and handles selection.
 */
export function NotesList({
  notes,
  selectedId,
  onSelect,
}: {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (notes.length === 0) {
    return (
      <div className="nm-card" style={{ padding: 16 }}>
        <div className="nm-title">No notes</div>
        <div className="nm-subtitle">
          Create a note or adjust search/filters.
        </div>
      </div>
    );
  }

  return (
    <div className="nm-list" role="list" aria-label="Notes list">
      {notes.map((n) => (
        <div
          key={n.id}
          className={cn(
            "nm-list-item",
            selectedId === n.id && "nm-list-item-active"
          )}
          role="listitem"
          tabIndex={0}
          onClick={() => onSelect(n.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(n.id);
          }}
        >
          <div className="nm-hstack" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              {n.title || "Untitled"}
            </div>
            <div className="nm-hstack" style={{ gap: 6 }}>
              {n.pinned ? (
                <span className="nm-chip">
                  <Pin size={12} />
                  Pinned
                </span>
              ) : null}
              {n.favorite ? (
                <span className="nm-chip">
                  <Star size={12} />
                  Fav
                </span>
              ) : null}
            </div>
          </div>
          <div className="nm-subtitle" style={{ marginTop: 4 }}>
            Updated {formatDateTime(n.updatedAt)}
          </div>
          <div className="nm-hstack" style={{ flexWrap: "wrap", marginTop: 8 }}>
            {n.tags.slice(0, 4).map((t) => (
              <span key={t} className="nm-chip">
                #{t}
              </span>
            ))}
            {n.tags.length > 4 ? (
              <span className="nm-chip">+{n.tags.length - 4}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
