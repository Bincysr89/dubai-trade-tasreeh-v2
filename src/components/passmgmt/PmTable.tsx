import React, { useMemo, useState } from 'react';
import arrowDownSrc from '../../assets/passmgmt/arrow-down.svg';
import { Btn, C, FSelect, font } from './PmUI';

/* ──────────────────────────────────────────────────────────────
   Figma listing card — title, search, Advanced Search, primary
   action, uppercase sortable header bar, 50px zebra rows and the
   boxed-arrow pagination. Shared by Pass Management and the
   My Workspace pages.
   ────────────────────────────────────────────────────────────── */

export type Col<T> = {
  key: string; label: string; sortable?: boolean; width?: string;
  value?: (r: T) => string;
  render?: (r: T) => React.ReactNode;
};
export type FilterDef<T> = { label: string; options: string[]; match: (r: T, v: string) => boolean };

const PAGE = 10;

function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden className="flex-shrink-0">
      <path d="M10 4.5l3.5 4h-7z" fill={dir === 'asc' ? C.primary : '#9aa3bd'} opacity={dir === 'desc' ? 0 : 1} />
      <path d="M10 15.5l-3.5-4h7z" fill={dir === 'desc' ? C.primary : '#9aa3bd'} opacity={dir === 'asc' ? 0 : 1} />
    </svg>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages < 1) return null;
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => Math.max(0, Math.min(pages - 5, page - 2)) + i);
  const box = (enabled: boolean): React.CSSProperties => ({ border: `1px solid ${enabled ? C.primary : '#9aa3bd'}`, color: enabled ? C.primary : '#9aa3bd' });
  return (
    <div className="flex items-center gap-[8px]" role="navigation" aria-label="Pagination">
      <button aria-label="Previous page" disabled={page === 0} onClick={() => onPage(page - 1)}
        className="size-[30px] rounded-[4px] flex items-center justify-center bg-white" style={box(page > 0)}>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.5 4.5L7 10l5.5 5.5" /></svg>
      </button>
      {nums.map(n => (
        <button key={n} onClick={() => onPage(n)} aria-current={n === page ? 'page' : undefined}
          className="min-w-[30px] h-[30px] px-[6px] rounded-[4px] text-[16px] ml-[2px]"
          style={{ background: n === page ? C.bar : 'transparent', color: C.navy, fontWeight: n === page ? 700 : 400 }}>{n + 1}</button>
      ))}
      <button aria-label="Next page" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}
        className="size-[30px] rounded-[4px] flex items-center justify-center bg-white ml-[4px]" style={box(page < pages - 1)}>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.5 4.5L13 10l-5.5 5.5" /></svg>
      </button>
    </div>
  );
}

