import { useState } from 'react';
import MoreIcon from './MoreIcon';
import Header from './Header';

const font = "'Dubai', 'Segoe UI', sans-serif";
type Variant = 'dangerous' | 'suspicious';
type Props = { variant: Variant; title: string; onClose: () => void; onProceedToDeclaration: () => void };
type Step = 'form' | 'application' | 'shipments' | 'success';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);
const Out = ({ children, onClick }: any) => <button onClick={onClick} data-secondary-btn className="h-[46px] px-[26px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>{children}</button>;
const Fill = ({ children, onClick }: any) => <button onClick={onClick} className="h-[46px] px-[30px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>{children}</button>;

function Field({ label, value = '', type = 'text', onChange, options, unit, placeholder }: { label: string; value?: string; type?: 'text' | 'select' | 'search' | 'date'; onChange?: (v: string) => void; options?: string[]; unit?: string; placeholder?: string }) {
  const [f, setF] = useState(false); const [open, setOpen] = useState(false); const isDrop = !!options; const floated = f || open || !!value;
  return (
    <div className="relative rounded-[4px] border min-w-0" style={{ height: 54, borderColor: f || open ? '#1360d2' : '#d5ddfb', background: '#fff' }}>
      {label && <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{ left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)', background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0, fontSize: floated ? 12 : 15, color: f || open ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, zIndex: 1 }}>{label}</span>}
      {isDrop ? (<>
        <button type="button" onClick={() => setOpen(o => !o)} onBlur={() => setTimeout(() => setOpen(false), 120)} className="flex items-center h-full w-full px-[14px] gap-[6px] text-left"><span className="text-[15px] text-[#0e1b3d] truncate flex-1">{value || placeholder}</span><svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg></button>
        {open && <div className="absolute left-0 top-[58px] z-[20] w-full bg-white rounded-[6px] py-[4px]" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>{options!.map(o => <button key={o} type="button" onMouseDown={() => { onChange?.(o); setOpen(false); }} className="block w-full text-left px-[14px] py-[9px] text-[15px] hover:bg-[#e2ebf9]" style={{ color: o === value ? '#1360d2' : '#0e1b3d' }}>{o}</button>)}</div>}
      </>) : (
        <div className="flex items-center h-full px-[14px] gap-[6px]"><input value={value} onChange={e => onChange?.(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} placeholder={!label ? placeholder : ''} className="text-[15px] text-[#0e1b3d] w-full focus:outline-none bg-transparent placeholder:text-[#a7abbd]" style={{ fontFamily: font }} />{unit && <span className="text-[13px] text-[#5a6282] border-l border-[#e6eaf2] pl-[8px]">{unit} ▾</span>}{type === 'search' && <svg viewBox="0 0 18 18" width="18" height="18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>}{type === 'date' && <svg viewBox="0 0 24 24" className="size-[18px] text-[#697498]" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}</div>
      )}
    </div>
  );
}

function Ring({ percent }: { percent: number }) {
  const r = 22, C = 2 * Math.PI * r, off = C * (1 - percent / 100);
  return (<div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}><svg viewBox="0 0 56 56" width="56" height="56"><circle cx="28" cy="28" r={r} fill="none" stroke="#e6eaf2" strokeWidth="5" /><circle cx="28" cy="28" r={r} fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 28 28)" /></svg><span className="absolute inset-0 flex items-center justify-center text-[13px] text-[#28a745]" style={{ fontWeight: 600 }}>{percent}%</span></div>);
}

/* Dubai Customs "Apply for Declaration" transition modal */
function CustomsModal({ onDone }: { onDone: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center" style={{ background: 'rgba(20,30,55,0.55)' }}>
      <Card className="w-[520px] max-w-[92vw] px-[40px] py-[36px] flex flex-col items-center gap-[16px] text-center">
        <p className="text-[20px] tracking-[3px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>DUBAI CUSTOMS</p>
        <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Apply for Declaration</p>
        <p className="text-[14px] text-[#5a6282]">Hang on! We are filling your information, so you can review &amp; submit</p>
        <div className="flex flex-col gap-[14px] items-start my-[8px]">
          {[['General Information', true], ['Container Details', true], ['Attachments Required', false]].map(([t, done], i) => (
            <div key={i} className="flex items-center gap-[10px]"><span className="size-[22px] rounded-full flex items-center justify-center" style={{ background: done ? '#28a745' : '#fff', border: done ? 'none' : '2px solid #1360d2' }}><svg viewBox="0 0 24 24" className="size-[12px]" fill="none" stroke={done ? '#fff' : '#1360d2'} strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg></span><span className="text-[14px]" style={{ color: done ? '#28a745' : '#1360d2', fontWeight: 500 }}>{t}</span></div>
          ))}
        </div>
        <Fill onClick={onDone}>Continue</Fill>
      </Card>
    </div>
  );
}

export default function DcaaFlowPage({ variant, title, onClose, onProceedToDeclaration }: Props) {
  const [step, setStep] = useState<Step>('form');
  const [showModal, setShowModal] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [shipments, setShipments] = useState<string[][]>([]);
  const proceedCustoms = () => setShowModal(true);
  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 105 }}>
      <div className="flex-shrink-0"><Header onHome={onClose} /></div>
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[6px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]"><span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span><span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#8f94ae] text-[15px]">Integrated Clearance</span><span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#111838] text-[15px] font-medium">DCAA</span></div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>A180-Importer -MAERSK KAKOO UAE LLC</div>
      </div>

      {step === 'form' && <FormStep variant={variant} title={title} onBack={onClose} onProceed={() => setStep(variant === 'dangerous' ? 'application' : 'shipments')} />}
      {step === 'application' && <ApplicationStep title={title} onBack={() => setStep('form')} onSubmit={() => setStep('success')} />}
      {step === 'shipments' && <ShipmentsStep title={title} shipments={shipments} onAdd={() => setAddOpen(true)} onBack={() => setStep('form')} onSubmit={() => setStep('success')} />}
      {step === 'success' && <SuccessStep variant={variant} title={title} onBack={onClose} onProceed={proceedCustoms} />}

      {addOpen && <AddDetailsModal onCancel={() => setAddOpen(false)} onSubmit={() => { setShipments(s => [...s, ['176-45642211', '3', 'Electronics']]); setAddOpen(false); }} />}
      {showModal && <CustomsModal onDone={() => { setShowModal(false); onProceedToDeclaration(); }} />}
    </div>
  );
}

function HelpAndGuides() {
  const proc = [['Request Submission', 'Fill the request information like, regime type, declaration Type, cargo channel etc'], ['Invoice Details', 'Upload or add manually the invoice and HS code details of the cargo.'], ['Document Upload', 'Upload all the relevant documents required for customs and permit documents']];
  return (<>
    <div className="flex items-center gap-[10px] mb-[14px]"><svg viewBox="0 0 24 24" className="size-[22px] text-[#0e1b3d]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg><h2 className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Help and Guides</h2></div>
    <div className="flex items-center gap-[24px] border-b border-[#e6eaf2] mb-[20px] overflow-x-auto">{['Information', 'Tutorials', "Common FAQ's", 'Updates', 'Downloads'].map((t, i) => <span key={t} className={`text-[15px] pb-[10px] whitespace-nowrap ${i === 0 ? 'text-[#1360d2] border-b-2 border-[#1360d2]' : 'text-[#5a6282]'}`}>{t}</span>)}</div>
    <p className="text-[17px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 600 }}>About the Service</p>
    <p className="text-[15px] text-[#5a6282] mb-[24px]">Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.</p>
    <p className="text-[17px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 600 }}>Service Delivery Procedure</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">{proc.map(([t, d], i) => <Card key={i} className="p-[18px]"><div className="size-[26px] rounded-full bg-[#28a745] text-white text-[13px] flex items-center justify-center mb-[10px]" style={{ fontWeight: 600 }}>{i + 1}</div><p className="text-[15px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 600 }}>{t}</p><p className="text-[13px] text-[#5a6282]">{d}</p></Card>)}</div>
  </>);
}

function FormStep({ variant, title, onBack, onProceed }: { variant: Variant; title: string; onBack: () => void; onProceed: () => void }) {
  return (<>
    <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{title}</h1></div>
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
      <Card className="p-[22px] mb-[24px]">
        <p className="text-[15px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Enter the Details to Start Clearance Process</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] items-center">
          {variant === 'dangerous' ? (<>
            <Field label="Airway Bill Number" value="176-12345678" onChange={() => {}} />
            <Field label="Aircraft Movement Type" value="" onChange={() => {}} options={['Import', 'Export', 'Transit']} placeholder="Movement Type" />
            <Field label="Movement Type" value="" onChange={() => {}} options={['By Air', 'Transhipment']} placeholder="Select Movement Type" />
          </>) : (<>
            <Field label="Airway Bill Number" value="176-12345678" onChange={() => {}} />
            <Field label="Place of Inspection" value="Dubai International Airport - DXB" onChange={() => {}} options={['Dubai International Airport - DXB', 'Al Maktoum International - DWC']} />
            <div />
          </>)}
          <Fill onClick={onProceed}>Proceed</Fill>
        </div>
      </Card>
      <HelpAndGuides />
    </div>
    <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out></div>
  </>);
}

function ApplicationStep({ title, onBack, onSubmit }: { title: string; onBack: () => void; onSubmit: () => void }) {
  const flight = ['Airway Bill Number', 'Aircraft Movement Type', 'Movement Type', 'Shipper', 'Consignee', 'Destination', 'Departure Date', 'Flight Number (Destination)', 'Origin', 'Arrival Date', 'Flight Number (Origin)'];
  return (<>
    <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[24px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Application for a {title.replace('DCAA - NOC - ', 'No-objection Certificate to transport ')}</h1></div>
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
      <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Flight Details</p>
      <Card className="p-[20px] mb-[20px]"><div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">{flight.map((l, i) => <Field key={l} label={l} value={l === 'Airway Bill Number' ? '176-12345678' : ''} onChange={() => {}} type={l.includes('Date') ? 'date' : ['Shipper', 'Consignee', 'Destination', 'Origin'].includes(l) ? 'search' : 'text'} options={['Aircraft Movement Type', 'Movement Type'].includes(l) ? ['Import', 'Export'] : undefined} />)}</div></Card>
      <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Dangerous Goods Details</p>
      <Card className="p-[20px]">
        <p className="text-[14px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 600 }}>Item #1</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <Field label="DG Type" value="" onChange={() => {}} options={['Explosives', 'Flammable', 'Corrosive']} placeholder="Select Dangerous/Good Type" />
          <Field label="UN Number" value="" onChange={() => {}} placeholder="UN Number Here" />
          <div />
          <Field label="Quantity" value="" onChange={() => {}} placeholder="Number of Items" />
          <Field label="Weight" value="" onChange={() => {}} unit="Kg" placeholder="Enter Weight" />
          <div className="rounded-[4px] border border-[#d5ddfb] flex items-center justify-between px-[14px]" style={{ height: 54 }}><span className="text-[13px] text-[#8f94ae]">*Attach Copy of Transit Permit</span><span className="flex items-center gap-[6px] text-[#1360d2] text-[13px]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15V3M7 8l5-5 5 5M5 21h14" strokeLinecap="round" /></svg>Upload</span></div>
          <div className="md:col-span-3"><Field label="Description" value="" onChange={() => {}} placeholder="Enter Your Description Here" /></div>
        </div>
        <div className="flex justify-end mt-[14px]"><button className="flex items-center gap-[6px] text-[#1360d2] text-[14px] border border-[#1360d2] rounded-[4px] px-[16px] py-[8px]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>Add more items</button></div>
      </Card>
    </div>
    <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out><div className="flex gap-[12px]"><Out>Save</Out><Fill onClick={onSubmit}>Submit</Fill></div></div>
  </>);
}

function ShipmentsStep({ title, shipments, onAdd, onBack, onSubmit }: { title: string; shipments: string[][]; onAdd: () => void; onBack: () => void; onSubmit: () => void }) {
  return (<>
    <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[24px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{title.replace('DCAA - ', 'Application for ')}</h1></div>
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
      <Card className="p-[22px]">
        <p className="text-[16px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 700 }}>Suspicious Goods Details</p>
        <div className="max-w-[340px] mb-[20px]"><Field label="Place of Inspection" value="Dubai International Airport - DXB" onChange={() => {}} options={['Dubai International Airport - DXB']} /></div>
        <div className="flex items-center justify-between mb-[12px]"><p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Shipment Details</p><button onClick={onAdd} className="flex items-center gap-[6px] text-[#1360d2] text-[14px] border border-[#1360d2] rounded-[4px] px-[16px] py-[8px]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>Add Details</button></div>
        <div className="rounded-[8px] border border-[#eef1f6] overflow-hidden">
          <div className="grid grid-cols-4 px-[16px] py-[12px] text-[13px] text-[#455174]" style={{ background: '#c9def7', fontWeight: 600 }}><span>Airway Bill Number</span><span>Number of Pieces</span><span>Commodity</span><span className="text-right">Action</span></div>
          {shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-[10px] py-[56px]"><svg viewBox="0 0 24 24" className="size-[46px] text-[#c3cbe0]" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.3 7L12 12l8.7-5M12 22V12" /></svg><p className="text-[14px] text-[#8f94ae]">No shipments yet  - start adding shipments</p></div>
          ) : shipments.map((s, i) => <div key={i} className="grid grid-cols-4 px-[16px] py-[14px] text-[14px] text-[#0e1b3d] border-t border-[#eef1f6]"><span>{s[0]}</span><span>{s[1]}</span><span>{s[2]}</span><span className="text-right"><MoreIcon /></span></div>)}
        </div>
        <label className="flex items-center gap-[8px] text-[14px] text-[#0e1b3d] mt-[16px]"><span className="size-[18px] rounded-[4px] bg-[#1360d2] flex items-center justify-center"><svg viewBox="0 0 16 16" className="size-[11px]" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 8l3.5 3.5L13 5" /></svg></span>I agree to Dubai Municipality <span className="text-[#1360d2]">Terms &amp; Conditions</span> and I have read the <span className="text-[#1360d2]">Privacy Policy</span> <span className="text-[#ea2428]">*</span></label>
      </Card>
    </div>
    <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out><Fill onClick={onSubmit}>Submit</Fill></div>
  </>);
}

function AddDetailsModal({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  const fields = ['Airway Bill Number', 'Commodity/Product Name', 'Quantity', 'Cargo Movement Type', 'MSDS Availability', 'Destination', 'Departure Date', 'Flight Number(Destination)', 'Origin', 'Arrival Date', 'Flight Number(Origin)'];
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" style={{ background: 'rgba(20,30,55,0.55)' }}>
      <Card className="w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-[24px]">
        <p className="text-[17px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Shipment Details</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[16px]">{fields.map(l => <Field key={l} label={l} value="" onChange={() => {}} type={l.includes('Date') ? 'date' : ['Destination', 'Origin'].includes(l) ? 'search' : 'text'} options={['Cargo Movement Type', 'MSDS Availability'].includes(l) ? ['Yes', 'No'] : undefined} />)}</div>
        <p className="text-[14px] text-[#0e1b3d] mb-[6px]" style={{ fontWeight: 500 }}>Attach MSDS Availability <span className="text-[#ea2428]">*</span></p>
        <div className="flex items-center gap-[14px] rounded-[6px] py-[18px] px-[16px] mb-[16px]" style={{ border: '1.5px dashed #b5c8e8', background: '#f8fafd' }}><div className="size-[40px] rounded-full bg-[#e9eef7] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[20px] text-[#8a93a6]" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /><polyline points="16 16 12 12 8 16" /></svg></div><span className="text-[14px] text-[#6d707e]">Drag and drop files here  -Or-</span><button className="h-[38px] px-[16px] rounded-[6px] border text-[14px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Browse File</button></div>
        <div className="mb-[16px]"><Field label="Remarks" value="" onChange={() => {}} placeholder="Remarks Here" /></div>
        <div className="flex items-center justify-end gap-[12px]"><Out onClick={onCancel}>Cancel</Out><Fill onClick={onSubmit}>Submit</Fill></div>
      </Card>
    </div>
  );
}

function SuccessStep({ variant, title, onBack, onProceed }: { variant: Variant; title: string; onBack: () => void; onProceed: () => void }) {
  const heading = variant === 'suspicious' ? 'Request Submitted for Inspecting Suspicious Goods Successfully' : 'NOC Submitted Successfully';
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      {/* 65% export progress banner */}
      <div className="bg-white rounded-[8px] px-[24px] py-[16px] flex items-center justify-between gap-[16px] flex-wrap mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <div className="flex items-center gap-[16px]"><Ring percent={65} /><div><p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Export Permit Request Completed</p><p className="text-[13px] text-[#8f94ae]">Click on 'Continue' to move to the next step</p></div></div>
        <Fill onClick={onProceed}>Proceed To Customs Declaration</Fill>
      </div>
      <Card className="flex-1"><div className="flex flex-col items-center justify-center gap-[16px] py-[48px] px-[24px]">
        <div className="size-[80px] rounded-full flex items-center justify-center" style={{ background: '#b7e6c8' }}><div className="size-[52px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[28px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div></div>
        <p className="text-[22px] text-[#0e1b3d] text-center" style={{ fontWeight: 700 }}>{heading}</p>
        <div className="text-center text-[14px] text-[#5a6282] max-w-[600px]"><p>Dear Customer, thank you for using the Dubai Trade application.</p><p>Your NOC Request has been submitted to Dubai Chambers.</p><p>Please note your reference number and proceed with the payment to complete the request.</p></div>
        <div className="flex items-center gap-[8px]"><span className="text-[14px] text-[#5a6282]">NOC Status:</span><span className="px-[12px] py-[3px] rounded-full text-[13px]" style={{ background: '#fff3d6', color: '#b7791f', fontWeight: 500 }}>Submitted</span></div>
        <div className="flex flex-wrap items-center justify-center gap-[12px]"><span className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[9px] text-[14px] text-[#5a6282]">DCAA Reference number: <span className="text-[#1360d2] font-medium">12345678</span></span><span className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[9px] text-[14px] text-[#5a6282]">DT Reference number: <span className="text-[#1360d2] font-medium">12345678</span></span></div>
      </div></Card>
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out><Fill onClick={onProceed}>Proceed To Customs Declaration</Fill></div>
    </div>
  );
}
