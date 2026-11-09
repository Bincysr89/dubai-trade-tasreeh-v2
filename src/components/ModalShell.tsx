import React, { useEffect } from 'react';

const font = "'Dubai', sans-serif";

/** Column headings and body cells share the claim tables' chrome. */
export const modalTh: React.CSSProperties = {
  background: '#a6c2e9', padding: '10px 14px', textAlign: 'left',
  borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap',
};
export const modalTd: React.CSSProperties = { padding: '10px 14px', verticalAlign: 'middle' };

export function ModalTh({ label, align = 'left' }: { label: string; align?: 'left' | 'right' }) {
  return (
    <th style={{ ...modalTh, textAlign: align }}>
      <span className="text-[16px]" style={{ color: '#000', fontWeight: 600 }}>{label}</span>
    </th>
  );
}

/** Bordered table block with the heading the claim view uses above each one. */
export function ModalTable({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[12px]">
      {title && <p className="text-[18px]" style={{ color: '#0e1b3d', fontWeight: 600, fontFamily: font }}>{title}</p>}
      <div className="rounded-[8px] overflow-x-auto" style={{ border: '1px solid #e8edf5' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
          {children}
        </table>
      </div>
    </div>
  );
}

/**
 * The dialog chrome every claim popup shares — navy title bar, scrolling body and a
 * centred Close, dismissed on Escape or a click outside.
 */
export default function ModalShell({ open, onClose, title, maxWidth = 860, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      role="dialog" aria-modal="true" aria-label={title}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-h-[88vh] flex flex-col overflow-hidden"
        style={{ maxWidth, boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px] flex-shrink-0">
          <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[20px]">{children}</div>

        <div className="flex items-center justify-center px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #e8edf5' }}>
          <button onClick={onClose} data-secondary-btn
            className="h-[44px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
