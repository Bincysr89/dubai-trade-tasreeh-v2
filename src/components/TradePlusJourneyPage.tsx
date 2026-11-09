import { useState } from 'react';
import MoreIcon from './MoreIcon';
import Header from './Header';
import JourneyProgress from './JourneyBanner';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';
import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
import integratedClearanceSrc from '../assets/integratedclearance.svg';
import paymentsSrc from '../assets/payments.svg';
import cargoWavesSrc from '../assets/cargowaves.svg';
import waveSrc from '../assets/wave.svg';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = { onClose: () => void; onContinueToClearance: () => void };
type Step = 'list' | 'request' | 'form' | 'success';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);

function Field({ label, value = '', required, type = 'text', onChange, readOnly, placeholder }: {
  label: string; value?: string; required?: boolean; type?: 'text' | 'select' | 'search'; onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const editable = !readOnly && !!onChange;
  const floated = focused || !!value;
  return (
    <div className="relative rounded-[4px] border min-w-0" style={{ height: 54, borderColor: focused ? '#1360d2' : '#d5ddfb', background: readOnly ? '#f4f6fa' : '#fff' }}>
      {label && (
        <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{
          left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? (readOnly ? '#f4f6fa' : '#fff') : 'transparent', padding: floated ? '0 4px' : 0,
          fontSize: floated ? 12 : 15, color: focused ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, transitionDuration: '120ms', zIndex: 1,
        }}>{required && <span style={{ color: '#ea2428' }}>* </span>}{label}</span>
      )}
      <div className="flex items-center h-full px-[14px] gap-[6px]">
        {editable ? (
          <input value={value} onChange={(e) => onChange!(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={!label ? placeholder : ''}
            className="text-[15px] text-[#0e1b3d] w-full focus:outline-none bg-transparent placeholder:text-[#a7abbd]" style={{ fontFamily: font }} />
        ) : (
          <span className="text-[15px] truncate flex-1" style={{ color: value ? '#0e1b3d' : '#a7abbd', fontFamily: font }}>{value || placeholder}</span>
        )}
        {type === 'select' && <svg viewBox="0 0 24 24" className="size-[18px] flex-shrink-0 text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>}
        {type === 'search' && <svg viewBox="0 0 18 18" width="18" height="18" className="flex-shrink-0" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>}
      </div>
    </div>
  );
}

/* Journey stepper with Trade+ active */
function JourneyStepper({ onClose }: { onClose: () => void }) {
  const dim = { filter: 'opacity(0.55)' };
  const other = (src: string, label: string) => (
    <div className="flex items-center gap-[8px] flex-shrink-0">
      <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white"><img src={src} alt="" className="size-[18px] object-contain" style={dim} /></div>
      <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: font }}>{label}</span>
    </div>
  );
  return (
    <div className="px-4 md:px-10 pt-[16px] pb-[20px] flex justify-center">
      <div className="bg-white rounded-[8px] pl-[16px] pr-[10px] py-[10px] flex items-center gap-[6px] w-full max-w-[1240px]" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center w-max mx-auto">
            <div className="flex items-center gap-[10px] flex-shrink-0"><img src={importBySeaSrc} alt="" className="h-[30px] w-auto" /><span className="text-[16px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>Import by Sea</span></div>
            <div className="flex items-center flex-shrink-0 mx-[10px]"><svg viewBox="0 0 14 46" width="14" height="46" fill="none"><path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg></div>
            {/* Trade+ active */}
            <div className="flex items-center gap-[8px] flex-shrink-0 px-[10px] py-[5px] rounded-[22px]" style={{ border: '2px solid #28a745', boxShadow: '0 0 18px 0 rgba(40,167,69,0.25)', background: '#fff' }}>
              <div className="size-[36px] rounded-full border-2 border-[#28a745] flex items-center justify-center flex-shrink-0 bg-white"><img src={tradePlusSrc} alt="" className="size-[20px] object-contain" /></div>
              <span className="text-[18px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>Trade +</span>
            </div>
            <div className="mx-[10px] flex items-center" style={{ width: 100 }}><img src={waveSrc} alt="" style={{ width: 100, height: 16 }} /></div>
            {other(integratedClearanceSrc, 'Integrated Clearance')}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />
            {other(paymentsSrc, 'Payments')}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />
            {other(cargoWavesSrc, 'Cargo Waves')}
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 ml-[6px] size-[28px] rounded-full border border-[#d5ddfb] flex items-center justify-center text-[#8f94ae] hover:text-[#0e1b3d]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
      </div>
    </div>
  );
}

const BADGE: Record<string, { bg: string; color: string }> = {
  Successful: { bg: '#dcf5e4', color: '#1e874b' }, Rejected: { bg: '#fde2e2', color: '#dc3545' }, Draft: { bg: '#fff3d6', color: '#b7791f' },
};

export default function TradePlusJourneyPage({ onClose, onContinueToClearance }: Props) {
  const [step, setStep] = useState<Step>('list');
  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 70 }}>
      <div className="flex-shrink-0"><Header onHome={onClose} /></div>
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[4px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#8f94ae] text-[15px]">Import By Sea</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#111838] text-[15px] font-medium">Trade +</span>
        </div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>A180-IMPORTER SONY GULF UAE</div>
      </div>

      {step === 'list' && <ListStep onClose={onClose} onRequest={() => setStep('request')} />}
      {step === 'request' && <RequestStep onClose={onClose} onStart={() => setStep('form')} />}
      {step === 'form' && <FormStep onBack={() => setStep('request')} onSubmit={() => setStep('success')} />}
      {step === 'success' && <SuccessStep onBackToListing={() => setStep('list')} onContinue={onContinueToClearance} />}
    </div>
  );
}

