"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Guard } from "@/components/auth/Guard";
import { AppHeader } from "@/components/shell/AppHeader";
import { Sidebar } from "@/components/shell/Sidebar";
import { NoteDetail } from "@/components/notes/NoteDetail";
import { NoteEditorModal } from "@/components/notes/NoteEditorModal";
import { NotesList } from "@/components/notes/NotesList";
import { api, type Note } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * AppPage is the main notes UX: list + detail, filters, search, create/edit modal.
 */
export default function AppPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pinned" | "favorites">("all");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const list = await api.listNotes();
      setNotes(list);
      if (!selectedId && list[0]) setSelectedId(list[0].id);
      if (selectedId && !list.find((n) => n.id === selectedId)) {
        setSelectedId(list[0]?.id ?? null);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const n of notes) {
      for (const t of n.tags) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notes
      .filter((n) => {
        if (filter === "pinned" && !n.pinned) return false;
        if (filter === "favorites" && !n.favorite) return false;
        if (activeTag && !n.tags.includes(activeTag)) return false;
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice()
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [notes, query, activeTag, filter]);

  async function createNote(input: {
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    favorite: boolean;
  }) {
    const created = await api.createNote(input);
    setNotes((prev) => [created, ...prev]);
    setSelectedId(created.id);
  }

  async function editNote(input: {
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    favorite: boolean;
  }) {
    if (!selected) return;
    const updated = await api.updateNote(selected.id, input);
    setNotes((prev) => [updated, ...prev.filter((n) => n.id !== updated.id)]);
    setSelectedId(updated.id);
  }

  async function deleteSelected() {
    if (!selected) return;
    await api.deleteNote(selected.id);
    setNotes((prev) => prev.filter((n) => n.id !== selected.id));
    setSelectedId((prev) => {
      if (prev !== selected.id) return prev;
      const next = notes.filter((n) => n.id !== selected.id)[0];
      return next?.id ?? null;
    });
  }

  async function togglePinned() {
    if (!selected) return;
    const updated = await api.updateNote(selected.id, { pinned: !selected.pinned });
    setNotes((prev) => [updated, ...prev.filter((n) => n.id !== updated.id)]);
    setSelectedId(updated.id);
  }

  async function toggleFavorite() {
    if (!selected) return;
    const updated = await api.updateNote(selected.id, {
      favorite: !selected.favorite,
    });
    setNotes((prev) => [updated, ...prev.filter((n) => n.id !== updated.id)]);
    setSelectedId(updated.id);
  }

  return (
    <Guard>
      <div className="nm-app">
        <AppHeader
          query={query}
          onQueryChange={setQuery}
          onNewNote={() => {
            setEditorMode("create");
            setEditorOpen(true);
          }}
        />

        <div className="nm-shell">
          <Sidebar
            tags={tags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            filter={filter}
            onFilterChange={setFilter}
          />

          <main className="nm-card nm-main">
            <div className="nm-vstack">
              <div className="nm-hstack" style={{ justifyContent: "space-between" }}>
                <div className="nm-vstack" style={{ gap: 2 }}>
                  <div className="nm-title">Your notes</div>
                  <div className="nm-subtitle">
                    {loading
                      ? "Loading…"
                      : `${filtered.length} shown • ${notes.length} total`}
                    {activeTag ? ` • tag: #${activeTag}` : ""}
                    {filter !== "all" ? ` • ${filter}` : ""}
                  </div>
                </div>
                <div className="nm-hstack" style={{ gap: 8, flexWrap: "wrap" }}>
                  <button className="nm-btn" onClick={refresh} disabled={loading}>
                    Refresh
                  </button>
                  <button
                    className="nm-btn"
                    onClick={() => {
                      setQuery("");
                      setActiveTag(null);
                      setFilter("all");
                    }}
                    disabled={loading}
                  >
                    Clear filters
                  </button>
                </div>
              </div>

              {err ? (
                <div className="nm-card" style={{ padding: 12, borderColor: "rgba(239,68,68,0.25)" }}>
                  <div className="nm-error" style={{ fontWeight: 600 }}>
                    Failed to load
                  </div>
                  <div className="nm-subtitle">{err}</div>
                </div>
              ) : null}

              <div className="nm-split">
                <section aria-label="Notes list">
                  <NotesList
                    notes={filtered}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                </section>

                <section aria-label="Note detail">
                  <NoteDetail
                    note={selected}
                    onEdit={() => {
                      if (!selected) return;
                      setEditorMode("edit");
                      setEditorOpen(true);
                    }}
                    onTogglePinned={togglePinned}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteSelected}
                  />
                </section>
              </div>
            </div>
          </main>
        </div>

        <NoteEditorModal
          open={editorOpen}
          mode={editorMode}
          initial={editorMode === "edit" ? selected : null}
          onClose={() => setEditorOpen(false)}
          onSave={editorMode === "create" ? createNote : editNote}
        />
      </div>
    </Guard>
  );
}
