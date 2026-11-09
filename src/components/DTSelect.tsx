import React, { useEffect, useRef, useState } from 'react';

type Option = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  height?: number;
};

/**
 * Dubai Trade-styled custom dropdown. Replaces native `<select>` with a custom
 * flyout (white background, soft shadow, blue-tinted hover/selected state) so
 * the menu can be styled consistently across the platform.
 */
export default function DTSelect({
  label, value, onChange, options, required, placeholder = 'Select', height = 56,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const floated = !!value || open;

  return (
    <div className="relative" ref={ref} style={{ fontFamily: "'Dubai', sans-serif" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-white rounded-[4px] flex items-center px-[16px] w-full text-left transition-colors"
        style={{ border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, height }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex-1 text-[16px]" style={{ color: selected ? '#0e1b3d' : '#697498' }}>
          {selected ? selected.label : (open ? placeholder : '')}
        </span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <span
        className="absolute pointer-events-none transition-all"
        style={{
          left: floated ? 10 : 16,
          top: floated ? -9 : '50%',
          transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent',
          padding: floated ? '0 4px' : 0,
          fontSize: floated ? 12 : 16,
          color: floated ? (open ? '#1360d2' : '#000') : '#000',
          transitionDuration: '120ms',
        }}
      >
        {required && <span style={{ color: '#dc3545' }}>*</span>}
        {required ? ' ' : ''}{label}
      </span>

      {open && (
        <div
          className="absolute z-[80] left-0 right-0 mt-[6px] bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                style={{
                  background: isSelected ? '#e2ebf9' : 'transparent',
                  color: isSelected ? '#1360d2' : '#0e1b3d',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
