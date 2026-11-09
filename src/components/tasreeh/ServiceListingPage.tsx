import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import Pagination from '../Pagination';
import ManageColumnsModal, { ColDef } from '../ManageColumnsModal';
import { ColumnFilter } from '../ColumnFilter';
import StatusFilterHeader from '../StatusFilterHeader';
import { StatusAsOnBadge } from '../DatePicker';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import { font, GSelect, GDate, GInput, NeedHelp, ResetBtn, IconBtn } from '../gatepass/GateFields';
import { AGENT_BANNER } from '../gatepass/gatePassData';
import { allFields, statusStyle, STATUS_STYLE, type ServiceConfig, type ServiceRow, type FieldDef } from './serviceTypes';
import { displayValue } from './ServiceField';
import { DhAmount } from '../Dh';

const DOWNLOAD_OPTIONS = ['Download as Excel', 'Download as PDF', 'Download as CSV'];

type Props = {
  config: ServiceConfig;
  rows: ServiceRow[];
  drafts: ServiceRow[];
  /** Open with the Drafts toggle on ("View All Drafts"). */
  initialShowDrafts?: boolean;
  onClose: () => void;
  onCreate: () => void;
  onAction: (action: string, row: ServiceRow) => void;
  onOpenDraft: (row: ServiceRow) => void;
  /** Tabs in the toolbar's second row (Integrated Clearance tab pill), e.g. My Requests / My NOC's */
  tabs?: { key: string; label: string }[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  mode?: ListingMode;
};

/** Same master template, tuned for other tables (Payments, My NOC's) */
export type ListingMode = {
  hideCreate?: boolean;
  hideDrafts?: boolean;
  /** Eye icon instead of the three-dot flyout — opens onAction('View', row) */
  viewOnly?: boolean;
  /** Download icon instead of the three-dot flyout — onAction('Download', row) */
  downloadOnly?: boolean;
  /** Row checkboxes + a primary button above the table (e.g. Pay Selected) */
  select?: { label: string; onSubmit: (rows: ServiceRow[]) => void };
  /** Column shown as an amount with the Dirham glyph */
  amountKey?: string;
  /** Label of the date-range badge (default "Submitted Date") */
  dateLabel?: string;
};

/* Values shown in the table / card for each column key */
function cellValue(cfg: ServiceConfig, r: ServiceRow, key: string): string {
  if (key === 'applicationNo') return r.applicationNo;
  if (key === 'createdOn') return r.createdOn;
  const def = allFields(cfg).find(f => f.key === key);
  return displayValue(def, r.values.fields[key]);
}

/* Sticky block = Application Status (180) + Actions (90) */
const STICKY_W = 270;

/* Close a popover on outside click */
function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, close]);
  return ref;
}

