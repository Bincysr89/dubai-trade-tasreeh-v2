import { useMemo, useRef, useState } from 'react';
import {
  font, GatePage, GSection, GSubHead, Grid4, Divider, GInput, GSelect, GDate, GRadioCards, GYesNo,
  GMultiSelect, GAmountField, GAmount, GValue, GAgree, GBanner, ResetBtn, IconBtn, GUploader, UploadGrid,
  PrimaryBtn, SecondaryBtn, NeedHelp,
} from './GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { VisitorConfirmModal } from './GatePassModals';
import {
  PORTS, ZONES, ZONE_PORTS, ENTRY_GATES, ANY_GATE, PASS_TYPES, PASS_DURATIONS, PURPOSES, FACILITY_AREAS,
  SHOOTING_METHODS, VISA_TYPES, GENDERS, TITLES, PHOTOGRAPHY, MAINTENANCE, EMPTY_FORM,
  perPassAmount, money, fromIso, lookupVisitor,
  type GatePassForm, type Visitor, type PassCategory,
} from './gatePassData';

type Props = {
  /** "Tasreeh - Gate Pass" for new passes, "Renew Request - 121324" when renewing. */
  title: string;
  initial?: GatePassForm;
  /** Show the PAYMENT FAILED banner (Figma 1248:67726). */
  paymentFailed?: boolean;
  onHome: () => void;
  onBackToListing: () => void;
  onSubmit: (form: GatePassForm) => void;
  onSaveDraft: (form: GatePassForm) => void;
};

type Entry = Omit<Visitor, 'id'>;
const EMPTY_ENTRY: Entry = {
  visaType: 'Resident', emiratesId: '', dob: '', gender: '',
  title: '', firstName: '', lastName: '', companyName: '', companyAddress: '', vehicleNo: '',
};

/* Photography / Video supporting documents (Figma 1248:65114) */
const PHOTO_DOCS = [
  'Crew Passport Copies with Visa',
  'Studio/Shooting Company Trade License',
  'NOC from Civil Aviation (Arial shooting)',
  'NOC from Police Air Wing (Arial Shooting)',
  'NOC from Dubai Film and TV Commission (Dubai Studio City)',
];

