import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import moreVertSrc from '../../assets/passmgmt/more-vert.svg';
import PmListCard, { GreyIconBtn, type Col } from './PmTable';
import {
  Agree, Amount, BlockHead, Btn, C, DocCard, DropBox, FDate, FootActions, FSelect, FText, Grid3, Modal,
  PmPage, RV, Rule, Section, SubHead, Tag, UploadNote, ConfirmDelete, font,
} from './PmUI';
import {
  APPROVAL_HISTORY, DURATIONS, ENTRY_GATES, PASS_FEE, PASS_TYPES, PORTS, PURPOSES, REISSUE_FEE, STATUSES, VISA_TYPES, VISITOR,
  type PassDetail, type PassForm, type PassRow,
} from './pmData';

type Crumb = { label: string; onClick?: () => void };

/* ══════════════ Pass Management listing (Figma 972:34908) + action flyout (972:36193) ══════════════ */

export type RowMenuAction = 'view' | 'edit' | 'renew' | 'printPass' | 'printReceipt' | 'lost';
const MENU: { id: RowMenuAction; label: string }[] = [
  { id: 'view', label: 'View' }, { id: 'edit', label: 'Edit' }, { id: 'renew', label: 'Renew Pass' },
  { id: 'printPass', label: 'Print Pass' }, { id: 'printReceipt', label: 'Print Receipt' }, { id: 'lost', label: 'Report Lost Pass' },
];

