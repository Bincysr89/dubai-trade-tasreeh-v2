import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import Pagination from '../Pagination';
import ManageColumnsModal, { ColDef } from '../ManageColumnsModal';
import { ColumnFilter } from '../ColumnFilter';
import StatusFilterHeader from '../StatusFilterHeader';
import { StatusAsOnBadge } from '../DatePicker';
import { useTableBehaviors, DragDots, ScrollArrows } from '../../hooks/useTableBehaviors';
import { font, GSelect, GDate, GInput, NeedHelp, ResetBtn } from '../gatepass/GateFields';
import { AGENT_BANNER, fromIso } from '../gatepass/gatePassData';
import {
  DELEGATION_ROWS, DRAFT_ROWS, DELEGATION_STATUSES, STATUS_STYLE, STATUS_COLORS, SEARCH_FIELDS, ROW_ACTIONS,
  DOWNLOAD_OPTIONS, PORTS, GATES, VISITOR_CATEGORIES, DELEGATION_TITLE,
  type DelegationRow, type DelegationStatus, type DelegationAction,
} from './delegationData';

type Props = {
  rows?: DelegationRow[];
  drafts?: DelegationRow[];
  /** Open with the Drafts toggle on ("View All Drafts"). */
  initialShowDrafts?: boolean;
  onClose: () => void;
  onCreate: () => void;
  onAction: (action: DelegationAction, row: DelegationRow) => void;
  onOpenDraft: (row: DelegationRow) => void;
};

/* ── Columns (Figma 1:8181) ── */
const COL_DEFS: (ColDef & { w: number })[] = [
  { key: 'applicationNo', label: 'Application No.', w: 420 },
  { key: 'createdOn',     label: 'Created on',      w: 420 },
  { key: 'visitDate',     label: 'Visit Date',      w: 170 },
  { key: 'port',          label: 'Port',            w: 170 },
  { key: 'gate',          label: 'Gate Number',     w: 150 },
  { key: 'visitors',      label: 'Visitors',        w: 120 },
  { key: 'email',         label: 'Contact Email',   w: 210 },
];

const DEFAULT_VISIBLE = ['applicationNo', 'createdOn'];

/* Values shown in the table for each column key */
function cellValue(r: DelegationRow, key: string): string {
  switch (key) {
    case 'applicationNo': return r.applicationNo;
    case 'createdOn':     return r.createdOn;
    case 'visitDate':     return fromIso(r.form.visitDate) || '-';
    case 'port':          return r.form.port || '-';
    case 'gate':          return r.form.gate || '-';
    case 'visitors':      return String(r.form.visitors.length);
    case 'email':         return r.form.email || '-';
    default:              return '-';
  }
}

/* Sticky block = Application Status (180) + Actions (90) */
const STICKY_W = 270;

/* ── Advanced filters (Figma 109:6497) ── */
type AFDef =
  | { key: string; label: string; type: 'dropdown'; options: string[]; searchable?: boolean }
  | { key: string; label: string; type: 'date' | 'text' };

