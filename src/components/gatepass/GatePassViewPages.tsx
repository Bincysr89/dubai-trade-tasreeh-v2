import { useState } from 'react';
import {
  font, GatePage, GSection, GSubHead, Grid4, GValue, GAmount, GTag, toneFor, GFileChip, Divider,
  GTextArea, GAgree, IconBtn, PrimaryBtn, SecondaryBtn, GUploader, UploadGrid,
} from './GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { DhAmount } from '../Dh';
import { PASS_FEE, REISSUE_FEE, shortRef, fromIso, visitorFromRow, type GateRow, type Visitor } from './gatePassData';

/* Listing "Successful" reads as "Completed" once the pass is issued. */
const displayStatus = (r: GateRow) => (r.status === 'Successful' ? 'Completed' : r.status);

export const StatusRight = ({ row }: { row: GateRow }) => (
  <div className="flex items-center gap-[8px]">
    <span className="text-[14px] text-[#1a1a1a]" style={{ fontFamily: font }}>Status:</span>
    <GTag label={displayStatus(row)} tone={toneFor(displayStatus(row))} />
  </div>
);

/* ── Field blocks — composed into one card (PassFields) or one card per section (Host Company pages) ── */
export function PassInfoFields({ row }: { row: GateRow }) {
  return (
    <Grid4>
      <GValue label="Application Number:" value={row.applicationNo} />
      <GValue label="Pass Reference Number:" value={row.passRefNo} />
      {row.accessType && <GValue label="Access Type:" value={row.accessType} />}
      <GValue label="Port:" value={row.portName} />
      <GValue label="Entry Gate:" value={row.entryGate} />
      <GValue label="Pass Type:" value={row.passType} />
      <GValue label="Pass Duration:" value={row.passDuration} />
      <GValue label="Purpose of Visit" value={row.purpose} />
      <GValue label="Date of Visit" value={row.dateOfVisit} />
      <GValue label="Total Amount:"><GAmount value={PASS_FEE} /></GValue>
      <GValue label="Host Company Name" value={row.hostCompany} />
      {row.visitorCompany && <GValue label="Visitor Company" value={row.visitorCompany} />}
    </Grid4>
  );
}

export function VisitorInfoFields({ row, visitor }: { row: GateRow; visitor?: Visitor }) {
  const v = visitor ?? visitorFromRow(row);
  return (
    <Grid4>
      <GValue label="Title" value={v.title} />
      <GValue label="First Name" value={v.firstName} />
      <GValue label="Last Name" value={v.lastName} />
      <GValue label="Nationality" value={row.nationality} />
      <GValue label="Mobile" value={row.mobile} />
      <GValue label="Email" value={row.email} />
      <GValue label="Date of Birth" value={fromIso(v.dob) || row.dob} />
      <GValue label="Designation" value={row.designation} />
      <GValue label="Visa Type" value={v.visaType} />
      <GValue label="Emirates ID Expiry Date" value={row.eidExpiry} />
      <GValue label="Visa Expiry Date" value={row.visaExpiry} />
      <GValue label="Company Name" value={v.companyName} />
      <GValue label="Vehicle Number" value={v.vehicleNo} />
      <GValue label="Driving License Number" value={row.drivingLicense} />
    </Grid4>
  );
}

export const DocumentFields = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
    <GFileChip label="Personal Photo" file="filename.png" />
  </div>
);

/* ── Pass + visitor fields in one card (View Pass — Figma 9502:102589 — and Report Lost Pass) ── */
export function PassFields({ row, visitor }: { row: GateRow; visitor?: Visitor }) {
  return (
    <>
      <PassInfoFields row={row} />
      <Divider />
      <GSubHead>Visitor Information</GSubHead>
      <VisitorInfoFields row={row} visitor={visitor} />
      <Divider />
      <GSubHead>Document Details</GSubHead>
      <DocumentFields />
    </>
  );
}

/* Payment history (Figma 9502:102589) */
const PAYMENTS = [
  { date: '21-Sep-2023 11:30 PM', service: 'Apply Pass',  invoice: '1234567890', receipt: '--',         ref: '--',         amount: '256.00' },
  { date: '21-Sep-2023 11:30 PM', service: 'Apply Pass',  invoice: '9876543211', receipt: '9876543211', ref: '9876543211', amount: '256.00' },
  { date: '21-Sep-2023 11:30 PM', service: 'Return Pass', invoice: '1234567890', receipt: '1234567890', ref: '1234567890', amount: '156.00' },
];

