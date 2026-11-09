import { useCallback, useState } from 'react';
import ServiceListingPage from './ServiceListingPage';
import { help } from './serviceConfigs';
import type { ServiceConfig, ServiceRow } from './serviceTypes';
import { GatePage, IconBtn, PrimaryBtn, SecondaryBtn, font } from '../gatepass/GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { Toast } from '../gatepass/GatePassModals';
import { DhAmount } from '../Dh';

/* ──────────────────────────────────────────────────────────────
   Tasreeh - Payments (Tasreeh New Services Figma 5274:96499
   pending payments · 5359:119244 advanced filters · 5274:96871
   payment card · 5274:96909 success). Listing on the master
   template; pick rows → Pay Selected → payment review → success.
   ────────────────────────────────────────────────────────────── */
const TITLE = 'Tasreeh - Payments';
const SERVICE_TYPES = ['Security Personnel Registration', 'Security Company Registration', 'Security Services', 'Gate Pass', 'ISPS Services', 'Vessel Services', 'Media Services'];

const PAYMENTS_CONFIG: ServiceConfig = {
  key: 'tasreeh-payments',
  title: TITLE,
  intro: 'Pending payments for your Tasreeh service requests.',
  help: help('Tasreeh Payments', 'Pay the pending invoices for your Tasreeh requests in one go.', 'Invoice number for each request.'),
  columns: [
    { key: 'applicationNo', label: 'Application No', w: 230 },
    { key: 'serviceType',   label: 'Service Type', w: 260 },
    { key: 'createdOn',     label: 'Created On', w: 150 },
    { key: 'invoiceNo',     label: 'Invoice Number', w: 170 },
    { key: 'amount',        label: 'Amount (in AED)', w: 170 },
  ],
  defaultVisible: ['applicationNo', 'serviceType', 'createdOn', 'invoiceNo', 'amount'],
  statusLabel: 'Payment Status',
  statuses: ['Pending Payment'],
  actions: ['Pay Now'],
  searchFields: ['Application Number', 'Invoice Number'],
  /* Figma 5359:119244 */
  filters: [
    { key: 'applicationNo', label: 'Application Number', type: 'text', placeholder: 'Enter Application Number' },
    { key: 'serviceType', label: 'Service Type', type: 'select', options: SERVICE_TYPES },
    { key: 'invoiceNo', label: 'Invoice Number', type: 'text', placeholder: 'Enter Invoice Number' },
    { key: 'createdDate', label: 'Created Date', type: 'date' },
  ],
  sections: [{
    id: 'payment', title: 'Payment', kind: 'fields', fields: [
      { key: 'serviceType', label: 'Service Type', type: 'select', options: SERVICE_TYPES },
      { key: 'invoiceNo', label: 'Invoice Number', type: 'text' },
      { key: 'amount', label: 'Amount (in AED)', type: 'amount' },
      { key: 'createdDate', label: 'Created Date', type: 'date' },
    ],
  }],
  agreement: '',
  sample: () => ({ fields: {}, lists: {} }),
};

/* My Receipts (Tasreeh-Dev Figma 4826:68189) — receipt number is the row key */
const RECEIPTS_CONFIG: ServiceConfig = {
  ...PAYMENTS_CONFIG,
  key: 'tasreeh-receipts',
  columns: [
    { key: 'applicationNo', label: 'Receipt Number', w: 230 },
    { key: 'appNo',         label: 'Application Number', w: 260 },
    { key: 'amount',        label: 'Amount (in AED)', w: 180 },
    { key: 'createdOn',     label: 'Created On', w: 160 },
    { key: 'serviceType',   label: 'Service Type', w: 260 },
  ],
  defaultVisible: ['applicationNo', 'appNo', 'amount', 'createdOn'],
  statuses: ['Paid'],
  actions: ['Download'],
  searchFields: ['Application Number', 'Receipt Number'],
  filters: [
    { key: 'applicationNo', label: 'Receipt Number', type: 'text', placeholder: 'Enter Receipt Number' },
    { key: 'appNo', label: 'Application Number', type: 'text', placeholder: 'Enter Application Number' },
    { key: 'serviceType', label: 'Service Type', type: 'select', options: SERVICE_TYPES },
    { key: 'createdDate', label: 'Created Date', type: 'date' },
  ],
  sections: [{
    id: 'receipt', title: 'Receipt', kind: 'fields', fields: [
      { key: 'appNo', label: 'Application Number', type: 'text' },
      { key: 'serviceType', label: 'Service Type', type: 'select', options: SERVICE_TYPES },
      { key: 'amount', label: 'Amount (in AED)', type: 'amount' },
      { key: 'createdDate', label: 'Created Date', type: 'date' },
    ],
  }],
};

