import React, { useState } from 'react';
import { font } from './GateFields';

/* ──────────────────────────────────────────────────────────────
   Help and Guides (Figma 3:25024) — shared by every Tasreeh
   service start page (Gate Passes, Delegation Visits …).
   ────────────────────────────────────────────────────────────── */

export type HelpContent = {
  about: React.ReactNode;
  accordions: { title: string; body: React.ReactNode }[];
  faqs: { q: string; a: string }[];
  updates: { date: string; text: string }[];
  downloads: string[];
  tutorials: string[];
};

const TABS = [
  { key: 'information', label: 'Information', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" strokeLinejoin="round" /><path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinejoin="round" />
    </svg>) },
  { key: 'tutorials', label: 'Tutorials', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M10 9l5 3-5 3V9z" strokeLinejoin="round" />
    </svg>) },
  { key: 'faqs', label: "Common FAQ's", icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M21 11.5a8.4 8.4 0 01-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1121 11.5z" strokeLinejoin="round" />
    </svg>) },
  { key: 'updates', label: 'Updates', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M21 12a9 9 0 11-2.6-6.4M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>) },
  { key: 'downloads', label: 'Downloads', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3v12M7 11l5 5 5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>) },
];

/* Service Delivery Procedure (Figma 3:25061 / 3:25084) */
const PROCEDURE = [
  { n: 1, title: 'Request Submission', desc: 'Fill the request information like, regime type, declaration Type, cargo channel etc' },
  { n: 2, title: 'Invoice Details', desc: 'Upload or add manually the invoice and HS code details of the cargo.' },
  { n: 3, title: 'Document Upload', desc: 'Upload all the relevant documents required for customs and permit documents' },
  { n: 4, title: 'Proceed to Declaration / Proceed to Permit', desc: 'Proceed to apply for permit if applicable for HS Codes provided or continue to submit for Declaration' },
  { n: 5, title: 'Declaration - General Information', desc: 'Fill the form with other information details' },
  { n: 6, title: 'Declaration - Pay & Submit', desc: 'Review the details and complete the declaration payment.' },
];




/* Collapsible grey bar (Services Details / Service Fee / Required Documents) */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-[14px]">
      <button onClick={() => setOpen(o => !o)}
        className="bg-[#f9f9f9] rounded-[4px] px-[22px] py-[16px] flex items-center justify-between text-left">
        <span className="text-[20px] font-medium text-[#060c28]" style={{ fontFamily: font }}>{title}</span>
        <span className="size-[28px] rounded-full bg-[#a6a6a6] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3"
            className={`transition-transform ${open ? 'rotate-90' : ''}`}><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      {open && <div className="px-[22px] text-[15px] text-[#3f4d66] leading-[24px]" style={{ fontFamily: font }}>{children}</div>}
    </div>
  );
}


export default function HelpGuides({ content }: { content: HelpContent }) {
  const [tab, setTab] = useState('information');
  const FAQS = content.faqs, UPDATES = content.updates, DOWNLOADS = content.downloads;
  return (
    <>
      {/* Help and Guides (Figma 3:25024) */}
      <div className="mt-[12px]">
        <h2 className="text-[24px] font-bold text-[#0e1b3d] mb-[18px]" style={{ fontFamily: font }}>Help and Guides</h2>

        <div className="flex items-center gap-[34px] border-b border-[#ddd] mb-[30px] overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex items-center gap-[12px] px-[6px] pt-[16px] pb-[18px] w-[172px] text-[14px] whitespace-nowrap transition-colors flex-shrink-0"
                style={{
                  fontFamily: font, fontWeight: 500,
                  color: active ? '#1360d2' : '#051937',
                  borderBottom: active ? '3px solid #1360d2' : '3px solid transparent',
                  marginBottom: -1,
                }}>
                {t.icon}{t.label}
              </button>
            );
          })}
        </div>

        {tab === 'information' && (
          <div className="flex flex-col gap-[28px] pb-[20px]">
            <div>
              <h3 className="text-[20px] font-medium text-[#060c28] mb-[16px]" style={{ fontFamily: font }}>About the Service</h3>
              <div className="text-[14px] text-black leading-[24px]" style={{ fontFamily: font }}>{content.about}</div>
            </div>

            <div>
              <h3 className="text-[20px] font-medium text-[#060c28] mb-[22px]" style={{ fontFamily: font }}>Service Delivery Procedure</h3>
              <div className="flex flex-col gap-[14px]">
                {[PROCEDURE.slice(0, 3), PROCEDURE.slice(3)].map((group, gi) => (
                  <div key={gi} className="flex items-stretch gap-[14px] flex-wrap xl:flex-nowrap">
                    {group.map((p, i) => (
                      <React.Fragment key={p.n}>
                        <div className="bg-white rounded-[12px] px-[22px] py-[16px] w-[250px] flex flex-col gap-[20px]"
                          style={{ filter: 'drop-shadow(0px 4px 12px rgba(217,217,217,0.53))', minHeight: gi === 0 ? 180 : 224 }}>
                          <span className="size-[32px] rounded-full bg-[#1aac72] text-white text-[16px] font-medium flex items-center justify-center"
                            style={{ fontFamily: font }}>{p.n}</span>
                          <div className="flex flex-col gap-[8px]">
                            <p className="text-[16px] font-medium text-[#060c28] leading-[20px]" style={{ fontFamily: font }}>{p.title}</p>
                            <p className="text-[14px] text-black leading-[22px]" style={{ fontFamily: font }}>{p.desc}</p>
                          </div>
                        </div>
                        {i < group.length - 1 && (
                          <div className="hidden xl:flex items-center w-[90px] flex-shrink-0">
                            <span className="block w-full h-[2px]" style={{ background: '#b9e6cd' }} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[22px]">
              {content.accordions.map(x => <Accordion key={x.title} title={x.title}>{x.body}</Accordion>)}
            </div>
          </div>
        )}

        {tab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] pb-[20px]">
            {content.tutorials.map(t => (
              <div key={t} className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <div className="h-[140px] bg-[#e2ebf9] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#1360d2" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4V8z" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[16px] font-medium text-[#0e1b3d] p-[16px]" style={{ fontFamily: font }}>{t}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'faqs' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {FAQS.map(f => (
              <div key={f.q} className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <p className="text-[17px] font-bold text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font }}>{f.q}</p>
                <p className="text-[15px] text-[#5a6478] leading-[24px]" style={{ fontFamily: font }}>{f.a}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'updates' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {UPDATES.map(u => (
              <div key={u.date} className="bg-white rounded-[8px] p-[18px] flex gap-[18px] items-start" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <span className="text-[15px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{u.date}</span>
                <span className="text-[16px] text-[#3f4d66]" style={{ fontFamily: font }}>{u.text}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'downloads' && (
          <div className="pb-[20px] flex flex-col gap-[12px]">
            {DOWNLOADS.map(d => (
              <div key={d} className="bg-white rounded-[8px] p-[18px] flex items-center justify-between gap-[16px]" style={{ boxShadow: '0px 4px 18px rgba(143,155,186,0.14)' }}>
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d}</span>
                <button className="flex items-center gap-[8px] text-[16px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.8">
                    <path d="M12 3v12M7 11l5 5 5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
