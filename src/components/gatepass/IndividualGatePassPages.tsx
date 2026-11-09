import { useState } from 'react';
import {
  font, GatePage, GSection, Grid4, GInput, GSelect, GDate, GValue, GAmount, GTag, GAgree, GFileChip,
  GUploader, UploadGrid, PrimaryBtn, SecondaryBtn, NeedHelp,
} from './GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { Dialog } from './GatePassModals';
import type { ListingVariant } from './GatePassListingPage';
import {
  PORTS, ZONES, ZONE_PORTS, ENTRY_GATES, ANY_GATE, PASS_TYPES, PASS_DURATIONS, PURPOSES, VISA_TYPES,
  PASS_FEE, GATE_PASS_TITLE, INDIVIDUAL_PROFILE, INDIVIDUAL_ACTIONS, AMEND_ACTION, DRAFT_MENU, AMEND_HISTORY,
  perPassAmount, money, fromIso, toIso, individualVisitor, shortRef,
  type GatePassForm, type GateRow,
} from './gatePassData';

/* ──────────────────────────────────────────────────────────────
   Individual persona (UAE PASS basic account) — Tasreeh-Dev Figma
   972:33001 apply form · 972:35792 return for amendment.
   Same template/components as the Visitor Company flow, one card
   per section; only the content comes from Figma.
   ────────────────────────────────────────────────────────────── */

/* ── Listing (Figma 972:34908) + My Drafts (Figma 1087:16926) ── */
export const INDIVIDUAL_VARIANT: ListingVariant = {
  title: GATE_PASS_TITLE,
  columns: [
    { key: 'passRefNo',     label: 'Pass Reference No.', w: 185 },
    { key: 'portName',      label: 'Port Name',          w: 170 },
    { key: 'passType',      label: 'Pass Type',          w: 150 },
    { key: 'passDuration',  label: 'Pass Duration',      w: 150 },
    { key: 'visitorName',   label: 'Visitor Name',       w: 175 },
    { key: 'approver',      label: 'Approver',           w: 150 },
    { key: 'applicationNo', label: 'Application No.',    w: 170 },
    { key: 'dateOfVisit',   label: 'Date of Visit',      w: 150 },
    { key: 'entryGate',     label: 'Entry Gate',         w: 130 },
    { key: 'submittedDate', label: 'Submitted Date',     w: 160 },
  ],
  defaultVisible: ['passRefNo', 'portName', 'passType', 'passDuration', 'visitorName', 'approver'],
  actions: INDIVIDUAL_ACTIONS,
  rowActions: row => (row.status === 'Returned' ? [AMEND_ACTION, ...INDIVIDUAL_ACTIONS] : INDIVIDUAL_ACTIONS),
  statuses: ['Pending', 'Approved', 'Rejected', 'Returned', 'Draft', 'Expired'],
  createLabel: 'Apply New Pass',
  searchFields: ['Pass Reference No.', 'Application No.', 'Visitor Name'],
  draftColumns: [
    { key: 'applicationNo', label: 'Reference ID', w: 200 },
    { key: 'serviceType',   label: 'Service Type', w: 260 },
    { key: 'submittedDate', label: 'Created On',   w: 180 },
    { key: 'expiresOn',     label: 'Expires On',   w: 180 },
  ],
  draftActions: DRAFT_MENU,
};

const P = INDIVIDUAL_PROFILE;

/* Visitor block — prefilled from the UAE PASS profile, only the vehicle number is editable */
function ProfileVisitorFields({ vehicleNo, onVehicle }: { vehicleNo: string; onVehicle: (v: string) => void }) {
  return (
    <Grid4>
      <GInput label="Title" value={P.title} readOnly />
      <GInput label="First Name" value={P.firstName} readOnly />
      <GInput label="Last Name" value={P.lastName} readOnly />
      <GInput label="Email" value={P.email} readOnly />
      <GInput label="Mobile" value={P.mobile} readOnly />
      <GInput label="Designation" value={P.designation} readOnly />
      <GInput label="Visa Type" value={P.visaType} readOnly />
      <GInput label="Gender" value={P.gender} readOnly />
      <GInput label="Date of Birth" value={fromIso(P.dob)} readOnly />
      <GInput label="Emirates ID" value={P.emiratesId} readOnly />
      <GInput label="Emirates ID Expiry Date" value={P.eidExpiry} readOnly />
      <GInput label="Passport Number" value={P.passportNo} readOnly />
      <GInput label="Passport Expiry Date" value={P.passportExpiry} readOnly />
      <GInput label="Visa Number" value={P.visaNo} readOnly />
      <GInput label="Visa Expiry Date" value={P.visaExpiry} readOnly />
      <GInput label="Nationality" value={P.nationality} readOnly />
      <GInput label="Vehicle Number" value={vehicleNo} onChange={onVehicle} placeholder="Enter Vehicle Number" />
    </Grid4>
  );
}

