import React, { useState } from 'react';
import FloatingField from './FloatingField';
import { DateInputOutlined } from './DatePicker';

// Figma asset URLs (valid 7 days)
const guideIcon      = 'https://www.figma.com/api/mcp/asset/bf8c61a3-23ab-4f57-ae9d-3cd3204577b5';
const tabInfo        = 'https://www.figma.com/api/mcp/asset/de99475f-b87d-4996-8151-ef104430f818';
const tabVideo       = 'https://www.figma.com/api/mcp/asset/38f9b06b-633c-48f5-baf4-17c81f89f0fb';
const tabFaq         = 'https://www.figma.com/api/mcp/asset/a8cb12c4-cd63-4fdb-95e5-958d1a1fb6a2';
const tabUpdates     = 'https://www.figma.com/api/mcp/asset/3147d413-f241-41be-8815-323fb28ee566';
const tabDownloads   = 'https://www.figma.com/api/mcp/asset/f646c55d-ce4a-44e3-93f2-33bad3802861';
const stepArrow      = 'https://www.figma.com/api/mcp/asset/8f5d38b1-54c1-4abd-b722-12a8fc3b4c5c';

type Tab = 'information' | 'tutorials' | 'faqs' | 'updates' | 'downloads';

const HELP_TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'information', label: 'Information',   icon: tabInfo },
  { id: 'tutorials',   label: 'Tutorials',      icon: tabVideo },
  { id: 'faqs',        label: "Common FAQ's",   icon: tabFaq },
  { id: 'updates',     label: 'Updates',         icon: tabUpdates },
  { id: 'downloads',   label: 'Downloads',       icon: tabDownloads },
];

const SERVICE_STEPS = [
  {
    num: '1',
    title: 'Request Submission',
    desc: 'Fill the request information like, regime type, declaration Type, cargo channel etc',
  },
  {
    num: '2',
    title: 'Invoice Details',
    desc: 'Upload or add manually the invoice and HS code details of the cargo.',
  },
  {
    num: '3',
    title: 'Document Upload',
    desc: 'Upload all the relevant documents required for customs and permit documents',
  },
  {
    num: '4',
    title: 'Payment',
    desc: 'Review payment details and submit your cargo transfer request.',
  },
];

const ACCORDION_ITEMS = [
  { id: 'services',   label: 'Services Details' },
  { id: 'fee',        label: 'Service Fee' },
  { id: 'documents',  label: 'Required Documents' },
];

const f = "'Dubai', sans-serif";

const CARRIER_SUGGESTIONS_PRE = [
  { code: '623595', name: 'STK 1026' },
  { code: '623600', name: 'STK 1026 B' },
  { code: '623575', name: 'APL QINGDAO' },
  { code: '623608', name: 'MOL ASANTE' },
  { code: '623512', name: 'MSC DIANA' },
  { code: '623490', name: 'EVER GIVEN' },
  { code: '623455', name: 'MAERSK KENTUCKY' },
];

const VESSEL_ROWS_PRE = [
  { vesselName: 'STK 1026',        rotationNumber: '623595', date: '20/11/2024' },
  { vesselName: 'STK 1026',        rotationNumber: '623600', date: '20/10/2024' },
  { vesselName: 'APL QINGDAO',     rotationNumber: '623575', date: '10/10/2024' },
  { vesselName: 'MOL ASANTE',      rotationNumber: '623608', date: '10/09/2024' },
  { vesselName: 'MSC DIANA',       rotationNumber: '623512', date: '05/09/2024' },
  { vesselName: 'EVER GIVEN',      rotationNumber: '623490', date: '01/09/2024' },
  { vesselName: 'MAERSK KENTUCKY', rotationNumber: '623455', date: '25/08/2024' },
];

const CALLING_PORTS_PRE = ['Jebel Ali Port', 'Dubai International Airport', 'Abu Dhabi Airport', 'Sharjah Airport', 'Khalifa Port'];

