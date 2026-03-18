"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * PUBLIC_INTERFACE
 * Modal is a lightweight accessible dialog with Escape-to-close.
 */
export function Modal({
  title,
  open,
  onClose,
  children,
  footer,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="nm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // click outside
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="nm-modal">
        <div className="nm-modal-header">
          <div className="nm-title">{title}</div>
          <button className="nm-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="nm-modal-body">{children}</div>
        {footer ? <div className="nm-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
