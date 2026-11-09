import { useState, type ReactNode } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

/* ─── Floating-label helpers — match the FInput/FSelect convention used across the app ─── */
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function FInput({ label, value, onChange, req, placeholder, disabled, trailing, textarea, maxLen }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean;
  trailing?: () => void; textarea?: boolean; maxLen?: number;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Tag
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(maxLen ? e.target.value.slice(0, maxLen) : e.target.value)}
        disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-[4px] text-[16px]"
        style={{
          height: textarea ? 84 : 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
          padding: textarea ? '10px 12px' : '0 12px', paddingRight: trailing ? 52 : 12,
          fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff',
          transition: 'border-color 120ms', resize: 'none',
        }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : (textarea ? 14 : '50%'), transform: floated ? 'none' : (textarea ? 'none' : 'translateY(-50%)'),
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {trailing && (
        <button type="button" onClick={trailing} className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
          <SearchIcon />
        </button>
      )}
      {maxLen !== undefined && (
        <span className="absolute right-[10px] bottom-[6px] text-[12px] text-[#8f94ae]" style={{ fontFamily: font }}>{maxLen - value.length} chars remaining</span>
      )}
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
        <span className="flex-1 text-[16px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
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
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[280px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
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

function ModalShell({ title, onClose, children, footer, width = 760 }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] w-full flex flex-col max-h-[90vh]" style={{ maxWidth: width }}>
        <div className="flex items-center justify-between px-[24px] py-[16px] rounded-t-[8px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>{title}</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[16px]">{children}</div>
        {footer && <div className="flex items-center justify-center gap-[12px] px-[24px] py-[16px] border-t border-[#f0f4ff] flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Generic 2-field search popup — reused for Rotation Number, Port, Package Type, Commodity Code ─── */
function TwoFieldSearchPopup<T extends Record<string, string>>({
  title, field1Key, field1Label, field2Key, field2Label, extraFields, resultCols, results, onSelect, onClose,
}: {
  title: string; field1Key: keyof T & string; field1Label: string; field2Key: keyof T & string; field2Label: string;
  extraFields?: { key: keyof T & string; label: string }[];
  resultCols: { key: keyof T & string; label: string }[];
  results: T[]; onSelect: (item: T) => void; onClose: () => void;
}) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const filtered = results.filter(r =>
    (!q1.trim() || String(r[field1Key]).toLowerCase().includes(q1.trim().toLowerCase())) &&
    (!q2.trim() || String(r[field2Key]).toLowerCase().includes(q2.trim().toLowerCase())));

  return (
    <ModalShell title={title} onClose={onClose}>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Criteria</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <FInput label={field1Label} value={q1} onChange={setQ1} />
          <FInput label={field2Label} value={q2} onChange={setQ2} />
          {extraFields?.map(f => <FInput key={String(f.key)} label={f.label} value="" onChange={() => {}} disabled />)}
        </div>
        <div className="flex gap-[10px] mt-[14px]">
          <button type="button" onClick={() => { setQ1(''); setQ2(''); }}
            data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Reset</button>
        </div>
      </div>
      <div>
        <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 500, borderBottom: '1px solid #eef1f6', paddingBottom: 8 }}>Search Results</p>
        <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {resultCols.map(c => <th key={String(c.key)} className="text-left text-[16px] text-[#000]" style={{ padding: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</th>)}
                <th className="text-left text-[16px] text-[#000]" style={{ padding: 12, fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={resultCols.length + 1} className="text-[16px] text-[#697498]" style={{ padding: 20, textAlign: 'center' }}>No results found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #eef1f6' }}>
                  {resultCols.map((c, ci) => (
                    <td key={String(c.key)} className="text-[16px]" style={{ padding: 12, whiteSpace: 'nowrap', color: ci === 0 ? '#1360d2' : '#0e1b3d', fontWeight: ci === 0 ? 500 : 400 }}>{r[c.key]}</td>
                  ))}
                  <td style={{ padding: 12 }}>
                    <button type="button" onClick={() => onSelect(r)} aria-label="Select"
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

/* ─── Mock reference data for the search popups ─────────────────── */
type RotationHit = { rotationNumber: string; vesselName: string; voyageNo: string; actualDepartureDate: string };
const ROTATION_HITS: RotationHit[] = [
  { rotationNumber: '210101', vesselName: 'MAERSK ESSEX', voyageNo: 'V.118W', actualDepartureDate: '21/07/2025' },
  { rotationNumber: '210102', vesselName: 'ONE INNOVATION', voyageNo: 'V.198N', actualDepartureDate: '22/07/2025' },
  { rotationNumber: '210103', vesselName: 'ZIM SAO PAULO', voyageNo: 'V.021S', actualDepartureDate: '23/07/2025' },
  { rotationNumber: '210104', vesselName: 'YM WELLHEAD', voyageNo: 'V.089E', actualDepartureDate: '24/07/2025' },
];

type PortHit = { code: string; name: string; country: string };
const PORT_HITS: PortHit[] = [
  { code: 'AEJEA', name: 'Jebel Ali Port', country: 'UAE' },
  { code: 'OMSLL', name: 'Salalah Port', country: 'OMAN' },
  { code: 'SAJED', name: 'Jeddah Port', country: 'SAUDI ARABIA' },
  { code: 'PKKHI', name: 'Karachi Port', country: 'PAKISTAN' },
  { code: 'LBBEY', name: 'Beirut Port', country: 'LEBANON' },
  { code: 'INNSA', name: 'Nhava Sheva Port', country: 'INDIA' },
];

type PackageHit = { code: string; name: string };
const PACKAGE_HITS: PackageHit[] = [
  { code: 'BAL', name: 'BALES' }, { code: 'DZN', name: 'DOZENS' }, { code: 'MDL', name: 'MODULES' },
  { code: 'PAL', name: 'PAIL' }, { code: 'PDR', name: 'PLASTIC DRUM' }, { code: 'BDL', name: 'BUNDLES' },
  { code: 'CSE', name: 'CASES' }, { code: 'LOT', name: 'LOTS' },
];

type CommodityHit = { code: string; description: string };
const COMMODITY_HITS: CommodityHit[] = [
  { code: '02071300', description: 'Cuts & offal of fowls of the species Gallus domesticus, fresh or chilled.' },
  { code: '05040010', description: 'Animals guts (other than fish), whole & pieces thereof, fresh, chilled, frozen.' },
  { code: '18069030', description: 'Cocoa products of concentrated liquid or paste, containing cocoa.' },
  { code: '18069090', description: 'Chocolate & other food preparations containing cocoa.' },
  { code: '19019020', description: 'Malted milk.' },
];

const CARGO_TYPES = ['FCL CONTAINER', 'LCL CONTAINER', 'GENERAL CARGO (BREAK BULK)', 'BULK LIQUID', 'BULK SOLID', 'RO-RO UNIT', 'EMPTY CONTAINER'];
const INCO_TERMS = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'DAP', 'DDP'];

/* ─── Stepper ───────────────────────────────────────────────────── */
const STEPS = ['BOL Details', 'Consignment Details', 'Container Details', 'Address Details'] as const;
type StepKey = 'bol' | 'consignment' | 'container' | 'address';
const STEP_KEYS: StepKey[] = ['bol', 'consignment', 'container', 'address'];

function Stepper({ step }: { step: StepKey }) {
  const idx = STEP_KEYS.indexOf(step);
  return (
    <div className="bg-white rounded-[8px] px-[24px] py-[18px] flex items-center flex-shrink-0" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center" style={{ flex: i === STEPS.length - 1 ? '0 0 auto' : 1 }}>
          <div className="flex items-center gap-[8px]">
            <div className="size-[26px] rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: i <= idx ? (i < idx ? '#28a745' : '#1360d2') : '#fff',
              border: i <= idx ? 'none' : '1.5px solid #1360d2',
            }}>
              {i <= idx ? (
                <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8" /></svg>
              ) : (
                <span className="text-[13px]" style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>{i + 1}</span>
              )}
            </div>
            <span className="text-[16px] whitespace-nowrap" style={{ fontFamily: font, fontWeight: i === idx ? 700 : 500, color: i <= idx ? (i < idx ? '#28a745' : '#1360d2') : '#8f94ae' }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="h-[2px] flex-1 mx-[16px]" style={{ background: i < idx ? '#28a745' : '#d5ddfb' }} />}
        </div>
      ))}
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────── */
type Consignment = { srNo: number; commodityCode: string; commodityDesc: string; cargoDesc: string; packageType: string; packages: string; volume: string; weight: string; marks: string; dangerous: 'Yes' | 'No' };
const BLANK_CONSIGNMENT: Omit<Consignment, 'srNo'> = { commodityCode: '', commodityDesc: '', cargoDesc: '', packageType: '', packages: '', volume: '', weight: '', marks: '', dangerous: 'No' };
type ContainerRow = { srNo: number; containerNo: string; tareWeight: string; sealNumber: string };
type ManifestFile = { id: string; name: string; sizeKb: string };
const formatSizeKb = (bytes: number) => `${Math.max(0.1, bytes / 1024).toFixed(1)}`;

/* ─── Main page ─────────────────────────────────────────────────── */
type Step = 'upload' | 'uploadSuccess' | StepKey | 'success';

type Props = {
  onBack: () => void; onBackToListing: () => void; mode?: 'manual' | 'upload';
  amend?: boolean; viewOnly?: boolean;
  initialBolNumber?: string; initialRotationNumber?: string; initialCargoCode?: string; initialRequestId?: string;
};

export default function SeaExportManifestNewRequestPage({ onBack, onBackToListing, mode = 'manual', amend, viewOnly, initialBolNumber, initialRotationNumber, initialCargoCode, initialRequestId }: Props) {
  const [step, setStep] = useState<Step>(mode === 'upload' ? 'upload' : 'bol');
  // pageTitle drives the success-message text; headerTitle is what's shown while viewing/amending.
  const pageTitle = amend ? 'Amend Export Manifest' : viewOnly ? 'View Export Manifest' : 'New Export Manifest';
  const requestNumber = (initialRequestId && initialRequestId !== '—') ? initialRequestId : (initialBolNumber || initialRotationNumber || '—');
  const headerTitle = viewOnly
    ? `View Manifest Request - ${requestNumber}`
    : amend
    ? `Amend Manifest Request - ${requestNumber}`
    : 'New Export Manifest';

  const [rotationNumber, setRotationNumber] = useState(initialRotationNumber ?? '');
  const [showRotationSearch, setShowRotationSearch] = useState(false);

  const [bolNumber, setBolNumber] = useState(initialBolNumber ?? '');
  const [portOfOrigin, setPortOfOrigin] = useState('');
  const [portOfLoading] = useState('AEJEA');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');
  const [showPortSearch, setShowPortSearch] = useState<'origin' | 'discharge' | 'delivery' | null>(null);

  const [cargoCode, setCargoCode] = useState(initialCargoCode ?? '');
  const [packageType, setPackageType] = useState('');
  const [totalPackages, setTotalPackages] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoVolume, setCargoVolume] = useState('');
  const [incoTerms, setIncoTerms] = useState('');
  const [marksNumber, setMarksNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showPackageSearch, setShowPackageSearch] = useState(false);

  const [consignmentForm, setConsignmentForm] = useState<Omit<Consignment, 'srNo'>>(BLANK_CONSIGNMENT);
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [showCommoditySearch, setShowCommoditySearch] = useState(false);
  const [showConsignmentPackageSearch, setShowConsignmentPackageSearch] = useState(false);

  const [containerNo, setContainerNo] = useState('');
  const [tareWeight, setTareWeight] = useState('');
  const [sealNumber, setSealNumber] = useState('');
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [editingContainerId, setEditingContainerId] = useState<number | null>(null);
  const [editingConsignmentId, setEditingConsignmentId] = useState<number | null>(null);

  const [shipperName, setShipperName] = useState('');
  const [shipperAddress, setShipperAddress] = useState('');
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneeAddress, setConsigneeAddress] = useState('');
  const [notifyPartyName, setNotifyPartyName] = useState('');
  const [notifyPartyAddress, setNotifyPartyAddress] = useState('');

  const [uploadFiles, setUploadFiles] = useState<ManifestFile[]>([]);

  const setCF = <K extends keyof typeof BLANK_CONSIGNMENT>(k: K, v: typeof BLANK_CONSIGNMENT[K]) => setConsignmentForm(f => ({ ...f, [k]: v }));
  const canSaveConsignment = consignmentForm.commodityCode.trim() && consignmentForm.cargoDesc.trim() && consignmentForm.packageType.trim();

  const addContainer = () => {
    if (!containerNo.trim() || !tareWeight.trim()) return;
    if (editingContainerId != null) {
      setContainers(cs => cs.map(c => c.srNo === editingContainerId ? { ...c, containerNo, tareWeight, sealNumber } : c));
      setEditingContainerId(null);
    } else {
      setContainers(c => [...c, { srNo: c.length + 1, containerNo, tareWeight, sealNumber }]);
    }
    setContainerNo(''); setTareWeight(''); setSealNumber('');
  };
  const editContainer = (c: ContainerRow) => {
    setContainerNo(c.containerNo); setTareWeight(c.tareWeight); setSealNumber(c.sealNumber);
    setEditingContainerId(c.srNo);
  };
  const saveConsignment = () => {
    if (!canSaveConsignment) return;
    if (editingConsignmentId != null) {
      setConsignments(cs => cs.map(c => c.srNo === editingConsignmentId ? { ...consignmentForm, srNo: editingConsignmentId } : c));
      setEditingConsignmentId(null);
    } else {
      setConsignments(cs => [...cs, { ...consignmentForm, srNo: cs.length + 1 }]);
    }
    setConsignmentForm(BLANK_CONSIGNMENT);
  };
  const editConsignment = (c: Consignment) => {
    const { srNo, ...rest } = c;
    setConsignmentForm(rest);
    setEditingConsignmentId(srNo);
  };
  const addUploadFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 20 - uploadFiles.length).map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name, sizeKb: formatSizeKb(f.size) }));
    setUploadFiles(p => [...p, ...next]);
  };

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Export By Sea</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Sea Export Manifest</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>DC-AE-1051144-XCRN BUSINESS NEW01</span>
      </div>
    </div>
  );

  const RotationSearchPopup = () => showRotationSearch ? (
    <TwoFieldSearchPopup<RotationHit>
      title="Search Rotation"
      field1Key="rotationNumber" field1Label="Rotation Number"
      field2Key="vesselName" field2Label="Vessel Name"
      resultCols={[{ key: 'rotationNumber', label: 'Rotation Number' }, { key: 'vesselName', label: 'Vessel Name' }, { key: 'voyageNo', label: 'Voyage No.' }, { key: 'actualDepartureDate', label: 'Actual Departure Date' }]}
      results={ROTATION_HITS}
      onSelect={r => { setRotationNumber(r.rotationNumber); setShowRotationSearch(false); }}
      onClose={() => setShowRotationSearch(false)}
    />
  ) : null;

  /* ─── View Manifest Request — one read-only page of cards, matching the View Declaration pattern ─── */
  if (viewOnly) {
    const ViewSectionTitle = ({ children }: { children: ReactNode }) => (
      <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{children}</p>
    );
    const ViewCard = ({ children }: { children: ReactNode }) => (
      <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
        {children}
      </div>
    );
    const ViewField = ({ label, value }: { label: string; value: string }) => (
      <div className="flex flex-col gap-[4px]">
        <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{value || '—'}</span>
      </div>
    );
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{headerTitle}</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>Bill of Lading Header</ViewSectionTitle>
            <ViewCard>
              <ViewField label="Rotation Number" value={rotationNumber} />
              <ViewField label="BOL Number" value={bolNumber} />
              <ViewField label="Request Number" value={requestNumber} />
            </ViewCard>
          </div>

          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>Location Details</ViewSectionTitle>
            <ViewCard>
              <ViewField label="Port Of Origin" value={portOfOrigin} />
              <ViewField label="Port Of Loading" value={portOfLoading} />
              <ViewField label="Port Of Discharge" value={portOfDischarge} />
              <ViewField label="Place Of Delivery" value={placeOfDelivery} />
            </ViewCard>
          </div>

          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>Cargo Details</ViewSectionTitle>
            <ViewCard>
              <ViewField label="Cargo Code" value={cargoCode} />
              <ViewField label="Trade Code" value="Export" />
              <ViewField label="Package Type" value={packageType} />
              <ViewField label="Total Number Of Packages" value={totalPackages} />
              <ViewField label="Gross Weight (in KG)" value={grossWeight} />
              <ViewField label="Cargo Weight (in KG)" value={cargoWeight} />
              <ViewField label="Cargo Volume (in CBM)" value={cargoVolume} />
              <ViewField label="INCO Terms" value={incoTerms} />
              <ViewField label="Marks & Number" value={marksNumber} />
              <ViewField label="Remarks" value={remarks} />
            </ViewCard>
          </div>

          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>List of Consignments</ViewSectionTitle>
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>No. of Consignments: <b style={{ color: '#0e1b3d' }}>{consignments.length}</b></p>
              <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: '#e2ebf9' }}>
                      {['SR. No.', 'Commodity Code', 'No. Of Packages', 'Weight (in KG)', 'Cargo Description'].map(h => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {consignments.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No consignments recorded.</td></tr>
                    ) : consignments.map(c => (
                      <tr key={c.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.commodityCode || '—'}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.packages || '—'}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.weight || '—'}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.cargoDesc || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>List of Containers</ViewSectionTitle>
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>No. of Containers: <b style={{ color: '#0e1b3d' }}>{containers.length}</b></p>
              <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ background: '#e2ebf9' }}>
                      {['SR. No.', 'Container No.', 'Tare Weight (in MT)', 'Seal Number'].map(h => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {containers.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No containers recorded.</td></tr>
                    ) : containers.map(c => (
                      <tr key={c.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.tareWeight}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.sealNumber || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <ViewSectionTitle>Address Details</ViewSectionTitle>
            <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Shipper</p>
                <ViewField label="Shipper Name" value={shipperName} />
                <div className="lg:col-span-3"><ViewField label="Shipper Address" value={shipperAddress} /></div>
              </div>
              <div className="border-t border-[#eef1f6] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Consignee</p>
                <ViewField label="Consignee Name" value={consigneeName} />
                <div className="lg:col-span-3"><ViewField label="Consignee Address" value={consigneeAddress} /></div>
              </div>
              <div className="border-t border-[#eef1f6] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Notify Party 1</p>
                <ViewField label="Notify Party 1 Name" value={notifyPartyName} />
                <div className="lg:col-span-3"><ViewField label="Notify Party 1 Address" value={notifyPartyAddress} /></div>
              </div>
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  /* ─── Upload File flow ─── */
  if (step === 'upload' || step === 'uploadSuccess') {
    if (step === 'uploadSuccess') {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
          <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
          <Breadcrumb />
          <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
            <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Upload BOLs</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
            <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
              </div>
              <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>New Export Manifest Uploaded Successfully</p>
              <div className="rounded-[6px] px-[24px] py-[18px] w-full max-w-[640px]" style={{ background: '#eafaf0', border: '1px solid #c9f0d8' }}>
                <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                  Your file has been successfully received. The file upload reference number is <b>{`266${rotationNumber.replace(/\D/g, '').padStart(7, '0').slice(-7)}`}</b>.
                  Please check the processing status of the uploaded file using <b>&apos;Track Upload&apos;</b> service after <b>15</b> mins.
                  The file tracking number is e-mailed to your <b>barakath.natchiya@dubaicustoms.ae</b> account.
                  This acknowledges the receipt of export manifest file only, it does not imply correctness of content.
                </p>
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
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Bill of Lading (BOL)</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          <div className="rounded-[8px] px-[20px] py-[16px] flex items-start gap-[12px]" style={{ background: '#e2ebf9', border: '1px solid #c7d9f7' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[2px]"><circle cx="12" cy="12" r="9.5" /><path d="M12 8v.01M12 11v5" strokeLinecap="round" /></svg>
            <div>
              <p className="text-[16px] text-[#0e1b3d] mb-[6px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Guidelines</p>
              <ul className="text-[15px] text-[#455174] flex flex-col gap-[3px]" style={{ fontFamily: font }}>
                <li>• Allowed individual file size is 10 KB</li>
                <li>• Allowed total file size is 10 MB</li>
                <li>• Only CSV format files are accepted</li>
                <li>• Files uploaded more than 4 days ago cannot be re-tracked</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              <FInput label="Rotation Number" value={rotationNumber} onChange={setRotationNumber} req placeholder="Enter or search rotation number"
                trailing={() => setShowRotationSearch(true)} />
            </div>

            <label className="w-full lg:max-w-[50%] rounded-[8px] flex flex-col items-center justify-center gap-[12px] py-[48px] cursor-pointer" style={{ border: '1.5px dashed #c7d0e8' }}>
              <input type="file" accept=".csv" multiple className="hidden" onChange={e => addUploadFiles(e.target.files)} />
              <div className="size-[56px] rounded-full flex items-center justify-center" style={{ background: '#e2ebf9' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.8"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>
              </div>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{uploadFiles[0]?.name ?? 'Click to select a CSV file'}</p>
              <p className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>CSV format only · Max 0.3 MB</p>
              <span className="h-[42px] px-[20px] rounded-[4px] flex items-center text-[15px] text-[#1360d2]" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>Browse File</span>
            </label>
          </div>
        </div>
        <BackToListingBar
          onBackToListing={onBackToListing}
          rightContent={
            <button onClick={() => setStep('uploadSuccess')}
              className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white flex items-center gap-[8px] transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500 }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Upload BOLs
            </button>
          }
        />
        <RotationSearchPopup />
      </div>
    );
  }

  /* ─── Success (manual entry) ─── */
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{pageTitle}</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>{`${pageTitle} Submitted Successfully`}</p>
            <div className="rounded-[6px] px-[24px] py-[14px] flex items-center gap-[10px] w-full max-w-[560px]" style={{ background: '#eafaf0', border: '1px solid #c9f0d8' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#28a745" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M4 12l6 6L20 6" /></svg>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>Bill of Lading <b>{bolNumber || 'BOL101'}</b> has been submitted successfully.</p>
            </div>
            <div className="w-full max-w-[560px] rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
              {[
                ['BOL Number', bolNumber || 'BOL101'],
                ['Rotation Number', rotationNumber || '—'],
                ['Port of Origin', portOfOrigin || '—'],
                ['Port of Discharge', portOfDischarge || '—'],
                ['Total Consignments', String(consignments.length)],
                ['Total Containers', String(containers.length)],
              ].map(([k, v], i) => (
                <div key={k} className="flex items-center justify-between px-[20px] py-[12px]" style={{ background: i % 2 === 0 ? '#f8fafd' : '#fff' }}>
                  <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>{k}</span>
                  <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  /* ─── Stepper flow (Add Manually) ─── */
  const stepKey = step as StepKey;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb />
      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{headerTitle}</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <fieldset disabled={viewOnly} style={{ border: 'none', padding: 0, margin: 0, display: 'contents' }}>
        <Stepper step={stepKey} />

        {stepKey !== 'bol' && (
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Bill of Lading Header</p>
            <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <FInput label="Rotation Number" value={rotationNumber} onChange={() => {}} disabled />
              <FInput label="BOL Number" value={bolNumber} onChange={() => {}} disabled />
              {amend && <FInput label="Request Number" value={requestNumber} onChange={() => {}} disabled />}
            </div>
          </div>
        )}

        {stepKey === 'bol' && (
          <>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Bill of Lading Header</p>
              <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <FInput label="Rotation Number" value={rotationNumber} onChange={setRotationNumber} req placeholder="Enter or search rotation number" disabled={viewOnly || amend}
                  trailing={viewOnly || amend ? undefined : () => setShowRotationSearch(true)} />
                <FInput label="BOL Number" value={bolNumber} onChange={setBolNumber} req placeholder="e.g. BOL101" disabled={viewOnly || amend} />
                {amend && <FInput label="Request Number" value={requestNumber} onChange={() => {}} disabled />}
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Location Details</p>
              <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <FInput label="Port Of Origin" value={portOfOrigin} onChange={setPortOfOrigin} req trailing={() => setShowPortSearch('origin')} placeholder="Search port" disabled={viewOnly} />
                <FInput label="Port Of Loading" value={portOfLoading} onChange={() => {}} disabled />
                <FInput label="Port Of Discharge" value={portOfDischarge} onChange={setPortOfDischarge} req trailing={() => setShowPortSearch('discharge')} placeholder="Search port" disabled={viewOnly} />
                <FInput label="Place Of Delivery" value={placeOfDelivery} onChange={setPlaceOfDelivery} trailing={() => setShowPortSearch('delivery')} placeholder="Search place" disabled={viewOnly} />
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Cargo Details</p>
              <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <FSelect label="Cargo Code" value={cargoCode} onChange={setCargoCode} req options={CARGO_TYPES} disabled={viewOnly} />
                <FInput label="Trade Code" value="Export" onChange={() => {}} disabled />
                <FInput label="Package Type" value={packageType} onChange={setPackageType} req trailing={() => setShowPackageSearch(true)} placeholder="Search package type" disabled={viewOnly} />
                <FInput label="Total Number Of Packages" value={totalPackages} onChange={setTotalPackages} req placeholder="Enter total" disabled={viewOnly} />
                <FInput label="Gross Weight (in KG)" value={grossWeight} onChange={setGrossWeight} req placeholder="e.g. 1200" disabled={viewOnly} />
                <FInput label="Cargo Weight (in KG)" value={cargoWeight} onChange={setCargoWeight} placeholder="e.g. 1150" disabled={viewOnly} />
                <FInput label="Cargo Volume (in CBM)" value={cargoVolume} onChange={setCargoVolume} placeholder="e.g. 24.5" disabled={viewOnly} />
                <FSelect label="INCO Terms" value={incoTerms} onChange={setIncoTerms} options={INCO_TERMS} disabled={viewOnly} />
                <FInput label="Marks & Number" value={marksNumber} onChange={setMarksNumber} placeholder="Enter marks and number" disabled={viewOnly} />
                <FInput label="Remarks" value={remarks} onChange={setRemarks} placeholder="Enter remarks" disabled={viewOnly} />
              </div>
            </div>
          </>
        )}

        {stepKey === 'consignment' && (
          <>
            {!viewOnly && (
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Add Consignment</p>
              <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <FInput label="Commodity Code" value={consignmentForm.commodityCode} onChange={v => setCF('commodityCode', v)} req trailing={() => setShowCommoditySearch(true)} placeholder="Search code" />
                  <div className="lg:col-span-2">
                    <FInput label="Commodity Code Description" value={consignmentForm.commodityDesc} onChange={() => {}} disabled />
                  </div>
                  <FInput label="Package Type" value={consignmentForm.packageType} onChange={v => setCF('packageType', v)} req trailing={() => setShowConsignmentPackageSearch(true)} placeholder="Search package type" />
                  <FInput label="No. Of Packages" value={consignmentForm.packages} onChange={v => setCF('packages', v)} placeholder="Enter number" />
                  <FInput label="Volume (in CBM)" value={consignmentForm.volume} onChange={v => setCF('volume', v)} placeholder="e.g. 12.5" />
                  <FInput label="Weight (in KG)" value={consignmentForm.weight} onChange={v => setCF('weight', v)} placeholder="e.g. 500" />
                  <FInput label="Marks & Number" value={consignmentForm.marks} onChange={v => setCF('marks', v)} placeholder="Enter marks and number" />
                  <div className="flex flex-col gap-[6px] justify-center">
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}><span style={{ color: '#dc3545' }}>*</span>Dangerous Good</span>
                    <div className="flex items-center gap-[24px]">
                      {(['Yes', 'No'] as const).map(v => (
                        <label key={v} className="flex items-center gap-[8px] cursor-pointer">
                          <span className="size-[18px] rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${consignmentForm.dangerous === v ? '#1360d2' : '#d5ddfb'}` }} onClick={() => setCF('dangerous', v)}>
                            {consignmentForm.dangerous === v && <span className="size-[9px] rounded-full" style={{ background: '#1360d2' }} />}
                          </span>
                          <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }} onClick={() => setCF('dangerous', v)}>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <FInput label="Cargo Description" value={consignmentForm.cargoDesc} onChange={v => setCF('cargoDesc', v)} req textarea maxLen={100} placeholder="Describe the cargo..." />
                  </div>
                  <div className="flex items-end">
                    <button onClick={saveConsignment} disabled={!canSaveConsignment}
                      className="h-[44px] px-[20px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px] flex-shrink-0" style={{ background: canSaveConsignment ? '#1360d2' : '#a7c3eb', cursor: canSaveConsignment ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500 }}>
                      <span>{editingConsignmentId != null ? '✓' : '+'}</span>{editingConsignmentId != null ? 'Update Consignment' : 'Save Consignment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}

            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Consignments</p>
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>No. of Consignments added: <b style={{ color: '#0e1b3d' }}>{consignments.length}</b></p>
                <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['SR. No.', 'Commodity Code', 'No. Of Packages', 'Weight (in KG)', 'Cargo Description', 'Action'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {consignments.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No consignments added. Fill the form above and click &quot;Save Consignment&quot;.</td></tr>
                      ) : consignments.map(c => (
                        <tr key={c.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.commodityCode || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.packages || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.weight || '—'}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.cargoDesc || '—'}</td>
                          <td className="px-[16px] py-[10px]">
                            {!viewOnly && (
                            <div className="flex items-center gap-[12px]">
                              <button onClick={() => editConsignment(c)} className="text-[#1360d2] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                              <button onClick={() => setConsignments(cs => cs.filter(x => x.srNo !== c.srNo))} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                            </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {stepKey === 'container' && (
          <>
            {!viewOnly && (
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Add Container</p>
              <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <FInput label="Container No." value={containerNo} onChange={setContainerNo} req placeholder="e.g. MSCU1234567" />
                  <FInput label="Tare Weight (in MT)" value={tareWeight} onChange={setTareWeight} req placeholder="e.g. 2.5" />
                  <FInput label="Seal Number" value={sealNumber} onChange={setSealNumber} placeholder="Enter seal number" />
                  <div className="flex items-end">
                    <button onClick={addContainer} className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px] flex-shrink-0" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                      <span>{editingContainerId != null ? '✓' : '+'}</span>{editingContainerId != null ? 'Update Container' : 'ADD Container'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Containers</p>
              <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <p className="text-[15px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>No. of Containers added: <b style={{ color: '#0e1b3d' }}>{containers.length}</b></p>
                <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['SR. No.', 'Container No.', 'Tare Weight (in MT)', 'Seal Number', 'Action'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {containers.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No containers added yet.</td></tr>
                      ) : containers.map(c => (
                        <tr key={c.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.srNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.containerNo}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.tareWeight}</td>
                          <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{c.sealNumber || '—'}</td>
                          <td className="px-[16px] py-[10px]">
                            {!viewOnly && (
                            <div className="flex items-center gap-[12px]">
                              <button onClick={() => editContainer(c)} className="text-[#1360d2] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                              <button onClick={() => setContainers(cs => cs.filter(x => x.srNo !== c.srNo))} className="text-[#c0392b] hover:opacity-70">
                                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </button>
                            </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {stepKey === 'address' && (
          <>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Address Details</p>
              <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Shipper</p>
                  <FInput label="Shipper Name" value={shipperName} onChange={setShipperName} req placeholder="Enter shipper name" disabled={viewOnly} />
                  <div className="lg:col-span-3">
                    <FInput label="Shipper Address" value={shipperAddress} onChange={setShipperAddress} req placeholder="Enter shipper address" disabled={viewOnly} />
                  </div>
                </div>
                <div className="border-t border-[#eef1f6] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Consignee</p>
                  <FInput label="Consignee Name" value={consigneeName} onChange={setConsigneeName} req placeholder="Enter consignee name" disabled={viewOnly} />
                  <div className="lg:col-span-3">
                    <FInput label="Consignee Address" value={consigneeAddress} onChange={setConsigneeAddress} req placeholder="Enter consignee address" disabled={viewOnly} />
                  </div>
                </div>
                <div className="border-t border-[#eef1f6] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                  <p className="lg:col-span-4 text-[15px] text-[#697498]" style={{ fontFamily: font, fontWeight: 600 }}>Notify Party 1</p>
                  <FInput label="Notify Party 1 Name" value={notifyPartyName} onChange={setNotifyPartyName} placeholder="Enter notify party name" disabled={viewOnly} />
                  <div className="lg:col-span-3">
                    <FInput label="Notify Party 1 Address" value={notifyPartyAddress} onChange={setNotifyPartyAddress} placeholder="Enter notify party address" disabled={viewOnly} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </fieldset>
      </div>

      <BackToListingBar
        onBack={stepKey === 'bol' ? undefined : () => setStep(STEP_KEYS[STEP_KEYS.indexOf(stepKey) - 1])}
        onBackToListing={stepKey === 'bol' ? onBackToListing : undefined}
        rightContent={
          stepKey === 'address' ? (
            viewOnly ? null : (
              <button onClick={() => setStep('success')} className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                Submit
              </button>
            )
          ) : (
            <button
              onClick={() => setStep(STEP_KEYS[STEP_KEYS.indexOf(stepKey) + 1])}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Next
            </button>
          )
        }
      />

      {showPortSearch && (
        <TwoFieldSearchPopup<PortHit>
          title="Search Port"
          field1Key="code" field1Label="Location Code"
          field2Key="name" field2Label="Location Name"
          resultCols={[{ key: 'code', label: 'Location Code' }, { key: 'name', label: 'Location Name' }, { key: 'country', label: 'Country' }]}
          results={PORT_HITS}
          onSelect={p => {
            if (showPortSearch === 'origin') setPortOfOrigin(p.code);
            else if (showPortSearch === 'discharge') setPortOfDischarge(p.code);
            else setPlaceOfDelivery(p.code);
            setShowPortSearch(null);
          }}
          onClose={() => setShowPortSearch(null)}
        />
      )}
      {showPackageSearch && (
        <TwoFieldSearchPopup<PackageHit>
          title="Search Package"
          field1Key="code" field1Label="Package Code"
          field2Key="name" field2Label="Package Name"
          resultCols={[{ key: 'code', label: 'Package Code' }, { key: 'name', label: 'Package Name' }]}
          results={PACKAGE_HITS}
          onSelect={p => { setPackageType(p.code); setShowPackageSearch(false); }}
          onClose={() => setShowPackageSearch(false)}
        />
      )}
      {showConsignmentPackageSearch && (
        <TwoFieldSearchPopup<PackageHit>
          title="Search Package"
          field1Key="code" field1Label="Package Code"
          field2Key="name" field2Label="Package Name"
          resultCols={[{ key: 'code', label: 'Package Code' }, { key: 'name', label: 'Package Name' }]}
          results={PACKAGE_HITS}
          onSelect={p => { setCF('packageType', p.code); setShowConsignmentPackageSearch(false); }}
          onClose={() => setShowConsignmentPackageSearch(false)}
        />
      )}
      {showCommoditySearch && (
        <TwoFieldSearchPopup<CommodityHit>
          title="Search Commodity"
          field1Key="code" field1Label="Commodity Code"
          field2Key="description" field2Label="Commodity Description"
          resultCols={[{ key: 'code', label: 'Commodity Code' }, { key: 'description', label: 'Commodity Description' }]}
          results={COMMODITY_HITS}
          onSelect={c => { setConsignmentForm(f => ({ ...f, commodityCode: c.code, commodityDesc: c.description })); setShowCommoditySearch(false); }}
          onClose={() => setShowCommoditySearch(false)}
        />
      )}
      <RotationSearchPopup />
    </div>
  );
}
