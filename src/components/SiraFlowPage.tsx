import { useState } from 'react';
import MoreIcon from './MoreIcon';
import Header from './Header';
import JourneyProgress from './JourneyBanner';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', 'Segoe UI', sans-serif";
type Props = { onClose: () => void; onProceedToDeclaration: () => void };
type Step = 'form' | 'details' | 'documents' | 'success';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);

function Field({ label, value = '', type = 'text', onChange, options }: { label: string; value?: string; type?: 'text' | 'select'; onChange?: (v: string) => void; options?: string[] }) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const isDrop = !!options;
  const floated = focused || open || !!value;
  return (
    <div className="relative rounded-[4px] border min-w-0" style={{ height: 54, borderColor: focused || open ? '#1360d2' : '#d5ddfb', background: '#fff' }}>
      {label && <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{ left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)', background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0, fontSize: floated ? 12 : 15, color: focused || open ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>{label}</span>}
      {isDrop ? (
        <>
          <button type="button" onClick={() => setOpen(o => !o)} onBlur={() => setTimeout(() => setOpen(false), 120)} className="flex items-center h-full w-full px-[14px] gap-[6px] text-left">
            <span className="text-[15px] text-[#0e1b3d] truncate flex-1">{value}</span>
            <svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {open && <div className="absolute left-0 top-[58px] z-[20] w-full bg-white rounded-[6px] py-[4px]" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>{options!.map(o => <button key={o} type="button" onMouseDown={() => { onChange?.(o); setOpen(false); }} className="block w-full text-left px-[14px] py-[9px] text-[15px] hover:bg-[#e2ebf9]" style={{ color: o === value ? '#1360d2' : '#0e1b3d' }}>{o}</button>)}</div>}
        </>
      ) : (
        <input value={value} onChange={e => onChange?.(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="text-[15px] text-[#0e1b3d] w-full h-full px-[14px] focus:outline-none bg-transparent" style={{ fontFamily: font }} />
      )}
    </div>
  );
}

const Out = ({ children, onClick }: any) => <button onClick={onClick} data-secondary-btn className="h-[46px] px-[26px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>{children}</button>;
const Fill = ({ children, onClick }: any) => <button onClick={onClick} className="h-[46px] px-[30px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>{children}</button>;

const TITLE = 'Hazardous Goods - Chemical Materials - Import NOC Request';

function Stepper({ active }: { active: number }) {
  const steps = ['Request Details', 'Cargo Details', 'Attachments', 'Pay & Submit'];
  return (
    <Card className="px-[20px] py-[14px] mb-[18px]"><div className="flex items-center overflow-x-auto no-scrollbar">
      {steps.map((s, i) => (<div key={s} className="flex items-center flex-shrink-0">
        <div className="flex items-center gap-[8px]">
          <span className="size-[22px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: i < active ? '#28a745' : '#fff', border: i < active ? 'none' : `2px solid ${i === active ? '#1360d2' : '#c3cbe0'}` }}>{i < active ? <svg viewBox="0 0 24 24" className="size-[12px]" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg> : <span className="size-[8px] rounded-full" style={{ background: i === active ? '#1360d2' : '#c3cbe0' }} />}</span>
          <span className="text-[13px] whitespace-nowrap" style={{ color: i < active ? '#28a745' : i === active ? '#1360d2' : '#8f94ae', fontWeight: 500 }}>{s}</span>
        </div>
        {i < steps.length - 1 && <div className="h-[1.5px] mx-[10px]" style={{ background: i < active ? '#28a745' : '#c5cef7', width: 100 }} />}
      </div>))}
    </div></Card>
  );
}

export default function SiraFlowPage({ onClose, onProceedToDeclaration }: Props) {
  const [step, setStep] = useState<Step>('form');
  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 100 }}>
      <div className="flex-shrink-0"><Header onHome={onClose} /></div>
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[6px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#8f94ae] text-[15px]">Integrated Clearance</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#111838] text-[15px] font-medium">DCAA</span>
        </div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>A180-Importer -MAERSK KAKOO UAE LLC</div>
      </div>

      {step === 'form' && <FormStep onBack={onClose} onProceed={() => setStep('details')} />}
      {step === 'details' && <DetailsStep onBack={() => setStep('form')} onNext={() => setStep('documents')} />}
      {step === 'documents' && <DocumentsStep onBack={() => setStep('details')} onSubmit={() => setStep('success')} />}
      {step === 'success' && <SuccessStep onBack={onClose} onProceed={onProceedToDeclaration} />}
    </div>
  );
}

function FormStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  const [rt, setRt] = useState('Import Permit');
  const [pc, setPc] = useState('');
  const [tm, setTm] = useState('Sea Freight');
  const [bol, setBol] = useState('');
  const proc = [['Request Submission', 'Fill the request information like, regime type, declaration Type, cargo channel etc'], ['Invoice Details', 'Upload or add manually the invoice and HS code details of the cargo.'], ['Document Upload', 'Upload all the relevant documents required for customs and permit documents']];
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{TITLE}</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="p-[22px] mb-[24px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Request Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[16px] items-center">
            <Field label="Request Type" value={rt} onChange={setRt} options={['Import Permit', 'Export Permit', 'Re-Export Permit']} />
            <Field label="Product Category" value={pc} onChange={setPc} options={['Chemical Materials', 'Explosives', 'Radioactive Materials', 'Compressed Gases']} />
            <Field label="Transportation Method" value={tm} onChange={setTm} options={['Sea Freight', 'Air Freight', 'Land Freight']} />
            <Field label="BOL Number/ AWB Number" value={bol} onChange={setBol} />
            <Fill onClick={onProceed}>Proceed</Fill>
          </div>
        </Card>
        <div className="flex items-center gap-[10px] mb-[14px]"><svg viewBox="0 0 24 24" className="size-[22px] text-[#0e1b3d]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg><h2 className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Help and Guides</h2></div>
        <div className="flex items-center gap-[24px] border-b border-[#e6eaf2] mb-[20px] overflow-x-auto">{['Information', 'Tutorials', "Common FAQ's", 'Updates', 'Downloads'].map((t, i) => <span key={t} className={`text-[15px] pb-[10px] whitespace-nowrap ${i === 0 ? 'text-[#1360d2] border-b-2 border-[#1360d2]' : 'text-[#5a6282]'}`}>{t}</span>)}</div>
        <p className="text-[17px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 600 }}>About the Service</p>
        <p className="text-[15px] text-[#5a6282] mb-[24px]">Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.</p>
        <p className="text-[17px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 600 }}>Service Delivery Procedure</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">{proc.map(([t, d], i) => <Card key={i} className="p-[18px]"><div className="size-[26px] rounded-full bg-[#28a745] text-white text-[13px] flex items-center justify-center mb-[10px]" style={{ fontWeight: 600 }}>{i + 1}</div><p className="text-[15px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 600 }}>{t}</p><p className="text-[13px] text-[#5a6282]">{d}</p></Card>)}</div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out></div>
    </>
  );
}

function DetailsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const cols = ['HS Code', 'Goods Description', 'Brand', 'Model', 'Category', 'Purpose of Use', 'Value of Goods', 'Gross Weight', 'Net Weight', 'Total Gross W', 'Action'];
  const rows = Array.from({ length: 7 }, (_, i) => [['AX', 'BX', 'CX', 'DX', 'EX', 'EX', 'EX'][i] + '1234567', 'Spare parts', 'New', 'New', 'New', 'India', 'AED 1500', '100 kg', '100 kg', '100 kg']);
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{TITLE}</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Stepper active={0} />
        <Card className="p-[22px] mb-[20px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Request Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            <div className="lg:col-span-2"><Field label="Request Type" value="Import Permit" options={['Import Permit']} /></div>
            <div className="lg:col-span-2"><Field label="Product Category" value="Chemical Materials" options={['Chemical Materials']} /></div>
            {['Importer', 'Vendor', 'Shipping Company', 'Transportation Method', 'BOL', 'Shipping Invoice Number', 'Country of Loading', 'Port of Loading', 'Transit via Type', 'Transit via Country', 'Transit via Port', 'Entry in via Dubai Port'].map((l) => (
              <Field key={l} label={l} value="" onChange={() => {}} options={['Transportation Method', 'Transit via Type', 'Transit via Country', 'Transit via Port'].includes(l) ? ['Sea Freight', 'Air Freight'] : undefined} />
            ))}
          </div>
        </Card>
        <Card className="p-[22px]">
          <div className="flex items-center justify-between mb-[4px]"><p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>HS Code Details</p><Fill>Add New Items</Fill></div>
          <p className="text-[13px] text-[#8f94ae] mb-[12px]">20 Line items available</p>
          <div className="pb-[4px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={80} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto rounded-[8px] border border-[#eef1f6]">
              <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: '#eaf1fb' }}>
                    {cols.slice(0, -1).map(c => <th key={c} className="text-left text-[13px] text-[#455174] px-[12px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}
                    <th className="text-left text-[13px] text-[#455174] px-[12px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600, background: '#eaf1fb', position: 'sticky', right: 0, minWidth: 80, width: 80, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>{cols[cols.length - 1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri} className="border-t border-[#eef1f6]">
                      {r.map((v, ci) => <td key={ci} className="text-[13px] text-[#0e1b3d] px-[12px] py-[12px] whitespace-nowrap">{v}</td>)}
                      <td className="px-[12px] py-[12px]" style={{ background: '#fff', position: 'sticky', right: 0, minWidth: 80, width: 80, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}>
                        <MoreIcon />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out><Fill onClick={onNext}>Next</Fill></div>
    </>
  );
}

function DocumentsStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [sel, setSel] = useState(0);
  const [dragging, setDragging] = useState(false);
  const docs = ['Trade License', 'Performa Invocie', 'Packing List', 'NOC from Ministry of Interior', 'Customs Declaration', 'Other Supporting Documents'];
  const uploaded = [['Passport Copy', 'Invoice'], ['Trade License copy', 'Invoice'], ['Certificate Of Origin issued by the Ministry', 'Invoice'], ['Organizational Structure/Profile Copy', 'AWB/BOL'], ['Invoice Consumption Request Letter', 'Cert. of Origin'], ['Laboratory 123234.pdf', 'Laboratory Results']];
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{TITLE}</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Stepper active={2} />
        <Card className="p-[22px] mb-[20px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Required Documents</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[24px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] content-start">{docs.map((d, i) => (<label key={d} onClick={() => setSel(i)} className="flex items-center gap-[10px] cursor-pointer"><span className="size-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: sel === i ? '#1360d2' : '#a7abb2' }}>{sel === i && <span className="size-[8px] rounded-full bg-[#1360d2]" />}</span><span className="text-[15px] text-[#0e1b3d]">{d}</span></label>))}</div>
            <div className="rounded-[8px] p-[18px]" style={{ border: '1px solid #eef1f6' }}>
              <div className="flex items-center justify-between mb-[8px]"><p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Upload Text File</p><span className="flex items-center gap-[6px] text-[#1360d2] text-[13px]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" /></svg>Download Template</span></div>
              <p className="text-[12px] text-[#8f94ae] mb-[12px]">*Supported file type of .TXT max file size up to 50MB</p>
              <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); }} className="flex items-center justify-center gap-[14px] rounded-[6px] py-[24px]" style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#f8fafd' }}>
                <div className="size-[42px] rounded-full bg-[#e9eef7] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[20px] text-[#8a93a6]" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /></svg></div>
                <span className="text-[14px] text-[#6d707e]">Drag and drop or</span>
                <button className="h-[40px] px-[18px] rounded-[6px] border text-[14px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Upload File</button>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-[22px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 700 }}>Documents Uploaded</p>
          <div className="overflow-x-auto rounded-[8px] border border-[#eef1f6]"><table className="w-full border-collapse" style={{ minWidth: 800 }}><thead><tr style={{ background: '#eaf1fb' }}>{['Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'].map(c => <th key={c} className="text-left text-[13px] text-[#455174] px-[14px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}</tr></thead>
            <tbody>{uploaded.map((u, i) => <tr key={i} className="border-t border-[#eef1f6]"><td className="text-[14px] text-[#0e1b3d] px-[14px] py-[12px]">{u[0]}</td><td className="text-[14px] text-[#5a6282] px-[14px] py-[12px]">{u[1]}</td><td className="text-[14px] text-[#5a6282] px-[14px] py-[12px]">50 MB</td><td className="text-[14px] text-[#5a6282] px-[14px] py-[12px]">08-12-2024</td><td className="px-[14px] py-[12px]"><div className="flex gap-[10px]"><svg viewBox="0 0 24 24" className="size-[16px] text-[#dc3545]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg><svg viewBox="0 0 24 24" className="size-[16px] text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" /></svg></div></td></tr>)}</tbody></table></div>
        </Card>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out><Fill onClick={onSubmit}>Pay &amp; Submit</Fill></div>
    </>
  );
}

function SuccessStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <JourneyProgress active={1} percent={45} title="Import Permit Request Completed" subtitle="Click on 'Continue' to move to the next step for Import Process" button={<Fill onClick={onProceed}>Proceed To Customs Declaration</Fill>} />
      <Card className="flex-1"><div className="flex-1 flex flex-col items-center justify-center gap-[16px] py-[48px] rounded-[8px]" style={{ background: '#fff' }}>
        <div className="size-[80px] rounded-full flex items-center justify-center" style={{ background: '#b7e6c8' }}><div className="size-[52px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[28px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div></div>
        <p className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>NOC Submitted Successfully</p>
        <div className="text-center text-[14px] text-[#5a6282] max-w-[560px]"><p>Dear Customer, thank you for using the Dubai Trade Permit application.</p><p>Your request has been submitted to Dubai Police.</p><p>Please note your reference number and proceed with the payment to complete the request.</p></div>
        <div className="flex items-center gap-[8px]"><span className="text-[14px] text-[#5a6282]">Permit Status:</span><span className="px-[12px] py-[3px] rounded-full text-[13px]" style={{ background: '#fff3d6', color: '#b7791f', fontWeight: 500 }}>Submitted</span></div>
        <span className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[9px] text-[14px] text-[#5a6282]">Reference number: <span className="text-[#1360d2] font-medium">12345678</span></span>
      </div></Card>
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out><Fill onClick={onProceed}>Proceed To Customs Declaration</Fill></div>
    </div>
  );
}