/* Step 1 — DDO tracking list */
function ListStep({ onClose, onRequest }: { onClose: () => void; onRequest: () => void }) {
  const [tab, setTab] = useState<'track' | 'pay'>('track');
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const cols = ['DO Reference No.', 'BOL No.', 'Request Party Name', 'Requested Date', 'Completed Date', 'Pending With', 'DO/NOC Number', 'Status', 'Status Remark'];
  const rows = [
    ['823177', '337788', 'A539-APL CO.P TE. LTD', '06/07/2024 11:34', '06/07/2024 11:34', 'A539-APL CO.P TE. LTD', '9809876', 'Successful', 'Active'],
    ['823177', 'B123456', 'A539-APL CO.P TE. LTD', '06/07/2024 11:34', '06/07/2024 11:34', '-', '-', 'Rejected', 'Cancelled'],
    ['823177', 'C123456', 'A539-APL CO.P TE. LTD', '06/07/2024 11:34', '06/07/2024 11:34', '-', '-', 'Rejected', 'Cancelled'],
    ['823177', '-', 'A5205-ARABUILD LLC', '02/07/2024 10:15', '02/07/2024 10:15', '-', '-', 'Draft', '-'],
    ['823177', 'E123456', 'A5205-ARABUILD LLC', '02/07/2024 10:15', '02/07/2024 10:15', '-', '9809876', 'Successful', 'Active'],
    ['823177', 'F123456', 'A5205-ARABUILD LLC', '02/07/2024 10:15', '02/07/2024 10:15', '-', '9809876', 'Successful', 'Active'],
    ['823177', 'G123456', 'A5205-ARABUILD LLC', '02/07/2024 10:15', '02/07/2024 10:15', '-', '-', 'Rejected', 'Cancelled'],
    ['823177', 'H123456', 'A5205-ARABUILD LLC', '02/07/2024 10:15', '02/07/2024 10:15', '-', '9809876', 'Successful', 'Active'],
  ];
  return (
    <>
      <JourneyStepper onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-[12px] flex-wrap mb-[12px]">
          <div className="flex items-center gap-[12px] flex-wrap">
            <button className="flex items-center gap-[8px] h-[46px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#0e1b3d]">Advanced Filters<svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg></button>
            <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[46px] min-w-[280px]">
              <button className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full text-[15px] text-[#1360d2] font-medium">BOL No.<svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg></button>
              <input placeholder="Search" className="flex-1 px-[12px] text-[15px] focus:outline-none bg-transparent" />
              <svg viewBox="0 0 18 18" width="20" height="20" className="mr-[12px]" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
            </div>
            <button className="flex items-center gap-[6px] h-[46px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#5a6282]">Status<svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg></button>
          </div>
          <div className="flex items-center gap-[12px]">
            <span className="flex items-center gap-[4px] text-[#1360d2] text-[15px]">Need Help</span>
            <button onClick={onRequest} className="h-[46px] px-[24px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Request DDO</button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-[8px] mb-[14px]">
          {(['track', 'pay'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="text-[15px] px-[18px] py-[9px] rounded-[4px]" style={tab === t ? { background: '#1360d2', color: '#fff', fontWeight: 500 } : { background: '#fff', color: '#5a6282', border: '1px solid #e6eaf2' }}>{t === 'track' ? 'Track DDO' : 'Initiate Payment'}</button>
          ))}
        </div>
        {/* Table */}
        <Card>
          <div className="pb-[4px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={100} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 1100 }}>
              <thead><tr style={{ background: '#c9def7' }}>
                <th className="px-[14px] py-[14px]"><span className="size-[16px] rounded-[3px] border border-[#8f9bbf] inline-block" /></th>
                {cols.map((c) => (<th key={c} className="text-left text-[13px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>))}
                <th className="text-left text-[13px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap" style={{ fontWeight: 600, background: '#c9def7', position: 'sticky', right: 0, minWidth: 100, width: 100, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>Actions</th>
              </tr></thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr key={ri} className="border-t border-[#eef1f6]">
                    <td className="px-[14px] py-[14px]"><span className="size-[16px] rounded-[3px] border border-[#c3cbe0] inline-block" /></td>
                    {r.map((cell, ci) => (
                      <td key={ci} className="text-[13px] px-[14px] py-[14px] whitespace-nowrap">
                        {ci === 0 ? <span className="text-[#1360d2] underline cursor-pointer">{cell}</span>
                          : ci === 7 && BADGE[cell] ? <span className="inline-block px-[12px] py-[3px] rounded-full text-[12px]" style={{ ...BADGE[cell], fontWeight: 500 }}>{cell}</span>
                          : <span className="text-[#0e1b3d]">{cell}</span>}
                      </td>
                    ))}
                    <td className="px-[14px] py-[14px]" style={{ background: '#fff', position: 'sticky', right: 0, minWidth: 100, width: 100, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}><div className="flex items-center gap-[8px]"><button className="size-[26px] flex items-center justify-center"><MoreIcon /></button><button className="size-[26px] rounded-full border border-[#d5ddfb] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[14px] text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <div className="flex items-center justify-end gap-[10px] px-[16px] py-[14px] flex-wrap">
            <span className="text-[14px] text-[#5a6282]">Result</span>
            <span className="h-[32px] px-[14px] border border-[#d5ddfb] rounded-[4px] flex items-center text-[14px]">1 - 8</span>
            <span className="h-[32px] px-[10px] border border-[#d5ddfb] rounded-[4px] flex items-center gap-[6px] text-[14px]">8 <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></span>
            {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (<button key={i} className="size-[30px] rounded-full flex items-center justify-center text-[14px]" style={p === '4' ? { background: '#1360d2', color: '#fff' } : { color: '#5a6282' }}>{p}</button>))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* Step 2 — Create DDO intro */
function RequestStep({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const [bol, setBol] = useState(''); const [noc, setNoc] = useState('');
  const HELP = ['Provide details about vessel and Rotation', 'Provide details about terminal visits', 'Provide details about your cargo (General Cargo)', 'The Booking gets approved automatically and rotational number will be generated'];
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0"><h1 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Create Digital Delivery Order</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="p-[24px] mb-[24px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Enter Rotation Information to Get Started</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] items-center">
            <Field label="Shipping Agent" value="822023-MAERSK ALABAMA" required type="select" />
            <Field label="BOL Number" required value={bol} onChange={setBol} placeholder="Enter Details" />
            <Field label="NOC Number" required value={noc} onChange={setNoc} placeholder="Enter Details" />
            <button onClick={onStart} className="h-[52px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Start Journey</button>
          </div>
        </Card>
        <h2 className="text-[20px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>Help Section</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <div>
            {HELP.map((h, i) => (
              <div key={i} className="flex items-start gap-[14px] pb-[22px] relative">
                {i < HELP.length - 1 && <div className="absolute left-[13px] top-[28px] bottom-0 w-[2px] bg-[#28a745]" />}
                <div className="size-[26px] rounded-full bg-[#28a745] text-white text-[13px] flex items-center justify-center flex-shrink-0 z-[1]" style={{ fontWeight: 600 }}>{i < HELP.length - 1 ? i + 1 : '✓'}</div>
                <p className="text-[15px] text-[#0e1b3d] pt-[2px]">{h}{i === HELP.length - 1 && <span className="block text-[13px] text-[#8f94ae]">(If Requested 8hrs prior to arrival)</span>}</p>
              </div>
            ))}
            <Card className="p-[18px] mt-[6px]">
              <p className="text-[15px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 600 }}>To Complete this service you will need</p>
              <p className="text-[14px] text-[#5a6282]">1. To have registered your vessel. <span className="text-[#1360d2] block">How to register a Vessel</span></p>
              <p className="text-[14px] text-[#5a6282] mt-[6px]">2. For containerized vessels you will need to have completed a shipping service schedule.</p>
            </Card>
          </div>
          <Card className="p-[18px]">
            <div className="flex items-center gap-[6px] mb-[14px]">
              {['Updates', 'Tutorials', 'Help/Support'].map((t, i) => (<span key={t} className="text-[14px] px-[14px] py-[7px] rounded-[4px]" style={i === 0 ? { background: '#1360d2', color: '#fff', fontWeight: 500 } : { color: '#5a6282' }}>{t}</span>))}
            </div>
            <p className="text-[13px] text-[#8f94ae] mb-[10px]">Last updated on 12th march 2024 at 13:45:00</p>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-[10px] border border-[#eef1f6] rounded-[6px] p-[12px] mb-[10px]">
                <div className="size-[34px] rounded bg-[#eef2fb] flex-shrink-0" />
                <div className="flex-1"><p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>A new version has been released.</p><p className="text-[13px] text-[#1360d2]">See what's new</p></div>
                <span className="text-[12px] text-[#8f94ae]">Jan 20, 2023</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onClose} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back To Listing</button>
      </div>
    </>
  );
}

/* Step 3 — Create DDO form */
function FormStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const bol = [['B/L Number', 'MASA3228009'], ['B/L Type', 'EBL'], ['Vessel Name', 'Vessel Name'], ['Consignee Name', 'Consignee Name'], ['Vessel ETA', '24/07/2023'], ['Vessel ATA', '24/07/2023'], ['Voyage Number', '00000000'], ['Container Count', '00'], ['Importer Code', '000000'], ['Shipping Agent Code', 'A180'], ['Shipping Agent Name', 'MAERSK KANOO'], ['Rotation Number', '823228']];
  const parties = ['Requesting Party Details', 'B/L Party Details', 'Requesting Party Details'];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Create Digital Delivery Order <span className="text-[15px] text-[#1360d2] font-normal">Need Help ⓘ</span></h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="p-[24px] mb-[20px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Enter Rotation Information to Get Started</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px] items-center">
            <Field label="Shipping Agent" value="822023-MAERSK ALABAMA" required type="select" />
            <Field label="BOL Number" value="MASA3228009" required onChange={() => {}} />
            <Field label="NOC Number" required onChange={() => {}} placeholder="Enter Details" />
            <button className="h-[52px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Search</button>
          </div>
        </Card>

        <h2 className="text-[18px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>BOL Details</h2>
        <Card className="p-[22px] mb-[20px]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-[18px] gap-x-[16px]">
            {bol.map(([k, v]) => (<div key={k + v}><p className="text-[12px] text-[#8f94ae] mb-[2px]">{k}</p><p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</p></div>))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
          {parties.map((p, i) => (
            <Card key={i} className="p-[18px]">
              <p className="text-[15px] text-[#0e1b3d] mb-[14px] pb-[10px] border-b border-[#eef1f6]" style={{ fontWeight: 600 }}>{p} <span className="text-[#ea2428]">*</span></p>
              <div className="grid grid-cols-2 gap-[12px]">
                <div><p className="text-[13px] text-[#5a6282] mb-[4px]">Requesting</p><Field label="" value="F7100-SONY GULF FZE" onChange={() => {}} /></div>
                <div><p className="text-[13px] text-[#5a6282] mb-[4px]">Representative Person</p><Field label="" value="EBL" onChange={() => {}} /></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-[16px]">
          <button onClick={onBack} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back</button>
          <label className="flex items-center gap-[8px] text-[14px] text-[#0e1b3d] cursor-pointer"><span className="size-[18px] rounded-[4px] border border-[#c3cbe0]" />Accept <span className="text-[#1360d2] underline">Terms & Conditions</span></label>
        </div>
        <div className="flex items-center gap-[12px]">
          <button data-secondary-btn className="h-[46px] px-[24px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Exit</button>
          <button onClick={onSubmit} className="h-[46px] px-[36px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Submit</button>
        </div>
      </div>
    </>
  );
}

/* Step 4 — DDO success */
function SuccessStep({ onBackToListing, onContinue }: { onBackToListing: () => void; onContinue: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <JourneyProgress active={0} percent={25} title="Digital Delivery Order Created - Trade+ Process Completed" subtitle="Click on 'Continue' to move to the next step for Import Process" button={<button onClick={onContinue} className="h-[42px] px-[22px] rounded-[4px] text-[14px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Continue To Integrated Clearance</button>} />

      <Card className="flex-1 flex flex-col items-center justify-center gap-[20px] py-[48px]">
        <div className="size-[80px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[40px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div>
        <p className="text-[18px] text-[#28a745]" style={{ fontWeight: 600 }}>Digital Delivery Order successfully created successfully !</p>
        <div className="bg-white border border-[#eef1f6] rounded-[8px] px-[40px] py-[18px] text-center" style={{ boxShadow: '0px 2px 12px rgba(143,155,186,0.12)' }}>
          <p className="text-[13px] text-[#8f94ae] mb-[4px]">Reference Number</p>
          <p className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>AEJEA - 2402- B23017</p>
        </div>
        <div className="flex items-center gap-[14px]">
          <button data-secondary-btn className="h-[44px] px-[24px] rounded-[4px] border text-[15px] flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Download <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <button data-secondary-btn className="h-[44px] px-[24px] rounded-[4px] border text-[15px] flex items-center gap-[8px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Share <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg></button>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onBackToListing} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back To Listing</button>
        <button onClick={onContinue} className="h-[46px] px-[28px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Continue To Integrated Clearance</button>
      </div>
    </div>
  );
}
