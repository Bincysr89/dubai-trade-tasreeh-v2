import { useState } from 'react';
import Header from './Header';
import Pagination from './Pagination';
import PermitsCreatePage from './PermitsCreatePage';
import { DateInput } from './DatePicker';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { ColumnFilter } from './ColumnFilter';
import StatusFilterHeader from './StatusFilterHeader';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

type Props = { onClose: () => void; createPrefill?: { activity?: string; mode?: string } };

const font = "'Dubai', sans-serif";

/* ── Floating-label helpers ── */
function flLabel(active: boolean): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: '#0e1b3d',
    background: active ? '#fff' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}
const XClear = ({ onClear }: { onClear: (e: React.MouseEvent) => void }) => (
  <button type="button" onClick={onClear}
    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
      width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#b0b8d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, zIndex: 2 }}>
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
      <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  </button>
);
function AFInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, paddingRight: (value && hovered) ? 40 : 12, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }}
      />
      <span style={flLabel(active)}>{label}</span>
      {value && hovered && <XClear onClear={e => { e.preventDefault(); onChange(''); }} />}
    </div>
  );
}
function AFDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <DateInput label={label} value={value} onChange={onChange} />;
}
function AFDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = open || value !== '';
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] bg-white focus:outline-none text-left"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}>
        <span className="flex-1 truncate">{value}</span>
        {value && hovered && (
          <span onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); }}
            style={{ width: 22, height: 22, borderRadius: '50%', background: '#b0b8d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
              <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span style={flLabel(active)}>{label}</span>
      {open && (
        <div className="absolute z-[200] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px]"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#697498] hover:bg-[#f5f7ff]"
            style={{ fontFamily: font }} onClick={() => { onChange(''); setOpen(false); }}>— All —</button>
          {options.map(opt => (
            <button key={opt} className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => { onChange(opt); setOpen(false); }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Generic pill dropdown for the toolbar (Authority Name, Service Name) ── */
const AUTHORITIES = ['Dubai Municipality', 'DCAA', 'SIRA', 'Dubai Chambers'];

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] bg-white transition-colors ${
          value ? 'border-[#1360d2] text-[#1360d2]' : 'border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
        }`}
        style={{ fontFamily: font, minWidth: 180 }}
      >
        <span className="flex-1 text-left truncate">{value || label}</span>
        {value && (
          <span
            onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); }}
            style={{ width: 20, height: 20, borderRadius: '50%', background: '#b0b8d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          >
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
              <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-[200] top-[52px] left-0 bg-white rounded-[8px] py-[4px]"
          style={{ minWidth: 180, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          <button className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#697498] hover:bg-[#f5f7ff]"
            style={{ fontFamily: font }} onClick={() => { onChange(''); setOpen(false); }}>— All —</button>
          {options.map(a => (
            <button key={a} className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]"
              style={{ fontFamily: font }} onClick={() => { onChange(a); setOpen(false); }}>{a}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Types ── */
type AppStatus     = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Cancelled';
type PaymentStatus = 'Not Required' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';

type Permit = {
  appRefNo:      string;
  serviceReqNo:  string;
  authority:     string;
  serviceName:   string;
  agentCode:     string;
  mode:          string;
  declarationNo: string;
  bolAwbNo:      string;
  submittedDate: string;
  appStatus:     AppStatus;
  paymentStatus: PaymentStatus;
};

const MOCK_DATA: Permit[] = [
  { appRefNo: 'DM-REQ-2026-000123',  serviceReqNo: 'SYS-PMT-001', authority: 'Dubai Municipality',             serviceName: 'Release of Imported Food Consignment', agentCode: 'A121324', mode: 'Sea',  declarationNo: 'BOE-2026-0011', bolAwbNo: 'BOL123456',      submittedDate: '25-Jun-26', appStatus: 'Approved',    paymentStatus: 'Paid' },
  { appRefNo: 'DCAA-REQ-00045',       serviceReqNo: 'SYS-CRT-002', authority: 'DCAA',            serviceName: 'Air Cargo Certificate',                agentCode: 'M132432', mode: 'Air',  declarationNo: 'CDN-2026-0022', bolAwbNo: '176-12345678',   submittedDate: '24-Jun-26', appStatus: 'Submitted',   paymentStatus: 'Pending' },
  { appRefNo: 'DM-REQ-2026-000124',  serviceReqNo: 'SYS-PMT-003', authority: 'Dubai Municipality',             serviceName: 'Phytosanitary Certificate',             agentCode: 'A121324', mode: 'Sea',  declarationNo: 'BOE-2026-0033', bolAwbNo: 'BOL789012',      submittedDate: '23-Jun-26', appStatus: 'Under Review',paymentStatus: 'Not Required' },
  { appRefNo: 'SIRA-REQ-2026-00087', serviceReqNo: 'SYS-PMT-004', authority: 'SIRA',            serviceName: 'Import Permit — Regulated Goods',      agentCode: 'A118765', mode: 'Land', declarationNo: 'CDN-2026-0044', bolAwbNo: 'N/A',            submittedDate: '22-Jun-26', appStatus: 'Approved',    paymentStatus: 'Paid' },
  { appRefNo: 'DC-REQ-2026-00201',   serviceReqNo: 'SYS-CRT-005', authority: 'Dubai Chambers', serviceName: 'Certificate of Origin',                agentCode: 'M129981', mode: 'Sea',  declarationNo: 'BOE-2026-0055', bolAwbNo: 'BOL345678',      submittedDate: '21-Jun-26', appStatus: 'Rejected',    paymentStatus: 'Refunded' },
  { appRefNo: 'DM-REQ-2026-000125',  serviceReqNo: 'SYS-PMT-006', authority: 'Dubai Municipality',             serviceName: 'Health Certificate — Meat Products',   agentCode: 'M132432', mode: 'Air',  declarationNo: 'CDN-2026-0066', bolAwbNo: '176-98765432',   submittedDate: '20-Jun-26', appStatus: 'Draft',       paymentStatus: 'Not Required' },
  { appRefNo: 'DCAA-REQ-00046',       serviceReqNo: 'SYS-CRT-007', authority: 'DCAA',            serviceName: 'Dangerous Goods Declaration',          agentCode: 'A118765', mode: 'Air',  declarationNo: 'CDN-2026-0077', bolAwbNo: '176-11223344',   submittedDate: '19-Jun-26', appStatus: 'Approved',    paymentStatus: 'Paid' },
  { appRefNo: 'SIRA-REQ-2026-00088', serviceReqNo: 'SYS-PMT-008', authority: 'SIRA',            serviceName: 'Export Permit — Controlled Items',     agentCode: 'A104532', mode: 'Sea',  declarationNo: 'BOE-2026-0088', bolAwbNo: 'BOL901234',      submittedDate: '18-Jun-26', appStatus: 'Cancelled',   paymentStatus: 'Refunded' },
];

const APP_STATUS_STYLE: Record<AppStatus, { bg: string; color: string }> = {
  'Draft':        { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Submitted':    { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Review': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Approved':     { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':     { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':    { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};
const APP_STATUS_COLORS: Record<AppStatus, string> = {
  'Draft': '#697498', 'Submitted': '#1360d2', 'Under Review': '#b45309',
  'Approved': '#28a745', 'Rejected': '#c0392b', 'Cancelled': '#697498',
};

const PAY_STATUS_STYLE: Record<PaymentStatus, { bg: string; color: string }> = {
  'Not Required': { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Pending':      { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Paid':         { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Failed':       { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Refunded':     { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
};
const PAY_STATUS_COLORS: Record<PaymentStatus, string> = {
  'Not Required': '#697498', 'Pending': '#b45309', 'Paid': '#28a745',
  'Failed': '#c0392b', 'Refunded': '#1360d2',
};

/* ── Column definitions ──
   Default order/visibility mirrors the reference screenshot; the extra fields
   (Service Request No., Declaration No., BOL/AWB No.) stay available via Manage Columns. */
const COL_DEFS: (ColDef & { w: number })[] = [
  { key: 'appRefNo',      label: 'Application Ref No.',  w: 200 },
  { key: 'authority',     label: 'Authority',            w: 200 },
  { key: 'serviceName',   label: 'Service Name',         w: 300 },
  { key: 'agentCode',     label: 'Agent Code',           w: 140 },
  { key: 'mode',          label: 'Mode',                 w: 120 },
  { key: 'submittedDate', label: 'Submitted Date',       w: 150 },
  { key: 'serviceReqNo',  label: 'Service Request No.',  w: 170 },
  { key: 'declarationNo', label: 'Declaration No.',      w: 170 },
  { key: 'bolAwbNo',      label: 'BOL / AWB No.',        w: 150 },
];

const DEFAULT_VISIBLE_COLS = ['appRefNo', 'authority', 'serviceName', 'agentCode', 'mode', 'submittedDate'];

const SEARCH_FIELDS = ['Application Ref No', 'Service Req Name', 'BOL / AWB', 'Declaration No'];
const SERVICE_NAMES = Array.from(new Set(MOCK_DATA.map(r => r.serviceName)));
const AGENT_CODES = Array.from(new Set(MOCK_DATA.map(r => r.agentCode)));

/* Sticky = App Status (163) + Pay Status (150) + Actions (72) */
const STICKY_W = 362; // Pay(150) + App(140) + Actions(72)

export default function PermitsCertificatesPage({ onClose, createPrefill }: Props) {
  const [showCreate, setShowCreate]         = useState(false);
  const [page, setPage]                     = useState(1);
  const [pageSize, setPageSize]             = useState(8);
  const [searchType, setSearchType]         = useState(SEARCH_FIELDS[0]);
  const [searchValue, setSearchValue]       = useState('');
  const [fieldDropOpen, setFieldDropOpen]   = useState(false);
  const [afOpen, setAfOpen]                 = useState(false);
  const [openFlyout, setOpenFlyout]         = useState<number | null>(null);
  const [showColModal, setShowColModal]     = useState(false);
  const [appStatusFilter, setAppStatusFilter]   = useState<AppStatus | null>(null);
  const [payStatusFilter, setPayStatusFilter]   = useState<PaymentStatus | null>(null);
  const [authorityFilter, setAuthorityFilter]   = useState('');
  const [serviceNameFilter, setServiceNameFilter] = useState('');
  const [agentCodeFilter, setAgentCodeFilter]   = useState('');

  const [visibleCols, setVisibleCols] = useState<string[]>(DEFAULT_VISIBLE_COLS);
  const visibleHeaders = visibleCols.map(k => COL_DEFS.find(c => c.key === k)!).filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  /* AF state */
  const [afAuthority, setAfAuthority] = useState('');
  const [afAppRef,    setAfAppRef]    = useState('');
  const [afService,   setAfService]   = useState('');
  const [afAgentCode, setAfAgentCode] = useState('');
  const [afAppStatus, setAfAppStatus] = useState('');
  const [afMode,      setAfMode]      = useState('');
  const [afDateFrom,  setAfDateFrom]  = useState('');
  const [afDateTo,    setAfDateTo]    = useState('');
  const resetAF = () => {
    setAfAuthority(''); setAfAppRef(''); setAfService(''); setAfAgentCode(''); setAfAppStatus('');
    setAfMode(''); setAfDateFrom(''); setAfDateTo('');
  };

  const filtered = MOCK_DATA.filter(r => {
    if (appStatusFilter && r.appStatus !== appStatusFilter) return false;
    if (payStatusFilter && r.paymentStatus !== payStatusFilter) return false;
    if (authorityFilter && r.authority !== authorityFilter) return false;
    if (serviceNameFilter && r.serviceName !== serviceNameFilter) return false;
    if (agentCodeFilter && r.agentCode !== agentCodeFilter) return false;
    if (!searchValue) return true;
    const val =
      searchType === 'Application Ref No' ? r.appRefNo :
      searchType === 'Service Req Name'   ? r.serviceName :
      searchType === 'BOL / AWB'          ? r.bolAwbNo :
      r.declarationNo;
    return val.toLowerCase().includes(searchValue.toLowerCase());
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + STICKY_W;

  return (
    <>
      {showCreate && <PermitsCreatePage onClose={() => setShowCreate(false)} prefill={createPrefill} initialStep={createPrefill ? 'cargo' : undefined} />}
      {showColModal && (
        <ManageColumnsModal
          columns={COL_DEFS}
          visible={visibleCols}
          lockedColumns={[
            { key: '_appStatus', label: 'Application Status' },
            { key: '_payStatus', label: 'Payment Status' },
            { key: '_action',    label: 'Actions' },
          ]}
          onSave={setVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Header onHome={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-8">
          {/* Breadcrumb + agent banner */}
          <div className="flex items-center justify-between mt-[16px] mb-[8px]">
            <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
              <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
              <span className="text-[#dc3545] px-[4px]">/</span>
              <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Service Catalog</span>
              <span className="text-[#dc3545] px-[4px]">/</span>
              <span className="text-[#111838] font-medium">Permits / Certificates</span>
            </div>
            <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]"
              style={{ background: '#e2ebf9', fontFamily: font }}>
              AE-1019056- Dubai Customs - Test LLC
            </div>
          </div>

          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[20px]" style={{ fontFamily: font }}>
            Permits / Certificates
          </h1>

          {/* Toolbar */}
          <div className="flex items-center gap-[10px] mb-[12px] flex-wrap">
            {/* Advanced Filters */}
            <button
              onClick={() => setAfOpen(o => !o)}
              className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors ${
                afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
              }`}
              style={{ fontFamily: font }}
            >
              Advanced Filters
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Search bar */}
            <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-visible relative">
              <div
                className="flex items-center gap-[6px] px-[12px] border-r border-[#d5ddfb] select-none cursor-pointer"
                style={{ minWidth: 180 }}
                onClick={() => setFieldDropOpen(o => !o)}
              >
                <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{searchType}</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                  <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {fieldDropOpen && (
                  <div
                    className="absolute left-0 top-[50px] bg-white rounded-[8px] py-[4px] z-[200]"
                    style={{ minWidth: 220, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {SEARCH_FIELDS.map(f => (
                      <button key={f} className="w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] group transition-colors"
                        onClick={() => { setSearchType(f); setSearchValue(''); setFieldDropOpen(false); }}>
                        <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{f}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center px-[12px] gap-[8px]">
                <input
                  type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className="w-[180px] text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none"
                  style={{ fontFamily: font }}
                />
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
                </svg>
              </div>
            </div>

            {/* Authority Name dropdown */}
            <FilterDropdown label="Authority Name" value={authorityFilter} onChange={setAuthorityFilter} options={AUTHORITIES} />

            {/* Service Name dropdown */}
            <FilterDropdown label="Service Name" value={serviceNameFilter} onChange={setServiceNameFilter} options={SERVICE_NAMES} />

            {/* Agent Code dropdown */}
            <FilterDropdown label="Agent Code" value={agentCodeFilter} onChange={setAgentCodeFilter} options={AGENT_CODES} />

            <div className="flex-1" />

            <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2] hover:opacity-80 px-[8px]" style={{ fontFamily: font }}>
              Need Help
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7">
                <circle cx="10" cy="10" r="7.5" />
                <path d="M10 14v-1" strokeLinecap="round" />
                <path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              + Create New
            </button>
          </div>

          {/* Advanced Filters panel */}
          {afOpen && (
            <div className="relative bg-white rounded-[8px] border border-[#d5ddfb] p-5 mb-[12px]"
              style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
              <button onClick={() => setAfOpen(false)}
                className="absolute top-3 right-3 size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
              <div className="grid grid-cols-4 gap-4 pt-2">
                <AFDropdown label="Authority name"       value={afAuthority} onChange={setAfAuthority}
                  options={AUTHORITIES} />
                <AFInput    label="Application Number"   value={afAppRef}    onChange={setAfAppRef} />
                <AFDropdown label="Service name"         value={afService}   onChange={setAfService}
                  options={SERVICE_NAMES} />
                <AFDropdown label="Agent Code"           value={afAgentCode} onChange={setAfAgentCode}
                  options={AGENT_CODES} />
                <AFDropdown label="Application Status"   value={afAppStatus} onChange={setAfAppStatus}
                  options={Object.keys(APP_STATUS_STYLE)} />
                <AFDropdown label="Mode"                 value={afMode}      onChange={setAfMode}
                  options={['Sea', 'Air', 'Land', 'NA']} />
                <AFDate     label="From Date"            value={afDateFrom}  onChange={setAfDateFrom} />
                <AFDate     label="To Date"              value={afDateTo}    onChange={setAfDateTo} />
                <div className="flex gap-2 self-end">
                  <button onClick={resetAF}
                    data-secondary-btn className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white"
                    style={{ fontFamily: font }}>Reset</button>
                  <button className="h-[44px] px-5 rounded-[4px] text-[15px] text-white"
                    style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
                </div>
              </div>
            </div>
          )}

          {/* Columns button */}
          <div className="flex items-center justify-end mb-[12px]">
            <button
              onClick={() => setShowColModal(true)}
              className="h-[40px] px-[14px] flex items-center gap-[8px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2" y="4" width="16" height="3" rx="1" />
                <rect x="2" y="9" width="16" height="3" rx="1" />
                <rect x="2" y="14" width="10" height="3" rx="1" />
              </svg>
              Columns
            </button>
          </div>

          {/* Table */}
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

                    {/* Sticky: Payment Status */}
                    <th style={{
                      position: 'sticky', right: 72 + 140, width: 150, minWidth: 150,
                      background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                      boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                    }}>
                      <StatusFilterHeader
                        label="Pay. Status"
                        options={Object.keys(PAY_STATUS_STYLE) as PaymentStatus[]}
                        value={payStatusFilter}
                        onChange={v => setPayStatusFilter(v as PaymentStatus | null)}
                        colorMap={PAY_STATUS_COLORS}
                      />
                    </th>

                    {/* Sticky: Application Status */}
                    <th style={{
                      position: 'sticky', right: 72, width: 140, minWidth: 140,
                      background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                      zIndex: 2,
                    }}>
                      <StatusFilterHeader
                        label="App. Status"
                        options={Object.keys(APP_STATUS_STYLE) as AppStatus[]}
                        value={appStatusFilter}
                        onChange={v => setAppStatusFilter(v as AppStatus | null)}
                        colorMap={APP_STATUS_COLORS}
                      />
                    </th>

                    {/* Sticky: Actions */}
                    <th style={{
                      position: 'sticky', right: 0, width: 72, minWidth: 72,
                      background: '#a6c2e9', padding: '10px 8px', textAlign: 'center',
                      borderRadius: '0 8px 0 0', zIndex: 2,
                    }}>
                      <span className="text-[16px] font-medium text-[#051937]">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((row, i) => {
                    const ast = APP_STATUS_STYLE[row.appStatus];
                    const pst = PAY_STATUS_STYLE[row.paymentStatus];
                    return (
                      <tr key={row.appRefNo}>
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
                              style={col.key === 'appRefNo' ? { color: '#1360d2', fontWeight: 500 } : { color: '#0e1b3d' }}
                            >
                              {row[col.key as keyof Permit]}
                            </span>
                          </td>
                        ))}

                        {/* Sticky: Payment Status */}
                        <td style={{
                          background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff',
                          position: 'sticky', right: 72 + 140, width: 150, minWidth: 150,
                          boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                          zIndex: openFlyout === i ? 49 : 1,
                        }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                            style={{ background: pst.bg, color: pst.color, fontFamily: font }}>
                            {row.paymentStatus}
                          </span>
                        </td>

                        {/* Sticky: App Status */}
                        <td style={{
                          background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff',
                          position: 'sticky', right: 72, width: 140, minWidth: 140,
                          zIndex: openFlyout === i ? 49 : 1,
                        }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                            style={{ background: ast.bg, color: ast.color, fontFamily: font }}>
                            {row.appStatus}
                          </span>
                        </td>

                        {/* Sticky: Actions */}
                        <td style={{
                          background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle',
                          borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                          position: 'sticky', right: 0, width: 72, minWidth: 72,
                          zIndex: openFlyout === i ? 50 : 1,
                        }}>
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                              className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                              <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                                <circle cx="10" cy="4"  r="1.7" />
                                <circle cx="10" cy="10" r="1.7" />
                                <circle cx="10" cy="16" r="1.7" />
                              </svg>
                            </button>
                            {openFlyout === i && (
                              <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                                style={{ top: 36, width: 168, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                                {['View Details', 'Download', 'Amend Request', 'Cancel'].map(label => (
                                  <button key={label}
                                    className="w-full px-[14px] py-[10px] text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9] transition-colors"
                                    style={{ fontFamily: font }}
                                    onClick={() => setOpenFlyout(null)}>
                                    {label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={visibleHeaders.length + 3}
                        className="text-center py-16 text-[#8f94ae] text-[16px]" style={{ fontFamily: font }}>
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </>
  );
}
