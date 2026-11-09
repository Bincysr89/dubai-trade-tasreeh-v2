import React, { useMemo, useState } from 'react';
import type { Row } from './EligibleDeclarationsPage';
import { mergeDocsByBatch, type UploadedDoc } from './NonRemittanceDocumentsPage';
import Dh from './Dh';
import ClaimHeaderDetails from './ClaimHeaderDetails';
import { claimHeaderDefaultsFor } from './claimHeaderDefaults';
import ChargesBreakupModal from './ChargesBreakupModal';
import ClaimRequestVersions from './ClaimRequestVersions';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* Sample declarations + uploaded documents shown when the claim is opened
   from the listing (no rows/docs passed in). */
const DEFAULT_DECLS: Row[] = [
  { declarationNo: '305-08812345-24', declarationDate: '11/12/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '', exportExpiry: '', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '305-08812346-24', declarationDate: '11/14/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '', exportExpiry: '', remarks: '—', kind: 'request', importerCode: 'A180' },
  { declarationNo: '305-08812347-24', declarationDate: '11/20/2024', depositType: 'Non Remittance Claim', declarationCategory: 'Freezone Export', depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '', exportExpiry: '', remarks: '—', kind: 'request', importerCode: 'A180' },
];

const DEFAULT_DOCS: UploadedDoc[] = [
  { id: 'vd-1', declNo: '305-08812345-24', docType: 'Export Bill',              fileName: 'Export-Bill-305-45.pdf',  fileSize: 2_400_000, uploadedOn: '12/12/2024', remarks: '' },
  { id: 'vd-2', declNo: '305-08812345-24', docType: 'Exit / Entry Certificate', fileName: 'Exit-Cert-305-45.pdf',    fileSize: 1_100_000, uploadedOn: '12/12/2024', remarks: '' },
  { id: 'vd-3', declNo: '305-08812346-24', docType: 'Bill of Entry',            fileName: 'Bill-Entry-305-46.pdf',   fileSize: 900_000,   uploadedOn: '12/12/2024', remarks: '' },
  { id: 'vd-4', declNo: '305-08812347-24', docType: 'Export Manifest',          fileName: 'Manifest-305-47.pdf',     fileSize: 3_200_000, uploadedOn: '08/12/2024', remarks: '' },
];