/* ── Toolbar dropdown button (Status / Download) ── */
function ToolbarDropdown({ label, options, value, onPick, align = 'left', allLabel }: {
  label: string; options: string[]; value?: string | null; onPick: (v: string | null) => void;
  align?: 'left' | 'right'; allLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="h-[48px] px-[16px] flex items-center gap-[10px] rounded-[4px] border border-[#d4dcfa] bg-white text-[16px] text-[#1360d2] hover:bg-[#f0f4ff] transition-colors whitespace-nowrap"
        style={{ fontFamily: font, fontWeight: 500 }}>
        {value ?? label}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2.4"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-[52px] z-[200] bg-white rounded-[8px] py-[4px]`}
          style={{ minWidth: 210, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {allLabel && (
            <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#697498] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => { onPick(null); setOpen(false); }}>{allLabel}</button>
          )}
          {options.map(o => (
            <button key={o}
              className="w-full px-[14px] py-[10px] text-left text-[16px] hover:bg-[#e2ebf9] flex items-center gap-[10px]"
              style={{ fontFamily: font, color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 600 : 400 }}
              onClick={() => { onPick(o); setOpen(false); }}>
              {STATUS_STYLE[o] && <span className="size-[8px] rounded-full flex-shrink-0" style={{ background: STATUS_STYLE[o].color }} />}
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Row action flyout (Figma 4:33476) ── */
const Eye = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#455174" strokeWidth="1.7">
    <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const XCircle = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#455174" strokeWidth="1.7">
    <circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
  </svg>
);
const Doc = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#455174" strokeWidth="1.7">
    <rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
  </svg>
);
const actionIcon = (label: string) => (/^view/i.test(label) ? <Eye /> : /cancel/i.test(label) ? <XCircle /> : <Doc />);

function ActionFlyout({ actions, onPick, onClose }: { actions: string[]; onPick: (a: string) => void; onClose: () => void }) {
  const ref = useOutside(true, onClose);
  return (
    <div ref={ref} className="absolute z-[120] right-0 bg-white rounded-[10px] py-[8px] overflow-hidden"
      style={{ top: 36, width: 220, boxShadow: '0px 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
      {actions.map(label => (
        <button key={label} onClick={() => onPick(label)}
          className="w-full px-[16px] py-[11px] text-left text-[16px] text-[#111838] hover:bg-[#e2ebf9] transition-colors flex items-center gap-[12px]"
          style={{ fontFamily: font }}>
          {actionIcon(label)}
          <span className="whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
}

const Kebab = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} aria-label="Row actions"
    className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
    <svg viewBox="0 0 20 20" width="18" height="18" fill="#0e1b3d">
      <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
    </svg>
  </button>
);

const Chevron = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} aria-label="Continue draft"
    className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0e1b3d" strokeWidth="2.2">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

/* ── Card view (same card chrome as Gate Passes) ── */
function ServiceCard({ cfg, row, draft, selected, onToggle, onAction, onOpenDraft }: {
  cfg: ServiceConfig; row: ServiceRow; draft: boolean; selected: boolean; onToggle: () => void;
  onAction: (a: string) => void; onOpenDraft: () => void;
}) {
  const [open, setOpen] = useState(false);
  const st = statusStyle(row.status);
  const keys = cfg.columns.map(c => c.key).filter(k => k !== 'applicationNo' && k !== 'createdOn').slice(0, 4);
  const label = (k: string) => cfg.columns.find(c => c.key === k)?.label ?? k;
  const Cell = ({ k }: { k: string }) => {
    const value = cellValue(cfg, row, k);
    return (
      <div className="bg-[#f6f8fc] rounded-[4px] px-[10px] py-[9px] min-w-0 flex-1 text-center truncate" title={`${label(k)}: ${value}`}>
        <span className="text-[14px] text-[#5a6478]" style={{ fontFamily: font }}>{label(k)}: </span>
        <span className="text-[14px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>{value}</span>
      </div>
    );
  };
  return (
    <div className="bg-white rounded-[10px] p-[16px] flex flex-col gap-[10px]" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.16)' }}>
      <div className="flex items-start gap-[12px]">
        <span className="size-[54px] rounded-full bg-white flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 2px 10px rgba(143,155,186,0.30)' }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#1360d2" strokeWidth="1.7">
            <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3z" strokeLinejoin="round" />
            <path d="M8.5 12l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input type="checkbox" checked={selected} onChange={onToggle}
              className="size-[18px] rounded-[3px] cursor-pointer flex-shrink-0" style={{ accentColor: '#1360d2' }} />
            <span className="text-[17px] font-medium text-[#0e1b3d] truncate" style={{ fontFamily: font }}>{row.applicationNo}</span>
          </label>
          <span className="inline-flex items-center px-[16px] py-[3px] rounded-[4px] text-[15px] font-medium mt-[8px]"
            style={{ background: st.bg, color: st.color, fontFamily: font }}>
            {row.status}
          </span>
        </div>
        <div className="relative flex-shrink-0">
          {draft ? <Chevron onClick={onOpenDraft} /> : <Kebab onClick={() => setOpen(o => !o)} />}
          {open && <ActionFlyout actions={cfg.actions} onPick={a => { setOpen(false); onAction(a); }} onClose={() => setOpen(false)} />}
        </div>
      </div>
      {keys.length > 0 && <div className="flex gap-[10px]">{keys.slice(0, 2).map(k => <Cell key={k} k={k} />)}</div>}
      {keys.length > 2 && <div className="flex gap-[10px]">{keys.slice(2, 4).map(k => <Cell key={k} k={k} />)}</div>}
      <div className="bg-[#f6f8fc] rounded-[4px] px-[16px] py-[12px] flex items-center justify-between gap-[10px]">
        <div className="flex flex-col gap-[4px] min-w-0">
          <span className="text-[13px] text-[#5a6478]" style={{ fontFamily: font }}>Created on</span>
          <span className="text-[15px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>{row.createdOn}</span>
        </div>
      </div>
    </div>
  );
}

export default function ServiceListingPage({ config: cfg, rows, drafts, initialShowDrafts = false, onClose, onCreate, onAction, onOpenDraft, tabs, activeTab, onTabChange, mode = {} }: Props) {
  const [view, setView] = useState<'list' | 'card'>('list');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchType, setSearchType] = useState(cfg.searchFields[0]);
  const [searchValue, setSearchValue] = useState('');
  const [searchDropOpen, setSearchDropOpen] = useState(false);
  const [afOpen, setAfOpen] = useState(false);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [showColModal, setShowColModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showDrafts, setShowDrafts] = useState(initialShowDrafts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('2022-12-28');
  const [dateTo, setDateTo] = useState('2023-01-10');
  const [af, setAf] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [visibleCols, setVisibleCols] = useState<string[]>(cfg.defaultVisible);

  const searchRef = useOutside(searchDropOpen, () => setSearchDropOpen(false));

  const visibleHeaders = visibleCols.map(k => cfg.columns.find(c => c.key === k)!).filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const has = (hay: string, needle?: string) => !needle || hay.toLowerCase().includes(needle.toLowerCase());

  const source = showDrafts ? drafts : rows;
  /* Search field label → column key (falls back to the application number) */
  const keyForLabel = (label: string) =>
    cfg.columns.find(c => c.label === label)?.key ?? allFields(cfg).find(f => f.label === label)?.key ?? 'applicationNo';
  const filtered = source.filter(r => {
    if (!showDrafts && statusFilter && r.status !== statusFilter) return false;
    if (applied.status && r.status !== applied.status) return false;
    for (const f of cfg.filters) {
      const v = applied[f.key];
      if (!v || f.key === 'status') continue;
      const hay = f.key === 'applicationNo' ? r.applicationNo : (r.values.fields[f.key] ?? '');
      if (f.type === 'select' ? hay !== v : !has(hay, v)) return false;
    }
    if (!searchValue) return true;
    return has(cellValue(cfg, r, keyForLabel(searchType)), searchValue);
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* The shared hook measures overflow once on mount — re-measure when the table's contents change. */
  useEffect(() => {
    const t = setTimeout(handleScroll, 60);
    return () => clearTimeout(t);
  }, [handleScroll, showDrafts, view, visibleCols, page, pageSize, filtered.length]);
  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + STICKY_W + (mode.select ? 52 : 0);

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const pick = (a: string, row: ServiceRow) => { setOpenFlyout(null); onAction(a, row); };

  /* Row selection (Pay Selected) */
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const togglePicked = (id: string) => setPicked(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const pageIds = paginated.map(r => r.applicationNo);
  const allOnPage = pageIds.length > 0 && pageIds.every(id => picked.has(id));
  const togglePage = () => setPicked(prev => {
    const n = new Set(prev);
    if (allOnPage) pageIds.forEach(id => n.delete(id)); else pageIds.forEach(id => n.add(id));
    return n;
  });
  const statusLabel = cfg.statusLabel ?? 'Application Status';
  const cellNode = (row: ServiceRow, key: string) => {
    const v = cellValue(cfg, row, key);
    return key === mode.amountKey && v !== '-'
      ? <DhAmount value={v} className="text-[16px] font-bold text-[#051937]" style={{ fontFamily: font }} />
      : v;
  };

  return (
    <>
      {showColModal && (
        <ManageColumnsModal
          columns={cfg.columns}
          visible={visibleCols}
          lockedColumns={[{ key: '_status', label: statusLabel }, { key: '_action', label: 'Actions' }]}
          onSave={setVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Header onHome={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-8">
          {/* Breadcrumb + agent banner */}
          <div className="flex items-center justify-between mt-[16px] mb-[10px] gap-4 flex-wrap">
            <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
              <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
              <span className="text-[#dc3545] px-[4px]">/</span>
              <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Service Catalog</span>
              <span className="text-[#dc3545] px-[4px]">/</span>
              <span className="text-[#111838] font-medium">{cfg.title}</span>
            </div>
            <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
              {AGENT_BANNER}
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-[#0e1b3d] mb-[22px]" style={{ fontFamily: font }}>
            {cfg.title}
          </h1>

          {/* Toolbar — row 1 */}
          <div className="flex items-center gap-[12px] mb-[14px] flex-wrap">
            <button
              onClick={() => setAfOpen(o => !o)}
              className={`h-[48px] w-[210px] px-[16px] flex items-center justify-between gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
                afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#1360d2] text-[#1360d2] hover:bg-[#f0f4ff]'
              }`}
              style={{ fontFamily: font }}
            >
              Advanced Filters
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Search — field selector + input */}
            <div className="flex h-[48px] rounded-[4px] border border-[#d4dcfa] bg-white relative" ref={searchRef}>
              <button
                className="flex items-center gap-[8px] px-[14px] border-r border-[#d4dcfa] select-none"
                onClick={() => setSearchDropOpen(o => !o)}
              >
                <span className="text-[16px] text-[#1360d2] whitespace-nowrap font-medium" style={{ fontFamily: font }}>{searchType}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" className={`transition-transform ${searchDropOpen ? 'rotate-180' : ''}`}>
                  <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {searchDropOpen && (
                <div className="absolute left-0 top-[52px] bg-white rounded-[10px] py-[8px] z-[200]"
                  style={{ minWidth: 230, boxShadow: '0 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
                  {cfg.searchFields.map(f => (
                    <button key={f} className="w-full px-[16px] py-[11px] text-left hover:bg-[#e2ebf9] transition-colors"
                      onClick={() => { setSearchType(f); setSearchValue(''); setSearchDropOpen(false); }}>
                      <span className="text-[16px] text-[#111838]" style={{ fontFamily: font }}>{f}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center px-[14px] gap-[10px]">
                <input
                  type="text" value={searchValue} onChange={e => { setSearchValue(e.target.value); setPage(1); }}
                  placeholder={`Search by ${searchType}`}
                  className="w-[200px] text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none"
                  style={{ fontFamily: font }}
                />
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                  <circle cx="7.5" cy="7.5" r="6" stroke="#0e1b3d" strokeWidth="1.6" />
                  <path d="M12 12l5 5" stroke="#0e1b3d" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <ToolbarDropdown label="Status" options={cfg.statuses} value={statusFilter} allLabel="— All —"
              onPick={v => { setStatusFilter(v as string | null); setPage(1); }} />

            <div className="flex-1" />

            {/* Card / list view toggle */}
            <div className="flex items-center gap-[4px] rounded-[6px] bg-[#eef1f7] p-[5px]">
              {(['card', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} aria-label={`${v} view`}
                  className="w-[56px] h-[38px] rounded-[6px] flex items-center justify-center transition-colors"
                  style={{ background: view === v ? '#fff' : 'transparent', boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.12)' : 'none' }}>
                  {v === 'card' ? (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={view === v ? '#1360d2' : '#8b93a7'} strokeWidth="1.6">
                      <rect x="2.5" y="2.5" width="6" height="6" rx="1" /><rect x="11.5" y="2.5" width="6" height="6" rx="1" />
                      <rect x="2.5" y="11.5" width="6" height="6" rx="1" /><rect x="11.5" y="11.5" width="6" height="6" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={view === v ? '#1360d2' : '#8b93a7'} strokeWidth="1.9" strokeLinecap="round">
                      <path d="M6.5 5h11M6.5 10h11M6.5 15h11" /><path d="M2.6 5h.01M2.6 10h.01M2.6 15h.01" strokeWidth="2.6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <NeedHelp />

            {!mode.hideCreate && (
              <button
                onClick={onCreate}
                className="h-[48px] w-[171px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
              >
                {cfg.createLabel ?? 'Create'}
              </button>
            )}
          </div>

          {/* Advanced filters panel (Figma 109:6497) */}
          {afOpen && (
            <div className="relative bg-white rounded-[8px] p-[20px] mb-[16px] border border-[#e2e8f5]"
              style={{ boxShadow: '4px 4px 30px rgba(0,0,0,0.12)' }}>
              <div className="flex items-center justify-between mb-[22px]">
                <p className="text-[14px] font-medium uppercase text-[#0e1b3d]" style={{ fontFamily: font }}>Search Filters</p>
                <button onClick={() => setAfOpen(false)} aria-label="Close filters"
                  className="size-[30px] flex items-center justify-center rounded-full text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[24px]">
                {cfg.filters.map((f: FieldDef) => (
                  f.type === 'select'
                    ? <GSelect key={f.key} label={f.label} value={af[f.key] ?? ''} options={f.options ?? []}
                        onChange={v => setAf(p => ({ ...p, [f.key]: v }))} />
                    : f.type === 'date'
                      ? <GDate key={f.key} label={f.label} value={af[f.key] ?? ''} onChange={v => setAf(p => ({ ...p, [f.key]: v }))} />
                      : <GInput key={f.key} label={f.label} value={af[f.key] ?? ''} onChange={v => setAf(p => ({ ...p, [f.key]: v }))} />
                ))}
                {/* Reset / Search sit inline in the grid, right after the last field */}
                <div className="flex gap-[14px] items-center">
                  <div className="flex-1 [&>button]:w-full"><ResetBtn tall onClick={() => { setAf({}); setApplied({}); setPage(1); }} /></div>
                  <button onClick={() => { setApplied(af); setPage(1); setAfOpen(false); }}
                    className="h-[56px] flex-1 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Search</button>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar — row 2: Submitted-date badge + Drafts + Download + Columns */}
          <div className="relative flex items-center justify-center mb-[16px] min-h-[52px] flex-wrap gap-y-3">
            {/* Tabs — Integrated Clearance tab pill */}
            {tabs && tabs.length > 0 && (
              <div role="tablist"
                className="lg:absolute left-0 bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] flex-shrink-0 mr-auto lg:mr-0"
                style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
                {tabs.map(t => {
                  const on = t.key === activeTab;
                  return (
                    <button key={t.key} role="tab" aria-selected={on} onClick={() => onTabChange?.(t.key)}
                      className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors whitespace-nowrap ${
                        on ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
                      }`}
                      style={{ fontFamily: font }}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            )}
            <StatusAsOnBadge
              label={mode.dateLabel ?? 'Submitted Date'}
              fromValue={dateFrom} toValue={dateTo}
              onApply={(f, t) => { setDateFrom(f); setDateTo(t); }}
              disabled={afOpen}
            />
            <div className="lg:absolute right-0 flex items-center gap-[12px] ml-auto lg:ml-0">
              {!mode.hideDrafts && <label className="flex items-center gap-[10px] cursor-pointer select-none">
                <button
                  role="switch" aria-checked={showDrafts}
                  onClick={() => { setShowDrafts(d => !d); setPage(1); setOpenFlyout(null); }}
                  className="relative inline-flex h-[30px] w-[48px] rounded-full transition-colors"
                  style={{ background: showDrafts ? '#d4e3fb' : '#e5e9f2' }}
                >
                  <span className="inline-block size-[24px] rounded-full shadow transition-transform mt-[3px]"
                    style={{ background: showDrafts ? '#1360d2' : '#fff', transform: showDrafts ? 'translateX(21px)' : 'translateX(3px)' }} />
                </button>
                <span className="text-[18px] text-[#697498]" style={{ fontFamily: font }}>Drafts</span>
              </label>}
              <ToolbarDropdown label="Download" options={DOWNLOAD_OPTIONS} onPick={() => {}} align="right" />
              <button
                onClick={() => setShowColModal(true)}
                className="h-[48px] px-[16px] flex items-center gap-[10px] rounded-[4px] border border-[#e2e8f5] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
                style={{ fontFamily: font, fontWeight: 500 }}
              >
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#0e1b3d" strokeWidth="1.5">
                  <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" />
                  <path d="M7.5 3.5v13M12.5 3.5v13" />
                </svg>
                Columns
              </button>
              {mode.select && (
                <button
                  disabled={picked.size === 0}
                  onClick={() => mode.select!.onSubmit(rows.filter(r => picked.has(r.applicationNo)))}
                  className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
                >
                  {mode.select.label}{picked.size > 0 ? ` (${picked.size})` : ''}
                </button>
              )}
            </div>
          </div>

          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
              {paginated.map(row => (
                <ServiceCard key={row.applicationNo} cfg={cfg} row={row} draft={showDrafts}
                  selected={selected.has(row.applicationNo)}
                  onToggle={() => toggleSelect(row.applicationNo)}
                  onAction={a => pick(a, row)}
                  onOpenDraft={() => onOpenDraft(row)} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-center py-16 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>No records found</p>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd}
                onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STICKY_W} />
              <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
                {resizeIndicatorLeft !== null && (
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3,
                    background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
                )}
                <table
                  ref={tableRef}
                  onMouseMove={handleTableMouseMove}
                  onMouseLeave={handleTableMouseLeave}
                  onMouseDown={handleTableMouseDown}
                  style={{
                    minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px',
                    fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined,
                  }}
                  className="w-full"
                >
                  <thead>
                    <tr>
                      {mode.select && (
                        <th style={{ width: 52, minWidth: 52, padding: '18px 0 10px 16px', textAlign: 'left', background: '#a6c2e9', borderRadius: '8px 0 0 0' }}>
                          <input type="checkbox" aria-label="Select all on this page" checked={allOnPage} onChange={togglePage}
                            className="size-[18px] cursor-pointer align-middle" style={{ accentColor: '#1360d2' }} />
                        </th>
                      )}
                      {visibleHeaders.map((col, idx) => (
                        <th
                          key={col.key}
                          data-col-key={col.key}
                          style={{
                            position: 'relative',
                            width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                            padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
                            borderRadius: idx === 0 && !mode.select ? '8px 0 0 0' : undefined,
                            paddingLeft: idx === 0 ? 16 : 8,
                            ...getThStyle(col.key),
                          }}
                          onDragOver={e => onDragOver(col.key, e)}
                          onDragLeave={onDragLeave}
                          onDrop={e => onDrop(col.key, e, visibleCols, setVisibleCols)}
                        >
                          <div
                            draggable
                            onDragStart={e => onDragStart(col.key, e)}
                            onDragEnd={onDragEnd}
                            style={{
                              display: hoveredColKey === col.key ? 'flex' : 'none',
                              position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                              cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                            }}
                          >
                            <DragDots visible />
                          </div>
                          <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                        </th>
                      ))}

                      {/* Sticky: Application Status */}
                      <th style={{
                        position: 'sticky', right: 90, width: 180, minWidth: 180,
                        background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                      }}>
                        {showDrafts ? (
                          <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{statusLabel}</span>
                        ) : (
                          <StatusFilterHeader
                            label={statusLabel}
                            options={cfg.statuses}
                            value={statusFilter}
                            onChange={v => { setStatusFilter(v as string | null); setPage(1); }}
                            colorMap={Object.fromEntries(cfg.statuses.map(x => [x, statusStyle(x).color]))}
                          />
                        )}
                      </th>

                      {/* Sticky: Actions */}
                      <th style={{
                        position: 'sticky', right: 0, width: 90, minWidth: 90,
                        background: '#a6c2e9', padding: '10px 8px', textAlign: 'center',
                        borderRadius: '0 8px 0 0', zIndex: 2,
                      }}>
                        <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.map((row, i) => {
                      const st = statusStyle(row.status);
                      return (
                        <tr key={row.applicationNo}>
                          {mode.select && (
                            <td style={{ background: '#fff', height: 54, padding: '0 0 0 16px', borderBottom: '1px solid #f0f4ff', verticalAlign: 'middle' }}>
                              <input type="checkbox" aria-label={`Select ${row.applicationNo}`} checked={picked.has(row.applicationNo)}
                                onChange={() => togglePicked(row.applicationNo)}
                                className="size-[18px] cursor-pointer align-middle" style={{ accentColor: '#1360d2' }} />
                            </td>
                          )}
                          {visibleHeaders.map((col, ci) => (
                            <td
                              key={col.key}
                              data-col-key={col.key}
                              style={{
                                background: getTdBg(col.key) ?? '#fff',
                                padding: '0 8px', height: 54, verticalAlign: 'middle',
                                borderBottom: '1px solid #f0f4ff',
                                paddingLeft: ci === 0 ? 16 : 8,
                                width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span
                                className="text-[16px] whitespace-nowrap overflow-hidden text-ellipsis block"
                                style={col.key === 'applicationNo' && !showDrafts && !mode.downloadOnly
                                  ? { color: '#1360d2', fontWeight: 500, cursor: 'pointer' }
                                  : { color: '#0e1b3d' }}
                                onClick={col.key === 'applicationNo' && !showDrafts && !mode.downloadOnly ? () => onAction(mode.viewOnly ? 'View' : 'View Request', row) : undefined}
                              >
                                {cellNode(row, col.key)}
                              </span>
                            </td>
                          ))}

                          {/* Sticky: Application Status */}
                          <td style={{
                            background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff',
                            position: 'sticky', right: 90, width: 180, minWidth: 180,
                            boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                            zIndex: openFlyout === i ? 49 : 1,
                          }}>
                            <span className="inline-flex items-center px-[16px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                              style={{ background: st.bg, color: st.color, fontFamily: font }}>
                              {row.status}
                            </span>
                          </td>

                          {/* Sticky: Actions */}
                          <td style={{
                            background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                            borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                            position: 'sticky', right: 0, width: 90, minWidth: 90,
                            zIndex: openFlyout === i ? 50 : 1,
                          }}>
                            <div className="relative inline-block">
                              {mode.downloadOnly ? (
                                <IconBtn kind="download" label={`Download ${row.applicationNo}`} onClick={() => onAction('Download', row)} />
                              ) : mode.viewOnly ? (
                                <IconBtn kind="view" label={`View ${row.applicationNo}`} onClick={() => onAction('View', row)} />
                              ) : showDrafts ? (
                                <Chevron onClick={() => onOpenDraft(row)} />
                              ) : (
                                <>
                                  <Kebab onClick={() => setOpenFlyout(openFlyout === i ? null : i)} />
                                  {openFlyout === i && (
                                    <ActionFlyout actions={cfg.actions} onPick={a => pick(a, row)} onClose={() => setOpenFlyout(null)} />
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={visibleHeaders.length + 2 + (mode.select ? 1 : 0)}
                          className="text-center py-16 text-[#8f94ae] text-[16px] bg-white" style={{ fontFamily: font }}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={n => { setPageSize(n); setPage(1); }}
          />
        </div>
      </div>
    </>
  );
}
