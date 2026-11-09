import { useRef, useState } from 'react';
import {
  font, GatePage, GSection, GSubHead, Grid4, Divider, GInput, GSelect, GDate, GTextArea, GAgree,
  ResetBtn, IconBtn, GUploader, UploadGrid, PrimaryBtn, SecondaryBtn, NeedHelp,
} from '../gatepass/GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import {
  DELEGATION_TITLE, COMPANY, PORTS, GATES, TITLES, VISITOR_CATEGORIES, EMIRATES, COUNTRY_CODES, EMPTY_FORM,
  type DelegationForm, type DelegationVisitor,
} from './delegationData';

type Props = {
  initial?: DelegationForm;
  onHome: () => void;
  onBackToListing: () => void;
  onSubmit: (form: DelegationForm) => void;
  onSaveDraft: (form: DelegationForm) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const AGREEMENT =
  'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. ' +
  'I also agree that Security Department has the full rights to reject any request for security reasons and the money ' +
  'paid is non-refundable in all cases.';

type Entry = Omit<DelegationVisitor, 'id'>;
const EMPTY_ENTRY: Entry = { title: '', name: '', category: '', position: '' };

/* Delegation Visits — request form (Figma 3:14527) */
export default function DelegationFormPage({ initial, onHome, onBackToListing, onSubmit, onSaveDraft }: Props) {
  const [f, setF] = useState<DelegationForm>(initial ?? EMPTY_FORM);
  const set = <K extends keyof DelegationForm>(k: K) => (v: DelegationForm[K]) => setF(p => ({ ...p, [k]: v }));

  /* Visitor entry */
  const [entry, setEntry] = useState<Entry>(EMPTY_ENTRY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const docsKey = useRef(0);
  const setE = (k: keyof Entry) => (v: string) => setEntry(p => ({ ...p, [k]: v }));
  const clearEntry = () => { setEntry(EMPTY_ENTRY); setEditingId(null); docsKey.current += 1; };
  const saveVisitor = () => {
    setF(p => {
      const v: DelegationVisitor = { ...entry, id: editingId ?? `dv-${Date.now()}` };
      return { ...p, visitors: editingId ? p.visitors.map(x => (x.id === editingId ? v : x)) : [...p.visitors, v] };
    });
    clearEntry();
  };
  const editVisitor = (v: DelegationVisitor) => {
    const { id, ...rest } = v;
    setEntry(rest); setEditingId(id); docsKey.current += 1;
  };
  const removeVisitor = (id: string) => {
    setF(p => ({ ...p, visitors: p.visitors.filter(v => v.id !== id) }));
    if (editingId === id) clearEntry();
  };

  /* Vehicles */
  const setVeh = (id: string, k: 'emirate' | 'other' | 'plate', v: string) =>
    setF(p => ({ ...p, vehicles: p.vehicles.map(x => (x.id === id ? { ...x, [k]: v } : x)) }));
  const addVeh = () => setF(p => ({ ...p, vehicles: [...p.vehicles, { id: `veh-${Date.now()}`, emirate: '', other: '', plate: '' }] }));
  const delVeh = (id: string) => setF(p => ({
    ...p, vehicles: p.vehicles.length > 1 ? p.vehicles.filter(x => x.id !== id) : [{ id: 'veh-0', emirate: '', other: '', plate: '' }],
  }));

  const [agree, setAgree] = useState(false);

  return (
    <GatePage
      title={DELEGATION_TITLE}
      crumb={DELEGATION_TITLE}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
      footerRight={
        <>
          <SecondaryBtn onClick={() => onSaveDraft(f)}>Save As Drafts</SecondaryBtn>
          {/* No blocking validation — the prototype always moves forward. */}
          <PrimaryBtn onClick={() => onSubmit(f)}>Submit</PrimaryBtn>
        </>
      }
    >
      {/* ── Basic Information (prefilled from the account) ── */}
      <GSection title="Basic Information">
        <Grid4>
          <GInput label="Company Name" value={COMPANY.name} readOnly />
          <GInput label="Trade License Number" value={COMPANY.licenseNo} readOnly />
          <GInput label="Trade License Source" value={COMPANY.licenseSource} readOnly />
          <GInput label="Trade License Expiry Date" value={COMPANY.licenseExpiry} readOnly />
        </Grid4>
        <div className="mt-[24px] lg:w-1/2">
          <GTextArea label="Applicant Remarks" value={f.remarks} onChange={set('remarks')} />
        </div>
      </GSection>

      {/* ── Visit Details ── */}
      <GSection title="Visit Details">
        <Grid4>
          <GDate label="Visit Date" value={f.visitDate} onChange={set('visitDate')} />
          <div className="grid grid-cols-2 gap-[12px] min-w-0">
            <GSelect label="Hrs" value={f.visitHrs} options={HOURS} onChange={set('visitHrs')} />
            <GSelect label="Mins" value={f.visitMins} options={MINUTES} onChange={set('visitMins')} />
          </div>
          <GSelect label="Port" value={f.port} options={PORTS} onChange={set('port')} required />
          <GSelect label="Gate Number" value={f.gate} options={GATES} onChange={set('gate')} required />
          <GInput label="Contact Email" value={f.email} onChange={set('email')} placeholder="Enter email" required />
          <div className="flex gap-[8px] min-w-0">
            <div className="w-[118px] flex-shrink-0">
              <GSelect label="Code" value={f.countryCode} options={COUNTRY_CODES} onChange={set('countryCode')} />
            </div>
            <div className="flex-1 min-w-0">
              <GInput label="Contact Mobile Number" value={f.mobile} onChange={v => set('mobile')(v.replace(/[^0-9]/g, ''))}
                placeholder="mobile number" required />
            </div>
          </div>
        </Grid4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[20px] gap-y-[24px] mt-[24px]">
          <GTextArea label="Reason of Visit" value={f.reason} onChange={set('reason')} />
          <GTextArea label="Visit Program" value={f.program} onChange={set('program')} />
          <GTextArea label="Locations" value={f.locations} onChange={set('locations')} />
        </div>
      </GSection>

      {/* ── Visitors' Details ── */}
      <GSection title="Visitors' Details">
        <div className="rounded-[8px] p-[20px]" style={{ background: '#f8fafd', border: '1px solid #e6eaf5' }}>
          <Grid4>
            <GSelect label="Title" value={entry.title} options={TITLES} onChange={setE('title')} required />
            <GInput label="Visitor Name" value={entry.name} onChange={setE('name')} placeholder="Enter Visitor Name" required />
            <GSelect label="Visitor Categories" value={entry.category} options={VISITOR_CATEGORIES} onChange={setE('category')} />
            <GInput label="Position" value={entry.position} onChange={setE('position')} placeholder="Enter Position" />
          </Grid4>

          <div className="mt-[24px]" key={`visitor-docs-${docsKey.current}`}>
            <UploadGrid>
              <GUploader title="ID" required />
              <GUploader title="Supporting Documents" />
            </UploadGrid>
          </div>

          <div className="flex justify-end gap-[16px] mt-[20px]">
            <ResetBtn onClick={clearEntry} />
            <PrimaryBtn onClick={saveVisitor}>{editingId ? 'Update Visitor' : 'Save Visitor'}</PrimaryBtn>
          </div>
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
          <JourneyTable minWidth={760}>
            <JourneyThead columns={[
              { label: 'Title' }, { label: 'Visitor Name' }, { label: 'Visitor Category' }, { label: 'Position' },
              { label: 'Action', w: 110, filter: false, sticky: true },
            ]} />
            <tbody>
              {f.visitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-[16px] text-[#8f94ae] bg-white"
                    style={{ padding: '26px 16px', fontFamily: font }}>No Visitors Added</td>
                </tr>
              ) : f.visitors.map(v => (
                <tr key={v.id} style={{ background: editingId === v.id ? '#f0f5ff' : undefined }}>
                  <JourneyTd first>{v.title || '-'}</JourneyTd>
                  <JourneyTd>{v.name || '-'}</JourneyTd>
                  <JourneyTd>{v.category || '-'}</JourneyTd>
                  <JourneyTd>{v.position || '-'}</JourneyTd>
                  <JourneyTd sticky width={110}>
                    <span className="flex items-center gap-[10px]">
                      <IconBtn kind="edit" label={`Edit ${v.name}`} onClick={() => editVisitor(v)} />
                      <IconBtn kind="delete" label={`Remove ${v.name}`} onClick={() => removeVisitor(v.id)} />
                    </span>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>

      {/* ── Vehicles Details ── */}
      <GSection title="Vehicles Details">
        <div className="flex flex-col gap-[16px]">
          {f.vehicles.map(v => (
            <Grid4 key={v.id}>
              <GSelect label="Emirate" value={v.emirate} options={EMIRATES} onChange={x => setVeh(v.id, 'emirate', x)} />
              {v.emirate === 'Other'
                ? <GInput label="Other" value={v.other} onChange={x => setVeh(v.id, 'other', x)} placeholder="Enter" required />
                : <GInput label="Plate Number" value={v.plate} onChange={x => setVeh(v.id, 'plate', x)} placeholder="Enter Plate Number" />}
              {v.emirate === 'Other'
                ? <GInput label="Plate Number" value={v.plate} onChange={x => setVeh(v.id, 'plate', x)} placeholder="Enter Plate Number" />
                : <div className="flex items-center"><IconBtn kind="delete" label="Remove vehicle" onClick={() => delVeh(v.id)} /></div>}
              {v.emirate === 'Other' && (
                <div className="flex items-center"><IconBtn kind="delete" label="Remove vehicle" onClick={() => delVeh(v.id)} /></div>
              )}
            </Grid4>
          ))}
        </div>
        <button type="button" onClick={addVeh} data-secondary-btn
          className="mt-[18px] h-[44px] px-[18px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]"
          style={{ fontFamily: font, fontWeight: 500 }}>
          + Add More Vehicle
        </button>
      </GSection>

      <GAgree checked={agree} onChange={setAgree}>{AGREEMENT}</GAgree>
    </GatePage>
  );
}
