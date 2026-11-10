import { useCallback, useMemo, useState } from 'react';
import PmListCard, { GreyIconBtn, type Col } from './PmTable';
import { ResetLink } from './CompanyPages';
import {
  Agree, Amount, BlockHead, Btn, C, ConfirmDelete, DocCard, DropBox, FAmount, FDate, FootActions, FSelect, FText, FTextArea, Grid3, Modal,
  PmPage, ResultCard, RV, Section, SubHead, Toast, UploadNote, font,
} from './PmUI';
import { GENDERS, NATIONALITIES, PORTS, PASS_ROWS, inOneMonth, isoToDisplay, newAppNo, today } from './pmData';

/* ──────────────────────────────────────────────────────────────
   Tasreeh New Services (Figma file "Tasreeh New Services - Dev"):
   My NOCs (1:9576), Registration of Security Company (1:9813),
   Registration of Security Personnel (4998:121138),
   New Security Service Request (1:170170).
   ────────────────────────────────────────────────────────────── */

export type SecurityEntry = 'nocs' | 'company' | 'personnel' | 'services';
type Crumb = { label: string; onClick?: () => void };

const COMPANY = { name: 'Galaxy', tradeLicense: '9865571326454', source: 'Dubai Economy and Tourism', approvalNo: 'GLXY222444888' };
const AGREE_SERVICE = 'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. I also agree that Security Department has the full rights to reject any request for security reasons and the money paid  is non-refundable in all cases.';

const InfoIcon = ({ color = C.text }: { color?: string }) => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke={color} strokeWidth="1.4" aria-hidden className="flex-shrink-0"><circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6.2v.1" strokeLinecap="round" /></svg>
);
const Note5MB = () => (
  <p className="flex items-center gap-[8px] text-[13px] mb-[14px]" style={{ color: C.text }}>
    <InfoIcon /><span><b className="font-medium">NOTE:</b> Upload Document only of File Type (png/jpg/gif/pdf) and maximum allowed file size is 5MB for each document</span>
  </p>
);

/* ══════════════ My NOCs ══════════════ */

type NocStatus = 'Amended' | 'Valid' | 'Expired' | 'Cancelled';
type NocRow = { approvalNo: string; serviceType: string; startDate: string; endDate: string; status: NocStatus };
const NOC_TYPES = ['Security Company NOC', 'Security Personnel NOC', 'Security Personnel NOC', 'Security Personnel NOC', 'Security Personnel NOC', 'Security Personnel NOC', 'Vessel Service', 'ISPS Service', 'Vessel Service', 'ISPS Service'];
const NOC_STATUS: NocStatus[] = ['Amended', 'Valid', 'Expired', 'Valid', 'Cancelled', 'Amended', 'Amended', 'Valid', 'Expired', 'Valid'];
const NOC_ROWS: NocRow[] = PASS_ROWS.map((r, i) => ({
  approvalNo: r.passRefNo, serviceType: NOC_TYPES[i % 10], startDate: '01-Jan-2024', endDate: '01-Jan-2025', status: NOC_STATUS[(i + Math.floor(i / 10)) % 10],
}));
const NOC_TAG: Record<NocStatus, { bg: string; bd: string; c: string }> = {
  Amended: { bg: '#e8f0fd', bd: C.primary, c: C.primary },
  Valid: { bg: '#e6fef1', bd: '#45b275', c: '#2e9b5f' },
  Expired: { bg: '#fdecea', bd: '#e35d4f', c: '#c0392b' },
  Cancelled: { bg: '#fdecea', bd: '#e35d4f', c: '#c0392b' },
};
const NocTag = ({ s }: { s: NocStatus }) => (
  <span className="inline-flex items-center rounded-[4px] px-[7px] text-[13px] leading-[20px]" style={{ background: NOC_TAG[s].bg, border: `1px solid ${NOC_TAG[s].bd}`, color: NOC_TAG[s].c }}>{s}</span>
);

