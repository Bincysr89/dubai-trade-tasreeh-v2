import { useState } from 'react';
import moreVertSrc from '../../assets/passmgmt/more-vert.svg';
import closeSrc from '../../assets/passmgmt/close.svg';
import PmListCard, { GreyIconBtn, type Col } from './PmTable';
import { ActionFlyout, ApplyFromOldModal, type RowMenuAction } from './PassPages';
import {
  Agree, Amount, BlockHead, Btn, C, ConfirmDelete, DocCard, DropBox, FAmount, FDate, FootActions, FSelect, FText, Grid3, Modal,
  PmPage, Radio, ResultCard, RV, Rule, Section, SubHead, Tag, UploadNote,
} from './PmUI';
import {
  COMPANY_PASS_TYPES, COMPANY_PURPOSES, DURATIONS, ENTRY_GATES, FETCHED_VISITOR, GENDERS, NATIONALITIES, PASS_FEE, PORTS,
  SHOOTING_METHODS, STATUSES, VISA_TYPES, VISITOR, ZONES, isoToDisplay, money, perPass,
  type CompanyForm, type CompanyVisitor, type PassDetail, type PassRow,
} from './pmData';

type Crumb = { label: string; onClick?: () => void };

export const ResetLink = ({ onClick, label = 'Reset' }: { onClick: () => void; label?: string }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-[6px] text-[15px] font-bold h-[44px]" style={{ color: C.primary }}>
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M15.5 6.5A6.5 6.5 0 004 8M4.5 13.5A6.5 6.5 0 0016 12" /><path d="M15.8 3v3.8H12M4.2 17v-3.8H8" />
    </svg>
    {label}
  </button>
);

/* ══════════════ Visitor Details popup (Figma 1005:30551) ══════════════ */

type Lookup = { visaType: string; emiratesId: string; dob: string; gender: string };

function VisitorDetailsModal({ initial, onClose, onManual, onConfirm }: {
  initial: Lookup; onClose: () => void; onManual: (l: Lookup) => void; onConfirm: (l: Lookup) => void;
}) {
  const [l, setL] = useState<Lookup>({ ...initial, emiratesId: initial.emiratesId || '784-1985-1234567-1', dob: initial.dob || '1985-01-21', gender: initial.gender || 'Male' });
  const set = (k: keyof Lookup) => (v: string) => setL(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Visitor Details" onClose={onClose}
      actions={<><Btn variant="outline" onClick={() => onManual(l)}>Enter Manually</Btn><Btn onClick={() => onConfirm(l)}>Yes, Confirm Details</Btn></>}>
      <p className="text-[18px] font-medium mb-[10px]" style={{ color: C.navy }}>Confirm Visitor Details</p>
      <p className="text-[15px] mb-[24px]" style={{ color: C.text }}>Please confirm if the fetched details of the visitor is correct.</p>
      <Grid3>
        <FSelect label="Visa Type" value={l.visaType} options={VISA_TYPES} onChange={set('visaType')} />
        <FText label="Emirates ID" required value={l.emiratesId} onChange={set('emiratesId')} placeholder="NNN-NNNN-NNNNNNN-N" />
        <FDate label="Date of Birth" required value={l.dob} onChange={set('dob')} />
        <FSelect label="Gender" value={l.gender} options={GENDERS} onChange={set('gender')} />
        <div className="hidden lg:block" /><div className="hidden lg:block" />
        <FText label="Title" required value={FETCHED_VISITOR.title} readOnly />
        <FText label="First Name" required value={FETCHED_VISITOR.firstName} readOnly />
        <FText label="Last Name" required value={FETCHED_VISITOR.lastName} readOnly />
      </Grid3>
    </Modal>
  );
}

/* ══════════════ Visitors Added table ══════════════ */