const DocNote = () => (
  <p className="flex items-center gap-[8px] text-[14px] text-[#3f4d66] mb-[16px]" style={{ fontFamily: font }}>
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#3f4d66" strokeWidth="1.6">
      <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6.2v.01" strokeLinecap="round" />
    </svg>
    NOTE: Upload Document only of File Type (png/jpg/gif/pdf) and maximum allowed file size is 2MB for each document
  </p>
);

/* ── Apply New Pass (Figma 972:33001) ── */
export function IndividualPassFormPage({ title, initial, onHome, onBackToListing, onSubmit, onSaveDraft }: {
  title: string; initial: GatePassForm;
  onHome: () => void; onBackToListing: () => void;
  onSubmit: (f: GatePassForm) => void; onSaveDraft: (f: GatePassForm) => void;
}) {
  const [f, setF] = useState<GatePassForm>(() => ({
    ...initial,
    visitors: [{ ...individualVisitor(), vehicleNo: initial.visitors[0]?.vehicleNo ?? '' }],
  }));
  const [agree, setAgree] = useState(true);
  const set = <K extends keyof GatePassForm>(k: K) => (v: GatePassForm[K]) => setF(p => ({ ...p, [k]: v }));
  const isZone = f.category === 'zone';
  const listedPorts = f.zone ? ZONE_PORTS[f.zone] ?? [] : [];
  const amount = perPassAmount(f.passType, f.passDuration);
  const vehicleNo = f.visitors[0]?.vehicleNo ?? '';
  const setVehicle = (v: string) => setF(p => ({ ...p, visitors: [{ ...p.visitors[0], vehicleNo: v }] }));

  return (
    <GatePage
      title={title}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Cancel</SecondaryBtn>}
      footerRight={<>
        <SecondaryBtn onClick={() => onSaveDraft(f)}>Save as Draft</SecondaryBtn>
        <PrimaryBtn onClick={() => onSubmit(f)}>Submit</PrimaryBtn>
      </>}
    >
      <GSection title="Pass Information">
        <Grid4>
          {isZone ? (
            <div className="flex flex-col gap-[6px] min-w-0">
              <GSelect label="Zone" value={f.zone} options={ZONES} onChange={set('zone')} required />
              {listedPorts.length > 0 && (
                <p className="text-[14px] px-[10px] py-[5px] rounded-[4px] bg-[#eef1f7] text-[#5a6478]" style={{ fontFamily: font }}>
                  Listed Ports: <span className="text-[#0e1b3d] font-medium">{listedPorts.join(', ')}</span>
                </p>
              )}
            </div>
          ) : (
            <GSelect label="Port Name" value={f.portName} options={PORTS} onChange={set('portName')} required />
          )}
          <GSelect label="Pass Type" value={f.passType} options={PASS_TYPES} onChange={set('passType')} required />
          {isZone
            ? <GSelect label="Entry Gate" value={ANY_GATE} options={[ANY_GATE]} onChange={() => {}} required disabled />
            : <GSelect label="Entry Gate" value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} required />}
          <GSelect label="Pass Duration" value={f.passDuration} options={PASS_DURATIONS} onChange={set('passDuration')} required />
          <GSelect label="Purpose of Visit" value={f.purpose} options={PURPOSES} onChange={set('purpose')} required />
          <GDate label="Date of Visit" value={f.dateOfVisit} onChange={set('dateOfVisit')} required />
          <GInput label="Host Company Name" value={f.hostCompany} onChange={set('hostCompany')} placeholder="Enter Host Company Name" required />
        </Grid4>
      </GSection>

      <GSection title="Visitor Information">
        <ProfileVisitorFields vehicleNo={vehicleNo} onVehicle={setVehicle} />
      </GSection>

      <GSection title="Document Details">
        <DocNote />
        <UploadGrid>
          <GUploader title="Personal Photo" required />
          <GUploader title="Other Documents" />
        </UploadGrid>
      </GSection>

      <GSection title="Payment Information">
        <Grid4>
          <GValue label="Total Pass Amount"><GAmount value={amount > 0 ? money(amount) : PASS_FEE} /></GValue>
        </Grid4>
      </GSection>

      <GAgree checked={agree} onChange={setAgree} />
    </GatePage>
  );
}

