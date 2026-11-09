import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Pagination from './Pagination';

const font = "'Dubai', sans-serif";

export type BrokerRow = {
  code: string;
  name: string;
  businessTypes: string;
  facilityLocations: string;
};

export type PersonalCustomerRow = {
  code: string;
  name: string;
  docType: string;
  docNo: string;
  docCountry: string;
  mobile: string;
};

/* Mock lookup data — the broker list mirrors the Importer Business Code LOV. */
const BROKERS: BrokerRow[] = [
  { code: 'AE-8123346', name: 'PRASHANTIND', businessTypes: 'Importer(Commercial), e-Commerce', facilityLocations: '' },
  { code: 'AE-8123047', name: 'VIKRAM Kuehne + Nagel & United Parcel Service (UPS)LLC', businessTypes: 'Shipping line Agent, Courier, Broker, Airline Agent, CH (Cargo Handler)', facilityLocations: 'Dubai Airport Freezone' },
  { code: 'AE-8123193', name: 'SWEMCOMMERCIAL and Trading L.L.C 11 VIKRAM', businessTypes: 'Importer(Commercial), Exporter(Commercial), Warehouse', facilityLocations: 'Privare CW SW VIK' },
  { code: 'AE-8123109', name: 'SWBRO01 M&M Private L.L.C', businessTypes: 'Airline Agent, e-Commerce, Courier, Shipping line Agent, Exporter(Commercial), Importer(Commercial), CH (Cargo Handler), Broker', facilityLocations: 'SW BRO FZE DAFZA' },
  { code: 'AE-1019056', name: 'CONSOLIDATED SHIPPING SERVICES L.L.C', businessTypes: 'Broker, Importer(Commercial)', facilityLocations: 'Jebel Ali Freezone' },
  { code: 'AE-9106286', name: 'SW LOGISTICS LLC', businessTypes: 'Broker, Warehouse', facilityLocations: 'Dubai South' },
];

/* Personal customers are looked up by exact code, so the list starts empty. */
const PERSONAL_CUSTOMERS: PersonalCustomerRow[] = [
  { code: 'PC-100244', name: 'AHMED AL MANSOORI', docType: 'Emirates ID', docNo: '784-1988-1234567-1', docCountry: 'United Arab Emirates', mobile: '+971 50 123 4567' },
  { code: 'PC-100318', name: 'SARA KHAN', docType: 'Passport', docNo: 'K4412876', docCountry: 'Pakistan', mobile: '+971 55 987 6543' },
];

type Props = {
  open: boolean;
  variant: 'broker' | 'personal';
  onClose: () => void;
  /** Receives the picked code (and name, when the variant carries one). */
  onSelect: (code: string, name: string) => void;
};

/**
 * Code lookup for the Refund & Claims Claimant Type filter.
 *
 * Two layouts behind one component because they share the chrome but not the form:
 * Broker searches by code *and* name across a business directory, while Personal
 * Customer is an exact-code lookup that opens with nothing listed.
 */