function VisitorsTable({ form, onEdit, onDelete }: { form: CompanyForm; onEdit?: (v: CompanyVisitor) => void; onDelete?: (v: CompanyVisitor) => void }) {
  const zone = form.access === 'zone';
  const heads = zone
    ? ['Zone', 'Ports', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Gender', 'Company Name']
    : ['Port', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Date of Birth', 'Gender', 'Company Name'];
  const cells = (v: CompanyVisitor) => zone
    ? [form.zone || 'Zone 1', ZONES[form.zone || 'Zone 1'].split(',').slice(0, 2).join(','), form.passType || 'Visitor', form.passDuration || 'One Day', `${v.firstName} ${v.lastName}`, v.visaType, v.gender, v.companyName || '--']
    : [form.portName || 'Jebel Ali', form.passType || 'Visitor', form.passDuration || 'One Day', `${v.firstName} ${v.lastName}`, v.visaType, isoToDisplay(v.dob) || v.dob, v.gender, v.companyName || '--'];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-separate" style={{ borderSpacing: 0 }}>
        <thead><tr style={{ background: C.bar }}>
          {[...heads, 'Action'].map(h => (
            <th key={h} scope="col" className="h-[34px] px-[10px] text-left text-[13px] font-normal uppercase whitespace-nowrap" style={{ color: C.sub }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {form.visitors.length === 0 ? (
            <tr><td colSpan={heads.length + 1} className="pt-[8px]">
              <div className="h-[50px] flex items-center justify-center text-[15px] rounded-[2px]" style={{ background: '#f5f7fb', border: '1px solid #dfe5f2', color: C.muted }}>No Visitors Added</div>
            </td></tr>
          ) : form.visitors.map((v, i) => (
            <tr key={v.id} style={{ background: i % 2 === 0 ? C.zebra : '#fff' }}>
              {cells(v).map((c, k) => <td key={k} className="h-[46px] px-[10px] text-[15px] whitespace-nowrap" style={{ color: C.text }}>{c}</td>)}
              <td className="px-[10px]">
                {onEdit && onDelete && (
                  <div className="flex gap-[8px]">
                    <GreyIconBtn label={`Edit ${v.firstName}`} onClick={() => onEdit(v)}>
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" strokeLinejoin="round" /></svg>
                    </GreyIconBtn>
                    <GreyIconBtn label={`Delete ${v.firstName}`} tone="red" onClick={() => onDelete(v)}>
                      <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5M8 9v5M12 9v5" /></svg>
                    </GreyIconBtn>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════ Company Apply New Pass (Figma 1248:50444 / 1248:56305 / 1248:57922 / 1253:18855 / 1005:23060) ══════════════ */

const EMPTY_LOOKUP: Lookup = { visaType: 'Resident', emiratesId: '', dob: '', gender: '' };
type Entry = { mode: 'confirmed' | 'manual'; editingId?: string; title: string; firstName: string; lastName: string; companyName: string; companyAddress: string; vehicleNo: string };

export function CompanyApplyPage({ initial, crumbs, onHome, onCancel, onSaveDraft, onSubmit, onFetchOld }: {
  initial: CompanyForm; crumbs: Crumb[]; onHome: () => void; onCancel: () => void;
  onSaveDraft: (f: CompanyForm) => void; onSubmit: (f: CompanyForm) => void; onFetchOld: (ref: string) => Partial<CompanyForm>;
}) {
  const [f, setF] = useState<CompanyForm>(initial);
  const [agree, setAgree] = useState(true);
  const [agreePhoto, setAgreePhoto] = useState(true);
  const [oldOpen, setOldOpen] = useState(false);
  const [lookup, setLookup] = useState<Lookup>(EMPTY_LOOKUP);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [delVisitor, setDelVisitor] = useState<CompanyVisitor | null>(null);
  const set = <K extends keyof CompanyForm>(k: K) => (v: CompanyForm[K]) => setF(p => ({ ...p, [k]: v }));
  const zone = f.access === 'zone';
  const photo = f.passType === 'Photography/Video';
  const setL = (k: keyof Lookup) => (v: string) => setLookup(p => ({ ...p, [k]: v }));
  const setE = (k: keyof Entry) => (v: string) => setEntry(p => (p ? { ...p, [k]: v } : p));

  const openEntry = (mode: Entry['mode'], l: Lookup) => {
    setLookup(l); setConfirmOpen(false);
    setEntry({ mode, ...(mode === 'confirmed' ? FETCHED_VISITOR : { title: '', firstName: '', lastName: '' }), companyName: '', companyAddress: '', vehicleNo: '' });
  };
  const saveVisitor = () => {
    if (!entry) return;
    const v: CompanyVisitor = {
      id: entry.editingId ?? `v${Date.now()}`, ...lookup,
      title: entry.title || 'Mr', firstName: entry.firstName || FETCHED_VISITOR.firstName, lastName: entry.lastName || FETCHED_VISITOR.lastName,
      companyName: entry.companyName || 'ABC', companyAddress: entry.companyAddress, vehicleNo: entry.vehicleNo,
    };
    setF(p => ({ ...p, visitors: entry.editingId ? p.visitors.map(x => (x.id === v.id ? v : x)) : [...p.visitors, v] }));
    setEntry(null); setLookup(EMPTY_LOOKUP);
  };
  const editVisitor = (v: CompanyVisitor) => {
    setLookup({ visaType: v.visaType, emiratesId: v.emiratesId, dob: v.dob, gender: v.gender });
    setEntry({ mode: 'manual', editingId: v.id, title: v.title, firstName: v.firstName, lastName: v.lastName, companyName: v.companyName, companyAddress: v.companyAddress, vehicleNo: v.vehicleNo });
  };
  const resetPassInfo = () => setF(p => ({ ...p, portName: '', zone: '', entryGate: p.access === 'zone' ? 'Any Gate' : '', passType: '', passDuration: '', purpose: '', dateOfVisit: '' }));
  const amount = perPass(f.passDuration);
  const total = money(Number(f.passDuration ? amount : PASS_FEE) * Math.max(1, f.visitors.length));

  return (
    <PmPage crumbs={[...crumbs, { label: 'Apply New Pass' }]} onHome={onHome}>
      <Section title="Pass Access Category" right={<Btn small variant="outline" onClick={() => setOldOpen(true)}>Apply from Old Pass</Btn>}>
        <div className="flex gap-x-[64px] gap-y-[16px] flex-wrap px-[8px]" role="radiogroup" aria-label="Pass access category">
          <Radio checked={!zone} onChange={() => setF(p => ({ ...p, access: 'port', entryGate: '' }))} label="Port Access" hint="You can only choose one port per request" />
          <Radio checked={zone} onChange={() => setF(p => ({ ...p, access: 'zone', entryGate: 'Any Gate' }))} label="Zone Access" hint="You can only choose zones(predefined group of ports) per request" />
        </div>
      </Section>

      <Section title="Pass Information">
        <Grid3>
          {zone ? (
            <div>
              <FSelect label="Zone" required value={f.zone} options={Object.keys(ZONES)} onChange={set('zone')} />
              {f.zone && (
                <p className="text-[13px] leading-[20px] mt-[6px] px-[10px] py-[6px] rounded-[2px]" style={{ background: '#eef1f7', color: C.sub }}>
                  Ports: <span style={{ color: C.text }}>{ZONES[f.zone]}</span>
                </p>
              )}
            </div>
          ) : <FSelect label="Port Name" required value={f.portName} options={PORTS} onChange={set('portName')} />}
          {zone ? <FText label="Entry Gate" required value="Any Gate" readOnly /> : <FSelect label="Entry Gate" required value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} />}
          <FSelect label="Pass Type" required value={f.passType} options={COMPANY_PASS_TYPES} onChange={set('passType')} />
          <FSelect label="Pass Duration" required value={f.passDuration} options={DURATIONS} onChange={set('passDuration')} />
          <FSelect label="Purpose of Visit" required value={f.purpose} options={COMPANY_PURPOSES} onChange={set('purpose')} />
          <FDate label="Date of Visit" required value={f.dateOfVisit} onChange={set('dateOfVisit')} />
          <FText label="Host Company Name" required value={f.hostCompany} onChange={set('hostCompany')} placeholder="Enter Host Company Name" />
        </Grid3>
        {f.passDuration && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] mt-[22px] items-end">
            <FAmount label={zone ? 'Pass Amount' : 'Per Pass Amount'} value={amount} />
            {!zone && <div><ResetLink onClick={resetPassInfo} /></div>}
          </div>
        )}

        {photo && (
          <div className="mt-[30px]">
            <SubHead>Photography/Video</SubHead>
            <Grid3>
              <FText label="Studio/Shooting Company" required value={f.studio} onChange={set('studio')} placeholder="Enter Company Name" />
              <FDate label="Shooting Date" required value={f.shootingDate} onChange={set('shootingDate')} />
              <FSelect label="Shooting Method" required value={f.shootingMethod} options={SHOOTING_METHODS} onChange={set('shootingMethod')} />
              <FText label="Shooting Location" required value={f.shootingLocation} onChange={set('shootingLocation')} placeholder="Enter Shooting Location" />
            </Grid3>
            <div className="mt-[22px]"><UploadNote /></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              <DropBox title="Crew Passport Copies with Visa" required />
              <DropBox title="Studio/Shooting Company Trade License" required />
              <DropBox title="NOC from Civil Aviation (Arial shooting)" required />
              <DropBox title="NOC from Police Air Wing (Arial Shooting)" required />
              <DropBox title="NOC from Dubai Film and TV Commission (Dubai Studio City)" required />
            </div>
            <div className="mt-[30px]"><SubHead>Tools &amp; Equipments</SubHead></div>
            <div className="flex flex-col gap-[14px]">
              {f.equipment.map((eq, i) => (
                <div key={eq.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] lg:grid-cols-[1fr_1fr_1fr] gap-x-[24px] gap-y-[10px] items-end">
                  <FText label={i === 0 ? 'Equipment Name' : ''} value={eq.name} placeholder="Enter equipment name"
                    onChange={v => set('equipment')(f.equipment.map(x => (x.id === eq.id ? { ...x, name: v } : x)))} />
                  <FText label={i === 0 ? 'Equipment Quantity' : ''} value={eq.qty} placeholder="Enter equipment quantity"
                    onChange={v => set('equipment')(f.equipment.map(x => (x.id === eq.id ? { ...x, qty: v } : x)))} />
                  <div className="h-[44px] flex items-center">
                    <GreyIconBtn label="Remove equipment" tone="red" onClick={() => set('equipment')(f.equipment.length > 1 ? f.equipment.filter(x => x.id !== eq.id) : [{ id: 'e0', name: '', qty: '' }])}>
                      <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5M8 9v5M12 9v5" /></svg>
                    </GreyIconBtn>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[16px]"><Btn small variant="outline" onClick={() => set('equipment')([...f.equipment, { id: `e${Date.now()}`, name: '', qty: '' }])}>+Add More Equipment</Btn></div>
          </div>
        )}

        <div className="mt-[30px]"><SubHead>Visitors Information</SubHead></div>
        <div className="rounded-[2px] p-[14px] sm:p-[16px]" style={{ border: '1px solid #dfe5f2', background: '#fafbfe' }}>
          <Grid3>
            <FSelect label="Visa Type" required value={lookup.visaType} options={VISA_TYPES} onChange={setL('visaType')} />
            <FText label="Emirates ID" required value={lookup.emiratesId} onChange={setL('emiratesId')} placeholder="Enter" />
            <FDate label="Date of Birth" required value={lookup.dob} onChange={setL('dob')} />
            <FSelect label="Gender" value={lookup.gender} options={GENDERS} onChange={setL('gender')} />
            <div className="flex items-end"><Btn onClick={() => setConfirmOpen(true)}>Search</Btn></div>
          </Grid3>
          {entry && (
            <div className="mt-[22px]">
              <Grid3>
                <FText label="Title" required value={entry.title} onChange={setE('title')} readOnly={entry.mode === 'confirmed'} placeholder="Enter" />
                <FText label="First Name" required value={entry.firstName} onChange={setE('firstName')} readOnly={entry.mode === 'confirmed'} placeholder="Enter" />
                <FText label="Last Name" required value={entry.lastName} onChange={setE('lastName')} readOnly={entry.mode === 'confirmed'} placeholder="Enter" />
                <FText label="Company Name" required value={entry.companyName} onChange={setE('companyName')} />
                <FText label="Company Address" value={entry.companyAddress} onChange={setE('companyAddress')} />
                <FText label="Vehicle Number" value={entry.vehicleNo} onChange={setE('vehicleNo')} placeholder="Enter Vehicle Number" />
              </Grid3>
              <div className="mt-[22px]"><UploadNote /></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                <DropBox title="Personal Photo" required /><DropBox title="Other Documents" />
              </div>
              <div className="flex justify-end gap-[16px] mt-[18px]">
                <Btn variant="outline" onClick={() => { setEntry(null); setLookup(EMPTY_LOOKUP); }}>Cancel</Btn>
                <Btn onClick={saveVisitor}>{entry.editingId ? 'Update Visitor' : 'Save Visitor'}</Btn>
              </div>
            </div>
          )}
        </div>
        <Rule />
        <SubHead>Visitors Added</SubHead>
        <VisitorsTable form={f} onEdit={editVisitor} onDelete={setDelVisitor} />
      </Section>

      <Section title="Payment Information">
        <RV label="Total Pass Amount"><Amount value={total} /></RV>
      </Section>

      <Agree checked={agree} onChange={setAgree} />
      {photo && (
        <div className="-mt-[8px]">
          <Agree checked={agreePhoto} onChange={setAgreePhoto}>
            I agree:
            <ul className="list-disc pl-[22px] mt-[2px]">
              <li>This photo shooting will be under the supervision of PCFC SD</li>
              <li>That photography should adhere to the restrictions indicated by prohibited signs. I understand that military and palace areas are off-limits for photography.</li>
            </ul>
          </Agree>
        </div>
      )}
      <FootActions left={<Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
        right={<><Btn variant="outline" onClick={() => onSaveDraft(f)}>Save as Draft</Btn><Btn onClick={() => onSubmit(f)}>Submit</Btn></>} />

      {oldOpen && <ApplyFromOldModal onClose={() => setOldOpen(false)} onFetch={r => { setF(p => ({ ...p, ...onFetchOld(r) })); setOldOpen(false); }} />}
      {confirmOpen && (
        <VisitorDetailsModal initial={lookup} onClose={() => setConfirmOpen(false)}
          onManual={l => openEntry('manual', l)} onConfirm={l => openEntry('confirmed', l)} />
      )}
      {delVisitor && (
        <ConfirmDelete what={`visitor ${delVisitor.firstName} ${delVisitor.lastName}`} onNo={() => setDelVisitor(null)}
          onYes={() => { setF(p => ({ ...p, visitors: p.visitors.filter(v => v.id !== delVisitor.id) })); setDelVisitor(null); }} />
      )}
    </PmPage>
  );
}

/* ══════════════ Draft Saved (Figma 1005:29549) ══════════════ */

export function DraftSavedPage({ draftNo, created, validTill, crumbs, onHome, onBackToPasses, onViewDrafts, onEdit }: {
  draftNo: string; created: string; validTill: string; crumbs: Crumb[]; onHome: () => void;
  onBackToPasses: () => void; onViewDrafts: () => void; onEdit: () => void;
}) {
  return (
    <PmPage crumbs={[...crumbs, { label: 'Apply New Pass' }]} onHome={onHome}>
      <ResultCard title="Draft Saved Successfully"
        message={<>Kindly note that you are saving the request and PCFC security will not receive this request until complete all information and submit.<br />The period for saving the request as draft is only 1 month, after that the draft version will be deleted automatic if not submitted.</>}
        rows={[['Draft Number', draftNo], ['Created Date', created], ['Valid Till', validTill]]}
        actions={<><Btn variant="outline" onClick={onBackToPasses}>Back to Passes</Btn><Btn onClick={onViewDrafts}>View All Drafts</Btn></>}
        link={{ label: 'Edit Pass', onClick: onEdit }} />
    </PmPage>
  );
}

/* ══════════════ Company View Request (Figma 1005:32557) + Pass Details popup (1289:23468) ══════════════ */

export type RequestVisitor = { passRefNo: string; port: string; passType: string; passDuration: string; name: string; visaType: string; dob: string; gender: string; company: string };

function PassDetailsModal({ pass, v, onClose }: { pass: PassDetail; v: RequestVisitor; onClose: () => void }) {
  const [first, ...rest] = v.name.split(' ');
  return (
    <Modal title="Pass Details" onClose={onClose} width={910}>
      <Grid3>
        <RV label="Application Number:" value={pass.applicationNo} /><RV label="Pass Reference Number:" value={v.passRefNo} /><RV label="Port:" value={v.port} />
        <RV label="Entry Gate:" value={pass.entryGate} /><RV label="Pass Type:" value={v.passType} /><RV label="Pass Duration:" value={v.passDuration} />
        <RV label="Purpose of Visit" value={pass.purpose} /><RV label="Date of Visit" value={pass.dateOfVisit} /><RV label="Total Amount:"><Amount value={pass.amount} /></RV>
        <RV label="Status:"><Tag status={pass.status} /></RV>
      </Grid3>
      <div className="mt-[22px]"><Grid3><RV label="Host Company Name" value={pass.hostCompany} /><RV label="Host Person Name" value="Person A" /></Grid3></div>
      <Rule />
      <SubHead>Visitor Information</SubHead>
      <Grid3>
        <RV label="Title" value="Mr" /><RV label="First Name" value={first} /><RV label="Last Name" value={rest.join(' ')} />
        <RV label="Nationality" value={VISITOR.nationality} /><RV label="Mobile" value={VISITOR.mobile} /><RV label="Email" value={`${v.name.toLowerCase().replace(/\s+/g, '.')}@example.com`} />
        <RV label="Date of Birth" value={v.dob} /><RV label="Designation" value={VISITOR.designation} /><RV label="Visa Type" value={v.visaType} />
        <RV label="Company Name" value={v.company} /><RV label="Vehicle Number" value={VISITOR.vehicleNo} /><RV label="Driving License Number" value={VISITOR.drivingLicense} />
      </Grid3>
      <div className="mt-[24px]"><BlockHead>Document Details</BlockHead></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]"><DocCard title="Personal Photo" required file="filename.png" /></div>
    </Modal>
  );
}

export function CompanyRequestPage({ pass, visitors, created, crumbs, onHome, onBack, onPrintReceipt }: {
  pass: PassDetail; visitors: RequestVisitor[]; created: string; crumbs: Crumb[]; onHome: () => void; onBack: () => void; onPrintReceipt: () => void;
}) {
  const [open, setOpen] = useState<RequestVisitor | null>(null);
  const heads = ['Pass Reference No', 'Port', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Date of Birth', 'Gender', 'Company Name', 'Action'];
  return (
    <PmPage crumbs={[...crumbs, { label: 'View Request' }]} onHome={onHome}>
      <Section title="Request Details" right={<div className="flex items-center gap-[8px]"><span className="text-[14px]" style={{ color: C.text }}>Status:</span><Tag status={pass.status} big /></div>}>
        <Grid3><RV label="Application Number:" value={pass.applicationNo} /><RV label="Creation Date:" value={created} /></Grid3>
      </Section>
      <Section title="Pass Information">
        <SubHead>Visitors Added</SubHead>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-separate" style={{ borderSpacing: 0 }}>
            <thead><tr style={{ background: C.bar }}>
              {heads.map(h => <th key={h} scope="col" className="h-[36px] px-[10px] text-left text-[13px] font-normal uppercase whitespace-nowrap" style={{ color: C.sub }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={v.passRefNo + i} style={{ background: i % 2 === 0 ? C.zebra : '#fff' }}>
                  {[v.passRefNo, v.port, v.passType, v.passDuration, v.name, v.visaType, v.dob, v.gender, v.company].map((c, k) => (
                    <td key={k} className="h-[50px] px-[10px] text-[15px] whitespace-nowrap" style={{ color: C.text }}>{c}</td>
                  ))}
                  <td className="px-[10px]">
                    <GreyIconBtn label={`Open pass details for ${v.name}`} onClick={() => setOpen(v)}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </GreyIconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Payment Information"><RV label="Total Pass Amount"><Amount value={pass.amount} /></RV></Section>
      <FootActions left={<Btn variant="outline" onClick={onBack}>Back</Btn>} right={<Btn onClick={onPrintReceipt}>Print Receipt</Btn>} />
      {open && <PassDetailsModal pass={pass} v={open} onClose={() => setOpen(null)} />}
    </PmPage>
  );
}

/* ══════════════ Company Gate Passes listing + Search Filters (Figma 1248:43213) ══════════════ */

type Filters = Record<'ref' | 'status' | 'passType' | 'duration' | 'date' | 'port' | 'first' | 'last' | 'nationality' | 'by' | 'subuser' | 'passport', string>;
const NO_FILTERS: Filters = { ref: '', status: '', passType: '', duration: '', date: '', port: '', first: '', last: '', nationality: '', by: '', subuser: '', passport: '' };

function SearchFilters({ onClose, onApply }: { onClose: () => void; onApply: (pred: ((r: PassRow) => boolean) | null) => void }) {
  const [v, setV] = useState<Filters>(NO_FILTERS);
  const set = (k: keyof Filters) => (x: string) => setV(p => ({ ...p, [k]: x }));
  const search = () => onApply(r =>
    (!v.ref || r.passRefNo.includes(v.ref.trim())) && (!v.status || r.status === v.status) && (!v.passType || r.passType === v.passType)
    && (!v.duration || r.passDuration === v.duration) && (!v.port || r.portName.includes(v.port))
    && (!v.first || r.visitorName.toLowerCase().startsWith(v.first.toLowerCase()))
    && (!v.last || r.visitorName.toLowerCase().split(' ').slice(1).join(' ').startsWith(v.last.toLowerCase())));
  return (
    <div className="rounded-[2px] px-[20px] pt-[18px] pb-[20px] mb-[20px]" style={{ background: '#fafbfe', border: '1px solid #dfe5f2' }}>
      <div className="flex items-center justify-between mb-[14px]">
        <p className="text-[14px] font-medium uppercase" style={{ color: C.navy }}>Search Filters</p>
        <button onClick={onClose} aria-label="Close search filters" className="hover:opacity-60"><img src={closeSrc} alt="" width={24} height={24} /></button>
      </div>
      <Grid3>
        <FText label="Pass Reference Number" value={v.ref} onChange={set('ref')} placeholder="Enter pass reference number" />
        <FSelect label="Status" value={v.status} options={STATUSES} onChange={set('status')} />
        <FSelect label="Pass Type" value={v.passType} options={['Permanent', 'Temporary']} onChange={set('passType')} />
        <FSelect label="Pass Duration" value={v.duration} options={DURATIONS} onChange={set('duration')} />
        <FDate label="Date of Visit" value={v.date} onChange={set('date')} />
        <FSelect label="Port" value={v.port} options={PORTS} onChange={set('port')} />
        <FText label="Visitor First Name" value={v.first} onChange={set('first')} placeholder="Enter visitor first name" />
        <FText label="Visitor Last Name" value={v.last} onChange={set('last')} placeholder="Enter visitor last name" />
        <FSelect label="Visitor Nationality" value={v.nationality} options={NATIONALITIES} onChange={set('nationality')} />
        <FSelect label="Passes Generated By" value={v.by} options={['Me', 'All Users']} onChange={set('by')} />
        <FSelect label="Host Company Subusers" value={v.subuser} options={['John Doe', 'Person A', 'Person B']} onChange={set('subuser')} />
        <FText label="Passport" value={v.passport} onChange={set('passport')} placeholder="Enter passport number" />
        {/* Reset / Search ride in the field grid, after the last field */}
        <div className="md:col-span-2 lg:col-span-3 flex justify-end items-center gap-[20px]">
          <ResetLink onClick={() => { setV(NO_FILTERS); onApply(null); }} />
          <Btn onClick={search}>Search</Btn>
        </div>
      </Grid3>
    </div>
  );
}

export function CompanyListingPage({ rows, onHome, onApply, onAction }: {
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
      <PmListCard title="Gate Passes" rows={rows} cols={cols} rowKey={r => r.passRefNo}
        search={r => `${r.passRefNo} ${r.applicationNo}`} searchPlaceholder="Search with pass reference number or application number"
        advancedPanel={({ close, apply }) => <SearchFilters onClose={close} onApply={apply} />}
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
      {menu && <ActionFlyout anchor={menu.rect} onClose={() => setMenu(null)} onPick={a => { const r = menu.row; setMenu(null); onAction(a, r); }} />}
    </PmPage>
  );
}
