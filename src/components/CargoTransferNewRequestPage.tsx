import React, { useEffect, useState } from 'react';
import FloatingField from './FloatingField';
import { DateInputOutlined } from './DatePicker';

type FormValues = {
  clientRef: string;
  carrierReg: string;
  mawb: string;
  transferorBizCode: string;
  transferorPremCode: string;
  transfereeBizCode: string;
  transfereePremCode: string;
};

function formatTransferTypeTitle(type: string): string {
  if (!type) return 'Cargo Transfer';
  const parts = type.split(' - ');
  if (parts.length === 2) {
    const main = parts[0].replace(/^From\s+/, 'from ');
    return `Cargo Transfer ${main} (${parts[1]})`;
  }
  return type;
}

type Props = {
  onBack: () => void;
  onSave: (values: FormValues) => void;
  initialCargoChannel?: string;
  initialClientRef?: string;
  initialCarrierReg?: string;
  initialMawb?: string;
  initialTransferorBizCode?: string;
  initialTransferorPremCode?: string;
  initialTransfereeBizCode?: string;
  initialTransfereePremCode?: string;
  initialTransferType?: string;
  mode?: 'create' | 'amend';
  transferNumber?: string;
};

/* ─── SVGs ─── */
const SearchSvg = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" />
  </svg>
);
const SortSvg = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#0e1b3d" strokeWidth="1.4" strokeLinecap="round">
    <path d="M2 4h12M4 8h8M6 12h4" />
  </svg>
);

/* ─── Floating label helper ─── */
function FloatLabel({ floated, focused, required, children }: {
  floated: boolean; focused: boolean; required?: boolean; children: React.ReactNode;
}) {
  return (
    <label className="absolute pointer-events-none transition-all" style={{
      left: floated ? 12 : 16,
      top: floated ? -9 : '50%',
      transform: floated ? 'none' : 'translateY(-50%)',
      background: floated ? '#fff' : 'transparent',
      padding: floated ? '0 4px' : '0',
      fontSize: floated ? 12 : 14,
      color: focused ? '#1360d2' : '#0e1b3d',
      fontFamily: "'Dubai', sans-serif",
      transitionDuration: '120ms',
      transitionProperty: 'top, left, font-size, transform, padding, background, color',
    }}>
      {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{children}
    </label>
  );
}

/* ─── Read-only display field (always floated, gray bg) ─── */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative" style={{ flex: '1 0 200px', minWidth: 200 }}>
      <div className="flex items-center px-[16px]"
        style={{ height: 56, borderRadius: 4, border: '1px solid #d5ddfb', background: '#f4f4f4' }}>
        <span className="flex-1 text-[16px]"
          style={{ color: '#0e1b3d', fontFamily: "'Dubai', sans-serif" }}>{value}</span>
      </div>
      <label className="absolute pointer-events-none" style={{
        left: 12, top: -9, background: '#f4f4f4', padding: '0 4px',
        fontSize: 12, color: '#0e1b3d', fontFamily: "'Dubai', sans-serif",
      }}>{label}</label>
    </div>
  );
}

