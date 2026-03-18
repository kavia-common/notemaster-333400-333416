"use client";

import React, { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Note } from "@/lib/api";
import { parseTags } from "@/lib/utils";

type EditorValue = Pick<Note, "title" | "content" | "pinned" | "favorite"> & {
  tagsText: string;
};

/**
 * PUBLIC_INTERFACE
 * NoteEditorModal provides create/edit UI for notes.
 */
export function NoteEditorModal({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Note | null;
  onClose: () => void;
  onSave: (input: {
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    favorite: boolean;
  }) => Promise<void>;
}) {
  const seed = useMemo<EditorValue>(() => {
    if (mode === "edit" && initial) {
      return {
        title: initial.title,
        content: initial.content,
        pinned: initial.pinned,
        favorite: initial.favorite,
        tagsText: initial.tags.join(", "),
      };
    }
    return {
      title: "",
      content: "",
      pinned: false,
      favorite: false,
      tagsText: "",
    };
  }, [mode, initial]);

  const [value, setValue] = useState<EditorValue>(seed);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValue(seed);
      setError(null);
      setSaving(false);
    }
  }, [open, seed]);

  async function handleSave() {
    setError(null);
    if (!value.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: value.title.trim(),
        content: value.content.trim(),
        tags: parseTags(value.tagsText),
        pinned: value.pinned,
        favorite: value.favorite,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={mode === "create" ? "New note" : "Edit note"}
      open={open}
      onClose={onClose}
      footer={
        <>
          <button className="nm-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="nm-btn nm-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </>
      }
    >
      <div className="nm-vstack">
        {error ? <div className="nm-error">{error}</div> : null}

        <label className="nm-vstack" style={{ gap: 6 }}>
          <div className="nm-subtitle">Title</div>
          <input
            className="nm-input"
            value={value.title}
            onChange={(e) => setValue((v) => ({ ...v, title: e.target.value }))}
            placeholder="e.g. Meeting notes"
          />
        </label>

        <label className="nm-vstack" style={{ gap: 6 }}>
          <div className="nm-subtitle">Content</div>
          <textarea
            className="nm-input nm-textarea"
            value={value.content}
            onChange={(e) =>
              setValue((v) => ({ ...v, content: e.target.value }))
            }
            placeholder="Write your note…"
          />
        </label>

        <label className="nm-vstack" style={{ gap: 6 }}>
          <div className="nm-subtitle">Tags (comma separated)</div>
          <input
            className="nm-input"
            value={value.tagsText}
            onChange={(e) =>
              setValue((v) => ({ ...v, tagsText: e.target.value }))
            }
            placeholder="work, ideas, personal"
          />
        </label>

        <div className="nm-hstack" style={{ justifyContent: "space-between" }}>
          <label className="nm-hstack" style={{ gap: 8 }}>
            <input
              type="checkbox"
              checked={value.pinned}
              onChange={(e) =>
                setValue((v) => ({ ...v, pinned: e.target.checked }))
              }
            />
            <span className="nm-subtitle">Pinned</span>
          </label>

          <label className="nm-hstack" style={{ gap: 8 }}>
            <input
              type="checkbox"
              checked={value.favorite}
              onChange={(e) =>
                setValue((v) => ({ ...v, favorite: e.target.checked }))
              }
            />
            <span className="nm-subtitle">Favorite</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
