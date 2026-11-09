import React, { useRef, useEffect, useState } from 'react';
import CargoTransferViewPage from './CargoTransferViewPage';
import Pagination from './Pagination';
import { DateInputOutlined, StatusAsOnBadge } from './DatePicker';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

// ── Types ─────────────────────────────────────────────────────────────────────
type Row = {
  ctNo: string;
  submittedDate: string;
  mawbMbol: string;
  clientRef: string;
  transferorCode: string;
  transfereeCode: string;
  releaseDate: string;
  releaseStatus: string;
  receiptDate: string;
  receiptStatus: string;
  receivedDate: string;
  receivedStatus: string;
};

type Tab = 'release' | 'receipt';
type Props = { onBack: () => void };

// ── Data ──────────────────────────────────────────────────────────────────────
const INITIAL_ROWS: Row[] = [
  { ctNo: '6020000194926', submittedDate: '03-06-2026', mawbMbol: 'VIKRAM0306202601', clientRef: 'CT1 VIK 2026 01', transferorCode: 'AE-1000143-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '03-06-2026', receivedStatus: 'Received' },
  { ctNo: '6020000194927', submittedDate: '03-06-2026', mawbMbol: 'VIKRAM0306202602', clientRef: 'CT2 VIK 2026 01', transferorCode: 'AE-1000144-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '03-06-2026', releaseStatus: 'Released', receiptDate: '03-06-2026', receiptStatus: 'Receipted', receivedDate: '', receivedStatus: 'Not Received' },
  { ctNo: '6020000194928', submittedDate: '02-06-2026', mawbMbol: 'VIKRAM0306202603', clientRef: 'CT3 VIK 2026 01', transferorCode: 'AE-1000145-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '02-06-2026', receivedStatus: 'Received' },
  { ctNo: '6020000194929', submittedDate: '01-06-2026', mawbMbol: 'VIKRAM0306202604', clientRef: 'CT4 VIK 2026 02', transferorCode: 'AE-1000146-Al Cargo', transfereeCode: 'AE-1019057-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '', receivedStatus: 'Not Received' },
  { ctNo: '6020000194930', submittedDate: '01-06-2026', mawbMbol: 'VIKRAM0306202605', clientRef: 'CT5 VIK 2026 01', transferorCode: 'AE-1000147-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '01-06-2026', receivedStatus: 'Received' },
  { ctNo: '6020000194931', submittedDate: '31-05-2026', mawbMbol: 'VIKRAM3105202601', clientRef: 'CT6 VIK 2026 01', transferorCode: 'AE-1000148-Al Cargo', transfereeCode: 'AE-1019057-Dubai Trade', releaseDate: '31-05-2026', releaseStatus: 'Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '', receivedStatus: 'Not Received' },
  { ctNo: '6020000194932', submittedDate: '30-05-2026', mawbMbol: 'VIKRAM3005202601', clientRef: 'CT7 VIK 2026 02', transferorCode: 'AE-1000149-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '30-05-2026', receiptStatus: 'Receipted', receivedDate: '30-05-2026', receivedStatus: 'Received' },
  { ctNo: '6020000194933', submittedDate: '29-05-2026', mawbMbol: 'VIKRAM2905202601', clientRef: 'CT8 VIK 2026 01', transferorCode: 'AE-1000150-Al Cargo', transfereeCode: 'AE-1019057-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '', receivedStatus: 'Not Received' },
  { ctNo: '6020000194934', submittedDate: '28-05-2026', mawbMbol: 'VIKRAM2805202601', clientRef: 'CT9 VIK 2026 01', transferorCode: 'AE-1000151-Al Cargo', transfereeCode: 'AE-1019056-Dubai Trade', releaseDate: '28-05-2026', releaseStatus: 'Released', receiptDate: '28-05-2026', receiptStatus: 'Receipted', receivedDate: '28-05-2026', receivedStatus: 'Received' },
  { ctNo: '6020000194935', submittedDate: '27-05-2026', mawbMbol: 'VIKRAM2705202601', clientRef: 'CT10 VIK 2026 01', transferorCode: 'AE-1000152-Al Cargo', transfereeCode: 'AE-1019057-Dubai Trade', releaseDate: '', releaseStatus: 'Not Released', receiptDate: '', receiptStatus: 'Not Receipted', receivedDate: '27-05-2026', receivedStatus: 'Received' },
];

const SEARCH_FIELDS  = ['Cargo Transfer No', 'Client Dec. Ref No', 'MAWB/MBOL'];
const DATE_TYPE_OPTS = ['Clearance Date', 'Released Date', 'Received Date'];
const RELEASE_STATUS_OPTS = ['Released', 'Not Released'];
const RECEIPT_STATUS_OPTS = ['Receipted', 'Not Receipted'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusStyle(val: string) {
  if (val === 'Released' || val === 'Received' || val === 'Receipted')
    return { bg: 'rgba(26,172,114,0.12)', color: '#1aac72' };
  if (val === 'Not Released' || val === 'Not Received' || val === 'Not Receipted')
    return { bg: 'rgba(19,96,210,0.10)', color: '#1360d2' };
  return { bg: 'rgba(255,169,26,0.16)', color: '#b45309' };
}

function flLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: focused ? '#1360d2' : '#0e1b3d',
    background: active ? '#fff' : 'transparent', padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}

// ── AF Text input ─────────────────────────────────────────────────────────────
function AFInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }}
      />
      <span style={flLabel(active, focused)}>{label}</span>
    </div>
  );
}

// ── AF Simple dropdown ────────────────────────────────────────────────────────
function AFDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = open || !!value;
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d] bg-white focus:outline-none"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}>
        <span className="flex-1 text-left truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={flLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[200] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px]"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full px-[14px] py-[9px] text-left text-[16px] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font, color: opt === value ? '#1360d2' : '#0e1b3d', fontWeight: opt === value ? 500 : 400 }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AF Multi-select ───────────────────────────────────────────────────────────
function AFMultiSelect({ label, selected, options, onChange }: {
  label: string; selected: string[]; options: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = open || selected.length > 0;
  const displayVal = selected.length === 0 ? '' : selected.length === 1 ? selected[0] : `${selected.length} selected`;
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d] bg-white focus:outline-none"
        style={{ fontFamily: font, paddingTop: active ? 18 : 0, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}>
        <span className="flex-1 text-left truncate">{displayVal}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={flLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[200] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px]"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => {
            const checked = selected.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggle(opt)}
                className="w-full px-[14px] py-[9px] flex items-center gap-[10px] text-left hover:bg-[#f5f7ff]">
                <div className="size-[16px] rounded-[3px] border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ borderColor: checked ? '#1360d2' : '#c0c8e0', background: checked ? '#1360d2' : '#fff' }}>
                  {checked && (
                    <svg viewBox="0 0 12 12" width="9" height="9" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[15px]" style={{ fontFamily: font, color: checked ? '#1360d2' : '#0e1b3d' }}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── AF Date input ─────────────────────────────────────────────────────────────
function AFDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <DateInputOutlined
      label={label}
      value={value}
      onChange={onChange}
      font={font}
    />
  );
}

// ── Toolbar Status dropdown ───────────────────────────────────────────────────
function ToolbarStatusDropdown({ values, options, onChange }: {
  values: string[]; options: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = (opt: string) => {
    const s = new Set(values);
    if (s.has(opt)) s.delete(opt); else s.add(opt);
    onChange(Array.from(s));
  };
  const label = values.length === 0 ? 'Status' : values.length === 1 ? values[0] : `${values.length} selected`;
  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff] transition-colors">
        <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>
          {label}
        </span>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="2.5"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[6px]"
          style={{ minWidth: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => {
            const checked = values.includes(opt);
            return (
              <button key={opt} onClick={() => toggle(opt)}
                className="flex items-center gap-[10px] w-full text-left px-[14px] py-[9px] hover:bg-[#e2ebf9] transition-colors">
                {/* Checkbox */}
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center"
                  style={{ borderColor: checked ? '#1360d2' : '#b0bcda', background: checked ? '#1360d2' : '#fff' }}>
                  {checked && (
                    <svg viewBox="0 0 12 10" width="12" height="10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[15px]"
                  style={{ fontFamily: font, color: checked ? '#1360d2' : '#0e1b3d', fontWeight: checked ? 500 : 400 }}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Date cell — enabled only when row is selected; locked once confirmed ──────
function DateCell({ value, onChange, onApplyAll, locked, disabled }: {
  value: string; locked: boolean; disabled?: boolean;
  onChange: (v: string) => void; onApplyAll: (v: string) => void;
}) {
  const isoVal = value ? value.split('-').reverse().join('-') : '';

  // Confirmed row — show as plain read-only text
  if (locked) {
    return <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{value || '—'}</span>;
  }

  // Row not selected — show grayed-out disabled input
  if (disabled) {
    return (
      <div style={{ minWidth: 150 }}>
        <DateInputOutlined
          label=""
          value=""
          onChange={() => {}}
          font={font}
          style={{ opacity: 0.5, pointerEvents: 'none' }}
        />
      </div>
    );
  }

  // Row selected — fully editable
  return (
    <div style={{ minWidth: 150 }}>
      <DateInputOutlined
        label=""
        value={isoVal}
        onChange={iso => {
          const display = iso ? iso.split('-').reverse().join('-') : '';
          onChange(display);
        }}
        font={font}
      />
    </div>
  );
}

// ── Confirm / Success popups ──────────────────────────────────────────────────
function ConfirmPopup({ type, onConfirm, onClose }: { type: Tab; onConfirm: () => void; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  const title = type === 'receipt' ? 'Confirm Receipt' : 'Confirm Release';
  const text  = type === 'receipt'
    ? 'I / we hereby acknowledge the receipt of the cargo as described in the selected declarations.'
    : 'I / we hereby acknowledge the release of the cargo as described in the selected declarations.';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.50)' }} onClick={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col"
        style={{ width: 560, maxWidth: '92vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.22)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-[28px] py-[18px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] font-medium text-white" style={{ fontFamily: font }}>{title}</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 3l14 14M17 3L3 17" />
            </svg>
          </button>
        </div>
        <div className="px-[40px] py-[40px]">
          <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, lineHeight: 1.8 }}>{text}</p>
        </div>
        <div className="flex items-center justify-center gap-[12px] px-[28px] pb-[28px]">
          <button onClick={onClose}
            data-secondary-btn className="h-[44px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] bg-white"
            style={{ fontFamily: font, fontWeight: 500 }}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="h-[44px] px-[28px] rounded-[4px] text-[16px] text-white hover:opacity-90"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function SuccessPopup({ type, count, onClose }: { type: Tab; count: number; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  const msg = type === 'receipt'
    ? `You have successfully confirmed the receipt of ${count} cargo transfer request${count !== 1 ? 's' : ''}.`
    : `You have successfully confirmed the release of ${count} cargo release request${count !== 1 ? 's' : ''}.`;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-white rounded-[16px] p-[40px] flex flex-col items-center gap-[20px]"
        style={{ width: 440, maxWidth: '90vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}>
        <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: 'rgba(26,172,114,0.12)' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#1aac72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M7 12l3.5 3.5L17 8.5" />
          </svg>
        </div>
        <p className="text-[18px] font-medium text-[#0e1b3d] text-center" style={{ fontFamily: font, lineHeight: 1.6 }}>{msg}</p>
        <button onClick={onClose}
          className="h-[44px] px-[32px] rounded-[4px] text-[16px] text-white hover:opacity-90 mt-[4px]"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Done</button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CargoTransferReceiptReleasePage({ onBack }: Props) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const [tab, setTab]           = useState<Tab>('release');
  const [rows, setRows]         = useState<Row[]>(INITIAL_ROWS);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkDate, setBulkDate] = useState('');
  const [statusFromDate, setStatusFromDate] = useState('2026-06-01');
  const [statusToDate, setStatusToDate]     = useState('2026-06-10');

  const [confirmedRelRows, setConfirmedRelRows] = useState<Set<number>>(new Set());
  const [confirmedRecRows, setConfirmedRecRows] = useState<Set<number>>(new Set());

  const [confirmType, setConfirmType] = useState<Tab | null>(null);
  const [successType, setSuccessType] = useState<Tab | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [viewCtNo, setViewCtNo]         = useState<string | null>(null);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchField, setSearchField]         = useState(SEARCH_FIELDS[0]);
  const [searchFieldOpen, setSearchFieldOpen] = useState(false);
  const [searchValue, setSearchValue]         = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFieldOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ── Toolbar status ──────────────────────────────────────────────────────────
  const [toolbarStatuses, setToolbarStatuses] = useState<string[]>([]);

  // ── Advanced filter ─────────────────────────────────────────────────────────
  const [afOpen, setAfOpen]             = useState(false);
  const [afMawb, setAfMawb]             = useState('');
  const [afCarrierReg, setAfCarrierReg] = useState('');
  const [afStatuses, setAfStatuses]     = useState<string[]>([]);
  const [afDateType, setAfDateType]     = useState('Clearance Date');
  const [afFromDate, setAfFromDate]     = useState('');
  const [afToDate, setAfToDate]         = useState('');

  // Reset selections when tab changes
  const prevTabRef = useRef(tab);
  if (prevTabRef.current !== tab) {
    prevTabRef.current = tab;
    setAfStatuses([]);
    setSelected(new Set());
  }

  const statusOpts = tab === 'release' ? RELEASE_STATUS_OPTS : RECEIPT_STATUS_OPTS;
  const statusLabel = tab === 'release' ? 'Release Status' : 'Receipt Status';

  const resetAF = () => {
    setAfMawb(''); setAfCarrierReg('');
    setAfStatuses([]); setAfDateType('Clearance Date');
    setAfFromDate(''); setAfToDate('');
  };

  // ── Pagination helpers ──────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageStart  = (page - 1) * pageSize;
  const pagedRows  = rows.slice(pageStart, pageStart + pageSize);
  const pagedIdxs  = pagedRows.map((_, i) => pageStart + i);

  // ── Row actions ─────────────────────────────────────────────────────────────
  const toggleRow = (i: number) => setSelected(prev => {
    const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next;
  });
  const allPageSelected = pagedIdxs.length > 0 && pagedIdxs.every(i => selected.has(i));
  const toggleAll = () => {
    if (allPageSelected) {
      setSelected(prev => { const n = new Set(prev); pagedIdxs.forEach(i => n.delete(i)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); pagedIdxs.forEach(i => n.add(i)); return n; });
    }
  };

  const updateDate = (rowIdx: number, field: 'releaseDate' | 'receiptDate', val: string) =>
    setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [field]: val } : r));

  const applyDateToAll = (field: 'releaseDate' | 'receiptDate', val: string) => {
    setRows(prev => prev.map((r, idx) => selected.has(idx) ? { ...r, [field]: val } : r));
  };

  const handleConfirm = (type: Tab) => {
    const count = selected.size;
    if (type === 'release') setConfirmedRelRows(prev => new Set([...prev, ...selected]));
    else                    setConfirmedRecRows(prev => new Set([...prev, ...selected]));
    setSuccessType(type); setSuccessCount(count); setSelected(new Set());
  };

  const canConfirm = selected.size > 0;

  // ── Column config ───────────────────────────────────────────────────────────
  // Scrollable data columns (left)
  const DATA_COLS = [
    { key: 'ctNo',           label: 'Cargo Transfer No.',  w: 170 },
    { key: 'submittedDate',  label: 'Submitted Date',       w: 140 },
    { key: 'mawbMbol',       label: 'MAWB / MBOL',          w: 180 },
    { key: 'clientRef',      label: 'Client Dec. Ref. No.', w: 160 },
    { key: 'transferorCode', label: 'Transferor Code/Name', w: 200 },
    { key: 'transfereeCode', label: 'Transferee Code/Name', w: 200 },
    ...(tab === 'release'
      ? [{ key: 'releaseDate', label: 'Release Date', w: 190 }]
      : [{ key: 'receiptDate', label: 'Receipt Date', w: 190 }]),
    { key: 'receivedDate',   label: tab === 'release' ? 'Receipt Date' : 'Release Date', w: 150 },
  ];

  // Sticky right columns — last 2
  const STICKY_COLS = tab === 'release'
    ? [
        { key: 'releaseStatus',  label: 'Release Status',  w: 155 },
        { key: 'receivedStatus', label: 'Receipt Status',  w: 155 },
      ]
    : [
        { key: 'receiptStatus',  label: 'Receipt Status',  w: 155 },
        { key: 'receivedStatus', label: 'Release Status',  w: 155 },
      ];

  const STICKY_RIGHT_0 = 0;
  const STICKY_RIGHT_1 = STICKY_COLS[1].w; // second-last col right offset = last col width

  const DATE_EDIT_KEY = tab === 'release' ? 'releaseDate' : 'receiptDate';

  if (viewCtNo !== null) {
    return <CargoTransferViewPage transferNumber={viewCtNo} onBack={() => setViewCtNo(null)} />;
  }

  const txt = (v: string) => (
    <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
  );

  return (
    <>
      {confirmType && (
        <ConfirmPopup type={confirmType} onConfirm={() => handleConfirm(confirmType)} onClose={() => setConfirmType(null)} />
      )}
      {successType && (
        <SuccessPopup type={successType} count={successCount} onClose={() => setSuccessType(null)} />
      )}

      <div className="flex flex-col h-full bg-[#f8fafd]">

        {/* ── Breadcrumb ── */}
        <div className="flex-shrink-0 bg-[#f8fafd]">
          <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
            <div className="flex items-center gap-[6px]" style={{ fontFamily: font }}>
              <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline">Home</button>
              <span className="text-[16px] text-[#dc3545]">/</span>
              <span className="text-[16px] text-[#8f94ae]">Integrated Clearance</span>
              <span className="text-[16px] text-[#dc3545]">/</span>
              <span className="text-[16px] text-[#8f94ae]">Cargo Transfer</span>
              <span className="text-[16px] text-[#dc3545]">/</span>
              <span className="text-[16px] text-[#111838] font-medium">Cargo Release/Receipt</span>
            </div>
            <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
            </div>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[100px]">

          {/* Page title */}
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 14, marginTop: 0 }}>
            Cargo Release/Receipt
          </h1>

          {/* ══ ROW 1: Controls — AF + Search + Status | → Confirm button ══ */}
          <div className="flex items-center justify-between mb-[12px] gap-[12px] flex-wrap">
            {/* Left group */}
            <div className="flex items-center gap-[12px] flex-wrap">

              {/* Advanced Filters */}
              <button onClick={() => setAfOpen(o => !o)}
                className={`flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#0e1b3d] hover:bg-[#f0f4ff]'}`}
                style={{ fontFamily: font }}>
                Advanced Filters
                <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Search bar with field selector */}
              <div className="relative flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-visible" ref={searchRef}>
                <button type="button"
                  className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 hover:bg-[#f7faff] transition-colors"
                  onClick={() => setSearchFieldOpen(o => !o)}>
                  <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{searchField}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2.5"
                    className={`transition-transform ${searchFieldOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {searchFieldOpen && (
                  <div className="absolute left-0 top-[52px] bg-white rounded-[8px] py-[4px] z-[200]"
                    style={{ minWidth: 200, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                    {SEARCH_FIELDS.map(f => (
                      <button key={f}
                        className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
                        style={{ fontFamily: font, color: f === searchField ? '#1360d2' : '#0e1b3d', fontWeight: f === searchField ? 500 : 400 }}
                        onClick={() => { setSearchField(f); setSearchValue(''); setSearchFieldOpen(false); }}>
                        {f}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center flex-1 pl-[12px] pr-[5px] gap-[8px]">
                  <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
                    placeholder="Search…"
                    className="w-[180px] text-[16px] text-[#0e1b3d] placeholder-[#697498] bg-transparent focus:outline-none"
                    style={{ fontFamily: font }} />
                  {searchValue && (
                    <button onClick={() => setSearchValue('')}
                      className="flex-shrink-0 size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff]">
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M5 5l10 10M15 5l-10 10" />
                      </svg>
                    </button>
                  )}
                  <span className="flex-shrink-0 inline-flex items-center justify-center rounded-[6px]" style={{ width: 38, height: 38, background: '#1360d2' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#ffffff" /></svg>
                  </span>
                </div>
              </div>

              {/* Toolbar Status dropdown */}
              <ToolbarStatusDropdown
                values={toolbarStatuses}
                options={statusOpts}
                onChange={setToolbarStatuses}
              />
            </div>

            {/* Right: Confirm button */}
            <button
              onClick={() => setConfirmType(tab)}
              className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-opacity"
              style={{
                background: '#1360d2',
                cursor: 'pointer',
                fontFamily: font, fontWeight: 500,
                boxShadow: '0px 0px 8px rgba(28,72,191,0.16)',
              }}>
              {tab === 'release' ? 'Confirm Release' : 'Confirm Receipt'}
            </button>
          </div>

          {/* ══ Advanced Filters panel — opens here, pushing tabs+table down ══ */}
          {afOpen && (
            <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] mb-[12px]"
              style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)', padding: '48px 20px 20px' }}>
              {/* Close — top-right, above all fields */}
              <button onClick={() => setAfOpen(false)}
                className="absolute top-[12px] right-[12px] size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] text-[#697498] hover:text-[#0e1b3d]"
                style={{ zIndex: 10 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>

              {/* Row 1: 4 fields */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <AFInput       label="MAWB / MBOL"         value={afMawb}        onChange={setAfMawb} />
                <AFInput       label="Carrier Reg. Number"  value={afCarrierReg}  onChange={setAfCarrierReg} />
                <AFMultiSelect label={statusLabel}          selected={afStatuses} options={statusOpts}       onChange={setAfStatuses} />
                <AFDropdown    label="Date Type"            value={afDateType}    options={DATE_TYPE_OPTS}   onChange={setAfDateType} />
              </div>

              {/* Row 2: From + To + Search/Reset */}
              <div className="grid grid-cols-4 gap-4">
                <AFDate label="From Date" value={afFromDate} onChange={setAfFromDate} />
                <AFDate label="To Date"   value={afToDate}   onChange={setAfToDate} />
                {/* Search + Reset in the 3rd cell, aligned to bottom */}
                <div className="flex items-end gap-[10px]">
                  <button className="h-[44px] px-[22px] rounded-[4px] text-[15px] text-white hover:opacity-90 whitespace-nowrap"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                    Search
                  </button>
                  <button onClick={resetAF}
                    data-secondary-btn className="h-[44px] px-[22px] rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white whitespace-nowrap"
                    style={{ fontFamily: font, fontWeight: 500 }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ ROW 2: Tabs (left) + Status As On (center) + Bulk apply (right) ══ */}
          <div className="flex items-center mb-[30px] gap-[12px] flex-wrap">

            {/* Tabs — declaration-style blue pill active */}
            <div className="bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] flex-shrink-0"
              style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
              {(['release', 'receipt'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setBulkDate(''); }}
                  className={`h-[40px] px-[20px] rounded-[4px] text-[16px] font-medium transition-colors ${
                    tab === t
                      ? 'bg-[#1360d2] text-white'
                      : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
                  }`}
                  style={{ fontFamily: font }}>
                  {t === 'release' ? 'Cargo Release' : 'Cargo Receipt'}
                </button>
              ))}
            </div>

            {/* Status As On — centered */}
            <div className="flex justify-center basis-full lg:basis-auto lg:flex-1">
              <StatusAsOnBadge fromValue={statusFromDate} toValue={statusToDate}
                onApply={(from, to) => { setStatusFromDate(from); setStatusToDate(to); }} />
            </div>

            {/* Bulk apply date — right corner */}
            <div className="bg-white flex items-center gap-[10px] px-[14px] rounded-[6px] flex-shrink-0"
              style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)', border: '1px solid #e5efff' }}>
              <DateInputOutlined
                label={tab === 'release' ? 'Release Date' : 'Receipt Date'}
                value={bulkDate}
                onChange={setBulkDate}
                font={font}
                style={{ minWidth: 180 }}
              />
              <button
                disabled={selected.size === 0}
                onClick={() => {
                  if (!bulkDate || selected.size === 0) return;
                  const display = bulkDate.split('-').reverse().join('-');
                  applyDateToAll(tab === 'release' ? 'releaseDate' : 'receiptDate', display);
                  setBulkDate('');
                }}
                className="text-[16px] font-medium whitespace-nowrap transition-opacity underline"
                style={{
                  fontFamily: font,
                  color: selected.size > 0 ? '#1360d2' : '#a7c3eb',
                  cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                  background: 'none',
                }}>
                Apply to all selected rows
              </button>
            </div>
          </div>

          {/* ══ Availability bar ══ */}
          <div className="flex items-center gap-[20px] mb-[10px] flex-wrap">
            <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>
              <strong>{rows.length}</strong> <span style={{ color: '#697498' }}>records available</span>
            </span>
            <span style={{ color: '#c0c8e0' }}>•</span>
            {/* Select current page */}
            <label className="flex items-center gap-[8px] cursor-pointer">
              <span className="relative flex items-center justify-center size-[20px] flex-shrink-0">
                <input type="radio" name="selectMode" className="sr-only"
                  checked={allPageSelected && selected.size === pagedIdxs.length}
                  onChange={() => { setSelected(new Set(pagedIdxs)); }} />
                <span className="size-[20px] rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: allPageSelected && selected.size === pagedIdxs.length ? '#1360d2' : '#c0c8e0' }}>
                  {allPageSelected && selected.size === pagedIdxs.length && (
                    <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />
                  )}
                </span>
              </span>
              <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>
                Select {pagedRows.length} per page
              </span>
            </label>
            {/* Select all */}
            <label className="flex items-center gap-[8px] cursor-pointer">
              <span className="relative flex items-center justify-center size-[20px] flex-shrink-0">
                <input type="radio" name="selectMode" className="sr-only"
                  checked={selected.size === rows.length}
                  onChange={() => setSelected(new Set(rows.map((_, i) => i)))} />
                <span className="size-[20px] rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: selected.size === rows.length ? '#1360d2' : '#c0c8e0' }}>
                  {selected.size === rows.length && (
                    <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />
                  )}
                </span>
              </span>
              <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>
                Select all {rows.length} records
              </span>
            </label>
          </div>

          {/* ══ Table — data cols scrollable, last 2 status cols sticky right ══ */}
          <div style={{ position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STICKY_COLS[0].w + STICKY_COLS[1].w} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
            <table style={{
              width: 'max-content', minWidth: '100%',
              borderCollapse: 'separate', borderSpacing: '0 0',
              fontFamily: font,
            }}>
              <thead>
                <tr>
                  {/* Checkbox */}
                  <th style={{ width: 48, background: '#a6c2e9', padding: '10px 8px 10px 16px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>
                    <div onClick={toggleAll}
                      className="size-[18px] rounded-[4px] border-2 flex items-center justify-center cursor-pointer transition-colors"
                      style={{ borderColor: allPageSelected ? '#1360d2' : '#6b84ab', background: allPageSelected ? '#1360d2' : 'transparent' }}>
                      {allPageSelected && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </th>

                  {/* Scrollable data columns */}
                  {DATA_COLS.map(col => (
                    <th key={col.key} style={{ minWidth: col.w, width: col.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left' }}>
                      <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                    </th>
                  ))}

                  {/* Sticky right: second-last status col */}
                  <th style={{
                    minWidth: STICKY_COLS[0].w, width: STICKY_COLS[0].w,
                    background: '#a6c2e9', padding: '10px 12px', textAlign: 'left',
                    position: 'sticky', right: STICKY_RIGHT_1, zIndex: 2,
                    boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                  }}>
                    <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{STICKY_COLS[0].label}</span>
                  </th>

                  {/* Sticky right: last status col */}
                  <th style={{
                    minWidth: STICKY_COLS[1].w, width: STICKY_COLS[1].w,
                    background: '#a6c2e9', padding: '10px 12px', textAlign: 'left',
                    position: 'sticky', right: STICKY_RIGHT_0, zIndex: 2,
                    borderRadius: '0 8px 0 0',
                  }}>
                    <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{STICKY_COLS[1].label}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row, pageIdx) => {
                  const i      = pageStart + pageIdx;
                  const isSel  = selected.has(i);
                  const cellBg = isSel ? '#eef4ff' : '#fff';
                  const cs: React.CSSProperties = {
                    background: cellBg, padding: '0 12px', height: 60,
                    verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff',
                  };

                  const isRelTab = tab === 'release';
                  const locked   = isRelTab ? confirmedRelRows.has(i) : confirmedRecRows.has(i);

                  const stickyVal0 = isRelTab ? row.releaseStatus  : row.receiptStatus;
                  const stickyVal1 = row.receivedStatus;
                  const s0 = statusStyle(stickyVal0);
                  const s1 = statusStyle(stickyVal1);

                  return (
                    <tr key={i} onClick={() => toggleRow(i)} className="cursor-pointer">
                      <td style={{ ...cs, padding: '0 8px 0 16px' }}>
                        <div className="size-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
                          style={{ borderColor: isSel ? '#1360d2' : '#c0c8e0', background: isSel ? '#1360d2' : '#fff' }}>
                          {isSel && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                      </td>

                      {DATA_COLS.map(col => {
                        const val = (row as Record<string, string>)[col.key] ?? '';

                        if (col.key === 'ctNo') {
                          return (
                            <td key={col.key} style={cs}>
                              <button className="text-[16px] text-[#1360d2] underline hover:opacity-80 whitespace-nowrap"
                                style={{ fontFamily: font }}
                                onClick={e => { e.stopPropagation(); setViewCtNo(row.ctNo); }}>
                                {row.ctNo}
                              </button>
                            </td>
                          );
                        }

                        if (col.key === DATE_EDIT_KEY) {
                          return (
                            <td key={col.key} style={{ ...cs, verticalAlign: 'middle' }}
                              onClick={e => e.stopPropagation()}>
                              <DateCell
                                value={val} locked={locked} disabled={!isSel && !locked}
                                onChange={v => updateDate(i, isRelTab ? 'releaseDate' : 'receiptDate', v)}
                                onApplyAll={v => applyDateToAll(isRelTab ? 'releaseDate' : 'receiptDate', v)}
                              />
                            </td>
                          );
                        }

                        return <td key={col.key} style={cs}>{txt(val)}</td>;
                      })}

                      {/* Sticky: second-last status */}
                      <td style={{
                        ...cs, position: 'sticky', right: STICKY_RIGHT_1,
                        width: STICKY_COLS[0].w, minWidth: STICKY_COLS[0].w,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                      }}>
                        <span className="text-[15px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap"
                          style={{ background: s0.bg, color: s0.color, fontFamily: font }}>
                          {stickyVal0}
                        </span>
                      </td>

                      {/* Sticky: last status */}
                      <td style={{
                        ...cs, position: 'sticky', right: STICKY_RIGHT_0,
                        width: STICKY_COLS[1].w, minWidth: STICKY_COLS[1].w, zIndex: 1,
                      }}>
                        <span className="text-[15px] font-medium px-[10px] py-[4px] rounded-[4px] whitespace-nowrap"
                          style={{ background: s1.bg, color: s1.color, fontFamily: font }}>
                          {stickyVal1}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>

          {/* ══ Pagination ══ */}
          <div className="mt-[16px]">
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[5, 8, 10, 25]}
              totalItems={rows.length}
              onPageChange={p => { setPage(p); setSelected(new Set()); }}
              onPageSizeChange={n => { setPageSize(n); setPage(1); setSelected(new Set()); }}
            />
          </div>
        </div>

        {/* ── Sticky bottom bar ── */}
        <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 80 }}>
          <div className="h-full flex items-center px-[40px]">
            <button onClick={onBack}
              data-secondary-btn className="h-[48px] px-[28px] rounded-[4px] text-[16px] border border-[#1360d2] text-[#1360d2] transition-colors"
              style={{ fontFamily: font, fontWeight: 500 }}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