export default function ClaimantCodePickerModal({ open, variant, onClose, onSelect }: Props) {
  const [codeQuery, setCodeQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!open) return;
    setCodeQuery(''); setNameQuery(''); setSearched(false); setPage(1);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const brokerRows = useMemo(() => {
    const c = codeQuery.trim().toLowerCase();
    const n = nameQuery.trim().toLowerCase();
    if (!c && !n) return BROKERS;
    return BROKERS.filter((b) =>
      (!c || b.code.toLowerCase().includes(c)) && (!n || b.name.toLowerCase().includes(n)));
  }, [codeQuery, nameQuery]);

  // Personal Customer only lists results once an exact-ish code has been searched.
  const personalRows = useMemo(() => {
    if (!searched) return [];
    const c = codeQuery.trim().toLowerCase();
    if (!c) return [];
    return PERSONAL_CUSTOMERS.filter((p) => p.code.toLowerCase().includes(c));
  }, [searched, codeQuery]);

  if (!open) return null;

  const isBroker = variant === 'broker';
  const title = isBroker ? 'Broker Code' : 'Personal Customer Code';
  const rows: (BrokerRow | PersonalCustomerRow)[] = isBroker ? brokerRows : personalRows;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  const columns = isBroker
    ? [
        { key: 'code', label: 'Broker Code', w: 150 },
        { key: 'name', label: 'Broker Name', w: 240 },
        { key: 'businessTypes', label: 'Business Types', w: 320 },
        { key: 'facilityLocations', label: 'Facility Locations', w: 200 },
      ]
    : [
        { key: 'code', label: 'Code', w: 130 },
        { key: 'name', label: 'Name', w: 180 },
        { key: 'docType', label: 'ID Doc. Type', w: 150 },
        { key: 'docNo', label: 'ID Doc. No.', w: 180 },
        { key: 'docCountry', label: 'ID Doc Issuing Country', w: 200 },
        { key: 'mobile', label: 'Mobile No.', w: 160 },
      ];

  const searchField = (label: string, value: string, set: (v: string) => void, required = false) => (
    <div className="relative flex-1 min-w-[180px]">
      <input
        type="text"
        value={value}
        onChange={(e) => { set(e.target.value); setPage(1); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setSearched(true); setPage(1); } }}
        placeholder={required ? undefined : label}
        className="h-[56px] w-full border border-[#d5ddfb] rounded-[4px] px-[14px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
        style={{ fontFamily: font }}
      />
      {required && value === '' && (
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] text-[#697498] pointer-events-none" style={{ fontFamily: font }}>
          <span style={{ color: '#e8212e' }}>*</span>{label}
        </span>
      )}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-start justify-center p-[24px] overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0" style={{ background: 'rgba(11,21,52,0.45)' }} onClick={onClose} />
      <div
        className="relative bg-white rounded-[10px] w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 1080, boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        {/* Dark navy header — same treatment as the Declaration Details popup */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[20px] text-white" style={{ fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" /><path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-[24px] py-[24px] flex flex-col gap-[20px]">
          {isBroker ? (
            <>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Search by Broker Name/Code</p>
              <div className="flex flex-wrap items-center gap-[16px]">
                {searchField('Enter Code', codeQuery, setCodeQuery)}
                {searchField('Enter Name', nameQuery, setNameQuery)}
                <button
                  type="button"
                  onClick={() => { setSearched(true); setPage(1); }}
                  className="h-[56px] px-[42px] rounded-[4px] text-[16px] text-white transition-opacity hover:opacity-90 flex-shrink-0"
                  style={{ background: '#1360d2', fontWeight: 500 }}
                >
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-[12px] rounded-[6px] px-[16px] py-[14px]" style={{ background: '#e8f0fb' }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="9" /><path d="M12 11v5" strokeLinecap="round" /><circle cx="12" cy="7.8" r="0.9" fill="#1360d2" stroke="none" />
                </svg>
                <p className="text-[16px] text-[#0e1b3d]">
                  Any change in the existing Personal Customer details should be reported to Customs for update
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-[16px]">
                <div className="flex-1 min-w-[200px] max-w-[340px]">
                  {searchField('Customer Code', codeQuery, setCodeQuery, true)}
                </div>
                <button
                  type="button"
                  onClick={() => { setSearched(true); setPage(1); }}
                  className="h-[56px] px-[42px] rounded-[4px] text-[16px] text-white transition-opacity hover:opacity-90 flex-shrink-0"
                  style={{ background: '#1360d2', fontWeight: 500 }}
                >
                  Search
                </button>
              </div>
            </>
          )}

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: isBroker ? 900 : 1000, fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {columns.map((c) => (
                    <th key={c.key} className="text-left text-[16px] text-[#0e1b3d]" style={{ padding: '12px', fontWeight: 500, width: c.w }}>
                      {c.label}
                    </th>
                  ))}
                  <th className="text-left text-[16px] text-[#0e1b3d]" style={{ padding: '12px', fontWeight: 500, width: 90 }}>
                    {isBroker ? 'Action' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center text-[16px] text-[#697498]" style={{ padding: '36px 12px' }}>
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  visible.map((row) => (
                    <tr key={row.code} style={{ borderBottom: '1px solid #eef1f6' }}>
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={`text-[16px] ${c.key === 'name' ? 'text-[#1360d2]' : 'text-[#0e1b3d]'}`}
                          style={{ padding: '12px', whiteSpace: 'normal', lineHeight: 1.35 }}
                        >
                          {(row as Record<string, string>)[c.key] || ''}
                        </td>
                      ))}
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => { onSelect(row.code, row.name); onClose(); }}
                          className="text-[16px] text-[#1360d2] hover:underline"
                          style={{ fontWeight: 500 }}
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

          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={rows.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
