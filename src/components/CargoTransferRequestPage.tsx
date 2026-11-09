import React, { useState } from 'react';
import FloatingField from './FloatingField';
import Dh from './Dh';
// @ts-ignore
import containerIllustration from '../assets/Container/Empty Page - Illustration.svg';
// @ts-ignore
import packageIllustration from '../assets/Container/Package - Illustration.svg';

type Props = { onBack: () => void; onSubmit: () => void; mode?: 'create' | 'amend' };

type StepId = 'general' | 'shipping' | 'container' | 'amendment' | 'payment';
const CREATE_STEPS: { id: StepId; label: string }[] = [
  { id: 'general',   label: 'General Information' },
  { id: 'shipping',  label: 'Shipping Details' },
  { id: 'container', label: 'Container/Package Details' },
  { id: 'payment',   label: 'Payment Details' },
];
const AMEND_STEPS: { id: StepId; label: string }[] = [
  { id: 'general',   label: 'General Information' },
  { id: 'shipping',  label: 'Shipping Details' },
  { id: 'container', label: 'Container/Package Details' },
  { id: 'amendment', label: 'Amendment Details' },
  { id: 'payment',   label: 'Payment Details' },
];

const TRANSFER_TYPES = [
  { id: 'cto-ch-same',   title: 'From CTO to CH',   sub: 'Same Location' },
  { id: 'cto-ch-diff',   title: 'From CTO to CH',   sub: 'Different Location' },
  { id: 'ch-ch-same',    title: 'From CH to CH',    sub: 'Same Location' },
  { id: 'ch-ch-diff',    title: 'From CH to CH',    sub: 'Different Location' },
  { id: 'cto-cto-diff',  title: 'From CTO to CTO',  sub: 'Different Location' },
];

