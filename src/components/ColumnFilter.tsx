import React, { useState, useRef, useEffect } from 'react';

const font = "'Dubai', sans-serif";

type Props = {
  label: string;
  labelClass?: string;
};

export function ColumnFilter({ label, labelClass = 'text-[16px] font-medium text-[#051937]' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'oldest' | 'newest'>('newest');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="flex items-center gap-[6px] relative" ref={ref} style={{ fontFamily: font }}>
      <span className={`${labelClass} whitespace-nowrap`}>{label}</span>
      <button
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        aria-label={`Filter ${label}`}
        style={{ lineHeight: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="#0E1B3D" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-[300] bg-white overflow-hidden"
          style={{
            top: 'calc(100% + 8px)',
            left: 0,
            width: 300,
            borderRadius: 12,
            boxShadow: '0px 4px 24px rgba(0,0,0,0.14)',
            border: '1px solid #e8edf5',
          }}
        >
          {/* Search */}
          <div className="px-[16px] pt-[16px] pb-[12px]">
            <div
              className="flex items-center rounded-[8px] h-[44px] px-[12px] gap-[8px]"
              style={{ border: '1.5px solid #d5ddfb' }}
            >
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent"
                style={{ fontFamily: font }}
              />
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
            </div>
          </div>

          {/* Radio options */}
          <div className="px-[16px] flex flex-col gap-[14px] pb-[16px]">
            {(['oldest', 'newest'] as const).map(opt => (
              <label key={opt} className="flex items-center gap-[12px] cursor-pointer" onClick={() => setSort(opt)}>
                <div
                  className="size-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ borderColor: sort === opt ? '#1360d2' : '#c0c8e0' }}
                >
                  {sort === opt && <div className="size-[8px] rounded-full bg-[#1360d2]" />}
                </div>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                  {opt === 'oldest' ? 'Oldest First' : 'Newest First'}
                </span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-[12px] px-[16px] pb-[16px]">
            <button data-secondary-btn
              onClick={() => { setSearch(''); setSort('newest'); }}
              className="flex-1 h-[44px] text-[16px] text-[#1360d2] transition-colors"
              style={{ fontFamily: font, border: '1.5px solid #1360d2', borderRadius: 8 }}
            >
              Reset
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 h-[44px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, borderRadius: 8 }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
