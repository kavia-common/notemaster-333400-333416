"use client";

import React from "react";
import { Edit, Pin, Star, Trash2 } from "lucide-react";
import type { Note } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

/**
 * PUBLIC_INTERFACE
 * NoteDetail renders the selected note content + actions.
 */
export function NoteDetail({
  note,
  onEdit,
  onTogglePinned,
  onToggleFavorite,
  onDelete,
}: {
  note: Note | null;
  onEdit: () => void;
  onTogglePinned: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  if (!note) {
    return (
      <div className="nm-card" style={{ padding: 16 }}>
        <div className="nm-title">Select a note</div>
        <div className="nm-subtitle">
          Choose a note from the list to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="nm-card" style={{ padding: 16 }}>
      <div className="nm-hstack" style={{ justifyContent: "space-between" }}>
        <div className="nm-vstack" style={{ gap: 4 }}>
          <div className="nm-title">{note.title || "Untitled"}</div>
          <div className="nm-subtitle">
            Created {formatDateTime(note.createdAt)} • Updated{" "}
            {formatDateTime(note.updatedAt)}
          </div>
        </div>
        <div className="nm-hstack" style={{ gap: 8, flexWrap: "wrap" }}>
          <button className="nm-btn" onClick={onTogglePinned}>
            <Pin size={16} />
            {note.pinned ? "Unpin" : "Pin"}
          </button>
          <button className="nm-btn" onClick={onToggleFavorite}>
            <Star size={16} />
            {note.favorite ? "Unfavorite" : "Favorite"}
          </button>
          <button className="nm-btn" onClick={onEdit}>
            <Edit size={16} />
            Edit
          </button>
          <button className="nm-btn nm-btn-danger" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="nm-divider" style={{ margin: "14px 0" }} />

      <div className="nm-hstack" style={{ flexWrap: "wrap" }}>
        {note.tags.map((t) => (
          <span key={t} className="nm-chip">
            #{t}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {note.content || <span className="nm-muted">No content.</span>}
      </div>
    </div>
  );
}