/* ── Return Pass for Amendment (Figma 972:35792) ── */
export function AmendPassPage({ row, onHome, onBack, onSubmit }: {
  row: GateRow; onHome: () => void; onBack: () => void; onSubmit: () => void;
}) {
  const [entryGate, setEntryGate] = useState(row.entryGate);
  const [passType, setPassType] = useState(row.passType);
  const [duration, setDuration] = useState(row.passDuration);
  const [purpose, setPurpose] = useState(row.purpose);
  const [dateOfVisit, setDateOfVisit] = useState(toIso(row.dateOfVisit));
  const [hostCompany, setHostCompany] = useState(row.hostCompany);
  const [dob, setDob] = useState(P.dob);
  const [visaType, setVisaType] = useState(P.visaType);
  const [vehicleNo, setVehicleNo] = useState(row.vehicleNo);
  const [docs, setDocs] = useState(['Personal Photo', 'Passport']);
  const [agree, setAgree] = useState(true);

  return (
    <GatePage
      title={`Return Pass for Amendment - ${shortRef(row)}`}
      onHome={onHome}
      onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}
      footerRight={<PrimaryBtn onClick={onSubmit}>Submit</PrimaryBtn>}
    >
      <GSection title="Pass Information" right={<GTag label="Returned" tone="blue" />}>
        <Grid4>
          <GValue label="Pass Reference Number:" value={row.passRefNo} />
          <GValue label="Port:" value={row.portName} />
          <GSelect label="Entry Gate" value={entryGate} options={ENTRY_GATES} onChange={setEntryGate} required />
          <GSelect label="Pass Type" value={passType} options={PASS_TYPES} onChange={setPassType} required />
          <GSelect label="Pass Duration" value={duration} options={PASS_DURATIONS} onChange={setDuration} required />
          <GSelect label="Purpose of Visit" value={purpose} options={PURPOSES} onChange={setPurpose} required />
          <GDate label="Date of Visit" value={dateOfVisit} onChange={setDateOfVisit} required />
          <GInput label="Host Company Name" value={hostCompany} onChange={setHostCompany} required />
        </Grid4>
      </GSection>

      <GSection title="Visitor Information">
        <Grid4>
          <GValue label="Title" value={P.title} />
          <GValue label="First Name" value={P.firstName} />
          <GValue label="Last Name" value={P.lastName} />
          <GValue label="Nationality" value={P.nationality} />
          <GValue label="Mobile" value={P.mobile} />
          <GValue label="Email" value={P.email} />
          <GDate label="Date of Birth" value={dob} onChange={setDob} />
          <GValue label="Designation" value={P.designation} />
          <GSelect label="Visa Type" value={visaType} options={VISA_TYPES} onChange={setVisaType} />
          <GValue label="Company Name" value={P.companyName} />
          <GInput label="Vehicle Number" value={vehicleNo} onChange={setVehicleNo} placeholder="Enter" />
          <GValue label="Driving License Number" value={P.drivingLicense} />
        </Grid4>
      </GSection>

      <GSection title="Document Details">
        <DocNote />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {docs.map(d => (
            <div key={d} className="relative">
              <GFileChip label={d} file="filename.png" />
              <button type="button" onClick={() => setDocs(p => p.filter(x => x !== d))}
                className="absolute right-[16px] top-1/2 -translate-y-1/2 flex items-center gap-[4px] text-[14px] text-[#dc3545] underline hover:opacity-80"
                style={{ fontFamily: font }}>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Delete
              </button>
            </div>
          ))}
          {docs.length < 2 && <GUploader title={['Personal Photo', 'Passport'].find(x => !docs.includes(x))!} required />}
        </div>
      </GSection>

      <GSection title="Payment Information">
        <Grid4>
          <GValue label="Payment Method" value="ROSOOM" />
          <GValue label="Total Pass Amount"><GAmount value={PASS_FEE} /></GValue>
        </Grid4>
      </GSection>

      <GSection title="Approval History Details">
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={900}>
            <JourneyThead columns={[{ label: 'Date' }, { label: 'Status' }, { label: 'By' }, { label: 'Reason' }]} />
            <tbody>
              {AMEND_HISTORY.map((h, i) => (
                <tr key={i}>
                  <JourneyTd first>{h.date}</JourneyTd>
                  <JourneyTd><GTag label={h.status} tone="blue" /></JourneyTd>
                  <JourneyTd>{h.by}</JourneyTd>
                  <JourneyTd>{h.reason}</JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>

      <GAgree checked={agree} onChange={setAgree} />
    </GatePage>
  );
}

/* Drafts → Delete (confirm every delete) */
export function DeleteDraftModal({ draftNo, onClose, onConfirm }: { draftNo: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Dialog onClose={onClose} width={520}>
      <div className="px-[28px] pt-[32px] pb-[24px] flex flex-col items-center text-center gap-[12px]">
        <span className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#fdecee' }}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#dc3545" strokeWidth="1.8">
            <path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-[22px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Delete Draft</h3>
        <p className="text-[16px] text-[#3f4d66]" style={{ fontFamily: font }}>
          Are you sure you want to delete draft <b>{draftNo}</b>? This cannot be undone.
        </p>
      </div>
      <div className="flex justify-center gap-[16px] px-[24px] pb-[28px]">
        <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
        <button onClick={onConfirm}
          className="h-[48px] px-[26px] rounded-[4px] text-[16px] text-white hover:opacity-90"
          style={{ background: '#dc3545', fontFamily: font, fontWeight: 500 }}>
          Delete
        </button>
      </div>
    </Dialog>
  );
}
