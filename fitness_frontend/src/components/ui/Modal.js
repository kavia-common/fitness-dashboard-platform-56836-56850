import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export default function Modal({ title, open, onClose, children, width = 720 }) {
  /** Accessible modal with escape-to-close and overlay click support. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal" style={{ maxWidth: width }}>
        <div className="modalTop">
          <div style={{ fontWeight: 800 }}>{title}</div>
          <button className="btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