function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[10px] px-[4px]">
        <h2 className="text-[20px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
        {badge && (
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>{badge}</span>
        )}
      </div>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Uploaded Documents — one accordion card per declaration, each holding a
       simple Document Type / File Name / Uploaded On / Remarks / Action table
       (mirrors RefundDepositsClaimViewPage's DocDeclarationCard). ─── */
function DocDeclarationCard({ declNo, docs, open, onToggle }: {
  declNo: string; docs: UploadedDoc[]; open: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ borderTop: '1px solid #eef1f6' }}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-[10px] px-[20px] py-[14px] text-left transition-colors hover:bg-[#f8fafd]"
        style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}>
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, fontFamily: font }}>Declaration No. {declNo}</span>
        <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
      </button>
      {open && (
        <div className="px-[20px] pb-[16px] pt-[4px]" style={{ borderTop: '1px solid #f5f7fc' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
              <thead>
                <tr>
                  {['Document Type', 'File Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                    <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                      <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.docType}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.fileName}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.uploadedOn}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>{doc.remarks || '—'}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        title="Download"
                        onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = doc.fileName; a.click(); }}
                        className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                        style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}
                      >
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const versionRows = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', submittedBy: 'crnuser01', status: 'Under Processing', isCurrentlyViewing: true },
];

type Props = { onBack: () => void; selectedRows: Row[]; uploadedDocs?: UploadedDoc[] };

export default function NonRemittanceClaimViewPage({ onBack, selectedRows, uploadedDocs = [] }: Props) {
  const displayRows = selectedRows.length > 0 ? selectedRows : DEFAULT_DECLS;
  const [breakupOpen, setBreakupOpen] = useState(false);
  /* The card's amounts are the per-declaration charges totalled up, so they agree
     with the sub totals and grand total in the Charges breakup popup. */
  const breakupDeclarations = displayRows.map(r => r.declarationNo);
  const breakupCount = Math.max(1, breakupDeclarations.length);
  const chargeRows = [
    { type: 'Claim Registration Charge', amt: (50 * breakupCount).toFixed(2), receipt: 'A-100650705' },
    { type: 'Knowledge & Innovation Dirham', amt: (20 * breakupCount).toFixed(2), receipt: 'A-100650706' },
  ];
  const chargeTotal = (70 * breakupCount).toFixed(2);
  const allDocs = uploadedDocs.length > 0 ? uploadedDocs : DEFAULT_DOCS;

  // Uploaded Documents — grouped by declaration, ordered to match the declaration rows above.
  const docsByDecl = useMemo(() => {
    const groups = new Map<string, UploadedDoc[]>();
    allDocs.forEach(doc => {
      const list = groups.get(doc.declNo) ?? [];
      list.push(doc);
      groups.set(doc.declNo, list);
    });
    groups.forEach((list, declNo) => groups.set(declNo, mergeDocsByBatch(list)));
    return groups;
  }, [allDocs]);
  const docDeclNos = [
    ...displayRows.map(r => r.declarationNo).filter(dn => docsByDecl.has(dn)),
    ...Array.from(docsByDecl.keys()).filter(dn => !displayRows.some(r => r.declarationNo === dn)),
  ];
  const [openDocDecl, setOpenDocDecl] = useState<Set<string>>(() => new Set(docDeclNos.slice(0, 1)));
  const toggleDocDecl = (declNo: string) => setOpenDocDecl(prev => {
    const next = new Set(prev);
    next.has(declNo) ? next.delete(declNo) : next.add(declNo);
    return next;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[28px] text-[#111838] mb-[20px] mt-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>
          View Claim
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details — 4 attrs in one row */}
          <Section title="Claim Header Details">
            <ClaimHeaderDetails
              claimType="Non Remittance Claim"
              claimNo="2420390"
              {...claimHeaderDefaultsFor('Non Remittance Claim')}
            />
          </Section>

          {/* Charges And Payment Details */}
          <Section title="Charges And Payment Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Charge Type', 'Amount (AED)', 'Payment Mode', 'Receipt No.', 'Payment Reference Details'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chargeRows.map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font }}><Dh style={{ fontSize: 15 }} />{row.amt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>Credit/Debit Account</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 SW LOGISTICS LLC</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}><Dh style={{ fontSize: 15 }} />{chargeTotal}</span></td>
                    <td colSpan={3} style={{ padding: '10px 14px' }}>
                      <button type="button" onClick={() => setBreakupOpen(true)}
                        className="text-[16px] underline hover:opacity-80 transition-opacity"
                        style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                        Charges breakup
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Declaration Details — table */}
          <Section title="Declaration Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                <thead>
                  <tr>
                    {['S.No', 'Declaration Number', 'Declaration Clearance Date', 'Declaration Type', 'Owner Code', 'Refund Type', 'Status'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, i) => (
                    <tr key={row.declarationNo} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{row.declarationNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.declarationDate || '—'}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.declarationCategory ?? 'Freezone Export'}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.importerCode || '—'}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>N/A</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] whitespace-nowrap"
                          style={{ background: 'rgba(40,167,69,0.10)', color: '#28a745', fontWeight: 500, fontFamily: font }}>Settled</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Uploaded Documents — one accordion per declaration, first one open by default */}
          <Section title="Uploaded Documents" badge={`${docDeclNos.length} declaration${docDeclNos.length !== 1 ? 's' : ''}`}>
            <div className="flex flex-col">
              {docDeclNos.length === 0 ? (
                <p className="text-[16px] px-[16px] py-[16px]" style={{ color: '#697498', fontFamily: font }}>No documents uploaded.</p>
              ) : (
                docDeclNos.map(declNo => (
                  <DocDeclarationCard key={declNo} declNo={declNo} docs={docsByDecl.get(declNo) ?? []}
                    open={openDocDecl.has(declNo)} onToggle={() => toggleDocDecl(declNo)} />
                ))
              )}
            </div>
          </Section>

          {/* Claim Request Versions */}
          <Section title="Claim Request Versions">
            <ClaimRequestVersions rows={versionRows} />
          </Section>
        </div>
      </div>

      <ChargesBreakupModal open={breakupOpen} onClose={() => setBreakupOpen(false)}

        declarations={breakupDeclarations} />


      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center gap-[12px]" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