export default function PmListCard<T>({
  title, rows, cols, rowKey, search, searchPlaceholder = 'Search', filters, advancedChevron, action, actionCol, advancedPanel,
}: {
  title: string;
  rows: T[];
  cols: Col<T>[];
  rowKey: (r: T) => string;
  /** Fields the search box matches against */
  search: (r: T) => string;
  searchPlaceholder?: string;
  filters?: FilterDef<T>[];
  advancedChevron?: boolean;
  action?: { label: string; onClick: () => void };
  actionCol: { label: string; width?: string; render: (r: T) => React.ReactNode };
  /** Bespoke Advanced Search panel (Figma "Search Filters") — replaces the default filter grid */
  advancedPanel?: (ctx: { close: () => void; apply: (pred: ((r: T) => boolean) | null) => void }) => React.ReactNode;
}) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [advOpen, setAdvOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [pred, setPred] = useState<{ fn: (r: T) => boolean } | null>(null);

  const shown = useMemo(() => {
    let out = rows.filter(r => !q || search(r).toLowerCase().includes(q.toLowerCase()));
    filters?.forEach(f => { const v = applied[f.label]; if (v) out = out.filter(r => f.match(r, v)); });
    if (pred) out = out.filter(pred.fn);
    if (sort) {
      const col = cols.find(c => c.key === sort.key);
      const val = (r: T) => col?.value?.(r) ?? String((r as Record<string, unknown>)[sort.key] ?? '');
      out = [...out].sort((a, b) => val(a).localeCompare(val(b), undefined, { numeric: true }) * (sort.dir === 'asc' ? 1 : -1));
    }
    return out;
  }, [rows, q, sort, applied, filters, cols, search, pred]);

  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = shown.slice(cur * PAGE, cur * PAGE + PAGE);
  const toggleSort = (key: string) => {
    setSort(s => (!s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));
    setPage(0);
  };

  return (
    <div className="bg-white rounded-[4px] px-[20px] pt-[18px] pb-[28px]" style={{ fontFamily: font }}>
      {/* Title row */}
      <div className="flex items-center gap-[20px] flex-wrap mb-[20px]">
        <h1 className="text-[22px] font-medium flex-1 min-w-[180px]" style={{ color: C.navy }}>{title}</h1>
        <label className="flex items-center gap-[11px] h-[48px] px-[11px] rounded-[8px] bg-white w-full sm:w-[530px]" style={{ border: '1px solid #cbd5e1' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={C.primary} strokeWidth="1.8" aria-hidden><circle cx="10.5" cy="10.5" r="7" /><path d="M16 16l5 5" strokeLinecap="round" /></svg>
          <input value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder={searchPlaceholder} aria-label={searchPlaceholder}
            className="flex-1 min-w-0 text-[14px] focus:outline-none placeholder-[#999]" style={{ color: C.text, fontFamily: font }} />
        </label>
        {(filters || advancedPanel) && (
          <button onClick={() => setAdvOpen(o => !o)} className="flex items-center gap-[4px] text-[14px] font-bold whitespace-nowrap" style={{ color: C.primary }} aria-expanded={advOpen}>
            Advanced Search
            {advancedChevron && <img src={arrowDownSrc} alt="" width={9.7166} height={6} style={{ transform: advOpen ? 'rotate(180deg)' : undefined }} />}
          </button>
        )}
        {action && <Btn onClick={action.onClick}>{action.label}</Btn>}
      </div>

      {/* Advanced Search — Apply / Reset ride in the field grid after the last field */}
      {advancedPanel && advOpen && advancedPanel({
        close: () => setAdvOpen(false),
        apply: fn => { setPred(fn ? { fn } : null); setPage(0); },
      })}
      {filters && !advancedPanel && advOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] items-end rounded-[4px] p-[16px] mb-[20px]" style={{ background: C.zebra }}>
          {filters.map(f => (
            <FSelect key={f.label} label={f.label} value={draft[f.label] ?? ''} options={f.options} onChange={v => setDraft(d => ({ ...d, [f.label]: v }))} />
          ))}
          <div className="flex items-end gap-[10px]">
            <Btn small onClick={() => { setApplied(draft); setPage(0); }}>Apply</Btn>
            <Btn small variant="outline" onClick={() => { setDraft({}); setApplied({}); setPage(0); }}>Reset</Btn>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate" style={{ borderSpacing: '0 0' }}>
          <thead>
            <tr style={{ background: C.bar }}>
              {cols.map(c => (
                <th key={c.key} scope="col" style={{ width: c.width }} className="h-[36px] pl-[16px] pr-[8px] text-left font-normal">
                  {c.sortable === false ? (
                    <span className="text-[14px] uppercase" style={{ color: C.sub }}>{c.label}</span>
                  ) : (
                    <button onClick={() => toggleSort(c.key)} className="flex items-center gap-[2px] text-[14px] uppercase whitespace-nowrap" style={{ color: C.sub }}
                      aria-label={`Sort by ${c.label}`}>
                      {c.label}<SortIcon dir={sort?.key === c.key ? sort.dir : null} />
                    </button>
                  )}
                </th>
              ))}
              <th scope="col" style={{ width: actionCol.width ?? '80px' }} className="h-[36px] pr-[10px] text-left font-normal text-[14px] uppercase">
                <span style={{ color: C.sub }}>{actionCol.label}</span>
              </th>
            </tr>
            <tr aria-hidden><td colSpan={cols.length + 1} className="h-[4px] p-0" /></tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={rowKey(r)} style={{ background: i % 2 === 0 ? C.zebra : '#fff' }}>
                {cols.map(c => (
                  <td key={c.key} className="h-[50px] pl-[16px] pr-[8px] text-[15px] whitespace-nowrap" style={{ color: C.text }}>
                    {c.render ? c.render(r) : (c.value?.(r) ?? String((r as Record<string, unknown>)[c.key] ?? ''))}
                  </td>
                ))}
                <td className="h-[50px] pr-[10px]">{actionCol.render(r)}</td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={cols.length + 1} className="h-[120px] text-center text-[15px]" style={{ color: C.sub }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-[40px]">
        <Pager page={cur} pages={pages} onPage={setPage} />
      </div>
    </div>
  );
}

/* Grey square icon button used in the Action column (⋮ / eye / download / edit) */
export function GreyIconBtn({ label, onClick, children, tone = 'grey' }: { label: string; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; children: React.ReactNode; tone?: 'grey' | 'red' }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="size-[35px] rounded-[4px] inline-flex items-center justify-center hover:brightness-95 transition"
      style={{ background: tone === 'red' ? '#fde8e6' : '#dee3ea', color: tone === 'red' ? '#e35d4f' : C.navy }}>
      {children}
    </button>
  );
}
