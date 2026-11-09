import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Pagination from './Pagination';
import BackToListingBar from './BackToListingBar';
import ClaimStepper from './ClaimStepper';
import { DateInput, StatusAsOnBadge } from './DatePicker';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import Dh, { DhAmount } from './Dh';

const font = "'Dubai', sans-serif";

/* ── Shared local field helpers (mirrors BillPaymentPage's Advance-Filters convention) ── */
function floatLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute', left: 12, top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
    background: active ? '#fff' : 'transparent', padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}

function FloatInput({ label, value, onChange, required, placeholder, disabled, textarea }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; disabled?: boolean; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const Tag: any = textarea ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Tag
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={active ? placeholder : ''}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none"
        style={{
          height: textarea ? 84 : 56, padding: textarea ? '12px' : '0 12px', resize: 'none',
          border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, fontFamily: font,
          background: disabled ? '#f0f3fa' : '#fff',
        }}
      />
      <span style={floatLabel(active, focused)}>{required && <span style={{ color: '#dc3545' }}>*</span>}{label}</span>
    </div>
  );
}

function FloatDropdown({ label, value, options, onChange, required, disabled }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = open || value !== '';
  return (
    <div className="relative" ref={ref}>
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] focus:outline-none text-left"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, background: disabled ? '#f0f3fa' : '#fff', cursor: disabled ? 'default' : 'pointer' }}>
        <span className="flex-1 truncate">{value}</span>
        {!disabled && <svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>}
      </button>
      <span style={floatLabel(active, open)}>{required && <span style={{ color: '#dc3545' }}>*</span>}{label}</span>
      {open && !disabled && (
        <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[280px] overflow-y-auto" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === value ? 500 : 400 }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange, bold }: { label: string; checked: boolean; onChange: () => void; bold?: boolean }) {
  return (
    <label className="flex items-center gap-[10px] cursor-pointer" onClick={onChange}>
      <span className="size-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${checked ? '#1360d2' : '#d5ddfb'}`, background: checked ? '#1360d2' : '#fff' }}>
        {checked && <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 10l4 4 8-8" /></svg>}
      </span>
      <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: bold ? 700 : 400 }}>{label}</span>
    </label>
  );
}

/* ── Section / FieldItem / Divider — mirrors RefundDepositsClaimViewPage's view-page convention ── */
function FieldItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 220px', minWidth: 200 }}>
      <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</p>
      <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
        <div className="flex flex-wrap -my-[12px] -mx-[16px]">{children}</div>
      </div>
    </div>
  );
}

/* ── Enums (transcribed field-for-field from the reference spec) ── */
const REQUEST_TYPES = ['Normal', 'Follow up Inspection'];
const LOCATION_TYPES = ['Customs Area', 'Outside Location'];
const STATUSES = ['Draft', 'Submitted', 'Payment Pending', 'Scheduled', 'Completed', 'Cancelled'];
const SUB_STATUSES = ['Auto Confirmed', 'Pending Confirmation', 'Rejected'];
const DATE_TYPES = ['Initiate Date', 'Inspection Date'];
const INSPECTION_CENTRES = ['Jebel Ali Inspection Centre', 'Port Rashid Inspection Centre', 'Al Hamriya Inspection Centre'];
const INSPECTION_SECTIONS = ['Container Yard Section', 'Bonded Warehouse Section', 'General Cargo Section'];
const OUTSIDE_LOCATIONS = ['Al Quoz Industrial Area 3', 'Jebel Ali Free Zone South', 'Ras Al Khor Industrial Area 2', 'Dubai Investment Park 1'];
const SLOT_OPTIONS = ['Morning (08:00 – 12:00)', 'Afternoon (12:00 – 16:00)', 'Evening (16:00 – 20:00)'];
const DOC_TYPES = ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Other'];
const PAYMENT_MODES = ['Credit Account', 'Epay'];
const CREDIT_ACCOUNTS = [
  { id: 'ACC-2026-00175', name: 'Dubai Trade Main Account', balance: 52400 },
  { id: 'ACC-2026-00212', name: 'XCRN Business Account', balance: 18750 },
  { id: 'ACC-2026-00340', name: 'Trade Finance Reserve', balance: 5200 },
];
const FEES = [{ type: 'Inspection Fee', amount: 170 }, { type: 'Knowledge Fee', amount: 20 }];
const GRAND_TOTAL = FEES.reduce((s, f) => s + f.amount, 0);
const DECL_CATEGORIES = ['CDM Declarations', 'Cleared Declaration'] as const;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Draft: { bg: '#f0f3fa', color: '#5a6282' },
  Submitted: { bg: '#e2ebf9', color: '#1360d2' },
  'Payment Pending': { bg: '#fff4e0', color: '#b45309' },
  Scheduled: { bg: '#e2ebf9', color: '#1360d2' },
  Completed: { bg: '#d1f5df', color: '#28a745' },
  Cancelled: { bg: '#fde2e2', color: '#dc3545' },
};

const ACTION_MENU_ITEMS = ['View', 'Amend / Update', 'Cancel', 'Re-schedule', 'Print - Inspection Report', 'Make payment', 'Terms and condition', 'Initiate follow up inspection', 'History'] as const;

