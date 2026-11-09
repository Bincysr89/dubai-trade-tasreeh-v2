import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { font } from './DeclarationUI';

const cancelSrc = new URL('../../assets/declaration/cancel-24px.svg', import.meta.url).href;

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Card max width; the lookups are wider than the forms. */
  maxWidth?: number;
};

/** Shared popup shell for the declaration lookups — dark navy header over a white card. */
export default function DeclarationModal({ title, onClose, children, maxWidth = 1000 }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-start justify-center p-[24px] overflow-y-auto"
      role="dialog" aria-modal="true" aria-label={title}
      style={{ background: 'rgba(11,21,52,0.45)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative bg-white rounded-[6px] w-full overflow-hidden flex flex-col my-auto"
        style={{ maxWidth, boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px]" style={{ height: 56 }}>
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} aria-label="Close" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
            <img src={cancelSrc} alt="" width={24} height={24} />
          </button>
        </div>
        <div className="px-[24px] py-[28px]">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