const Stepper = ({ activeIndex, steps }: { activeIndex: number; steps: typeof CREATE_STEPS }) => {
  const trailColor = (i: number) => {
    if (i < activeIndex) return '#28a745';
    if (i === activeIndex) return '#0162dd';
    if (i < steps.length - 2) return '#0162dd';
    return '#a1aebe';
  };
  return (
    <div className="bg-white flex items-center justify-center px-[20px] py-[16px] rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      <div className="flex items-center gap-[8px] flex-wrap">
        {steps.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          const labelColor = done ? '#219653' : active ? '#1360d2' : '#697498';
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-[6px]">
                {(done || active) ? (
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <circle cx="12" cy="12" r="11" fill={done ? '#219653' : '#1360d2'} />
                    <path d="M7 12l3.5 3.5L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div className="size-[24px] rounded-full inline-flex items-center justify-center text-[12px]" style={{ background: '#fff', color: '#697498', border: '1.5px solid #a1aebe', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                    {i + 1}
                  </div>
                )}
                <span className="text-[16px] whitespace-nowrap" style={{ color: labelColor, fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-[2px] w-[80px]" style={{ background: trailColor(i) }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Field + TextInput replaced by reusable FloatingField (label animates from inside → border on focus).

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{children}</p>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] ${className}`} style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' }}>{children}</div>
);

/* ───────────── STEP 1 ───────────── */
function GeneralInformation({ values, setValues }: { values: any; setValues: (v: any) => void }) {
  return (
    <div className="flex flex-col gap-[24px]">
      <SectionHeader>Application Details</SectionHeader>
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Cargo Transfer Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[16px]">
          {TRANSFER_TYPES.map((t) => {
            const active = values.transferType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setValues({ ...values, transferType: t.id })}
                className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[7px] text-left transition-colors"
                style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#ddd'}` }}
              >
                <span className="size-[20px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                  {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                </span>
                <span className="flex flex-col gap-[6px] text-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                  <span className="text-[#0e1b3d]" style={{ fontWeight: 500 }}>{t.title}</span>
                  <span className="text-[#696f83]">{t.sub}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[18px] text-[#111838] mt-[24px] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Transferor/Transferee Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Transferor Business Code" required placeholder="Enter Transferor Business Code" searchable />
          <FloatingField label="Transferor Premises Code" required placeholder="Enter Transferor Premises Code" searchable />
          <FloatingField label="Client's Dec. Ref No." required placeholder="A113384" />
          <FloatingField label="Transferee Business Code" required placeholder="Enter Transferee Business Code" searchable />
          <FloatingField label="Transferee Premises Code" required placeholder="Enter Transferee Premises Code" searchable />
        </div>
      </Card>
    </div>
  );
}

/* ───────────── STEP 2 ───────────── */
function ShippingDetails() {
  return (
    <div className="flex flex-col gap-[24px]">
      <SectionHeader>Shipping Details</SectionHeader>
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Inbound Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Cargo Channel (inbound)" required placeholder="Choose Cargo Channel (inbound)" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Carrier Registration No" required placeholder="Enter Carrier Registration No" />
          <FloatingField label="Carrier Name" placeholder="Enter Carrier Name" />
          <FloatingField label="Arrival Date" required placeholder="Select" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><rect x="3" y="5" width="14" height="13" rx="2" /><path d="M3 8h14M7 3v4M13 3v4" strokeLinecap="round" /></svg>} />
          <FloatingField label="Port of Loading" required placeholder="Port of Loading" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Manifest Registration No" placeholder="Enter Manifest Registration No" />
        </div>
      </Card>

      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Cargo Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Cargo Type" required placeholder="Choose Cargo Type" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Weight (Kg)" placeholder="Enter Weight" />
        </div>
      </Card>

      <OutboundDetails />
    </div>
  );
}

const OutboundDetails = () => (
  <>
    <SectionHeader>Outbound Details</SectionHeader>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Transferor Details</p>
        <div className="flex flex-col gap-[16px] text-[16px]">
          <Row k="Transferor Business Name" v="Al Raffiq Trading" />
          <Row k="Transferor Premises Name" v="Raffiq premises" />
        </div>
      </Card>
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Transferee Details</p>
        <div className="flex flex-col gap-[16px] text-[16px]">
          <Row k="Transferee Business Name" v="Al Raffiq Trading" />
          <Row k="License Expires on" v="20-11-2036" />
        </div>
      </Card>
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Broker Details</p>
        <div className="flex flex-col gap-[16px] text-[16px]">
          <Row k="Broker Business Code" v="AE-9106286" />
          <Row k="Broker Business Name" v="SW Logistics LLC" />
          <Row k="License Expires on" v="15-11-2029" />
        </div>
      </Card>
    </div>
  </>
);

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between gap-[12px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
    <span className="text-[#696f83]">{k}</span>
    <span className="text-[#051937]" style={{ fontWeight: 500 }}>{v}</span>
  </div>
);

const Empty = ({ msg, illustration }: { msg: string; illustration?: 'container' | 'package' }) => (
  <div className="bg-[#f8fafd] flex flex-col items-center justify-center py-[60px] rounded-[8px] gap-[16px]">
    <img
      src={illustration === 'package' ? packageIllustration : containerIllustration}
      alt=""
      style={{ height: 120, width: 'auto' }}
    />
    <p className="text-[16px] text-[#051937]" style={{ fontFamily: "'Dubai', sans-serif" }}>{msg}</p>
  </div>
);

/* ───────────── STEP 3 ───────────── */
type ContainerItem = { id: string; number: string; sealNo: string };
type PackageItem = { id: string; count: string; type: string; marks: string };

const ContainerIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="12" rx="1" />
    <path d="M7 6v12M11 6v12M15 6v12M19 6v12" />
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8l-9 4-9-4 9-4 9 4z" />
    <path d="M3 8v8l9 4 9-4V8" />
    <path d="M12 12v8" />
  </svg>
);

const DeleteIconBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="bg-[#fdf2f3] hover:bg-[#fbdde0] rounded-[8px] p-[6px] inline-flex items-center justify-center transition-colors" aria-label="Delete">
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M8 6V3.5a1 1 0 011-1h2a1 1 0 011 1V6M5 6l1 11a1.5 1.5 0 001.5 1.4h5A1.5 1.5 0 0014 17l1-11" />
      <path d="M9 10v5M11 10v5" />
    </svg>
  </button>
);