const RECEIPT_NOS = ['7725068610', '2377471239', '5205896212', '7111924081', '1565015004', '1883798829', '5101345246', '1641617565', '0500042814', '6072232892'];
const RECEIPTS: ServiceRow[] = RECEIPT_NOS.map((no, i) => ({
  applicationNo: no, createdOn: '01-Jan-2024', status: 'Paid',
  values: { fields: { appNo: no, serviceType: ['Security Personnel Registration', 'Gate Pass', 'Security Company Registration'][i % 3], amount: '25.00', createdDate: '2024-01-01' }, lists: {} },
}));

const TABS = [{ key: 'pending', label: 'Pending Payments' }, { key: 'receipts', label: 'My Receipts' }];

const AMOUNTS = ['25.00', '50.00', '25.00', '100.00', '75.00', '25.00', '150.00', '50.00', '25.00', '200.00', '25.00', '50.00'];
const DAYS = ['01', '03', '05', '08', '10', '12', '15', '18', '20', '22', '25', '28'];
const PENDING: ServiceRow[] = AMOUNTS.map((amount, i) => ({
  applicationNo: `APPSCRTPrs202401${DAYS[i]}${String(101 + i)}`,
  createdOn: `${DAYS[i]}-Jan-2024`,
  status: 'Pending Payment',
  values: { fields: { serviceType: SERVICE_TYPES[i % SERVICE_TYPES.length], invoiceNo: `INVC${1234 + i}`, amount, createdDate: `2024-01-${DAYS[i]}` }, lists: {} },
}));

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
const sum = (rows: ServiceRow[]) => rows.reduce((t, r) => t + Number(r.values.fields.amount ?? 0), 0);

