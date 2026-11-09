import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Dh from './Dh';
import { DateInput } from './DatePicker';
import '../dc-form.css';

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

const font = "'Dubai', sans-serif";

const AUTOFILL_USER = {
  name: 'Ahmed Al Mansoori',
  company: 'Dubai Trade LLC',
  contactPerson: 'Ahmed Al Mansoori',
  email: 'ahmed.almansoori@dubaitrade.ae',
  phone: '42123456',
  mobile: '551234567',
};

/* ═══════════════════════════════════════════════════════════════════════════
   Shared micro-components
═══════════════════════════════════════════════════════════════════════════ */

/** Identical to GenericServiceFormPage's FloatDropdown */
function FloatDropdown({ label, required, value, onChange, options, className }: {
  label?: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; className?: string;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref  = useRef<HTMLDivElement>(null);
  const iRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch(''); }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => iRef.current?.focus(), 50); } }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className={`dc-float-dropdown${open ? ' dc-float-dropdown--open' : ''}${value ? ' dc-float-dropdown--has-value' : ''}${className ? ' ' + className : ''}`}>
      {open ? (
        <div className="dc-float-dropdown__trigger dc-float-dropdown__trigger--search">
          <input ref={iRef} className="dc-float-dropdown__inline-search" placeholder={value || 'Select…'}
            value={search} onChange={e => setSearch(e.target.value)} />
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      ) : (
        <button type="button" className="dc-float-dropdown__trigger" onClick={() => setOpen(true)}>
          {value || <span className="dc-float-dropdown__placeholder"> </span>}
          <svg className="dc-float-dropdown__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}
      {label && <label className="dc-float-dropdown__label">{label}{required && <span className="dc-req"> *</span>}</label>}
      {open && (
        <div className="dc-float-dropdown__menu">
          <div className="dc-float-dropdown__options">
            {filtered.length > 0 ? filtered.map(opt => (
              <div key={opt} className={`dc-float-dropdown__option${value === opt ? ' dc-float-dropdown__option--selected' : ''}`}
                onMouseDown={() => { onChange(opt); setOpen(false); setSearch(''); }}>{opt}</div>
            )) : <div className="dc-float-dropdown__no-results">No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Identical to GenericServiceFormPage's FileUploadRow */
function FileUploadRow() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const add = (fl: FileList) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);
  const rm  = (i: number)    => setFiles(p => p.filter((_, j) => j !== i));
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

function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

function InfoCard({ iconColor, icon, label, value, style }: {
  iconColor: string; icon: React.ReactNode; label: string; value: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div className="dc-basic-info-card" style={{ flex: 1, ...style }}>
      <div className={`dc-basic-info-card__icon dc-basic-info-card__icon--${iconColor}`}>{icon}</div>
      <div className="dc-basic-info-card__body">
        <span className="dc-basic-info-card__label">{label}</span>
        <span className="dc-basic-info-card__value">{value}</span>
      </div>
    </div>
  );
}

const COUNTRY_CODES = [
  { code: '+971', flag: '🇦🇪' },
  { code: '+1',   flag: '🇺🇸' },
  { code: '+44',  flag: '🇬🇧' },
  { code: '+91',  flag: '🇮🇳' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+61',  flag: '🇦🇺' },
  { code: '+33',  flag: '🇫🇷' },
  { code: '+49',  flag: '🇩🇪' },
];

function PhoneField({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [cc, setCc]           = useState('+971');
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;

  return (
    <div className="dc-float-wrapper dc-field--half">
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'stretch',
        height: 56, width: '100%',
        border: `1px solid ${disabled ? '#e5e7eb' : focused ? '#1360D2' : '#D5DDFB'}`,
        borderRadius: 8, background: disabled ? '#f5f7fa' : '#fff',
        transition: 'border-color 150ms',
      }}>
        {/* Country code select */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <select
            value={cc}
            disabled={disabled}
            onChange={e => !disabled && setCc(e.target.value)}
            style={{
              height: '100%', border: 'none',
              borderRight: `1px solid ${disabled ? '#e5e7eb' : '#D5DDFB'}`,
              background: '#edf0f5',
              borderTopLeftRadius: 7, borderBottomLeftRadius: 7,
              paddingLeft: 10, paddingRight: 26,
              fontFamily: font, fontSize: 14, color: disabled ? '#9ca3af' : '#0e1b3d',
              cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none',
              WebkitAppearance: 'none', appearance: 'none',
            }}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2"
            style={{ position: 'absolute', right: 6, pointerEvents: 'none' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        {/* Number input */}
        <input
          placeholder=" "
          value={value}
          readOnly={disabled}
          onChange={e => !disabled && onChange(e.target.value)}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, height: '100%', border: 'none', outline: 'none',
            paddingLeft: 12, paddingRight: 16,
            paddingTop: floated ? 14 : 0,
            fontSize: 16, color: disabled ? '#9ca3af' : '#0e1b3d',
            fontFamily: font, background: 'transparent',
            cursor: disabled ? 'not-allowed' : undefined,
          }}
        />
        {/* Label: sits inside the input section; floats up within that same section */}
        <label style={{
          position: 'absolute',
          left: 106,
          top: floated ? 0 : '50%',
          transform: 'translateY(-50%)',
          fontSize: floated ? 12 : 16,
          color: floated ? (disabled ? '#9ca3af' : '#1360D2') : (disabled ? '#9ca3af' : '#000'),
          fontWeight: floated ? 500 : 400,
          background: floated ? (disabled ? '#f5f7fa' : '#fff') : 'transparent',
          padding: floated ? '0 4px' : '0',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 150ms ease',
        }}>{label}</label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Service config data
═══════════════════════════════════════════════════════════════════════════ */

const SERVICE_NAMES = [
  'Request Certificate',
  'Join Client Accreditation',
  'Request Reports',
  'Submit Voluntary Disclosure',
];

const CERT_TYPES = [
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

const CERT_DOCUMENT_TYPES  = ['Bill Number', 'Airway Bill Number'];
const CERT_PAYMENT_OPTIONS  = ['543755', '46328', '78941', '23156'];

const CTR_TYPES = [
  { name: 'Statistical Report',    fees: '100.00', description: 'Provides aggregate statistical data on customs transactions over a specified period.', requirements: 'Business code, Date range, Trade license' },
  { name: 'Declaration Report',    fees: '200.00', description: 'Provides detailed information on individual customs declarations within the requested period.', requirements: 'Declaration numbers, Date range, Business code' },
  { name: 'Summary Transactions',  fees: '150.00', description: 'A summarized overview of all customs transactions grouped by category or type.', requirements: 'Business code, Date range' },
  { name: 'Detailed Transactions', fees: '300.00', description: 'A full line-by-line breakdown of each customs transaction including duties, taxes, and fees.', requirements: 'Business code, Date range, Authorization letter' },
];


const DISCLOSURE_TYPES = ['Incorrect Declaration of Value', 'Incorrect Declaration of Origin', 'Incorrect HS Code', 'Under-Declaration of Goods', 'Prohibited Goods Declaration', 'Other'];

const IP_COMPLAINT_TYPES = [
  { name: 'Trademark',         fees: '5000.00', description: 'Submit a complaint regarding trademark infringement in trade activities at Dubai Customs.', requirements: 'Trademark registration certificate, Evidence of infringement, Passport copy, Authorization letter' },
  { name: 'Patent',            fees: '5000.00', description: 'Submit a complaint regarding patent infringement in imported or exported goods.', requirements: 'Patent registration certificate, Evidence of infringement, Technical specifications' },
  { name: 'Copyright',         fees: '3000.00', description: 'Submit a complaint regarding copyright infringement in goods passing through Dubai Customs.', requirements: 'Copyright registration, Proof of ownership, Evidence of infringement' },
  { name: 'Industrial Design', fees: '3000.00', description: 'Submit a complaint regarding industrial design rights infringement.', requirements: 'Design registration certificate, Evidence of infringement, Product images' },
];

const CUSTOMS_OPINION_TYPES = [
  { name: 'Tariff Classification', fees: '200.00', description: 'Request an official opinion on the tariff classification of goods under the harmonized system.', requirements: 'Detailed product description, Technical specifications, Samples if applicable' },
  { name: 'Customs Valuation',     fees: '200.00', description: 'Request an official opinion on the customs valuation method applicable to specific goods.', requirements: 'Commercial invoice, Valuation documents, Previous rulings if any' },
  { name: 'Rules of Origin',       fees: '200.00', description: 'Request an official opinion on the origin determination of goods.', requirements: 'Manufacturing process details, Bill of materials, Certificates of origin' },
];

const APPEAL_CUSTOMS_TYPES = [
  { name: 'Appeal Against Fine',           fees: '100.00', description: 'Submit a formal appeal against a customs fine or penalty imposed.', requirements: 'Original decision letter, Grounds for appeal, Supporting documents, Emirates ID' },
  { name: 'Appeal Against Seizure',        fees: '100.00', description: 'Submit a formal appeal against the seizure of goods by Dubai Customs.', requirements: 'Seizure notice, Proof of ownership, Grounds for appeal, Supporting documents' },
  { name: 'Appeal Against Classification', fees: '100.00', description: 'Submit a formal appeal against a tariff classification decision issued by customs.', requirements: 'Original classification decision, Technical evidence, Expert opinion' },
];

const GOODS_CLASSIFICATION_TYPES = [
  { name: 'Standard Classification', fees: '300.00', description: 'Request standard HS code classification for goods under the harmonized system.', requirements: 'Product description, Technical specifications, Product images or samples' },
  { name: 'Advance Ruling',          fees: '500.00', description: 'Request an advance binding ruling on HS code classification before importation.', requirements: 'Detailed product information, Technical documentation, Manufacturing process description' },
  { name: 'Review Classification',   fees: '200.00', description: 'Request a review of an existing HS code classification decision.', requirements: 'Current HS code, Justification for review, Supporting technical documents' },
];

const SERVICE_META: Record<string, { description: string; baseCharges: string; requirements: string }> = {
  'Request Certificate':                                 { description: 'This service allows clients to request various official customs certificates for their trade activities.', baseCharges: '100.00', requirements: 'Valid trade license, Original customs documents, Emirates ID' },
  'Join Client Accreditation':                           { description: 'This service allows clients to submit a request for enrollment in Dubai Customs Client Accreditation Program.', baseCharges: '200.00', requirements: 'Copy of trade license' },
  'Request Reports':                                     { description: 'This service allows customers to request a comprehensive transactions report from Dubai Customs.', baseCharges: '200.00', requirements: 'Trade license, Emirates ID, Customs file number, Date range' },
  'Submit Voluntary Disclosure':                         { description: 'This service allows clients to voluntarily disclose incorrect or incomplete customs declarations to Dubai Customs.', baseCharges: '0.00', requirements: 'Original declaration documents, Correction justification letter' },
  'Submit Trade Intellectual Property Complaint':        { description: 'This service allows rights holders to submit complaints against suspected IP rights violations in trade activities at Dubai Customs.', baseCharges: '5000.00', requirements: 'IPR registration certificate, Evidence of infringement, Passport copy, Authorization letter' },
  'Request Customs Opinion':                             { description: 'This service allows traders to obtain official opinions from Dubai Customs on classification, valuation or origin matters.', baseCharges: '200.00', requirements: 'Detailed query, Supporting documents, Trade license' },
  'Appeal Customs Decision':                             { description: 'This service allows clients to submit formal appeals against customs decisions, fines or rulings.', baseCharges: '100.00', requirements: 'Original decision letter, Supporting documents, Grounds for appeal, Emirates ID' },
  'Request Goods Classification':                        { description: 'This service allows traders to request official HS code classification for goods under the harmonized system.', baseCharges: '300.00', requirements: 'Product description, Technical specifications, Product samples or images, Manufacturer details' },
};

const REQ_NUMBERS: Record<string, string> = {
  'Request Certificate':                                 'R00723-513234',
  'Join Client Accreditation':                           'R00724-513235',
  'Request Reports':                                     'R00725-513236',
  'Submit Voluntary Disclosure':                         'R00726-513237',
  'Submit Trade Intellectual Property Complaint':        'R00727-513238',
  'Request Customs Opinion':                             'R00728-513239',
  'Appeal Customs Decision':                             'R00729-513240',
  'Request Goods Classification':                        'R00730-513241',
};

/* ═══════════════════════════════════════════════════════════════════════════
   Breadcrumb + Title shell (reused across all stages)
═══════════════════════════════════════════════════════════════════════════ */

function PageShell({ onBack, title, crumb, children }: {
  onBack: () => void; title: string; crumb: string; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Service Request</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">{crumb}</span>
          </span>
        </nav>
        <div className="dc-info-header">
          <h2 className="dc-info-header__title">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 2 — Payment Pending
═══════════════════════════════════════════════════════════════════════════ */

function PaymentPendingView({ service, serviceType, name, company, charges, reqNo, onBack, onPay }: {
  service: string; serviceType: string; name: string; company: string;
  charges: string; reqNo: string; onBack: () => void; onPay: () => void;
}) {
  const isFree = charges === '0.00';

  return (
    <PageShell onBack={onBack} title={service} crumb="Payment Pending">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Status alert banner */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10,
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div style={{ fontFamily: font, fontSize: 15, color: '#92400e', fontWeight: 600 }}>
            {isFree
              ? 'No payment required for this service. Click Submit Request to finalise.'
              : 'Your request has been submitted. Payment is pending — please complete payment to proceed.'}
          </div>
        </div>

        {/* Card 1 — Request Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Request Details</h4>
            <div className="dc-success-grid">
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--amber">Payment Pending</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
              <SField label="Applicant Name" value={name || '—'} />
              <SField label="Company" value={company || '—'} />
            </div>
          </div>
        </div>

        {/* Card 2 — Charges */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            <table className="dc-charges__table" style={{ marginBottom: 0 }}>
              <thead><tr><th>Charge Description</th><th>Amount (AED)</th></tr></thead>
              <tbody>
                {isFree
                  ? <tr><td>{service}</td><td>No Charge</td></tr>
                  : <tr><td>{service}{serviceType ? ` — ${serviceType}` : ''}</td><td>{charges}</td></tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total Payable</strong></td>
                  <td><strong>{isFree ? 'No Charge' : (<><DirhamIcon size={13} color="#0e1b3d" />{charges}</>)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

      {/* Floating bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 44, padding: '0 20px', borderRadius: 6,
          border: '1.5px solid #1360d2', background: '#fff',
          fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          Back to Listing
        </button>
        <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 36px' }} onClick={onPay}>
          {isFree ? 'Submit Request' : 'Make Payment'}
        </button>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 3 — Make Payment form
═══════════════════════════════════════════════════════════════════════════ */

function MakePaymentView({ service, serviceType, charges, reqNo, onBack, onComplete }: {
  service: string; serviceType: string; charges: string;
  reqNo: string; onBack: () => void; onComplete: (mode: string) => void;
}) {
  const [paymentMode, setPaymentMode] = useState('Credit Card');
  const [bankRef, setBankRef]         = useState('');
  const [remarks, setRemarks]         = useState('');

  return (
    <PageShell onBack={onBack} title="Make Payment" crumb="Make Payment">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Card 1 — Request Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Request Details</h4>
            <div className="dc-success-grid">
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--amber">Payment Pending</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
            </div>
          </div>
        </div>

        {/* Card 2 — Charges */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            <table className="dc-charges__table" style={{ marginBottom: 0 }}>
              <thead><tr><th>Charge Description</th><th>Amount (AED)</th></tr></thead>
              <tbody>
                <tr>
                  <td>{service}{serviceType ? ` — ${serviceType}` : ''}</td>
                  <td>{charges}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr><td><strong>Total Payable</strong></td><td><strong><DirhamIcon size={13} color="#0e1b3d" />{charges}</strong></td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Card 3 — Payment Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Payment Details</h4>

            <div className="dc-form-row">
              {/* Total Amount — read-only */}
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={`AED ${charges}`} readOnly
                    style={{ background: '#f5f7fa', cursor: 'default', color: '#697498' }} />
                  <label className="dc-float-label">Total Amount</label>
                </div>
              </div>
              {/* Payment Mode */}
              <div style={{ width: 'calc(50% - 6px)' }}>
                <FloatDropdown label="Payment Mode" required value={paymentMode} onChange={setPaymentMode}
                  options={['Credit Card', 'Duty Account', 'Online Banking', 'Cash Deposit']} />
              </div>
            </div>

            <div className="dc-form-row">
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={bankRef} onChange={e => setBankRef(e.target.value)} />
                  <label className="dc-float-label">Bank Reference No.</label>
                </div>
              </div>
              <div className="dc-float-wrapper dc-field--half">
                <div className="dc-float-field">
                  <input className="dc-float-input" placeholder=" " value={remarks} onChange={e => setRemarks(e.target.value)} />
                  <label className="dc-float-label">Remarks</label>
                </div>
              </div>
            </div>

            {/* Payment summary box — identical to CWLPaymentPage */}
            <div style={{
              background: '#f0f5ff', border: '1px solid #d5ddfb', borderRadius: 10,
              padding: '20px 24px', marginTop: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Total Amount Payable</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0E1B3D', fontFamily: font, display: 'flex', alignItems: 'center', gap: 6 }}><DirhamIcon size={20} color="#0E1B3D" />{charges}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#697498', marginBottom: 4, fontFamily: font }}>Payment Mode</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1360D2', fontFamily: font }}>{paymentMode}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" onClick={onBack} style={{
          height: 44, padding: '0 20px', borderRadius: 6,
          border: '1.5px solid #d5ddfb', background: '#fff',
          fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
        }}>
          Back
        </button>
        <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 36px' }}
          onClick={() => onComplete(paymentMode)}>
          Complete Payment
        </button>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Stage 4 — Request in Process (success / final)
═══════════════════════════════════════════════════════════════════════════ */

function RequestInProcessView({ service, serviceType, name, company, email, subject, charges, reqNo, paymentMode, onBack }: {
  service: string; serviceType: string; name: string; company: string;
  email: string; subject: string; charges: string; reqNo: string;
  paymentMode: string; onBack: () => void;
}) {
  const [bannerOpen, setBannerOpen] = useState(true);
  const isFree = charges === '0.00';

  return (
    <PageShell onBack={onBack} title={service} crumb="Request Submitted">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Card 1 — Request Details with success banner */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            {bannerOpen && (
              <div className="dc-success-alert">
                <div className="dc-success-alert__left">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#276749', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="dc-success-alert__title">Request is under process</div>
                </div>
                <button type="button" className="dc-success-alert__close" onClick={() => setBannerOpen(false)}>×</button>
              </div>
            )}
            <div className="dc-success-grid">
              <SField label="Request Number" value={reqNo} />
              <SField label="Request Status" value={<span className="dc-badge dc-badge--draft">Under Process</span>} />
              <SField label="Service" value={service} />
              {serviceType && <SField label="Service Type" value={serviceType} />}
              <SField label="Name" value={name || 'Testname'} />
              <SField label="Company" value={company || 'Testcompany'} />
              <SField label="Email" value={email || 'user@example.com'} />
              {subject && <SField label="Subject" value={subject} />}
            </div>
          </div>
        </div>

        {/* Card 2 — Charges Summary */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Charges Summary</h4>
            {!isFree && (
              <div className="dc-success-grid" style={{ marginBottom: 20 }}>
                <SField label="Payment Mode" value={paymentMode} />
                <SField label="Payment Status" value="Success" />
                <SField label="Receipt No." value="Z-12323" />
                <SField label="Payment Reference No." value="5900080808" />
              </div>
            )}
            <hr className="dc-success-divider" />
            <table className="dc-charges__table">
              <thead><tr><th>Charge</th><th>Amount</th></tr></thead>
              <tbody>
                <tr>
                  <td>{service}{serviceType ? ` — ${serviceType}` : ''}</td>
                  <td>{isFree ? 'No Charge' : (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DirhamIcon size={13} color="#0e1b3d" />{charges}</span>)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total Amount</strong></td>
                  <td><strong>{isFree ? 'No Charge' : (<><DirhamIcon size={13} color="#0e1b3d" />{charges}</>)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Card 3 — Transaction History (only when payment was made) */}
        {!isFree && (
          <div className="dc-form-card">
            <div className="dc-result-txn-card">
              <div className="dc-result-txn-card__header">Transaction History</div>
              <div className="dc-result-txn-card__body">
                <div className="dc-success-grid">
                  <SField label="Initiated By" value="AE-1019056" />
                  <SField label="Request No." value={reqNo} />
                  <SField label="Amount" value={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><DirhamIcon size={13} color="#0e1b3d" />{charges}</span>} />
                  <SField label="Transaction Status" value="Success" />
                  <SField label="DEG Transaction No" value="590000237140228" />
                  <SField label="Transaction Date" value="Fri May 15 00:00:00 GST 2026" />
                  <SField label="Payment Status" value="Success" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, padding: '8px 0 20px' }}>
          <button className="dc-btn dc-btn--outline" onClick={onBack}>Back to Listing</button>
          <button className="dc-btn dc-btn--outline" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main component — Stage 1 (form) + stage routing
═══════════════════════════════════════════════════════════════════════════ */

type Stage = 'form' | 'pending' | 'payment' | 'complete';

export default function DCServiceChooserPage({ onBack }: {
  onBack: () => void;
  onSelect?: (service: string) => void;
}) {
  /* ── Stage ── */
  const [stage, setStage]             = useState<Stage>('form');
  const [paymentMode, setPaymentMode] = useState('Credit Card');

  /* ── Service selection ── */
  const [service,     setService]     = useState('');
  const [serviceType, setServiceType] = useState('');

  /* ── Contact fields ── */
  const [name,          setName]          = useState(AUTOFILL_USER.name);
  const [company,       setCompany]       = useState(AUTOFILL_USER.company);
  const [contactPerson, setContactPerson] = useState(AUTOFILL_USER.contactPerson);
  const [email,         setEmail]         = useState(AUTOFILL_USER.email);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phone,         setPhone]         = useState(AUTOFILL_USER.phone);
  const [mobile,        setMobile]        = useState(AUTOFILL_USER.mobile);
  const [fax,           setFax]           = useState('');

  /* ── Request Info ── */
  const [subject, setSubject] = useState('');
  const [desc,    setDesc]    = useState('');

  /* ── Certificate-specific ── */
  const [purpose,       setPurpose]       = useState('');
  const [certDocType,   setCertDocType]   = useState('');
  const [certDocNo,     setCertDocNo]     = useState('');
  const [certHouseBill, setCertHouseBill] = useState('');
  const [certBillInfo,  setCertBillInfo]  = useState(false);
  const [certGoodDesc,  setCertGoodDesc]  = useState('');
  const [certPayAcct,   setCertPayAcct]   = useState('');
  // auto-populated read-only for Landing Cert
  const CONSIGNEE_TYPE = 'AE-1019056';
  const CONSIGNEE_CODE = 'Dubai Customs - Test LLC';

  /* ── CTR-specific ── */
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [ctrFormat,    setCtrFormat]    = useState('');
  const [ctrReportType, setCtrReportType] = useState('');

  /* ── Disclosure-specific ── */
  const [declNo,    setDeclNo]    = useState('');
  const [disclDate, setDisclDate] = useState('');
  const [reason,    setReason]    = useState('');

  /* ── IP Complaint-specific ── */
  const [iprRefNo, setIprRefNo] = useState('');

  /* ── Goods Classification-specific ── */
  const [hsCodeCount, setHsCodeCount] = useState('');

  /* ── Derived ── */
  const meta              = service ? SERVICE_META[service] : null;
  const certType          = CERT_TYPES.find(t => t.name === serviceType) ?? null;
  const ctrType           = CTR_TYPES.find(t => t.name === ctrReportType) ?? null;
  const ipComplaintType   = IP_COMPLAINT_TYPES.find(t => t.name === serviceType) ?? null;
  const customsOpinionType = CUSTOMS_OPINION_TYPES.find(t => t.name === serviceType) ?? null;
  const appealType        = APPEAL_CUSTOMS_TYPES.find(t => t.name === serviceType) ?? null;
  const goodsClassType    = GOODS_CLASSIFICATION_TYPES.find(t => t.name === serviceType) ?? null;

  /* Services that gate the full form behind service type selection */
  const PROGRESSIVE_SERVICES = [
    'Request Reports',
  ];
  const isProgressiveService = PROGRESSIVE_SERVICES.includes(service);
  const showFullForm = !isProgressiveService || !!serviceType;

  const chargeAmount = (() => {
    if (service === 'Request Certificate' && certType) return certType.fees;
    if (service === 'Request Reports' && ctrType) return ctrType.fees;
    if (service === 'Submit Trade Intellectual Property Complaint' && ipComplaintType) return ipComplaintType.fees;
    if (service === 'Request Customs Opinion' && customsOpinionType) return customsOpinionType.fees;
    if (service === 'Appeal Customs Decision' && appealType) return appealType.fees;
    if (service === 'Request Goods Classification' && goodsClassType) return goodsClassType.fees;
    return meta?.baseCharges ?? '100.00';
  })();

  const reqNo = service ? (REQ_NUMBERS[service] ?? 'R00723-513234') : 'R00723-513234';

  const handleServiceChange = (svc: string) => { setService(svc); setServiceType(''); };
  const handleReset = () => {
    setService(''); setServiceType('');
    setName(AUTOFILL_USER.name); setCompany(AUTOFILL_USER.company); setContactPerson(AUTOFILL_USER.contactPerson);
    setEmail(AUTOFILL_USER.email); setEmailVerified(true);
    setPhone(AUTOFILL_USER.phone); setMobile(AUTOFILL_USER.mobile); setFax(''); setSubject(''); setDesc('');
    setPurpose('');
    setCertDocType(''); setCertDocNo(''); setCertHouseBill(''); setCertBillInfo(false);
    setCertGoodDesc(''); setCertPayAcct('');
    setDateFrom(''); setDateTo(''); setCtrFormat(''); setCtrReportType('');
    setDeclNo(''); setDisclDate(''); setReason('');
    setIprRefNo(''); setHsCodeCount('');
  };

  /* ── Stage routing ── */

  if (stage === 'pending') {
    return (
      <PaymentPendingView
        service={service} serviceType={serviceType} name={name}
        company={company} charges={chargeAmount} reqNo={reqNo}
        onBack={onBack}
        onPay={() => chargeAmount === '0.00' ? setStage('complete') : setStage('payment')}
      />
    );
  }

  if (stage === 'payment') {
    return (
      <MakePaymentView
        service={service} serviceType={serviceType}
        charges={chargeAmount} reqNo={reqNo}
        onBack={() => setStage('pending')}
        onComplete={(mode) => { setPaymentMode(mode); setStage('complete'); }}
      />
    );
  }

  if (stage === 'complete') {
    return (
      <RequestInProcessView
        service={service} serviceType={serviceType} name={name} company={company}
        email={email} subject={subject} charges={chargeAmount} reqNo={reqNo}
        paymentMode={paymentMode} onBack={onBack}
      />
    );
  }

  /* ── Stage: form ── */
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item"><button className="dc-breadcrumb__link" onClick={onBack}>Home</button></span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Service Request</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="dc-breadcrumb__current">New Request</span>
          </span>
        </nav>

        <div className="dc-info-header">
          <h2 className="dc-info-header__title">{service || 'New Service Request'}</h2>
        </div>

        {/* ── Single card — all sections ── */}
        <div className="dc-form-card">

          {/* §0 — Service Name selector */}
          <div className="dc-form-section dc-basic-info-section">
            <div className="dc-basic-info-header">
              <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Select Service</h4>
            </div>
            {/* Dropdown row: Service Name (left) + Charges tile (right, once selected — hidden for Request Certificate) */}
            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 'calc(50% - 6px)', flexShrink: 0 }}>
                <FloatDropdown label="Service Name" required value={service} onChange={handleServiceChange} options={SERVICE_NAMES} />
              </div>
              {meta && service !== 'Request Certificate' && service !== 'Request Reports' && (
                <InfoCard iconColor="green" label="Charges"
                  value={<span className="dc-basic-info-card__value--charge">{meta.baseCharges === '0.00' ? 'No Charge' : meta.baseCharges}</span>}
                  icon={<Dh style={{ width: 18, height: 18 }} />}
                  style={{ height: 56, alignItems: 'center' }}
                />
              )}
            </div>
            {/* Description tile (always) + Requirements tile (hidden for Certificate and Reports) */}
            {meta && (
              <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 12 }}>
                <InfoCard iconColor="indigo" label="Service Description" value={meta.description}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                />
                {service !== 'Request Certificate' && service !== 'Request Reports' && (
                  <InfoCard iconColor="teal" label="Requirements" value={meta.requirements}
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                  />
                )}
              </div>
            )}
          </div>

          {service && meta && (
            <>
              {/* ════════════════════════════════════════════════════════
                  REQUEST CERTIFICATE — exact match of DCCertificatesFormPage
              ════════════════════════════════════════════════════════ */}
              {service === 'Request Certificate' ? (<>

                {/* §2-CERT — Service Type Details */}
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType}
                          onChange={v => { setServiceType(v); setCertBillInfo(false); setCertDocType(''); setCertDocNo(''); setCertHouseBill(''); }}
                          options={CERT_TYPES.map(t => t.name)} />
                      </div>
                      {certType && serviceType !== 'Landing Certificate' && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{certType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {certType && serviceType !== 'Landing Certificate' && (
                      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
                        <InfoCard iconColor="indigo" label="Service Type Description"
                          value={<span style={{ whiteSpace: 'pre-line' }}>{certType.description}</span>}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                        />
                        {certType.requirements && (
                          <InfoCard iconColor="teal" label="Requirements"
                            value={<span style={{ whiteSpace: 'pre-line' }}>{certType.requirements}</span>}
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* §3-CERT — Non-landing cert: Contact Info + Request Info + Attachments */}
                {certType && serviceType !== 'Landing Certificate' && (<>

                  {/* Contact Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Contact Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={name} onChange={e => setName(e.target.value)} />
                          <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={company} onChange={e => setCompany(e.target.value)} />
                          <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                          <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} style={{ paddingRight: 100 }} />
                          <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                          <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <PhoneField label="Phone" value={phone} onChange={setPhone} />
                      <PhoneField label="Mobile" value={mobile} onChange={setMobile} />
                    </div>
                  </div>

                  {/* Request Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Request Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                          <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-float-field" style={{ width: '100%' }}>
                      <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                        rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                      <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Attachments</h4>
                    <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                          stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
                    </div>
                    <FileUploadRow />
                  </div>

                </>)}

                {/* §4-CERT — Landing Certificate specific sections */}
                {serviceType === 'Landing Certificate' && (<>

                  {/* Basic Information */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Basic Information</h4>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={CONSIGNEE_TYPE} readOnly
                            style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                          <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Type</label>
                        </div>
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={CONSIGNEE_CODE} readOnly
                            style={{ background: '#f4f6f9', color: '#697498', cursor: 'default' }} />
                          <label className="dc-float-label" style={{ top: 0, transform: 'translateY(-50%)', fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px' }}>Consignee Code</label>
                        </div>
                      </div>
                    </div>
                    <div className="dc-form-row">
                      <div className="dc-float-wrapper dc-field--half">
                        <FloatDropdown label="Document Type" value={certDocType} onChange={setCertDocType} options={CERT_DOCUMENT_TYPES} />
                      </div>
                      <div className="dc-float-wrapper dc-field--half">
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={certDocNo} onChange={e => setCertDocNo(e.target.value)} />
                          <label className="dc-float-label">Document Number <span className="dc-req">*</span></label>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div className="dc-float-wrapper dc-field--half" style={{ flex: '0 0 calc(50% - 8px)', maxWidth: 'calc(50% - 8px)' }}>
                        <div className="dc-float-field">
                          <input className="dc-float-input" placeholder=" " value={certHouseBill} onChange={e => setCertHouseBill(e.target.value)} />
                          <label className="dc-float-label">House Bill No.</label>
                        </div>
                      </div>
                      <button type="button" className="dc-btn dc-btn--blue"
                        style={{ height: 56, paddingLeft: 28, paddingRight: 28, marginTop: 0 }}
                        onClick={() => setCertBillInfo(true)}>
                        <svg width="15" height="15" viewBox="0 0 18 18" fill="none" style={{ marginRight: 6 }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/>
                        </svg>
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Bill Information (post-Search) */}
                  {certBillInfo && (
                    <div className="dc-form-section">
                      <h4 className="dc-form-section__heading">Bill Information</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 20 }}>
                        <div><p className="dc-bill-field__label">Bill of Entry No.</p><p className="dc-bill-field__value">1013245459</p></div>
                        <div><p className="dc-bill-field__label">Bill Date</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                        <div><p className="dc-bill-field__label">Bill of Lading No.</p><p className="dc-bill-field__value">BOL1211324</p></div>
                        <div><p className="dc-bill-field__label">Vessel</p><p className="dc-bill-field__value">Testname</p></div>
                        <div><p className="dc-bill-field__label">Voyage</p><p className="dc-bill-field__value">324422</p></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0 24px', marginBottom: 24 }}>
                        <div><p className="dc-bill-field__label">Arrived From</p><p className="dc-bill-field__value">China</p></div>
                        <div><p className="dc-bill-field__label">Arrived On</p><p className="dc-bill-field__value">DD-MM-YYYY</p></div>
                        <div><p className="dc-bill-field__label">Marks &amp; Numbers</p><p className="dc-bill-field__value">N/A</p></div>
                      </div>
                      <div className="dc-form-row" style={{ marginBottom: 0 }}>
                        <div className="dc-float-wrapper dc-field--half">
                          <div className="dc-float-field">
                            <input className="dc-float-input" placeholder=" " value={certGoodDesc} onChange={e => setCertGoodDesc(e.target.value)} />
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

                  {/* Payment */}
                  <div className="dc-form-section">
                    <h4 className="dc-form-section__heading">Payment</h4>
                    <div style={{ width: 'calc(50% - 8px)' }}>
                      <FloatDropdown label="Payment Account" value={certPayAcct} onChange={setCertPayAcct} options={CERT_PAYMENT_OPTIONS} />
                    </div>
                  </div>

                </>)}

              </>) : (<>

              {/* ════════════════════════════════════════════════════════
                  ALL OTHER SERVICES — generic layout
              ════════════════════════════════════════════════════════ */}

              {/* §2-IP — IP Complaint Service Type */}
              {service === 'Submit Trade Intellectual Property Complaint' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType}
                          onChange={v => { setServiceType(v); setIprRefNo(''); }}
                          options={IP_COMPLAINT_TYPES.map(t => t.name)} />
                      </div>
                      {ipComplaintType && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{ipComplaintType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {ipComplaintType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Service Type Description" value={ipComplaintType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={ipComplaintType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* §2-OPINION — Customs Opinion Service Type */}
              {service === 'Request Customs Opinion' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType} onChange={setServiceType}
                          options={CUSTOMS_OPINION_TYPES.map(t => t.name)} />
                      </div>
                      {customsOpinionType && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{customsOpinionType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {customsOpinionType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Service Type Description" value={customsOpinionType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={customsOpinionType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* §2-APPEAL — Appeal Customs Decision Service Type */}
              {service === 'Appeal Customs Decision' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType} onChange={setServiceType}
                          options={APPEAL_CUSTOMS_TYPES.map(t => t.name)} />
                      </div>
                      {appealType && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{appealType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {appealType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Service Type Description" value={appealType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={appealType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* §2-GC — Goods Classification Service Type */}
              {service === 'Request Goods Classification' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType} onChange={setServiceType}
                          options={GOODS_CLASSIFICATION_TYPES.map(t => t.name)} />
                      </div>
                      {goodsClassType && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{goodsClassType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {goodsClassType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Service Type Description" value={goodsClassType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={goodsClassType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* §2b — Request Reports: Service Type selection (progressive) */}
              {service === 'Request Reports' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Type Selection</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 'calc(50% - 6px)' }}>
                        <FloatDropdown label="Service Type" required value={serviceType}
                          onChange={v => { setServiceType(v); setCtrReportType(''); setDateFrom(''); setDateTo(''); }}
                          options={['Download Customs Transaction Reports']} />
                      </div>
                      {serviceType && (
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{meta?.baseCharges ?? '200.00'}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      )}
                    </div>
                    {serviceType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 12 }}>
                        <InfoCard iconColor="indigo" label="Service Type Description"
                          value="Download comprehensive customs transaction reports for your business activities from Dubai Customs."
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements"
                          value={meta?.requirements ?? 'Trade license, Emirates ID, Customs file number, Date range'}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* §2c — Request Reports: Report Details (shown after service type selected) */}
              {service === 'Request Reports' && serviceType === 'Download Customs Transaction Reports' && (
                <div className="dc-form-section dc-basic-info-section">
                  <div className="dc-basic-info-header">
                    <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Report Details</h4>
                  </div>
                  <div className="dc-basic-info-cards">
                    {ctrType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <InfoCard iconColor="green" label="Charges"
                          value={<span className="dc-basic-info-card__value--charge">{ctrType.fees}</span>}
                          icon={<Dh style={{ width: 18, height: 18 }} />}
                          style={{ height: 56, alignItems: 'center' }}
                        />
                      </div>
                    )}
                    {ctrType && (
                      <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                        <InfoCard iconColor="indigo" label="Report Description" value={ctrType.description}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                        />
                        <InfoCard iconColor="teal" label="Requirements" value={ctrType.requirements}
                          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                        />
                      </div>
                    )}
                  </div>
                  <div className="dc-form-row" style={{ marginTop: 16 }}>
                    <div className="dc-float-wrapper dc-field--half">
                      <DateInput label="Date From" required value={dateFrom} onChange={setDateFrom} />
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <DateInput label="Date To" required value={dateTo} onChange={setDateTo} />
                    </div>
                  </div>
                </div>
              )}

              {/* §2c — VD Contact Information + Request Information */}
              {service === 'Submit Voluntary Disclosure' && (<>
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Contact Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={name} onChange={e => setName(e.target.value)} />
                        <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={company} onChange={e => setCompany(e.target.value)} />
                        <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                        <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                      </div>
                    </div>
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} style={{ paddingRight: 100 }} />
                        <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                        <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="dc-form-row">
                    <PhoneField label="Phone" value={phone} onChange={setPhone} />
                    <PhoneField label="Mobile" value={mobile} onChange={setMobile} />
                  </div>
                </div>
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Request Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                        <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-float-field" style={{ width: '100%' }}>
                    <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                      rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                    <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                  </div>
                </div>
              </>)}

              {/* §3 — Contact Information (hidden for VD; gated for progressive services) */}
              {service !== 'Submit Voluntary Disclosure' && showFullForm && <div className="dc-form-section">
                <h4 className="dc-form-section__heading">Contact Information</h4>
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={name} onChange={e => setName(e.target.value)} />
                      <label className="dc-float-label">Name <span className="dc-req">*</span></label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={company} onChange={e => setCompany(e.target.value)} />
                      <label className="dc-float-label">Company <span className="dc-req">*</span></label>
                    </div>
                  </div>
                </div>
                <div className="dc-form-row">
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                      <label className="dc-float-label">Contact Person <span className="dc-req">*</span></label>
                    </div>
                  </div>
                  <div className="dc-float-wrapper dc-field--half">
                    <div className="dc-float-field">
                      <input className="dc-float-input" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} style={{ paddingRight: 100 }} />
                      <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                      <span className="dc-verified-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>
                    </div>
                  </div>
                </div>
                <div className="dc-form-row">
                  <PhoneField label="Phone" value={phone} onChange={setPhone} />
                  <PhoneField label="Mobile" value={mobile} onChange={setMobile} />
                </div>
              </div>}

              {/* §4 — Request Information (skip for Voluntary Disclosure; gated for progressive services) */}
              {service !== 'Submit Voluntary Disclosure' && showFullForm && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Request Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={subject} onChange={e => setSubject(e.target.value)} />
                        <label className="dc-float-label">Subject <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-float-field" style={{ width: '100%' }}>
                    <textarea className="dc-float-input" placeholder=" " value={desc} onChange={e => setDesc(e.target.value)}
                      rows={4} style={{ height: 'auto', paddingTop: 20, paddingBottom: 12, resize: 'vertical' }} />
                    <label className="dc-float-label">Description <span className="dc-req">*</span></label>
                  </div>
                </div>
              )}

              {/* §4a — Additional Information: IP Complaint + Trademark */}
              {service === 'Submit Trade Intellectual Property Complaint' && serviceType === 'Trademark' && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Additional Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " value={iprRefNo} onChange={e => setIprRefNo(e.target.value)} />
                        <label className="dc-float-label">IPR Reference Number</label>
                      </div>
                    </div>
                  </div>
                  <div className="dc-field-hint" style={{ marginBottom: 8, marginTop: 8, flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                          stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>A refundable deposit of <DirhamIcon size={13} color="currentColor" />5000 will be charged if IPR Reference number is not provided.</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                          stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>An extra fee of <DirhamIcon size={13} color="currentColor" />500 will be charged for urgent request and a fee of <DirhamIcon size={13} color="currentColor" />1000 for complaint submitted on holidays.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* §4b — Additional Information: Goods Classification — No. of HS Code */}
              {service === 'Request Goods Classification' && showFullForm && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Additional Information</h4>
                  <div className="dc-form-row">
                    <div className="dc-float-wrapper dc-field--half">
                      <div className="dc-float-field">
                        <input className="dc-float-input" placeholder=" " type="number" min="1"
                          value={hsCodeCount} onChange={e => setHsCodeCount(e.target.value)} />
                        <label className="dc-float-label">No. of HS Code <span className="dc-req">*</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* §5 — Attachments (gated for progressive services) */}
              {showFullForm && (
                <div className="dc-form-section">
                  <h4 className="dc-form-section__heading">Attachments</h4>
                  {service === 'Submit Voluntary Disclosure' && (
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 14, color: '#697498', fontWeight: 600, fontFamily: font }}>NOTES:-</span>
                      <div style={{ marginTop: 6 }}>
                        <a href="#" onClick={e => e.preventDefault()}
                          style={{ fontSize: 14, color: '#1360d2', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                          Download Voluntary Disclosure Form
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                        stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
                  </div>
                  <FileUploadRow />
                </div>
              )}

            </>)}
            {/* end ternary */}
          </>
        )}
        </div>{/* end dc-form-card */}
      </div>

      {/* ── Floating bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 44, padding: '0 20px', borderRadius: 6,
          border: '1.5px solid #1360d2', background: '#fff',
          fontFamily: font, fontSize: 16, color: '#0e1b3d', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 12H5m7-7-7 7 7 7"/></svg>
          Back to Listing
        </button>
        {service && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="dc-btn dc-btn--outline" style={{ height: 44, padding: '0 24px' }} onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="dc-btn dc-btn--blue" style={{ height: 44, padding: '0 32px' }}
              onClick={() => setStage('pending')}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
