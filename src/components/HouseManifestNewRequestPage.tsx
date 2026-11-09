import { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function FInput({ label, value, onChange, req, placeholder, disabled, trailing }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean; trailing?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <input value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: '0 12px', paddingRight: trailing ? 52 : 12, fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
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
    </div>
  );
}

function FSelect({ label, value, onChange, options, req }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer', background: '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: open ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && (
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

type Hawb = { srNo: number; hawbNumber: string; pieces: string; weight: string };

/* ─── Add House Airway Bill — full-page sub-view ─────────────────── */
function AddHawbPage({ srNo, onSave, onBack }: { srNo: number; onSave: (h: Hawb) => void; onBack: () => void }) {
  const [hawbNumber, setHawbNumber] = useState('');
  const [pieces, setPieces] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('');
  const [subConsolidation, setSubConsolidation] = useState(false);
  const [subAgentCode, setSubAgentCode] = useState('');
  const [subAgentName, setSubAgentName] = useState('');
  const [portOfOriginCode, setPortOfOriginCode] = useState('');
  const [portOfOriginName, setPortOfOriginName] = useState('');
  const [portOfDestCode, setPortOfDestCode] = useState('');
  const [portOfDestName, setPortOfDestName] = useState('');
  const [goodsDesc, setGoodsDesc] = useState('');
  const [partyTab, setPartyTab] = useState<'shipper' | 'consignee'>('shipper');
  const [shipperName, setShipperName] = useState('');
  const [shipperStreet, setShipperStreet] = useState('');
  const [shipperCity, setShipperCity] = useState('');
  const [shipperPhone, setShipperPhone] = useState('');
  const [shipperTelex, setShipperTelex] = useState('');
  const [shipperTelefax, setShipperTelefax] = useState('');
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneeStreet, setConsigneeStreet] = useState('');
  const [consigneeCity, setConsigneeCity] = useState('');
  const [consigneePhone, setConsigneePhone] = useState('');
  const [consigneeTelex, setConsigneeTelex] = useState('');
  const [consigneeTelefax, setConsigneeTelefax] = useState('');
  const [customInfo, setCustomInfo] = useState('');
  const [supplementaryInfo, setSupplementaryInfo] = useState('');

  const valid = hawbNumber.trim() && pieces.trim() && weight.trim();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
      </div>
      <div className="px-4 sm:px-10 mb-[16px] flex items-center gap-[10px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Add House Airway Bill</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>HAWB Details</p>
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="max-w-[420px]">
              <FInput label="HAWB Number" value={hawbNumber} onChange={setHawbNumber} req placeholder="e.g. HAWB-24-771010" />
            </div>
          </div>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FInput label="Number of pieces" value={pieces} onChange={setPieces} req trailing={() => {}} placeholder="Enter pieces" />
            <FInput label="Weight" value={weight} onChange={setWeight} req placeholder="Enter weight" />
            <FInput label="Weight Unit" value={weightUnit} onChange={setWeightUnit} req placeholder="e.g. KG" />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <label className="flex items-center gap-[10px] cursor-pointer">
            <span className="size-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${subConsolidation ? '#1360d2' : '#d5ddfb'}`, background: subConsolidation ? '#1360d2' : '#fff' }} onClick={() => setSubConsolidation(v => !v)}>
              {subConsolidation && <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 10l4 4 8-8" /></svg>}
            </span>
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }} onClick={() => setSubConsolidation(v => !v)}>Sub Consolidation</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <FInput label="Sub Agent Code" value={subAgentCode} onChange={setSubAgentCode} trailing={() => {}} placeholder="Search agent code" disabled={!subConsolidation} />
            <FInput label="Sub Agent Name" value={subAgentName} onChange={setSubAgentName} placeholder="Enter agent name" disabled={!subConsolidation} />
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <FInput label="Port of Origin" value={portOfOriginCode} onChange={setPortOfOriginCode} req placeholder="Port code" />
          <FInput label="Port of Origin Name" value={portOfOriginName} onChange={setPortOfOriginName} req trailing={() => {}} placeholder="Search port" />
          <FInput label="Port of Destination" value={portOfDestCode} onChange={setPortOfDestCode} req placeholder="Port code" />
          <FInput label="Port of Destination Name" value={portOfDestName} onChange={setPortOfDestName} req trailing={() => {}} placeholder="Search port" />
          <div className="sm:col-span-2">
            <FInput label="Goods Description" value={goodsDesc} onChange={setGoodsDesc} req placeholder="Describe the goods" />
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Shipper &amp; Consignee Details</p>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex items-center gap-[8px] border-b border-[#f0f4ff] -mt-[4px]">
              {(['shipper', 'consignee'] as const).map(t => (
                <button key={t} onClick={() => setPartyTab(t)}
                  className="px-[16px] py-[10px] text-[15px] transition-colors"
                  style={{ fontFamily: font, fontWeight: 500, color: partyTab === t ? '#fff' : '#1360d2', background: partyTab === t ? '#1360d2' : 'transparent', borderRadius: '4px 4px 0 0' }}>
                  {t === 'shipper' ? 'Shipper Details' : 'Consignee Details'}
                </button>
              ))}
            </div>
            {partyTab === 'shipper' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                <FInput label="Shipper Name" value={shipperName} onChange={setShipperName} placeholder="Enter shipper name" />
                <FInput label="Shipper Street Address" value={shipperStreet} onChange={setShipperStreet} placeholder="Enter street address" />
                <div className="sm:col-span-2"><FInput label="Shipper City / Country" value={shipperCity} onChange={setShipperCity} trailing={() => {}} placeholder="Search city" /></div>
                <FInput label="Shipper Phone" value={shipperPhone} onChange={setShipperPhone} trailing={() => {}} placeholder="Enter phone" />
                <FInput label="Shipper Telex" value={shipperTelex} onChange={setShipperTelex} placeholder="Enter telex" />
                <FInput label="Shipper Telefax" value={shipperTelefax} onChange={setShipperTelefax} placeholder="Enter telefax" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                <FInput label="Consignee Name" value={consigneeName} onChange={setConsigneeName} placeholder="Enter consignee name" />
                <FInput label="Consignee Street Address" value={consigneeStreet} onChange={setConsigneeStreet} placeholder="Enter street address" />
                <div className="sm:col-span-2"><FInput label="Consignee City / Country" value={consigneeCity} onChange={setConsigneeCity} trailing={() => {}} placeholder="Search city" /></div>
                <FInput label="Consignee Phone" value={consigneePhone} onChange={setConsigneePhone} trailing={() => {}} placeholder="Enter phone" />
                <FInput label="Consignee Telex" value={consigneeTelex} onChange={setConsigneeTelex} placeholder="Enter telex" />
                <FInput label="Consignee Telefax" value={consigneeTelefax} onChange={setConsigneeTelefax} placeholder="Enter telefax" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Security &amp; Regulatory Control Information</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-[16px] items-end" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FInput label="Custom Information" value={customInfo} onChange={setCustomInfo} placeholder="Enter custom information" />
            <FInput label="Supplementary Custom Information" value={supplementaryInfo} onChange={setSupplementaryInfo} placeholder="Enter supplementary information" />
            <button className="h-[56px] px-[18px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px] flex-shrink-0" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              <span>+</span>Add
            </button>
          </div>
        </div>
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-[12px]">
            <button className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-[#1360d2] bg-white transition-colors" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>Reset</button>
            <button onClick={() => onSave({ srNo, hawbNumber, pieces, weight: `${weight} ${weightUnit}`.trim() })}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Save
            </button>
          </div>
        }
      />
    </div>
  );
}

/* ─── New House Manifest ────────────────────────────────────────── */
type Step = 'start' | 'addHawb' | 'success';

type Props = { onBack: () => void; onBackToListing: () => void };

export default function HouseManifestNewRequestPage({ onBack, onBackToListing }: Props) {
  const [step, setStep] = useState<Step>('start');
  const [houseManifestType, setHouseManifestType] = useState('');
  const [manifestType, setManifestType] = useState('');
  const [masterAwbNumber, setMasterAwbNumber] = useState('');
  const [started, setStarted] = useState(false);
  const [pieces, setPieces] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('');
  const [hawbs, setHawbs] = useState<Hawb[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const startValid = houseManifestType.trim() && manifestType.trim() && masterAwbNumber.trim();
  const weightKgs = weight && weightUnit ? `${weight} ${weightUnit}` : '';

  if (step === 'addHawb') {
    return (
      <AddHawbPage
        srNo={hawbs.length + 1}
        onBack={() => setStep('start')}
        onSave={h => { setHawbs(hs => [...hs, h]); setStep('start'); }}
      />
    );
  }

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New House Manifest</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>House Manifest Submitted Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[16px] flex flex-col items-center gap-[6px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Dear Customer Thank You For Using House Manifest Web Application.</p>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Please Find Below Details For Future Reference</p>
              <p className="text-[16px] text-[#0e1b3d] text-center mt-[8px]" style={{ fontFamily: font, fontWeight: 700 }}>Master Airway Bill Number: {masterAwbNumber || '—'}</p>
              <p className="text-[16px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Weight: {weightKgs || '—'}</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <button className="h-[46px] px-[22px] rounded-[4px] text-[15px] text-[#1360d2] bg-white flex items-center gap-[8px]" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>
                Download
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="h-[46px] px-[22px] rounded-[4px] text-[15px] text-[#1360d2] bg-white flex items-center gap-[8px]" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>
                Share
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" strokeLinecap="round" /></svg>
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
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New House Manifest</h1>
        <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
          Need Help
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Enter Information to Get Started</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] items-end">
            <FSelect label="House Manifest Type" value={houseManifestType} onChange={setHouseManifestType} options={['Direct', 'Consolidated']} req />
            <FSelect label="Manifest Type" value={manifestType} onChange={setManifestType} options={['IM3 - Import to Local from CW', 'IM4 - Import for Consumption', 'EX1 - Export', 'TR1 - Transit']} req />
            <FInput label="Master Airline AWB Number" value={masterAwbNumber} onChange={setMasterAwbNumber} req placeholder="e.g. AWB-176-88213456" />
            <button onClick={() => setStarted(true)}
              className="h-[56px] px-[22px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500 }}>
              Start Journey
            </button>
          </div>
        </div>

        {started && (
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Master Airline AWB</p>
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
                <FInput label="Number of pieces" value={pieces} onChange={setPieces} req trailing={() => {}} placeholder="Enter pieces" />
                <FInput label="Weight" value={weight} onChange={setWeight} req placeholder="Enter weight" />
                <FInput label="Weight Unit" value={weightUnit} onChange={setWeightUnit} req placeholder="e.g. KG" />
              </div>
              <div className="max-w-[260px]">
                <FInput label="Weight in Kgs" value={weightKgs} onChange={() => {}} disabled />
              </div>
              <div className="flex items-center gap-[12px] justify-end">
                <button className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  <span>+</span>Upload HAWB&apos;s
                </button>
                <button onClick={() => setStep('addHawb')} className="h-[44px] px-[18px] rounded-[4px] text-[15px] text-white flex items-center gap-[6px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  <span>+</span>Add HAWB&apos;s
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[15px] text-[#697498] mb-[12px]" style={{ fontFamily: font }}>List of HAWB&apos;s Added: <b style={{ color: '#0e1b3d' }}>{hawbs.length}</b></p>
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#e2ebf9' }}>
                      {['SR. No.', 'HAWB Number', 'Number of Pieces', 'Weight', 'Action'].map(h => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hawbs.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No HAWB&apos;s added yet. Click "Add HAWB's" to begin.</td></tr>
                    ) : hawbs.map(h => (
                      <tr key={h.srNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{h.srNo}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{h.hawbNumber}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{h.pieces}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{h.weight}</td>
                        <td className="px-[16px] py-[10px]">
                          <button onClick={() => setHawbs(hs => hs.filter(x => x.srNo !== h.srNo))} className="text-[#c0392b] hover:opacity-70">
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
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <div className="flex items-center gap-[16px]">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <span className="size-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${acceptTerms ? '#1360d2' : '#d5ddfb'}`, background: acceptTerms ? '#1360d2' : '#fff' }} onClick={() => setAcceptTerms(v => !v)}>
                {acceptTerms && <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3"><path d="M4 10l4 4 8-8" /></svg>}
              </span>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }} onClick={() => setAcceptTerms(v => !v)}>Accept <span className="text-[#1360d2] underline">Terms &amp; Conditions</span></span>
            </label>
            <button disabled={!started} className="h-[48px] px-[22px] rounded-[4px] text-[16px] transition-colors"
              style={{ border: '1px solid #1360d2', color: '#1360d2', background: '#fff', opacity: started ? 1 : 0.5, fontFamily: font, fontWeight: 500 }}>
              Save As Draft
            </button>
            <button onClick={() => setStep('success')}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500 }}>
              Submit
            </button>
          </div>
        }
      />
    </div>
  );
}
