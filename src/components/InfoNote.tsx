import React from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

/**
 * DT info note — the blue advisory strip used wherever a page has to tell the user
 * something before they act.
 */
export default function InfoNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-[10px] rounded-[4px] px-[16px] py-[12px] ${className}`}
      style={{ background: '#eef4ff', border: '1px solid #1360d2' }} role="note">
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.6" className="flex-shrink-0 mt-[2px]">
        <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6h.01" strokeLinecap="round" />
      </svg>
      <p className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font, lineHeight: 1.45 }}>{children}</p>
    </div>
  );
}
