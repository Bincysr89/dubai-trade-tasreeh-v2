import { useState } from 'react';
import Header from './Header';
import JourneyProgress from './JourneyBanner';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = { onClose: () => void; onBackToHome: () => void; initialStep?: Step; exportFinal?: boolean };
type Step =
  | 'permits' | 'permitsSuccess'
  | 'declInfo' | 'declSuccess'
  | 'payments' | 'pay' | 'paySuccess'
  | 'cargoOrders' | 'cargoCreate' | 'cargoSuccess';

const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)', ...style }}>{children}</div>
);

const Info = ({ k, v }: { k: string; v: string }) => (
  <div><p className="text-[12px] text-[#8f94ae] mb-[2px]">{k}</p><p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</p></div>
);

function Check({ green }: { green?: boolean }) {
  return (
    <span className="size-[22px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: green ? '#28a745' : '#fff', border: green ? 'none' : '2px solid #1360d2' }}>
      <svg viewBox="0 0 24 24" className="size-[12px]" fill="none" stroke={green ? '#fff' : '#1360d2'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
    </span>
  );
}

/* DDO / Integrated Clearance / Payments / Cargo Waves progress banner used on success screens */
function ProgressBanner({ title, note, completed, button }: { title: string; note: string; completed: number; button: React.ReactNode }) {
  const steps = ['DDO', 'Integrated Clearance', 'Payments', 'Cargo Waves'];
  return (
    <Card className="px-[24px] py-[18px] mb-[20px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <div><p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{title}</p><p className="text-[13px] text-[#8f94ae]">{note}</p></div>
        {button}
      </div>
      <div className="flex items-center mt-[16px] overflow-x-auto no-scrollbar">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-[8px]"><Check green={i < completed} /><span className="text-[14px] whitespace-nowrap" style={{ color: i < completed ? '#28a745' : '#1360d2', fontWeight: 500 }}>{s}</span></div>
            {i < steps.length - 1 && <div className="h-[1.5px] mx-[10px]" style={{ background: '#c5cef7', width: 120 }} />}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* Success card body */
function SuccessBody({ heading, lines, rows, refNo }: { heading: string; lines: string[]; rows: [string, string][]; refNo?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[18px] py-[48px] px-[24px] rounded-[8px]" style={{ background: '#eef1f5' }}>
      <div className="size-[74px] rounded-full border-[3px] border-[#28c090] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[36px]" fill="none" stroke="#28c090" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div>
      <p className="text-[24px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{heading}</p>
      <div className="text-center text-[14px] text-[#5a6282] max-w-[640px]">{lines.map((l, i) => <p key={i}>{l}</p>)}</div>
      {refNo && <p className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{refNo}</p>}
      <div className="grid grid-cols-1 gap-[10px] mt-[4px]" style={{ minWidth: 320 }}>
        {rows.map(([k, v]) => (<div key={k} className="grid grid-cols-2 gap-[16px]"><span className="text-[14px] text-[#8f94ae]">{k}</span><span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{v}</span></div>))}
      </div>
    </div>
  );
}

const OutlineBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} data-secondary-btn className="h-[46px] px-[26px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>{children}</button>
);
const FillBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} className="h-[46px] px-[26px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>{children}</button>
);

export default function CompleteJourneyPage({ onClose, onBackToHome, initialStep, exportFinal }: Props) {
  const [step, setStep] = useState<Step>(initialStep ?? 'permits');
  const breadcrumbLast =
    step.startsWith('cargo') ? 'Cargo Waves' : step.startsWith('pay') || step === 'payments' ? 'Payments' : step.startsWith('decl') ? 'Clearance' : 'Integrated Clearance';

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 90 }}>
      <div className="flex-shrink-0"><Header onHome={onBackToHome} /></div>
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[4px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onBackToHome}>Home</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#8f94ae] text-[15px]">Import By Sea</span>
          <span className="text-[#dc3545] text-[14px]">/</span><span className="text-[#111838] text-[15px] font-medium">{breadcrumbLast}</span>
        </div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>A180-IMPORTER SONY GULF UAE</div>
      </div>

      {step === 'permits' && <PermitsStep onBack={onClose} onProceed={() => setStep('permitsSuccess')} />}
      {step === 'permitsSuccess' && <PermitsSuccess onBack={onClose} onSubmitDeclaration={() => setStep('declInfo')} />}
      {step === 'declInfo' && <DeclInfoStep onBack={onClose} onSubmit={() => setStep('declSuccess')} />}
      {step === 'declSuccess' && <DeclSuccess onBack={onClose} onContinuePayments={() => setStep('payments')} exportFinal={exportFinal} onBackToHome={onBackToHome} />}
      {step === 'payments' && <PaymentsStep onBack={onClose} onProceed={() => setStep('pay')} />}
      {step === 'pay' && <PayStep onCancel={() => setStep('payments')} onPay={() => setStep('paySuccess')} />}
      {step === 'paySuccess' && <PaySuccess onBack={onClose} onCargoWaves={() => setStep('cargoOrders')} />}
      {step === 'cargoOrders' && <CargoOrdersStep onNext={() => setStep('cargoCreate')} />}
      {step === 'cargoCreate' && <CargoCreateStep onBack={() => setStep('cargoOrders')} onPay={() => setStep('cargoSuccess')} />}
      {step === 'cargoSuccess' && <CargoSuccess onBackToHome={onBackToHome} />}
    </div>
  );
}

