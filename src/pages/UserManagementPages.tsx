import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ServiceCatalogueModal from '../components/ServiceCatalogueModal';
import { font, GSection, GInput, GSelect, GTag, PrimaryBtn, SecondaryBtn } from '../components/gatepass/GateFields';
import { Dialog } from '../components/gatepass/GatePassModals';
import { TASREEH_SERVICES } from '../components/gatepass/gatePassData';
import { homeRoute, markBuLinked } from '../persona';

/* ──────────────────────────────────────────────────────────────
   User Management for the individual (UAE PASS) account —
   User Management Figma 17353:60613 BU Association · 16368:21073
   confirm & link · 16369:21343 linked · 16134:51117 / 16134:50614
   Create User. Built on the portal card / field / button template.
   ────────────────────────────────────────────────────────────── */


const USER = {
  fullName: 'Ahmed Al Marri', emiratesId: '784-1988-7654321-2', phone: '+971 55 952 4462',
  email: 'ahmed.almarri@gmail.com', nationality: 'United Arab Emirates',
};

const BUSINESS_UNITS = [
  { id: 'pcfc', label: 'PCFC - Tasreeh', short: 'PCFC' },
  { id: 'dm', label: 'Dubai Municipality', short: 'Dubai Municipality' },
  { id: 'dmcc', label: 'DMCC', short: 'DMCC' },
  { id: 'chamber', label: 'Dubai Chamber', short: 'Dubai Chamber' },
  { id: 'south', label: 'Dubai South', short: 'Dubai South' },
  { id: 'jafza', label: 'JAFZA', short: 'JAFZA' },
  { id: 'trakhees', label: 'Trakhees', short: 'Trakhees' },
  { id: 'emirates', label: 'Emirates', short: 'Emirates' },
  { id: 'dnata', label: 'Dnata', short: 'Dnata' },
];

/* ── Page shell: header, breadcrumb, company sidebar, sticky footer ── */
function UmPage({ crumb, title, sidebar = true, footerLeft, footerRight, children }: {
  crumb: string; title: string; sidebar?: boolean; footerLeft?: ReactNode; footerRight?: ReactNode; children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd]" style={{ fontFamily: font }}>
      <Header onHome={() => navigate(homeRoute())} />
      <div className="px-4 sm:px-[34px] pt-[16px] pb-[10px] flex items-center gap-[6px] text-[14px]">
        <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={() => navigate(homeRoute())}>Home</span>
        <span className="text-[#dc3545]">/</span>
        <span className="text-[#111838] font-medium">{crumb}</span>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {sidebar && <CompanySidebar />}
        <main className="flex-1 min-w-0 px-4 sm:px-[34px] pt-[16px] pb-[32px]">
          <h1 className="text-[24px] sm:text-[28px] font-medium text-[#0e1b3d] mb-[20px]">{title}</h1>
          {children}
        </main>
      </div>
      {(footerLeft || footerRight) && (
        <div className="bg-white flex items-center justify-between gap-4 px-4 sm:px-[34px] py-[14px] sticky bottom-0 z-30"
          style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
          <div className="flex items-center gap-[12px]">{footerLeft}</div>
          <div className="flex items-center gap-[12px]">{footerRight}</div>
        </div>
      )}
    </div>
  );
}

