import React, { useEffect, useRef, useState } from 'react';
import MoreIcon from './MoreIcon';
import BackToListingBar from './BackToListingBar';
import VccDetailsModal, { type VccDetails } from './VccDetailsModal';
import VccAuditHistoryModal from './VccAuditHistoryModal';
import Dh from './Dh';

const VCC_DETAILS_MAP: Record<string, VccDetails> = {
  '8026932': {
    vccNo: '8026932', printDate: '04/05/2026',
    chassis: 'BHASSIS11', engineNumber: 'ENGINEEN11',
    modelYear: '2010', vehicleDrive: 'Left Hand Drive',
    countryOfOrigin: 'AIRCRAFT STORES', color: 'RED', color1: 'RED', color2: 'BROWN', color3: 'BLACK',
    engineCapacity: '70', carriageCapacity: '2.1',
    passengerCapacity: '4', vehicleModel: 'Aston Martin',
    vehicleBrand: 'ACURAATEISLDFGDLLLDFDLSDFDKKKD', vehicleType: '2WD',
    vccStatus: 'Generated', declarationNumber: '1030001766425',
    declarationDate: '17/10/2025', ownerCode: 'AE-8123187',
    ownerName: 'VIKRAM SINGH CTO GULF DENIM LIMITED(L.L.C)',
    printRemarks: 'GCC Standard',
    specificationStandardName: 'GCC Standard',
    shipmentReferenceNumber: '',
  },
  '8026931': {
    vccNo: '8026931', printDate: '04/05/2026',
    chassis: 'BHASSIS10', engineNumber: 'ENGINEEN10',
    modelYear: '2010', vehicleDrive: 'Left Hand Drive',
    countryOfOrigin: 'AIRCRAFT STORES', color: 'RED', color1: 'RED', color2: 'BROWN', color3: 'BLACK',
    engineCapacity: '70', carriageCapacity: '2.1',
    passengerCapacity: '4', vehicleModel: 'Aston Martin',
    vehicleBrand: 'ACURAATEISLDFGDLLLDFDLSDFDKKKD', vehicleType: '2WD',
    vccStatus: 'Printed/Downloaded', declarationNumber: '1030001766425',
    declarationDate: '17/10/2025', ownerCode: 'AE-8123187',
    ownerName: 'VIKRAM SINGH CTO GULF DENIM LIMITED(L.L.C)',
    printRemarks: 'GCC Standard',
    specificationStandardName: 'GCC Standard',
    shipmentReferenceNumber: '',
  },
};

type Props = { onBack: () => void; requestNumber?: string; status?: string };

const REQUEST_DETAILS: { label: string; value: string }[] = [
  { label: 'Request No.',        value: '213233' },
  { label: 'Request Date',       value: '04-05-2026' },
  { label: 'Declaration No.',    value: '1030001766425' },
  { label: 'Declaration Date',   value: '17-10-2025' },
  { label: 'Declaration Type',   value: 'Re-Export to ROW' },
  { label: 'Request Type',       value: 'New VCC Request' },
  { label: 'Request Status',     value: 'Under Processing' },
  { label: 'Requested For',      value: 'AE-8123187 - VIKRAM SINGH CTO GULF DENIM LIMITED (L.L.C)' },
  { label: 'Requested By',       value: 'AE-8123109 - SWBRO01 M&M Private L.L.C' },
  { label: 'Remarks',            value: '-' },
  { label: 'No. of Vehicle(s)',  value: '2' },
];

type Charge = { ser: string; type: string; mode: string; amount: string; account: string; ref: string };
const CHARGES: Charge[] = [
  { ser: '1', type: 'VCC Charge',                 mode: 'Credit/Debit Account', amount: '60', account: '1051536', ref: 'N-100001575' },
  { ser: '2', type: 'Knowledge-Innovation Dirham', mode: 'Credit/Debit Account', amount: '20', account: '1051536', ref: 'N-100001576' },
];

