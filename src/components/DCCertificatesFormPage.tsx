import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

function DirhamIcon({ size = 14, color = '#0e1b3d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 17 / 20)} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <g clipPath="url(#drhm)">
        <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="drhm"><rect width="20" height="17" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

// ─── Certificate Service Types ────────────────────────────────────────────────
const CERT_SERVICE_TYPES = [
  { name: 'NOC for Customs Broker License - New',             fees: '700.00', description: 'This service provides customers to obtain No Objection Certificate for Customs Broker to Issue New License', requirements: '1. Initial approval for the trade name & activity from DED' },
  { name: 'NOC for Customs Broker License - New Branch',      fees: '300.00', description: 'Obtain a No Objection Certificate to open a new branch for an existing Customs Broker License', requirements: 'Existing broker license, Branch address proof, Emirates ID copy, Trade license' },
  { name: 'NOC for Customs Broker License - Change of Owner', fees: '400.00', description: 'Obtain a No Objection Certificate to transfer ownership of a Customs Broker License', requirements: 'Current license copy, New owner Emirates ID, MOU or transfer agreement, Trade license' },
  { name: 'NOC for Customs Broker License - Add New Partner', fees: '350.00', description: 'Obtain a No Objection Certificate to add a new partner to an existing Customs Broker License', requirements: 'Existing license copy, New partner Emirates ID, Partnership agreement, Trade license' },
  { name: 'Landing Certificate',                               fees: '100.00', description: 'Official certificate confirming that goods have been landed and received at the destination port', requirements: 'Bill of lading, Commercial invoice, Packing list, Declaration number' },
  { name: 'Vehicle Clearance Certificate(VCC)',                fees: '200.00', description: 'Certificate confirming that a vehicle has been cleared through Dubai Customs with all duties paid', requirements: 'Vehicle chassis number, Customs declaration, Invoice, Importer trade license' },
  { name: 'Clearance Letter',                                  fees: '100.00', description: 'This service provides customers to obtain:\n- Clearance Certificate - Termination\n- Clearance Certificate - For company records\n- Clearance Certificate - Change ownership\n- Clearance Certificate - Add Partner\n- Clearance Certificate - Business Code Cancellation', requirements: '1. Passport copy of the owner or authorized person\n2. Letter from the company with authorized person details\n3. If not available: Power of Attorney or Share Certificate' },
  { name: 'VAT Registration Letter',                           fees: '100.00', description: 'Official letter confirming VAT registration status issued by Dubai Customs', requirements: 'TRN, Trade license, Emirates ID, Application form' },
  { name: 'Authorization to Issue Invoice in FZ',              fees: '250.00', description: 'Authorization certificate for Free Zone businesses to issue customs invoices', requirements: 'Free Zone license, Emirates ID, Authorized signatory details' },
  { name: 'No Objection from Special Tasks Department',        fees: '300.00', description: 'No Objection Certificate issued by the Special Tasks Department', requirements: 'Trade license, Emirates ID, Description of goods/activity' },
];

const DOCUMENT_TYPES  = ['Bill Number', 'Airway Bill Number'];
const PAYMENT_OPTIONS = ['543755', '46328', '78941', '23156'];

// ─── Float Dropdown ────────────────────────────────────────────────────────────
function FloatDropdown({ label, required, value, onChange, options, className, readOnly }: {
  label?: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; className?: string; readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref  = useRef<HTMLDivElement>(null);
  const iRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => iRef.current?.focus(), 50); } }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className={`dc-float-dropdown ${open ? 'dc-float-dropdown--open' : ''} ${value ? 'dc-float-dropdown--has-value' : ''} ${readOnly ? 'dc-float-dropdown--disabled' : ''} ${className ?? ''}`}>
      {open && !readOnly ? (
        <div className="dc-float-dropdown__trigger dc-float-dropdown__trigger--search">
          <input ref={iRef} className="dc-float-dropdown__inline-search" placeholder={value || 'Select…'} value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      ) : (
        <button type="button" className="dc-float-dropdown__trigger" onClick={() => !readOnly && setOpen(true)} disabled={readOnly}>
          {value || <span className="dc-float-dropdown__placeholder"> </span>}
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}
      {label && <label className="dc-float-dropdown__label">{label}{required && <span className="dc-req"> *</span>}</label>}
      {open && !readOnly && (
        <div className="dc-float-dropdown__menu">
          <div className="dc-float-dropdown__options">
            {filtered.length > 0 ? filtered.map(opt => (
              <div key={opt} className={`dc-float-dropdown__option ${value === opt ? 'dc-float-dropdown__option--selected' : ''}`}
                onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}>{opt}</div>
            )) : <div className="dc-float-dropdown__no-results">No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── File Upload Row ──────────────────────────────────────────────────────────
function FileUploadRow() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const add = (fl: FileList) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);
  const rm  = (i: number) => setFiles(p => p.filter((_, j) => j !== i));
  return (
    <div>
      {files.length > 0 && (
        <div className="dc-file-grid" style={{ marginBottom: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="dc-file-input-wrap">
              <svg className="dc-file-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="dc-file-input-text">{f}</span>
              <div className="dc-file-input-trail">
                <button className="dc-file-tag__remove" type="button" onClick={() => rm(i)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={`dc-dropzone${dragging ? ' dc-dropzone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}>
        <div className="dc-dropzone__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <span className="dc-dropzone__text">Drag and drop files here</span>
        <span className="dc-dropzone__or">-Or-</span>
        <button className="dc-dropzone__browse" type="button" onClick={() => ref.current?.click()}>Browse File</button>
        <input ref={ref} type="file" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) { add(e.target.files); e.target.value = ''; } }} />
      </div>
    </div>
  );
}

// ─── Success / Submitted view (Figma 187-7865) ───────────────────────────────
function SubmittedView({ onBack, consigneeType, consigneeCode }: {
  onBack: () => void; consigneeType: string; consigneeCode: string;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '52px 40px', fontFamily: font,
    }}>
      {/* Green checkmark circle */}
      <div style={{
        width: 84, height: 84, borderRadius: '50%', background: '#27AE60',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ color: '#27AE60', fontSize: 22, fontWeight: 700, marginBottom: 28, fontFamily: font }}>
        Landing Certificate Request submitted Successfully
      </h2>

      {/* Info card */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 40px 24px',
        maxWidth: 860, width: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        marginBottom: 36,
      }}>
        {/* Message text */}
        <p style={{ color: '#697498', fontSize: 14, marginBottom: 10, fontFamily: font }}>
          Dear Customer Thank You For Using&nbsp; Service Request Web Application.
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 14, fontWeight: 700, marginBottom: 10, fontFamily: font }}>
          Your Request ForLanding Certificate Request Will Be Sent For Approval.
        </p>
        <p style={{ color: '#697498', fontSize: 14, marginBottom: 24, fontFamily: font }}>
          Please Find Below Details For Future Reference
        </p>

        {/* 4-column detail row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px', textAlign: 'left', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Request No.</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>R00723-513232</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Document No.</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>R00723-513232</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Consignee Type</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>{consigneeType || 'Testname'}</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Consignee Code</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0E1B3D', fontFamily: font }}>{consigneeCode || 'Testcompany'}</p>
          </div>
        </div>

        {/* Note */}
        <p style={{ fontSize: 13, color: '#697498', lineHeight: 1.6, fontFamily: font, textAlign: 'center' }}>
          {'Note: Please Take The Printout Of The Submission Form To The Customs Location Of Landing The Cargo For Obtaining The Landing Certificate The Landing Certificate Fee Of '}
          <DirhamIcon size={13} color="#697498" />
          {'10 Will Be Collected From Your CDR Account On Issuance Of The Certificate'}
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 16 }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack} style={{ minWidth: 148 }}>
          Back To Listing
        </button>
        <button type="button" className="dc-btn dc-btn--outline" onClick={() => window.print()} style={{ minWidth: 120 }}>
          Print
        </button>
        <button type="button" className="dc-btn dc-btn--outline" style={{ minWidth: 148, color: '#1360D2', borderColor: '#1360D2', fontWeight: 700 }}>
          View Request
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DCCertificatesFormPage({ onBack }: { onBack: () => void }) {
  const [certServiceType, setCertServiceType] = useState('');
  const isLandingCert = certServiceType === 'Landing Certificate';

  // Basic Information (Landing Certificate)
  const consigneeType = 'AE-1019056';    // auto-populated
  const consigneeCode = 'Dubai Customs - Test LLC'; // auto-populated
  const [documentType,   setDocumentType]   = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [houseBillNo,    setHouseBillNo]    = useState('');
  const [showBillInfo,   setShowBillInfo]   = useState(false);
  const [goodDesc,       setGoodDesc]       = useState('');
  const [purpose,        setPurpose]        = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const selectedCert = CERT_SERVICE_TYPES.find(t => t.name === certServiceType) ?? null;

  const handleReset = () => {
    setCertServiceType(''); setDocumentType(''); setDocumentNumber('');
    setHouseBillNo(''); setShowBillInfo(false); setGoodDesc(''); setPurpose(''); setPaymentAccount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">
        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Certificates</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">{submitted ? 'Request Submitted' : 'New Request'}</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <h2 className="dc-info-header__title">DC - Certificates</h2>
        </div>

        {/* ── Submitted state ── */}
        {submitted ? (
          <SubmittedView onBack={onBack} consigneeType={consigneeType} consigneeCode={consigneeCode} />
        ) : (
          <div className="dc-form-card">

            {/* ── Section 1: Service Details ── */}
            <div className="dc-form-section dc-basic-info-section">
              <div className="dc-basic-info-header">
                <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Details</h4>
              </div>
              <div className="dc-basic-info-cards">
                <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Name</span>
                      <span className="dc-basic-info-card__value">DC - Certificates</span>
                    </div>
                  </div>
                  <div className="dc-basic-info-card" style={{ flex: 1 }}>
                    <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <div className="dc-basic-info-card__body">
                      <span className="dc-basic-info-card__label">Service Description</span>
                      <span className="dc-basic-info-card__value">
                        This service allows customers to request various types of certificates and official documents from Dubai Customs, including NOCs, landing certificates, clearance letters, and other regulatory documents.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 2: Service Type Details ── */}
            <div className="dc-form-section dc-basic-info-section">
              <div className="dc-basic-info-header">
                <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
              </div>
              <div className="dc-basic-info-cards">
                <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 'calc(50% - 6px)' }}>
                    <FloatDropdown label="Service Type" required value={certServiceType}
                      onChange={v => { setCertServiceType(v); setShowBillInfo(false); setDocumentType(''); setDocumentNumber(''); setHouseBillNo(''); }}
                      options={CERT_SERVICE_TYPES.map(t => t.name)} />
                  </div>
                  {selectedCert && !isLandingCert && (
                    <div className="dc-basic-info-card" style={{ flex: 1, height: 56, alignItems: 'center' }}>
                      <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      </div>
                      <div className="dc-basic-info-card__body">
                        <span className="dc-basic-info-card__label">Charges</span>
                        <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">{selectedCert.fees}</span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedCert && !isLandingCert && (
                  <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                    <div className="dc-basic-info-card" style={{ flex: 1 }}>
                      <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div className="dc-basic-info-card__body">
                        <span className="dc-basic-info-card__label">Service Type Description</span>
                        <span className="dc-basic-info-card__value" style={{ whiteSpace: 'pre-line' }}>{selectedCert.description}</span>
                      </div>
                    </div>
                    {selectedCert.requirements && (
                      <div className="dc-basic-info-card" style={{ flex: 1 }}>
                        <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                        </div>
                        <div className="dc-basic-info-card__body">
                          <span className="dc-basic-info-card__label">Requirements</span>
                          <span className="dc-basic-info-card__value" style={{ whiteSpace: 'pre-line' }}>{selectedCert.requirements}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Landing Certificate sections ── */}
            {isLandingCert && (<>

              {/* ── Basic Information ── */}
              <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Basic Information</h4>

                {/* Row 1: Consignee Type (auto) + Consignee Code (auto) */}
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={consigneeType} readOnly
                        style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                      <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Type</label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={consigneeCode} readOnly
                        style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                      <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Code</label>
                    </div>
                  </div>
                </div>

                {/* Row 2: Document Type + Document Number */}
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <FloatDropdown label="Document Type" value={documentType} onChange={setDocumentType} options={DOCUMENT_TYPES} />
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} />
                      <label className="dc-float-label">Document Number <span className="dc-req">*</span></label>
                    </div>
                  </div>
                </div>

                {/* Row 3: House Bill No. + Search */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div className="dc-float-wrapper dc-field--half" style={{ flex: '0 0 calc(50% - 8px)', maxWidth: 'calc(50% - 8px)' }}>
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={houseBillNo} onChange={e => setHouseBillNo(e.target.value)} />
                      <label className="dc-float-label">House Bill No.</label>
                    </div>
                  </div>
                  <button type="button" className="dc-btn dc-btn--blue"
                    style={{ height: 56, paddingLeft: 28, paddingRight: 28, marginTop: 0 }}
                    onClick={() => setShowBillInfo(true)}>
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              {/* ── Bill Information (post-Search) ── */}
              {showBillInfo && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Bill Information</h4>

                  {/* 5-column read-only row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 20 }}>
                    <div><p className="dc-bill-field__label">Bill of Entry No.</p><p className="dc-bill-field__value">1013245459</p></div>
                    <div><p className="dc-bill-field__label">Bill Date</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                    <div><p className="dc-bill-field__label">Bill of Lading No.</p><p className="dc-bill-field__value">BOL1211324</p></div>
                    <div><p className="dc-bill-field__label">Vessel</p><p className="dc-bill-field__value">Testname</p></div>
                    <div><p className="dc-bill-field__label">Voyage</p><p className="dc-bill-field__value">324422</p></div>
                  </div>

                  {/* Second read-only row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 24 }}>
                    <div><p className="dc-bill-field__label">Arrived From</p><p className="dc-bill-field__value">China</p></div>
                    <div><p className="dc-bill-field__label">Arrived On</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                    <div><p className="dc-bill-field__label">Marks &amp; Numbers</p><p className="dc-bill-field__value">N/A</p></div>
                  </div>

                  {/* Editable: Good Description + Purpose in one row */}
                  <div className="dc-form-row" style={{ marginBottom: 0 }}>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={goodDesc} onChange={e => setGoodDesc(e.target.value)} />
                        <label className="dc-float-label">Good Description</label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={purpose} onChange={e => setPurpose(e.target.value)} />
                        <label className="dc-float-label">Purpose<span className="dc-req"> *</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Payment ── */}
              <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Payment</h4>
                <div style={{ width: 'calc(50% - 8px)' }}>
                  <FloatDropdown label="Payment Account" value={paymentAccount} onChange={setPaymentAccount} options={PAYMENT_OPTIONS} />
                </div>
              </div>

            </>)}

          </div>
        )}
      </div>

      {/* ── Floating bottom bar ── */}
      {!submitted && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 40px',
        }}>
          {/* Left: back to listing */}
          <button type="button" onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              height: 44, padding: '0 20px', borderRadius: 6,
              border: '1.5px solid #1360d2', background: '#fff',
              fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7"/>
            </svg>
            Back to Listing
          </button>

          {/* Right: Reset + Submit */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="dc-btn dc-btn--outline"
              style={{ height: 44, padding: '0 24px' }}
              onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="dc-btn dc-btn--blue"
              style={{ height: 44, padding: '0 32px' }}
              onClick={() => setSubmitted(true)}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