const AF_FIELDS: AFDef[] = [
  { key: 'applicationNo', label: 'Application Number', type: 'text' },
  { key: 'status',        label: 'Status',             type: 'dropdown', options: DELEGATION_STATUSES },
  { key: 'createdFrom',   label: 'Created From',       type: 'date' },
  { key: 'createdTo',     label: 'Created To',         type: 'date' },
  { key: 'visitDate',     label: 'Visit Date',         type: 'date' },
  { key: 'port',          label: 'Port',               type: 'dropdown', options: PORTS },
  { key: 'gate',          label: 'Gate Number',        type: 'dropdown', options: GATES },
  { key: 'category',      label: 'Visitor Category',   type: 'dropdown', options: VISITOR_CATEGORIES },
]

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
              {STATUS_COLORS[o] && <span className="size-[8px] rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[o] }} />}
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
const ACTION_ICONS: Record<DelegationAction, React.ReactNode> = {
  'View Request': <Eye />, 'Cancel Request': <XCircle />,
};

function ActionFlyout({ onPick, onClose }: { onPick: (a: DelegationAction) => void; onClose: () => void }) {
  const ref = useOutside(true, onClose);
  return (
    <div ref={ref} className="absolute z-[120] right-0 bg-white rounded-[10px] py-[8px] overflow-hidden"
      style={{ top: 36, width: 220, boxShadow: '0px 4px 20px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
      {ROW_ACTIONS.map(label => (
        <button key={label} onClick={() => onPick(label)}
          className="w-full px-[16px] py-[11px] text-left text-[16px] text-[#111838] hover:bg-[#e2ebf9] transition-colors flex items-center gap-[12px]"
          style={{ fontFamily: font }}>
          {ACTION_ICONS[label]}
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
function DelegationCard({ row, draft, selected, onToggle, onAction, onOpenDraft }: {
  row: DelegationRow; draft: boolean; selected: boolean; onToggle: () => void;
  onAction: (a: DelegationAction) => void; onOpenDraft: () => void;
}) {
  const [open, setOpen] = useState(false);
  const st = STATUS_STYLE[row.status];
  const Cell = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-[#f6f8fc] rounded-[4px] px-[10px] py-[9px] min-w-0 flex-1 text-center truncate" title={`${label}: ${value}`}>
      <span className="text-[14px] text-[#5a6478]" style={{ fontFamily: font }}>{label}: </span>
      <span className="text-[14px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>{value}</span>
    </div>
  );
  return (
    <div className="bg-white rounded-[10px] p-[16px] flex flex-col gap-[10px]" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.16)' }}>
      <div className="flex items-start gap-[12px]">
        <span className="size-[54px] rounded-full bg-white flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 2px 10px rgba(143,155,186,0.30)' }}>
          {/* delegation / group */}
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#1360d2" strokeWidth="1.7">
            <circle cx="9" cy="8" r="3.2" /><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" strokeLinecap="round" />
            <circle cx="17" cy="9" r="2.5" /><path d="M16 13.6c2.9.2 5 2.2 5 5" strokeLinecap="round" />
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
          {open && <ActionFlyout onPick={a => { setOpen(false); onAction(a); }} onClose={() => setOpen(false)} />}
        </div>
      </div>

      <div className="flex gap-[10px]">
        <Cell label="Port" value={row.form.port || '-'} />
        <Cell label="Gate" value={row.form.gate || '-'} />
      </div>
      <div className="flex gap-[10px]">
        <Cell label="Visitors" value={String(row.form.visitors.length)} />
        <Cell label="Vehicles" value={String(row.form.vehicles.filter(v => v.plate).length)} />
      </div>
      <div className="bg-[#f6f8fc] rounded-[4px] px-[16px] py-[12px] flex items-center justify-between gap-[10px]">
        <div className="flex flex-col gap-[4px] min-w-0">
          <span className="text-[13px] text-[#5a6478]" style={{ fontFamily: font }}>Created on</span>
          <span className="text-[15px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>{row.createdOn}</span>
        </div>
        <div className="flex flex-col gap-[4px] min-w-0 text-right">
          <span className="text-[13px] text-[#5a6478]" style={{ fontFamily: font }}>Visit Date / Time</span>
          <span className="text-[15px] text-[#0e1b3d] font-medium" style={{ fontFamily: font }}>
            {fromIso(row.form.visitDate) || '-'}{row.form.visitHrs ? ` · ${row.form.visitHrs}:${row.form.visitMins || '00'}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DelegationListingPage({ rows = DELEGATION_ROWS, drafts = DRAFT_ROWS, initialShowDrafts = false, onClose, onCreate, onAction, onOpenDraft }: Props) {
  const [view, setView] = useState<'list' | 'card'>('list');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchType, setSearchType] = useState(SEARCH_FIELDS[0]);
  const [searchValue, setSearchValue] = useState('');
  const [searchDropOpen, setSearchDropOpen] = useState(false);
  const [afOpen, setAfOpen] = useState(false);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [showColModal, setShowColModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DelegationStatus | null>(null);
  const [showDrafts, setShowDrafts] = useState(initialShowDrafts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('2022-12-28');
  const [dateTo, setDateTo] = useState('2023-01-10');
  const [af, setAf] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Record<string, string>>({});
  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE);

  const searchRef = useOutside(searchDropOpen, () => setSearchDropOpen(false));

  const visibleHeaders = visibleCols.map(k => COL_DEFS.find(c => c.key === k)!).filter(Boolean);

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
  const filtered = source.filter(r => {
    if (!showDrafts && statusFilter && r.status !== statusFilter) return false;
    if (applied.status && r.status !== applied.status) return false;
    if (applied.port && r.form.port !== applied.port) return false;
    if (applied.gate && r.form.gate !== applied.gate) return false;
    if (applied.visitDate && r.form.visitDate !== applied.visitDate) return false;
    if (applied.category && !r.form.visitors.some(v => v.category === applied.category)) return false;
    if (!has(r.applicationNo, applied.applicationNo)) return false;
    if (!searchValue) return true;
    const val = searchType === 'Port' ? r.form.port : searchType === 'Contact Email' ? r.form.email : r.applicationNo;
    return has(val, searchValue);
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* The shared hook measures overflow once on mount — re-measure when the table's contents change. */
  useEffect(() => {
    const t = setTimeout(handleScroll, 60);
    return () => clearTimeout(t);
  }, [handleScroll, showDrafts, view, visibleCols, page, pageSize, filtered.length]);
  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + STICKY_W;

  const toggleSelect = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const pick = (a: DelegationAction, row: DelegationRow) => { setOpenFlyout(null); onAction(a, row); };

  return (
    <>
      {showColModal && (
        <ManageColumnsModal
          columns={COL_DEFS}
          visible={visibleCols}
          lockedColumns={[{ key: '_status', label: 'Application Status' }, { key: '_action', label: 'Actions' }]}
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
              <span className="text-[#111838] font-medium">{DELEGATION_TITLE}</span>
            </div>
            <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
              {AGENT_BANNER}
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-[#0e1b3d] mb-[22px]" style={{ fontFamily: font }}>
            {DELEGATION_TITLE}
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
                  {SEARCH_FIELDS.map(f => (
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

            <ToolbarDropdown label="Status" options={DELEGATION_STATUSES} value={statusFilter} allLabel="— All —"
              onPick={v => { setStatusFilter(v as DelegationStatus | null); setPage(1); }} />

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

            <button
              onClick={onCreate}
              className="h-[48px] w-[171px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Create
            </button>
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
                {AF_FIELDS.map(f => (
                  f.type === 'dropdown'
                    ? <GSelect key={f.key} label={f.label} value={af[f.key] ?? ''} options={f.options}
                        searchable={f.searchable} onChange={v => setAf(p => ({ ...p, [f.key]: v }))} />
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
            <StatusAsOnBadge
              label="Submitted Date"
              fromValue={dateFrom} toValue={dateTo}
              onApply={(f, t) => { setDateFrom(f); setDateTo(t); }}
              disabled={afOpen}
            />
            <div className="lg:absolute right-0 flex items-center gap-[12px] ml-auto lg:ml-0">
              <label className="flex items-center gap-[10px] cursor-pointer select-none">
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
              </label>
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
            </div>
          </div>

          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
              {paginated.map(row => (
                <DelegationCard key={row.applicationNo} row={row} draft={showDrafts}
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
                      {visibleHeaders.map((col, idx) => (
                        <th
                          key={col.key}
                          data-col-key={col.key}
                          style={{
                            position: 'relative',
                            width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                            padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
                            borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
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
                          <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">Application Status</span>
                        ) : (
                          <StatusFilterHeader
                            label="Application Status"
                            options={DELEGATION_STATUSES}
                            value={statusFilter}
                            onChange={v => { setStatusFilter(v as DelegationStatus | null); setPage(1); }}
                            colorMap={STATUS_COLORS}
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
                      const st = STATUS_STYLE[row.status];
                      return (
                        <tr key={row.applicationNo}>
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
                                style={col.key === 'applicationNo' && !showDrafts
                                  ? { color: '#1360d2', fontWeight: 500, cursor: 'pointer' }
                                  : { color: '#0e1b3d' }}
                                onClick={col.key === 'applicationNo' && !showDrafts ? () => onAction('View Request', row) : undefined}
                              >
                                {cellValue(row, col.key)}
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
                              {showDrafts ? (
                                <Chevron onClick={() => onOpenDraft(row)} />
                              ) : (
                                <>
                                  <Kebab onClick={() => setOpenFlyout(openFlyout === i ? null : i)} />
                                  {openFlyout === i && (
                                    <ActionFlyout onPick={a => pick(a, row)} onClose={() => setOpenFlyout(null)} />
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
                        <td colSpan={visibleHeaders.length + 2}
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