/* ── Phase 2: Permits (Montaji+) ── */
function PermitsStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  const stepper = ['Request Details', 'Cargo Details', 'Attachments', 'Review Details', 'Permit Created'];
  const products = ['Apple', 'Apple', 'Milk', 'Milk', 'Cold Drinks', 'Cottage Cheese', 'Cottage Cheese', 'Cottage Cheese'];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Montaji+</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px] flex flex-col gap-[18px]">
        <Card className="px-[20px] py-[14px]"><div className="flex items-center overflow-x-auto no-scrollbar">
          {stepper.map((s, i) => (<div key={s} className="flex items-center flex-shrink-0"><div className="flex items-center gap-[8px]"><Check green={i < 3} /><span className="text-[13px] whitespace-nowrap" style={{ color: i < 3 ? '#28a745' : i === 3 ? '#1360d2' : '#8f94ae', fontWeight: 500 }}>{s}</span></div>{i < stepper.length - 1 && <div className="h-[1.5px] mx-[10px]" style={{ background: '#dbe3f4', width: 90 }} />}</div>))}
        </div></Card>

        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Agent Details</p>
          <Card className="p-[18px] grid grid-cols-2 sm:grid-cols-5 gap-[16px]">{[['Importer Code', 'AB321'], ['OM Username', 'User 123'], ['Company Name', 'UATReport.'], ['Trade License Number', '636336321'], ['TL Issuing Authority', '--']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>

        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Request Details</p>
          <Card className="p-[18px] grid grid-cols-2 sm:grid-cols-4 gap-[16px]">{[['Cargo Channel', 'Sea'], ['Regime Type', 'Import'], ['Declaration Type', '103-Import to Local'], ['Shipment Status', 'Pre-Booked']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>

        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Trip Details</p>
          <Card className="p-[18px] grid grid-cols-2 sm:grid-cols-5 gap-[16px]">{[['Country of Origin', 'India'], ['Port of Entry Code - Gate Number', 'Jabel Ali'], ['DO Issue Date & Time', 'UATReport.'], ['Rotation Number', '823228'], ['BOL Number', '337788']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>

        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Cargo Details</p>
          <Card className="p-[18px]">
            <p className="text-[14px] text-[#5a6282] mb-[10px]" style={{ fontWeight: 600 }}>Vehicle Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] mb-[18px]">{[0, 1, 2, 3, 4].map((i) => (<div key={i} className="border border-[#e6eaf2] rounded-[6px] px-[12px] py-[10px] flex items-center justify-between"><div><p className="text-[11px] text-[#8f94ae]">Vehicle Number</p><p className="text-[13px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>MKU21224354S</p></div><svg viewBox="0 0 24 24" className="size-[15px] text-[#dc3545]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" /></svg></div>))}</div>
            <p className="text-[14px] text-[#5a6282] mb-[10px]" style={{ fontWeight: 600 }}>Product Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">{products.map((p, i) => (<div key={i} className="border border-[#e6eaf2] rounded-[6px] p-[12px]"><div className="flex items-center gap-[8px] mb-[4px]"><span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{p}</span><span className="text-[11px] px-[8px] py-[1px] rounded-full" style={{ background: '#e2ebf9', color: '#1360d2' }}>Registration in Progress</span></div><p className="text-[12px] text-[#5a6282]">Consumer QA</p><p className="text-[12px] text-[#5a6282]">MH  Marshall Islands · 1234566789988</p></div>))}</div>
          </Card></div>

        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Pre-approvals fo Food Products</p>
          <Card className="p-[18px] grid grid-cols-1 sm:grid-cols-3 gap-[12px]">{['DIP Pre- Approval', 'Sampling Pre- Approval', 'Contraventional Pre-Approval', 'Registration Pre-Approval', 'Undertaking to submit original document'].map((c, i) => (<label key={c} className="flex items-center gap-[8px] text-[14px] text-[#0e1b3d]"><span className="size-[18px] rounded-[4px] flex items-center justify-center" style={i === 0 ? { background: '#1360d2' } : { border: '1px solid #c3cbe0' }}>{i === 0 && <svg viewBox="0 0 16 16" className="size-[11px]" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 8l3.5 3.5L13 5" /></svg>}</span>{c}</label>))}</Card></div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <OutlineBtn onClick={onBack}>Back</OutlineBtn><FillBtn onClick={onProceed}>Proceed</FillBtn>
      </div>
    </>
  );
}

function PermitsSuccess({ onBack, onSubmitDeclaration }: { onBack: () => void; onSubmitDeclaration: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <JourneyProgress active={1} percent={45} title="Import Permit Request Completed" subtitle="Click on 'Continue' to move to the next step for Import Process" button={<FillBtn onClick={onSubmitDeclaration}>Proceed To Customs Declaration</FillBtn>} />
      <Card className="flex-1"><SuccessBody heading="Permit Submitted Successfully" lines={['Dear Customer, You have successfully submitted the food import request to Dubai Municipality', 'and completed the payment. Please find the permit number created for your request.']} refNo="Permit number: DM8765432111" rows={[['Permit Authority Name', 'Dubai Municipality'], ['Request Type', 'Food Import Request'], ['Request Created on', '30th June 2021, 10:00 AM'], ['Amount Paid', '100AED']]} /></Card>
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn>
        <div className="flex items-center gap-[12px]"><OutlineBtn>Proceed To Apply Permit</OutlineBtn><FillBtn onClick={onSubmitDeclaration}>Submit Declaration</FillBtn></div>
      </div>
    </div>
  );
}

/* ── Phase 3: Customs Declaration ── */
function DeclInfoStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const stepper = ['General Information', 'Shipment Details', 'Invoice Details', 'Documents', 'Amendment Summary', 'Payment Details'];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Customs Declaration</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px] flex flex-col gap-[18px]">
        <Card className="px-[20px] py-[14px]"><div className="flex items-center overflow-x-auto no-scrollbar">{stepper.map((s, i) => (<div key={s} className="flex items-center flex-shrink-0"><div className="flex items-center gap-[8px]"><Check green={i < 5} /><span className="text-[13px] whitespace-nowrap" style={{ color: i < 5 ? '#28a745' : '#1360d2', fontWeight: 500 }}>{s}</span></div>{i < stepper.length - 1 && <div className="h-[1.5px] mx-[8px]" style={{ background: i < 4 ? '#28a745' : '#1360d2', width: 60 }} />}</div>))}</div></Card>
        <div className="flex items-center justify-between gap-[12px] flex-wrap">
          <div className="flex items-start gap-[10px] rounded-[6px] px-[16px] py-[12px] flex-1" style={{ background: '#eaf1fb', border: '1px solid #c5d9f7' }}>
            <svg viewBox="0 0 24 24" className="size-[18px] text-[#1360d2] flex-shrink-0 mt-[1px]" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M12 12v4" /></svg>
            <p className="text-[14px] text-[#0e1b3d]">Your Request For Customs Declaration Amendment Will Be Sent For Approval. <span style={{ fontWeight: 600 }}>Request Number: 1213243</span></p>
          </div>
          <OutlineBtn>View Declaration</OutlineBtn>
        </div>
        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Submission Details</p><Card className="p-[18px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">{[['Submission Date', '22-11-2024'], ['Customer Name', 'Mr Shah'], ['Reason for Amendment', 'Exit Point wrongly declared']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>
        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Declaration Details</p><Card className="p-[18px] grid grid-cols-2 sm:grid-cols-4 gap-y-[18px] gap-x-[16px]">{[['Customer Name', 'Muhammed'], ['Declaration Type', 'Import to local from ROW'], ["Client's Decl. Ref. No.", 'JOB12233435'], ['Inbound MABW/MBOL', 'BA122345677i'], ['No. of Packages', '3'], ['Importer VAT TRN', '1234546']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>
        <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Payment Summary</p><Card className="p-[18px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">{[['Payable From Vikram', 'AED105'], ['Payment reference', 'Credit/Debit Account'], ['Total Amount Payable', 'AED 105']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</Card></div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn><FillBtn onClick={onSubmit}>Submit</FillBtn></div>
    </>
  );
}

function DeclSuccess({ onBack, onContinuePayments, exportFinal, onBackToHome }: { onBack: () => void; onContinuePayments: () => void; exportFinal?: boolean; onBackToHome: () => void }) {
  if (exportFinal) {
    // Export by Air journey is 100% complete at customs declaration — only "Back To Home".
    return (
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
        <JourneyProgress active={1} percent={100} exportVariant title="Export by Air flow has been completed" subtitle="Declaration Created - Integrated Clearance Process Completed" button={<FillBtn onClick={onBackToHome}>Back To Home</FillBtn>} />
        <Card className="flex-1"><SuccessBody heading="Declaration Request Created Successfully" lines={['Dear Customer Thank You For Using Service Request Web Application.', 'Your Request For Customs Declaration Amendment Will Be Sent For Approval.', 'Please Find Below Details For Future Reference']} refNo="Request Number: 560010545" rows={[]} /></Card>
        <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
          <OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn>
          <FillBtn onClick={onBackToHome}>Back To Home</FillBtn>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <JourneyProgress active={1} percent={55} title="Declaration Created - Integrated Clearance Process Completed" subtitle="Click on 'Continue' to move to the next step for Import Process" button={<FillBtn onClick={onContinuePayments}>Continue To Payments</FillBtn>} />
      <Card className="flex-1"><SuccessBody heading="Declaration Request Created Successfully" lines={['Dear Customer, You have successfully submitted the food import request to Dubai Municipality', 'and completed the payment. Please find the voucher number created for your request.']} refNo="Reference number:12345678" rows={[['DT Reference Number', '1234567897'], ['Amount Paid', '100AED'], ['Status', 'SUBMITTED']]} /></Card>
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn>
        <div className="flex items-center gap-[12px]"><FillBtn>Apply DM Permit</FillBtn><FillBtn onClick={onContinuePayments}>Continue To Payments</FillBtn></div>
      </div>
    </div>
  );
}

/* ── Phase 4: Payments ── */
function PaymentsStep({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Make Payments <span className="text-[15px] text-[#1360d2] font-normal">Need Help ⓘ</span></h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="p-[20px] mb-[24px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 600 }}>Payment Summary</p>
          <div className="overflow-x-auto rounded-[8px] border border-[#eef1f6]"><table className="w-full border-collapse" style={{ minWidth: 800 }}><thead><tr style={{ background: '#eaf1fb' }}>{['Document No.', 'Clearance', 'Doc. Category', 'Linked BOL', 'Amount', 'VAT Amount', 'Total Amount', 'Actions'].map((c) => <th key={c} className="text-left text-[13px] text-[#455174] px-[14px] py-[12px] whitespace-nowrap" style={{ fontWeight: 600 }}>{c}</th>)}</tr></thead>
            <tbody><tr className="border-t border-[#eef1f6]">{['101-180240124', '1', 'FCL', '337788', '4000.00', '0.00', '4000.00'].map((v, i) => <td key={i} className="text-[14px] text-[#0e1b3d] px-[14px] py-[14px] whitespace-nowrap">{v}</td>)}<td className="px-[14px] py-[14px]"><div className="flex gap-[8px] text-[#697498]"><svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="3" width="16" height="18" rx="2" /></svg><svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg></div></td></tr></tbody></table></div>
        </Card>
        <div className="flex justify-end"><Card className="p-[20px] w-full max-w-[380px]">
          <div className="flex items-center justify-between mb-[16px]"><span className="text-[15px] text-[#5a6282]">Total Amount :</span><span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>12000.00</span></div>
          <div className="flex items-center justify-between gap-[12px] mb-[16px]"><span className="text-[15px] text-[#5a6282]">Payment Mode :</span><div className="flex items-center justify-between gap-[6px] h-[44px] px-[12px] border border-[#d5ddfb] rounded-[4px] flex-1"><span className="text-[15px] text-[#0e1b3d]">e-Payment</span><svg viewBox="0 0 24 24" className="size-[16px] text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></div></div>
          <div className="flex justify-end"><FillBtn onClick={onProceed}>Proceed Payment</FillBtn></div>
        </Card></div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn></div>
    </>
  );
}

function PayStep({ onCancel, onPay }: { onCancel: () => void; onPay: () => void }) {
  const [method, setMethod] = useState(0);
  const methods = [['Debit/Credit', 'M3 10h18'], ['Direct Debit', ''], ['Pre-Funded', '']];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Rosoom</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[24px]">
          <div>
            <p className="text-[18px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 700 }}>How Would You Like To Pay?</p>
            <div className="flex items-center gap-[12px] mb-[22px] flex-wrap">{methods.map(([m], i) => (<button key={m} onClick={() => setMethod(i)} className="flex items-center gap-[8px] h-[56px] px-[18px] rounded-[6px] border text-[15px]" style={{ borderColor: method === i ? '#1360d2' : '#d5ddfb', color: '#0e1b3d', background: '#fff', position: 'relative' }}><svg viewBox="0 0 24 24" className="size-[20px] text-[#455174]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>{m}{method === i && <span className="absolute -top-[7px] -right-[7px] size-[18px] rounded-full bg-[#1360d2] flex items-center justify-center"><svg viewBox="0 0 16 16" className="size-[10px]" fill="none" stroke="#fff" strokeWidth="2.6"><path d="M3 8l3.5 3.5L13 5" /></svg></span>}</button>))}</div>
            <p className="text-[14px] text-[#5a6282] mb-[10px]">Select The Card Type</p>
            <div className="flex items-center gap-[12px] mb-[22px]"><div className="h-[52px] w-[80px] border border-[#e6eaf2] rounded-[6px] flex items-center justify-center text-[13px] font-semibold text-[#eb001b]">master</div><div className="h-[52px] w-[80px] border border-[#e6eaf2] rounded-[6px] flex items-center justify-center text-[15px] font-bold italic text-[#1a1f71]">VISA</div></div>
            <label className="flex items-center gap-[8px] text-[14px] text-[#5a6282] mb-[20px]"><span className="w-[36px] h-[20px] rounded-full bg-[#c3cbe0] relative"><span className="absolute size-[16px] rounded-full bg-white top-[2px] left-[2px]" /></span>Save the new card details for future payments.</label>
            <div className="border-t border-[#eef1f6] pt-[16px]"><label className="flex items-center gap-[8px] text-[14px] text-[#0e1b3d] mb-[10px]"><span className="size-[18px] rounded-[4px] border border-[#c3cbe0]" />Notify me with the payment status.</label><label className="flex items-center gap-[8px] text-[14px] text-[#0e1b3d]"><span className="size-[18px] rounded-[4px] border border-[#c3cbe0]" />I accept the <span className="text-[#1360d2]">Terms and Conditions</span> for this payment.</label></div>
          </div>
          <div>
            <Card className="p-[20px] mb-[16px]"><p className="text-[14px] text-center text-[#0e1b3d] pb-[14px] border-b border-[#eef1f6]" style={{ fontWeight: 700, letterSpacing: 1 }}>ORDER DETAILS</p>
              <div className="flex flex-col gap-[12px] py-[16px]">{[['Merchant', 'DP World'], ['Pay to', 'DP World'], ['Pay for', 'Declaration']].map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-[14px] text-[#8f94ae]">{k}</span><span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</span></div>)}</div>
              <div className="flex justify-between border-t border-[#eef1f6] pt-[14px]"><span className="text-[14px] text-[#8f94ae]">Total</span><span className="text-[20px] text-[#1360d2]" style={{ fontWeight: 700 }}>4000 AED</span></div>
            </Card>
            <button className="h-[48px] w-full rounded-[6px] bg-black text-white text-[15px] mb-[14px]"> Pay</button>
            <div className="flex items-center gap-[12px]"><OutlineBtn onClick={onCancel}>CANCEL ORDER</OutlineBtn><FillBtn onClick={onPay}>AGREE AND PAY</FillBtn></div>
          </div>
        </div>
      </div>
    </>
  );
}

function PaySuccess({ onBack, onCargoWaves }: { onBack: () => void; onCargoWaves: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col">
      <JourneyProgress active={2} percent={75} title="Payments Process Completed" subtitle="Click on 'Continue' to move to the next step" button={<FillBtn onClick={onCargoWaves}>Continue To Cargowaves</FillBtn>} />
      <Card className="flex-1"><SuccessBody heading="Payment completed" lines={['Dear Customer, thank you for using our service to complete your payments.']} refNo="Reference number:12345678" rows={[['Declaration Number', '101-180240124'], ['Amount Paid', '100AED']]} /></Card>
      <div className="flex items-center justify-between gap-[12px] bg-white px-4 md:px-6 py-[16px] rounded-[8px] mt-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><OutlineBtn onClick={onBack}>Back To Listing</OutlineBtn><FillBtn onClick={onCargoWaves}>Go To Cargo Waves</FillBtn></div>
    </div>
  );
}

/* ── Phase 5: Cargo Waves ── */
function CargoOrdersStep({ onNext }: { onNext: () => void }) {
  const [tab, setTab] = useState('Draft');
  const cards = ['BOEN00125', 'BOEN00126', 'BOEN00127', 'BOEN00128', 'BOEN00129', 'BOEN00130', 'BOEN00130', 'BOEN00132', 'BOEN00133'];
  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <div className="flex items-center justify-between mt-[10px] mb-[14px]"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Orders</h1><div className="flex items-center gap-[16px] text-[#697498]"><svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="6" width="15" height="10" rx="1" /><path d="M16 9h4l3 4v3h-7z" /></svg><svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 00-1.7-1L16.5 2h-4l-.4 2.6a7 7 0 00-1.7 1l-2.3-1-2 3.4L5.1 11a7 7 0 000 2l-2 1.5 2 3.4 2.3-1a7 7 0 001.7 1l.4 2.6h4l.4-2.6a7 7 0 001.7-1l2.3 1 2-3.4-2-1.5a7 7 0 00.1-1z" /></svg></div></div>
        <div className="flex items-center gap-[24px] mb-[16px]"><span className="text-[15px] text-[#0e1b3d]">Which type of movement would you like to select?</span><label className="flex items-center gap-[6px] text-[15px]"><span className="size-[16px] rounded-full border-2 border-[#1360d2] flex items-center justify-center"><span className="size-[8px] rounded-full bg-[#1360d2]" /></span>Import</label><label className="flex items-center gap-[6px] text-[15px] text-[#5a6282]"><span className="size-[16px] rounded-full border-2 border-[#c3cbe0]" />Export</label></div>
        <div className="flex items-center gap-[26px] border-b border-[#e6eaf2] mb-[16px]">{['Draft', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map((t) => (<button key={t} onClick={() => setTab(t)} className="text-[15px] pb-[10px]" style={tab === t ? { color: '#1360d2', borderBottom: '2px solid #1360d2', fontWeight: 500 } : { color: '#5a6282' }}>{t}</button>))}</div>
        <div className="flex items-center gap-[12px] flex-wrap mb-[16px]"><div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[42px] px-[12px] min-w-[220px]"><input placeholder="Search by" className="text-[14px] focus:outline-none flex-1" /><svg viewBox="0 0 18 18" width="18" height="18" className="ml-[8px]" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg></div><span className="text-[14px] text-[#5a6282]">Move Type:</span><div className="flex items-center gap-[8px] h-[42px] px-[12px] border border-[#d5ddfb] rounded-[4px] text-[14px]">Import OUT<svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></div><span className="text-[14px] text-[#1360d2]">Advanced search</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {cards.map((c, i) => (<Card key={i} className="p-[16px]">
            <div className="flex items-center justify-between mb-[12px]"><span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{c}</span><span className="size-[16px] rounded-[3px] border border-[#c3cbe0]" /></div>
            {[['Consignee', 'CON0001 | Mohmannd Khan'], ['Storage Validity Date', '10 Aug 2023'], ['Containers', '00/04']].map(([k, v]) => <div key={k} className="flex justify-between mb-[8px]"><span className="text-[13px] text-[#8f94ae]">{k}</span><span className="text-[13px] text-[#0e1b3d]">{v}</span></div>)}
            <div className="flex items-center gap-[14px] pt-[10px] border-t border-[#eef1f6] text-[13px] text-[#1360d2]"><span>◷ Slot</span><span>◉ Destination</span><span>✎ Edit</span><span>◉ View</span></div>
          </Card>))}
        </div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-end gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><FillBtn onClick={onNext}>NEXT</FillBtn><OutlineBtn>RESET</OutlineBtn></div>
    </>
  );
}

function CargoCreateStep({ onBack, onPay }: { onBack: () => void; onPay: () => void }) {
  const stepper = ['Order Selection', 'Container, Hauler & Token Slot Selection', 'Booking Confirmation'];
  const recs = [['HL0011', 'SwiftTrans Logistics', '4.5', 'AED 800'], ['HL0012', 'ExpressCargo Solutions', '4.0', 'AED 750'], ['HL0011', 'SwiftTrans Logistics', '4.5', 'AED 800'], ['HL0012', 'ExpressCargo Solutions', '4.0', 'AED 750'], ['HL0011', 'SwiftTrans Logistics', '4.5', 'AED 800']];
  return (
    <>
      <div className="px-4 md:px-10 pb-[6px] flex-shrink-0"><h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Create Order</h1></div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="px-[20px] py-[16px] mb-[18px]"><div className="flex items-center overflow-x-auto no-scrollbar">{stepper.map((s, i) => (<div key={s} className="flex items-center flex-shrink-0"><div className="flex items-center gap-[8px]">{i === 0 ? <Check green /> : <span className="size-[20px] rounded-full border-2 flex-shrink-0" style={{ borderColor: i === 1 ? '#1360d2' : '#c3cbe0', background: i === 1 ? '#fff' : '#fff' }} />}<span className="text-[13px] whitespace-nowrap" style={{ color: i === 0 ? '#28a745' : i === 1 ? '#1360d2' : '#8f94ae', fontWeight: 500 }}>{s}</span></div>{i < stepper.length - 1 && <div className="h-[2px] mx-[10px]" style={{ background: i === 0 ? '#28a745' : '#dbe3f4', width: 120 }} />}</div>))}</div></Card>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[20px]">
          <div>
            <p className="text-[14px] text-[#0e1b3d] mb-[12px]"><span style={{ fontWeight: 600 }}>Instruction:</span> Select Slot and Destination of the container and assign to a Haulier.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] mb-[16px]">{['Select Destination', 'Select Haulier', 'Interval Time', 'Avg. Return Time'].map((l) => (<div key={l}><p className="text-[12px] text-[#5a6282] mb-[4px]">{l}<span className="text-[#ea2428]">*</span></p><div className="h-[40px] px-[12px] border border-[#d5ddfb] rounded-[4px] flex items-center justify-between text-[13px] text-[#a7abbd]">Select<svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="#697498" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></div></div>))}</div>
            <p className="text-[15px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>BOENO00125</p>
            {['CNT000128', 'CNT004587', 'CNT005454'].map((cnt) => (<div key={cnt} className="rounded-[8px] overflow-hidden border border-[#e6eaf2] mb-[12px]"><div className="flex items-center justify-between px-[14px] py-[10px]" style={{ background: '#455174' }}><span className="text-[13px] text-white" style={{ fontWeight: 600 }}>Container Details</span><span className="text-[13px] text-white">Selection</span></div>
              <div className="p-[14px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]"><div className="grid grid-cols-2 gap-y-[8px] text-[12px]"><span className="text-[#8f94ae]">Container No</span><span className="text-[#0e1b3d]">{cnt}</span><span className="text-[#8f94ae]">Container Type</span><span className="text-[#0e1b3d]">20FT STD ISO0001</span><span className="text-[#8f94ae]">Yard Location</span><span className="text-[#0e1b3d]">Yard 42</span></div><div className="flex flex-col gap-[8px] text-[12px]"><div className="flex items-center justify-between"><span className="text-[#8f94ae]">Destination:</span><span className="h-[34px] px-[10px] border border-[#d5ddfb] rounded-[4px] flex items-center text-[#a7abbd]">selected</span></div><div className="flex items-center justify-between"><span className="text-[#8f94ae]">Preferred Slot:</span><span className="h-[34px] px-[10px] border border-[#d5ddfb] rounded-[4px] flex items-center text-[#0e1b3d]">03 Aug | 02:00</span></div></div></div>
            </div>))}
          </div>
          <div><p className="text-[15px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Recommendation</p>
            <p className="text-[13px] text-[#5a6282] mb-[8px]" style={{ fontWeight: 600 }}>Market Recommendation</p>
            <Card className="overflow-hidden mb-[16px]"><div className="grid grid-cols-[1fr_60px_70px] px-[14px] py-[10px] text-[12px] text-white" style={{ background: '#455174' }}><span>Haulier</span><span>Rating</span><span>Rate</span></div>
              {recs.map((r, i) => (<div key={i} className="grid grid-cols-[1fr_60px_70px] items-center px-[14px] py-[10px] border-t border-[#eef1f6] text-[12px]"><div className="flex items-center gap-[8px]"><span className="size-[14px] rounded-full border-2 flex items-center justify-center" style={{ borderColor: i === 0 ? '#1360d2' : '#c3cbe0' }}>{i === 0 && <span className="size-[6px] rounded-full bg-[#1360d2]" />}</span><div><p className="text-[#0e1b3d]" style={{ fontWeight: 600 }}>{r[0]}</p><p className="text-[#8f94ae]">{r[1]}</p></div></div><span className="text-[#0e1b3d]">{r[2]}</span><span className="text-[#0e1b3d]">{r[3]}</span></div>))}
            </Card>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}><OutlineBtn onClick={onBack}>‹ BACK</OutlineBtn><div className="flex items-center gap-[12px]"><OutlineBtn>RESET</OutlineBtn><OutlineBtn>SAVE AS DRAFT</OutlineBtn><FillBtn onClick={onPay}>PROCCED FOR PAYMENT</FillBtn></div></div>
    </>
  );
}

function CargoSuccess({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-[8px] flex flex-col gap-[16px]">
      <JourneyProgress active={3} percent={100} title="Import by Sea flow has been completed" subtitle="Order Created - Cargo waves flow completed" button={<FillBtn onClick={onBackToHome}>Back To Home</FillBtn>} />
      <Card className="flex flex-col items-center justify-center gap-[16px] py-[48px]" style={{ background: '#eef1f5' }}>
        <div className="size-[64px] rounded-full border-[3px] border-[#28c090] flex items-center justify-center"><svg viewBox="0 0 24 24" className="size-[32px]" fill="none" stroke="#28c090" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div>
        <p className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Your Payment For Order  EB000125 Is Successful.</p>
        <p className="text-[14px] text-[#5a6282]">Payment Receipt No: SR#34059340</p>
        <div className="flex items-center gap-[14px]"><OutlineBtn onClick={onBackToHome}>BACK TO HOME</OutlineBtn><FillBtn>VIEW ORDERS</FillBtn></div>
      </Card>
      <div><p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontWeight: 700 }}>Booking Details</p>
        <Card className="p-[18px] grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
          <div className="rounded-[8px] p-[16px] text-white grid grid-cols-2 gap-y-[12px]" style={{ background: '#1360d2' }}>{[['ORDER No', 'BOL33'], ['ORDER Date', 'BOE00032159'], ['DPW Ref No', 'DP000125'], ['Movement Type', 'Import FCL'], ['Nomination ID', 'NM000125']].map(([k, v]) => <div key={k}><p className="text-[11px] opacity-80">{k}</p><p className="text-[13px]" style={{ fontWeight: 500 }}>{v}</p></div>)}</div>
          <div className="rounded-[8px] overflow-hidden border border-[#eef1f6]"><div className="grid grid-cols-2 px-[12px] py-[8px] text-[12px] text-white" style={{ background: '#455174' }}><span>Container No</span><span>Slot</span></div>{['CNT000125', 'CNT000126', 'CNT000127'].map((c) => <div key={c} className="grid grid-cols-2 px-[12px] py-[10px] text-[12px] border-t border-[#eef1f6]"><span className="text-[#0e1b3d]">{c}</span><span className="text-[#5a6282]">03 Aug | 02:00-04:00</span></div>)}</div>
          <div className="grid grid-cols-2 gap-y-[12px] content-start">{[['Interval Time', '30'], ['Yard Location', 'Yard 42, Dubai'], ['Terminal', '01'], ['Destination', 'JAFZA North']].map(([k, v]) => <Info key={k} k={k} v={v} />)}</div>
        </Card>
      </div>
    </div>
  );
}