type Vehicle = { vccNo: string; chassis: string; engine: string; brand: string; make: string; year: string; vccDate: string; status: 'Generated' | 'Printed/Downloaded'; remarks: string; declType: string };
const VEHICLES: Vehicle[] = [
  { vccNo: '8026932', chassis: 'BHASSIS11', engine: 'ENGINEEN11', brand: 'ACURAATEISLDFGDLLLDFDLSDFDKKKD', make: 'Aston Martin', year: '2010', vccDate: '04-05-2026', status: 'Generated',          remarks: 'GCC Standard', declType: 'Re-Export to ROW' },
  { vccNo: '8026931', chassis: 'BHASSIS10', engine: 'ENGINEEN10', brand: 'ACURAATEISLDFGDLLLDFDLSDFDKKKD', make: 'Aston Martin', year: '2010', vccDate: '04-05-2026', status: 'Printed/Downloaded', remarks: 'GCC Standard', declType: 'Export from Local' },
];

const STATUS_STYLE: Record<Vehicle['status'], { bg: string; color: string }> = {
  'Generated':          { bg: 'rgba(40,167,69,0.08)', color: '#28a745' },
  'Printed/Downloaded': { bg: 'rgba(19,96,210,0.08)', color: '#1360d2' },
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[20px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
    {children}
  </p>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col min-w-0 leading-tight" style={{ rowGap: 2 }}>
    <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: '18px' }}>{label}</span>
    <span
      className="text-[16px] text-[#0e1b3d]"
      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, lineHeight: '20px', wordBreak: 'break-word' }}
    >
      {value}
    </span>
  </div>
);

function Checkbox({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="size-[20px] rounded-[4px] flex items-center justify-center transition-colors"
      style={{ border: '2px solid ' + (checked || indeterminate ? '#1360d2' : '#a7abb2'), background: checked || indeterminate ? '#1360d2' : '#fff' }}
    >
      {checked && (
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8l3 3 7-7" />
        </svg>
      )}
      {!checked && indeterminate && (
        <span style={{ display: 'block', width: 10, height: 2, background: '#fff', borderRadius: 1 }} />
      )}
    </button>
  );
}