function CompanySidebar() {
  return (
    <aside className="bg-white lg:w-[266px] flex-shrink-0 px-[44px] pt-[32px] pb-[24px] flex flex-col items-center lg:items-stretch">
      <div className="flex flex-col items-center text-center mb-[32px]">
        <span className="size-[84px] rounded-full bg-white flex items-center justify-center mb-[18px]"
          style={{ boxShadow: '0 8px 30px rgba(19,96,210,0.18)' }}>
          <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#0e1b3d" strokeWidth="1.8">
            <path d="M4 27h24M7 27V11h6v16M13 27V5h7v22M20 27V15h5v12" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-[20px] font-medium text-[#0e1b3d] leading-[26px]">Company Name<br />Goes Here</p>
        <p className="text-[15px] text-[#0e1b3d] mt-[6px] flex items-center gap-[6px]">
          Company
          <svg viewBox="0 0 16 16" width="12" height="12"><circle cx="8" cy="8" r="8" fill="#1360d2" /><path d="M5 8.2l2 2 4-4.2" stroke="#fff" strokeWidth="1.6" fill="none" /></svg>
        </p>
      </div>
      <nav className="flex flex-col gap-[8px] w-full max-w-[178px] lg:max-w-none">
        {['Company Details', 'VAT Profile', 'BU Association'].map(item => {
          const on = item === 'BU Association';
          return (
            <span key={item} className="px-[9px] py-[3px] text-[15px] font-medium"
              style={{ background: on ? '#1360d2' : '#f7faff', color: on ? '#fff' : '#0e1b3d' }}>{item}</span>
          );
        })}
      </nav>
    </aside>
  );
}

const Card = ({ title, extra, children }: { title: string; extra?: ReactNode; children: ReactNode }) => (
  <GSection title={title} right={extra}>{children}</GSection>
);

const Grid = ({ cols = 4, children }: { cols?: 2 | 4; children: ReactNode }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 4 ? 'lg:grid-cols-4' : ''} gap-x-[16px] gap-y-[20px]`}>{children}</div>
);

const RO = ({ label, value, tone }: { label: string; value: string; tone?: 'green' }) => (
  tone ? (
    <div className="relative min-w-0">
      <div className="h-[56px] rounded-[4px] px-[12px] flex items-center text-[16px] font-medium"
        style={{ border: '1px solid #d5ddfb', background: '#eef1f7', color: '#1a9b4b' }}>{value}</div>
      <span className="absolute left-[10px] -top-[9px] px-[4px] text-[12px] text-[#1d1b20]" style={{ background: 'linear-gradient(#fff 50%, #eef1f7 50%)' }}>{label}</span>
    </div>
  ) : <GInput label={label} value={value} readOnly />
);

/* Info / warning strips inside the confirm step */
function Notice({ tone, children }: { tone: 'info' | 'warn'; children: ReactNode }) {
  const c = tone === 'info'
    ? { bg: '#eef4ff', border: '#c7d9fb', color: '#1360d2' }
    : { bg: '#fdf3ea', border: '#efc79c', color: '#b4600c' };
  return (
    <div className="flex items-start gap-[10px] rounded-[6px] px-[16px] py-[12px] mb-[20px] text-[14px] leading-[22px]"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" className="flex-shrink-0 mt-[2px]">
        <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6.2v.01" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

const SectionHead = ({ children }: { children: ReactNode }) => (
  <p className="text-[18px] font-medium text-[#0e1b3d] mt-[8px] mb-[14px]">{children}</p>
);

/* Trade licence block (one card) */
function LicenceCard({ title, matched, full }: { title: string; matched?: boolean; full?: boolean }) {
  return (
    <Card title={title} extra={matched ? <GTag label="Matched with Another DT Account" tone="green" /> : undefined}>
      <Grid cols={full ? 4 : 2}>
        <RO label="Trade License No" value="TL-152165" />
        {full
          ? <GSelect label="Issuing Authority" value="DED - Dubai" options={['DED - Dubai', 'JAFZA', 'DMCC', 'Trakhees']} onChange={() => {}} />
          : <RO label="Issuing Authority" value="DED - Dubai" />}
        <RO label="Company Name" value="Landmark Logistics LLC" />
        <RO label="License Type" value="Commercial" />
        <RO label="Status" value="Active" tone="green" />
        <RO label="License Expiry Date" value="24-Aug-2025" />
        <RO label="Company Type" value="Shipping Agent, Supplier" />
        {full && <>
          <RO label="Address" value="Dubai" />
          <RO label="State" value="Dubai" />
          <RO label="Country" value="United Arab Emirates" />
        </>}
      </Grid>
    </Card>
  );
}

const CONSENTS = [
  { title: 'Information accuracy', text: <>I confirm that the information received from <b>Dubai Customs</b> is correct and accurate to the best of my knowledge.</> },
  { title: 'Authorisation to link', text: <>I authorise Dubai Trade to link my user profile and company account (<b>Dubai Trade Logistics LLC</b>) with <b>Dubai Customs</b> and share the relevant data accordingly.</> },
  { title: 'Terms & conditions', text: <>I have read and agree to the Dubai Trade platform&apos;s Terms and Conditions governing business unit data sharing and linking.</> },
];

/* ── BU Association: select → confirm & link → linked (Figma 17353:60613 · 16368:21073 · 16369:21343) ── */
export function BuAssociationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [bu, setBu] = useState('');
  const [consent, setConsent] = useState<boolean[]>([false, false, false]);
  const [linked, setLinked] = useState(false);
  const [catalogue, setCatalogue] = useState(false);
  const unit = BUSINESS_UNITS.find(b => b.id === bu);
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  if (step === 'select') {
    return (
      <UmPage crumb="Company Management" title="BU Association"
        footerRight={<>
          <SecondaryBtn onClick={() => navigate(homeRoute())}>Back to Listing</SecondaryBtn>
          <PrimaryBtn disabled={!bu} onClick={() => setStep('confirm')}>Proceed</PrimaryBtn>
        </>}>
        <Card title="User Information" extra={
          <span className="text-[13px] font-medium px-[10px] py-[2px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2' }}>As per your DT account</span>
        }>
          <Grid>
            <RO label="Full Name" value={USER.fullName} />
            <RO label="Emirates ID Number" value={USER.emiratesId} />
            <RO label="Phone Number" value={USER.phone} />
            <RO label="Email ID" value={USER.email} />
            <RO label="Nationality" value={USER.nationality} />
            <RO label="Account Status" value="Verified" tone="green" />
          </Grid>
        </Card>
        <Card title="Business Unit Association">
          <p className="text-[15px] font-medium text-[#0e1b3d] mb-[18px]">Select Business Unit <span className="text-[#ea2428]">*</span></p>
          <div className="flex flex-wrap gap-[8px]" role="radiogroup" aria-label="Business Unit">
            {BUSINESS_UNITS.map(b => {
              const on = b.id === bu;
              return (
                <label key={b.id} className="flex items-center gap-[8px] h-[34px] px-[12px] rounded-[18px] cursor-pointer text-[14px] transition-colors"
                  style={{ border: `1px solid ${on ? '#1360d2' : '#d5ddfb'}`, background: on ? '#eef4ff' : '#fff', color: on ? '#1360d2' : '#0e1b3d', fontWeight: on ? 500 : 400 }}>
                  <input type="radio" name="bu" checked={on} onChange={() => setBu(b.id)} className="size-[16px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
                  {b.label}
                </label>
              );
            })}
          </div>
        </Card>
      </UmPage>
    );
  }

  const short = unit?.short ?? 'PCFC';
  return (
    <UmPage crumb="User Profile" title="BU Association"
      footerRight={<>
        <SecondaryBtn onClick={() => setStep('select')}>Back</SecondaryBtn>
        <PrimaryBtn onClick={() => { markBuLinked(); setLinked(true); }}>Confirm &amp; Link</PrimaryBtn>
      </>}>
      <Card title={`Admin User Profile — ${short}`} extra={<span className="text-[14px] text-[#3f4d66]">Will be linked</span>}>
        <Grid>
          <RO label="Full Name" value={USER.fullName} />
          <RO label="Email Address" value={USER.email} />
          <RO label="Phone Number" value={USER.phone} />
          <RO label="Role in BU" value="Company Admin" />
        </Grid>
      </Card>

      <SectionHead>No Existing Accounts Matched</SectionHead>
      <Notice tone="info">Details below have been received from <b>{short}</b>. New Company Profile will get created with the below Trade license information for this account.</Notice>
      <LicenceCard title={`${short} - Trade License 1`} full />

      <SectionHead>Matched with another DT account Trade License with same Emirates ID information</SectionHead>
      <Notice tone="warn">The Trade License provided by the entity matches the Trade License information associated with another DT account under the same Emirates ID. We will mark this account as the primary account and associate both accounts accordingly.</Notice>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-[20px]">
        <LicenceCard title={`${short} - Trade License 2`} />
        <LicenceCard title="Dubai Trade - Trade License 2" matched />
      </div>

      <SectionHead>Matched with another DT account Trade License but with another/ no emirates ID details</SectionHead>
      <Notice tone="warn">The Trade License provided by the entity matches the Trade License information associated with another DT account. Once the association is successfully completed, we will add you as a sub-user under the DT Admin account.</Notice>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-[20px]">
        <LicenceCard title={`${short} - Trade License 3`} />
        <LicenceCard title="Dubai Trade - Trade License 2" matched />
      </div>

      <Card title="Consent for Linking">
        <p className="text-[14px] text-[#5a6478] pb-[12px] border-b border-[#e2e8f5]">By proceeding, you confirm the following:</p>
        {CONSENTS.map((c, i) => (
          <label key={c.title} className="flex items-start gap-[12px] py-[14px] border-b border-[#e2e8f5] last:border-b-0 cursor-pointer">
            <input type="checkbox" checked={consent[i]} onChange={e => setConsent(p => p.map((x, j) => (j === i ? e.target.checked : x)))}
              className="size-[18px] mt-[3px] cursor-pointer flex-shrink-0" style={{ accentColor: '#1360d2' }} />
            <span>
              <span className="block text-[15px] font-medium text-[#0e1b3d]">{c.title}</span>
              <span className="block text-[14px] text-[#5a6478] mt-[2px]">{c.text}</span>
            </span>
          </label>
        ))}
      </Card>

      {linked && (
        <Dialog onClose={() => setLinked(false)} width={548}>
          <div className="relative px-[32px] pt-[44px] pb-[40px] flex flex-col items-center text-center">
            <button onClick={() => setLinked(false)} aria-label="Close" className="absolute right-[20px] top-[16px] text-[#0e1b3d] hover:opacity-70">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            <span className="size-[48px] rounded-full flex items-center justify-center mb-[22px]" style={{ background: '#22b26f' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h2 className="text-[18px] font-bold text-[#0e1b3d] mb-[14px]">Successfully Linked and registered as admin</h2>
            <p className="text-[14px] text-[#1a1a1a] leading-[20px]">
              Your user profile and company account (<b>Landmark Logistics LLC</b>) have been successfully linked with business unit
            </p>
            <p className="text-[14px] text-[#1a1a1a] mt-[16px]">Business Code is generated and services has been assigned to your account.</p>
            <div className="w-full mt-[18px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ background: '#eef1f8' }}>
              <p>Business Unit Linked : <b>{unit?.label ?? 'PCFC'}</b></p>
              <p>Business Code Generated: <b>A1212434</b></p>
            </div>
            <p className="text-[14px] text-[#1a1a1a] mt-[18px] leading-[20px]">
              Trade License Profile will be created under your company account details. View the details in Company Profile Service
            </p>
            <div className="flex flex-wrap justify-center gap-[10px] mt-[24px]">
              <SecondaryBtn onClick={() => navigate(homeRoute())}>Back to Listing</SecondaryBtn>
              <PrimaryBtn onClick={() => navigate('/my-users/create')}>Add Sub User</PrimaryBtn>
            </div>
          </div>
          <div className="flex justify-center pb-[8px]">
            <button onClick={() => { setLinked(false); setCatalogue(true); }}
              className="h-[38px] px-[30px] rounded-[2px] bg-white text-[14px] font-medium text-[#1360d2] hover:bg-[#f0f4ff]"
              style={{ border: '1px solid #1360d2' }}>
              Prompt Service Catalogue
            </button>
          </div>
        </Dialog>
      )}
      {catalogue && <ServiceCatalogueModal onClose={() => setCatalogue(false)} />}
    </UmPage>
  );
}

/* ── Create User (Figma 16134:51117 agent codes → 16134:50614 services & privileges) ── */
const PCFC = 'PCFC - Tasreeh';
const PCFC_CODE = '12324 - Tasreeh';
const UNITS = ['Dubai Trade', 'DP World', PCFC];
/* PCFC - Tasreeh services carry the Service Catalogue names and no privilege checkboxes */
const SERVICES: { name: string; code: string; bu: string; type: string; role: string; privileges: boolean }[] = [
  { name: 'Business Association', code: '08938', bu: 'Dubai Trade', type: 'Company Code', role: 'Role', privileges: true },
  ...TASREEH_SERVICES.map(name => ({ name, code: '12324', bu: PCFC, type: 'Tasreeh', role: 'Role', privileges: false })),
];
const PRIVILEGES = ['View', 'Amend', 'Cancel', 'Request'];

const Check = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode }) => (
  <label className="flex items-center gap-[12px] cursor-pointer text-[15px] text-[#0e1b3d] min-w-0">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
      className="size-[18px] cursor-pointer flex-shrink-0" style={{ accentColor: '#1360d2' }} />
    {label && <span className="truncate">{label}</span>}
  </label>
);

function SearchBox({ placeholder }: { placeholder: string }) {
  const [v, setV] = useState('');
  return (
    <div className="relative w-full sm:w-[446px]">
      <input value={v} onChange={e => setV(e.target.value)} placeholder={placeholder}
        className="h-[56px] w-full rounded-[4px] bg-white pl-[16px] pr-[48px] text-[16px] text-[#0e1b3d] placeholder-[#5a6478] focus:outline-none"
        style={{ border: '1px solid #d5ddfb', fontFamily: font }} />
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0e1b3d" strokeWidth="2" className="absolute right-[16px] top-1/2 -translate-y-1/2">
        <circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.5-4.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const Filter = ({ label, options, value, onChange, w = 218 }: { label: string; options: string[]; value: string; onChange: (v: string) => void; w?: number }) => (
  <div style={{ width: w, maxWidth: '100%' }}><GSelect label={label} value={value} options={options} onChange={onChange} /></div>
);

export function CreateUserPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [units, setUnits] = useState<Set<string>>(new Set(['Dubai Trade']));
  const [codes, setCodes] = useState<Set<string>>(new Set(['Default Code']));
  const [buFilter, setBuFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [role, setRole] = useState('');
  const [chips, setChips] = useState(['AXA', 'BUA Customs', 'BUA DAZ']);
  const [svc, setSvc] = useState<Set<string>>(new Set());
  const [priv, setPriv] = useState<Record<string, Set<string>>>({});
  const [done, setDone] = useState(false);
  const [f2, setF2] = useState({ bu: '', code: 'ALL', type: '', role: '' });
  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const toggle = (set: Set<string>, key: string, on: boolean) => { const n = new Set(set); if (on) n.add(key); else n.delete(key); return n; };
  const togglePriv = (row: string, p: string, on: boolean) => setPriv(prev => ({ ...prev, [row]: toggle(prev[row] ?? new Set(), p, on) }));
  const withPriv = SERVICES.filter(s => s.privileges);
  const allPriv = (p: string) => withPriv.every(s => priv[s.name]?.has(p));

  if (step === 1) {
    return (
      <UmPage crumb="My Users" title="Create User" sidebar={false}
        footerLeft={<SecondaryBtn onClick={() => navigate(homeRoute())}>Cancel</SecondaryBtn>}
        footerRight={<>
          <SecondaryBtn onClick={() => { setUnits(new Set()); setCodes(new Set()); }}>Reset</SecondaryBtn>
          <PrimaryBtn disabled={units.size === 0 && codes.size === 0} onClick={() => setStep(2)}>Next</PrimaryBtn>
        </>}>
        <div className="flex flex-wrap items-center gap-[20px] mb-[36px]">
          <SearchBox placeholder="Search Agent Codes" />
          <Filter label="Business Units" options={UNITS} value={buFilter} onChange={setBuFilter} />
          <Filter label="Agent Type" options={['Tasreeh', 'Shipping Agent', 'Clearing Agent']} value={typeFilter} onChange={setTypeFilter} />
        </div>
        <p className="text-[18px] font-medium text-[#0e1b3d] mb-[20px]">Select the agent codes and assign the services</p>
        <div className="bg-white rounded-[8px] p-[16px] overflow-x-auto" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[196px_1fr] gap-[4px] mb-[4px]">
              <div className="h-[50px] flex items-center px-[10px] text-[14px] font-medium text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>Business Units</div>
              <div className="h-[50px] flex items-center px-[10px] text-[15px] font-medium text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>Agent Codes And Agent Type</div>
            </div>
            <div className="grid grid-cols-[196px_1fr] gap-x-[4px]">
              <div className="py-[22px] px-[22px] border-b border-[#e2e8f5]">
                <Check checked={units.size === UNITS.length} onChange={on => setUnits(on ? new Set(UNITS) : new Set())} label="Select All" />
              </div>
              <div className="border-b border-[#e2e8f5]" />

              <div className="py-[22px] px-[22px] border-b border-[#e2e8f5]">
                <Check checked={units.has('Dubai Trade')} onChange={on => setUnits(s => toggle(s, 'Dubai Trade', on))} label="Dubai Trade" />
              </div>
              <div className="py-[22px] px-[12px] border-b border-[#e2e8f5]">
                <Check checked={codes.has('Default Code')} onChange={on => setCodes(s => toggle(s, 'Default Code', on))} label="Default Code" />
              </div>

              <div className="py-[22px] px-[22px] border-b border-[#e2e8f5]">
                <Check checked={units.has('DP World')} onChange={on => setUnits(s => toggle(s, 'DP World', on))} label="DP World" />
              </div>
              <div className="py-[22px] px-[12px] border-b border-[#e2e8f5]">
                <Check checked={codes.has('Agent code - Agent Type')} onChange={on => setCodes(s => toggle(s, 'Agent code - Agent Type', on))} label="Agent code - Agent Type" />
              </div>

              <div className="py-[22px] px-[22px] border-b border-[#e2e8f5]">
                <Check checked={units.has(PCFC)} onChange={on => setUnits(s => toggle(s, PCFC, on))} label={PCFC} />
              </div>
              <div className="py-[22px] px-[12px] border-b border-[#e2e8f5]">
                <Check checked={codes.has(PCFC_CODE)} onChange={on => setCodes(s => toggle(s, PCFC_CODE, on))} label={PCFC_CODE} />
              </div>
            </div>
          </div>
        </div>
      </UmPage>
    );
  }

  return (
    <UmPage crumb="My Users" title="Create User" sidebar={false}
      footerLeft={<SecondaryBtn onClick={() => navigate(homeRoute())}>Cancel</SecondaryBtn>}
      footerRight={<>
        <SecondaryBtn onClick={() => setStep(1)}>Back</SecondaryBtn>
        <PrimaryBtn onClick={() => setDone(true)}>Create User</PrimaryBtn>
      </>}>
      <div className="bg-white rounded-[8px] px-[16px] py-[24px] mb-[16px] flex flex-wrap items-center gap-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <div className="w-[276px] max-w-full"><GSelect label="User Role" value={role} options={['Company Admin', 'Sub User', 'Viewer']} onChange={setRole} required /></div>
        <div className="flex flex-wrap items-center gap-[16px]">
          {chips.map(c => (
            <span key={c} className="flex items-center gap-[8px] h-[40px] px-[10px] text-[13px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>
              {c}
              <button onClick={() => setChips(p => p.filter(x => x !== c))} aria-label={`Remove ${c}`} className="hover:opacity-70">
                <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#0e1b3d" strokeWidth="1.5"><circle cx="10" cy="10" r="7.5" /><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" strokeLinecap="round" /></svg>
              </button>
            </span>
          ))}
          <button onClick={() => { setChips(['AXA', 'BUA Customs', 'BUA DAZ']); setRole(''); }}
            className="flex items-center gap-[6px] text-[16px] font-medium text-[#1360d2] ml-[40px] hover:opacity-80">
            Reset
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" /></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[16px] mb-[20px]">
        <SearchBox placeholder="Search Services" />
        <Filter label="Filter by BU" options={['Dubai Trade', 'PCFC - Tasreeh']} value={f2.bu} onChange={v => setF2(p => ({ ...p, bu: v }))} w={182} />
        <Filter label="Agent Code" options={['ALL', '08938', '12324']} value={f2.code} onChange={v => setF2(p => ({ ...p, code: v }))} w={208} />
        <Filter label="Filter by Agent Type" options={['Company Code', 'Tasreeh']} value={f2.type} onChange={v => setF2(p => ({ ...p, type: v }))} w={196} />
        <Filter label="Filter by Role" options={['Role']} value={f2.role} onChange={v => setF2(p => ({ ...p, role: v }))} w={200} />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-[14px]">
        <p className="text-[16px] font-medium text-[#0e1b3d]">Select The Services For The Agent Codes And Click &apos;Add To Selected&apos; To Assign</p>
        <SecondaryBtn>View Selected</SecondaryBtn>
      </div>

      <div className="bg-white rounded-[8px] overflow-x-auto" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <table className="w-full min-w-[1100px] border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr className="text-left text-[14px] font-medium text-[#0e1b3d]">
              {['Services Name', 'Agent Codes', 'Business Units', 'Agent Type', 'Role'].map(h => (
                <th key={h} className="h-[70px] px-[12px] font-medium" style={{ background: '#e2ebf9', borderRight: '6px solid #fff' }}>{h}</th>
              ))}
              <th colSpan={4} className="h-[70px] px-[30px] font-medium" style={{ background: '#e2ebf9' }}>Privileges</th>
            </tr>
          </thead>
          <tbody className="text-[15px] text-[#0e1b3d]">
            <tr>
              <td className="px-[14px] h-[60px] border-b border-[#e2e8f5]">
                <Check checked={svc.size === SERVICES.length} onChange={on => setSvc(on ? new Set(SERVICES.map(s => s.name)) : new Set())} label="Select All" />
              </td>
              <td colSpan={4} className="border-b border-[#e2e8f5]" />
              {PRIVILEGES.map(p => (
                <td key={p} className="px-[30px] border-b border-[#e2e8f5]">
                  <Check checked={allPriv(p)} onChange={on => withPriv.forEach(s => togglePriv(s.name, p, on))} label={p} />
                </td>
              ))}
            </tr>
            {SERVICES.map(s => (
              <tr key={s.name}>
                <td className="px-[14px] h-[60px] border-b border-[#e2e8f5]">
                  <Check checked={svc.has(s.name)} onChange={on => setSvc(x => toggle(x, s.name, on))} label={s.name} />
                </td>
                <td className="px-[12px] border-b border-[#e2e8f5]">{s.code}</td>
                <td className="px-[12px] border-b border-[#e2e8f5]">{s.bu}</td>
                <td className="px-[12px] border-b border-[#e2e8f5]">{s.type}</td>
                <td className="px-[12px] border-b border-[#e2e8f5]">{s.role}</td>
                {PRIVILEGES.map(p => (
                  <td key={p} className="px-[30px] border-b border-[#e2e8f5]">
                    {s.privileges && <Check checked={!!priv[s.name]?.has(p)} onChange={on => togglePriv(s.name, p, on)} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {done && (
        <Dialog onClose={() => setDone(false)} width={480}>
          <div className="px-[32px] pt-[40px] pb-[32px] flex flex-col items-center text-center gap-[14px]">
            <span className="size-[48px] rounded-full flex items-center justify-center" style={{ background: '#22b26f' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.6"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h2 className="text-[18px] font-bold text-[#0e1b3d]">Sub User Created Successfully</h2>
            <p className="text-[14px] text-[#3f4d66]">The selected services and privileges have been assigned to the new user.</p>
            <PrimaryBtn onClick={() => navigate(homeRoute())}>Back to Home</PrimaryBtn>
          </div>
        </Dialog>
      )}
    </UmPage>
  );
}