const ListCard = ({
  icon, fields, onDelete,
}: {
  icon: React.ReactNode;
  fields: { label: string; value: string }[];
  onDelete: () => void;
}) => (
  <div className="bg-[#f8fafd] border border-[#dae7fc] rounded-[8px] flex items-center gap-[16px] p-[16px]">
    <div className="bg-white border border-[#bfd3f2] rounded-[8px] p-[8px] flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0px 0px 12px rgba(0,0,0,0.06)' }}>
      {icon}
    </div>
    {fields.map((f, i) => (
      <div key={i} className={`flex flex-col gap-[6px] ${i === fields.length - 1 ? 'flex-1 min-w-0' : 'flex-shrink-0'}`} style={{ fontFamily: "'Dubai', sans-serif" }}>
        <span className="text-[12px] text-[#696f83] whitespace-nowrap">{f.label}</span>
        <span className="text-[16px] text-[#051937] truncate">{f.value || '-'}</span>
      </div>
    ))}
    <DeleteIconBtn onClick={onDelete} />
  </div>
);

function AddPackageModal({
  open, onClose, onAdd,
}: { open: boolean; onClose: () => void; onAdd: (p: { count: string; type: string; marks: string }) => void }) {
  const [count, setCount] = useState('');
  const [type, setType] = useState('');
  const [marks, setMarks] = useState('');
  if (!open) return null;
  const PACKAGE_TYPES = ['BAGS', 'BOXES', 'CARTONS', 'PALLETS', 'DRUMS', 'CRATES'];
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px] py-[24px]" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] p-[24px] flex flex-col gap-[32px]" style={{ width: 'min(640px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="flex items-start justify-between">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Add Package Details</p>
          <button onClick={onClose} className="size-[24px] inline-flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]" aria-label="Close">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-[24px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <FloatingField label="No. of Packages" required value={count} onChange={setCount} placeholder="Enter" />
            <PackageTypeDropdown value={type} onChange={setType} options={PACKAGE_TYPES} />
          </div>
          <FloatingField label="Shipping Marks" value={marks} onChange={setMarks} placeholder="Enter Shipping Marks" height={128} />
        </div>

        <div className="flex gap-[8px] justify-end">
          <button onClick={onClose} data-secondary-btn className="flex-1 border border-[#1360d2] rounded-[4px] py-[12px] text-[16px] text-[#1360d2] transition-colors" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Cancel</button>
          <button
            onClick={() => { if (count && type) { onAdd({ count, type, marks }); setCount(''); setType(''); setMarks(''); onClose(); } }}
            disabled={!count || !type}
            className="flex-1 bg-[#1360d2] hover:bg-[#0e4db8] disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] py-[12px] text-[16px] text-white transition-colors"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageTypeDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  const floated = focused || filled || open;
  const borderColor = open || focused ? '#1360d2' : '#d5ddfb';
  return (
    <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setFocused(true); }}
        onBlur={() => setFocused(false)}
        className="bg-white rounded-[4px] flex items-center px-[16px] w-full transition-colors"
        style={{ border: `1px solid ${borderColor}`, height: 56 }}
      >
        <span className="flex-1 text-left text-[16px] text-[#0e1b3d]">{value || ''}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" /></svg>
      </button>
      <label
        className="absolute pointer-events-none transition-all"
        style={{
          left: floated ? 10 : 16, top: floated ? -9 : '50%',
          transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent',
          padding: floated ? '0 4px' : 0,
          fontSize: floated ? 12 : 14,
          color: floated ? (open || focused ? '#1360d2' : '#0e1b3d') : '#455174',
          transitionDuration: '120ms',
          transitionProperty: 'top, left, font-size, transform, padding, background, color',
        }}
      >
        <span style={{ color: '#dc3545' }}>*</span> Package Type
      </label>
      {open && (
        <ul className="absolute z-[10] left-0 right-0 top-[60px] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map((o) => {
            const active = o === value;
            return (
              <li
                key={o}
                onClick={() => { onChange(o); setOpen(false); }}
                className="px-[14px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] hover:text-[#1360d2] transition-colors"
                style={{ color: active ? '#1360d2' : '#0e1b3d', background: active ? '#e2ebf9' : 'transparent', fontWeight: active ? 500 : 400 }}
              >
                {o}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ContainerPackageDetails({ containers, setContainers, packages, setPackages, mode }: {
  containers: ContainerItem[]; setContainers: React.Dispatch<React.SetStateAction<ContainerItem[]>>;
  packages: PackageItem[]; setPackages: React.Dispatch<React.SetStateAction<PackageItem[]>>;
  mode: 'create' | 'amend';
}) {
  const [containerInput, setContainerInput] = useState('');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [tab, setTab] = useState<'container' | 'package'>('container');

  const addContainer = () => {
    if (!containerInput.trim()) return;
    setContainers((c) => [...c, { id: String(Date.now()), number: containerInput.trim(), sealNo: '1212323' }]);
    setContainerInput('');
  };

  const showTabs = mode === 'amend';
  const showContainerCard = !showTabs || tab === 'container';
  const showPackageCard = !showTabs || tab === 'package';

  return (
    <div className="flex flex-col gap-[24px]">
      <SectionHeader>Container/Package Details</SectionHeader>

      {showTabs && (
        <div className="bg-[#e7eef8] inline-flex p-[4px] gap-[6px] rounded-[6px] self-start border border-[#f3f4f6]">
          {(['container', 'package'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="h-[40px] min-w-[140px] px-[16px] rounded-[4px] text-[16px] transition-colors"
              style={{
                background: tab === id ? '#fff' : 'transparent',
                border: tab === id ? '1px solid #f1f3f7' : '1px solid transparent',
                color: tab === id ? '#1360d2' : '#697498',
                fontFamily: "'Dubai', sans-serif", fontWeight: 500,
              }}
            >
              {id === 'container' ? 'Container Details' : 'Package Details'}
            </button>
          ))}
        </div>
      )}

      {/* Container Details card */}
      {showContainerCard && (
      <Card>
        <p className="text-[18px] text-[#051937] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Container Details</p>
        <div className="flex items-center gap-[12px] mb-[16px]">
          <div style={{ width: 280 }}>
            <FloatingField label="Enter Container No." required placeholder="Container No." value={containerInput} onChange={setContainerInput} />
          </div>
          <button onClick={addContainer} data-secondary-btn className="border border-[#1360d2] rounded-[3px] px-[12px] py-[10px] inline-flex items-center gap-[4px] text-[16px] text-[#1360d2] transition-colors" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, height: 56 }}>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
            Add
          </button>
        </div>
        {containers.length === 0 ? (
          <Empty msg='No Container have been added yet. Click "Add" to begin.' illustration="container" />
        ) : (
          <div className="flex flex-col gap-[16px]">
            {containers.map((c) => (
              <ListCard
                key={c.id}
                icon={<ContainerIcon />}
                fields={[
                  { label: 'Container Number', value: c.number },
                  { label: 'Container Seal No.', value: c.sealNo },
                ]}
                onDelete={() => setContainers((cs) => cs.filter((x) => x.id !== c.id))}
              />
            ))}
          </div>
        )}
      </Card>
      )}

      {/* Package Details card */}
      {showPackageCard && (
      <div className="bg-white rounded-[8px] p-[20px] flex flex-col gap-[16px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[18px] text-[#051937]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Package Details</p>
          <button onClick={() => setShowPackageModal(true)} data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[16px] py-[8px] inline-flex items-center gap-[8px] text-[16px] text-[#1360d2] transition-colors" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
            Add Package Details
          </button>
        </div>
        {packages.length === 0 ? (
          <Empty msg='No Package have been added yet. Click "Add" to begin.' illustration="package" />
        ) : (
          <div className="flex flex-col gap-[16px]">
            {packages.map((p) => (
              <ListCard
                key={p.id}
                icon={<PackageIcon />}
                fields={[
                  { label: 'No. of Packages', value: p.count },
                  { label: 'Package Type', value: p.type },
                  { label: 'Shipping Marks', value: p.marks },
                ]}
                onDelete={() => setPackages((ps) => ps.filter((x) => x.id !== p.id))}
              />
            ))}
          </div>
        )}
      </div>
      )}

      <AddPackageModal
        open={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        onAdd={(p) => setPackages((ps) => [...ps, { id: String(Date.now()), ...p }])}
      />

      <OutboundDetails />
    </div>
  );
}

/* ───────────── STEP 4 — Amendment Details (amend mode only) ───────────── */
function AmendmentDetails() {
  const [amendmentReason, setAmendmentReason] = useState('');
  const [cargoStatus, setCargoStatus] = useState('');
  const [fileName, setFileName] = useState('');

  return (
    <div className="flex flex-col gap-[24px]">
      <SectionHeader>Amendment Details</SectionHeader>

      {/* General Information summary */}
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>General Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[16px]">
          <Row k="Request Number" v="123435465" />
          <Row k="Cargo Transfer No." v="1232443434" />
          <Row k="Transaction Type" v="CTO → CH (Same Location)" />
          <Row k="Request Date" v="23-04-2026" />
        </div>
      </Card>

      {/* Amended Summary */}
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Amended Summary</p>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                {['Amended Attribute', 'Old Value', 'New Value'].map((h, i, arr) => (
                  <th key={h} style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#000', fontSize: 14, borderTopLeftRadius: i === 0 ? 6 : 0, borderTopRightRadius: i === arr.length - 1 ? 6 : 0 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">No. of Containers</span></td>
                <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#455174]">2</span></td>
                <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>3</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charge Details */}
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Charge Details</p>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                {['Charge', 'Old Amount', 'New Amount'].map((h, i, arr) => (
                  <th key={h} style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#000', fontSize: 14, borderTopLeftRadius: i === 0 ? 6 : 0, borderTopRightRadius: i === arr.length - 1 ? 6 : 0 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { charge: 'Registration Fee', oldAmt: '—', newAmt: '—' },
                { charge: 'Declaration Amendment Charges', oldAmt: 'Dh 40.00', newAmt: 'Dh 25.00' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#0e1b3d]">{r.charge}</span></td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#455174]">{r.oldAmt}</span></td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f0f3fa' }}><span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{r.newAmt}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Outbound Details — amendment form */}
      <Card>
        <p className="text-[18px] text-[#111838] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Outbound Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <FloatingField label="Amendment Reason" required value={amendmentReason} onChange={setAmendmentReason} placeholder="Please Select" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Cargo Status" required value={cargoStatus} onChange={setCargoStatus} placeholder="Please Select" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
        </div>
        <div className="mt-[20px]">
          <p className="text-[16px] text-[#060c28] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif" }}><span style={{ color: '#dc3545' }}>*</span> Attachment</p>
          <label className="bg-white border border-[#d5ddfb] rounded-[4px] flex items-center gap-[12px] px-[16px] py-[14px] cursor-pointer hover:border-[#1360d2] transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M21 12.5l-8.5 8.5a5 5 0 01-7-7L14 5.5a3.5 3.5 0 014.95 4.95L11 18.5a2 2 0 01-2.83-2.83l7.07-7.07" />
            </svg>
            <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
            <span className="text-[16px] text-[#1360d2]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Upload</span>
            <span className="text-[16px] text-[#697498] flex-1" style={{ fontFamily: "'Dubai', sans-serif" }}>{fileName || 'No files Selected'}</span>
          </label>
        </div>
      </Card>
    </div>
  );
}

/* ───────────── STEP 4 ───────────── */
function PaymentDetails({ agreed, setAgreed }: { agreed: boolean; setAgreed: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-[24px]">
<SectionHeader>Payment Details</SectionHeader>
      <div className="bg-white rounded-[8px] p-[16px] overflow-x-auto" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: "'Dubai', sans-serif" }}>
          <thead>
            <tr>
              {['Charges', '', 'Payment Mode', 'Payment Reference'].map((h, i, arr) => (
                <th key={i} style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', color: '#000', fontSize: 16, fontWeight: 500, borderTopLeftRadius: i === 0 ? 6 : 0, borderTopRightRadius: i === arr.length - 1 ? 6 : 0 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2} style={{ padding: '20px 16px', verticalAlign: 'top' }}>
                <div className="flex flex-col gap-[12px]">
                  <div className="bg-[#eff2f7] flex items-center gap-[12px] px-[12px] h-[49px]">
                    <span className="text-[16px] text-[#696f83] flex-1" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Total Charges</span>
                    <span className="text-[20px] text-[#051937] inline-flex items-baseline gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}><Dh /> 100</span>
                  </div>
                  <div className="px-[12px] flex items-center gap-[12px]">
                    <span className="text-[16px] text-[#696f83] flex-1" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Other charges</span>
                    <span className="text-[16px] text-[#051937] inline-flex items-baseline gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}><Dh /> 80</span>
                  </div>
                  <div className="px-[12px] flex items-center gap-[12px]">
                    <span className="text-[16px] text-[#696f83] flex-1" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Registration Fee</span>
                    <span className="text-[16px] text-[#051937] inline-flex items-baseline gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}><Dh /> 20</span>
                  </div>
                </div>
              </td>
              <td style={{ padding: '20px 16px', verticalAlign: 'top' }}>
                <FloatingField label="Payment Mode" placeholder="Standard Guarantee" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
              </td>
              <td style={{ padding: '20px 16px', verticalAlign: 'top' }}>
                <FloatingField label="Account Number" placeholder="Account Number" trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <OutboundDetails />

      <div className="bg-white rounded-[8px] p-[20px] flex gap-[16px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <button onClick={() => setAgreed(!agreed)} role="checkbox" aria-checked={agreed} className="size-[24px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center" style={{ border: `2px solid ${agreed ? '#1360d2' : '#a7abb2'}`, background: agreed ? '#1360d2' : '#fff' }}>
          {agreed && <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
        </button>
        <p className="text-[16px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: 1.32 }}>
          We, the undersigned hereby declare that the particulars given on this request are true and complete. And we hereby undertake the full accountability of cargo being transferred against this cargo transfer request and that no goods or cargo that are transferred to our custody will be delivered or released to any person or entity unless cleared by customs again on the relevant declaration. We further undertake to comply with all regulations and laws that are in force in the country in respect of the storage, delivery and disposal of this cargo.
        </p>
      </div>
    </div>
  );
}

/* ───────────── SUBMIT MODAL ───────────── */
function SubmitSummaryModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  const fields = [
    { k: 'Cargo Transfer Type', v: 'Cargo Transfer from CTO to CH (Same Location)' },
    { k: 'Cargo Transfer Date', v: 'Sea' },
    { k: 'Transferor Business Code-Name', v: 'Declared' },
    { k: 'Transferor Premises Code-Name', v: 'Declared' },
    { k: 'Transferee Business Code-Name', v: 'Declared' },
    { k: 'Transferee Premises Code-Name', v: 'Declared' },
    { k: 'Broker Business Code-Name', v: 'Declared' },
    { k: 'Client Dec. Ref. No.', v: 'Declared' },
    { k: 'Inbound Cargo Channel', v: 'Declared' },
    { k: 'Inbound Carrier Registration No.', v: 'Declared' },
    { k: 'Inbound Carrier Registration Name', v: 'Declared' },
    { k: 'Arrival Date', v: '24-02-2013' },
    { k: 'MAWB/MBOL No.', v: '24-02-2013' },
    { k: 'Outbound Cargo Channel', v: '24-02-2013' },
  ];
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px] py-[24px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden" style={{ width: 'min(1100px, 100%)', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px]">
          <p className="text-[20px] text-[#f8fafd]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Cargo Transfer Request Summary</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[24px] py-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[16px]">
            {fields.map((f) => (
              <div key={f.k} className="flex flex-col gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                <span className="text-[16px] text-[#696f83]">{f.k}</span>
                <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.v}</span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-[#f3f4f6] rounded-[8px] mt-[24px] p-[24px]" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <p className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Payment Details</p>
            <div className="flex flex-col gap-[16px]">
              {[['Deposit', 50], ['Other Charges', 50], ['Registration Fee', 0]].map(([k, v]) => (
                <div key={k as string} className="flex items-center justify-between" style={{ fontFamily: "'Dubai', sans-serif" }}>
                  <span className="text-[16px] text-[#051a37]" style={{ fontWeight: 500 }}>{k}</span>
                  <span className="text-[16px] text-[#0e1b3d] inline-flex items-baseline gap-[4px]" style={{ fontWeight: 500 }}><Dh /> {v}</span>
                </div>
              ))}
              <div className="border-t border-[#e2e4e9] pt-[16px] flex items-center justify-between">
                <span className="text-[18px] text-[#051a37]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Total Payment</span>
                <span className="text-[18px] text-[#1360d2] inline-flex items-baseline gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}><Dh /> 90.00</span>
              </div>
              <p className="text-[16px] text-[#696f83]" style={{ fontFamily: "'Dubai', sans-serif" }}>All fees are non-refundable. Payment may be subject to Knowledge/Innovation fees.</p>
            </div>
          </div>
        </div>
        <div className="bg-white px-[24px] py-[16px] flex justify-end gap-[12px]" style={{ borderTop: '1px solid #e2ebf9' }}>
          <button onClick={onClose} data-secondary-btn className="h-[48px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Back</button>
          <button onClick={onConfirm} className="h-[48px] px-[40px] rounded-[4px] bg-[#1360d2] text-white text-[16px] hover:bg-[#0E4DB8]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Submit</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── PAGE ───────────── */
export default function CargoTransferRequestPage({ onBack, onSubmit, mode = 'create' }: Props) {
  const STEPS = mode === 'amend' ? AMEND_STEPS : CREATE_STEPS;
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const [values, setValues] = useState<any>({ transferType: 'cto-ch-same' });
  const [agreed, setAgreed] = useState(false);
  const [containers, setContainers] = useState<ContainerItem[]>(
    mode === 'amend'
      ? [
          { id: 'c1', number: 'CN12134343454', sealNo: '1212323' },
          { id: 'c2', number: 'CN98765432101', sealNo: '5566778' },
        ]
      : []
  );
  const [packages, setPackages] = useState<PackageItem[]>(
    mode === 'amend'
      ? [
          { id: 'p1', count: '1000', type: 'BAGS', marks: '-' },
          { id: 'p2', count: '250',  type: 'BOXES', marks: 'BOL - 12345678' },
        ]
      : []
  );

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          {mode === 'amend' ? 'Amend Cargo Transfer Request' : 'New Cargo Transfer Request'}
        </h1>

        <div className="pt-[16px]">
          <Stepper activeIndex={stepIdx} steps={STEPS} />
        </div>
        {step.id === 'general' && <GeneralInformation values={values} setValues={setValues} />}
        {step.id === 'shipping' && <ShippingDetails />}
        {step.id === 'container' && (
          <ContainerPackageDetails
            mode={mode}
            containers={containers} setContainers={setContainers}
            packages={packages} setPackages={setPackages}
          />
        )}
        {step.id === 'amendment' && <AmendmentDetails />}
        {step.id === 'payment' && <PaymentDetails agreed={agreed} setAgreed={setAgreed} />}
      </div>

      <div className="bg-white px-4 sm:px-10 py-[20px] flex items-center justify-between flex-shrink-0" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button
          onClick={() => stepIdx === 0 ? onBack() : setStepIdx((i) => i - 1)}
          data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2]"
          style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
        >
          Back
        </button>
        {stepIdx < STEPS.length - 1 ? (
          <button
            onClick={() => setStepIdx((i) => i + 1)}
            className="h-[48px] px-[40px] rounded-[4px] bg-[#1360d2] text-white text-[16px] hover:bg-[#0E4DB8]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => onSubmit()}
            className="h-[48px] px-[40px] rounded-[4px] bg-[#1360d2] text-white text-[16px] hover:bg-[#0E4DB8]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
          >
            {mode === 'amend' ? 'Submit Amendment' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