/* ── View Pass — opened from a visitor row's action (Figma 9502:102589) ── */
export function GatePassPassPage({ row, visitor, onHome, onBack, onReuse, onPrint }: {
  row: GateRow; visitor?: Visitor; onHome: () => void; onBack: () => void; onReuse: () => void; onPrint: () => void;
}) {
  return (
    <GatePage
      title={`View Pass - ${shortRef(row)}`}
      onHome={onHome}
      onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}
      footerRight={<>
        <SecondaryBtn onClick={onReuse}>Reuse this Pass Details</SecondaryBtn>
        <PrimaryBtn onClick={onPrint}>Print Pass</PrimaryBtn>
      </>}
    >
      <GSection title="Pass Information" right={<StatusRight row={row} />}>
        <PassFields row={row} visitor={visitor} />
      </GSection>

      <GSection title="Payment Information">
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={1000}>
            <JourneyThead columns={[
              { label: 'Issued/Payment Date' }, { label: 'Service' }, { label: 'Invoice No.' }, { label: 'Receipt No.' },
              { label: 'Payment Reference No.' }, { label: 'Amount' }, { label: 'Action', w: 90, filter: false, sticky: true },
            ]} />
            <tbody>
              {PAYMENTS.map((p, i) => (
                <tr key={i}>
                  <JourneyTd first>{p.date}</JourneyTd>
                  <JourneyTd>{p.service}</JourneyTd>
                  <JourneyTd>{p.invoice}</JourneyTd>
                  <JourneyTd>{p.receipt}</JourneyTd>
                  <JourneyTd>{p.ref}</JourneyTd>
                  <JourneyTd>
                    <DhAmount value={p.amount} className="text-[16px] font-bold text-[#051937]" style={{ fontFamily: font }} />
                  </JourneyTd>
                  <JourneyTd sticky width={90}>
                    <button type="button" aria-label={`Download receipt ${p.invoice}`}
                      className="size-[34px] rounded-[4px] inline-flex items-center justify-center hover:opacity-80"
                      style={{ background: '#e2ebf9', color: '#1360d2' }}>
                      <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
                      </svg>
                    </button>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>
    </GatePage>
  );
}

/* ── View Pass (Figma 1005:32557) ── */
export function GatePassViewPage({ row, visitors, onHome, onBackToListing, onPrint, onOpenPass }: {
  row: GateRow; visitors?: Visitor[]; onHome: () => void; onBackToListing: () => void; onPrint: () => void;
  onOpenPass: (visitor: Visitor) => void;
}) {
  const list = visitors && visitors.length ? visitors : [visitorFromRow(row)];
  const cols = ['Pass Reference No', 'Port', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Date of Birth', 'Gender', 'Company Name'];

  return (
    <GatePage
      title={`View Request - ${shortRef(row)}`}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back</SecondaryBtn>}
      footerRight={<PrimaryBtn onClick={onPrint}>Print Receipt</PrimaryBtn>}
    >
      <GSection title="Request Details">
        <Grid4>
          <GValue label="Application Number:" value={row.applicationNo} />
          <GValue label="Creation Date:" value={row.submittedDate} />
          <GValue label="Status:">
            <span><GTag label={displayStatus(row)} tone={toneFor(displayStatus(row))} /></span>
          </GValue>
        </Grid4>
      </GSection>

      <GSection title="Pass Information">
        <GSubHead>Visitors Added</GSubHead>
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={1150}>
            <JourneyThead columns={[...cols.map(label => ({ label })), { label: 'Action', w: 90, filter: false, sticky: true }]} />
            <tbody>
              {list.map((v, i) => {
                const name = `${v.firstName} ${v.lastName}`;
                const cells = [
                  i === 0 ? row.passRefNo : `GP-${Number(row.passRefNo.replace(/\D/g, '') || 0) + i}`,
                  row.portName, row.passType, row.passDuration, name, v.visaType, fromIso(v.dob) || row.dob,
                  v.gender || '-', v.companyName || '-',
                ];
                return (
                  <tr key={v.id}>
                    {cells.map((c, ci) => <JourneyTd key={ci} first={ci === 0}>{c}</JourneyTd>)}
                    <JourneyTd sticky width={90}>
                      <IconBtn kind="open" label={`Pass details for ${name}`} onClick={() => onOpenPass(v)} />
                    </JourneyTd>
                  </tr>
                );
              })}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>

      <GSection title="Payment Information">
        <GValue label="Total Pass Amount"><GAmount value={PASS_FEE} /></GValue>
      </GSection>

    </GatePage>
  );
}

/* ── Report Lost Pass (Figma 4:31110, re-laid out in the portal card theme) ── */
export function GatePassReportLostPage({ row, onHome, onBackToListing, onSubmit }: {
  row: GateRow; onHome: () => void; onBackToListing: () => void; onSubmit: () => void;
}) {
  const [remarks, setRemarks] = useState('');
  const [agree, setAgree] = useState(false);
  /* No blocking validation — Submit always moves forward. */
  const submit = onSubmit;

  return (
    <GatePage
      title={`Report Lost Pass - ${shortRef(row)}`}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
      footerRight={<PrimaryBtn onClick={submit}>Submit</PrimaryBtn>}
    >
      <GSection title="Pass Information" right={<StatusRight row={row} />}>
        <PassFields row={row} />
      </GSection>

      <GSection title="Payment Information">
        <Grid4>
          <GValue label="Payment Method" value="ROSOOM" />
          <GValue label="Total Pass Amount">
            <DhAmount value={PASS_FEE} className="text-[16px] text-[#1a1a1a]" style={{ fontFamily: font }} />
          </GValue>
          <GValue label="Reissuing Fee"><GAmount value={REISSUE_FEE} /></GValue>
        </Grid4>
      </GSection>

      <GSection title="Lost Pass Information">
        <div className="lg:w-1/2 mb-[24px]">
          <GTextArea label="Remarks" value={remarks} onChange={setRemarks} required />
        </div>
        <UploadGrid>
          <GUploader title="Police Report & Other Document" required />
        </UploadGrid>
      </GSection>

      <GAgree checked={agree} onChange={setAgree} />
    </GatePage>
  );
}