/* ─── Search picker field with inline flyout and name badge ─── */
function SearchPickerField({ label, required, value, onChange, suggestions, onModalOpen }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  suggestions: { code: string; name: string; expiryDate?: string; trnNumber?: string }[];
  onModalOpen?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const floated = focused || value.length > 0;
  const borderColor = focused ? '#1360d2' : '#d5ddfb';

  const selectedItem = suggestions.find(s => s.code === value);
  const filtered = value.length > 0 && !selectedItem
    ? suggestions.filter(s =>
        s.code.toLowerCase().includes(value.toLowerCase()) ||
        s.name.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif", minWidth: 0 }}>
      <div className="relative">
        <div className="flex items-center gap-[8px] px-[14px]"
          style={{ height: 56, borderRadius: 4, border: `1px solid ${borderColor}`, background: '#fff' }}>
          <input
            value={value}
            onChange={e => { onChange(e.target.value); setShowDropdown(true); }}
            onFocus={() => { setFocused(true); if (!selectedItem) setShowDropdown(true); }}
            onBlur={() => { setTimeout(() => { setFocused(false); setShowDropdown(false); }, 150); }}
            placeholder=""
            className="flex-1 text-[16px] outline-none bg-transparent"
            style={{ color: '#0e1b3d', fontFamily: "'Dubai', sans-serif" }}
          />
          <button type="button" onClick={() => onModalOpen?.()} className="flex-shrink-0 size-[22px] flex items-center justify-center">
            <SearchSvg />
          </button>
        </div>
        <label className="absolute pointer-events-none transition-all" style={{
          left: floated ? 12 : 16,
          top: floated ? -9 : '50%',
          transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent',
          padding: floated ? '0 4px' : '0',
          fontSize: floated ? 12 : 14,
          color: focused ? '#1360d2' : '#0e1b3d',
          fontFamily: "'Dubai', sans-serif",
          transitionDuration: '120ms',
          transitionProperty: 'top, left, font-size, transform, padding, background, color',
          whiteSpace: 'nowrap',
        }}>
          {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label.replace('*', '').trim()}
        </label>
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
            style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {filtered.map(item => (
              <li key={item.code}
                onMouseDown={() => { onChange(item.code); setShowDropdown(false); }}
                className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif" }}>
                <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{item.code}</span>
                <span style={{ color: '#697498' }}> — {item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedItem && (
        <div className="flex flex-col gap-[4px]">
          <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
            <span className="text-[16px]" style={{ color: '#051937', fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>
              {selectedItem.name}
            </span>
          </div>
          {selectedItem.expiryDate && (
            <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
              <span className="text-[16px]" style={{ color: '#051937', fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>
                Expiry Date: {selectedItem.expiryDate}
              </span>
            </div>
          )}
          {selectedItem.trnNumber && (
            <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
              <span className="text-[16px]" style={{ color: '#051937', fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>
                TRN Number: {selectedItem.trnNumber}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Business Code search modal ─── */
const BIZ_ROWS = Array.from({ length: 8 }, (_, i) => ({
  code: `AE-${String(1019056 + i).padStart(7, '0')}`,
  name: `Dubai Trading Co. ${String.fromCharCode(65 + i)}`,
  type: 'Customs Agent',
  location: 'Jebel Ali',
}));

function BusinessCodeModal({ open, onClose, onSelect, title }: {
  open: boolean; onClose: () => void; onSelect: (code: string) => void; title: string;
}) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const cols = ['Business Code', 'Business Name', 'Business Types', 'Facility Locations', 'Action'];
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] p-[24px] flex flex-col gap-[32px] overflow-hidden"
        style={{ width: 'min(780px,100%)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Title + close */}
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Search row */}
        <div className="flex gap-[12px] flex-shrink-0">
          <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px] bg-white">
            <SearchSvg />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter Business Code"
              className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent"
              style={{ fontFamily: "'Dubai', sans-serif", opacity: query ? 1 : 0.5 }} />
          </div>
          <button data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[32px] py-[12px] text-[16px] text-[#1360d2] transition-colors flex-shrink-0"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Search
          </button>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto rounded-[8px] bg-[#f8fafd]">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                {cols.map((c, i) => (
                  <th key={c} style={{
                    background: '#a6c2e9', padding: '12px', textAlign: i === cols.length - 1 ? 'center' : 'left',
                    fontSize: 14, fontWeight: 500, color: '#0e1b3d', letterSpacing: '0.07px',
                    whiteSpace: 'nowrap', height: 44,
                  }}>
                    <div className="flex items-center gap-[4px]">
                      {c} {i < cols.length - 1 && <SortSvg />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BIZ_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={{ padding: '0 12px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa' }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.code}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa' }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.name}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa' }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.type}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa' }}>
                    <span className="text-[15px] text-[#0e1b3d]">{row.location}</span>
                  </td>
                  <td style={{ padding: '0 8px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                    <button onClick={() => { onSelect(row.code); onClose(); }}
                      className="text-[16px] text-[#1360d2] hover:underline"
                      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between flex-shrink-0 py-[8px]">
          <div className="flex items-center gap-[20px]">
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Result</span>
            <div className="bg-white border border-[#d5ddfb] rounded-[10px] h-[48px] flex items-center overflow-hidden" style={{ width: 162 }}>
              <span className="flex-1 text-center text-[16px] text-[#8f94ae] pl-[15px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>1 - 8</span>
              <div className="border-l border-[#d5ddfb] h-full flex items-center justify-center px-[12px]">
                <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif" }}>8</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
              </div>
            </div>
          </div>
          <div className="bg-white flex items-center gap-[20px] px-[16px] py-[8px] rounded-[10px]">
            {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (
              <button key={i}
                className="size-[32px] flex items-center justify-center rounded-full text-[16px] transition-colors"
                style={{
                  background: p === '4' ? '#1360d2' : 'transparent',
                  color: p === '4' ? '#f8fafd' : '#7681ab',
                  fontFamily: "'Dubai', sans-serif", fontWeight: 500, opacity: 0.7,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Premises Code search modal ─── */
const PREM_ROWS = [
  { code: 'PR-00017', name: 'Raffiq premises',          location: 'DUBAI AIRPORT(CARGO VILLAGE)',  bizName: 'Al Raffiq Trading', address: '63 63' },
  { code: 'PR-00074', name: 'Al rafffiq',               location: 'DXB INTL AIRPORT PAX TERMINAL1', bizName: 'Al Raffiq Trading', address: '63 63' },
  { code: 'PR-00088', name: 'ALTHAFF',                  location: 'DXB INTL AIRPORT PAX TERMINAL1', bizName: 'Al Raffiq Trading', address: 'Dubai Airport DCUAT' },
  { code: 'PR-00094', name: 'Arun Trades',              location: 'JEBEL ALI',                      bizName: 'Al Raffiq Trading', address: 'Address - Line 1 Address - Line 2' },
  { code: 'PR-01522', name: 'dwc',                      location: 'LOGISTICS DISTRICT',             bizName: 'Al Raffiq Trading', address: '45 erwe' },
  { code: 'PR-01525', name: 'freight8',                 location: 'DWC AlMaktoum Cargo Terminal',   bizName: 'Al Raffiq Trading', address: '3423 324' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE', location: 'Dubai Intl. Airport (FG 5)', bizName: 'Al Raffiq Trading', address: 'D DC' },
  { code: 'PR-01582', name: 'Jebel Ali',                location: 'JEBEL ALI',                      bizName: 'Al Raffiq Trading', address: 'DC DC' },
  { code: 'PR-01583', name: 'Dubai Inl Airport Pax Tmnl1', location: 'DXB INTL AIRPORT PAX TERMINAL1', bizName: 'Al Raffiq Trading', address: 'DC DC' },
  { code: 'PR-01609', name: 'Land Transpt',             location: 'Land Transport',                 bizName: 'Al Raffiq Trading', address: 'Dubai DC' },
];

function PremisesCodeModal({ open, onClose, onSelect, title }: {
  open: boolean; onClose: () => void; onSelect: (code: string) => void; title: string;
}) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const cols = ['Premises Code', 'Premises Name', 'Customs Location', 'Business Name', 'Address', 'Action'];
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] p-[24px] flex flex-col gap-[24px] overflow-hidden"
        style={{ width: 'min(960px,100%)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Title + close */}
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Search row */}
        <div className="flex gap-[12px] flex-shrink-0">
          <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px] bg-white">
            <SearchSvg />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter Premises Code"
              className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent"
              style={{ fontFamily: "'Dubai', sans-serif", opacity: query ? 1 : 0.5 }} />
          </div>
          <button data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[32px] py-[12px] text-[16px] text-[#1360d2] transition-colors flex-shrink-0"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Search
          </button>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto rounded-[8px] bg-[#f8fafd]">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                {cols.map((c, i) => (
                  <th key={c} style={{
                    background: '#a6c2e9', padding: '12px', textAlign: i === cols.length - 1 ? 'center' : 'left',
                    fontSize: 14, fontWeight: 500, color: '#0e1b3d', letterSpacing: '0.07px',
                    whiteSpace: 'nowrap', height: 44,
                  }}>
                    <div className="flex items-center gap-[4px]">
                      {c} {i < cols.length - 1 && <SortSvg />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PREM_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  {[row.code, row.name, row.location, row.bizName, row.address].map((v, j) => (
                    <td key={j} style={{ padding: '0 12px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa' }}>
                      <span className="text-[15px] text-[#0e1b3d]">{v}</span>
                    </td>
                  ))}
                  <td style={{ padding: '0 8px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                    <button onClick={() => { onSelect(row.code); onClose(); }}
                      className="text-[16px] text-[#1360d2] hover:underline"
                      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between flex-shrink-0 py-[8px]">
          <div className="flex items-center gap-[20px]">
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Result</span>
            <div className="bg-white border border-[#d5ddfb] rounded-[10px] h-[48px] flex items-center overflow-hidden" style={{ width: 162 }}>
              <span className="flex-1 text-center text-[16px] text-[#8f94ae] pl-[15px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>1 - 10</span>
              <div className="border-l border-[#d5ddfb] h-full flex items-center justify-center px-[12px]">
                <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif" }}>10</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
              </div>
            </div>
          </div>
          <div className="bg-white flex items-center gap-[20px] px-[16px] py-[8px] rounded-[10px]">
            {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (
              <button key={i}
                className="size-[32px] flex items-center justify-center rounded-full text-[16px] transition-colors"
                style={{
                  background: p === '1' ? '#1360d2' : 'transparent',
                  color: p === '1' ? '#f8fafd' : '#7681ab',
                  fontFamily: "'Dubai', sans-serif", fontWeight: 500, opacity: 0.7,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const BIZ_SUGGESTIONS = [
  { code: 'AE1006',     name: 'Sony Gulf FZE',        expiryDate: '05-Aug-30', trnNumber: '100025424700001' },
  { code: 'AE1007',     name: 'Emirates Trading LLC', expiryDate: '12-Mar-28', trnNumber: '100025424700002' },
  { code: 'AE1008',     name: 'Dubai Cargo Co.',      expiryDate: '20-Jan-29', trnNumber: '100025424700003' },
  { code: 'AE-1019056', name: 'Dubai Trading Co. A',  expiryDate: '01-Dec-27', trnNumber: '100025424700004' },
  { code: 'AE-1019057', name: 'Dubai Trading Co. B',  expiryDate: '15-Nov-26', trnNumber: '100025424700005' },
  { code: 'AE-1019058', name: 'Dubai Trading Co. C',  expiryDate: '30-Sep-28', trnNumber: '100025424700006' },
  { code: 'AE-9106286', name: 'SW Logistics LLC',     expiryDate: '05-Aug-30', trnNumber: '100025424700009' },
  { code: 'AE-9105364', name: 'U1DETBUS',             expiryDate: '05-Aug-30', trnNumber: '100025424700009' },
];

const PREM_SUGGESTIONS = [
  { code: 'PRE-001', name: 'Dubai Airport Cargo Village' },
  { code: 'PRE-002', name: 'Jebel Ali FZE Premises' },
  { code: 'PR-00017', name: 'Raffiq premises' },
  { code: 'PR-00074', name: 'Al rafffiq' },
  { code: 'PR-00088', name: 'ALTHAFF' },
  { code: 'PR-00094', name: 'Arun Trades' },
  { code: 'PR-01522', name: 'dwc' },
  { code: 'PR-01525', name: 'freight8' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE' },
  { code: 'PR-01582', name: 'Jebel Ali' },
];

const CARRIER_SUGGESTIONS = [
  { code: '623595', name: 'STK 1026' },
  { code: '623600', name: 'STK 1026 B' },
  { code: '623575', name: 'APL QINGDAO' },
  { code: '623608', name: 'MOL ASANTE' },
  { code: '623512', name: 'MSC DIANA' },
  { code: '623490', name: 'EVER GIVEN' },
  { code: '623455', name: 'MAERSK KENTUCKY' },
];

const VESSEL_ROWS = [
  { vesselName: 'STK 1026',        rotationNumber: '623595', date: '20/11/2024' },
  { vesselName: 'STK 1026',        rotationNumber: '623600', date: '20/10/2024' },
  { vesselName: 'APL QINGDAO',     rotationNumber: '623575', date: '10/10/2024' },
  { vesselName: 'MOL ASANTE',      rotationNumber: '623608', date: '10/09/2024' },
  { vesselName: 'MSC DIANA',       rotationNumber: '623512', date: '05/09/2024' },
  { vesselName: 'EVER GIVEN',      rotationNumber: '623490', date: '01/09/2024' },
  { vesselName: 'MAERSK KENTUCKY', rotationNumber: '623455', date: '25/08/2024' },
];

const CALLING_PORTS = ['Jebel Ali Port', 'Dubai International Airport', 'Abu Dhabi Airport', 'Sharjah Airport', 'Khalifa Port'];

function CarrierVesselModal({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (rotationNumber: string, vesselName: string) => void;
}) {
  const [vesselName, setVesselName] = useState('');
  const [callingPort, setCallingPort] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [portOpen, setPortOpen] = useState(false);
  const f = "'Dubai', sans-serif";

  const filtered = VESSEL_ROWS.filter(r =>
    !vesselName || r.vesselName.toLowerCase().includes(vesselName.toLowerCase())
  );
  const handleReset = () => { setVesselName(''); setCallingPort(''); setFromDate(''); setToDate(''); };

  if (!open) return null;
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px 18px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  const tdS: React.CSSProperties = { padding: '0 18px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 15, color: '#0e1b3d' };
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(1080px,96vw)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Dark header */}
        <div className="flex items-center justify-between px-[20px] py-[20px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <p className="text-[20px] text-white" style={{ fontFamily: f, fontWeight: 500 }}>Search Vessel</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Filters */}
        <div className="px-[20px] pt-[20px] pb-[8px] flex-shrink-0">
          <div className="flex flex-wrap gap-[20px] items-end">
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="Enter Vessel Name"
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: f }} />
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: f }}>Vessel Name</label>
            </div>
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <button type="button" onClick={() => setPortOpen(o => !o)}
                className="w-full flex items-center px-[16px] bg-white"
                style={{ height: 56, border: `1px solid ${portOpen ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: f }}>
                <span className="flex-1 text-left text-[16px]" style={{ color: '#051937', opacity: callingPort ? 1 : 0.7 }}>{callingPort || 'Select Calling Port'}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${portOpen ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" /></svg>
              </button>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: f }}>Calling Port</label>
              {portOpen && (
                <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
                  style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {CALLING_PORTS.map(p => (
                    <li key={p} onMouseDown={() => { setCallingPort(p); setPortOpen(false); }}
                      className="px-[16px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9]"
                      style={{ color: p === callingPort ? '#1360d2' : '#051937', fontFamily: f }}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
            <DateInputOutlined
              label="From Date (one month)"
              value={fromDate}
              onChange={setFromDate}
              style={{ flex: '1 1 260px', minWidth: 220 }}
              font={f}
            />
            <DateInputOutlined
              label="To Date"
              value={toDate}
              onChange={setToDate}
              style={{ flex: '1 1 260px', minWidth: 220 }}
              font={f}
            />
            <div className="flex gap-[20px] items-center">
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, border: '1px solid #1360d2', borderRadius: 3, background: '#fff', color: '#1360d2', fontFamily: f, fontWeight: 700, fontSize: 16, minWidth: 92 }}>
                Reset
              </button>
              <button type="button"
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, borderRadius: 3, background: '#1360d2', color: '#fff', fontFamily: f, fontWeight: 500, fontSize: 16, minWidth: 134 }}>
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-[20px] pb-[30px]">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: f }}>
            <thead>
              <tr>
                <th style={thS}>Vessel Name</th>
                <th style={thS}>Rotation Number</th>
                <th style={thS}>Date</th>
                <th style={{ ...thS, borderRadius: '0 8px 8px 0' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={tdS}>{row.vesselName}</td>
                  <td style={tdS}>{row.rotationNumber}</td>
                  <td style={tdS}>{row.date}</td>
                  <td style={{ ...tdS, paddingLeft: 18 }}>
                    <button onClick={() => { onSelect(row.rotationNumber, row.vesselName); onClose(); }}
                      className="text-[16px] hover:underline" style={{ color: '#1360d2', fontFamily: f, fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Flight search modal ─── */
const FLIGHT_ROWS = [
  { flightNo: 'EK0365', date: '18-Jun-26' },
  { flightNo: 'EK0863', date: '18-Jun-26' },
  { flightNo: 'EK0331', date: '18-Jun-26' },
  { flightNo: 'EK0826', date: '18-Jun-26' },
  { flightNo: 'EK0008', date: '18-Jun-26' },
  { flightNo: 'EK0503', date: '18-Jun-26' },
  { flightNo: 'EK0748', date: '18-Jun-26' },
  { flightNo: 'EK0720', date: '18-Jun-26' },
];

function FlightSearchModal({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (flightNo: string, date: string) => void;
}) {
  const [flightNoFilter, setFlightNoFilter] = useState('');
  const [fromDate, setFromDate] = useState('2026-06-05');
  const [toDate, setToDate] = useState('2026-06-18');
  const f = "'Dubai', sans-serif";

  const filtered = FLIGHT_ROWS.filter(r =>
    !flightNoFilter || r.flightNo.toLowerCase().includes(flightNoFilter.toLowerCase())
  );
  const handleReset = () => { setFlightNoFilter(''); setFromDate('2026-06-05'); setToDate('2026-06-18'); };

  if (!open) return null;
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px 18px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  const tdS: React.CSSProperties = { padding: '0 18px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 15, color: '#0e1b3d' };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(900px,96vw)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Dark header */}
        <div className="flex items-center justify-between px-[20px] py-[20px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <p className="text-[20px] text-white" style={{ fontFamily: f, fontWeight: 500 }}>Search Flight</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Filters */}
        <div className="px-[20px] pt-[20px] pb-[8px] flex-shrink-0">
          <div className="flex flex-wrap gap-[20px] items-end">
            <div className="relative" style={{ flex: '1 1 220px', minWidth: 180 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <input value={flightNoFilter} onChange={e => setFlightNoFilter(e.target.value)} placeholder=""
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: f }} />
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: f }}>Flight No</label>
            </div>
            <DateInputOutlined
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              style={{ flex: '1 1 220px', minWidth: 180 }}
              font={f}
            />
            <DateInputOutlined
              label="To Date"
              value={toDate}
              onChange={setToDate}
              style={{ flex: '1 1 220px', minWidth: 180 }}
              font={f}
            />
            <div className="flex gap-[16px] items-center">
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, border: '1px solid #1360d2', borderRadius: 3, background: '#fff', color: '#1360d2', fontFamily: f, fontWeight: 700, fontSize: 16, minWidth: 92 }}>
                Reset
              </button>
              <button type="button"
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, borderRadius: 3, background: '#1360d2', color: '#fff', fontFamily: f, fontWeight: 500, fontSize: 16, minWidth: 120 }}>
                Search
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-[20px] pb-[30px]">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: f }}>
            <thead>
              <tr>
                <th style={thS}>Flight</th>
                <th style={thS}>Date</th>
                <th style={{ ...thS, borderRadius: '0 8px 8px 0' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={tdS}>{row.flightNo}</td>
                  <td style={tdS}>{row.date}</td>
                  <td style={{ ...tdS, paddingLeft: 18 }}>
                    <button onClick={() => { onSelect(row.flightNo, row.date); onClose(); }}
                      className="text-[16px] hover:underline" style={{ color: '#1360d2', fontFamily: f, fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function CargoTransferNewRequestPage({
  onBack, onSave,
  initialCargoChannel = '',
  initialClientRef = '',
  initialCarrierReg = '',
  initialMawb = '',
  initialTransferorBizCode = '',
  initialTransferorPremCode = '',
  initialTransfereeBizCode = '',
  initialTransfereePremCode = '',
  initialTransferType = '',
  mode = 'create',
  transferNumber = '',
}: Props) {
  const [clientRef, setClientRef] = useState(initialClientRef);
  const [carrierReg, setCarrierReg] = useState(initialCarrierReg);
  const [carrierVesselName, setCarrierVesselName] = useState('');
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [mawb, setMawb] = useState(initialMawb);
  const [transferorBizCode, setTransferorBizCode] = useState(initialTransferorBizCode);
  const [transferorPremCode, setTransferorPremCode] = useState(initialTransferorPremCode);
  const [transfereeBizCode, setTransfereeBizCode] = useState(initialTransfereeBizCode);
  const [transfereePremCode, setTransfereePremCode] = useState(initialTransfereePremCode);
  const [bizModal, setBizModal] = useState<null | 'transferor' | 'transferee'>(null);
  const [premModal, setPremModal] = useState<null | 'transferor' | 'transferee'>(null);
  const [hawb, setHawb] = useState('');
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [cargoChannel, setCargoChannel] = useState(initialCargoChannel || 'Sea');
  const [scheduledDate, setScheduledDate] = useState('');

  const isAir = cargoChannel === 'Air';


  return (
    <div className="flex flex-col bg-[#f8fafd] h-full overflow-hidden">
      {/* Breadcrumb + Agent */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[20px] pb-[6px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[24px] flex flex-col gap-[20px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          {mode === 'amend'
            ? `Amend - ${formatTransferTypeTitle(initialTransferType)}${transferNumber ? ` - ${transferNumber}` : ''}`
            : `New - ${initialTransferType || 'Cargo Transfer'}`}
        </h1>

        {/* Cargo Transfer Type / Cargo Channel / Client Ref */}
        <div className="bg-white rounded-[8px] px-[40px] py-[20px]" style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px] items-start">
            <ReadOnlyField label="Cargo Transfer Type" value={initialTransferType} />
            {/* Cargo Channel — editable select */}
            <div className="relative" style={{ flex: '1 0 200px', minWidth: 200 }}>
              <select value={cargoChannel} onChange={e => setCargoChannel(e.target.value)}
                className="w-full focus:outline-none appearance-none cursor-pointer"
                style={{
                  height: 56, borderRadius: 4, border: '1px solid #d5ddfb',
                  background: '#fff', padding: '0 36px 0 16px',
                  fontSize: 16, color: '#0e1b3d', fontFamily: "'Dubai', sans-serif",
                }}>
                <option value="Sea">Sea</option>
                <option value="Air">Air</option>
                <option value="Land">Land</option>
              </select>
              <label className="absolute pointer-events-none"
                style={{ left: 12, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d', fontFamily: "'Dubai', sans-serif" }}>
                Cargo Channel (inbound)
              </label>
              {/* chevron icon */}
              <svg className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#697498" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <FloatingField label="Client Doc. Ref. Number" required value={clientRef} onChange={setClientRef} placeholder="Enter Ref. Number" />
          </div>
        </div>

        {/* Carrier / MAWB */}
        <div className="bg-white rounded-[8px] px-[40px] py-[20px]" style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
            <SearchPickerField
              label={isAir ? 'Flight Number' : 'Carrier Registration No.(inbound)'} required
              value={carrierReg}
              onChange={v => { setCarrierReg(v); if (!CARRIER_SUGGESTIONS.find(s => s.code === v)) setCarrierVesselName(''); if (!v) setScheduledDate(''); }}
              suggestions={isAir ? [] : CARRIER_SUGGESTIONS}
              onModalOpen={() => isAir ? setShowFlightModal(true) : setShowCarrierModal(true)}
            />
            {isAir && scheduledDate && (
              <ReadOnlyField label="Scheduled Date" value={scheduledDate} />
            )}
            <FloatingField label="MAWB/MBOL No." required value={mawb} onChange={setMawb} placeholder="Enter MAWB / MBOL" />
            {isAir && (
              <FloatingField label="HAWB" value={hawb} onChange={setHawb} placeholder="Enter HAWB" />
            )}
          </div>
        </div>

        {/* Transferor/Transferee Details */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
            Transferor/Transferee Details
          </p>
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
              <SearchPickerField
                label="Transferor Business Code" required
                value={transferorBizCode}
                onChange={setTransferorBizCode}
                suggestions={BIZ_SUGGESTIONS}
                onModalOpen={() => setBizModal('transferor')}
              />
              <SearchPickerField
                label="Transferor Premises Code" required
                value={transferorPremCode}
                onChange={setTransferorPremCode}
                suggestions={PREM_SUGGESTIONS}
                onModalOpen={() => setPremModal('transferor')}
              />
              <SearchPickerField
                label="Transferee Business Code" required
                value={transfereeBizCode}
                onChange={setTransfereeBizCode}
                suggestions={BIZ_SUGGESTIONS}
                onModalOpen={() => setBizModal('transferee')}
              />
              <SearchPickerField
                label="Transferee Premises Code" required
                value={transfereePremCode}
                onChange={setTransfereePremCode}
                suggestions={PREM_SUGGESTIONS}
                onModalOpen={() => setPremModal('transferee')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CarrierVesselModal
        open={showCarrierModal}
        onClose={() => setShowCarrierModal(false)}
        onSelect={(rotNum, vesselName) => { setCarrierReg(rotNum); setCarrierVesselName(vesselName); setShowCarrierModal(false); }}
      />
      <FlightSearchModal
        open={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        onSelect={(flightNo, date) => {
          setCarrierReg(flightNo);
          setScheduledDate(date);
          setCarrierVesselName('');
          setShowFlightModal(false);
        }}
      />
      <BusinessCodeModal
        open={bizModal !== null}
        title={`Search ${bizModal === 'transferor' ? 'Transferor' : 'Transferee'} Business Code`}
        onClose={() => setBizModal(null)}
        onSelect={code => { if (bizModal === 'transferor') setTransferorBizCode(code); else setTransfereeBizCode(code); setBizModal(null); }}
      />
      <PremisesCodeModal
        open={premModal !== null}
        title={`Search ${premModal === 'transferor' ? 'Transferor' : 'Transferee'} Premises Code`}
        onClose={() => setPremModal(null)}
        onSelect={code => { if (premModal === 'transferor') setTransferorPremCode(code); else setTransfereePremCode(code); setPremModal(null); }}
      />

      {/* Bottom navigation */}
      <div className="bg-white flex-shrink-0 flex items-center justify-between px-4 sm:px-10"
        style={{ height: 88, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
        <button onClick={onBack}
          className="flex items-center justify-center hover:bg-[#f0f4ff] transition-colors"
          style={{ height: 48, padding: '0 20px', borderRadius: 4, border: '1px solid #1360d2', background: '#fff', fontFamily: "'Dubai', sans-serif" }}>
          <span className="text-[16px] text-[#1360d2] capitalize" style={{ fontWeight: 500 }}>Back</span>
        </button>
        <button onClick={() => onSave({ clientRef, carrierReg: carrierReg || initialCarrierReg, mawb, transferorBizCode, transferorPremCode, transfereeBizCode, transfereePremCode })}
          className="flex items-center justify-center hover:bg-[#0e4db8] transition-colors"
          style={{ height: 48, padding: '0 40px', borderRadius: 4, background: '#1360d2', fontFamily: "'Dubai', sans-serif" }}>
          <span className="text-[16px] text-white capitalize" style={{ fontWeight: 500 }}>Proceed</span>
        </button>
      </div>

    </div>
  );
}