export function ActionFlyout({ anchor, onPick, onClose }: { anchor: DOMRect; onPick: (a: RowMenuAction) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<RowMenuAction | null>(null);
  useEffect(() => {
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const t = setTimeout(() => document.addEventListener('mousedown', down));
    window.addEventListener('keydown', key);
    window.addEventListener('resize', onClose);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', down); window.removeEventListener('keydown', key); window.removeEventListener('resize', onClose); };
  }, [onClose]);
  /* 258px wide menu, right-aligned to the ⋮ button; flips up when it would leave the viewport */
  const H = 16 * 2 + 40 * MENU.length;
  const top = anchor.bottom + 6 + H > window.innerHeight ? Math.max(8, anchor.top - H - 6) : anchor.bottom + 6;
  const left = Math.max(8, anchor.right - 258);
  return createPortal(
    <div ref={ref} role="menu" className="fixed z-[85] bg-white rounded-[10px] p-[16px] w-[258px]"
      style={{ top, left, fontFamily: font, filter: 'drop-shadow(0px 4px 10px rgba(143,155,186,0.35))' }}>
      {MENU.map(m => (
        <button key={m.id} role="menuitem" onClick={() => onPick(m.id)} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)}
          className="w-full h-[40px] px-[16px] rounded-[8px] text-left text-[14px] tracking-[0.07px]"
          style={{ background: hover === m.id ? 'rgba(19,96,210,0.07)' : 'transparent', color: hover === m.id ? C.primary : C.text, fontWeight: hover === m.id ? 500 : 400 }}>
          {m.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}

export function PassListingPage({ rows, onHome, onApply, onAction }: {
  rows: PassRow[]; onHome: () => void; onApply: () => void; onAction: (a: RowMenuAction, r: PassRow) => void;
}) {
  const [menu, setMenu] = useState<{ row: PassRow; rect: DOMRect } | null>(null);
  const cols: Col<PassRow>[] = [
    { key: 'passRefNo', label: 'Pass Reference No' },
    { key: 'portName', label: 'Port Name' },
    { key: 'passType', label: 'Pass Type' },
    { key: 'passDuration', label: 'Pass Duration' },
    { key: 'visitorName', label: 'Visitor Name' },
    { key: 'status', label: 'Status', render: r => <Tag status={r.status} /> },
    { key: 'approver', label: 'Approver' },
  ];
  return (
    <PmPage crumbs={[{ label: 'Pass Management' }]} onHome={onHome}>
      <PmListCard
        title="Pass Management" rows={rows} cols={cols} rowKey={r => r.passRefNo}
        search={r => `${r.passRefNo} ${r.portName} ${r.passType} ${r.visitorName} ${r.status} ${r.approver}`}
        advancedChevron
        filters={[
          { label: 'Port Name', options: PORTS, match: (r, v) => r.portName === v },
          { label: 'Pass Type', options: ['Permanent', 'Temporary'], match: (r, v) => r.passType === v },
          { label: 'Status', options: STATUSES, match: (r, v) => r.status === v },
        ]}
        action={{ label: 'Apply New Pass', onClick: onApply }}
        actionCol={{
          label: 'Action', width: '70px',
          render: r => (
            <GreyIconBtn label={`Actions for ${r.passRefNo}`} onClick={e => setMenu({ row: r, rect: e.currentTarget.getBoundingClientRect() })}>
              <img src={moreVertSrc} alt="" width={24} height={24} />
            </GreyIconBtn>
          ),
        }}
      />
      {menu && (
        <ActionFlyout anchor={menu.rect} onClose={() => setMenu(null)}
          onPick={a => { const r = menu.row; setMenu(null); onAction(a, r); }} />
      )}
    </PmPage>
  );
}

/* ══════════════ Shared blocks ══════════════ */

const StatusRight = ({ status }: { status: PassDetail['status'] }) => (
  <div className="flex items-center gap-[8px]"><span className="text-[14px]" style={{ color: C.text }}>Status:</span><Tag status={status} big /></div>
);

/** Visitor information — read-only (View Pass, Report Lost Pass) */
function VisitorReadOnly({ withEid }: { withEid?: boolean }) {
  const v = VISITOR;
  return (
    <Grid3>
      <RV label="Title" value={v.title} /><RV label="First Name" value={v.firstName} /><RV label="Last Name" value={v.lastName} />
      <RV label="Nationality" value={v.nationality} /><RV label="Mobile" value={v.mobile} /><RV label="Email" value={v.email} />
      <RV label="Date of Birth" value={v.dob} /><RV label="Designation" value={v.designation} /><RV label="Visa Type" value={v.visaType} />
      {withEid && <><RV label="Emirates ID Expiry Date" value={v.eidExpiry} /><RV label="Visa Expiry Date" value={v.visaExpiry} /></>}
      <RV label="Company Name" value={v.companyName} /><RV label="Vehicle Number" value={v.vehicleNo} /><RV label="Driving License Number" value={v.drivingLicense} />
    </Grid3>
  );
}

function PaymentInfo({ label = 'Total Pass Amount', method, amount = PASS_FEE }: { label?: string; method?: boolean; amount?: string }) {
  return (
    <Section title="Payment Information">
      <Grid3>
        {method && <RV label="Payment Method" value="ROSOOM" />}
        <RV label={label}><Amount value={amount} /></RV>
      </Grid3>
    </Section>
  );
}

function FormFooter({ agree, setAgree, left, right }: { agree: boolean; setAgree: (v: boolean) => void; left: React.ReactNode; right: React.ReactNode }) {
  return <><Agree checked={agree} onChange={setAgree} /><FootActions left={left} right={right} /></>;
}

/* ══════════════ View Pass (Figma 972:35535) ══════════════ */

export function ViewPassPage({ pass, crumbs, onHome, onBack, onReuse, onPrint }: {
  pass: PassDetail; crumbs: Crumb[]; onHome: () => void; onBack: () => void; onReuse: () => void; onPrint: () => void;
}) {
  return (
    <PmPage crumbs={[...crumbs, { label: 'View Pass' }]} onHome={onHome}>
      <Section title="Pass Information" right={<StatusRight status={pass.status} />}>
        <Grid3>
          <RV label="Application Number:" value={pass.applicationNo} /><RV label="Pass Reference Number:" value={pass.passRefNo} /><RV label="Port:" value={pass.port} />
          <RV label="Entry Gate:" value={pass.entryGate} /><RV label="Pass Type:" value={pass.passType} /><RV label="Pass Duration:" value={pass.passDuration} />
          <RV label="Purpose of Visit" value={pass.purpose} /><RV label="Date of Visit" value={pass.dateOfVisit} /><RV label="Total Amount:"><Amount value={pass.amount} /></RV>
          <RV label="Host Company Name" value={pass.hostCompany} />
        </Grid3>
        <Rule />
        <SubHead>Visitor Information</SubHead>
        <VisitorReadOnly withEid />
        <div className="mt-[28px]"><BlockHead>Document Details</BlockHead></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]"><DocCard title="Personal Photo" file="filename.png" /></div>
      </Section>
      <PaymentInfo />
      <FootActions left={<Btn variant="outline" onClick={onBack}>Back</Btn>}
        right={<><Btn variant="outline" onClick={onReuse}>Reuse this Pass Details</Btn><Btn onClick={onPrint}>Print Pass</Btn></>} />
    </PmPage>
  );
}

/* ══════════════ Apply New Pass (Figma 972:33001) + Apply from Old Pass (3897:225394) ══════════════ */

export function ApplyFromOldModal({ onClose, onFetch }: { onClose: () => void; onFetch: (ref: string) => void }) {
  const [ref, setRef] = useState('');
  return (
    <Modal title="Apply from Old Pass" onClose={onClose}
      actions={<><Btn variant="outline" onClick={onClose}>Cancel</Btn><Btn onClick={() => onFetch(ref.trim() || '123545648687')}>Submit</Btn></>}>
      <p className="text-[16px] mb-[20px]" style={{ color: C.text }}>You will be able to fetch the pass information from a previous request.</p>
      <div className="w-full sm:w-[400px]">
        <FText label="Pass Reference Number/Application Number" value={ref} onChange={setRef} placeholder="Enter Pass Reference Number/Application Number" />
      </div>
      <div className="h-[60px]" />
    </Modal>
  );
}

const ro = (label: string, value: string) => <FText key={label} label={label} value={value} readOnly />;

export function ApplyPassPage({ initial, title = 'Apply New Pass', crumbs, onHome, onCancel, onSaveDraft, onSubmit, onFetchOld }: {
  initial: PassForm; title?: string; crumbs: Crumb[]; onHome: () => void; onCancel: () => void;
  onSaveDraft: (f: PassForm) => void; onSubmit: (f: PassForm) => void; onFetchOld: (ref: string) => PassForm;
}) {
  const [f, setF] = useState<PassForm>(initial);
  const [agree, setAgree] = useState(true);
  const [oldOpen, setOldOpen] = useState(false);
  const set = (k: keyof PassForm) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const v = VISITOR;
  return (
    <PmPage crumbs={[...crumbs, { label: title }]} onHome={onHome}>
      <Section title="Pass Information" right={<Btn small variant="outline" onClick={() => setOldOpen(true)}>Apply from Old Pass</Btn>}>
        <Grid3>
          <FSelect label="Port Name" required value={f.portName} options={PORTS} onChange={set('portName')} />
          <FSelect label="Pass Type" required value={f.passType} options={PASS_TYPES} onChange={set('passType')} />
          <FSelect label="Entry Gate" required value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} />
          <FSelect label="Pass Duration" required value={f.passDuration} options={DURATIONS} onChange={set('passDuration')} />
          <FSelect label="Purpose of Visit" required value={f.purpose} options={PURPOSES} onChange={set('purpose')} />
          <FDate label="Date of Visit" required value={f.dateOfVisit} onChange={set('dateOfVisit')} />
          <FText label="Host Company Name" required value={f.hostCompany} onChange={set('hostCompany')} placeholder="Enter Host Company Name" />
        </Grid3>
        <Rule />
        <SubHead>Visitors Information</SubHead>
        <div className="rounded-[2px] p-[14px] sm:p-[16px]" style={{ border: '1px solid #dfe5f2', background: '#fafbfe' }}>
          <Grid3>
            {ro('Title', v.title)}{ro('First Name', v.firstName)}{ro('Last Name', v.lastName)}
            {ro('Email', v.email)}{ro('Mobile', v.mobile)}{ro('Designation', v.designation)}
            {ro('Visa Type', v.visaType)}{ro('Gender', v.gender)}<FDate label="Date of Birth" value={v.dob} readOnly />
            {ro('Emirates ID', v.emiratesId)}{ro('Emirates ID Expiry date', v.eidExpiry)}{ro('Passport Number', v.passportNo)}
            {ro('Passport Expiry date', v.passportExpiry)}{ro('Visa Number', v.visaNo)}{ro('Visa Expiry date', v.visaExpiry)}
            {ro('Nationality', v.nationality)}
            <FText label="Vehicle Number" value={f.vehicleNo} onChange={set('vehicleNo')} />
          </Grid3>
          <div className="mt-[22px]"><UploadNote /></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            <DocCard title="Personal Photo" required file="filename.png" />
            <DropBox title="Other Documents" />
          </div>
        </div>
      </Section>
      <PaymentInfo />
      <FormFooter agree={agree} setAgree={setAgree}
        left={<Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
        right={<><Btn variant="outline" onClick={() => onSaveDraft(f)}>Save as Draft</Btn><Btn onClick={() => onSubmit(f)}>Submit</Btn></>} />
      {oldOpen && <ApplyFromOldModal onClose={() => setOldOpen(false)} onFetch={r => { setF(onFetchOld(r)); setOldOpen(false); }} />}
    </PmPage>
  );
}

/* ══════════════ Return Pass for Amendment (Figma 972:35792) ══════════════ */

export function AmendPassPage({ pass, initial, crumbs, onHome, onBack, onSubmit }: {
  pass: PassDetail; initial: PassForm; crumbs: Crumb[]; onHome: () => void; onBack: () => void; onSubmit: (f: PassForm) => void;
}) {
  const [f, setF] = useState<PassForm>(initial);
  const [agree, setAgree] = useState(true);
  const [docs, setDocs] = useState(['Personal Photo', 'Passport']);
  const [del, setDel] = useState<string | null>(null);
  const set = (k: keyof PassForm) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const v = VISITOR;
  return (
    <PmPage crumbs={[...crumbs, { label: 'Return Pass for Amendment' }]} onHome={onHome}>
      <Section title="Pass Information">
        <Grid3>
          <RV label="Pass Reference Number:" value={pass.passRefNo} /><RV label="Port:" value={pass.port} />
          <FSelect label="Entry Gate" required value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} />
          <FSelect label="Pass Type" required value={f.passType} options={PASS_TYPES} onChange={set('passType')} />
          <FSelect label="Pass Duration" required value={f.passDuration} options={DURATIONS} onChange={set('passDuration')} />
          <FSelect label="Purpose of Visit" required value={f.purpose} options={PURPOSES} onChange={set('purpose')} />
          <FDate label="Date of Visit" required value={f.dateOfVisit} onChange={set('dateOfVisit')} />
          <div className="hidden lg:block" /><div className="hidden lg:block" />
          <FText label="Host Company Name" required value={f.hostCompany} onChange={set('hostCompany')} placeholder="Enter Host Company Name" />
        </Grid3>
        <Rule />
        <SubHead>Visitor Information</SubHead>
        <Grid3>
          <RV label="Title" value={v.title} /><RV label="First Name" value={v.firstName} /><RV label="Last Name" value={v.lastName} />
          <RV label="Nationality" value={v.nationality} /><RV label="Mobile" value={v.mobile} /><RV label="Email" value={v.email} />
          <FDate label="Date of Birth" value={f.dob} onChange={set('dob')} /><RV label="Designation" value={v.designation} />
          <FSelect label="Visa Type" value={f.visaType} options={VISA_TYPES} onChange={set('visaType')} />
          <RV label="Company Name" value={v.companyName} />
          <FText label="Vehicle Number" value={f.vehicleNo} onChange={set('vehicleNo')} />
          <RV label="Driving License Number" value={v.drivingLicense} />
        </Grid3>
        <div className="mt-[28px]"><BlockHead>Document Details</BlockHead></div>
        <UploadNote />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          {['Personal Photo', 'Passport'].map(d => docs.includes(d)
            ? <DocCard key={d} title={d} file="filename.png" onDelete={() => setDel(d)} />
            : <DropBox key={d} title={d} required />)}
        </div>
      </Section>
      <PaymentInfo method />
      <Section title="Approval History Details">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead><tr style={{ background: C.bar }}>
              {['Date', 'Status', 'By', 'Reason'].map(h => (
                <th key={h} scope="col" className="h-[36px] px-[10px] text-left text-[13px] font-normal uppercase" style={{ color: C.sub }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {APPROVAL_HISTORY.map((h, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.zebra : '#fff' }}>
                  <td className="h-[40px] px-[10px] text-[14px]" style={{ color: C.text }}>{h.date}</td>
                  <td className="px-[10px]"><Tag status={h.status} /></td>
                  <td className="px-[10px] text-[14px]" style={{ color: C.text }}>{h.by}</td>
                  <td className="px-[10px] text-[14px]" style={{ color: C.text }}>{h.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <FormFooter agree={agree} setAgree={setAgree} left={<Btn variant="outline" onClick={onBack}>Back</Btn>} right={<Btn onClick={() => onSubmit(f)}>Submit</Btn>} />
      {del && <ConfirmDelete what={`${del} document`} onNo={() => setDel(null)} onYes={() => { setDocs(d => d.filter(x => x !== del)); setDel(null); }} />}
    </PmPage>
  );
}

/* ══════════════ Renew Pass (Figma 8759:79830) ══════════════ */

export function RenewPassPage({ initial, crumbs, onHome, onBack, onSubmit }: {
  initial: PassForm; crumbs: Crumb[]; onHome: () => void; onBack: () => void; onSubmit: (f: PassForm) => void;
}) {
  const [f, setF] = useState<PassForm>(initial);
  const [agree, setAgree] = useState(true);
  const set = (k: keyof PassForm) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const v = VISITOR;
  return (
    <PmPage crumbs={[...crumbs, { label: 'Renew Pass' }]} onHome={onHome}>
      <Section title="Pass Information">
        <Grid3>
          <FSelect label="Port Name" required value={f.portName} options={PORTS} onChange={set('portName')} />
          <FSelect label="Entry Gate" required value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} />
          <FSelect label="Pass Type" required value={f.passType} options={PASS_TYPES} onChange={set('passType')} />
          <FSelect label="Pass Duration" required value={f.passDuration} options={DURATIONS} onChange={set('passDuration')} />
          <FSelect label="Purpose of Visit" required value={f.purpose} options={PURPOSES} onChange={set('purpose')} />
          <FDate label="Date of Visit" required value={f.dateOfVisit} onChange={set('dateOfVisit')} />
          <FText label="Host Company Name" required value={f.hostCompany} onChange={set('hostCompany')} placeholder="Enter Host Company Name" />
        </Grid3>
        <Rule />
        <SubHead>Visitor Information</SubHead>
        <Grid3>
          <RV label="Title" value={v.title} /><RV label="First Name" value={v.firstName} /><RV label="Last Name" value={v.lastName} />
          <RV label="Nationality" value={v.nationality} /><RV label="Mobile" value={v.mobile} /><RV label="Email" value={v.email} />
          <FDate label="Date of Birth" value={f.dob} onChange={set('dob')} /><RV label="Designation" value={v.designation} /><RV label="Visa Type" value={v.visaType} />
          <FDate label="Emirates ID Expiry Date" required value={f.eidExpiry} onChange={set('eidExpiry')} />
          <FDate label="Visa Expiry Date" required value={f.visaExpiry} onChange={set('visaExpiry')} />
          <RV label="Company Name" value={v.companyName} />
          <FText label="Vehicle Number" value={f.vehicleNo} onChange={set('vehicleNo')} />
          <RV label="Driving License Number" value={v.drivingLicense} />
        </Grid3>
        <div className="mt-[28px]"><SubHead>Document Details</SubHead></div>
        <UploadNote />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <DropBox title="Personal Photo" required /><DropBox title="Passport" required />
          <DropBox title="Emirates ID" required /><DropBox title="Visa" />
          <DropBox title="Other Documents" />
        </div>
      </Section>
      <PaymentInfo label="Total Payment Amount" />
      <FormFooter agree={agree} setAgree={setAgree} left={<Btn variant="outline" onClick={onBack}>Back</Btn>} right={<Btn onClick={() => onSubmit(f)}>Submit</Btn>} />
    </PmPage>
  );
}

/* ══════════════ Report Lost Pass (Figma 972:35266) ══════════════ */

export function ReportLostPage({ pass, crumbs, onHome, onBack, onSubmit }: {
  pass: PassDetail; crumbs: Crumb[]; onHome: () => void; onBack: () => void; onSubmit: () => void;
}) {
  const [agree, setAgree] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [focus, setFocus] = useState(false);
  return (
    <PmPage crumbs={[...crumbs, { label: 'Report Lost Pass' }]} onHome={onHome}>
      <Section title="Pass Information" right={<StatusRight status={pass.status} />}>
        <Grid3>
          <RV label="Pass Reference Number:" value={pass.passRefNo} /><RV label="Port:" value={pass.port} /><RV label="Entry Gate:" value={pass.entryGate} />
          <RV label="Pass Type:" value={pass.passType} /><RV label="Pass Duration:" value={pass.passDuration} /><RV label="Purpose of Visit" value={pass.purpose} />
          <RV label="Date of Visit" value={pass.dateOfVisit} /><RV label="Total Amount:"><Amount value={pass.amount} /></RV>
          <div className="hidden lg:block" />
          <RV label="Host Company Name" value={pass.hostCompany} />
        </Grid3>
        <Rule />
        <SubHead>Visitor Information</SubHead>
        <VisitorReadOnly />
        <div className="mt-[28px]"><BlockHead>Document Details</BlockHead></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]"><DocCard title="Personal Photo" required file="filename.png" /></div>
      </Section>
      <PaymentInfo method amount={pass.amount} />
      <Section title="Reissuing Fee Information">
        <RV label="Reissuing Fee"><Amount value={REISSUE_FEE} /></RV>
      </Section>
      <Section title="Lost Pass Information">
        <div className="w-full lg:w-[66%]">
          <p className="text-[13px] mb-[6px]" style={{ color: C.sub }}>Remarks<span style={{ color: C.accent }}>*</span></p>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter remarks" rows={2}
            onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            className="w-full rounded-[4px] px-[12px] py-[12px] text-[15px] resize-y focus:outline-none placeholder-[#8f94ae]"
            style={{ border: `1px solid ${focus ? C.primary : C.border}`, color: C.text, fontFamily: font }} />
        </div>
        <div className="mt-[18px]"><UploadNote /></div>
        <div className="w-full lg:w-[50%]"><DropBox title="Police Report & Other Document" required /></div>
      </Section>
      <FormFooter agree={agree} setAgree={setAgree} left={<Btn variant="outline" onClick={onBack}>Back</Btn>} right={<Btn onClick={onSubmit}>Submit</Btn>} />
    </PmPage>
  );
}

/* ══════════════ Successful submission (Figma 972:34034) ══════════════ */

export function SuccessPage({ appNo, created, amount, crumbs, onHome, onView, onPrintReceipt, onBackToPasses }: {
  appNo: string; created: string; amount: string; crumbs: Crumb[]; onHome: () => void;
  onView: () => void; onPrintReceipt: () => void; onBackToPasses: () => void;
}) {
  const row = (label: string, value: React.ReactNode) => (
    <div className="grid grid-cols-[180px_1fr] items-center gap-[6px] text-[18px]">
      <span style={{ color: C.sub }}>{label} :</span><span style={{ color: C.text }}>{value}</span>
    </div>
  );
  return (
    <PmPage crumbs={crumbs} onHome={onHome}>
      <div className="bg-white rounded-[4px] px-[20px] pt-[48px] pb-[56px] flex flex-col items-center text-center">
        <div className="size-[76px] rounded-full flex items-center justify-center" style={{ background: '#3ec25a' }}>
          <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="#fff" strokeWidth="3.2"><path d="M10 21l7 7 14-15" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 className="text-[28px] sm:text-[30px] font-medium mt-[36px] mb-[14px]" style={{ color: '#2e9b5f' }}>Your Request Submitted Successfully</h1>
        <div className="flex flex-col gap-[10px] text-left">
          {row('Application Number', appNo)}
          {row('Created Date', created)}
          {row('Status', <Tag status="Under Review" big />)}
          {row('Paid Amount', <Amount value={amount} />)}
        </div>
        <div className="flex gap-[20px] mt-[32px] flex-wrap justify-center">
          <Btn variant="outline" onClick={onView}>View Request</Btn>
          <Btn onClick={onPrintReceipt}>Print Receipt</Btn>
        </div>
        <button onClick={onBackToPasses} className="mt-[30px] text-[16px] font-bold hover:underline" style={{ color: C.primary }}>Back to Passes</button>
      </div>
    </PmPage>
  );
}