export default function VccViewRequestPage({ onBack, requestNumber = '25365', status }: Props) {
  const canDownload = !status || status === 'Completed';
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openVccNo, setOpenVccNo] = useState<string | null>(null);
  const [historyVccNo, setHistoryVccNo] = useState<string | null>(null);
  const [actionMenuFor, setActionMenuFor] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionMenuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) setActionMenuFor(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [actionMenuFor]);
  const allChecked  = selected.size === VEHICLES.length;
  const someChecked = selected.size > 0 && !allChecked;
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(VEHICLES.map((v) => v.vccNo)));
  const toggleOne = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const downloadOne = (vccNo: string) => { console.log('Download VCC', vccNo); };
  const downloadSelected = () => { console.log('Download selected VCCs', [...selected]); };
  const downloadAll = () => { console.log('Download all VCCs', VEHICLES.map((v) => v.vccNo)); };
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Integrated Clearance</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>View VCC Details</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px] flex flex-col gap-[24px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          Request #{requestNumber}
        </h1>
        {/* VCC Request Details */}
        <div className="bg-white rounded-[8px] px-[24px] py-[16px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SectionHeading>VCC Request Details</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[20px] gap-y-[10px]">
            {REQUEST_DETAILS.map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
          </div>
        </div>

        {/* Charges and Payment Details */}
        <div className="bg-white rounded-[8px] px-[24px] py-[20px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SectionHeading>Charges and Payment Details</SectionHeading>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
              <thead>
                <tr>
                  {['Collection Ser. No.', 'Charge Type', 'Payment Mode', 'Amount', 'Account No./Cheque No.', 'Receipt or Ref. No.'].map((h, i, arr) => (
                    <th
                      key={h}
                      style={{
                        background: '#a6c2e9', padding: '12px', textAlign: 'left', fontWeight: 500,
                        color: '#000', fontSize: 14, letterSpacing: '0.07px',
                        borderTopLeftRadius: i === 0 ? 6 : 0,
                        borderTopRightRadius: i === arr.length - 1 ? 6 : 0,
                      }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHARGES.map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{c.ser}</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{c.type}</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{c.mode}</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d] inline-flex items-baseline gap-[4px]"><Dh /> {c.amount}</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{c.account}</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{c.ref}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VCC / Vehicle Details */}
        <div className="bg-white rounded-[8px] px-[24px] py-[20px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between flex-wrap gap-[12px] mb-[12px]">
            <SectionHeading>VCC / Vehicle Details</SectionHeading>
            {canDownload && (
            <div className="flex items-center gap-[12px] flex-wrap">
              <button data-secondary-btn
                onClick={downloadSelected}
                disabled={selected.size === 0}
                className="h-[40px] px-[16px] inline-flex items-center gap-[8px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#1360d2] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 14 }}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
                </svg>
                Download Selected{selected.size > 0 ? ` (${selected.size})` : ''}
              </button>
              <button
                onClick={downloadAll}
                className="h-[40px] px-[16px] inline-flex items-center gap-[8px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 14, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
                </svg>
                Download All ({VEHICLES.length})
              </button>
            </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="dt-table" style={{ fontFamily: "'Dubai', sans-serif" }}>
              <thead>
                <tr>
                  <th style={{ width: 48 }}><Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} /></th>
                  {['VCC Number', 'Chassis No.', 'Engine No.', 'Brand', 'Make', 'Model Year', 'VCC Date', 'VCC Status', 'Remarks', 'Action'].map((h) => (
                    <th key={h} className="text-[16px]" style={{ textAlign: h === 'Action' ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VEHICLES.map((v) => {
                  const st = STATUS_STYLE[v.status];
                  const checked = selected.has(v.vccNo);
                  return (
                    <tr key={v.vccNo} className={checked ? 'is-selected' : ''}>
                      <td><Checkbox checked={checked} onChange={() => toggleOne(v.vccNo)} /></td>
                      <td>
                        {canDownload
                          ? <button type="button" onClick={() => setOpenVccNo(v.vccNo)} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{v.vccNo}</button>
                          : <span className="text-[16px] text-[#0e1b3d]">-</span>}
                      </td>
                      <td><span className="text-[16px] text-[#0e1b3d]">{v.chassis}</span></td>
                      <td><span className="text-[16px] text-[#0e1b3d]">{v.engine}</span></td>
                      <td style={{ maxWidth: 320 }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.brand}>{v.brand}</span>
                      </td>
                      <td><span className="text-[16px] text-[#0e1b3d]">{v.make}</span></td>
                      <td><span className="text-[16px] text-[#0e1b3d]">{v.year}</span></td>
                      <td><span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v.vccDate}</span></td>
                      <td>
                        {canDownload
                          ? <span className="text-[16px] font-medium inline-flex items-center justify-center whitespace-nowrap" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}>{v.status}</span>
                          : <span className="text-[16px] text-[#0e1b3d]">-</span>}
                      </td>
                      <td><span className="text-[16px] text-[#0e1b3d]">{v.remarks}</span></td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <div className="relative inline-block" ref={actionMenuFor === v.vccNo ? actionMenuRef : undefined}>
                          <button
                            type="button"
                            onClick={() => setActionMenuFor(actionMenuFor === v.vccNo ? null : v.vccNo)}
                            aria-label={`Actions for VCC ${v.vccNo}`}
                            className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors"
                          >
                            <MoreIcon />
                          </button>
                          {actionMenuFor === v.vccNo && (
                            <div
                              className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                              style={{
                                right: '100%',
                                top: 0,
                                marginRight: 6,
                                width: 200,
                                boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
                                border: '1px solid #f0f0f5',
                              }}
                            >
                              {canDownload && (
                              <button
                                onClick={() => { setActionMenuFor(null); downloadOne(v.vccNo); }}
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              >
                                <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
                                  </svg>
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]">Download VCC</span>
                              </button>
                              )}
                              <button
                                onClick={() => { setActionMenuFor(null); setHistoryVccNo(v.vccNo); }}
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              >
                                <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="10" cy="10" r="7.5" />
                                    <path d="M10 6v4l2.5 2" />
                                  </svg>
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]">Request History</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBack} />

      <VccDetailsModal
        open={openVccNo !== null}
        details={openVccNo ? VCC_DETAILS_MAP[openVccNo] : undefined}
        onClose={() => setOpenVccNo(null)}
      />
      <VccAuditHistoryModal
        open={historyVccNo !== null}
        vccNo={historyVccNo ?? undefined}
        onClose={() => setHistoryVccNo(null)}
      />
    </div>
  );
}
