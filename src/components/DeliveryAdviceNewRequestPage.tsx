import { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

function FInput({ label, value, onChange, req, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <input value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: '0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

function FSelect({ label, value, onChange, options, req }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer', background: '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: open ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Collapsible section header (Services Details / Service Fee) ── */
function Collapsible({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #d5ddfb' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-[20px] py-[14px]" style={{ background: '#e2ebf9' }}>
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{title}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#0e1b3d" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="px-[20px] py-[18px] bg-white">{children}</div>}
    </div>
  );
}

function ServiceDetailItem({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="flex items-start gap-[10px]">
      <div className="text-[#697498] flex-shrink-0 mt-[2px]">{icon}</div>
      <div>
        <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</p>
        {items.map(it => <p key={it} className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>• {it}</p>)}
      </div>
    </div>
  );
}

type Hawb = { hawbNumber: string; pieces: string; weight: string; daNumber: string; daDate: string; daRemarks: string };
const HAWB_RESULTS: Hawb[] = [
  { hawbNumber: 'HAWB101', pieces: '100', weight: '100.0 KG', daNumber: 'Draft', daDate: '—', daRemarks: '—' },
  { hawbNumber: 'HAWB102', pieces: '48', weight: '620.5 KG', daNumber: 'Draft', daDate: '—', daRemarks: '—' },
];

type Step = 'search' | 'results' | 'viewDa';

type Props = { onBack: () => void; onBackToListing: () => void };

export default function DeliveryAdviceNewRequestPage({ onBack, onBackToListing }: Props) {
  const [step, setStep] = useState<Step>('search');
  const [masterAwb, setMasterAwb] = useState('');
  const [subConsoleAwb, setSubConsoleAwb] = useState('');
  const [consigneeType, setConsigneeType] = useState('');
  const [importerConsigneeCode, setImporterConsigneeCode] = useState('');
  const [importerConsigneeName, setImporterConsigneeName] = useState('');
  const [daRemarks, setDaRemarks] = useState('');
  const [selectedHawb, setSelectedHawb] = useState<Hawb | null>(null);
  const [helpTab, setHelpTab] = useState('Information');

  const searchValid = masterAwb.trim() && subConsoleAwb.trim();
  const consigneeCode = 'Testname';
  const consigneeName = 'Testcompany';
  const daNumber = '202635696';
  const daDate = '01/06/2026';

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (step === 'viewDa' && selectedHawb) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>View DA - Search Air House Manifest</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[10px] p-[28px]" style={{ border: '2px solid #0e1b3d', maxWidth: 820 }}>
            <div className="flex items-center justify-between mb-[20px]">
              <div className="flex flex-col items-center">
                <span className="text-[26px]" style={{ color: '#c0392b', fontFamily: 'serif', fontWeight: 700 }}>حكومة دبي</span>
                <span className="text-[13px] text-[#c0392b]" style={{ fontFamily: font, fontWeight: 700 }}>GOVERNMENT OF DUBAI</span>
              </div>
              <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700, letterSpacing: 1 }}>DELIVERY ADVICE</span>
              <div className="flex items-center gap-[6px]">
                <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Dubai Customs</span>
              </div>
            </div>
            <div className="grid grid-cols-2" style={{ border: '1px solid #d5ddfb' }}>
              {[['DA Number', daNumber], ['DA Date', daDate]].map(([k, v]) => (
                <div key={k} className="px-[18px] py-[12px] flex" style={{ borderRight: k === 'DA Number' ? '1px solid #d5ddfb' : undefined, borderBottom: '1px solid #d5ddfb' }}>
                  <span className="text-[15px] text-[#0e1b3d] w-[130px]" style={{ fontFamily: font, fontWeight: 700 }}>{k}</span>
                  <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: {v}</span>
                </div>
              ))}
              <div className="col-span-2 px-[18px] py-[12px] flex flex-col gap-[4px]" style={{ borderBottom: '1px solid #d5ddfb' }}>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>Agent : xcrn business new01</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Please release the under mentioned goods to :</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>Importer : AE-1000132 RED ENTERTAINMENT DISTRIBUTION FZCO</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>DA Remarks : {daRemarks || 'remarks'}</span>
              </div>
              {[['Master Airline AWB Number', masterAwb], ['Sub Console AWB', subConsoleAwb]].map(([k, v]) => (
                <div key={k} className="px-[18px] py-[12px] flex flex-col" style={{ borderRight: k.startsWith('Master') ? '1px solid #d5ddfb' : undefined, borderBottom: '1px solid #d5ddfb' }}>
                  <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{k}</span>
                  <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: {v || '—'}</span>
                </div>
              ))}
              <div className="px-[18px] py-[12px] flex flex-col gap-[2px]" style={{ borderRight: '1px solid #d5ddfb' }}>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>HAWB Number</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: {selectedHawb.hawbNumber}</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Number of Pieces</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: {selectedHawb.pieces}</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Goods Description</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: television</span>
              </div>
              <div className="px-[18px] py-[12px] flex flex-col">
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Weight(Kgs)</span>
                <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>: {selectedHawb.weight.replace(' KG', '')}</span>
              </div>
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb />
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Generate DA - Search Air House Manifest</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Enter Flight Information to Get Started</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] items-end">
            <FInput label="Master Airline AWB" value={masterAwb} onChange={setMasterAwb} req placeholder="Enter master AWB" />
            <FInput label="Sub Console AWB Number" value={subConsoleAwb} onChange={setSubConsoleAwb} req placeholder="Enter sub console AWB" />
            <button onClick={() => setStep('results')}
              className="h-[56px] px-[22px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500 }}>
              Search
            </button>
          </div>
        </div>

        {step === 'results' && (
          <>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Delivery Advice Details</p>
              <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <FSelect label="Consignee Type" value={consigneeType} onChange={setConsigneeType} req options={['Cargo Handlers', 'Freezone', 'Importer', 'Personal Consignee']} />
                {consigneeType === 'Importer' ? (
                  <div>
                    <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>Consignee Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                      <FInput label="Consignee Code" value={importerConsigneeCode} onChange={setImporterConsigneeCode} req placeholder="Search consignee code" />
                      <FInput label="Consignee Name" value={importerConsigneeName} onChange={setImporterConsigneeName} req placeholder="Enter consignee name" />
                    </div>
                  </div>
                ) : consigneeType ? (
                  <div>
                    <p className="text-[16px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 500 }}>Consignee Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>Consignee Code</span>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{consigneeCode}</span>
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>Consignee Name</span>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{consigneeName}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="max-w-[420px]">
                  <FInput label="DA Remarks" value={daRemarks} onChange={setDaRemarks} req placeholder="Enter remarks" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>HAWB Details</p>
                <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>1–{HAWB_RESULTS.length} of {HAWB_RESULTS.length}</span>
              </div>
              <div className="bg-white rounded-[8px] p-[4px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#e2ebf9' }}>
                        {['HAWB Number', 'Number of Pieces', 'Weight', 'DA Number', 'DA Date', 'DA Remarks', 'Actions'].map(h => (
                          <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HAWB_RESULTS.map(h => (
                        <tr key={h.hawbNumber} style={{ borderTop: '1px solid #f0f4ff' }}>
                          <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{h.hawbNumber}</td>
                          <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{h.pieces}</td>
                          <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{h.weight}</td>
                          <td className="px-[16px] py-[12px]">
                            <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[13px] font-medium" style={{ background: '#eef1f6', color: '#697498', fontFamily: font }}>{h.daNumber}</span>
                          </td>
                          <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{h.daDate}</td>
                          <td className="px-[16px] py-[12px] text-[15px] text-[#0e1b3d]">{h.daRemarks}</td>
                          <td className="px-[16px] py-[12px]">
                            <button onClick={() => { setSelectedHawb(h); setStep('viewDa'); }}
                              className="h-[36px] px-[14px] rounded-[4px] text-[14px] text-white" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                              Generate DA
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'search' && (
          <>
            <div className="flex items-center gap-[8px]">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0e1b3d" strokeWidth="1.6"><path d="M4 5h7v15H4z" /><path d="M20 5h-7v15h7z" /></svg>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Help and Guides</p>
            </div>
            <div className="bg-white rounded-[8px] p-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex items-center gap-[8px]">
                {['Information', 'Tutorials', 'FAQ’S', 'Updates', 'Downloads'].map(t => (
                  <button key={t} onClick={() => setHelpTab(t)}
                    className="text-[16px] px-[16px] py-[8px] rounded-[4px] transition-colors"
                    style={{ background: helpTab === t ? '#1360d2' : 'transparent', color: helpTab === t ? '#fff' : '#1360d2', fontFamily: font, fontWeight: 500 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-start">
              <div className="flex flex-col gap-[20px]">
                <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <p className="text-[18px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>About the Service</p>
                  <p className="text-[16px] text-[#455174]" style={{ fontFamily: font, lineHeight: 1.5 }}>
                    The Digital Delivery Order platform is the first of its kind introduced in Dubai to enhance shipping and logistics operations.
                  </p>
                </div>
                <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <p className="text-[18px] text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font, fontWeight: 700 }}>Service Delivery Procedure</p>
                  <div className="flex flex-col">
                    {[
                      ['Request Submission', 'Fill the request information like regime type, declaration Type, cargo channel etc'],
                      ['Invoice Details', 'Upload or add manually the invoice and HS code details of the cargo.'],
                      ['Document Upload', 'Upload all the relevant documents required for customs and permit documents'],
                    ].map(([title, desc], i, arr) => (
                      <div key={title} className="flex gap-[14px]">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <span className="size-[26px] rounded-full flex items-center justify-center text-[13px] text-white" style={{ background: '#28a745', fontFamily: font, fontWeight: 700 }}>{i + 1}</span>
                          {i < arr.length - 1 && <span className="w-[2px] flex-1" style={{ background: '#c9f0d8', minHeight: 28 }} />}
                        </div>
                        <div className="pb-[16px]">
                          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{title}</p>
                          <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[16px]">
                <Collapsible title="Services Details" defaultOpen>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
                    <ServiceDetailItem title="Service Type" items={['Transactional']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>} />
                    <ServiceDetailItem title="Target Category" items={['Companies']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3 3-5 7-5s7 2 7 5" /><circle cx="17" cy="8" r="2.5" /><path d="M17 12.5c2.5 0 5 1.5 5 4.5" /></svg>} />
                    <ServiceDetailItem title="Service Completion Time" items={['1 Working Day']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>} />
                    <ServiceDetailItem title="Service Delivery Time" items={['Available around the clock']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>} />
                    <ServiceDetailItem title="Relationship Type" items={['From Government to Business']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /><path d="M11 7h2M7 11v2" /></svg>} />
                    <ServiceDetailItem title="Service Interconnection" items={['Request No Objection for Customs Broker']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 7h10M7 17h10M4 7l3-3M4 17l3 3M20 7l-3-3M20 17l-3 3" /></svg>} />
                    <ServiceDetailItem title="Service Delivery Channel" items={['Website', 'Mobile Web']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" /></svg>} />
                    <ServiceDetailItem title="Bundle" items={['N/A']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>} />
                    <ServiceDetailItem title="Service Hierarchy" items={['Sub Service']} icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l9 6-9 6-9-6z" /><path d="M3 15l9 6 9-6" /></svg>} />
                  </div>
                </Collapsible>
                <Collapsible title="Service Fee">
                  <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>No fees apply for this service.</p>
                </Collapsible>
              </div>
            </div>
          </>
        )}
      </div>

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