function VesselSearchModal({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (rotNum: string, vesselName: string) => void;
}) {
  const [vesselName, setVesselName] = useState('');
  const [callingPort, setCallingPort] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [portOpen, setPortOpen] = useState(false);
  const filtered = VESSEL_ROWS_PRE.filter(r =>
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
        <div className="flex items-center justify-between px-[20px] py-[20px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <p className="text-[20px] text-white" style={{ fontFamily: f, fontWeight: 500 }}>Search Vessel</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>
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
              <button type="button" onClick={() => setPortOpen(o => !o)} className="w-full flex items-center px-[16px] bg-white"
                style={{ height: 56, border: `1px solid ${portOpen ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: f }}>
                <span className="flex-1 text-left text-[16px]" style={{ color: '#051937', opacity: callingPort ? 1 : 0.7 }}>{callingPort || 'Select Calling Port'}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${portOpen ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" /></svg>
              </button>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: f }}>Calling Port</label>
              {portOpen && (
                <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]" style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {CALLING_PORTS_PRE.map(p => (
                    <li key={p} onMouseDown={() => { setCallingPort(p); setPortOpen(false); }} className="px-[16px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9]" style={{ color: p === callingPort ? '#1360d2' : '#051937', fontFamily: f }}>{p}</li>
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
              <button type="button" onClick={handleReset} style={{ height: 48, border: '1px solid #1360d2', borderRadius: 3, background: '#fff', color: '#1360d2', fontFamily: f, fontWeight: 700, fontSize: 16, minWidth: 92, padding: '0 20px' }}>Reset</button>
              <button type="button" style={{ height: 48, borderRadius: 3, background: '#1360d2', color: '#fff', fontFamily: f, fontWeight: 500, fontSize: 16, minWidth: 134, padding: '0 20px' }}>Apply</button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-[20px] pb-[30px]">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: f }}>
            <thead><tr><th style={thS}>Vessel Name</th><th style={thS}>Rotation Number</th><th style={thS}>Date</th><th style={{ ...thS, borderRadius: '0 8px 8px 0' }}>Action</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={tdS}>{row.vesselName}</td>
                  <td style={tdS}>{row.rotationNumber}</td>
                  <td style={tdS}>{row.date}</td>
                  <td style={{ ...tdS, paddingLeft: 18 }}>
                    <button onClick={() => { onSelect(row.rotationNumber, row.vesselName); onClose(); }} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontFamily: f, fontWeight: 500 }}>Select</button>
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

function CarrierSearchField({ value, onChange, onModalOpen }: {
  value: string; onChange: (v: string) => void; onModalOpen: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const floated = focused || value.length > 0;
  const selected = CARRIER_SUGGESTIONS_PRE.find(s => s.code === value);
  const filtered = value.length > 0 && !selected
    ? CARRIER_SUGGESTIONS_PRE.filter(s => s.code.toLowerCase().includes(value.toLowerCase()) || s.name.toLowerCase().includes(value.toLowerCase()))
    : [];
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="relative">
        <div style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <input value={value} onChange={e => { onChange(e.target.value); setShowDrop(true); }}
            onFocus={() => { setFocused(true); if (!selected) setShowDrop(true); }}
            onBlur={() => setTimeout(() => { setFocused(false); setShowDrop(false); }, 150)}
            placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: f }} />
          <button type="button" onClick={onModalOpen} className="flex-shrink-0 size-[22px] flex items-center justify-center ml-[4px]">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          </button>
        </div>
        <label className="absolute pointer-events-none transition-all" style={{
          left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
          fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: f,
          transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
        }}>
          <span style={{ color: '#dc3545' }}>*</span> Carrier Registration Number
        </label>
        {showDrop && filtered.length > 0 && (
          <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]" style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {filtered.map(item => (
              <li key={item.code} onMouseDown={() => { onChange(item.code); setShowDrop(false); }}
                className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9]" style={{ fontFamily: f }}>
                <span style={{ fontWeight: 600, color: '#051937' }}>{item.code}</span>
                <span style={{ color: '#697498' }}> — {item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selected && (
        <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
          <span className="text-[16px]" style={{ color: '#051937', fontWeight: 600, fontFamily: f }}>{selected.name}</span>
        </div>
      )}
    </div>
  );
}

type PrePageValues = { cargoChannel: string; clientRef: string; carrierReg: string; transferType: string };
type Props = {
  onBack: () => void;
  onStartJourney: (values: PrePageValues) => void;
  initialValues?: Partial<PrePageValues>;
  mode?: 'create' | 'amend';
  transferNumber?: string;
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

export default function CargoTransferPrePage({ onBack, onStartJourney, initialValues, mode = 'create', transferNumber }: Props) {
  const [activeTab, setActiveTab]           = useState<Tab>('information');
  const [openAccordion, setOpenAccordion]   = useState<string | null>(null);
  const [transferType, setTransferType]     = useState(initialValues?.transferType ?? '');
  const [transferTypeOpen, setTransferTypeOpen] = useState(false);
  const [cargoChannel, setCargoChannel]     = useState(initialValues?.cargoChannel ?? '');
  const [cargoChannelOpen, setCargoChannelOpen] = useState(false);
  const [clientRef, setClientRef]           = useState(initialValues?.clientRef ?? '');
  const [carrierReg, setCarrierReg]         = useState(initialValues?.carrierReg ?? '');
  const [showVesselModal, setShowVesselModal] = useState(false);

const CARGO_CHANNEL_OPTIONS = ['Sea', 'Air'];

const TRANSFER_TYPE_OPTIONS = [
  'From CTO to CH - Same Location',
  'From CTO to CH - Different Location',
  'From CH to CH - Same Location',
  'From CH to CH - Different Location',
  'From CTO to CTO - Different Location',
];

  return (
    <>
    <VesselSearchModal open={showVesselModal} onClose={() => setShowVesselModal(false)} onSelect={(rotNum) => { setCarrierReg(rotNum); setShowVesselModal(false); }} />
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + Agent */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
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

      {/* Page title */}
      <div className="flex-shrink-0 px-4 sm:px-10 mb-[8px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          {mode === 'amend'
            ? `Amend - ${formatTransferTypeTitle(transferType || initialValues?.transferType || '')}${transferNumber ? ` - ${transferNumber}` : ''}`
            : 'Cargo Transfer'}
        </h1>
      </div>

      {/* Start Journey card — outside scroll container so dropdown isn't clipped */}
      <div className="px-4 sm:px-10 pb-[20px]">
        <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.08)' }}>
          <div className="flex flex-wrap gap-[20px] items-end">
            <div style={{ flex: '1 1 240px', minWidth: 200, position: 'relative' }}>
              {mode === 'amend' ? (
                <>
                  <div
                    className="w-full flex items-center px-[16px]"
                    style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#f4f4f4' }}
                  >
                    <span className="flex-1 text-left text-[16px]" style={{ color: '#0e1b3d', fontFamily: "'Dubai', sans-serif" }}>
                      {transferType || ''}
                    </span>
                  </div>
                  <label className="absolute pointer-events-none" style={{
                    left: 10, top: -9, background: '#f4f4f4', padding: '0 3px',
                    fontSize: 11, color: '#0e1b3d', fontFamily: "'Dubai', sans-serif",
                  }}>
                    <span style={{ color: '#dc3545' }}>*</span> Cargo Transfer Type
                  </label>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setTransferTypeOpen(o => !o)}
                    className="bg-white w-full flex items-center px-[16px] transition-colors"
                    style={{
                      height: 56,
                      border: `1px solid ${transferTypeOpen ? '#1360d2' : '#d5ddfb'}`,
                      borderRadius: 4,
                      fontFamily: "'Dubai', sans-serif",
                    }}
                  >
                    <span className="flex-1 text-left text-[16px]" style={{ color: transferType ? '#0e1b3d' : '#697498' }}>
                      {transferType || ''}
                    </span>
                    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${transferTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </button>
                  <label
                    className="absolute pointer-events-none transition-all"
                    style={{
                      left: (transferTypeOpen || transferType) ? 10 : 16,
                      top: (transferTypeOpen || transferType) ? -9 : '50%',
                      transform: (transferTypeOpen || transferType) ? 'none' : 'translateY(-50%)',
                      background: (transferTypeOpen || transferType) ? '#fff' : 'transparent',
                      padding: (transferTypeOpen || transferType) ? '0 4px' : '0',
                      fontSize: (transferTypeOpen || transferType) ? 12 : 14,
                      color: transferTypeOpen ? '#1360d2' : '#0e1b3d',
                      fontFamily: "'Dubai', sans-serif",
                      transitionDuration: '120ms',
                      transitionProperty: 'top, left, font-size, transform, padding, background, color',
                    }}
                  >
                    <span style={{ color: '#dc3545' }}>*</span> Cargo Transfer Type
                  </label>
                  {transferTypeOpen && (
                    <ul
                      className="absolute z-[50] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                      style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                    >
                      {TRANSFER_TYPE_OPTIONS.map(opt => (
                        <li
                          key={opt}
                          onClick={() => { setTransferType(opt); setTransferTypeOpen(false); }}
                          className="px-[14px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
                          style={{
                            color: opt === transferType ? '#1360d2' : '#0e1b3d',
                            background: opt === transferType ? '#e2ebf9' : 'transparent',
                            fontWeight: opt === transferType ? 500 : 400,
                            fontFamily: "'Dubai', sans-serif",
                          }}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            <div style={{ flex: '1 1 160px', minWidth: 140, position: 'relative' }}>
              <button
                type="button"
                onClick={() => setCargoChannelOpen(o => !o)}
                className="bg-white w-full flex items-center px-[16px] transition-colors"
                style={{
                  height: 56,
                  border: `1px solid ${cargoChannelOpen ? '#1360d2' : '#d5ddfb'}`,
                  borderRadius: 4,
                  fontFamily: "'Dubai', sans-serif",
                }}
              >
                <span className="flex-1 text-left text-[16px]" style={{ color: cargoChannel ? '#0e1b3d' : '#697498' }}>
                  {cargoChannel || ''}
                </span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${cargoChannelOpen ? 'rotate-180' : ''}`}>
                  <path d="M5 8l5 5 5-5" />
                </svg>
              </button>
              <label
                className="absolute pointer-events-none transition-all"
                style={{
                  left: (cargoChannelOpen || cargoChannel) ? 10 : 16,
                  top: (cargoChannelOpen || cargoChannel) ? -9 : '50%',
                  transform: (cargoChannelOpen || cargoChannel) ? 'none' : 'translateY(-50%)',
                  background: (cargoChannelOpen || cargoChannel) ? '#fff' : 'transparent',
                  padding: (cargoChannelOpen || cargoChannel) ? '0 4px' : '0',
                  fontSize: (cargoChannelOpen || cargoChannel) ? 12 : 14,
                  color: cargoChannelOpen ? '#1360d2' : '#0e1b3d',
                  fontFamily: "'Dubai', sans-serif",
                  transitionDuration: '120ms',
                  transitionProperty: 'top, left, font-size, transform, padding, background, color',
                }}
              >
                <span style={{ color: '#dc3545' }}>*</span> Cargo Channel (inbound)
              </label>
              {cargoChannelOpen && (
                <ul
                  className="absolute z-[50] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                  style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                >
                  {CARGO_CHANNEL_OPTIONS.map(opt => (
                    <li
                      key={opt}
                      onClick={() => { setCargoChannel(opt); setCargoChannelOpen(false); }}
                      className="px-[14px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
                      style={{
                        color: opt === cargoChannel ? '#1360d2' : '#0e1b3d',
                        background: opt === cargoChannel ? '#e2ebf9' : 'transparent',
                        fontWeight: opt === cargoChannel ? 500 : 400,
                        fontFamily: "'Dubai', sans-serif",
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{ flex: '1 1 200px', minWidth: 160 }}>
              <FloatingField
                label="Client Doc. Ref. Number"
                required
                value={clientRef}
                onChange={setClientRef}
                placeholder="Enter Ref. Number"
              />
            </div>
            <button
              onClick={() => onStartJourney({ cargoChannel, clientRef, carrierReg, transferType })}
              className="h-[56px] px-[28px] rounded-[4px] text-white text-[16px] hover:opacity-90 transition-opacity w-full sm:w-auto flex-shrink-0"
              style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500, minWidth: 180 }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      {/* Help and Guides — in its own scroll container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[40px]">
        {/* Need Help link */}
        {mode !== 'amend' && (
          <div className="flex items-center gap-[16px] mb-[8px]">
            <button className="flex items-center gap-[4px]">
              <span className="text-[16px] text-[#2950e5]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Need Help</span>
              <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex flex-col gap-[32px]">
          {/* Section title */}
          <div className="flex items-center gap-[16px]">
            <img src={guideIcon} alt="" style={{ width: 22, height: 22 }} />
            <h2 className="text-[24px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
              Help and Guides
            </h2>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-[8px] px-[8px]" style={{ boxShadow: '0px 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center border-b border-[#ddd] overflow-x-auto">
              {HELP_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-[10px] px-[8px] py-[18px] whitespace-nowrap flex-shrink-0 transition-colors"
                    style={{
                      borderBottom: active ? '3px solid #1360d2' : '3px solid transparent',
                      marginBottom: -1,
                      minWidth: 140,
                    }}
                  >
                    <img src={tab.icon} alt="" style={{ width: 18, height: 18, opacity: active ? 1 : 0.55 }} />
                    <span
                      className="text-[16px]"
                      style={{
                        fontFamily: "'Dubai', sans-serif", fontWeight: 500,
                        color: active ? '#1360d2' : '#051937',
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="px-[24px] py-[32px] flex flex-col gap-[40px]">
              {activeTab === 'information' && (
                <>
                  {/* About the Service */}
                  <div className="flex flex-col gap-[16px]">
                    <h3 className="text-[20px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                      About the Service
                    </h3>
                    <div className="text-[16px] text-black flex flex-col gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                      <p>
                        Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.
                      </p>
                      <p>
                        View the declaration assistant.{' '}
                        <span className="text-[#1360d2] cursor-pointer hover:underline">Click here</span>
                      </p>
                    </div>
                  </div>

                  {/* Service Delivery Procedure */}
                  <div className="flex flex-col gap-[20px]">
                    <h3 className="text-[20px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                      Service Delivery Procedure
                    </h3>
                    <div className="flex items-start gap-[14px] flex-wrap justify-start">
                      {SERVICE_STEPS.map((step, i) => (
                        <React.Fragment key={step.num}>
                          <div
                            className="bg-white flex flex-col gap-[20px] px-[22px] py-[16px] rounded-[12px] flex-shrink-0 w-full sm:w-[200px] md:w-[230px]"
                            style={{ boxShadow: '0px 4px 12px rgba(217,217,217,0.53)' }}
                          >
                            <div
                              className="size-[32px] rounded-full flex items-center justify-center text-[16px] text-white flex-shrink-0"
                              style={{ background: '#1aac72', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
                            >
                              {step.num}
                            </div>
                            <div className="flex flex-col gap-[8px]">
                              <p className="text-[16px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                                {step.title}
                              </p>
                              <p className="text-[16px] text-black" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                          {i < SERVICE_STEPS.length - 1 && (
                            <img src={stepArrow} alt="" style={{ width: 80, height: 20, alignSelf: 'center', flexShrink: 0 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Accordion sections */}
                  <div className="flex flex-col gap-[16px]">
                    {ACCORDION_ITEMS.map((item) => {
                      const open = openAccordion === item.id;
                      return (
                        <div key={item.id} className="rounded-[4px] overflow-hidden" style={{ boxShadow: '0px 4px 0px rgba(212,212,212,0.25)' }}>
                          <button
                            onClick={() => setOpenAccordion(open ? null : item.id)}
                            className="w-full flex items-center justify-between px-[22px] py-[16px] transition-colors"
                            style={{ background: '#e8f2ff' }}
                          >
                            <span className="text-[20px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                              {item.label}
                            </span>
                            <div
                              className="size-[28px] rounded-full flex items-center justify-center transition-transform"
                              style={{ background: open ? '#1360d2' : '#a6a6a6', transform: open ? 'rotate(45deg)' : 'none' }}
                            >
                              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                <path d="M7 2v10M2 7h10" />
                              </svg>
                            </div>
                          </button>
                          {open && (
                            <div className="bg-white px-[22px] py-[16px]">
                              <p className="text-[16px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                No information available yet for {item.label}.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {activeTab !== 'information' && (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#d5ddfb" strokeWidth="2">
                    <circle cx="24" cy="24" r="20" />
                    <path d="M24 16v8l4 4" strokeLinecap="round" />
                  </svg>
                  <p className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                    Content coming soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center"
        style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
        >
          Back
        </button>
      </div>
    </div>
    </>
  );
}
