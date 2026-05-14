'use client';

import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * macOS-style alert dialog that asks the visitor if they want to get in
 * touch. Send-email fires a mailto: to Kevin's address. Esc, backdrop
 * click, and the Not-now button all dismiss.
 */
export function MailModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function send() {
    window.location.href =
      'mailto:kevtrinhnguyen@gmail.com?subject=Hello%20from%20ktncodes.com';
    onClose();
  }

  return (
    <div
      className={`finder-mail-backdrop ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="finder-mail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="finder-mail">
        <div className="finder-mail-body">
          <div className="finder-mail-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22 6 12 13 2 6" />
            </svg>
          </div>
          <h2 id="finder-mail-title">Want to get in touch?</h2>
          <p>Send me a note about your project, a job opening, or just to say hi.</p>
          <span className="finder-mail-email">kevtrinhnguyen@gmail.com</span>
        </div>
        <div className="finder-mail-actions">
          <button type="button" onClick={onClose}>
            Not now
          </button>
          <button type="button" className="primary" onClick={send}>
            Send email
          </button>
        </div>
      </div>
    </div>
  );
}
