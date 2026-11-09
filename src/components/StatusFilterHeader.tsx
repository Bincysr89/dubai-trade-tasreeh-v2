import React, { useEffect, useRef, useState } from 'react';

type Props = {
  label: string;
  options: string[];
  value: string | null;
  onChange: (next: string | null) => void;
  /** Optional color map for the dot before each option */
  colorMap?: Record<string, string>;
};

/**
 * Status column header with built-in filter dropdown.
 * Click the filter icon to pick a status; rows are filtered by the parent.
 */
export default function StatusFilterHeader({ label, options, value, onChange, colorMap }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref} style={{ fontFamily: "'Dubai', sans-serif" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[4px] hover:text-[#1360d2] transition-colors"
        style={{ background: 'transparent' }}
      >
        <span className="text-[16px] text-[#000] whitespace-nowrap" style={{ letterSpacing: '0.07px', fontWeight: 500 }}>{label}</span>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke={value ? '#1360d2' : '#8f94ae'} strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M5 8h6M7 12h2" /></svg>
        {value && <span className="size-[6px] rounded-full" style={{ background: '#1360d2' }} />}
      </button>
      {open && (
        <div
          className="absolute z-[200] bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ top: 'calc(100% + 6px)', left: 0, minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
        >
          <button
            type="button"
            className={`flex items-center gap-[8px] w-full px-[14px] py-[8px] text-left hover:bg-[#f0f4ff] transition-colors ${value === null ? 'bg-[#f0f4ff]' : ''}`}
            onClick={() => { onChange(null); setOpen(false); }}
          >
            <span className="text-[16px] text-[#0e1b3d]">All Statuses</span>
          </button>
          <div style={{ height: 1, background: '#f0f0f5', margin: '4px 0' }} />
          {options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                className={`flex items-center gap-[8px] w-full px-[14px] py-[8px] text-left transition-colors ${active ? 'bg-[#f0f4ff]' : 'hover:bg-[#f0f4ff]'}`}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {colorMap && (
                  <span className="size-[8px] rounded-full flex-shrink-0" style={{ background: colorMap[opt] || '#8f94ae' }} />
                )}
                <span className="text-[16px] text-[#0e1b3d]">{opt}</span>
                {active && (
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto"><path d="M3 8l3 3 7-7" /></svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
