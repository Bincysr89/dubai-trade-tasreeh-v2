import { useState } from 'react';
import MoreIcon from './MoreIcon';
import Header from './Header';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';
import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
import integratedClearanceSrc from '../assets/integratedclearance.svg';
import emiratesLogoSrc from '../assets/emirates-skycargo-logo.png';
import dnataLogoSrc from '../assets/dnata-logo.png';

const font = "'Dubai', 'Segoe UI', sans-serif";
type Props = { onClose: () => void; onBackToHome: () => void; onContinueToClearance?: () => void };
type Step = 'list' | 'details' | 'create' | 'directBooking' | 'awbSuccess' | 'declaration' | 'permitSuccess' | 'customsSuccess';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);
const Out = ({ children, onClick }: any) => <button onClick={onClick} data-secondary-btn className="h-[46px] px-[26px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>{children}</button>;
const Fill = ({ children, onClick }: any) => <button onClick={onClick} className="h-[46px] px-[28px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>{children}</button>;

function Field({ label, value = '', type = 'text', onChange, unit }: { label: string; value?: string; type?: 'text' | 'select' | 'search'; onChange?: (v: string) => void; unit?: string }) {
  const [f, setF] = useState(false); const floated = f || !!value;
  return (
    <div className="relative rounded-[4px] border min-w-0" style={{ height: 52, borderColor: f ? '#1360d2' : '#d5ddfb', background: '#fff' }}>
      {label && <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{ left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)', background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0, fontSize: floated ? 12 : 15, color: f ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>{label}</span>}
      <div className="flex items-center h-full px-[14px] gap-[6px]">
        <input value={value} onChange={e => onChange?.(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} className="text-[15px] text-[#0e1b3d] w-full focus:outline-none bg-transparent" style={{ fontFamily: font }} />
        {unit && <span className="text-[13px] text-[#5a6282] border-l border-[#e6eaf2] pl-[8px]">{unit} ▾</span>}
        {type === 'select' && <svg viewBox="0 0 24 24" className="size-[18px] text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>}
        {type === 'search' && <svg viewBox="0 0 18 18" width="18" height="18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>}
      </div>
    </div>
  );
}

/* Export-by-Air 3-step stepper: Export by Air ) Booking and Execution — Integrated Clearance */
function ExportStepper({ active }: { active: number }) {
  const steps = [{ src: tradePlusSrc, label: 'Booking and Execution' }, { src: integratedClearanceSrc, label: 'Integrated Clearance' }];
  return (
    <div className="bg-white rounded-[8px] px-[16px] py-[10px] flex items-center w-full mb-[16px]" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
      <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar"><div className="flex items-center w-max mx-auto">
        <div className="flex items-center gap-[10px] flex-shrink-0"><img src={importBySeaSrc} alt="" className="h-[26px] w-auto" style={{ filter: 'hue-rotate(15deg)' }} /><span className="text-[15px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>Export by Air</span></div>
        <div className="flex items-center flex-shrink-0 mx-[10px]"><svg viewBox="0 0 14 46" width="13" height="42" fill="none"><path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg></div>
        {steps.map((s, i) => { const done = i < active; const act = i === active; return (
          <div key={s.label} className="flex items-center flex-shrink-0">
            {act ? (
              <div className="flex items-center gap-[8px] px-[10px] py-[4px] rounded-[22px]" style={{ border: '2px solid #28a745', boxShadow: '0 0 16px 0 rgba(40,167,69,0.22)', background: '#fff' }}><div className="size-[30px] rounded-full border-2 border-[#28a745] flex items-center justify-center bg-white"><img src={s.src} alt="" className="size-[16px] object-contain" /></div><span className="text-[15px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{s.label}</span></div>
            ) : (
              <div className="flex items-center gap-[8px]"><div className="size-[28px] rounded-full border-[1.5px] flex items-center justify-center bg-white relative" style={{ borderColor: done ? '#28a745' : '#c5cef7' }}><img src={s.src} alt="" className="size-[15px] object-contain" style={{ filter: done ? 'none' : 'opacity(0.5)' }} />{done && <span className="absolute -bottom-[3px] -right-[3px] size-[13px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 16 16" className="size-[8px]" fill="none" stroke="#fff" strokeWidth="2.6"><path d="M3 8l3.5 3.5L13 5" /></svg></span>}</div><span className="text-[13px] whitespace-nowrap" style={{ fontFamily: font, color: done ? '#28a745' : '#5a6282', fontWeight: done ? 500 : 400 }}>{s.label}</span></div>
            )}
            {i < steps.length - 1 && (i < active ? <div className="mx-[10px] h-[2px] rounded-full" style={{ background: '#28a745', width: 110 }} /> : <div className="mx-[10px] flex items-center" style={{ width: 110 }}><div className="h-[1.5px] w-full" style={{ borderTop: '1.5px dashed #9fd6b0' }} /></div>)}
          </div>
        ); })}
      </div></div>
    </div>
  );
}

function Ring({ percent }: { percent: number }) {
  const r = 22, C = 2 * Math.PI * r, off = C * (1 - percent / 100);
  return (
    <div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}>
      <svg viewBox="0 0 56 56" width="56" height="56"><circle cx="28" cy="28" r={r} fill="none" stroke="#e6eaf2" strokeWidth="5" /><circle cx="28" cy="28" r={r} fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 28 28)" /></svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] text-[#28a745]" style={{ fontWeight: 600 }}>{percent}%</span>
    </div>
  );
}

function ExportProgress({ active, percent, title, subtitle, button }: { active: number; percent: number; title: string; subtitle: string; button: React.ReactNode }) {
  return (<div><ExportStepper active={active} /><div className="bg-white rounded-[8px] px-[24px] py-[16px] flex items-center justify-between gap-[16px] flex-wrap mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}><div className="flex items-center gap-[16px]"><Ring percent={percent} /><div><p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{title}</p><p className="text-[13px] text-[#8f94ae]">{subtitle}</p></div></div>{button}</div></div>);
}

function SuccessCard({ heading, lines, refNo, rows }: { heading: string; lines: string[]; refNo?: string; rows?: [string, string][] }) {
  return (<Card className="flex-1"><div className="flex flex-col items-center justify-center gap-[16px] py-[44px] px-[24px]">
    <div className="size-[78px] rounded-full flex items-center justify-center" style={{ background: '#b7e6c8' }}><div className="size-[52px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[28px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div></div>
    <p className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{heading}</p>
    <div className="text-center text-[14px] text-[#5a6282] max-w-[600px]">{lines.map((l, i) => <p key={i}>{l}</p>)}</div>
    {refNo && <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{refNo}</p>}
    {rows && <div className="grid grid-cols-1 gap-[8px]" style={{ minWidth: 300 }}>{rows.map(([k, v]) => <div key={k} className="grid grid-cols-2 gap-[16px]"><span className="text-[14px] text-[#8f94ae]">{k}</span><span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{v}</span></div>)}</div>}
  </div></Card>);
}

export default function BookingExecutionPage({ onClose, onBackToHome, onContinueToClearance }: Props) {
  const [step, setStep] = useState<Step>('list');
  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 75 }}>
      <div className="flex-shrink-0"><Header onHome={onBackToHome} /></div>
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[6px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]"><span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onBackToHome}>Home</span><span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#8f94ae] text-[15px]">Export By Air</span><span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#111838] text-[15px] font-medium">Booking &amp; Execution</span></div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>6452690015 - AIR - Freight Forwarder - DSV Air &amp; Sea LLC</div>
      </div>

      {step === 'list' && <ListStep onStart={() => setStep('details')} />}
      {step === 'details' && <DetailsStep onBack={onClose} onProceed={() => setStep('create')} />}
      {step === 'create' && <CreateStep onBack={() => setStep('details')} onDirectBooking={() => setStep('directBooking')} />}
      {step === 'directBooking' && <DirectBookingStep onBack={() => setStep('create')} onSubmit={() => setStep('awbSuccess')} />}
      {step === 'awbSuccess' && <AwbSuccess onBack={onClose} onContinue={() => { if (onContinueToClearance) onContinueToClearance(); else setStep('declaration'); }} />}
      {step === 'declaration' && <DeclarationStep onBack={() => setStep('awbSuccess')} onProceed={() => setStep('permitSuccess')} />}
      {step === 'permitSuccess' && <PermitSuccess onBack={onClose} onProceed={() => setStep('customsSuccess')} />}
      {step === 'customsSuccess' && <CustomsSuccess onBack={onClose} onBackToHome={onBackToHome} />}
    </div>
  );
}

function ListStep({ onStart }: { onStart: () => void }) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const cols = ['Order ID', 'JRN No.', 'AWB No.', 'No Of HAWB', 'Agent (Internal)', 'Destination', 'Flight No.', 'Flight Date', 'Charge Weight'];
  const rows = [
    ['1786543042', '-', '-', '-', 'DHL-23456677', 'MAA', 'EK-563', '12-Jul-2025', '100 KG'],
    ['2376548190', '57316187', '176-45644400', '-', 'ABT-45367380', 'FRA', 'EK-243', '14-Jul-2025', '100 KG'],
    ['7652896201', '57316187', '176-45642123', '3', 'BDTL-5673489', 'DHB', 'EK-564', '16-Jul-2025', '100 KG'],
    ['3427659032', '57316187', '-', '2', 'ABT-45367380', 'MAA', 'EK-900', '20-Jul-2025', '100 KG'],
    ['6527438901', '57316187', '-', '7', 'DHL-23456677', 'FRA', 'EK-500', '01-Jul-2025', '100 KG'],
    ['1425673840', '57316187', '176-45623467', '2', 'ABT-45367380', 'MAA', 'EK-432', '06-Jul-2025', '100 KG'],
    ['6584294201', '57316187', '176-43458901', '4', 'BDTL-5673489', 'DHB', 'EK-947', '09-Jul-2025', '100 KG'],
    ['3278546910', '57316187', '-', '5', 'DHL-23456677', 'FRA', 'EK-856', '23-Jul-2025', '100 KG'],
  ];
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
      <ExportStepper active={0} />
      <div className="flex items-center justify-between gap-[12px] flex-wrap mb-[14px]">
        <div className="flex items-center gap-[12px] flex-wrap">
          <button className="flex items-center gap-[8px] h-[44px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#0e1b3d]">Advanced Filters<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg></button>
          <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[44px] min-w-[260px]"><button className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full text-[15px] text-[#1360d2] font-medium">AWB<svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg></button><input placeholder="Search" className="flex-1 px-[12px] text-[15px] focus:outline-none bg-transparent" /><svg viewBox="0 0 18 18" width="20" height="20" className="mr-[12px]" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg></div>
          <button className="flex items-center gap-[6px] h-[44px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#5a6282]">Status<svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg></button>
        </div>
        <div className="flex items-center gap-[12px]"><span className="text-[#1360d2] text-[15px]">Need Help</span><button className="flex items-center gap-[8px] h-[44px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#0e1b3d]"><svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>Columns</button><Fill onClick={onStart}>Start Journey</Fill></div>
      </div>
      <Card>
        <div className="pb-[4px]" style={{ position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={100} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 1100 }}>
              <thead>
                <tr style={{ background: '#c9def7' }}>
                  {cols.map(c => <th key={c} className="text-left text-[13px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}
                  <th className="text-left text-[13px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap" style={{ fontWeight: 600, background: '#c9def7', position: 'sticky', right: 0, minWidth: 100, width: 100, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr key={ri} className="border-t border-[#eef1f6]">
                    {r.map((v, ci) => <td key={ci} className="text-[13px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap">{v}</td>)}
                    <td className="px-[14px] py-[14px]" style={{ background: '#fff', position: 'sticky', right: 0, minWidth: 100, width: 100, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}>
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
  );
}

function DetailsStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  const [carrier, setCarrier] = useState<'emirates' | 'dnata'>('emirates');
  const help = ['Provide details about Clearance', 'Provide details about terminal visits', 'Provide details about your cargo (General Cargo)', 'The Booking gets approved automatically and rotational number will be generated'];
  const releases = ['A new version of a Booking & Execution has been released.', 'A new version of a Berth booking has been released.', 'A new version of a Berth booking has been released.'];
  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <ExportStepper active={0} />
        <h1 className="text-[26px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Booking &amp; Execution <span className="text-[15px] text-[#1360d2] font-normal">Need Help ⓘ</span></h1>
        <Card className="p-[22px] mb-[24px]">
          <p className="text-[15px] text-[#0e1b3d] mb-[16px]">Enter the required details to begin your air cargo export process.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[18px]"><Field label="Origin" onChange={() => {}} /><Field label="Destination" onChange={() => {}} /><Field label="Flight Date" value="Wed, 26 Jul 2024" onChange={() => {}} /></div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-[16px] items-stretch">
            <button onClick={() => setCarrier('emirates')} className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[6px] text-left" style={{ border: `1.5px solid ${carrier === 'emirates' ? '#1360d2' : '#e6eaf2'}`, background: '#fff' }}><img src={emiratesLogoSrc} alt="Emirates SkyCargo" className="h-[40px] w-auto flex-shrink-0 object-contain" /><span className="text-[13px] text-[#5a6282]">If to get instant rates, capacity checks, and eBooking for freight forwarders.</span></button>
            <button onClick={() => setCarrier('dnata')} className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[6px] text-left" style={{ border: `1.5px solid ${carrier === 'dnata' ? '#1360d2' : '#e6eaf2'}`, background: '#fff' }}><img src={dnataLogoSrc} alt="dnata" className="h-[24px] w-auto flex-shrink-0 object-contain" /><span className="text-[13px] text-[#5a6282]">If to search for rates for an optimal flight options for their operational needs</span></button>
            <div className="flex items-stretch"><button onClick={onProceed} className="rounded-[4px] px-[36px] text-[15px] text-white hover:bg-[#0f4fb5] w-full" style={{ background: '#1360d2', fontWeight: 500 }}>Proceed</button></div>
          </div>
        </Card>

        <h2 className="text-[20px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Help and Guides</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <div>
            {help.map((h, i) => (
              <div key={i} className="flex items-start gap-[14px] pb-[22px] relative">
                {i < help.length - 1 && <div className="absolute left-[13px] top-[28px] bottom-0 w-[2px] bg-[#28a745]" />}
                <div className="size-[26px] rounded-full bg-[#28a745] text-white text-[13px] flex items-center justify-center flex-shrink-0 z-[1]" style={{ fontWeight: 600 }}>{i < help.length - 1 ? i + 1 : '✓'}</div>
                <p className="text-[15px] text-[#0e1b3d] pt-[2px]">{h}</p>
              </div>
            ))}
            <Card className="p-[18px] mt-[6px]">
              <p className="text-[15px] text-[#0e1b3d] mb-[6px]" style={{ fontWeight: 600 }}>About This Service</p>
              <p className="text-[14px] text-[#5a6282]">Standard air cargo export booking &amp; execution service. Register your shipment, choose a carrier, and generate your booking. <span className="text-[#1360d2]">Click Here</span></p>
            </Card>
          </div>
          <Card className="p-[18px]">
            <div className="flex items-center gap-[6px] mb-[14px]">{['Information', 'Tutorials', 'Common FAQ\'s', 'Updates', 'Downloads'].map((t, i) => (<span key={t} className="text-[14px] px-[12px] py-[7px] rounded-[4px]" style={i === 0 ? { background: '#1360d2', color: '#fff', fontWeight: 500 } : { color: '#5a6282' }}>{t}</span>))}</div>
            <p className="text-[13px] text-[#8f94ae] mb-[10px]">Last updated on 12th march 2024 at 13:45:00</p>
            {releases.map((r, i) => (
              <div key={i} className="flex items-start gap-[10px] border border-[#eef1f6] rounded-[6px] p-[12px] mb-[10px]">
                <div className="size-[34px] rounded bg-[#eef2fb] flex-shrink-0" />
                <div className="flex-1"><p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{r}</p><p className="text-[13px] text-[#1360d2]">See what's new</p></div>
                <span className="text-[12px] text-[#8f94ae]">Jan 20, 2023</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out></div>
    </>
  );
}

function CreateStep({ onBack, onDirectBooking }: { onBack: () => void; onDirectBooking: () => void }) {
  const fields = [['Origin', 'Dubai'], ['Destination', 'Saudi'], ['Flight Date', 'Wed, 26 Jul 2024'], ['Goods Description', 'Material'], ['Commodity Code', '0823'], ['Piece', '100'], ['Gr. Weight', 'Select'], ['Ch. Weight', ''], ['Volume', '20'], ['Special Handle Selection', 'ADX'], ['Product', 'AXA -Emirates Airfreight Priority'], ['No Of HAWB', '3']];
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
      <ExportStepper active={0} />
      <h1 className="text-[26px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Create Booking &amp; Execution <span className="text-[15px] text-[#1360d2] font-normal">Need Help ⓘ</span></h1>
      <Card className="p-[22px] mb-[20px]">
        <p className="text-[15px] text-[#0e1b3d] mb-[16px]">Enter the required details to begin your air cargo export process.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">{fields.map(([l, v]) => <Field key={l} label={l} value={v} onChange={() => {}} unit={l === 'Gr. Weight' || l === 'Ch. Weight' ? 'K' : l === 'Volume' ? 'CM' : undefined} />)}
          <div className="flex items-center gap-[10px]"><Field label="Accounting Information" value="OSI" onChange={() => {}} /></div>
          <div className="flex items-center gap-[10px]"><span className="text-[14px] text-[#5a6282]">Allotment Flight</span><span className="h-[36px] px-[16px] rounded-[4px] bg-[#1360d2] text-white text-[14px] flex items-center">Yes</span><span className="h-[36px] px-[16px] rounded-[4px] border border-[#d5ddfb] text-[#5a6282] text-[14px] flex items-center">No</span></div>
        </div>
      </Card>
      <Card className="p-[18px] mb-[6px]"><div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
        <button className="h-[46px] rounded-[4px] text-[15px] text-white flex items-center justify-center gap-[8px]" style={{ background: '#1360d2', fontWeight: 500 }}>Find Offers / Detailed Enquiry</button>
        <button onClick={onDirectBooking} className="h-[46px] rounded-[4px] text-[15px] text-white flex items-center justify-center gap-[8px]" style={{ background: '#1360d2', fontWeight: 500 }}>Direct Booking</button>
        <button className="h-[46px] rounded-[4px] text-[15px] text-white flex items-center justify-center gap-[8px]" style={{ background: '#1360d2', fontWeight: 500 }}>Direct MAWB Execution</button>
      </div></Card>
      <div className="mt-[10px] flex gap-[12px]"><Out onClick={onBack}>Back To Listing</Out><Out onClick={onBack}>Back</Out></div>
    </div>
  );
}

function DirectBookingStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const stepper = ['Shipment Details', 'View Flights', 'Selected Flights', 'Confirm Booking'];
  const cols = ['Airline', 'Flight No', 'Suffix', 'Flight Date', 'Boarding Point', 'Off Point', 'Pieces', 'Weight', 'Volume', 'Aircraft Type', 'Mode', 'Class'];
  const row = ['Emirates', 'EK-4000', 'V', '18-Jun-2024 Tue', 'DWC', 'DXB', '10', '1000', '02', '8777', 'T', 'W'];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Create Direct Booking</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="px-[20px] py-[14px] mb-[16px]"><div className="flex items-center overflow-x-auto no-scrollbar">{stepper.map((s, i) => <div key={s} className="flex items-center flex-shrink-0"><div className="flex items-center gap-[8px]"><span className="size-[22px] rounded-full flex items-center justify-center" style={{ background: i < 2 ? '#28a745' : '#fff', border: i < 2 ? 'none' : `2px solid ${i === 2 ? '#1360d2' : '#c3cbe0'}` }}>{i < 2 ? <svg viewBox="0 0 24 24" className="size-[12px]" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg> : <span className="text-[11px]" style={{ color: i === 2 ? '#1360d2' : '#8f94ae' }}>{'0' + (i + 1)}</span>}</span><span className="text-[13px] whitespace-nowrap" style={{ color: i < 2 ? '#28a745' : i === 2 ? '#1360d2' : '#8f94ae', fontWeight: 500 }}>{s}</span></div>{i < stepper.length - 1 && <div className="h-[1.5px] mx-[10px]" style={{ background: i < 2 ? '#28a745' : '#c5cef7', width: 90 }} />}</div>)}</div></Card>
        <Card className="p-[18px] mb-[16px] flex items-center gap-[16px] flex-wrap"><span className="size-[30px] rounded-full bg-[#e2ebf9] flex items-center justify-center text-[11px] text-[#1360d2] font-semibold">DXB</span><span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Dubai (DXB)</span><svg viewBox="0 0 60 12" width="60" height="12"><path d="M2 6h50" stroke="#1360d2" strokeWidth="1.5" strokeDasharray="3 3" /><path d="M52 2l4 4-4 4" fill="none" stroke="#1360d2" strokeWidth="1.5" /></svg><span className="size-[30px] rounded-full bg-[#f6dede] flex items-center justify-center text-[11px] text-[#dc3545] font-semibold">MAA</span><span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Saudi Arabia</span><span className="ml-auto text-[14px] text-[#5a6282]">Flight Date : <span className="text-[#0e1b3d]" style={{ fontWeight: 600 }}>Wed, 26 Jul 2024</span></span><Out>Modify</Out></Card>
        <Card className="p-[18px] mb-[16px]">
          <div className="pb-[4px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={90} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto rounded-[8px] border border-[#eef1f6]">
              <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: '#eaf1fb' }}>
                    {cols.slice(0, -1).map(c => <th key={c} className="text-left text-[13px] text-[#455174] px-[12px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}
                    <th className="text-left text-[13px] text-[#455174] px-[12px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600, background: '#eaf1fb', position: 'sticky', right: 0, minWidth: 90, width: 90, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>{cols[cols.length - 1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1].map(i => (
                    <tr key={i} className="border-t border-[#eef1f6]">
                      {row.slice(0, -1).map((v, ci) => <td key={ci} className="text-[13px] text-[#0e1b3d] px-[12px] py-[12px] whitespace-nowrap">{v}</td>)}
                      <td className="text-[13px] text-[#0e1b3d] px-[12px] py-[12px] whitespace-nowrap" style={{ background: '#fff', position: 'sticky', right: 0, minWidth: 90, width: 90, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}>{row[row.length - 1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        <Card className="p-[18px]"><p className="text-[15px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 700 }}>Charge Details :</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px]">{[['Total Charge', '3000.00 AED'], ['Freight Charges', '3037.15 AED'], ['Fuel Surcharges Due', '689.75 AED'], ['Grand Total', '10236.00 AED']].map(([k, v]) => <div key={k}><p className="text-[13px] text-[#8f94ae]">{k}</p><p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{v}</p></div>)}</div></Card>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><div className="flex gap-[12px]"><Out onClick={onBack}>Cancel</Out><Out onClick={onBack}>Back</Out></div><Fill onClick={onSubmit}>Submit</Fill></div>
    </>
  );
}

function AwbSuccess({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <ExportProgress active={0} percent={55} title="AWB Executed Successfully" subtitle="Click on 'Continue' to move to the next step" button={<Fill onClick={onContinue}>Continue To Integrated Clearance</Fill>} />
      <SuccessCard heading="AWB Executed Successfully" lines={[]} rows={[['Order ID', '1721981218937'], ['JRN No.', '57316187'], ['AWB No.', '176-45642211'], ['Status', 'Confirmed']]} />
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out><Fill onClick={onContinue}>Continue To Integrated Clearance</Fill></div>
    </div>
  );
}

/* Export-by-air declaration form (AWB Number + Flight Number) */
function DeclarationStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Integrated Clearance</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <ExportStepper active={1} />
        <Card className="p-[22px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Enter the Details to Start Clearance Process</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[16px] items-center">
            <Field label="Cargo Channel" value="Air" onChange={() => {}} type="select" />
            <Field label="Regime Type" value="Export" onChange={() => {}} type="select" />
            <Field label="AWB Number" value="AWB1234567" onChange={() => {}} />
            <Field label="Flight Number" value="EK1234" onChange={() => {}} />
            <Field label="Client Doc. Ref. Number" value="A113384" onChange={() => {}} />
            <Fill onClick={onProceed}>Proceed</Fill>
          </div>
        </Card>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back</Out></div>
    </>
  );
}

function PermitSuccess({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <ExportProgress active={1} percent={65} title="Export Permit Request Completed" subtitle="Click on 'Continue' to move to the next step for Import Process" button={<Fill onClick={onProceed}>Proceed To Customs Declaration</Fill>} />
      <SuccessCard heading="Permit Submitted Successfully" lines={['Dear Customer, thank you for using the Dubai Trade Permit application.', 'Your export permit request has been submitted to the relevant authority.']} refNo="Reference number: 12345678" />
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out><Fill onClick={onProceed}>Proceed To Customs Declaration</Fill></div>
    </div>
  );
}

function CustomsSuccess({ onBack, onBackToHome }: { onBack: () => void; onBackToHome: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <ExportProgress active={1} percent={100} title="Export by Air flow has been completed" subtitle="Declaration Created - Integrated Clearance Process Completed" button={<Fill onClick={onBackToHome}>Back To Home</Fill>} />
      <SuccessCard heading="Declaration Request Created Successfully" lines={['Dear Customer Thank You For Using Service Request Web Application.', 'Your Request For Customs Declaration Amendment Will Be Sent For Approval.', 'Please Find Below Details For Future Reference']} refNo="Request Number: 560010545" />
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><Out onClick={onBack}>Back To Listing</Out><Fill onClick={onBackToHome}>Back To Home</Fill></div>
    </div>
  );
}