function MyNocsPage({ onHome }: { onHome: () => void }) {
  const [open, setOpen] = useState<NocRow | null>(null);
  const cols: Col<NocRow>[] = [
    { key: 'approvalNo', label: 'Approval No' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status', render: r => <NocTag s={r.status} /> },
  ];
  return (
    <PmPage crumbs={[{ label: 'My NOCs' }]} onHome={onHome}>
      <PmListCard title="My NOCs" rows={NOC_ROWS} cols={cols} rowKey={r => r.approvalNo}
        search={r => r.approvalNo} searchPlaceholder="Search with certificate number"
        filters={[
          { label: 'Service Type', options: [...new Set(NOC_TYPES)], match: (r, v) => r.serviceType === v },
          { label: 'Status', options: ['Amended', 'Valid', 'Expired', 'Cancelled'], match: (r, v) => r.status === v },
        ]}
        actionCol={{
          label: 'Action', width: '80px',
          render: r => (
            <GreyIconBtn label={`View NOC ${r.approvalNo}`} onClick={() => setOpen(r)}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
            </GreyIconBtn>
          ),
        }}
      />
      {open && (
        <Modal title="NOC Details" onClose={() => setOpen(null)} actions={<Btn onClick={() => setOpen(null)}>Close</Btn>}>
          <Grid3>
            <RV label="Approval Number:" value={open.approvalNo} /><RV label="Service Type:" value={open.serviceType} /><RV label="Company Name:" value={COMPANY.name} />
            <RV label="Start Date:" value={open.startDate} /><RV label="End Date:" value={open.endDate} /><RV label="Status:"><NocTag s={open.status} /></RV>
          </Grid3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] mt-[24px]"><DocCard title="NOC Certificate" file={`noc-${open.approvalNo}.pdf`} /></div>
        </Modal>
      )}
    </PmPage>
  );
}

/* ══════════════ Registration of Security Company ══════════════ */

const ACTIVITIES = ['Security Guarding Services', 'Cash Transit', 'Security Systems Installation', 'Security Consultancy', 'Other'];

