import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

type DocRow = { chargeType: string; mandatory: 'Yes' | 'No'; docName: string; docNature: string; status: string };

const DOC_ROWS: DocRow[] = [
  { chargeType: 'Non Remittance Claim', mandatory: 'Yes', docName: 'Free Zone Export Bill / FZ Transit Bill', docNature: 'Consignee Claim Copy', status: 'Not Submitted' },
  { chargeType: '',                     mandatory: 'No',  docName: 'Equipment Interchange Receipt',           docNature: 'Copy',                 status: 'Not Submitted' },
  { chargeType: '',                     mandatory: 'No',  docName: 'Export Manifest',                        docNature: 'Copy',                 status: 'Not Submitted' },
  { chargeType: '',                     mandatory: 'No',  docName: 'Exit / Entry Certificate',               docNature: 'Original',             status: 'Not Submitted' },
  { chargeType: '',                     mandatory: 'No',  docName: 'Bill of Lading/Airway Bill/Manifest',    docNature: 'Copy',                 status: 'Not Submitted' },
];

const DECLARATIONS = ['305-08812345-24', '305-08812346-24', '305-08812347-24'];

const CLAIM_FIELDS = [
  { label: 'Claim No.',     value: '2420390' },
  { label: 'Claim Version', value: '1' },
  { label: 'Claim Type',    value: 'Non Remittance Claim' },
  { label: 'Claim Date',    value: '29/06/2026' },
  { label: 'Claimant',      value: 'SW Logistics LLC (Business) AE-9106286' },
];

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[12px]" style={{ minWidth: 240, flex: '0 0 280px' }}>
      <span className="text-[16px]" style={{ fontFamily: font, color: '#455174', whiteSpace: 'nowrap' }}>{label}</span>
      <span className="text-[18px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>{value || '—'}</span>
    </div>
  );
}

type Props = { onBack: () => void };

export default function ClaimDocumentsPage({ onBack }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([DECLARATIONS[0]]));

  const toggle = (d: string) => setExpanded(p => {
    const next = new Set(p);
    if (next.has(d)) next.delete(d); else next.add(d);
    return next;
  });
  const expandAll   = () => setExpanded(new Set(DECLARATIONS));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>View Documents</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">AE-9106286 — SW Logistics LLC</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <h1 className="text-[28px] mb-[16px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0e1b3d' }}>
          View Documents — Non Remittance Claim 2420390
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Details */}
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px]" style={{ fontWeight: 500, color: '#051937' }}>Claim Details</p>
            <div className="bg-white rounded-[8px] px-[20px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                {CLAIM_FIELDS.map(f => <InfoCard key={f.label} label={f.label} value={f.value} />)}
              </div>
            </div>
          </div>

          {/* Doc. Details */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between flex-wrap gap-[8px]">
              <p className="text-[20px]" style={{ fontWeight: 500, color: '#051937' }}>Doc. Details</p>
              <div className="flex items-center gap-[8px]">
                <button onClick={expandAll} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontWeight: 500, fontFamily: font }}>Expand All</button>
                <span className="text-[16px] text-[#a1aebe]">|</span>
                <button onClick={collapseAll} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontWeight: 500, fontFamily: font }}>Collapse All</button>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              {DECLARATIONS.map(declNo => {
                const open = expanded.has(declNo);
                return (
                  <div key={declNo} className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
                    {/* Accordion header */}
                    <button type="button" onClick={() => toggle(declNo)}
                      className="w-full flex items-center gap-[10px] px-[20px] py-[14px] text-left hover:bg-[#f8fafd] transition-colors"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: font }}>
                      <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
                        style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                        <path d="M5 3l4 4-4 4"/>
                      </svg>
                      <span className="text-[16px]" style={{ fontWeight: 500, color: '#0e1b3d' }}>Declaration No. <span style={{ color: '#1360d2' }}>{declNo}</span></span>
                    </button>

                    {/* Documents table */}
                    {open && (
                      <div className="px-[20px] pb-[16px]" style={{ borderTop: '1px solid #f5f7fc', overflowX: 'auto' }}>
                        <table className="dt-table dt-table--lined" style={{ minWidth: 760 }}>
                          <thead>
                            <tr>
                              <th className="text-[16px]">Charge Type</th>
                              <th className="text-[16px]">Mandatory</th>
                              <th className="text-[16px]">Doc. Name</th>
                              <th className="text-[16px]">Doc. Nature</th>
                              <th className="text-[16px]">Current Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DOC_ROWS.map((d, i) => (
                              <tr key={i}>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.chargeType || ''}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.mandatory}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ minWidth: 220, fontFamily: font }}>{d.docName}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap', fontFamily: font }}>{d.docNature}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                  <span className="text-[16px] px-[10px] py-[3px] rounded-[4px]"
                                    style={{ background: 'rgba(220,53,69,0.10)', color: '#dc3545', fontWeight: 500, fontFamily: font }}>
                                    {d.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar onBackToListing={onBack} />
    </div>
  );
}
