import React, { useEffect, useState } from 'react';

export type SearchPickerRow = Record<string, string>;

type Props = {
  open: boolean;
  title: string;
  placeholder: string;
  /** Column headers in display order */
  columns: { key: string; label: string }[];
  /** Returns rows for a given query (caller usually filters its dataset) */
  fetchRows: (query: string) => SearchPickerRow[];
  onClose: () => void;
  onSelect: (row: SearchPickerRow) => void;
};

/** Default reusable picker — Cargo Transfer & similar. Mirrors Figma 1:7202 / 1:7277. */
export default function SearchPickerModal({
  open, title, placeholder, columns, fetchRows, onClose, onSelect,
}: Props) {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const rows = hasSearched ? fetchRows(query) : [];
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHasSearched(false);
    setPage(1);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center p-[24px] overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col p-[24px] gap-[20px]" style={{ width: 'min(960px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="flex items-start justify-between">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} aria-label="Close" className="size-[24px] inline-flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>

        <div className="flex gap-[12px] items-center">
          <div className="bg-white border border-[#d5ddfb] rounded-[4px] flex items-center px-[16px] flex-1" style={{ height: 48 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setHasSearched(true); }}
              placeholder={placeholder}
              className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 ml-[8px]"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
          </div>
          <button
            onClick={() => { setHasSearched(true); setPage(1); }}
            data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[32px] text-[16px] text-[#1360d2] transition-colors"
            style={{ height: 48, fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
          >
            Search
          </button>
        </div>

        <div className="bg-[#f8fafd] rounded-[8px] overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={{ background: '#a6c2e9', height: 44, padding: '0 12px', textAlign: 'left' }}>
                    <div className="flex items-center gap-[4px]">
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, letterSpacing: '0.07px' }}>{c.label}</span>
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4h10M5 8h6M7 12h2" /></svg>
                    </div>
                  </th>
                ))}
                <th style={{ background: '#a6c2e9', height: 44, padding: '0 12px', textAlign: 'center', width: 100 }}>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="flex flex-col items-center gap-[16px] py-[80px]">
                      <div className="bg-[#d9d9d9] rounded-[8px] p-[8px]" style={{ boxShadow: '0px 0px 12px rgba(0,0,0,0.06)' }}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#0e1b3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="9" r="5" />
                          <path d="M13 13l5 5" />
                          <path d="M7 8h4M7 10h2" />
                        </svg>
                      </div>
                      <p className="text-[16px] text-[#696f83]" style={{ fontFamily: "'Dubai', sans-serif" }}>No Records Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((row, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} style={{ background: '#fff', height: 54, padding: '0 12px' }}>
                        <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{row[c.key]}</span>
                      </td>
                    ))}
                    <td style={{ background: '#fff', height: 54, padding: '0 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => { onSelect(row); onClose(); }}
                        className="text-[16px] text-[#1360d2] hover:underline"
                        style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {visible.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-[12px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div className="flex items-center gap-[16px]">
              <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Result</span>
              <div className="flex items-stretch h-[48px] bg-white border border-[#d5ddfb] rounded-[10px] overflow-hidden">
                <span className="flex items-center px-[14px] text-[16px] text-[#8f94ae]" style={{ fontWeight: 500 }}>
                  {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, rows.length)}
                </span>
                <span className="flex items-center gap-[6px] border-l border-[#d5ddfb] px-[14px]">
                  <span className="text-[16px] text-[#111838]">{pageSize}</span>
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-[8px] bg-white rounded-[10px] px-[16px] py-[8px]" style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="size-[28px] rounded-full inline-flex items-center justify-center text-[#7681ab] hover:bg-[#f7faff]"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 5l-5 5 5 5" /></svg></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((n) => (
                <button key={n} onClick={() => setPage(n)} className="size-[32px] rounded-full inline-flex items-center justify-center text-[16px]" style={{ background: n === page ? '#1360d2' : 'transparent', color: n === page ? '#f8fafd' : '#7681ab', fontWeight: 500, opacity: n === page ? 1 : 0.7 }}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="size-[28px] rounded-full inline-flex items-center justify-center text-[#7681ab] hover:bg-[#f7faff]"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 5l5 5-5 5" /></svg></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