/* ── Payment review: selected records + payment card (Figma 5274:96871, VCC payment summary layout) ── */
function PaymentReviewPage({ rows, onHome, onBack, onRemove, onPay }: {
  rows: ServiceRow[]; onHome: () => void; onBack: () => void; onRemove: (id: string) => void; onPay: () => void;
}) {
  const total = sum(rows);
  return (
    <GatePage title="Review Selected" crumb={TITLE} onHome={onHome} onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-[20px] items-start">
        <div className="bg-white rounded-[8px] px-[24px] py-[20px] min-w-0" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
          <p className="text-[20px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Selected Records</p>
          <p className="text-[16px] text-[#455174] mt-[4px] mb-[16px]" style={{ fontFamily: font }}>
            <span className="font-semibold text-[#1360d2]">{rows.length}</span> record{rows.length === 1 ? '' : 's'} selected for payment
          </p>
          <div className="rounded-[8px] overflow-x-auto" style={{ border: '1px solid #eef1f8' }}>
            <JourneyTable minWidth={860}>
              <JourneyThead columns={[
                { label: '#', w: 60, filter: false }, { label: 'Application No' }, { label: 'Service Type' }, { label: 'Created On' },
                { label: 'Invoice Number' }, { label: 'Amount (in AED)' }, { label: 'Action', w: 90, filter: false, sticky: true },
              ]} />
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-[16px] text-[#8f94ae] bg-white" style={{ padding: '26px 16px', fontFamily: font }}>No records selected</td></tr>
                ) : rows.map((r, i) => (
                  <tr key={r.applicationNo}>
                    <JourneyTd first>{i + 1}</JourneyTd>
                    <JourneyTd>{r.applicationNo}</JourneyTd>
                    <JourneyTd>{r.values.fields.serviceType}</JourneyTd>
                    <JourneyTd>{r.createdOn}</JourneyTd>
                    <JourneyTd>{r.values.fields.invoiceNo}</JourneyTd>
                    <JourneyTd><DhAmount value={r.values.fields.amount} className="text-[16px] font-bold text-[#051937]" style={{ fontFamily: font }} /></JourneyTd>
                    <JourneyTd sticky width={90}><IconBtn kind="delete" label={`Remove ${r.applicationNo}`} onClick={() => onRemove(r.applicationNo)} /></JourneyTd>
                  </tr>
                ))}
              </tbody>
            </JourneyTable>
          </div>
        </div>

        {/* Payment card */}
        <div className="bg-white rounded-[8px] px-[20px] py-[18px] lg:sticky lg:top-0" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)', fontFamily: font }}>
          <p className="text-[20px] font-medium text-[#1a1a1a] mb-[14px]">Payment</p>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-[10px] py-[18px] border-b border-[#eef1f8]">
              <span className="size-[40px] rounded-full bg-[#e9ebef] flex items-center justify-center">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#5a6478" strokeWidth="1.6"><rect x="3" y="3" width="5.5" height="5.5" rx="1" /><rect x="11.5" y="3" width="5.5" height="5.5" rx="1" /><rect x="3" y="11.5" width="5.5" height="5.5" rx="1" /><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" /></svg>
              </span>
              <p className="text-[16px] text-[#8f94ae] font-medium">No Services Selected</p>
            </div>
          ) : (
            <div className="border-b border-[#eef1f8] pb-[12px]">
              {[['No. of Invoices Selected', String(rows.length)], ['No. of Service Types', String(new Set(rows.map(r => r.values.fields.serviceType)).size)]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between py-[8px]">
                  <span className="text-[15px] text-[#455174]">{l}</span>
                  <span className="text-[15px] font-semibold text-[#0e1b3d]">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-[8px]">
                <span className="text-[15px] text-[#455174]">Total Charges</span>
                <DhAmount value={total.toFixed(2)} className="text-[15px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }} />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between py-[16px]">
            <span className="text-[16px] text-[#1a1a1a]">Total Payable Amount</span>
            <DhAmount value={total.toFixed(2)} className="text-[22px] font-bold" style={{ fontFamily: font, color: '#1360d2' }} />
          </div>
          <div className="[&>button]:w-full"><PrimaryBtn onClick={onPay} disabled={rows.length === 0}>Pay Now</PrimaryBtn></div>
        </div>
      </div>
    </GatePage>
  );
}

/* ── Payment Successful (Figma 5274:96909) ── */
function PaymentSuccessPage({ amount, onHome, onBack, onReceipts }: { amount: string; onHome: () => void; onBack: () => void; onReceipts: () => void }) {
  return (
    <GatePage title="Payment" crumb={TITLE} onHome={onHome} onListing={onBack}>
      <div className="bg-white rounded-[8px] py-[64px] px-[24px] flex flex-col items-center" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)', fontFamily: font }}>
        <span className="size-[75px] rounded-full flex items-center justify-center mb-[28px]" style={{ background: '#3cc35a' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h2 className="text-[30px] font-medium mb-[22px]" style={{ color: '#3ca865' }}>Payment Successful</h2>
        <div className="grid grid-cols-[180px_auto] gap-y-[14px] text-[18px] mb-[30px]">
          <span className="text-[#575757]">Paid Date :</span><span className="text-[#1a1a1a]">{fmt(new Date())}</span>
          <span className="text-[#575757]">Paid Amount:</span>
          <DhAmount value={amount} className="text-[18px] font-bold text-[#1a1a1a]" style={{ fontFamily: font }} />
        </div>
        <div className="flex flex-wrap justify-center gap-[20px]">
          <SecondaryBtn onClick={onBack}>Back to Pending Payments</SecondaryBtn>
          <PrimaryBtn onClick={onReceipts}>View All Receipts</PrimaryBtn>
        </div>
      </div>
    </GatePage>
  );
}

type Step = { kind: 'listing' } | { kind: 'pay'; ids: string[] } | { kind: 'success'; amount: string };

export default function TasreehPaymentsFlow({ onClose }: { onClose: () => void }) {
  const [pending, setPending] = useState<ServiceRow[]>(PENDING);
  const [receipts, setReceipts] = useState<ServiceRow[]>(RECEIPTS);
  const [tab, setTab] = useState<'pending' | 'receipts'>('pending');
  const [step, setStep] = useState<Step>({ kind: 'listing' });
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const toListing = () => setStep({ kind: 'listing' });

  let page: JSX.Element;
  if (step.kind === 'pay') {
    const rows = pending.filter(r => step.ids.includes(r.applicationNo));
    page = (
      <PaymentReviewPage rows={rows} onHome={onClose} onBack={toListing}
        onRemove={id => setStep({ kind: 'pay', ids: step.ids.filter(x => x !== id) })}
        onPay={() => {
          setPending(prev => prev.filter(r => !step.ids.includes(r.applicationNo)));
          /* Each paid record gets a receipt, newest first */
          const d = new Date();
          setReceipts(prev => [...rows.map((r, i) => ({
            applicationNo: `RCPT${String(d.getTime()).slice(-7)}${i}`, createdOn: fmt(d), status: 'Paid',
            values: { fields: { appNo: r.applicationNo, serviceType: r.values.fields.serviceType, amount: r.values.fields.amount, createdDate: d.toISOString().slice(0, 10) }, lists: {} },
          })), ...prev]);
          setStep({ kind: 'success', amount: sum(rows).toFixed(2) });
        }} />
    );
  } else if (step.kind === 'success') {
    page = <PaymentSuccessPage amount={step.amount} onHome={onClose} onBack={() => { setTab('pending'); toListing(); }}
      onReceipts={() => { setTab('receipts'); toListing(); }} />;
  } else if (tab === 'receipts') {
    page = (
      <ServiceListingPage
        key="receipts"
        config={RECEIPTS_CONFIG}
        rows={receipts}
        drafts={[]}
        tabs={TABS}
        activeTab={tab}
        onTabChange={k => setTab(k as 'pending' | 'receipts')}
        onClose={onClose}
        onCreate={() => {}}
        onOpenDraft={() => {}}
        onAction={(_, row) => setToast(`Receipt ${row.applicationNo} downloaded`)}
        mode={{ hideCreate: true, hideDrafts: true, downloadOnly: true, amountKey: 'amount', dateLabel: 'Created Date' }}
      />
    );
  } else {
    page = (
      <ServiceListingPage
        key="pending"
        config={PAYMENTS_CONFIG}
        rows={pending}
        tabs={TABS}
        activeTab={tab}
        onTabChange={k => setTab(k as 'pending' | 'receipts')}
        drafts={[]}
        onClose={onClose}
        onCreate={() => {}}
        onOpenDraft={() => {}}
        onAction={(a, row) => setStep({ kind: 'pay', ids: [row.applicationNo] })}
        mode={{
          hideCreate: true, hideDrafts: true, amountKey: 'amount', dateLabel: 'Created Date',
          select: { label: 'Pay Selected', onSubmit: rows => setStep({ kind: 'pay', ids: rows.map(r => r.applicationNo) }) },
        }}
      />
    );
  }
  return <>{page}{toast && <Toast message={toast} onDone={clearToast} />}</>;
}