export default function GatePassFormPage({
  title, initial, paymentFailed, onHome, onBackToListing, onSubmit, onSaveDraft,
}: Props) {
  const [f, setF] = useState<GatePassForm>(initial ?? EMPTY_FORM);
  const set = <K extends keyof GatePassForm>(k: K) => (v: GatePassForm[K]) => setF(p => ({ ...p, [k]: v }));

  /* Visitor entry (search → confirm → details → save) */
  const [entry, setEntry] = useState<Entry>(EMPTY_ENTRY);
  const [stage, setStage] = useState<'search' | 'details'>('search');
  const [manual, setManual] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const docsKey = useRef(0);
  const setE = (k: keyof Entry) => (v: string) => setEntry(p => ({ ...p, [k]: v }));

  const [agree, setAgree] = useState(false);
  const [agreePhoto, setAgreePhoto] = useState(false);

  const isZone = f.category === 'zone';
  const isPhoto = f.passType === PHOTOGRAPHY;
  const isMaint = f.passType === MAINTENANCE;
  const listedPorts = f.zone ? ZONE_PORTS[f.zone] ?? [] : [];
  const perPass = perPassAmount(f.passType, f.passDuration);
  const total = perPass * f.visitors.length;

  const visitorDocs = useMemo(() => [
    { label: 'Personal Photo', required: true },
    { label: 'Other Documents', required: false },
    ...(isMaint && f.facilityAccess === 'Yes'
      ? [1, 2, 3, 4].map(n => ({ label: `Facility Area Support Documents ${n}`, required: n === 1 }))
      : []),
  ], [isMaint, f.facilityAccess]);

  const switchCategory = (c: string) => setF(p => ({
    ...p, category: c as PassCategory,
    portName: '', zone: '', entryGate: c === 'zone' ? ANY_GATE : '',
  }));

  /* ── Visitor entry actions ── */
  const search = () => {
    setConfirmOpen(true);
  };
  const confirmFound = () => {
    setEntry(p => ({ ...p, ...lookupVisitor(p.gender) }));
    setManual(false); setStage('details'); setConfirmOpen(false);
  };
  const enterManually = () => {
    setEntry(p => ({ ...p, title: '', firstName: '', lastName: '' }));
    setManual(true); setStage('details'); setConfirmOpen(false);
  };
  const clearEntry = () => {
    setEntry(EMPTY_ENTRY); setStage('search'); setManual(false); setEditingId(null);
    docsKey.current += 1;
  };
  const saveVisitor = () => {
    setF(p => {
      const v: Visitor = { ...entry, id: editingId ?? `v-${Date.now()}` };
      const visitors = editingId ? p.visitors.map(x => (x.id === editingId ? v : x)) : [...p.visitors, v];
      return { ...p, visitors };
    });
    clearEntry();
  };
  const editVisitor = (v: Visitor) => {
    const { id, ...rest } = v;
    setEntry(rest); setEditingId(id); setStage('details'); setManual(true);
    docsKey.current += 1;
  };
  const removeVisitor = (id: string) => {
    setF(p => ({ ...p, visitors: p.visitors.filter(v => v.id !== id) }));
    if (editingId === id) clearEntry();
  };

  /* ── Equipment rows (Tools & Equipments) ── */
  const setEquip = (id: string, k: 'name' | 'qty', v: string) =>
    setF(p => ({ ...p, equipment: p.equipment.map(e => (e.id === id ? { ...e, [k]: v } : e)) }));
  const addEquip = () => setF(p => ({ ...p, equipment: [...p.equipment, { id: `eq-${Date.now()}`, name: '', qty: '' }] }));
  const delEquip = (id: string) => setF(p => ({
    ...p, equipment: p.equipment.length > 1 ? p.equipment.filter(e => e.id !== id) : [{ id: 'eq-0', name: '', qty: '' }],
  }));

  /* ── Submit ── */
  /* No blocking validation — the prototype always moves forward. */
  const submit = () => onSubmit(f);

  const columns = isZone
    ? ['Zone', 'Ports', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Gender', 'Company Name']
    : ['Port', 'Pass Type', 'Pass Duration', 'Visitor Name', 'Visa Type', 'Date of Birth', 'Gender', 'Company Name'];

  return (
    <GatePage
      title={title}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Cancel</SecondaryBtn>}
      footerRight={
        <>
          <SecondaryBtn onClick={() => onSaveDraft(f)}>Save as Draft</SecondaryBtn>
          <PrimaryBtn onClick={submit}>Submit</PrimaryBtn>
        </>
      }
    >
      {paymentFailed && <GBanner title="Payment Failed" message="Your payment could not be processed. Please review the details and submit again." />}

      {/* ── Pass Access Category ── */}
      <GSection title="Pass Access Category">
        <GRadioCards
          name="pass-category"
          value={f.category}
          onChange={switchCategory}
          options={[
            { value: 'port', label: 'Port Access', sub: 'You can only choose one port per request' },
            { value: 'zone', label: 'Zone Access', sub: 'You can only choose zones(predefined group of ports) per request' },
          ]}
        />
      </GSection>

      {/* ── Pass Information ── */}
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
          {isZone
            ? <GSelect label="Entry Gate" value={ANY_GATE} options={[ANY_GATE]} onChange={() => {}} required disabled />
            : <GSelect label="Entry Gate" value={f.entryGate} options={ENTRY_GATES} onChange={set('entryGate')} required />}
          <GSelect label="Pass Type" value={f.passType} options={PASS_TYPES} onChange={v => setF(p => ({ ...p, passType: v, facilityAccess: '', facilityAreas: [] }))} required />
          <GSelect label="Pass Duration" value={f.passDuration} options={PASS_DURATIONS} onChange={set('passDuration')} required />
          <GSelect label="Purpose of Visit" value={f.purpose} options={PURPOSES} onChange={set('purpose')} required />
          <GDate label="Date of Visit" value={f.dateOfVisit} onChange={set('dateOfVisit')} required />
          <GInput label="Host Company Name" value={f.hostCompany} onChange={set('hostCompany')} required />
          {perPass > 0
            ? <GAmountField label={isZone ? 'Pass Amount' : 'Per Pass Amount'} value={money(perPass)} />
            : <div className="hidden lg:block" />}
          {isMaint && (
            <>
              <GYesNo label="Require access to facility areas?" value={f.facilityAccess} required
                onChange={v => setF(p => ({ ...p, facilityAccess: v, facilityAreas: v === 'No' ? [] : p.facilityAreas }))} />
              <GMultiSelect label="Facility Areas" values={f.facilityAreas} options={FACILITY_AREAS}
                onChange={set('facilityAreas')} disabled={f.facilityAccess !== 'Yes'} required={f.facilityAccess === 'Yes'} />
            </>
          )}
        </Grid4>
      </GSection>

      {/* ── Photography / Video (Figma 1248:65114 · zone 1005:26560) ── */}
      {isPhoto && (
        <GSection title="Photography / Video">
          <Grid4>
            <GInput label="Studio/Shooting Company" value={f.shootingCompany} onChange={set('shootingCompany')} required />
            <GDate label="Shooting Date" value={f.shootingDate} onChange={set('shootingDate')} required />
            <GSelect label="Shooting Method" value={f.shootingMethod} options={SHOOTING_METHODS} onChange={set('shootingMethod')} required />
            <GInput label="Shooting Location" value={f.shootingLocation} onChange={set('shootingLocation')} required />
          </Grid4>

          <div className="mt-[26px]">
            <GSubHead>Documents</GSubHead>
            <UploadGrid>
              {PHOTO_DOCS.map(d => <GUploader key={d} title={d} required />)}
            </UploadGrid>
          </div>

          <Divider />
          <GSubHead>Tools &amp; Equipments</GSubHead>
          <div className="flex flex-col gap-[16px]">
            {f.equipment.map(e => (
              <Grid4 key={e.id}>
                <GInput label="Equipment Name" value={e.name} onChange={v => setEquip(e.id, 'name', v)} />
                <GInput label="Equipment Quantity" value={e.qty} onChange={v => setEquip(e.id, 'qty', v.replace(/[^0-9]/g, ''))} />
                <div className="flex items-center">
                  <IconBtn kind="delete" label="Remove equipment" onClick={() => delEquip(e.id)} />
                </div>
              </Grid4>
            ))}
          </div>
          <button type="button" onClick={addEquip} data-secondary-btn
            className="mt-[18px] h-[44px] px-[18px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]"
            style={{ fontFamily: font, fontWeight: 500 }}>
            + Add More Equipment
          </button>
        </GSection>
      )}

      {/* ── Visitors Information (Figma 1248:52528 / 1248:56305) ── */}
      <GSection title="Visitors Information">
        <div className="rounded-[8px] p-[20px]" style={{ background: '#f8fafd', border: '1px solid #e6eaf5' }}>
          <Grid4>
            <GSelect label="Visa Type" value={entry.visaType} options={VISA_TYPES} onChange={setE('visaType')} required />
            <GInput label="Emirates ID" value={entry.emiratesId} onChange={setE('emiratesId')} placeholder="NNN-NNNN-NNNNNNN-N" required />
            <GDate label="Date of Birth" value={entry.dob} onChange={setE('dob')} required />
            <GSelect label="Gender" value={entry.gender} options={GENDERS} onChange={setE('gender')} />
            <div className="flex items-center gap-[20px]">
              <PrimaryBtn onClick={search}>Search</PrimaryBtn>
              {stage === 'details' && <ResetBtn onClick={clearEntry} />}
            </div>
          </Grid4>

          {stage === 'details' && (
            <>
              <Grid4 className="mt-[24px]">
                <GSelect label="Title" value={entry.title} options={TITLES} onChange={setE('title')} required disabled={!manual} />
                <GInput label="First Name" value={entry.firstName} onChange={setE('firstName')} required readOnly={!manual} />
                <GInput label="Last Name" value={entry.lastName} onChange={setE('lastName')} required readOnly={!manual} />
                {isZone ? (
                  <>
                    <GInput label="Company Name" value={entry.companyName} onChange={setE('companyName')} required />
                    <GInput label="Company Address" value={entry.companyAddress} onChange={setE('companyAddress')} />
                    <GInput label="Vehicle Number" value={entry.vehicleNo} onChange={setE('vehicleNo')} placeholder="Enter Vehicle Number" />
                  </>
                ) : (
                  <GInput label="Vehicle Number" value={entry.vehicleNo} onChange={setE('vehicleNo')} placeholder="Enter Vehicle Number" />
                )}
              </Grid4>

              <div className="mt-[24px]" key={`visitor-docs-${docsKey.current}`}>
                <UploadGrid>
                  {visitorDocs.map(d => <GUploader key={d.label} title={d.label} required={d.required} />)}
                </UploadGrid>
              </div>

              <div className="flex justify-end gap-[16px] mt-[20px]">
                <SecondaryBtn onClick={clearEntry}>Cancel</SecondaryBtn>
                <PrimaryBtn onClick={saveVisitor}>{editingId ? 'Update Visitor' : 'Save Visitor'}</PrimaryBtn>
              </div>
            </>
          )}
        </div>

        <Divider />

        <GSubHead right={
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
            {f.visitors.length} visitor{f.visitors.length === 1 ? '' : 's'}
          </span>
        }>
          Visitors Added
        </GSubHead>
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={1080}>
            <JourneyThead columns={[...columns.map(label => ({ label })), { label: 'Action', w: 110, filter: false, sticky: true }]} />
            <tbody>
              {f.visitors.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-[16px] text-[#8f94ae] bg-white"
                    style={{ padding: '26px 16px', fontFamily: font }}>No Visitors Added</td>
                </tr>
              ) : f.visitors.map(v => {
                const name = `${v.firstName} ${v.lastName}`;
                const cells = isZone
                  ? [f.zone || '-', listedPorts.join(', ') || '-', f.passType || '-', f.passDuration || '-', name, v.visaType, v.gender || '-', v.companyName || '-']
                  : [f.portName || '-', f.passType || '-', f.passDuration || '-', name, v.visaType, fromIso(v.dob) || '-', v.gender || '-', v.companyName || '-'];
                return (
                  <tr key={v.id} style={{ background: editingId === v.id ? '#f0f5ff' : undefined }}>
                    {cells.map((c, i) => <JourneyTd key={i} first={i === 0}>{c}</JourneyTd>)}
                    <JourneyTd sticky width={110}>
                      <span className="flex items-center gap-[10px]">
                        <IconBtn kind="edit" label={`Edit ${name}`} onClick={() => editVisitor(v)} />
                        <IconBtn kind="delete" label={`Remove ${name}`} onClick={() => removeVisitor(v.id)} />
                      </span>
                    </JourneyTd>
                  </tr>
                );
              })}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>

      {/* ── Payment Information ── */}
      <GSection title="Payment Information">
        <Grid4>
          <GValue label="Per Pass Amount"><GAmount value={money(perPass)} /></GValue>
          <GValue label="Number of Visitors" value={String(f.visitors.length)} />
          <GValue label="Total Pass Amount"><GAmount value={money(total)} /></GValue>
        </Grid4>
      </GSection>

      <GAgree checked={agree} onChange={setAgree} />
      {isPhoto && (
        <GAgree checked={agreePhoto} onChange={setAgreePhoto}>
          I agree:
          <ul className="list-disc pl-[20px]">
            <li>This photo shooting will be under the supervision of PCFC SD</li>
            <li>That photography should adhere to the restrictions indicated by prohibited signs. I understand that military and palace areas are off-limits for photography.</li>
          </ul>
        </GAgree>
      )}

      {confirmOpen && (
        <VisitorConfirmModal
          visaType={entry.visaType}
          emiratesId={entry.emiratesId}
          dob={fromIso(entry.dob)}
          gender={entry.gender || '-'}
          found={lookupVisitor(entry.gender)}
          onClose={() => setConfirmOpen(false)}
          onManual={enterManually}
          onConfirm={confirmFound}
        />
      )}
    </GatePage>
  );
}