function ActionIcon({ label }: { label: string }) {
  const s = { width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (label) {
    case 'View': return <svg viewBox="0 0 24 24" {...s}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'Amend / Update': return <svg viewBox="0 0 24 24" {...s}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
    case 'Cancel': return <svg viewBox="0 0 24 24" {...s}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>;
    case 'Re-schedule': return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>;
    case 'Print - Inspection Report': return <svg viewBox="0 0 24 24" {...s}><path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a1 1 0 011-1h16a1 1 0 011 1v6a1 1 0 01-1 1h-2" /><rect x="6" y="14" width="12" height="7" /></svg>;
    case 'Make payment': return <svg viewBox="0 0 24 24" {...s}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>;
    case 'Terms and condition': return <svg viewBox="0 0 24 24" {...s}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6M9 13h6M9 17h6" /></svg>;
    case 'Initiate follow up inspection': return <svg viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14" /></svg>;
    case 'History': return <svg viewBox="0 0 24 24" {...s}><path d="M3 12a9 9 0 103-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 3" /></svg>;
    default: return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

/* ── Types ── */
type PreferredDate = { date: string; slot: string };
type ContainerRow = { srNo: number; containerNo: string; sealNo: string; remarks: string; preferredDates: PreferredDate[] };
type BookingRow = {
  bookingRefNo: string; declarationNo: string; requestType: string; initiatedDate: string;
  inspectionDate?: string; locationType: string; mobileNo: string; subStatus: string; status: string;
};
type DeclarationRow = { declarationNo: string; cargoChannel: string; requestType: string; regimeType: string; category: typeof DECL_CATEGORIES[number]; remarks: string };

const newPreferredDates = (): PreferredDate[] => Array.from({ length: 5 }, () => ({ date: '', slot: '' }));

/* ── Mock data (transcribed from the reference spec) ── */
const SEED_ROWS: BookingRow[] = [
  { bookingRefNo: '2025-BR-179039', declarationNo: '1010457637625', requestType: 'Normal', initiatedDate: '12-Aug-26', locationType: 'Customs Area', mobileNo: '503788405', subStatus: 'Auto Confirmed', status: 'Submitted' },
  { bookingRefNo: '2025-BR-179040', declarationNo: '1010457637626', requestType: 'Follow up Inspection', initiatedDate: '10-Aug-26', locationType: 'Outside Location', mobileNo: '503788406', subStatus: 'Pending Confirmation', status: 'Payment Pending' },
  { bookingRefNo: '2025-BR-179041', declarationNo: '1010457637627', requestType: 'Normal', initiatedDate: '08-Aug-26', inspectionDate: '11-Aug-26', locationType: 'Customs Area', mobileNo: '503788407', subStatus: 'Auto Confirmed', status: 'Scheduled' },
  { bookingRefNo: '2025-BR-179042', declarationNo: '1010457637628', requestType: 'Normal', initiatedDate: '02-Aug-26', inspectionDate: '05-Aug-26', locationType: 'Customs Area', mobileNo: '503788408', subStatus: 'Auto Confirmed', status: 'Completed' },
  { bookingRefNo: '2025-BR-179043', declarationNo: '1010457637629', requestType: 'Normal', initiatedDate: '28-Jul-26', locationType: 'Outside Location', mobileNo: '503788409', subStatus: 'Rejected', status: 'Cancelled' },
  { bookingRefNo: '2025-BR-DRAFT01', declarationNo: '1010457637630', requestType: 'Normal', initiatedDate: '—', locationType: 'Customs Area', mobileNo: '503788410', subStatus: '—', status: 'Draft' },
  { bookingRefNo: '2025-BR-179044', declarationNo: '1010457637631', requestType: 'Normal', initiatedDate: '13-Aug-26', locationType: 'Customs Area', mobileNo: '503788411', subStatus: 'Auto Confirmed', status: 'Submitted' },
  { bookingRefNo: '2025-BR-179045', declarationNo: '1010457637632', requestType: 'Follow up Inspection', initiatedDate: '14-Aug-26', inspectionDate: '16-Aug-26', locationType: 'Customs Area', mobileNo: '503788412', subStatus: 'Auto Confirmed', status: 'Scheduled' },
  { bookingRefNo: '2025-BR-179046', declarationNo: '1010457637635', requestType: 'Normal', initiatedDate: '15-Aug-26', locationType: 'Outside Location', mobileNo: '503788413', subStatus: 'Pending Confirmation', status: 'Payment Pending' },
  { bookingRefNo: '2025-BR-179047', declarationNo: '1010457637636', requestType: 'Normal', initiatedDate: '16-Aug-26', locationType: 'Customs Area', mobileNo: '503788414', subStatus: 'Auto Confirmed', status: 'Submitted' },
  { bookingRefNo: '2025-BR-179048', declarationNo: '1010457637637', requestType: 'Normal', initiatedDate: '17-Aug-26', locationType: 'Customs Area', mobileNo: '503788415', subStatus: '—', status: 'Draft' },
  { bookingRefNo: '2025-BR-179139', declarationNo: '1010457637726', requestType: 'Normal', initiatedDate: '11-Aug-26', inspectionDate: '13-Aug-26', locationType: 'Customs Area', mobileNo: '503788505', subStatus: 'Auto Confirmed', status: 'Completed' },
  { bookingRefNo: '2025-BR-179140', declarationNo: '1010457637727', requestType: 'Normal', initiatedDate: '09-Aug-26', locationType: 'Outside Location', mobileNo: '503788506', subStatus: 'Pending Confirmation', status: 'Payment Pending' },
  { bookingRefNo: '2025-BR-179141', declarationNo: '1010457637728', requestType: 'Follow up Inspection', initiatedDate: '07-Aug-26', inspectionDate: '10-Aug-26', locationType: 'Customs Area', mobileNo: '503788507', subStatus: 'Auto Confirmed', status: 'Scheduled' },
  { bookingRefNo: '2025-BR-179142', declarationNo: '1010457637729', requestType: 'Normal', initiatedDate: '01-Aug-26', inspectionDate: '04-Aug-26', locationType: 'Customs Area', mobileNo: '503788508', subStatus: 'Auto Confirmed', status: 'Completed' },
  { bookingRefNo: '2025-BR-179143', declarationNo: '1010457637730', requestType: 'Normal', initiatedDate: '27-Jul-26', locationType: 'Outside Location', mobileNo: '503788509', subStatus: 'Rejected', status: 'Cancelled' },
  { bookingRefNo: '2025-BR-179144', declarationNo: '1010457637733', requestType: 'Normal', initiatedDate: '12-Aug-26', locationType: 'Customs Area', mobileNo: '503788510', subStatus: 'Auto Confirmed', status: 'Submitted' },
  { bookingRefNo: '2025-BR-179145', declarationNo: '1010457637734', requestType: 'Normal', initiatedDate: '14-Aug-26', inspectionDate: '17-Aug-26', locationType: 'Customs Area', mobileNo: '503788511', subStatus: 'Auto Confirmed', status: 'Scheduled' },
  { bookingRefNo: '2025-BR-179146', declarationNo: '1010457637736', requestType: 'Normal', initiatedDate: '15-Aug-26', locationType: 'Outside Location', mobileNo: '503788512', subStatus: 'Pending Confirmation', status: 'Payment Pending' },
  { bookingRefNo: '2025-BR-179148', declarationNo: '1010457637739', requestType: 'Normal', initiatedDate: '17-Aug-26', locationType: 'Customs Area', mobileNo: '503788514', subStatus: '—', status: 'Draft' },
];

const ELIGIBLE_DECLS: DeclarationRow[] = [
  { declarationNo: '1010457637625', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Import', category: 'CDM Declarations', remarks: 'Container discharged — pending physical inspection.' },
  { declarationNo: '1010457637631', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Import', category: 'CDM Declarations', remarks: 'Flagged for random inspection by risk engine.' },
  { declarationNo: '1010457637632', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Export', category: 'CDM Declarations', remarks: 'Declared goods description requires verification.' },
  { declarationNo: '1010457637626', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Import', category: 'Cleared Declaration', remarks: 'Cleared — no outstanding remarks.' },
  { declarationNo: '1010457637633', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Export', category: 'Cleared Declaration', remarks: 'Cleared — no outstanding remarks.' },
  { declarationNo: '1010457637634', cargoChannel: 'Sea', requestType: 'New', regimeType: 'Import', category: 'Cleared Declaration', remarks: 'Cleared with condition — see attached certificate.' },
];

/* Declaration detail — one seeded record, everything else falls back to a plausible default. */
const DECLARATION_DETAIL: Record<string, {
  version: number; type: string; declarationType: string; cargoChannel: string; regimeType: string; permit: string;
  declarationStatus: string; declarationDate: string; carrierRegistrationNo: string; customerType: string;
  customerCodeName: string; importerCode: string; totalQuantity: string; totalWeight: string; volume: string; totalPackages: string;
  containers: { containerNo: string; containerType: string; sealNo: string; loadingStatus: string }[];
}> = {
  '1010457637625': {
    version: 1, type: 'Import Statistical', declarationType: 'New Customs Clearance Request', cargoChannel: 'Sea',
    regimeType: 'Import for Local Consumption', permit: 'Yes', declarationStatus: 'Completed', declarationDate: '10-Aug-26',
    carrierRegistrationNo: 'PGH658916794', customerType: 'Importer', customerCodeName: 'AE-1019056 / Dubai Customs Test LLC',
    importerCode: 'AE-9106286', totalQuantity: '50', totalWeight: '2,500 Kg', volume: '34 m³', totalPackages: '10',
    containers: [
      { containerNo: 'CTR11713117', containerType: '40 HC', sealNo: 'SL-09877', loadingStatus: 'FCL' },
      { containerNo: 'CTR11713147', containerType: '20 GP', sealNo: 'SL-09878', loadingStatus: 'FCL' },
      { containerNo: 'CTR11713137', containerType: '40 HC', sealNo: 'SL-09879', loadingStatus: 'FCL' },
      { containerNo: 'CTR11713127', containerType: '20 GP', sealNo: 'SL-09880', loadingStatus: 'FCL' },
    ],
  },
};
const declarationDetailFor = (declarationNo: string) => DECLARATION_DETAIL[declarationNo] ?? {
  version: 1, type: 'Import Statistical', declarationType: 'New Customs Clearance Request', cargoChannel: 'Sea',
  regimeType: 'Import for Local Consumption', permit: 'Yes', declarationStatus: 'Completed', declarationDate: '—',
  carrierRegistrationNo: '—', customerType: 'Importer', customerCodeName: 'AE-1019056 / Dubai Customs Test LLC',
  importerCode: 'AE-9106286', totalQuantity: '—', totalWeight: '—', volume: '—', totalPackages: '—', containers: [],
};

/* Booking detail — one seeded record, everything else derived from the listing row. */
const BOOKING_DETAIL: Record<string, {
  inspectionLocationType: string; outsideLocation: string; address: string; contactEmail: string; representativeName: string;
  contactNumber: string; mobileNumber: string; initiationDate: string; declarantRefNo: string; ownerName: string;
  inspectionCentre: string; inspectionSection: string; requestType: string; followUpRequired: boolean; followUpCentre: string;
  followUpSection: string; stampingRequired: boolean; sealRequired: boolean; quantityOfSeals: string;
  containers: { containerNo: string; marksAndNumbers: string; preferredDate1: string; preferredSlot1: string; additionalPreferredSlot: string; preferredDate2: string; preferredSlot2: string; preferredDate3: string; preferredSlot3: string }[];
  attachments: { name: string; uploadedOn: string; uploadedBy: string }[];
  notes: { by: string; date: string; text: string }[];
  paymentHistory: { date: string; mode: string; amount: string; status: string; receiptNo: string }[];
  documents: { name: string; type: string; uploadedOn: string }[];
}> = {
  '2025-BR-179039': {
    inspectionLocationType: 'Customs Area', outsideLocation: '', address: '', contactEmail: 'apar.bhanuchand@dubaicustoms.ae',
    representativeName: 'Inspection Test user', contactNumber: '971-56-7643461', mobileNumber: '971565655124',
    initiationDate: '15-Apr-25', declarantRefNo: 'Veeru Inspection', ownerName: 'UATReport.LLC',
    inspectionCentre: 'Jebel Ali and Tecom', inspectionSection: 'CFS', requestType: 'Normal', followUpRequired: false,
    followUpCentre: '', followUpSection: '', stampingRequired: false, sealRequired: false, quantityOfSeals: '',
    containers: [
      { containerNo: 'CTR11713117', marksAndNumbers: '—', preferredDate1: '24-Jun-26', preferredSlot1: 'Morning (00:00:00–23:59:59)', additionalPreferredSlot: '—', preferredDate2: '—', preferredSlot2: '—', preferredDate3: '—', preferredSlot3: '—' },
      { containerNo: 'CTR11713147', marksAndNumbers: '—', preferredDate1: '24-Jun-26', preferredSlot1: 'Morning (00:00:00–23:59:59)', additionalPreferredSlot: '—', preferredDate2: '—', preferredSlot2: '—', preferredDate3: '—', preferredSlot3: '—' },
    ],
    attachments: [
      { name: 'Packing_List.pdf', uploadedOn: '15-Apr-25 09:20', uploadedBy: 'UATReport.LLC' },
      { name: 'Commercial_Invoice.pdf', uploadedOn: '15-Apr-25 09:21', uploadedBy: 'UATReport.LLC' },
    ],
    notes: [{ by: 'UATReport.LLC', date: '15-Apr-25 09:22', text: 'All containers ready at Jebel Ali yard for inspection.' }],
    paymentHistory: [{ date: '15-Apr-25 09:25', mode: 'Credit Account', amount: 'AED 190.00', status: 'Completed', receiptNo: 'RCPT-2025-88213' }],
    documents: [{ name: 'Inspection_Request_Form.pdf', type: 'Request Form', uploadedOn: '15-Apr-25 09:20' }],
  },
};
const bookingDetailFor = (row: BookingRow) => BOOKING_DETAIL[row.bookingRefNo] ?? {
  inspectionLocationType: row.locationType, outsideLocation: '', address: '', contactEmail: '—', representativeName: '—',
  contactNumber: '—', mobileNumber: row.mobileNo, initiationDate: row.initiatedDate, declarantRefNo: '—',
  ownerName: 'XCRN BUSINESS NEW01', inspectionCentre: INSPECTION_CENTRES[0], inspectionSection: INSPECTION_SECTIONS[0],
  requestType: row.requestType, followUpRequired: row.requestType === 'Follow up Inspection', followUpCentre: '',
  followUpSection: '', stampingRequired: false, sealRequired: false, quantityOfSeals: '',
  containers: [] as { containerNo: string; marksAndNumbers: string; preferredDate1: string; preferredSlot1: string; additionalPreferredSlot: string; preferredDate2: string; preferredSlot2: string; preferredDate3: string; preferredSlot3: string }[],
  attachments: [] as { name: string; uploadedOn: string; uploadedBy: string }[],
  notes: [] as { by: string; date: string; text: string }[],
  paymentHistory: [] as { date: string; mode: string; amount: string; status: string; receiptNo: string }[],
  documents: [] as { name: string; type: string; uploadedOn: string }[],
};

/* History timeline, derived from a row's current status (mirrors the reference's derivation). */
function historyFor(row: BookingRow): { label: string; date: string }[] {
  const steps: { label: string; date: string }[] = [];
  if (row.status === 'Draft') { steps.push({ label: 'Booking Saved as Draft', date: row.initiatedDate }); return steps; }
  steps.push({ label: 'Booking Initiated', date: row.initiatedDate });
  steps.push({ label: 'Submitted for Review', date: row.initiatedDate });
  if (row.status === 'Cancelled') { steps.push({ label: 'Request Cancelled', date: row.initiatedDate }); return steps; }
  steps.push({ label: `Payment ${row.status === 'Payment Pending' ? 'Awaited' : 'Confirmed'}`, date: row.initiatedDate });
  if (row.status === 'Payment Pending') return steps;
  steps.push({ label: 'Inspection Scheduled', date: row.inspectionDate ?? row.initiatedDate });
  if (row.status === 'Completed') steps.push({ label: 'Inspection Completed', date: row.inspectionDate ?? row.initiatedDate });
  return steps;
}

const CARGO_INSPECTION_STEPS: { id: string; label: string }[] = [
  { id: 'eligible', label: 'Eligible Declarations' },
  { id: 'details', label: 'Booking Details' },
  { id: 'documents', label: 'Document Upload' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

/* ── Result-screen shell — icon circle + heading + body + button row (mirrors the reference's shared shell) ── */
function ResultShell({ icon, iconBg, heading, headingColor, children, buttons }: {
  icon: React.ReactNode; iconBg: string; heading: string; headingColor: string; children: React.ReactNode; buttons: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
      <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
        <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: iconBg }}>{icon}</div>
        <p className="text-[22px] text-center" style={{ color: headingColor, fontFamily: font, fontWeight: 700 }}>{heading}</p>
        {children}
        <div className="flex items-center gap-[12px] flex-wrap justify-center">{buttons}</div>
      </div>
    </div>
  );
}
const ResultPrimaryBtn = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="h-[46px] px-[22px] rounded-[4px] text-[15px] text-white flex items-center gap-[8px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>{children}</button>
);
const ResultSecondaryBtn = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="h-[46px] px-[22px] rounded-[4px] text-[15px] text-[#1360d2] bg-white flex items-center gap-[8px]" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>{children}</button>
);

type Step = 'list' | 'eligible' | 'details' | 'documents' | 'payment' | 'review' | 'success' | 'paymentPending' | 'paymentProcessing' | 'paymentFailed' | 'view' | 'declaration';

export default function CargoInspectionPage({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { agent } = useParams<{ agent?: string }>();
  const handleHome = () => { onBack(); navigate(`/landing/${agent ?? 'trader'}`); };

  const [step, setStep] = useState<Step>('list');
  const [rows, setRows] = useState<BookingRow[]>(SEED_ROWS);

  /* ── Listing state ── */
  const [toolbarTab, setToolbarTab] = useState<'all' | 'epay'>('all');
  const [searchType, setSearchType] = useState<'bookingRefNo' | 'declarationNo'>('bookingRefNo');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAdvFilters, setShowAdvFilters] = useState(false);
  const [afDeclNo, setAfDeclNo] = useState('');
  const [afBookingRef, setAfBookingRef] = useState('');
  const [afRequestType, setAfRequestType] = useState('');
  const [afLocationType, setAfLocationType] = useState('');
  const [afStatus, setAfStatus] = useState('');
  const [afSubStatus, setAfSubStatus] = useState('');
  const [afDateType, setAfDateType] = useState('');
  const [afFromDate, setAfFromDate] = useState('');
  const [afToDate, setAfToDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<{ declNo: string; bookingRef: string; requestType: string; locationType: string; status: string; subStatus: string }>({ declNo: '', bookingRef: '', requestType: '', locationType: '', status: '', subStatus: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookingRow | null>(null);
  const [historyTarget, setHistoryTarget] = useState<BookingRow | null>(null);
  const [epayBookingRef, setEpayBookingRef] = useState('');

  const tb = useTableBehaviors();
  const LISTING_HEADERS: { label: string; w: number }[] = [
    { label: 'Booking Ref.No', w: 170 }, { label: 'Declaration No', w: 170 }, { label: 'Request Type', w: 160 },
    { label: 'Initiated Date', w: 130 }, { label: 'Location Type', w: 150 }, { label: 'Mobile No', w: 130 },
    { label: 'Sub status', w: 170 },
  ];
  const BOOKING_COL_DEFS: ColDef[] = LISTING_HEADERS.map(h => ({ key: h.label, label: h.label }));
  const BOOKING_LOCKED_COLS: ColDef[] = [{ key: 'Status', label: 'Status' }, { key: 'Actions', label: 'Actions' }];
  const [bookingVisibleCols, setBookingVisibleCols] = useState<string[]>(() => BOOKING_COL_DEFS.map(c => c.key));
  const [showColModal, setShowColModal] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [statusFromDate, setStatusFromDate] = useState('2026-08-01');
  const [statusToDate, setStatusToDate] = useState('2026-08-26');
  const orderedHeaders = LISTING_HEADERS.filter(h => bookingVisibleCols.includes(h.label));
  const tableMinWidth = orderedHeaders.reduce((s, h) => s + h.w, 0) + 140 + 80 + 24;
  const statusW = 140;
  const actionsW = 80;

  const applyFilters = () => { setAppliedFilters({ declNo: afDeclNo, bookingRef: afBookingRef, requestType: afRequestType, locationType: afLocationType, status: afStatus, subStatus: afSubStatus }); setPage(1); };
  const resetFilters = () => {
    setAfDeclNo(''); setAfBookingRef(''); setAfRequestType(''); setAfLocationType(''); setAfStatus(''); setAfSubStatus(''); setAfDateType(''); setAfFromDate(''); setAfToDate('');
    setAppliedFilters({ declNo: '', bookingRef: '', requestType: '', locationType: '', status: '', subStatus: '' });
    setPage(1);
  };

  const filteredRows = rows.filter(r => showDrafts ? r.status === 'Draft' : r.status !== 'Draft').filter(r => {
    if (searchQuery.trim()) {
      const v = searchType === 'bookingRefNo' ? r.bookingRefNo : r.declarationNo;
      if (!v.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
    }
    if (statusFilter && r.status !== statusFilter) return false;
    if (appliedFilters.declNo && !r.declarationNo.includes(appliedFilters.declNo)) return false;
    if (appliedFilters.bookingRef && !r.bookingRefNo.includes(appliedFilters.bookingRef)) return false;
    if (appliedFilters.requestType && r.requestType !== appliedFilters.requestType) return false;
    if (appliedFilters.locationType && r.locationType !== appliedFilters.locationType) return false;
    if (appliedFilters.status && r.status !== appliedFilters.status) return false;
    if (appliedFilters.subStatus && r.subStatus !== appliedFilters.subStatus) return false;
    return true;
  });
  const epayRows = epayBookingRef ? filteredRows.filter(r => r.bookingRefNo === epayBookingRef) : filteredRows;
  const visibleRows = toolbarTab === 'epay' ? epayRows : filteredRows;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const curPage = Math.min(page, totalPages);
  const paginatedRows = visibleRows.slice((curPage - 1) * pageSize, curPage * pageSize);

  /* ── Eligible declarations state ── */
  const [declCategory, setDeclCategory] = useState<typeof DECL_CATEGORIES[number]>('CDM Declarations');
  const [declSearch, setDeclSearch] = useState('');
  const [selectedDeclNos, setSelectedDeclNos] = useState<Set<string>>(new Set());
  const filteredDecls = ELIGIBLE_DECLS.filter(d => d.category === declCategory && (!declSearch.trim() || d.declarationNo.includes(declSearch.trim())));
  /* Single-select (radio) — picking a declaration replaces any prior selection. */
  const toggleDecl = (d: DeclarationRow) => setSelectedDeclNos(s => s.has(d.declarationNo) ? new Set() : new Set([d.declarationNo]));

  /* ── Wizard state ── */
  const [wizBookingRef] = useState(() => `2025-BR-${179100 + Math.floor(Math.random() * 800)}`);
  const [wizDeclRef] = useState(() => `DREF-${4400000 + Math.floor(Math.random() * 9000)}`);
  const [wizInitiatedDate] = useState('17-Aug-26');
  const [inspectionCentre, setInspectionCentre] = useState('');
  const [inspectionSection, setInspectionSection] = useState('');
  const [locationType, setLocationType] = useState('');
  const [outsideLocation, setOutsideLocation] = useState('');
  const [outsideLocationPickerOpen, setOutsideLocationPickerOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [repName, setRepName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpCentre, setFollowUpCentre] = useState('');
  const [followUpSection, setFollowUpSection] = useState('');
  const [stampingRequired, setStampingRequired] = useState(false);
  const [sealRequired, setSealRequired] = useState(false);
  const [qtySeals, setQtySeals] = useState('');
  const [containerForm, setContainerForm] = useState({ containerNo: '', sealNo: '', remarks: '', preferredDates: newPreferredDates() });
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [editingSrNo, setEditingSrNo] = useState<number | null>(null);
  const [expandedContainers, setExpandedContainers] = useState<Set<number>>(new Set());
  const selectedDeclList = Array.from(selectedDeclNos);

  const addOrUpdateContainer = () => {
    if (!containerForm.containerNo.trim()) return;
    if (editingSrNo != null) {
      setContainers(cs => cs.map(c => c.srNo === editingSrNo ? { ...containerForm, srNo: editingSrNo } : c));
      setEditingSrNo(null);
    } else {
      setContainers(cs => [...cs, { ...containerForm, srNo: cs.length + 1 }]);
    }
    setContainerForm({ containerNo: '', sealNo: '', remarks: '', preferredDates: newPreferredDates() });
  };
  const editContainer = (c: ContainerRow) => { setContainerForm({ containerNo: c.containerNo, sealNo: c.sealNo, remarks: c.remarks, preferredDates: c.preferredDates }); setEditingSrNo(c.srNo); };
  const removeContainer = (srNo: number) => setContainers(cs => cs.filter(c => c.srNo !== srNo));
  const toggleExpanded = (srNo: number) => setExpandedContainers(s => { const n = new Set(s); n.has(srNo) ? n.delete(srNo) : n.add(srNo); return n; });
  const setPreferredDate = (srNo: number, idx: number, field: 'date' | 'slot', value: string) =>
    setContainers(cs => cs.map(c => c.srNo !== srNo ? c : { ...c, preferredDates: c.preferredDates.map((pd, i) => i === idx ? { ...pd, [field]: value } : pd) }));

  /* ── Document upload state ── */
  type UploadedDoc = { id: string; name: string; declNo: string; docType: string };
  const [docDeclNo, setDocDeclNo] = useState('');
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [docRemarks, setDocRemarks] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  useEffect(() => { if (step === 'documents' && !docDeclNo && selectedDeclList.length > 0) setDocDeclNo(selectedDeclList[0]); }, [step]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleFileSelect = (files: FileList | null) => {
    if (!files || !docDeclNo) return;
    setUploadedDocs(ds => [...ds, ...Array.from(files).map(f => ({ id: `${Date.now()}-${f.name}`, name: f.name, declNo: docDeclNo, docType }))]);
  };

  /* ── Payment state ── */
  const [paymentMode, setPaymentMode] = useState('Credit Account');
  const [creditAccountId, setCreditAccountId] = useState(CREDIT_ACCOUNTS[0].id);
  const selectedAccount = CREDIT_ACCOUNTS.find(a => a.id === creditAccountId) ?? null;

  /* ── Detail / declaration view state ── */
  const [viewRow, setViewRow] = useState<BookingRow | null>(null);
  const [viewTab, setViewTab] = useState<'Goods Details' | 'Attachments' | 'Notes' | 'Payment History' | 'Document' | 'Groups'>('Goods Details');
  const [viewDeclSelected, setViewDeclSelected] = useState<Set<string>>(new Set());
  const [declarationNoOpen, setDeclarationNoOpen] = useState('');

  const resetWizard = () => {
    setSelectedDeclNos(new Set()); setInspectionCentre(''); setInspectionSection(''); setLocationType(''); setOutsideLocation(''); setAddress('');
    setContactEmail(''); setRepName(''); setContactNumber(''); setMobileNumber(''); setFollowUpRequired(false); setFollowUpCentre(''); setFollowUpSection('');
    setStampingRequired(false); setSealRequired(false); setQtySeals(''); setContainers([]); setContainerForm({ containerNo: '', sealNo: '', remarks: '', preferredDates: newPreferredDates() });
    setDocDeclNo(''); setDocRemarks({}); setUploadedDocs([]); setPaymentMode('Credit Account'); setCreditAccountId(CREDIT_ACCOUNTS[0].id);
  };
  const backToListing = () => { resetWizard(); setStep('list'); };

  const submitBooking = () => {
    const status = paymentMode === 'Epay' ? 'Payment Pending' : 'Submitted';
    const newRow: BookingRow = {
      bookingRefNo: wizBookingRef, declarationNo: selectedDeclList[0] ?? '—', requestType: followUpRequired ? 'Follow up Inspection' : 'Normal',
      initiatedDate: wizInitiatedDate, locationType: locationType || 'Customs Area', mobileNo: mobileNumber || '—',
      subStatus: 'Auto Confirmed', status,
    };
    setRows(rs => [newRow, ...rs]);
    setStep(status === 'Payment Pending' ? 'paymentPending' : 'success');
  };

  /* ── Breadcrumb (mirrors BillPaymentPage's Breadcrumb convention) ── */
  const Breadcrumb = ({ extra }: { extra?: string }) => (
    <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap flex-shrink-0" style={{ fontFamily: font }}>
      <span className="text-[16px] text-[#8f94ae] cursor-pointer hover:underline" onClick={onBack}>Home</span>
      <span className="text-[16px] text-[#dc3545]">/</span>
      <span className="text-[16px] text-[#8f94ae] cursor-pointer hover:underline" onClick={backToListing}>Cargo Inspection</span>
      {extra && <><span className="text-[16px] text-[#dc3545]">/</span><span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>{extra}</span></>}
      <div className="flex-1" />
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]">AE-1051144-XCRN BUSINESS NEW01</span>
      </div>
    </div>
  );

  /* ══════════════════════════ Listing ══════════════════════════ */
  const renderList = () => (
    <>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Inspection</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[12px]">
        {/* Row 1: search / filters toolbar */}
        <div className="flex items-center gap-[12px] flex-wrap">
          <button type="button" onClick={() => setShowAdvFilters(o => !o)} className={`flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border text-[16px] flex-shrink-0 ${showAdvFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#000]'}`} style={{ fontFamily: font }}>
            Advanced Filters
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg>
          </button>
          <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[240px] max-w-[440px] relative">
            <button type="button" onClick={() => setSearchTypeOpen(o => !o)} className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full flex-shrink-0 hover:bg-[#f7faff]">
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap">{searchType === 'bookingRefNo' ? 'Booking Ref. No' : 'Declaration No'}</span>
              <svg viewBox="0 0 24 24" className={`size-[16px] text-[#1360d2] transition-transform ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} placeholder={`Search ${searchType === 'bookingRefNo' ? 'Booking Ref. No' : 'Declaration No'}`}
              className="flex-1 min-w-0 px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]" style={{ fontFamily: font }} />
            {searchTypeOpen && (
              <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px]" style={{ minWidth: 190, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                {(['bookingRefNo', 'declarationNo'] as const).map(t => (
                  <button key={t} onClick={() => { setSearchType(t); setSearchTypeOpen(false); setSearchQuery(''); }} className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]" style={{ color: t === searchType ? '#1360d2' : '#0e1b3d', fontFamily: font }}>{t === 'bookingRefNo' ? 'Booking Ref. No' : 'Declaration No'}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <button type="button" onClick={() => setStatusOpen(o => !o)} className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff]">
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap">{statusFilter ?? 'Status'}</span>
              <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${statusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {statusOpen && (
              <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px]" style={{ minWidth: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                <button onClick={() => { setStatusFilter(null); setStatusOpen(false); setPage(1); }} className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]" style={{ color: statusFilter === null ? '#1360d2' : '#0e1b3d', fontFamily: font }}>All statuses</button>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }} className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]" style={{ color: s === statusFilter ? '#1360d2' : '#0e1b3d', fontFamily: font }}>{s}</button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2] flex-shrink-0" style={{ fontFamily: font }}>
            Need Help
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
          </button>
          <div className="flex-1" />
          <button onClick={() => setStep('eligible')} className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 flex items-center gap-[8px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Initiate Inspection
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Row 2: record-type toggle + status date range + drafts + columns */}
        <div className="flex items-center gap-[12px] flex-wrap">
          <div className="bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] flex-shrink-0" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
            {(['all', 'epay'] as const).map(t => (
              <button key={t} onClick={() => { setToolbarTab(t); if (t === 'all') setEpayBookingRef(''); }}
                className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors ${toolbarTab === t ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'}`}
                style={{ fontFamily: font }}>{t === 'all' ? 'All Records' : 'E-Payment'}</button>
            ))}
          </div>

          <div className="flex justify-center basis-full lg:basis-auto lg:flex-1">
            <StatusAsOnBadge fromValue={statusFromDate} toValue={statusToDate}
              onApply={(from, to) => { setStatusFromDate(from); setStatusToDate(to); }} />
          </div>

          <div className="flex items-center gap-[8px] flex-shrink-0">
            <button
              onClick={() => { setShowDrafts(d => !d); setPage(1); }}
              className={`relative w-[48px] h-[28px] rounded-full transition-colors ${showDrafts ? 'bg-[#1360d2]' : 'bg-[#e2ebf9]'}`}
            >
              <div className={`absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${showDrafts ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
            </button>
            <span className="text-[16px] text-[#0e1b3d] font-medium whitespace-nowrap" style={{ fontFamily: font }}>Drafts</span>
          </div>

          <button
            onClick={() => setShowColModal(true)}
            className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-white border border-[#d5ddfb] text-[#1360d2] text-[16px] font-medium flex-shrink-0"
            style={{ fontFamily: font, boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
              <rect x="2" y="3" width="4" height="14" rx="1" />
              <rect x="8" y="3" width="4" height="14" rx="1" />
              <rect x="14" y="3" width="4" height="14" rx="1" />
            </svg>
            Columns
          </button>
        </div>

        {/* Row 3: Advanced Filters — fields inline in one grid row, Apply/Reset at the end */}
        {showAdvFilters && (
          <div className="bg-white rounded-[8px] p-[20px] flex-shrink-0" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
            <div className="flex items-center justify-between mb-[16px]">
              <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advanced Filters</span>
              <button onClick={() => setShowAdvFilters(false)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] text-[#697498] hover:text-[#0e1b3d]">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <FloatInput label="Declaration No" value={afDeclNo} onChange={setAfDeclNo} />
              <FloatInput label="Booking Ref. No" value={afBookingRef} onChange={setAfBookingRef} />
              <FloatDropdown label="Request Type" value={afRequestType} onChange={setAfRequestType} options={REQUEST_TYPES} />
              <FloatDropdown label="Location Type" value={afLocationType} onChange={setAfLocationType} options={LOCATION_TYPES} />
              <FloatDropdown label="Status" value={afStatus} onChange={setAfStatus} options={STATUSES} />
              <FloatDropdown label="Sub status" value={afSubStatus} onChange={setAfSubStatus} options={SUB_STATUSES} />
              <FloatDropdown label="Date Type" value={afDateType} onChange={setAfDateType} options={DATE_TYPES} />
              <DateInput label="From date" value={afFromDate} onChange={setAfFromDate} />
              <DateInput label="To date" value={afToDate} onChange={setAfToDate} />
              <div className="flex items-center gap-[10px]">
                <button onClick={resetFilters} data-secondary-btn className="h-[56px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white flex-shrink-0" style={{ fontFamily: font }}>Reset</button>
                <button onClick={applyFilters} className="h-[56px] px-5 rounded-[4px] text-[15px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* Table — Integrated Clearance conventions: Columns-modal configuration, Status
            and Actions locked as the last two sticky columns, borderSpacing row grouping. */}
        <div style={{ position: 'relative' }}>
          <ScrollArrows atStart={tb.atScrollStart} atEnd={tb.atScrollEnd} onLeft={tb.scrollToStart} onRight={tb.scrollToEnd} stickyWidth={statusW + actionsW} />
          <div ref={tb.scrollRef} onScroll={tb.handleScroll} className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
              <thead>
                <tr>
                  {orderedHeaders.map((col, idx) => (
                    <th key={col.label}
                      style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 12 }}>
                      <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{col.label}</span>
                    </th>
                  ))}
                  {/* STICKY: Status */}
                  <th style={{ position: 'sticky', right: actionsW, width: statusW, minWidth: statusW, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                    <span className="text-[16px] font-medium text-[#051937]">Status</span>
                  </th>
                  {/* STICKY: Actions */}
                  <th style={{ position: 'sticky', right: 0, width: actionsW, minWidth: actionsW, background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', fontWeight: 500, zIndex: 2, borderRadius: '0 8px 0 0' }}>
                    <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr><td colSpan={orderedHeaders.length + 2} style={{ padding: '40px 12px', textAlign: 'center', background: '#fff' }}><span className="text-[16px] text-[#697498]">No matching inspection requests found.</span></td></tr>
                ) : paginatedRows.map((row) => {
                  const sc = STATUS_COLORS[row.status] ?? { bg: '#f0f3fa', color: '#5a6282' };
                  const cell = (content: React.ReactNode, w: number) => (
                    <td style={{ background: '#fff', padding: '0 12px', height: 52, verticalAlign: 'middle', width: w, whiteSpace: 'nowrap' }}>{content}</td>
                  );
                  const txt = (v: string) => <span className="text-[16px] text-[#0e1b3d]">{v}</span>;
                  return (
                    <tr key={row.bookingRefNo}>
                      {bookingVisibleCols.includes('Booking Ref.No') && cell(<button onClick={() => { setViewRow(row); setViewTab('Goods Details'); setStep('view'); }} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontWeight: 500, fontFamily: font }}>{row.bookingRefNo}</button>, 170)}
                      {bookingVisibleCols.includes('Declaration No') && cell(<button onClick={() => { setDeclarationNoOpen(row.declarationNo); setStep('declaration'); }} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontWeight: 500, fontFamily: font }}>{row.declarationNo}</button>, 170)}
                      {bookingVisibleCols.includes('Request Type') && cell(txt(row.requestType), 160)}
                      {bookingVisibleCols.includes('Initiated Date') && cell(txt(row.initiatedDate), 130)}
                      {bookingVisibleCols.includes('Location Type') && cell(txt(row.locationType), 150)}
                      {bookingVisibleCols.includes('Mobile No') && cell(txt(row.mobileNo), 130)}
                      {bookingVisibleCols.includes('Sub status') && cell(txt(row.subStatus), 170)}

                      {/* STICKY: Status */}
                      <td style={{ position: 'sticky', right: actionsW, background: '#fff', padding: '0 12px', height: 52, verticalAlign: 'middle', width: statusW, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: openRowMenu === row.bookingRefNo ? 49 : 1 }}>
                        <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: sc.bg, color: sc.color, fontFamily: font }}>{row.status}</span>
                      </td>
                      {/* STICKY: Actions */}
                      <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 52, verticalAlign: 'middle', width: actionsW, textAlign: 'center', zIndex: openRowMenu === row.bookingRefNo ? 49 : 1 }}>
                        <div className="relative inline-block">
                          <button onClick={() => setOpenRowMenu(openRowMenu === row.bookingRefNo ? null : row.bookingRefNo)} className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9]">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498"><circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" /></svg>
                          </button>
                          {openRowMenu === row.bookingRefNo && (
                            <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden text-left" style={{ top: 36, width: 250, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                              {ACTION_MENU_ITEMS.map(item => (
                                <button key={item} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors flex items-center gap-[10px]"
                                  onClick={() => {
                                    setOpenRowMenu(null);
                                    if (item === 'View') { setViewRow(row); setViewTab('Goods Details'); setStep('view'); }
                                    else if (item === 'Cancel') setCancelTarget(row);
                                    else if (item === 'History') setHistoryTarget(row);
                                    else if (item === 'Make payment') { setToolbarTab('epay'); setEpayBookingRef(row.bookingRefNo); }
                                  }}>
                                  <span className="text-[#697498] group-hover:text-white flex-shrink-0 inline-flex"><ActionIcon label={item} /></span>
                                  <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item}</span>
                                </button>
                              ))}
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
        {visibleRows.length > 0 && (
          <Pagination page={curPage} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={[8, 25, 50]} totalItems={visibleRows.length}
            onPageChange={setPage} onPageSizeChange={n => { setPageSize(n); setPage(1); }} />
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setCancelTarget(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#dc3545' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></svg>
            </div>
            <div className="flex flex-col items-center gap-[8px] text-center">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure you want to cancel this inspection request?</p>
              <p className="text-[16px] text-[#455174]" style={{ lineHeight: 1.4 }}>Booking Ref. No {cancelTarget.bookingRefNo} will be marked as Cancelled.</p>
            </div>
            <div className="flex gap-[12px]">
              <button onClick={() => setCancelTarget(null)} data-secondary-btn className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Keep Request</button>
              <button onClick={() => { setRows(rs => rs.map(r => r.bookingRefNo === cancelTarget.bookingRefNo ? { ...r, status: 'Cancelled', subStatus: 'Rejected' } : r)); setCancelTarget(null); }}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontWeight: 500 }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* History modal */}
      {historyTarget && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setHistoryTarget(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] w-full flex flex-col max-h-[80vh]" style={{ maxWidth: 560 }}>
            <div className="flex items-center justify-between px-[24px] py-[16px] rounded-t-[8px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
              <div className="flex flex-col">
                <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Inspection History</span>
                <span className="text-[13px]" style={{ fontFamily: font, color: '#a7c3eb' }}>{historyTarget.bookingRefNo} · Declaration {historyTarget.declarationNo}</span>
              </div>
              <button onClick={() => setHistoryTarget(null)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-white/10 text-white flex-shrink-0">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[4px]">
              {historyFor(historyTarget).map((h, i, arr) => (
                <div key={i} className="flex items-start gap-[14px]">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="size-[12px] rounded-full flex-shrink-0" style={{ background: i === arr.length - 1 ? '#1360d2' : '#28a745' }} />
                    {i < arr.length - 1 && <span className="w-[2px] flex-1" style={{ background: '#d5ddfb', minHeight: 28 }} />}
                  </div>
                  <div className="pb-[20px]">
                    <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{h.label}</p>
                    <p className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showColModal && (
        <ManageColumnsModal
          columns={BOOKING_COL_DEFS}
          visible={bookingVisibleCols}
          lockedColumns={BOOKING_LOCKED_COLS}
          onSave={setBookingVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}
    </>
  );

  /* ══════════════════════════ Eligible declarations — step 1, master-table styling
     to match the Refund & Claims "Select Declarations" step (EligibleDeclarationsPage). ══ */
  const eligibleTableRef = useRef<HTMLDivElement>(null);
  const scrollToSelectedDecl = () => {
    const first = eligibleTableRef.current?.querySelector('[data-selected="true"]');
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const renderEligibleStep = () => {
    return (
      <div className="flex flex-col gap-[16px]">
        {/* Tabs */}
        <div className="flex items-center gap-[8px] bg-[#f0f4ff] rounded-[6px] p-[4px] w-max">
          {DECL_CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => setDeclCategory(c)} className="text-[16px] px-[16px] py-[9px] rounded-[4px] transition-colors"
              style={c === declCategory ? { background: '#1360d2', color: '#fff', fontWeight: 500, fontFamily: font } : { color: '#5a6282', fontFamily: font }}>
              {c === 'CDM Declarations' ? 'List of Eligible Declarations — CDM' : 'List of Eligible Cleared Declarations'}
            </button>
          ))}
        </div>

        {/* Search — its own row, below the tabs */}
        <div className="relative flex-shrink-0" style={{ width: '100%', maxWidth: 380 }}>
          <div className="flex items-center bg-white rounded-[4px] h-[48px] pr-[5px]" style={{ border: '1px solid #d5ddfb' }}>
            <input value={declSearch} onChange={e => setDeclSearch(e.target.value)} placeholder="Search Declaration No"
              className="flex-1 px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent" style={{ fontFamily: font }} />
            {declSearch && (
              <button type="button" onClick={() => setDeclSearch('')} className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
              </button>
            )}
            <span className="flex-shrink-0 inline-flex items-center justify-center rounded-[6px]" style={{ width: 38, height: 38, background: '#1360d2' }}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#ffffff" /></svg></span>
          </div>
        </div>

        {/* Available / Selected / View Selected / Clear Selection */}
        <div className="flex items-center gap-[16px] flex-wrap">
          <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
            Available: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{filteredDecls.length}</span>
          </span>
          {selectedDeclNos.size > 0 && (
            <>
              <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                Selected: <span style={{ color: '#1360d2', fontWeight: 600 }}>{selectedDeclNos.size}</span>
              </span>
              <button data-secondary-btn type="button" onClick={scrollToSelectedDecl} className="h-[32px] px-[14px] rounded-[4px] text-[14px] bg-white transition-colors"
                style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                View Selected
              </button>
              <button type="button" onClick={() => setSelectedDeclNos(new Set())} className="h-[32px] px-[14px] rounded-[4px] text-[14px] bg-white hover:bg-[#f0f4ff] transition-colors"
                style={{ border: '1.5px solid #d5ddfb', color: '#455174', fontWeight: 500, fontFamily: font }}>
                Clear Selection
              </button>
            </>
          )}
        </div>

        {/* Master table — single-select via radio button, matching EligibleDeclarationsPage styling */}
        <div ref={eligibleTableRef} className="rounded-[8px] overflow-hidden overflow-x-auto bg-white" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
          <table className="w-full" style={{ fontFamily: font, borderCollapse: 'separate', borderSpacing: '0 8px', minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ width: 48, background: '#a6c2e9', padding: '10px 16px', textAlign: 'left', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }} />
                {['Declaration No', 'Cargo Channel', 'Request Type', 'Regime Type', 'Remarks'].map((h, i) => (
                  <th key={h} className="text-left px-[16px] py-[10px] text-[16px] text-[#051937]" style={{ fontWeight: 500, background: '#a6c2e9', borderTopRightRadius: i === 4 ? 8 : undefined, borderBottomRightRadius: i === 4 ? 8 : undefined }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDecls.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-[28px] text-[16px] text-[#8f94ae]">No eligible declarations found.</td></tr>
              ) : filteredDecls.map(d => {
                const isSelected = selectedDeclNos.has(d.declarationNo);
                return (
                  <tr key={d.declarationNo} data-selected={isSelected} style={{ cursor: 'pointer' }} onClick={() => toggleDecl(d)} className={isSelected ? 'bg-[#f6f9fe]' : 'bg-white hover:bg-[#f6f9fe]'}>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle' }}>
                      <button type="button" onClick={e => { e.stopPropagation(); toggleDecl(d); }} role="radio" aria-checked={isSelected}
                        className="size-[20px] rounded-full inline-flex items-center justify-center" style={{ border: `1.5px solid ${isSelected ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                        {isSelected && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                      </button>
                    </td>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle' }}><span className="text-[16px] text-[#0e1b3d]">{d.declarationNo}</span></td>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle' }}><span className="text-[16px] text-[#0e1b3d]">{d.cargoChannel}</span></td>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle' }}><span className="text-[16px] text-[#0e1b3d]">{d.requestType}</span></td>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle' }}><span className="text-[16px] text-[#0e1b3d]">{d.regimeType}</span></td>
                    <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle', minWidth: 220 }}><span className="text-[15px] text-[#455174]">{d.remarks}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ══════════════════════════ Wizard ══════════════════════════ */
  const wizardStepIndex = CARGO_INSPECTION_STEPS.findIndex(s => s.id === step);
  const goNext = () => { const i = wizardStepIndex; if (i >= 0 && i < CARGO_INSPECTION_STEPS.length - 1) setStep(CARGO_INSPECTION_STEPS[i + 1].id as Step); };
  const goPrev = () => { const i = wizardStepIndex; if (i === 0) backToListing(); else if (i > 0) setStep(CARGO_INSPECTION_STEPS[i - 1].id as Step); };

  const renderDetails = () => (
    <>
      <Section title="Booking Request Details">
        <FieldItem label="Booking Reference No" value={wizBookingRef} />
        <FieldItem label="Declaration No" value={selectedDeclList.join(', ')} />
        <FieldItem label="Initiated Date" value={wizInitiatedDate} />
        <FieldItem label="Declaration Ref No" value={wizDeclRef} />
        <FieldItem label="Owner Name" value="XCRN BUSINESS NEW01" />
        <FieldItem label="Request Type" value={followUpRequired ? 'Follow up Inspection' : 'Normal'} />
      </Section>

      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Inspection Location</p>
        <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            <FloatDropdown label="Inspection Centre" value={inspectionCentre} onChange={setInspectionCentre} options={INSPECTION_CENTRES} required />
            <FloatDropdown label="Inspection Section" value={inspectionSection} onChange={setInspectionSection} options={INSPECTION_SECTIONS} required />
            <FloatDropdown label="Inspection Location Type" value={locationType} onChange={setLocationType} options={LOCATION_TYPES} required />
            {locationType === 'Outside Location' && (
              <>
                <div className="relative">
                  <FloatInput label="Outside Location" value={outsideLocation} onChange={setOutsideLocation} required placeholder="Search location" />
                  <button type="button" onClick={() => setOutsideLocationPickerOpen(true)} className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <div className="lg:col-span-2"><FloatInput label="Address" value={address} onChange={setAddress} placeholder="Enter address" /></div>
                <div className="flex items-end">
                  <button type="button" className="h-[44px] px-[16px] rounded-[4px] border text-[15px] flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.5" /></svg>
                    View on Map
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Contact Details</p>
        <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <FloatInput label="Contact Email" value={contactEmail} onChange={setContactEmail} required placeholder="Enter email address" />
          <FloatInput label="Representative Name" value={repName} onChange={setRepName} required placeholder="Enter representative name" />
          <FloatInput label="Contact Number" value={contactNumber} onChange={setContactNumber} placeholder="country-area-number" />
          <FloatInput label="Mobile Number" value={mobileNumber} onChange={setMobileNumber} required placeholder="country-area-number" />
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <Checkbox label="Follow up Inspection" checked={followUpRequired} onChange={() => setFollowUpRequired(v => !v)} bold />
        {followUpRequired && (
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FloatDropdown label="Inspection Centre" value={followUpCentre} onChange={setFollowUpCentre} options={INSPECTION_CENTRES} />
            <FloatDropdown label="Inspection Section" value={followUpSection} onChange={setFollowUpSection} options={INSPECTION_SECTIONS} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Additional Services</p>
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center gap-[32px] flex-wrap">
            <Checkbox label="Stamping Required" checked={stampingRequired} onChange={() => setStampingRequired(v => !v)} />
            <Checkbox label="Seal Required" checked={sealRequired} onChange={() => setSealRequired(v => !v)} />
            {sealRequired && <div className="w-full sm:w-[220px]"><FloatInput label="Quantity of Seals" value={qtySeals} onChange={setQtySeals} placeholder="Enter quantity" /></div>}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Goods Details</p>
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            <FloatInput label="Container No." value={containerForm.containerNo} onChange={v => setContainerForm(f => ({ ...f, containerNo: v }))} required placeholder="e.g. MSCU1234567" />
            <FloatInput label="Seal No." value={containerForm.sealNo} onChange={v => setContainerForm(f => ({ ...f, sealNo: v }))} placeholder="Enter seal number" />
            <FloatInput label="Remarks" value={containerForm.remarks} onChange={v => setContainerForm(f => ({ ...f, remarks: v }))} placeholder="Enter remarks" />
            <div className="flex items-end">
              <button onClick={addOrUpdateContainer} className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                <span>{editingSrNo != null ? '✓' : '+'}</span>{editingSrNo != null ? 'Update' : 'Add Container'}
              </button>
            </div>
          </div>
          <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
            <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 720 }}>
              <thead><tr style={{ background: '#e2ebf9' }}>{['SR. No.', 'Container No.', 'Seal No.', 'Remarks', 'Preferred Inspection Dates', 'Action'].map(h => <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>)}</tr></thead>
              <tbody>
                {containers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No containers added yet.</td></tr>
                ) : containers.map(c => {
                  const setCount = c.preferredDates.filter(pd => pd.date).length;
                  const expanded = expandedContainers.has(c.srNo);
                  return (
                    <React.Fragment key={c.srNo}>
                      <tr style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.sealNo || '—'}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.remarks || '—'}</td>
                        <td className="px-[16px] py-[10px]">
                          <div className="flex items-center gap-[10px]">
                            <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium whitespace-nowrap" style={{ background: setCount > 0 ? '#e2ebf9' : '#f0f3fa', color: setCount > 0 ? '#1360d2' : '#8f94ae' }}>{setCount} / {c.preferredDates.length} dates</span>
                            <button type="button" onClick={() => toggleExpanded(c.srNo)} className="h-[30px] px-[12px] rounded-[4px] border text-[13px] flex items-center gap-[6px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                              {expanded ? 'Collapse' : 'Set Dates'}
                              <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-[16px] py-[10px]">
                          <div className="flex items-center gap-[12px]">
                            <button onClick={() => editContainer(c)} className="text-[#1360d2] hover:opacity-70"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                            <button onClick={() => removeContainer(c.srNo)} className="text-[#c0392b] hover:opacity-70"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td colSpan={6} className="px-[16px] py-[16px]" style={{ background: '#f8fafd' }}>
                            <p className="text-[14px] text-[#697498] mb-[12px]">Preferred inspection dates for <b style={{ color: '#0e1b3d' }}>{c.containerNo}</b> — Date 1 is required, the rest are optional alternates.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                              {c.preferredDates.map((pd, i) => (
                                <div key={i} className="grid grid-cols-2 gap-[12px] p-[12px] rounded-[6px]" style={i === 0 ? { border: '1.5px solid #1360d2', background: '#eef4ff' } : { border: '1px solid #eef1f6', background: '#fff' }}>
                                  <DateInput label={`Preferred Date ${i + 1}`} required={i === 0} value={pd.date} onChange={v => setPreferredDate(c.srNo, i, 'date', v)} />
                                  <FloatDropdown label="Slot" value={pd.slot} onChange={v => setPreferredDate(c.srNo, i, 'slot', v)} options={SLOT_OPTIONS} />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {outsideLocationPickerOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setOutsideLocationPickerOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] w-full flex flex-col max-h-[70vh]" style={{ maxWidth: 480 }}>
            <div className="flex items-center justify-between px-[24px] py-[16px] rounded-t-[8px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
              <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Search Outside Location</span>
              <button onClick={() => setOutsideLocationPickerOpen(false)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-white/10 text-white"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
            </div>
            <div className="overflow-y-auto py-[8px]">
              {OUTSIDE_LOCATIONS.map(loc => (
                <button key={loc} onClick={() => { setOutsideLocation(loc); setOutsideLocationPickerOpen(false); }} className="block w-full text-left px-[24px] py-[12px] text-[16px] hover:bg-[#e2ebf9]" style={{ fontFamily: font, color: '#0e1b3d' }}>{loc}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderDocuments = () => {
    const docsForDecl = (d: string) => uploadedDocs.filter(u => u.declNo === d);
    return (
      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Document Upload</p>
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <FloatDropdown label="Declaration Number" value={docDeclNo} onChange={setDocDeclNo} options={selectedDeclList} required />
            <FloatInput label="Remarks (Optional)" value={docRemarks[docDeclNo] ?? ''} onChange={v => setDocRemarks(r => ({ ...r, [docDeclNo]: v }))} textarea placeholder="Add any remarks for this declaration..." />
          </div>
          <div className="flex flex-col gap-[10px]">
            <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Document Type</span>
            <div className="flex items-center gap-[24px] flex-wrap">
              {DOC_TYPES.map(d => (
                <label key={d} className="flex items-center gap-[8px] cursor-pointer" onClick={() => setDocType(d)}>
                  <span className="size-[16px] rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${docType === d ? '#1360d2' : '#d5ddfb'}` }}>{docType === d && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}</span>
                  <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="rounded-[8px] flex flex-col items-center justify-center gap-[12px] py-[40px] cursor-pointer" style={{ border: '1.5px dashed #c7d0e8', opacity: docDeclNo ? 1 : 0.5, pointerEvents: docDeclNo ? 'auto' : 'none' }}>
            <input type="file" multiple className="hidden" onChange={e => handleFileSelect(e.target.files)} />
            <div className="size-[56px] rounded-full flex items-center justify-center" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.8"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6" /></svg>
            </div>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Click to select or drag files here</p>
            <p className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>PDF, JPG, PNG · Max 10 MB per file · attached to {docDeclNo || 'the selected declaration'}</p>
          </label>
          {selectedDeclList.map(d => {
            const docs = docsForDecl(d);
            if (docs.length === 0) return null;
            return (
              <div key={d} className="flex flex-col gap-[8px]">
                <span className="text-[14px] text-[#697498]" style={{ fontFamily: font, fontWeight: 500 }}>Declaration {d}</span>
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between rounded-[6px] px-[14px] py-[10px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>{doc.name} <span className="text-[#8f94ae]">({doc.docType})</span></span>
                    <button onClick={() => setUploadedDocs(ds => ds.filter(x => x.id !== doc.id))} className="text-[#c0392b] hover:opacity-70"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPayment = () => (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Payment</p>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[20px] items-start">
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[14px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Selected Declarations</p>
            <p className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{selectedDeclList.length} declaration{selectedDeclList.length === 1 ? '' : 's'} selected for this inspection</p>
          </div>
          <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
            <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 640 }}>
              <thead><tr style={{ background: '#e2ebf9' }}>{['#', 'Declaration No.', 'Cargo Channel', 'Request Type', 'Remarks'].map(h => <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>)}</tr></thead>
              <tbody>
                {selectedDeclList.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-[20px] text-[15px] text-[#8f94ae]">No declarations selected.</td></tr>
                ) : selectedDeclList.map((d, i) => {
                  const decl = ELIGIBLE_DECLS.find(x => x.declarationNo === d);
                  return (
                    <tr key={d} style={{ borderTop: '1px solid #f0f4ff' }}>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{i + 1}</td>
                      <td className="px-[16px] py-[10px] text-[15px]" style={{ color: '#1360d2', fontWeight: 500 }}>{d}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{decl?.cargoChannel ?? '—'}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{decl?.requestType ?? '—'}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{decl?.remarks ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Payment Summary</p>
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>No. of Declarations</span>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>{selectedDeclList.length}</span>
            </div>
            {FEES.map(f => (
              <div key={f.type} className="flex items-center justify-between">
                <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Sub Total of {f.type}</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}><DhAmount value={f.amount.toFixed(2)} /></span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-[10px]" style={{ borderTop: '1px solid #eef1f6' }}>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Grand Total Amount</span>
              <span className="text-[16px]" style={{ fontFamily: font, fontWeight: 700, color: '#1360d2' }}><DhAmount value={GRAND_TOTAL.toFixed(2)} /></span>
            </div>
          </div>
          <FloatDropdown label="Payment Mode" value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} required />
          {paymentMode === 'Credit Account' && (
            <>
              <FloatDropdown label="Account Number" value={creditAccountId} onChange={setCreditAccountId} options={CREDIT_ACCOUNTS.map(a => a.id)} required />
              {selectedAccount && (
                <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                  <div className="flex items-center justify-between px-[14px] py-[9px]" style={{ background: '#f8fafd' }}>
                    <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Account Name</span>
                    <span className="text-[13px]" style={{ fontFamily: font, fontWeight: 500, color: '#0e1b3d' }}>{selectedAccount.name}</span>
                  </div>
                  <div className="flex items-center justify-between px-[14px] py-[9px]">
                    <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Available Balance</span>
                    <span className="text-[13px]" style={{ fontFamily: font, fontWeight: 500, color: '#28a745' }}><DhAmount value={selectedAccount.balance.toLocaleString() + '.00'} /></span>
                  </div>
                </div>
              )}
            </>
          )}
          {paymentMode === 'Epay' && <p className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>You'll be redirected to a secure payment gateway to complete this transaction.</p>}
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <>
      <Section title="Booking Request Details">
        <FieldItem label="Booking Reference No" value={wizBookingRef} />
        <FieldItem label="Declaration No" value={selectedDeclList.join(', ')} />
        <FieldItem label="Owner Name" value="XCRN BUSINESS NEW01" />
        <FieldItem label="Request Type" value={followUpRequired ? 'Follow up Inspection' : 'Normal'} />
      </Section>
      <Section title="Inspection Location">
        <FieldItem label="Inspection Centre" value={inspectionCentre} />
        <FieldItem label="Inspection Section" value={inspectionSection} />
        <FieldItem label="Inspection Location Type" value={locationType} />
        <FieldItem label="Outside Location" value={outsideLocation} />
      </Section>
      <Section title="Contact Details">
        <FieldItem label="Contact Email" value={contactEmail} />
        <FieldItem label="Representative Name" value={repName} />
        <FieldItem label="Contact Number" value={contactNumber} />
        <FieldItem label="Mobile Number" value={mobileNumber} />
      </Section>
      <Section title="Additional Services">
        <FieldItem label="Stamping Required" value={stampingRequired ? 'Yes' : 'No'} />
        <FieldItem label="Seal Required" value={sealRequired ? 'Yes' : 'No'} />
        {sealRequired && <FieldItem label="Quantity of Seals" value={qtySeals} />}
      </Section>
      <div className="flex flex-col gap-[16px]">
        <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Goods Details — {containers.length} Container{containers.length === 1 ? '' : 's'}</p>
        <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
            <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 640 }}>
              <thead><tr style={{ background: '#e2ebf9' }}>{['SR. No.', 'Container No.', 'Seal No.', 'Remarks', 'Preferred Inspection Dates'].map(h => <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>)}</tr></thead>
              <tbody>
                {containers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-[20px] text-[15px] text-[#8f94ae]">No containers added.</td></tr>
                ) : containers.map(c => {
                  const set = c.preferredDates.filter(pd => pd.date);
                  return (
                    <tr key={c.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerNo}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.sealNo || '—'}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.remarks || '—'}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">
                        {set.length === 0 ? '—' : <div className="flex flex-col gap-[2px]">{set.map((pd, i) => <span key={i} style={{ color: i === 0 ? '#0e1b3d' : '#697498' }}>{pd.date}{pd.slot ? ` · ${pd.slot}` : ''}</span>)}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Section title="Documents & Payment">
        <FieldItem label="Documents Uploaded" value={String(uploadedDocs.length)} />
        <FieldItem label="Declarations with Remarks" value={String(Object.values(docRemarks).filter(v => v.trim()).length)} />
        <FieldItem label="Payment Mode" value={paymentMode} />
        <FieldItem label="Credit Account" value={paymentMode === 'Credit Account' ? creditAccountId : '—'} />
        <FieldItem label="Total Amount" value={<DhAmount value={GRAND_TOTAL.toFixed(2)} />} />
      </Section>
    </>
  );

  const renderWizard = () => (
    <>
      <Breadcrumb extra="Initiate Inspection" />
      <div className="flex items-center justify-between px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Initiate Inspection</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="px-4 sm:px-10 pb-[20px] flex-shrink-0"><ClaimStepper activeIndex={Math.max(0, wizardStepIndex)} steps={CARGO_INSPECTION_STEPS} /></div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[24px] flex flex-col gap-[20px]">
        {step === 'eligible' && renderEligibleStep()}
        {step === 'details' && renderDetails()}
        {step === 'documents' && renderDocuments()}
        {step === 'payment' && renderPayment()}
        {step === 'review' && renderReview()}
      </div>
      <BackToListingBar onBack={goPrev} rightContent={
        step === 'review' ? (
          <button onClick={submitBooking} className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Submit</button>
        ) : step === 'eligible' ? (
          <button onClick={goNext} disabled={selectedDeclNos.size === 0} className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white"
            style={{ background: selectedDeclNos.size > 0 ? '#1360d2' : '#a7c3eb', cursor: selectedDeclNos.size > 0 ? 'pointer' : 'default', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Proceed
          </button>
        ) : (
          <button onClick={goNext} className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            {step === 'payment' ? 'Pay & Continue' : 'Next'}
          </button>
        )
      } />
    </>
  );

  /* ══════════════════════════ Payment result screens ══════════════════════════ */
  const renderSuccess = () => (
    <>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0"><h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Inspection</h1></div>
      <ResultShell icon={<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>} iconBg="#d1f5df"
        heading="Your Inspection Request Submitted Successfully" headingColor="#28a745"
        buttons={<>
          <ResultSecondaryBtn>Download</ResultSecondaryBtn>
          <ResultSecondaryBtn>Share</ResultSecondaryBtn>
          <ResultPrimaryBtn onClick={() => { const row = rows.find(r => r.bookingRefNo === wizBookingRef) ?? rows[0]; setViewRow(row); setViewTab('Goods Details'); resetWizard(); setStep('view'); }}>View Inspection Details</ResultPrimaryBtn>
        </>}>
        <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Thank You For Using Dubai Trade SW Web Application.</p>
        <div className="w-full max-w-[420px] rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
          {[['Booking Ref. No', wizBookingRef], ['Declaration No', selectedDeclList.join(', ') || '—']].map(([l, v], i) => (
            <div key={l} className="flex items-center justify-between px-[20px] py-[12px]" style={{ background: i % 2 === 0 ? '#f8fafd' : '#fff' }}>
              <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>{l}</span>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </ResultShell>
      <BackToListingBar onBackToListing={backToListing} />
    </>
  );

  const renderPaymentPending = () => (
    <>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0"><h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Inspection</h1></div>
      <ResultShell icon={<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#b45309" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 7.5v5.5M12 16.5v.01" /></svg>} iconBg="#fff4e0"
        heading="Cargo Inspection Request Submitted - Payment Pending" headingColor="#b45309"
        buttons={<>
          <ResultPrimaryBtn onClick={() => setStep('paymentProcessing')}>Make e-Payment</ResultPrimaryBtn>
          <ResultSecondaryBtn onClick={() => setStep('payment')}>Change Payment Mode</ResultSecondaryBtn>
          <ResultSecondaryBtn onClick={backToListing}>Back to Listing</ResultSecondaryBtn>
        </>}>
        <div className="text-center flex flex-col gap-[4px]">
          <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>Your inspection booking request has been processed. Please initiate the payment transaction.</p>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Request Number: {wizBookingRef}</p>
          <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>Total Charges to pay - <DhAmount value={GRAND_TOTAL.toFixed(2)} /></p>
        </div>
      </ResultShell>
    </>
  );

  const renderPaymentProcessing = () => (
    <>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0"><h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Inspection</h1></div>
      <ResultShell icon={<svg className="animate-spin" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1360d2" strokeWidth="2.4" strokeLinecap="round"><path d="M12 3a9 9 0 109 9" /></svg>} iconBg="#e2ebf9"
        heading="Cargo Inspection Request Received - ePayment Processing" headingColor="#1360d2"
        buttons={<>
          <ResultPrimaryBtn onClick={() => { setRows(rs => rs.map(r => r.bookingRefNo === wizBookingRef ? { ...r, status: 'Submitted' } : r)); setStep('success'); }}>Check e-Payment Status</ResultPrimaryBtn>
          <ResultSecondaryBtn onClick={backToListing}>Back to Listing</ResultSecondaryBtn>
        </>}>
        <div className="text-center flex flex-col gap-[4px]">
          <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>Your request has been received. Your ePayment transaction is under processing and will be completed shortly.</p>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Request Number: {wizBookingRef}</p>
          <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>You can download the inspection confirmation from the listing page with your request number after successful ePayment processing.</p>
          <button onClick={() => setStep('paymentFailed')} className="text-[14px] underline mt-[6px]" style={{ color: '#455174', fontFamily: font }}>Simulate Payment Failed</button>
        </div>
      </ResultShell>
    </>
  );

  const renderPaymentFailed = () => (
    <>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0"><h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Inspection</h1></div>
      <ResultShell icon={<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#dc3545" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>} iconBg="#fde2e2"
        heading="Cargo Inspection Request - ePayment Failed" headingColor="#dc3545"
        buttons={<>
          <ResultPrimaryBtn onClick={() => setStep('paymentProcessing')}>Retry Payment</ResultPrimaryBtn>
          <ResultSecondaryBtn onClick={() => setStep('payment')}>Change Payment Mode</ResultSecondaryBtn>
          <ResultSecondaryBtn onClick={backToListing}>Back to Listing</ResultSecondaryBtn>
        </>}>
        <div className="text-center flex flex-col gap-[4px]">
          <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>Your ePayment transaction could not be completed. Please retry the payment or choose a different payment mode.</p>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Request Number: {wizBookingRef}</p>
        </div>
      </ResultShell>
    </>
  );

  /* ══════════════════════════ Booking detail (tabbed view) ══════════════════════════ */
  const renderView = () => {
    if (!viewRow) return null;
    const d = bookingDetailFor(viewRow);
    const sc = STATUS_COLORS[viewRow.status] ?? { bg: '#f0f3fa', color: '#5a6282' };
    const TABS = ['Goods Details', 'Attachments', 'Notes', 'Payment History', 'Document', 'Groups'] as const;
    const allSelected = viewDeclSelected.size === d.containers.length && d.containers.length > 0;
    const toggleAll = () => setViewDeclSelected(allSelected ? new Set() : new Set(d.containers.map(c => c.containerNo)));
    const toggleOne = (no: string) => setViewDeclSelected(s => { const n = new Set(s); n.has(no) ? n.delete(no) : n.add(no); return n; });
    return (
      <>
        <Breadcrumb extra="Booking Request Details" />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Booking Request Details</h1>
          <span className="inline-flex items-center px-[12px] py-[4px] rounded-[4px] text-[15px] font-medium" style={{ background: sc.bg, color: sc.color, fontFamily: font }}>{viewRow.status}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          <Section title="Booking Request Details">
            <FieldItem label="Booking Reference Number" value={viewRow.bookingRefNo} />
            <FieldItem label="Inspection Location Type" value={d.inspectionLocationType} />
            <FieldItem label="Declaration Number" value={viewRow.declarationNo} />
            <FieldItem label="Outside Location" value={d.outsideLocation} />
            <FieldItem label="Initiation Date" value={d.initiationDate} />
            <FieldItem label="Address" value={d.address} />
            <FieldItem label="Declarant Reference Number" value={d.declarantRefNo} />
            <FieldItem label="Owner Name" value={d.ownerName} />
            <FieldItem label="Inspection Centre" value={d.inspectionCentre} />
            <FieldItem label="Inspection Section" value={d.inspectionSection} />
            <FieldItem label="Request Type" value={d.requestType} />
          </Section>
          <Section title="Contact Details">
            <FieldItem label="Contact Email" value={d.contactEmail} />
            <FieldItem label="Representative Name" value={d.representativeName} />
            <FieldItem label="Contact Number" value={d.contactNumber} />
            <FieldItem label="Mobile Number" value={d.mobileNumber} />
          </Section>
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Follow Up Inspection</p>
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex items-center gap-[10px]">
                <span className="size-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${d.followUpRequired ? '#1360d2' : '#d5ddfb'}`, background: d.followUpRequired ? '#1360d2' : '#fff' }}>{d.followUpRequired && <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 10l4 4 8-8" /></svg>}</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>Follow Up Required</span>
              </div>
              {d.followUpRequired && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                  <FieldItem label="Inspection Centre" value={d.followUpCentre} />
                  <FieldItem label="Inspection Section" value={d.followUpSection} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Additional Services</p>
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex items-center gap-[32px] flex-wrap">
                {[['Stamping Required', d.stampingRequired], ['Seal Required', d.sealRequired]].map(([label, checked]) => (
                  <div key={label as string} className="flex items-center gap-[10px]">
                    <span className="size-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${checked ? '#1360d2' : '#d5ddfb'}`, background: checked ? '#1360d2' : '#fff' }}>{checked && <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 10l4 4 8-8" /></svg>}</span>
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>{label}</span>
                  </div>
                ))}
                {d.sealRequired && <FieldItem label="Quantity of Seals" value={d.quantityOfSeals} />}
              </div>
            </div>
          </div>
          <Section title="Status Details">
            <FieldItem label="Status" value={viewRow.status} />
            <FieldItem label="Sub-Status" value={viewRow.subStatus} />
          </Section>

          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[8px] flex-wrap" style={{ borderBottom: '1px solid #eef1f6' }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setViewTab(t)} className="px-[16px] py-[10px] text-[15px] transition-colors"
                  style={{ fontFamily: font, fontWeight: t === viewTab ? 600 : 400, color: t === viewTab ? '#1360d2' : '#697498', borderBottom: t === viewTab ? '2px solid #1360d2' : '2px solid transparent' }}>{t}</button>
              ))}
            </div>

            {viewTab === 'Goods Details' && (
              <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[14px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="flex items-center gap-[12px] flex-wrap">
                  <button onClick={toggleAll} className="h-[36px] px-[14px] rounded-[4px] border text-[14px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>Select All</button>
                  <button onClick={() => setViewDeclSelected(new Set())} className="h-[36px] px-[14px] rounded-[4px] border text-[14px]" style={{ borderColor: '#d5ddfb', color: '#5a6282', fontFamily: font }}>Deselect</button>
                  <button className="h-[36px] px-[14px] rounded-[4px] border text-[14px]" style={{ borderColor: '#d5ddfb', color: '#5a6282', fontFamily: font }}>Group Dates</button>
                  <div className="flex-1" />
                  <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>1 – {d.containers.length} of {d.containers.length}</span>
                </div>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 1100 }}>
                    <thead>
                      <tr style={{ background: '#a6c2e9' }}>
                        <th className="px-[16px] py-[10px]" style={{ width: 40 }}><input type="checkbox" checked={allSelected} onChange={toggleAll} className="size-[16px] cursor-pointer" /></th>
                        {['Container Number', 'Marks and Numbers', 'Preferred Date 1', 'Preferred Slot 1', 'Additional Preferred Slot', 'Preferred Date 2', 'Preferred Slot 2', 'Preferred Date 3', 'Preferred Slot 3'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#051937] whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {d.containers.length === 0 ? (
                        <tr><td colSpan={10} className="text-center py-[24px] text-[15px] text-[#8f94ae]">No containers added to this booking.</td></tr>
                      ) : d.containers.map(c => (
                        <tr key={c.containerNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px]"><input type="checkbox" checked={viewDeclSelected.has(c.containerNo)} onChange={() => toggleOne(c.containerNo)} className="size-[16px] cursor-pointer" /></td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.containerNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.marksAndNumbers}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredDate1}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredSlot1}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.additionalPreferredSlot}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredDate2}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredSlot2}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredDate3}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d] whitespace-nowrap">{c.preferredSlot3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewTab === 'Attachments' && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                {d.attachments.length === 0 ? <p className="text-[15px] text-[#8f94ae] text-center py-[20px]">No attachments added yet.</p> : (
                  <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                    {d.attachments.map((f, i) => (
                      <div key={f.name} className="flex items-center justify-between px-[16px] py-[12px]" style={{ borderTop: i === 0 ? 'none' : '1px solid #f0f4ff' }}>
                        <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{f.name}</span>
                        <span className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>{f.uploadedBy} · {f.uploadedOn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewTab === 'Notes' && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                {d.notes.length === 0 ? <p className="text-[15px] text-[#8f94ae] text-center py-[20px]">No notes added yet.</p> : (
                  <div className="flex flex-col gap-[12px]">
                    {d.notes.map((n, i) => (
                      <div key={i} className="rounded-[6px] px-[16px] py-[12px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                        <div className="flex items-center justify-between mb-[4px]">
                          <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>{n.by}</span>
                          <span className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>{n.date}</span>
                        </div>
                        <p className="text-[14px] text-[#455174]" style={{ fontFamily: font }}>{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewTab === 'Payment History' && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead><tr style={{ background: '#a6c2e9' }}>{['Date', 'Payment Mode', 'Amount', 'Status', 'Receipt Number'].map(h => <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {d.paymentHistory.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-[24px] text-[15px] text-[#8f94ae]">No payment history available.</td></tr>
                      ) : d.paymentHistory.map((p, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{p.date}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{p.mode}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{p.amount.replace('AED', '').trim() && <DhAmount value={p.amount.replace('AED', '').trim()} />}</td>
                          <td className="px-[16px] py-[10px]"><span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium" style={{ background: '#d1f5df', color: '#28a745', fontFamily: font }}>{p.status}</span></td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{p.receiptNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewTab === 'Document' && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                {d.documents.length === 0 ? <p className="text-[15px] text-[#8f94ae] text-center py-[20px]">No documents uploaded yet.</p> : (
                  <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                    {d.documents.map((f, i) => (
                      <div key={f.name} className="flex items-center justify-between px-[16px] py-[12px]" style={{ borderTop: i === 0 ? 'none' : '1px solid #f0f4ff' }}>
                        <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{f.name}</span>
                        <span className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>{f.type} · {f.uploadedOn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewTab === 'Groups' && (
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <p className="text-[15px] text-[#8f94ae] text-center py-[20px]">No container groups created yet.</p>
              </div>
            )}
          </div>
        </div>
        <BackToListingBar onBackToListing={backToListing} />
      </>
    );
  };

  /* ══════════════════════════ Declaration detail (read-only) ══════════════════════════ */
  const renderDeclaration = () => {
    const l = declarationDetailFor(declarationNoOpen);
    return (
      <>
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
          <div className="flex items-center gap-[6px]">
            <span className="text-[16px] text-[#8f94ae] cursor-pointer hover:underline" style={{ fontFamily: font }} onClick={backToListing}>Cargo Inspection Listing</span>
            <span className="text-[16px] text-[#dc3545]">/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Customs Declaration</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center"><span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span></div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
            Customs Declaration Number ({declarationNoOpen}) <span className="text-[18px] text-[#8f94ae]" style={{ fontWeight: 400 }}>(Version {l.version})</span>
          </h1>
          <Section title="Customs BIP">
            <FieldItem label="Type" value={l.type} />
            <FieldItem label="Declaration Type" value={l.declarationType} />
            <FieldItem label="Declaration Number" value={declarationNoOpen} />
            <FieldItem label="Cargo Channel" value={l.cargoChannel} />
            <FieldItem label="Regime Type" value={l.regimeType} />
            <FieldItem label="Permit" value={l.permit} />
            <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 220px', minWidth: 200 }}>
              <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>Declaration Status</span>
              <span className="inline-flex w-max items-center px-[10px] py-[3px] rounded-[4px] text-[14px] font-medium" style={{ background: '#d1f5df', color: '#28a745', fontFamily: font }}>{l.declarationStatus}</span>
            </div>
            <FieldItem label="Declaration Date" value={l.declarationDate} />
            <FieldItem label="Carrier Registration No." value={l.carrierRegistrationNo} />
            <FieldItem label="Customer Type" value={l.customerType} />
            <FieldItem label="Customer Code / Name" value={l.customerCodeName} />
            <FieldItem label="Importer Code" value={l.importerCode} />
          </Section>
          <Section title="Goods Package Details">
            <FieldItem label="Total Quantity" value={l.totalQuantity} />
            <FieldItem label="Total Weight" value={l.totalWeight} />
            <FieldItem label="Volume" value={l.volume} />
            <FieldItem label="Total Packages" value={l.totalPackages} />
          </Section>
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>Container Details</p>
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 640 }}>
                  <thead><tr style={{ background: '#a6c2e9' }}>{['Container No.', 'Container Type', 'Seal No.', 'Loading Status'].map(h => <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {l.containers.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-[24px] text-[15px] text-[#8f94ae]">No container details available.</td></tr>
                    ) : l.containers.map(c => (
                      <tr key={c.containerNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerType}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.sealNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.loadingStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <BackToListingBar onBack={backToListing} />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
      {step === 'list' && renderList()}
      {(step === 'eligible' || step === 'details' || step === 'documents' || step === 'payment' || step === 'review') && renderWizard()}
      {step === 'success' && renderSuccess()}
      {step === 'paymentPending' && renderPaymentPending()}
      {step === 'paymentProcessing' && renderPaymentProcessing()}
      {step === 'paymentFailed' && renderPaymentFailed()}
      {step === 'view' && renderView()}
      {step === 'declaration' && renderDeclaration()}
    </div>
  );
}