function SecurityCompanyPage({ crumbs, onHome, onCancel, onDraft, onSubmit }: { crumbs: Crumb[]; onHome: () => void; onCancel: () => void; onDraft: () => void; onSubmit: () => void }) {
  const [activity, setActivity] = useState('Other');
  const [other, setOther] = useState('');
  const [remarks, setRemarks] = useState('');
  const [agree, setAgree] = useState(true);
  return (
    <PmPage crumbs={[...crumbs, { label: 'Registration of Security Company' }]} onHome={onHome}>
      <Section title="Registration Information">
        <Grid3>
          <FText label="Company Name" value={COMPANY.name} readOnly />
          <FText label="Trade License Number" value={COMPANY.tradeLicense} readOnly />
          <FText label="Trade License Source" value={COMPANY.source} readOnly />
          <FSelect label="License Activities" required value={activity} options={ACTIVITIES} onChange={setActivity} />
          {activity === 'Other' && (
            <div className="md:col-span-1 lg:col-span-2"><FTextArea label="Other" required value={other} onChange={setOther} placeholder="Enter Other Activities" /></div>
          )}
          <div className="md:col-span-2 lg:col-span-2"><FTextArea label="Company Remarks" value={remarks} onChange={setRemarks} placeholder="Remarks" /></div>
        </Grid3>
        <div className="flex items-center gap-[10px] rounded-[2px] px-[18px] py-[16px] mt-[30px] mb-[24px] text-[14px]" style={{ border: `1px solid ${C.navy}`, background: '#f5f8ff', color: C.text }}>
          <InfoIcon />If you have active projects now in any port please upload the contract with the host company.
        </div>
        <Note5MB />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
          <DocCard title="Tradelicense" required file="tradelicense.png" />
          <DropBox title="Document" />
        </div>
      </Section>
      <Agree checked={agree} onChange={setAgree}>{AGREE_SERVICE}</Agree>
      <FootActions left={<Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
        right={<><Btn variant="outline" onClick={onDraft}>Save as Draft</Btn><Btn onClick={onSubmit}>Submit</Btn></>} />
    </PmPage>
  );
}

/* ══════════════ Registration of Security Personnel ══════════════ */

type Personnel = { id: string; title: string; first: string; last: string; email: string; mobile: string; designation: string; passport: string; nationality: string; eidExpiry: string; visaNo: string; visaExpiry: string; passportExpiry: string; vehicle: string };
const EMPTY_P: Omit<Personnel, 'id'> = { title: '', first: '', last: '', email: '', mobile: '', designation: '', passport: '', nationality: '', eidExpiry: '', visaNo: '', visaExpiry: '', passportExpiry: '', vehicle: '' };
type Added = Personnel & { eid: string; dob: string; gender: string };

function SecurityPersonnelPage({ crumbs, onHome, onCancel, onDraft, onSubmit }: { crumbs: Crumb[]; onHome: () => void; onCancel: () => void; onDraft: () => void; onSubmit: () => void }) {
  const [eid, setEid] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [searched, setSearched] = useState(false);
  const [p, setP] = useState(EMPTY_P);
  const [added, setAdded] = useState<Added[]>([]);
  const [del, setDel] = useState<Added | null>(null);
  const [agree, setAgree] = useState(true);
  const set = (k: keyof typeof EMPTY_P) => (v: string) => setP(x => ({ ...x, [k]: v }));
  const reset = () => { setP(EMPTY_P); setEid(''); setDob(''); setGender('Male'); setSearched(false); };
  const save = () => {
    setAdded(a => [...a, { ...p, id: `p${Date.now()}`, first: p.first || 'Rashid', last: p.last || 'Khan', eid: eid || '784-1990-7654321-2', dob: isoToDisplay(dob) || '15-Mar-1990', gender }]);
    reset();
  };
  return (
    <PmPage crumbs={[...crumbs, { label: 'Registration of Security Personnel' }]} onHome={onHome}>
      <Section title="Basic Information">
        <Grid3>
          <FText label="Company Name" value={COMPANY.name} readOnly />
          <FText label="Trade License Number" value={COMPANY.tradeLicense} readOnly />
          <FText label="Trade License Source" value={COMPANY.source} readOnly />
          <FText label="Security Company Approval Number" value={COMPANY.approvalNo} readOnly />
          <RV label="Security Company Approval Status">
            <span className="inline-flex items-center rounded-[4px] px-[8px] py-[2px] text-[16px]" style={{ background: '#e6fef1', border: '1px solid #45b275', color: '#2e9b5f' }}>Active</span>
          </RV>
        </Grid3>
      </Section>
      <Section title="Security Personnel Information">
        <SubHead>Personnel Information</SubHead>
        <div className="rounded-[2px] p-[14px] sm:p-[16px]" style={{ border: '1px solid #dfe5f2', background: '#fafbfe' }}>
          <Grid3>
            <FText label="Emirates ID" required value={eid} onChange={setEid} placeholder="Enter Emirates ID" />
            <FDate label="Date of Birth" required value={dob} onChange={setDob} />
            <FSelect label="Gender" value={gender} options={GENDERS} onChange={setGender} />
          </Grid3>
          <div className="flex items-center gap-[20px] flex-wrap mt-[16px]">
            <Btn onClick={() => setSearched(true)}>Search</Btn>
            {searched && (
              <p className="flex items-center gap-[8px] text-[14px]" style={{ color: '#e35d4f' }}>
                <InfoIcon color="#e35d4f" />Sorry we couldn't fetch details. Please fill the details manually.
              </p>
            )}
          </div>
          {searched && (
            <>
              <div className="mt-[22px]">
                <Grid3>
                  <FSelect label="Title" required value={p.title} options={['Mr', 'Mrs', 'Ms']} onChange={set('title')} />
                  <FText label="First Name" required value={p.first} onChange={set('first')} placeholder="Enter first name" />
                  <FText label="Last Name" required value={p.last} onChange={set('last')} placeholder="Enter last name" />
                  <FText label="Email" value={p.email} onChange={set('email')} />
                  <FText label="Mobile" required value={p.mobile} onChange={set('mobile')} />
                  <FSelect label="Designation" required value={p.designation} options={['Security Guard', 'Security Supervisor', 'Security Manager']} onChange={set('designation')} />
                  <FText label="Passport Number" required value={p.passport} onChange={set('passport')} />
                  <FSelect label="Nationality" required value={p.nationality} options={NATIONALITIES} onChange={set('nationality')} />
                  <FDate label="Emirates ID Expiry Date" value={p.eidExpiry} onChange={set('eidExpiry')} />
                  <FText label="Visa Number" value={p.visaNo} onChange={set('visaNo')} placeholder="Enter Visa Number" />
                  <FDate label="Visa Expiry Date" value={p.visaExpiry} onChange={set('visaExpiry')} />
                  <FDate label="Passport Expiry Date" value={p.passportExpiry} onChange={set('passportExpiry')} />
                  <FText label="Vehicle Number" value={p.vehicle} onChange={set('vehicle')} placeholder="Enter Vehicle Number" />
                </Grid3>
              </div>
              <div className="mt-[26px]"><BlockHead>Required Documents</BlockHead></div>
              <Note5MB />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                <DropBox title="Personal Photo" required /><DropBox title="Passport" />
                <DropBox title="Emirates ID" /><DropBox title="Visa" />
                <DropBox title="SIRA License" /><DropBox title="Supporting Documents" />
              </div>
              <div className="flex justify-end items-center gap-[20px] mt-[20px]">
                <ResetLink onClick={reset} />
                <Btn onClick={save}>Save Personnel</Btn>
              </div>
            </>
          )}
        </div>
        <div className="h-px w-full my-[24px]" style={{ background: '#dfe5f2' }} />
        <SubHead>Personnel Added</SubHead>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate" style={{ borderSpacing: 0, fontFamily: font }}>
            <thead><tr style={{ background: C.bar }}>
              {['Personnel Name', 'Emirates ID', 'Date of Birth', 'Gender', 'Action'].map(h => (
                <th key={h} scope="col" className="h-[34px] px-[10px] text-left text-[13px] font-normal uppercase" style={{ color: C.sub }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {added.length === 0 ? (
                <tr><td colSpan={5} className="pt-[8px]">
                  <div className="h-[50px] flex items-center justify-center text-[15px] rounded-[2px]" style={{ background: '#f5f7fb', border: '1px solid #dfe5f2', color: C.muted }}>No Personnel Added</div>
                </td></tr>
              ) : added.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? C.zebra : '#fff' }}>
                  {[`${a.title ? `${a.title} ` : ''}${a.first} ${a.last}`, a.eid, a.dob, a.gender].map((c, k) => (
                    <td key={k} className="h-[46px] px-[10px] text-[15px]" style={{ color: C.text }}>{c}</td>
                  ))}
                  <td className="px-[10px]">
                    <GreyIconBtn label={`Delete ${a.first}`} tone="red" onClick={() => setDel(a)}>
                      <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5M8 9v5M12 9v5" /></svg>
                    </GreyIconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Agree checked={agree} onChange={setAgree} />
      <FootActions left={<Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
        right={<><Btn variant="outline" onClick={onDraft}>Save as Draft</Btn><Btn onClick={onSubmit}>Submit</Btn></>} />
      {del && <ConfirmDelete what={`personnel ${del.first} ${del.last}`} onNo={() => setDel(null)} onYes={() => { setAdded(a => a.filter(x => x.id !== del.id)); setDel(null); }} />}
    </PmPage>
  );
}

/* ══════════════ New Security Service Request ══════════════ */

const SERVICES = ['Security Guards', 'Mobile CCTV', 'Escort Services', 'Event Security'];
const FEE_PER_DAY = 1200;

function DateTime({ label, date, hrs, mins, onDate, onHrs, onMins }: {
  label: string; date: string; hrs: string; mins: string; onDate: (v: string) => void; onHrs: (v: string) => void; onMins: (v: string) => void;
}) {
  const box = 'h-[44px] w-full rounded-[4px] px-[12px] text-[15px] bg-white focus:outline-none placeholder-[#8f94ae]';
  return (
    <div className="min-w-0">
      <p className="text-[13px] mb-[6px]" style={{ color: C.sub }}>{label}<span style={{ color: C.accent }}>*</span></p>
      {/* Figma proportions: date ≈ half, then hrs | mins */}
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-[16px] items-end">
        <FDate label="" value={date} onChange={onDate} />
        <div className="col-span-2 flex">
          <input aria-label={`${label} hours`} value={hrs} onChange={e => onHrs(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="hrs" className={`${box} min-w-0 flex-1 rounded-r-none`} style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: font }} />
          <input aria-label={`${label} minutes`} value={mins} onChange={e => onMins(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="mins" className={`${box} min-w-0 flex-1 rounded-l-none -ml-px`} style={{ border: `1px solid ${C.border}`, color: C.text, fontFamily: font }} />
        </div>
      </div>
    </div>
  );
}

function SecurityServicesPage({ crumbs, onHome, onCancel, onDraft, onSubmit }: { crumbs: Crumb[]; onHome: () => void; onCancel: () => void; onDraft: () => void; onSubmit: (fee: string) => void }) {
  const [v, setV] = useState({ email: '', mobile: '', remarks: '', service: '', count: '1', port: '', location: '', from: '', fromH: '', fromM: '', to: '', toH: '', toM: '', comment: '' });
  const [agree, setAgree] = useState(true);
  const set = (k: keyof typeof v) => (x: string) => setV(p => ({ ...p, [k]: x }));
  const days = useMemo(() => {
    if (!v.from || !v.to) return 0;
    const d = Math.round((+new Date(v.to) - +new Date(v.from)) / 86400000) + 1;
    return d > 0 ? d : 0;
  }, [v.from, v.to]);
  const fee = (FEE_PER_DAY * Math.max(1, days) * Math.max(1, Number(v.count) || 1)).toFixed(1);
  return (
    <PmPage crumbs={[...crumbs, { label: 'New Security Service Request' }]} onHome={onHome}>
      <Section title="Basic Information">
        <Grid3>
          <FText label="Company Name" value={COMPANY.name} readOnly />
          <FText label="Contact Email" required value={v.email} onChange={set('email')} placeholder="Enter email" />
          <FText label="Contact Mobile" required value={v.mobile} onChange={set('mobile')} placeholder="Enter mobile number" />
          <div className="md:col-span-2 lg:col-span-2"><FTextArea label="Company Remarks" value={v.remarks} onChange={set('remarks')} placeholder="Remarks" /></div>
        </Grid3>
      </Section>
      <Section title="Service Information">
        <Grid3>
          <FSelect label="Requested Service" required value={v.service} options={SERVICES} onChange={set('service')} />
          <div>
            <FText label="Requested Number of this service" required value={v.count} onChange={set('count')} />
            <p className="text-[13px] mt-[6px]" style={{ color: C.sub }}>ex: “2 security guards/ 3 mobile CCTV”</p>
          </div>
          <FSelect label="Port" required value={v.port} options={PORTS} onChange={set('port')} />
          <FText label="Location" required value={v.location} onChange={set('location')} placeholder="Enter location" />
          <DateTime label="From Date/Time" date={v.from} hrs={v.fromH} mins={v.fromM} onDate={set('from')} onHrs={set('fromH')} onMins={set('fromM')} />
          <DateTime label="To Date/Time" date={v.to} hrs={v.toH} mins={v.toM} onDate={set('to')} onHrs={set('toH')} onMins={set('toM')} />
          <FText label="Number of days" value={days ? String(days) : '--'} readOnly />
          <FAmount label="Service Fee" value={fee} />
          <div className="hidden lg:block" />
          <div className="md:col-span-2 lg:col-span-2"><FTextArea label="Comment" value={v.comment} onChange={set('comment')} placeholder="Add Comments" /></div>
        </Grid3>
        <div className="mt-[24px]"><Note5MB /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]"><DropBox title="SERA Certificate" /></div>
      </Section>
      <Agree checked={agree} onChange={setAgree}>{AGREE_SERVICE.replace('any request', 'any service request').replace('money paid  is', 'money paid for the pass is')}</Agree>
      <FootActions left={<Btn variant="outline" onClick={onCancel}>Cancel</Btn>}
        right={<><Btn variant="outline" onClick={onDraft}>Save as Draft</Btn><Btn onClick={() => onSubmit(fee)}>Submit</Btn></>} />
    </PmPage>
  );
}

/* ══════════════ Flow ══════════════ */

const TITLES: Record<Exclude<SecurityEntry, 'nocs'>, string> = {
  company: 'Registration of Security Company', personnel: 'Registration of Security Personnel', services: 'New Security Service Request',
};

export default function SecurityFlow({ entry, onClose }: { entry: SecurityEntry; onClose: () => void }) {
  const [result, setResult] = useState<{ kind: 'submitted' | 'draft'; no: string; fee?: string } | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  if (entry === 'nocs') return <MyNocsPage onHome={onClose} />;

  const crumbs: Crumb[] = [{ label: 'Services', onClick: onClose }];
  const title = TITLES[entry];
  const done = (kind: 'submitted' | 'draft', fee?: string) => setResult({ kind, no: newAppNo(), fee });

  if (result) {
    return (
      <>
        <PmPage crumbs={[...crumbs, { label: title }]} onHome={onClose}>
          {result.kind === 'submitted' ? (
            <ResultCard title="Your Request Submitted Successfully"
              rows={[
                ['Application Number', result.no], ['Created Date', today()],
                ['Status', <span key="s" className="inline-flex items-center rounded-[4px] px-[8px] py-[2px] text-[18px]" style={{ background: '#fff4e2', border: '1px solid #f5a623', color: '#d97706' }}>Under Review</span>],
                ...(result.fee ? [['Paid Amount', <Amount key="a" value={result.fee} />] as [string, React.ReactNode]] : []),
              ]}
              actions={<><Btn variant="outline" onClick={onClose}>Back to Services</Btn>{result.fee && <Btn onClick={() => setToast(`Receipt for ${result.no} downloaded`)}>Print Receipt</Btn>}</>} />
          ) : (
            <ResultCard title="Draft Saved Successfully"
              message={<>Kindly note that you are saving the request and PCFC security will not receive this request until complete all information and submit.<br />The period for saving the request as draft is only 1 month, after that the draft version will be deleted automatic if not submitted.</>}
              rows={[['Draft Number', result.no], ['Created Date', today()], ['Valid Till', inOneMonth()]]}
              actions={<Btn variant="outline" onClick={onClose}>Back to Services</Btn>}
              link={{ label: 'Edit Request', onClick: () => { setResult(null); setFormKey(k => k + 1); } }} />
          )}
        </PmPage>
        {toast && <Toast message={toast} onDone={clearToast} />}
      </>
    );
  }

  const props = { crumbs, onHome: onClose, onCancel: onClose, onDraft: () => done('draft') };
  if (entry === 'company') return <SecurityCompanyPage key={formKey} {...props} onSubmit={() => done('submitted')} />;
  if (entry === 'personnel') return <SecurityPersonnelPage key={formKey} {...props} onSubmit={() => done('submitted')} />;
  return <SecurityServicesPage key={formKey} {...props} onSubmit={fee => done('submitted', fee)} />;
}
