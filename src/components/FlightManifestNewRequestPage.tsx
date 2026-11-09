import React, { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';
import Pagination from './Pagination';
import { fmtDateTime, DateInput } from './DatePicker';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";
const cloudUploadIcon = 'https://www.figma.com/api/mcp/asset/9e722d4d-9a2d-4d15-bb37-70e5aba612d5';

/* ─── Floating-label helpers ─── */
function FInput({ label, value, onChange, req, placeholder, disabled, trailing, textarea }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean; trailing?: React.ReactNode; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Tag value={value} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: textarea ? 84 : 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: trailing ? '0 44px 0 12px' : (textarea ? '10px 12px' : '0 12px'), fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms', resize: 'none' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : (textarea ? 14 : '50%'), transform: floated ? 'none' : (textarea ? 'none' : 'translateY(-50%)'),
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {trailing && <div style={{ position: 'absolute', right: 8, top: textarea ? 14 : '50%', transform: textarea ? 'none' : 'translateY(-50%)' }}>{trailing}</div>}
    </div>
  );
}

function FSelect({ label, value, onChange, options, req, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: disabled ? 'default' : 'pointer', background: disabled ? '#f0f3fa' : '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        {!disabled && (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: open ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && !disabled && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="5.5" /><path d="M14 14l4 4" /></svg>
);

/* ─── Modal shell (kept only for the full Flight Search popup) ─── */
function ModalShell({ title, subtitle, width = 760, onClose, children, footer }: {
  title: string; subtitle?: string; width?: number; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: width, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div>
            <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0 }}>{title}</p>
            {subtitle && <p className="text-[13px] text-[#a7c3eb]" style={{ margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {children}
        </div>
        {footer && <div style={{ flexShrink: 0, borderTop: '1px solid #eef1f6', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Flight data + smart-search combo ─────────────────────────── */
type FlightHit = { flightNo: string; arrDep: string; scheduleDate: string };
// scheduleDate uses the "YYYY-MM-DD HH:mm" format DateInput/fmtDateTime expect.
const FLIGHT_HITS: FlightHit[] = [
  { flightNo: 'EK1234', arrDep: 'Arrival',   scheduleDate: '2025-08-01 08:00' },
  { flightNo: 'EK0055', arrDep: 'Departure', scheduleDate: '2025-08-01 11:40' },
  { flightNo: 'QR0815', arrDep: 'Arrival',   scheduleDate: '2025-08-02 14:10' },
  { flightNo: 'EY0171', arrDep: 'Arrival',   scheduleDate: '2025-08-02 19:25' },
];

function FlightSearchPopup({ onSelect, onClose }: { onSelect: (f: FlightHit) => void; onClose: () => void }) {
  const [flightNo, setFlightNo] = useState('');
  const [arrDep, setArrDep] = useState('All');
  const [scheduleDateFrom, setScheduleDateFrom] = useState('');
  const [scheduleDateTo, setScheduleDateTo] = useState('');
  const results = FLIGHT_HITS.filter(f =>
    (!flightNo.trim() || f.flightNo.toLowerCase().includes(flightNo.trim().toLowerCase())) &&
    (arrDep === 'All' || f.arrDep === arrDep) &&
    (!scheduleDateFrom || f.scheduleDate.slice(0, 10) >= scheduleDateFrom) &&
    (!scheduleDateTo || f.scheduleDate.slice(0, 10) <= scheduleDateTo));
  return (
    <ModalShell title="Search Flight" onClose={onClose}>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Criteria</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <FInput label="Flight Number" value={flightNo} onChange={setFlightNo} />
          <FSelect label="Arrival/Departure" value={arrDep} onChange={setArrDep} options={['All', 'Arrival', 'Departure']} />
          <DateInput label="From Scheduled Date" value={scheduleDateFrom} onChange={setScheduleDateFrom} />
          <DateInput label="To Scheduled Date" value={scheduleDateTo} onChange={setScheduleDateTo} />
        </div>
        <div className="flex gap-[10px] mt-[14px]">
          <button type="button" onClick={() => { setFlightNo(''); setArrDep('All'); setScheduleDateFrom(''); setScheduleDateTo(''); }}
            data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Reset</button>
        </div>
      </div>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Results</p>
        <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {['Flight Number', 'Arrival/Departure', 'Flight Schedule Date', 'Action'].map(h => (
                  <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan={4} className="text-[16px] text-[#697498]" style={{ padding: 20, textAlign: 'center' }}>No flights found.</td></tr>
              ) : results.map(f => (
                <tr key={f.flightNo} style={{ borderTop: '1px solid #eef1f6' }}>
                  <td className="text-[16px] text-[#1360d2]" style={{ padding: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{f.flightNo}</td>
                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap' }}>{f.arrDep}</td>
                  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: 12, whiteSpace: 'nowrap' }}>{fmtDateTime(f.scheduleDate)}</td>
                  <td style={{ padding: 12 }}>
                    <button type="button" onClick={() => onSelect(f)} aria-label={`Select ${f.flightNo}`}
                      className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#e8f0ff] transition-colors" style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}>
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModalShell>
  );
}

function FlightNumberCombo({ value, onSelect, onOpenPopup, locked }: {
  value: string; onSelect: (f: FlightHit) => void; onOpenPopup: () => void; locked: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const matches = FLIGHT_HITS.filter(f => !q || f.flightNo.toLowerCase().includes(q));

  return (
    <div className="relative">
      <input
        value={locked ? value : query}
        onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true); }}
        onFocus={() => !locked && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        readOnly={locked}
        placeholder="e.g. EK1234"
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, padding: '0 52px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: locked ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font }}>
        <span style={{ color: '#dc3545' }}>*</span>Flight Number
      </span>
      <button type="button" onClick={onOpenPopup} tabIndex={-1}
        className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
        <SearchIcon />
      </button>
      {!locked && open && matches.length > 0 && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {matches.map(f => (
            <button key={f.flightNo} type="button" onMouseDown={() => { onSelect(f); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}>
              <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{f.flightNo}</span>
              <span style={{ color: '#697498' }}> — {f.arrDep} — {fmtDateTime(f.scheduleDate)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Airport smart-search combo — single field, code + name shown together ─── */
type AirportHit = { code: string; name: string };
const AIRPORT_NAMES: Record<string, string> = {
  DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport', LHR: 'London Heathrow Airport',
  JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport', MAA: 'Chennai (ex Madras)',
};

function AirportCombo({ label, code, name, onSelect, req, disabled }: {
  label: string; code: string; name: string; onSelect: (a: AirportHit) => void; req?: boolean; disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selected = !!code;
  const q = query.trim().toLowerCase();
  const matches = Object.entries(AIRPORT_NAMES).filter(([c, n]) =>
    !q || c.toLowerCase().includes(q) || n.toLowerCase().includes(q));
  const displayValue = selected && !open ? `${code} — ${name}` : query;

  return (
    <div className="relative">
      <input
        value={displayValue}
        onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true); }}
        onFocus={() => { if (!disabled) { setOpen(true); if (selected) setQuery(''); } }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        disabled={disabled}
        placeholder="e.g. MAA"
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, padding: '0 52px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {!disabled && (
        <button type="button" onClick={() => setOpen(o => !o)} tabIndex={-1}
          className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
          <SearchIcon />
        </button>
      )}
      {!disabled && open && matches.length > 0 && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {matches.map(([c, n]) => (
            <button key={c} type="button" onMouseDown={() => { onSelect({ code: c, name: n }); setQuery(''); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}>
              <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{c}</span>
              <span style={{ color: '#697498' }}> — {n}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Types for the unloading-airport + AWB flow ────────────────── */
export type AwbLine = {
  id: string; awbNo: string; goodsDescription: string; weight: string; weightUnit: string;
  shipperName: string; pieces: string; shipmentDescCode: string; consigneeName: string;
  originCode: string; originName: string; destCode: string; destName: string;
};
const BLANK_AWB: Omit<AwbLine, 'id'> = {
  awbNo: '', goodsDescription: '', weight: '', weightUnit: 'KG', shipperName: '', pieces: '',
  shipmentDescCode: 'Total Consignment', consigneeName: '', originCode: '', originName: '', destCode: '', destName: '',
};
export type UnloadingAirportRow = { id: string; airportCode: string; airportName: string; nilCargo: string; lines: AwbLine[] };

/* ─── Add Airport of Unloading — full page (not a modal) ────────── */
function AddUnloadingPage({ existing, initialEditingLineId, onBack, onSave }: {
  existing: UnloadingAirportRow | null; initialEditingLineId?: string; onBack: () => void; onSave: (row: UnloadingAirportRow) => void;
}) {
  const preselected = initialEditingLineId ? existing?.lines.find(l => l.id === initialEditingLineId) ?? null : null;
  const [airportCode, setAirportCode] = useState(existing?.airportCode ?? '');
  const [airportName, setAirportName] = useState(existing?.airportName ?? '');
  const [nilCargo, setNilCargo] = useState(existing?.nilCargo ?? 'No');
  const [lines, setLines] = useState<AwbLine[]>(existing?.lines ?? []);
  const [awb, setAwb] = useState<Omit<AwbLine, 'id'>>(preselected ?? BLANK_AWB);
  const [editingLineId, setEditingLineId] = useState<string | null>(preselected?.id ?? null);
  const [editingOriginalAwbNo, setEditingOriginalAwbNo] = useState<string | null>(preselected?.awbNo ?? null);
  const [viewingLineId, setViewingLineId] = useState<string | null>(null);
  const [confirmAwbChange, setConfirmAwbChange] = useState(false);
  const [linesPage, setLinesPage] = useState(1);
  const LINES_PAGE_SIZE = 5;

  const setF = <K extends keyof typeof BLANK_AWB>(k: K, v: typeof BLANK_AWB[K]) => setAwb(a => ({ ...a, [k]: v }));
  const canAddLine = awb.awbNo.trim() && awb.weight.trim() && awb.pieces.trim();

  /* Adds the current form as a brand-new line item — used both for the normal "+ Add" flow
     and for the "Airway Bill No. changed" confirmation flow (the original line is left as-is). */
  const appendAsNewLine = () => {
    setLines(p => [...p, { ...awb, id: `awb-${p.length}-${Date.now().toString(36)}` }]);
    setEditingLineId(null); setEditingOriginalAwbNo(null); setAwb(BLANK_AWB); setConfirmAwbChange(false);
  };
  const addOrUpdateLine = () => {
    if (!canAddLine) return;
    if (editingLineId) {
      if (awb.awbNo.trim() !== editingOriginalAwbNo) { setConfirmAwbChange(true); return; }
      setLines(p => p.map(l => l.id === editingLineId ? { ...awb, id: editingLineId } : l));
      setEditingLineId(null); setEditingOriginalAwbNo(null);
      setAwb(BLANK_AWB);
    } else {
      setLines(p => [...p, { ...awb, id: `awb-${p.length}-${Date.now().toString(36)}` }]);
      setAwb(BLANK_AWB);
    }
  };
  const viewLine = (l: AwbLine) => { setAwb(l); setViewingLineId(l.id); setEditingLineId(null); setEditingOriginalAwbNo(null); };
  const editLine = (l: AwbLine) => { setAwb(l); setEditingLineId(l.id); setEditingOriginalAwbNo(l.awbNo); setViewingLineId(null); };
  const closeView = () => { setViewingLineId(null); setAwb(BLANK_AWB); };
  const removeLine = (id: string) => {
    setLines(p => p.filter(l => l.id !== id));
    if (editingLineId === id) { setEditingLineId(null); setEditingOriginalAwbNo(null); setAwb(BLANK_AWB); }
    if (viewingLineId === id) { setViewingLineId(null); setAwb(BLANK_AWB); }
  };

  const canSave = airportCode.trim() && (nilCargo === 'Yes' || lines.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Flight Manifest</span>
      </div>
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Add Airport Of Unloading</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <AirportCombo label="Airport of Unloading" req code={airportCode} name={airportName}
            onSelect={a => { setAirportCode(a.code); setAirportName(a.name); }} />
          <label className="flex items-center gap-[8px] cursor-pointer self-end pb-[10px]">
            <span className="size-[17px] rounded-[4px] inline-flex items-center justify-center flex-shrink-0"
              style={{ border: `2px solid ${nilCargo === 'Yes' ? '#1360d2' : '#a7abb2'}`, background: nilCargo === 'Yes' ? '#1360d2' : '#fff' }}>
              {nilCargo === 'Yes' && (
                <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
              )}
            </span>
            <input type="checkbox" className="sr-only" checked={nilCargo === 'Yes'} onChange={e => setNilCargo(e.target.checked ? 'Yes' : 'No')} />
            <span className="text-[16px]" style={{ color: nilCargo === 'Yes' ? '#0e1b3d' : '#455174', fontWeight: nilCargo === 'Yes' ? 500 : 400, fontFamily: font }}>Nil Cargo</span>
          </label>
        </div>

        <div style={nilCargo === 'Yes' ? { opacity: 0.5, pointerEvents: 'none' } : undefined} className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                {viewingLineId ? 'View Airway Bill' : 'Add Airway Bill'}
              </p>
              <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <FInput label="Airway Bill No." value={awb.awbNo} onChange={v => setF('awbNo', v)} req disabled={!!viewingLineId} />
                  <FInput label="Goods Description" value={awb.goodsDescription} onChange={v => setF('goodsDescription', v)} req disabled={!!viewingLineId} />
                  <FInput label="Weight" value={awb.weight} onChange={v => setF('weight', v)} req disabled={!!viewingLineId} />
                  <FSelect label="Weight Unit" value={awb.weightUnit} onChange={v => setF('weightUnit', v)} options={['KG', 'LB']} req disabled={!!viewingLineId} />
                  <FInput label="Weight in KG's" disabled value={
                    awb.weight.trim() === '' ? '' : (awb.weightUnit === 'LB' ? (parseFloat(awb.weight) * 0.453592).toFixed(2) : awb.weight)
                  } onChange={() => {}} />
                  <FInput label="Shipper Name" value={awb.shipperName} onChange={v => setF('shipperName', v)} req disabled={!!viewingLineId} />
                  <FInput label="Number of Pieces" value={awb.pieces} onChange={v => setF('pieces', v)} req disabled={!!viewingLineId} />
                  <FSelect label="Shipment Description Code" value={awb.shipmentDescCode} onChange={v => setF('shipmentDescCode', v)} options={['Total Consignment', 'Part Consignment']} disabled={!!viewingLineId} />
                  <FInput label="Consignee Name" value={awb.consigneeName} onChange={v => setF('consigneeName', v)} req disabled={!!viewingLineId} />
                  <AirportCombo label="Airport/City of Origin" req code={awb.originCode} name={awb.originName} disabled={!!viewingLineId}
                    onSelect={a => setAwb(x => ({ ...x, originCode: a.code, originName: a.name }))} />
                  <AirportCombo label="Airport/City of Destination" req code={awb.destCode} name={awb.destName} disabled={!!viewingLineId}
                    onSelect={a => setAwb(x => ({ ...x, destCode: a.code, destName: a.name }))} />
                </div>
                <div className="flex gap-[10px]">
                  {viewingLineId ? (
                    <button type="button" onClick={closeView}
                      data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Close</button>
                  ) : (
                    <>
                      <button type="button" onClick={() => { setAwb(BLANK_AWB); setEditingLineId(null); setEditingOriginalAwbNo(null); }}
                        data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Reset</button>
                      <button type="button" onClick={addOrUpdateLine} disabled={!canAddLine}
                        className="h-[44px] px-[20px] rounded-[4px] text-[16px] text-white" style={{ background: canAddLine ? '#1360d2' : '#a7c3eb', cursor: canAddLine ? 'pointer' : 'not-allowed', fontWeight: 500, fontFamily: font }}>
                        {editingLineId ? 'Update' : '+ Add'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                List of Airway Bill of Airport of Unloading {airportCode ? `${airportCode}${airportName ? ` (${airportName})` : ''}` : ''}
              </p>
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 820 }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['Airway Bill No.', 'Origin', 'Destination', 'Weight', 'No. of Pcs', 'Shipper', 'Consignee', 'Actions'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]"
                            style={h === 'Actions'
                              ? { fontWeight: 500, whiteSpace: 'nowrap', background: '#e2ebf9', position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }
                              : { fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lines.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No airway bills added yet.</td></tr>
                      ) : lines.slice((linesPage - 1) * LINES_PAGE_SIZE, linesPage * LINES_PAGE_SIZE).map(l => (
                        <tr key={l.id} style={{ borderTop: '1px solid #f0f4ff', background: editingLineId === l.id ? '#f0f6ff' : undefined }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{l.awbNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.originCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.destCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.weight} {l.weightUnit}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.pieces}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.shipperName || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{l.consigneeName || '—'}</td>
                          <td className="px-[16px] py-[10px]" style={{ position: 'sticky', right: 0, background: editingLineId === l.id ? '#f0f6ff' : '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                            <div className="flex items-center gap-[8px]">
                              <button type="button" onClick={() => viewLine(l)} aria-label={`View ${l.awbNo}`} className="text-[#455174] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
                              </button>
                              <button type="button" onClick={() => editLine(l)} aria-label={`Edit ${l.awbNo}`} className="text-[#1360d2] hover:opacity-70">
                                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l4 4-9 9H5v-4z" /></svg>
                              </button>
                              <button type="button" onClick={() => removeLine(l.id)} aria-label={`Remove ${l.awbNo}`} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {lines.length > 0 && (
                  <Pagination page={linesPage} totalPages={Math.max(1, Math.ceil(lines.length / LINES_PAGE_SIZE))}
                    pageSize={LINES_PAGE_SIZE} totalItems={lines.length} onPageChange={setLinesPage} onPageSizeChange={() => {}} />
                )}
              </div>
            </div>
        </div>
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <button onClick={() => onSave({ id: existing?.id ?? `ua-${Date.now().toString(36)}`, airportCode, airportName, nilCargo, lines })}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Save
          </button>
        }
      />

      {confirmAwbChange && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ width: '100%', maxWidth: 440, boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure to edit the Airway Bill Number?</p>
            <p className="text-[15px] text-[#697498]">A new AWB will be added as a new line item to the table.</p>
            <div className="flex justify-end gap-[10px]">
              <button type="button" onClick={() => setConfirmAwbChange(false)}
                data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Cancel</button>
              <button type="button" onClick={appendAsNewLine}
                className="h-[44px] px-[20px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontWeight: 500, fontFamily: font, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Upload manifest file (inline tab within the wizard) ───────── */
type ManifestFile = { id: string; name: string; sizeKb: string };
function formatSizeKb(bytes: number) { return `${Math.max(0.1, bytes / 1024).toFixed(1)}`; }
const MANIFEST_TYPES = ['Inbound Manifest', 'FFM', 'FWB'];

/* ─── Main page ─────────────────────────────────────────────────── */
type Step = 'flightDetails' | 'manifest' | 'addUnloading' | 'success';
type SubTab = 'manual' | 'upload';

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
  viewOnly?: boolean;
  amend?: boolean;
  initialFlightNo?: string;
  initialArrDepType?: string;
  initialScheduleDate?: string;
  initialAirportLoadingCode?: string;
  initialAirportLoadingName?: string;
  initialUnloadingRows?: UnloadingAirportRow[];
};

export default function FlightManifestNewRequestPage({
  onBack, onBackToListing, viewOnly, amend,
  initialFlightNo, initialArrDepType, initialScheduleDate,
  initialAirportLoadingCode, initialAirportLoadingName, initialUnloadingRows,
}: Props) {
  const skipIntro = !!(viewOnly || amend);
  const pageTitle = viewOnly ? 'View Flight Manifest' : amend ? 'Amend Flight Manifest' : 'New Flight Manifest';
  const [step, setStep] = useState<Step>(skipIntro ? 'manifest' : 'flightDetails');
  const [subTab, setSubTab] = useState<SubTab>('manual');

  const [flightNo, setFlightNo] = useState(initialFlightNo ?? '');
  const [arrDepType, setArrDepType] = useState(initialArrDepType ?? '');
  const [scheduleDate, setScheduleDate] = useState(initialScheduleDate ?? '');
  const [flightLocked, setFlightLocked] = useState(skipIntro);
  const [showFlightSearch, setShowFlightSearch] = useState(false);

  const [airportLoadingCode, setAirportLoadingCode] = useState(initialAirportLoadingCode ?? '');
  const [airportLoadingName, setAirportLoadingName] = useState(initialAirportLoadingName ?? '');
  const [unloadingRows, setUnloadingRows] = useState<UnloadingAirportRow[]>(initialUnloadingRows ?? []);
  const [editingUnloadingId, setEditingUnloadingId] = useState<string | null>(null);
  const [editingAwbLineId, setEditingAwbLineId] = useState<string | undefined>(undefined);
  const [selectedUnloadingId, setSelectedUnloadingId] = useState<string | null>(initialUnloadingRows?.[0]?.id ?? null);
  const selectedUnloadingRow = unloadingRows.find(r => r.id === selectedUnloadingId) ?? unloadingRows[0] ?? null;
  const [viewingAwbLine, setViewingAwbLine] = useState<AwbLine | null>(null);
  const [editingAwbPopup, setEditingAwbPopup] = useState<AwbLine | null>(null);
  const [editingAwbPopupRowId, setEditingAwbPopupRowId] = useState<string | null>(null);
  const [awbTablePage, setAwbTablePage] = useState(1);
  const AWB_TABLE_PAGE_SIZE = 5;
  const selectUnloadingAirport = (id: string) => { setSelectedUnloadingId(id); setAwbTablePage(1); };
  const [confirmDeleteUnloadingId, setConfirmDeleteUnloadingId] = useState<string | null>(null);
  const { scrollRef: awbScrollRef, atScrollStart: awbAtScrollStart, atScrollEnd: awbAtScrollEnd, handleScroll: awbHandleScroll, scrollToStart: awbScrollToStart, scrollToEnd: awbScrollToEnd } = useTableBehaviors();
  const removeAwbLine = (rowId: string, lineId: string) =>
    setUnloadingRows(p => p.map(r => r.id === rowId ? { ...r, lines: r.lines.filter(l => l.id !== lineId) } : r));
  const awbWeightKg = (l: AwbLine) => {
    const w = parseFloat(l.weight) || 0;
    return l.weightUnit === 'LB' ? w * 0.453592 : w;
  };

  const [manifestTypeUpload, setManifestTypeUpload] = useState('FFM');
  const [uploadFiles, setUploadFiles] = useState<ManifestFile[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadDragging, setUploadDragging] = useState(false);

  const selectFlight = (f: FlightHit) => { setFlightNo(f.flightNo); setArrDepType(f.arrDep); setScheduleDate(f.scheduleDate); setFlightLocked(true); setShowFlightSearch(false); };

  const step1Valid = flightLocked;
  const canSubmitManual = airportLoadingCode.trim() && unloadingRows.length > 0;
  const canSubmitUpload = manifestTypeUpload && uploadFiles.length > 0;

  const addUploadFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 20 - uploadFiles.length).map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name, sizeKb: formatSizeKb(f.size) }));
    setUploadFiles(p => [...p, ...next]);
  };
  const removeUploadFile = (id: string) => setUploadFiles(p => p.filter(f => f.id !== id));

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Service Catalog</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Submit Cargo Information</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (step === 'addUnloading') {
    const existing = unloadingRows.find(r => r.id === editingUnloadingId) ?? null;
    return (
      <AddUnloadingPage
        existing={existing}
        initialEditingLineId={editingAwbLineId}
        onBack={() => { setStep('manifest'); setEditingUnloadingId(null); setEditingAwbLineId(undefined); }}
        onSave={row => {
          setUnloadingRows(p => existing ? p.map(r => r.id === row.id ? row : r) : [...p, row]);
          setSelectedUnloadingId(row.id);
          setStep('manifest'); setEditingUnloadingId(null); setEditingAwbLineId(undefined);
        }}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{pageTitle}</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[56px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>{amend ? 'Amend Manifest Created Successfully' : 'Flight Manifest Request Submitted Successfully'}</p>
            <div className="rounded-[6px] px-[24px] py-[16px] flex flex-col items-center gap-[6px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Dear Customer Thank You For Using Flight Manifest Request Web Application.</p>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Please Find Below Details For Future Reference</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Flight Number: {flightNo}</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Scheduled Date: {scheduleDate ? fmtDateTime(scheduleDate) : '—'}</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Type: {subTab === 'manual' ? 'Inbound Manifest' : manifestTypeUpload}</p>
            </div>
            <div className="flex gap-[12px]">
              <button className="h-[48px] px-[24px] rounded-[4px] border text-[16px] inline-flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Share <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="15" cy="4" r="2" /><circle cx="5" cy="10" r="2" /><circle cx="15" cy="16" r="2" /><path d="M6.7 9l6.6-3.3M6.7 11l6.6 3.3" /></svg>
              </button>
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{pageTitle}</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <fieldset disabled={viewOnly} style={{ border: 'none', padding: 0, margin: 0, display: 'contents' }}>
        {/* Flight Details — always visible; becomes read-only once a flight is selected */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Flight Details</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FlightNumberCombo value={flightNo} onSelect={selectFlight} onOpenPopup={() => setShowFlightSearch(true)} locked={flightLocked} />
            <FSelect label="Arrival/Departure" value={arrDepType} onChange={() => {}} options={['Arrival', 'Departure']} req disabled />
            <FInput label="Scheduled Date" value={scheduleDate ? fmtDateTime(scheduleDate) : ''} onChange={() => {}} disabled />
            {step === 'flightDetails' && (
              <div className="flex items-end">
                <button onClick={() => setStep('manifest')}
                  className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors flex-shrink-0"
                  style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                  Proceed
                </button>
              </div>
            )}
          </div>
        </div>

        {step === 'flightDetails' && (
          <>
            {/* Help and Guides */}
            <div className="flex items-center gap-[8px]">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0e1b3d" strokeWidth="1.6"><path d="M4 5h7v15H4z" /><path d="M20 5h-7v15h7z" /></svg>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Help and Guides</p>
            </div>
            <div className="bg-white rounded-[8px] p-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex items-center gap-[8px]">
                <span className="text-[16px] px-[16px] py-[8px] rounded-[4px] text-white" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Information</span>
                {['Tutorials', 'FAQ’S', 'Updates', 'Downloads'].map(t => (
                  <span key={t} className="text-[16px] px-[16px] py-[8px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[18px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>About the Service</p>
              <p className="text-[16px] text-[#455174]" style={{ fontFamily: font, lineHeight: 1.5 }}>
                Flight Manifest lets registered airline agents submit inbound cargo manifest details to Dubai Customs
                ahead of arrival, either manually or via a bulk file upload.
              </p>
            </div>
          </>
        )}

        {step === 'manifest' && (
          <>
            {/* Add Manually / Upload Manifest File tabs — same pill pattern as Refund & Claims */}
            {!viewOnly && (
              <div className="flex items-center gap-[8px] bg-white rounded-[6px] p-[4px] w-max" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.16)', border: '1px solid #eef1f6' }}>
                {(['manual', 'upload'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setSubTab(t)}
                    className="text-[15px] px-[18px] py-[9px] rounded-[4px] transition-colors"
                    style={subTab === t
                      ? { background: '#1360d2', color: '#fff', fontWeight: 500, fontFamily: font }
                      : { color: '#5a6282', fontFamily: font }}>
                    {t === 'manual' ? 'Add Manifest' : 'Upload Manifest File'}
                  </button>
                ))}
              </div>
            )}

            {subTab === 'manual' ? (
              <>
                <div className="flex flex-col lg:flex-row gap-[16px]">
                  <div className="flex-1 flex flex-col gap-[16px] min-w-0">
                    <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Details</p>
                    <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px] h-full" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                      <FSelect label="Manifest Type" value="Inbound Manifest" onChange={() => {}} options={MANIFEST_TYPES} req disabled />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-[16px] min-w-0">
                    <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Port Details</p>
                    <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px] h-full" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                      <AirportCombo label="Airport of Loading" req code={airportLoadingCode} name={airportLoadingName}
                        onSelect={a => { setAirportLoadingCode(a.code); setAirportLoadingName(a.name); }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[4px]">
                    <div className="flex items-center justify-between flex-wrap gap-[8px]">
                      <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Airport of Unloading</p>
                      {!viewOnly && (
                        <button type="button" onClick={() => { setEditingUnloadingId(null); setEditingAwbLineId(undefined); setStep('addUnloading'); }}
                          className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[8px]"
                          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                          <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 2v10M2 7h10" /></svg>
                          Add Unloading Details
                        </button>
                      )}
                    </div>
                    {unloadingRows.length > 0 && (
                      <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>
                        {unloadingRows.length} airport{unloadingRows.length !== 1 ? 's' : ''} · {unloadingRows.reduce((s, r) => s + r.lines.length, 0)} AWBs total
                      </span>
                    )}
                  </div>

                  {unloadingRows.length === 0 ? (
                    <div className="bg-white rounded-[8px] flex flex-col items-center gap-[12px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)', padding: '32px 16px' }}>
                      <p className="text-[16px] text-[#697498]">No airports of unloading added yet.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[8px] overflow-hidden flex flex-col md:flex-row" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)', minHeight: 420 }}>
                      {/* Sidebar — airports */}
                      <div className="flex flex-col flex-shrink-0 md:w-[260px]" style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 480 }}>
                          {unloadingRows.map(r => {
                            const isSelected = selectedUnloadingRow?.id === r.id;
                            return (
                              <div key={r.id} onClick={() => selectUnloadingAirport(r.id)}
                                className="flex items-center gap-[10px] px-[14px] py-[12px] cursor-pointer transition-colors"
                                style={{ background: isSelected ? '#f0f4ff' : 'transparent', borderLeft: `3px solid ${isSelected ? '#1360d2' : 'transparent'}`, borderBottom: '1px solid #f8fafd' }}>
                                <div className="size-[36px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#1360d2' }}>
                                  <span className="text-[12px] text-white" style={{ fontWeight: 700, fontFamily: font }}>{r.airportCode.slice(0, 3) || '—'}</span>
                                </div>
                                <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                                  <span className="text-[14px] text-[#051937] truncate" style={{ fontWeight: 500, fontFamily: font }}>{r.airportName || r.airportCode || 'Unnamed'}</span>
                                  <div className="flex items-center gap-[6px]" onClick={e => e.stopPropagation()} style={r.nilCargo === 'Yes' ? { cursor: 'not-allowed' } : undefined}>
                                    <span className="size-[14px] rounded-[3px] inline-flex items-center justify-center flex-shrink-0"
                                      style={{ border: `2px solid ${r.nilCargo === 'Yes' ? '#c8ccd6' : '#a7abb2'}`, background: r.nilCargo === 'Yes' ? '#c8ccd6' : '#fff' }}>
                                      {r.nilCargo === 'Yes' && (
                                        <svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
                                      )}
                                    </span>
                                    <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>Nil Cargo</span>
                                  </div>
                                  <span className="text-[14px]" style={{ color: '#219653', fontFamily: font }}>{r.lines.length} AWB{r.lines.length !== 1 ? 's' : ''}</span>
                                </div>
                                {!viewOnly && (
                                  <button type="button" onClick={e => { e.stopPropagation(); setConfirmDeleteUnloadingId(r.id); }}
                                    aria-label={`Remove ${r.airportCode}`}
                                    className="size-[24px] flex-shrink-0 inline-flex items-center justify-center rounded-[4px] hover:bg-[#fef2f2] transition-colors" style={{ color: '#dc3545' }}>
                                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail pane — selected airport's AWBs */}
                      <div className="flex-1 flex flex-col min-w-0" style={{ borderLeft: '1px solid #f3f4f6' }}>
                        {selectedUnloadingRow && (
                          <>
                            <div className="flex items-center justify-between flex-wrap gap-[8px] px-[20px] py-[14px]" style={{ background: '#f8fafd', borderBottom: '1px solid #eef1f6' }}>
                              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>List of Airway Bill of Unloading</p>
                              {!viewOnly && (
                                <button type="button" onClick={() => { setEditingUnloadingId(selectedUnloadingRow.id); setEditingAwbLineId(undefined); setStep('addUnloading'); }}
                                  className="text-[14px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>
                                  + Add AWB
                                </button>
                              )}
                            </div>

                            <div className="flex-1 overflow-auto">
                              {selectedUnloadingRow.lines.length === 0 ? (
                                <p className="text-[15px] text-[#697498] text-center" style={{ padding: '32px 16px', fontFamily: font }}>No airway bills added yet.</p>
                              ) : (
                                <div style={{ position: 'relative' }}>
                                  <ScrollArrows atStart={awbAtScrollStart} atEnd={awbAtScrollEnd} onLeft={awbScrollToStart} onRight={awbScrollToEnd} stickyWidth={viewOnly ? 70 : 150} />
                                  <div ref={awbScrollRef} onScroll={awbHandleScroll} className="overflow-x-auto">
                                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 1180 }}>
                                    <thead>
                                      <tr style={{ background: '#e2ebf9' }}>
                                        {['Sl. No.', 'AWB Number', 'Origin', 'Destination', 'Shipper', 'Consignee', 'Goods Description', 'Shipment Description Code', 'Pieces', 'Gross Wt (KG)', 'Actions'].map(h => (
                                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]"
                                            style={h === 'Actions'
                                              ? { fontWeight: 500, whiteSpace: 'nowrap', background: '#e2ebf9', position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }
                                              : { fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {selectedUnloadingRow.lines.slice((awbTablePage - 1) * AWB_TABLE_PAGE_SIZE, awbTablePage * AWB_TABLE_PAGE_SIZE).map((l, idx) => (
                                        <tr key={l.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{(awbTablePage - 1) * AWB_TABLE_PAGE_SIZE + idx + 1}</td>
                                          <td className="px-[16px] py-[10px] text-[14px]" style={{ color: '#1360d2', fontWeight: 500 }}>{l.awbNo}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.originCode || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.destCode || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.shipperName || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.consigneeName || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.goodsDescription || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.shipmentDescCode || '—'}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{l.pieces}</td>
                                          <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{awbWeightKg(l).toFixed(1)}</td>
                                          <td className="px-[16px] py-[10px]" style={{ position: 'sticky', right: 0, background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                                            <div className="flex items-center gap-[8px]">
                                              <button type="button" onClick={() => setViewingAwbLine(l)} aria-label={`View ${l.awbNo}`}
                                                className="size-[26px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors" style={{ color: '#455174' }}>
                                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
                                              </button>
                                              {!viewOnly && (
                                                <>
                                                  <button type="button" onClick={() => { setEditingAwbPopup(l); setEditingAwbPopupRowId(selectedUnloadingRow.id); }}
                                                    aria-label={`Edit ${l.awbNo}`} className="size-[26px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors" style={{ color: '#1360d2' }}>
                                                    <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l4 4-9 9H5v-4z" /></svg>
                                                  </button>
                                                  <button type="button" onClick={() => removeAwbLine(selectedUnloadingRow.id, l.id)}
                                                    aria-label={`Remove ${l.awbNo}`} className="size-[26px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#fef2f2] transition-colors" style={{ color: '#dc3545' }}>
                                                    <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  </div>
                                </div>
                              )}
                            </div>

                            {selectedUnloadingRow.lines.length > 0 && (
                              <div className="px-[20px] py-[10px]" style={{ borderTop: '1px solid #f5f7fc' }}>
                                <Pagination page={awbTablePage} totalPages={Math.max(1, Math.ceil(selectedUnloadingRow.lines.length / AWB_TABLE_PAGE_SIZE))}
                                  pageSize={AWB_TABLE_PAGE_SIZE} totalItems={selectedUnloadingRow.lines.length} onPageChange={setAwbTablePage} onPageSizeChange={() => {}} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-[16px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest File Details</p>
                <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <FInput label="Manifest File Type" value={manifestTypeUpload} onChange={() => {}} disabled />
                </div>

                <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Upload Manifest File</p>
                <div
                  onDragOver={e => { e.preventDefault(); setUploadDragging(true); }}
                  onDragLeave={() => setUploadDragging(false)}
                  onDrop={e => {
                    e.preventDefault(); setUploadDragging(false);
                    addUploadFiles(e.dataTransfer.files);
                  }}
                  className="w-full lg:max-w-[50%] flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors"
                  style={{
                    border: `1.5px dashed ${uploadDragging ? '#1360d2' : '#b5c8e8'}`,
                    background: uploadDragging ? '#edf3ff' : '#f8fafd',
                  }}
                >
                  <div className="size-[56px] rounded-full inline-flex items-center justify-center"
                    style={{ background: uploadDragging ? '#d8e8ff' : '#e2ebf9' }}>
                    <img src={cloudUploadIcon} alt="" style={{ width: 26, height: 24 }} />
                  </div>
                  <p className="text-[16px] text-[#697498] text-center" style={{ lineHeight: 1.5 }}>Drag and drop or</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="h-[40px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                    style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
                    Choose File
                  </button>
                </div>
                <input ref={fileInputRef} type="file" multiple accept=".txt" className="hidden" onChange={e => addUploadFiles(e.target.files)} />
                <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <p className="text-[15px] text-[#697498] mb-[12px]" style={{ fontFamily: font }}>No Of Files Added : <b style={{ color: '#0e1b3d' }}>{uploadFiles.length}</b></p>
                  <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                    <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#e2ebf9' }}>
                          {['File Name', 'File Size (KB)', 'Action'].map(h => (
                            <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadFiles.length === 0 ? (
                          <tr><td colSpan={3} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No files added yet. Click &quot;Add&quot; to select a .txt file.</td></tr>
                        ) : uploadFiles.map(f => (
                          <tr key={f.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.name}</td>
                            <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.sizeKb}</td>
                            <td className="px-[16px] py-[10px]">
                              <button onClick={() => removeUploadFile(f.id)} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </fieldset>
      </div>

      {step === 'manifest' && (
        <BackToListingBar
          onBack={skipIntro ? undefined : () => setStep('flightDetails')}
          onBackToListing={skipIntro ? onBackToListing : undefined}
          rightContent={
            viewOnly ? undefined : (
              <div className="flex items-center gap-[12px]">
                <button data-secondary-btn className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  Save As Draft
                </button>
                <button
                  onClick={() => { const ok = subTab === 'manual' ? canSubmitManual : canSubmitUpload; if (ok) setStep('success'); }}
                  disabled={subTab === 'manual' ? !canSubmitManual : !canSubmitUpload}
                  className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                  style={{ background: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? '#1360d2' : '#a7c3eb', cursor: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500, boxShadow: (subTab === 'manual' ? canSubmitManual : canSubmitUpload) ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}>
                  Submit
                </button>
              </div>
            )
          }
        />
      )}
      {step === 'flightDetails' && <BackToListingBar onBackToListing={onBackToListing} />}

      {showFlightSearch && (
        <FlightSearchPopup onSelect={selectFlight} onClose={() => setShowFlightSearch(false)} />
      )}

      {viewingAwbLine && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ width: '100%', maxWidth: 960, boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>View Airway Bill</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              <FInput label="Airway Bill No." value={viewingAwbLine.awbNo} onChange={() => {}} disabled />
              <FInput label="Goods Description" value={viewingAwbLine.goodsDescription} onChange={() => {}} disabled />
              <FInput label="Weight" value={viewingAwbLine.weight} onChange={() => {}} disabled />
              <FInput label="Weight Unit" value={viewingAwbLine.weightUnit} onChange={() => {}} disabled />
              <FInput label="Shipper Name" value={viewingAwbLine.shipperName} onChange={() => {}} disabled />
              <FInput label="Number of Pieces" value={viewingAwbLine.pieces} onChange={() => {}} disabled />
              <FInput label="Shipment Description Code" value={viewingAwbLine.shipmentDescCode} onChange={() => {}} disabled />
              <FInput label="Consignee Name" value={viewingAwbLine.consigneeName} onChange={() => {}} disabled />
              <FInput label="Airport/City of Origin" value={viewingAwbLine.originCode ? `${viewingAwbLine.originCode} — ${viewingAwbLine.originName}` : ''} onChange={() => {}} disabled />
              <FInput label="Airport/City of Destination" value={viewingAwbLine.destCode ? `${viewingAwbLine.destCode} — ${viewingAwbLine.destName}` : ''} onChange={() => {}} disabled />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setViewingAwbLine(null)}
                data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editingAwbPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ width: '100%', maxWidth: 960, boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Edit Airway Bill</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              <FInput label="Airway Bill No." value={editingAwbPopup.awbNo} onChange={() => {}} disabled />
              <FInput label="Goods Description" value={editingAwbPopup.goodsDescription} onChange={v => setEditingAwbPopup(p => p && { ...p, goodsDescription: v })} req />
              <FInput label="Weight" value={editingAwbPopup.weight} onChange={v => setEditingAwbPopup(p => p && { ...p, weight: v })} req />
              <FSelect label="Weight Unit" value={editingAwbPopup.weightUnit} onChange={v => setEditingAwbPopup(p => p && { ...p, weightUnit: v })} options={['KG', 'LB']} req />
              <FInput label="Shipper Name" value={editingAwbPopup.shipperName} onChange={v => setEditingAwbPopup(p => p && { ...p, shipperName: v })} req />
              <FInput label="Number of Pieces" value={editingAwbPopup.pieces} onChange={v => setEditingAwbPopup(p => p && { ...p, pieces: v })} req />
              <FSelect label="Shipment Description Code" value={editingAwbPopup.shipmentDescCode} onChange={v => setEditingAwbPopup(p => p && { ...p, shipmentDescCode: v })} options={['Total Consignment', 'Part Consignment']} />
              <FInput label="Consignee Name" value={editingAwbPopup.consigneeName} onChange={v => setEditingAwbPopup(p => p && { ...p, consigneeName: v })} req />
              <AirportCombo label="Airport/City of Origin" req code={editingAwbPopup.originCode} name={editingAwbPopup.originName}
                onSelect={a => setEditingAwbPopup(p => p && { ...p, originCode: a.code, originName: a.name })} />
              <AirportCombo label="Airport/City of Destination" req code={editingAwbPopup.destCode} name={editingAwbPopup.destName}
                onSelect={a => setEditingAwbPopup(p => p && { ...p, destCode: a.code, destName: a.name })} />
            </div>
            <div className="flex justify-end gap-[10px]">
              <button type="button" onClick={() => setEditingAwbPopup(null)}
                data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Cancel</button>
              <button type="button" onClick={() => {
                  setUnloadingRows(p => p.map(r => r.id !== editingAwbPopupRowId ? r : { ...r, lines: r.lines.map(l => l.id === editingAwbPopup.id ? editingAwbPopup : l) }));
                  setEditingAwbPopup(null);
                }}
                className="h-[44px] px-[20px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontWeight: 500, fontFamily: font, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteUnloadingId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => setConfirmDeleteUnloadingId(null)}>
          <div className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }} onClick={e => e.stopPropagation()}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#dc3545' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-[8px] text-center">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure you want to delete this airport?</p>
              <p className="text-[16px] text-[#455174]" style={{ lineHeight: 1.4 }}>All the added AWB&apos;s will be removed from this request.</p>
            </div>
            <div className="flex gap-[12px]">
              <button type="button" onClick={() => setConfirmDeleteUnloadingId(null)}
                data-secondary-btn className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white transition-colors" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                Cancel
              </button>
              <button type="button" onClick={() => {
                  setUnloadingRows(p => p.filter(x => x.id !== confirmDeleteUnloadingId));
                  if (selectedUnloadingId === confirmDeleteUnloadingId) setSelectedUnloadingId(null);
                  setConfirmDeleteUnloadingId(null);
                }}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors" style={{ background: '#1360d2', fontWeight: 500, fontFamily: font }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
