import React, { useEffect, useRef, useState } from 'react';

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const start = (page - 1) * pageSize + 1;
  const end = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;
  const total = totalItems ?? totalPages * pageSize;

  const pages = (() => {
    const max = 7;
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let from = Math.max(1, page - half);
    let to = from + max - 1;
    if (to > totalPages) { to = totalPages; from = to - max + 1; }
    return Array.from({ length: max }, (_, i) => from + i);
  })();

  const font = "'Dubai', sans-serif";

  return (
    <div className="flex items-center justify-end gap-[20px] flex-wrap" style={{ fontFamily: font }}>
      {/* Left: Results per page + dropdown + range */}
      <div className="flex items-center gap-[10px]">
        <span className="text-[16px] text-[#111838] whitespace-nowrap" style={{ fontWeight: 500 }}>
          Results per page:
        </span>

        {/* Page size dropdown */}
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-[6px] h-[40px] px-[14px] bg-white border border-[#d5ddfb] rounded-[8px] hover:bg-[#f7faff] transition-colors"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>{pageSize}</span>
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              className={`text-[#697498] transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M5 7.5l5 5 5-5" />
            </svg>
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute right-0 top-[44px] z-[80] bg-white rounded-[8px] py-[4px] overflow-hidden min-w-[80px]"
              style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
            >
              {pageSizeOptions.map(n => {
                const active = n === pageSize;
                return (
                  <li
                    key={n}
                    role="option"
                    aria-selected={active}
                    onClick={() => { onPageSizeChange(n); setOpen(false); }}
                    className="px-[14px] py-[8px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] hover:text-[#1360d2] transition-colors"
                    style={{
                      color: active ? '#1360d2' : '#111838',
                      background: active ? '#e2ebf9' : 'transparent',
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {n}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Range text */}
        <span className="text-[16px] text-[#8f94ae] whitespace-nowrap">
          {start} – {end} of {total}
        </span>
      </div>

      {/* Right: Navigation pill */}
      <div
        className="inline-flex items-center bg-white rounded-[12px] px-[8px] py-[6px] gap-[2px]"
        style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}
      >
        {/* First page */}
        <NavBtn onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="First page">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v12M8 5l-4 5 4 5" />
          </svg>
        </NavBtn>

        {/* Prev page */}
        <NavBtn onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Previous page">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 5l-5 5 5 5" />
          </svg>
        </NavBtn>

        {/* Page numbers */}
        {pages.map(n => {
          const active = n === page;
          return (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className="size-[36px] rounded-full flex items-center justify-center transition-colors"
              style={{
                background: active ? '#1360d2' : 'transparent',
                color: active ? '#ffffff' : '#7681ab',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
              }}
              aria-current={active ? 'page' : undefined}
            >
              {n}
            </button>
          );
        })}

        {/* Next page */}
        <NavBtn onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} aria-label="Next page">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 5l5 5-5 5" />
          </svg>
        </NavBtn>

        {/* Last page */}
        <NavBtn onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="Last page">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4v12M12 5l4 5-4 5" />
          </svg>
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, children, 'aria-label': ariaLabel }: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="size-[36px] flex items-center justify-center rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f0f4ff] text-[#7681ab]"
    >
      {children}
    </button>
  );
}
