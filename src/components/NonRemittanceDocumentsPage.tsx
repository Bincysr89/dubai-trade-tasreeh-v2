import React, { useEffect, useRef, useState } from 'react';
import SaveExitModal from './SaveExitModal';
import BackToListingBar from './BackToListingBar';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import type { Row } from './EligibleDeclarationsPage';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MAX_SIZE_MB = 50;
const cloudUploadIcon = 'https://www.figma.com/api/mcp/asset/9e722d4d-9a2d-4d15-bb37-70e5aba612d5';

const MANDATORY_DOCS = [
  { docName: 'Export Bill',              docNature: 'Copy',                 mandatory: true },
  { docName: 'Bill of Entry',            docNature: 'Consignee Claim Copy', mandatory: true },
  { docName: 'Export Declaration',       docNature: 'Copy',                 mandatory: true },
  { docName: 'Exit / Entry Certificate', docNature: 'Original',             mandatory: true },
  { docName: 'Export Manifest',          docNature: 'Copy',                 mandatory: false },
  { docName: 'Other Documents',          docNature: 'Any',                  mandatory: false },
];

export type UploadedDoc = {
  id: string;
  declNo: string;
  docType: string;
  fileName: string;
  fileSize: number;
  uploadedOn: string;
  remarks: string;
  /** Groups the doc-type rows created from a single file upload — a file checked against
      several document types produces one UploadedDoc per type sharing this id, so the
      table can merge them back into a single row with a comma-separated Document Type. */
  batchId?: string;
};

/** Merge doc-type rows that came from the same file upload (same batchId) back into one row,
    with Document Type shown as a comma-separated list — a file uploaded against multiple
    document types is one physical file, so the table should show one row per file, not one
    per type. */
export function mergeDocsByBatch<T extends { id: string; docType: string; batchId?: string }>(docs: T[]): T[] {
  const order: string[] = [];
  const groups = new Map<string, T[]>();
  docs.forEach(doc => {
    const key = doc.batchId ?? doc.id;
    if (!groups.has(key)) { order.push(key); groups.set(key, []); }
    groups.get(key)!.push(doc);
  });
  return order.map(key => {
    const group = groups.get(key)!;
    return { ...group[0], docType: group.map(g => g.docType).join(', ') };
  });
}

type Props = {
  rows: Row[];
  onBack: () => void;
  onContinue: () => void;
  onBackToListing: () => void;
  onUploadedDocsChange?: (docs: UploadedDoc[]) => void;
  /** Overrides for reuse outside the raise-new-claim flow (e.g. amend claim, refund of deposits). */
  title?: string;
  badge?: string;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
  initialDocs?: UploadedDoc[];
  /** Amend flow: hide the Save & Exit button. */
  hideSaveExit?: boolean;
  /** Overrides "Declaration" throughout (field label, dropdown, grouped-docs headers) —
      e.g. "Auction Lot" for the Refund on Auction Proceed flow. */
  itemLabel?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── One declaration's accordion row — mirrors DocDeclarationCard from the
       View Claim pages (RefundDepositsClaimViewPage.tsx / NonRemittanceClaimViewPage.tsx),
       with an optional Delete action alongside Download when onRemove is supplied. ─── */
function DocAccordionRow({ declNo, docs, itemLabel, open, onToggle, onRemove }: {
  declNo: string; docs: UploadedDoc[]; itemLabel: string; open: boolean; onToggle: () => void; onRemove?: (id: string) => void;
}) {
  return (
    <div style={{ borderTop: '1px solid #eef1f6' }}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-[10px] px-[20px] py-[14px] text-left transition-colors hover:bg-[#f8fafd]"
        style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: FONT }}>
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, fontFamily: FONT }}>{itemLabel} No. {declNo}</span>
        <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: FONT }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: FONT, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
      </button>
      {open && (
        <div className="px-[20px] pb-[16px] pt-[4px]" style={{ borderTop: '1px solid #f5f7fc' }}>
          {docs.length === 0 ? (
            <p className="text-[15px] text-[#697498] text-center" style={{ padding: '20px 0', fontFamily: FONT }}>No files uploaded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: FONT, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Document Type', 'File Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: FONT, fontWeight: 600 }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: FONT }}>{doc.docType}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <div className="flex flex-col gap-[1px]">
                          <span className="text-[16px]" style={{ color: '#051937', fontFamily: FONT }}>{doc.fileName}</span>
                          <span className="text-[13px] text-[#697498]">{formatBytes(doc.fileSize)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: FONT }}>{doc.uploadedOn}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#697498', fontFamily: FONT }}>{doc.remarks || '—'}</span></td>
                      <td style={{ padding: '10px 14px' }}>
                        <div className="flex items-center gap-[8px]">
                          <button
                            title="Download"
                            onClick={() => {}}
                            className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                            style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}
                          >
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                            </svg>
                          </button>
                          {onRemove && (
                            <button
                              title="Delete"
                              onClick={() => onRemove(doc.id)}
                              className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#fef2f2] transition-colors"
                              style={{ border: '1px solid #f3d0d3', color: '#dc3545' }}
                            >
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Uploaded documents, grouped by declaration ─────────────────────
   Every attachment belongs to a specific declaration in the claim, so instead of one
   flat table mixing every declaration together, each declaration gets its own accordion
   row — the customer can see at a glance which files were uploaded against which record.
   Mirrors the accordion pattern used by the View Claim pages' Uploaded Documents section.
   Reused read-only (no onRemove) on the Review step. */
export function UploadedDocsByDeclaration({ docs, declOrder, onRemove, itemLabel = 'Declaration' }: {
  docs: UploadedDoc[]; declOrder?: string[]; onRemove?: (id: string) => void;
  /** Overrides "Declaration" in "Declaration No. {x}" — e.g. "Auction Lot" for the Refund on Auction Proceed flow. */
  itemLabel?: string;
}) {
  const groups = new Map<string, UploadedDoc[]>();
  docs.forEach(doc => {
    const list = groups.get(doc.declNo) ?? [];
    list.push(doc);
    groups.set(doc.declNo, list);
  });
  // Merge doc-type rows from the same file upload — the file count and table below
  // should both count physical files, not one row per document type.
  groups.forEach((list, declNo) => groups.set(declNo, mergeDocsByBatch(list)));
  const orderedDeclNos = [
    ...(declOrder ?? []).filter(d => groups.has(d)),
    ...Array.from(groups.keys()).filter(d => !(declOrder ?? []).includes(d)),
  ];
  const [openDecl, setOpenDecl] = useState<Set<string>>(() => new Set(orderedDeclNos.slice(0, 1)));
  const toggleDecl = (declNo: string) => setOpenDecl(prev => {
    const next = new Set(prev);
    next.has(declNo) ? next.delete(declNo) : next.add(declNo);
    return next;
  });

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[4px]">
        <div className="flex items-center gap-[10px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: FONT }}>
            {orderedDeclNos.length} {itemLabel.toLowerCase()}{orderedDeclNos.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-[16px] text-[#697498]">Attachments uploaded against each {itemLabel.toLowerCase()} in this claim.</p>
      </div>

      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
        {orderedDeclNos.length === 0 ? (
          <p className="text-[15px] text-[#697498] text-center" style={{ padding: '32px 16px', fontFamily: FONT }}>No files uploaded yet.</p>
        ) : (
          orderedDeclNos.map(declNo => (
            <DocAccordionRow key={declNo} declNo={declNo} docs={groups.get(declNo) ?? []} itemLabel={itemLabel}
              open={openDecl.has(declNo)} onToggle={() => toggleDecl(declNo)} onRemove={onRemove} />
          ))
        )}
      </div>
    </div>
  );
}

function DeclDropdown({ value, options, onChange, itemLabel = 'Declaration' }: { value: string; options: string[]; onChange: (v: string) => void; itemLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" style={{ minWidth: 240 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-[12px] bg-white rounded-[4px]"
        style={{ height: 44, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: FONT }}>
        <span className="text-[15px]" style={{ color: value ? '#051937' : '#697498' }}>
          {value || `Select ${itemLabel} Number`}
        </span>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#697498" strokeWidth="2"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 48, boxShadow: '0px 4px 16px rgba(0,0,0,0.13)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[14px] py-[10px] text-[15px] cursor-pointer hover:bg-[#e8f0ff] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: FONT }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NonRemittanceDocumentsPage({ rows, onBack, onContinue, onBackToListing, onUploadedDocsChange, title, badge, steps, activeIndex = 1, initialDocs, hideSaveExit = false, itemLabel = 'Declaration' }: Props) {
  const [selectedDecl, setSelectedDecl] = useState<string>(rows[0]?.declarationNo ?? '');
  const [selectedDocTypes, setSelectedDocTypes] = useState<Set<string>>(new Set());
  const toggleDocType = (docName: string) => setSelectedDocTypes(prev => {
    const next = new Set(prev);
    if (next.has(docName)) next.delete(docName); else next.add(docName);
    return next;
  });
  const [remarks, setRemarks] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(initialDocs ?? []);
  const updateDocs = (fn: (prev: UploadedDoc[]) => UploadedDoc[]) => {
    setUploadedDocs(prev => { const next = fn(prev); onUploadedDocsChange?.(next); return next; });
  };
  // Pre-seeded docs (amend flow) start in local state only — sync them up once so the
  // parent's uploadedDocs (used by the Review step) knows about them without a user action.
  useEffect(() => { if (initialDocs && initialDocs.length > 0) onUploadedDocsChange?.(initialDocs); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [dragging, setDragging] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let docCounter = 0;

  const today = new Date().toLocaleDateString('en-GB');

  const handleFile = (f: File) => {
    if (!selectedDecl || selectedDocTypes.size === 0) return;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return;
    const declAtUpload = selectedDecl;
    docCounter += 1;
    const batchId = `${f.name}-${f.size}-${docCounter}`;
    const newDocs = Array.from(selectedDocTypes).map(docType => ({
      id: `${batchId}-${docType}`,
      declNo: declAtUpload,
      docType,
      fileName: f.name,
      fileSize: f.size,
      uploadedOn: today,
      remarks: remarks.trim(),
      batchId,
    }));
    updateDocs(prev => [...prev, ...newDocs]);
    setRemarks('');
  };

  /* Removing one merged row (one file) drops every doc-type entry uploaded alongside it. */
  const removeDoc = (id: string) => updateDocs(prev => {
    const key = prev.find(d => d.id === id)?.batchId ?? id;
    return prev.filter(d => (d.batchId ?? d.id) !== key);
  });

  const canUpload = !!selectedDecl && selectedDocTypes.size > 0;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 flex items-center gap-[16px] flex-wrap mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Non Remittance'}</h1>
          <span className="text-[16px] px-[10px] py-[3px] rounded-[4px]"
            style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {badge ?? 'Non Remittance'}
          </span>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? NR_CLAIM_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">

          {/* Two cards side by side */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

            {/* Left card — Declaration + Doc type + Remarks */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
              style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[16px] text-[#697498]">Select the declaration number, choose the document type and upload the supporting file.</p>
              </div>

              {/* Declaration dropdown + Remarks — one row */}
              <div className="flex gap-[16px] flex-wrap sm:flex-nowrap">
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{itemLabel} Number</label>
                  <DeclDropdown
                    value={selectedDecl}
                    options={rows.map(r => r.declarationNo)}
                    onChange={(v) => { setSelectedDecl(v); setSelectedDocTypes(new Set()); setRemarks(''); }}
                    itemLabel={itemLabel}
                  />
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                    Remarks <span style={{ color: '#697498', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter remarks for this document…"
                    rows={3}
                    className="w-full rounded-[4px] text-[16px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[12px] py-[10px] resize-y focus:outline-none focus:border-[#1360d2] transition-colors"
                    style={{ border: '1px solid #d5ddfb', fontFamily: FONT, lineHeight: '22px' }}
                  />
                </div>
              </div>

              {/* Document types — shown after declaration selected */}
              {selectedDecl ? (
                <>
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Document Type <span style={{ color: '#697498', fontWeight: 400 }}>(select all that apply)</span></p>
                    <div className="grid grid-cols-2 gap-x-[12px] gap-y-[8px]">
                      {MANDATORY_DOCS.map(doc => {
                        const active = selectedDocTypes.has(doc.docName);
                        const uploaded = uploadedDocs.filter(u => u.declNo === selectedDecl && u.docType === doc.docName).length;
                        return (
                          <label
                            key={doc.docName}
                            onClick={() => toggleDocType(doc.docName)}
                            className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                            style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}
                          >
                            <span className="size-[17px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                              style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: active ? '#1360d2' : '#fff' }}>
                              {active && <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                            </span>
                            <input type="checkbox" className="sr-only" name="doc-type" value={doc.docName}
                              checked={active} onChange={() => toggleDocType(doc.docName)} />
                            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-[5px]">
                                <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                                  {doc.mandatory && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}
                                  {doc.docName}
                                </span>
                                <span className="text-[14px] px-[6px] py-[1px] rounded-[4px]"
                                  style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500, whiteSpace: 'nowrap' as const }}>
                                  {doc.docNature}
                                </span>
                              </div>
                            </div>
                            {uploaded > 0 && (
                              <span className="text-[11px] px-[6px] py-[1px] rounded-[10px] flex-shrink-0"
                                style={{ background: 'rgba(26,172,114,0.12)', color: '#1aac72', fontWeight: 600 }}>
                                {uploaded}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </>
              ) : (
                <p className="text-[16px] text-[#b0b8d0]">Select a declaration number to view required documents.</p>
              )}
            </div>

            {/* Right card — File uploader */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
              </div>

              {!canUpload && (
                <p className="text-[16px] text-[#b45309] px-[12px] py-[8px] rounded-[4px]"
                  style={{ background: '#fff8e6', border: '1px solid #f5d67a' }}>
                  {!selectedDecl ? 'Select a declaration first' : 'Select a document type to upload'}
                </p>
              )}

              <div
                onDragOver={e => { e.preventDefault(); if (canUpload) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault(); setDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f && canUpload) handleFile(f);
                }}
                className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors flex-1"
                style={{
                  border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`,
                  background: dragging ? '#edf3ff' : '#f8fafd',
                  cursor: canUpload ? 'default' : 'not-allowed',
                  opacity: canUpload ? 1 : 0.6,
                }}
              >
                <div className="size-[56px] rounded-full inline-flex items-center justify-center"
                  style={{ background: dragging ? '#d8e8ff' : '#e2ebf9' }}>
                  <img src={cloudUploadIcon} alt="" style={{ width: 26, height: 24 }} />
                </div>
                <p className="text-[16px] text-[#697498] text-center" style={{ lineHeight: 1.5 }}>Drag and drop or</p>
                <button type="button" disabled={!canUpload}
                  onClick={() => canUpload && fileInputRef.current?.click()}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                  style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: FONT, fontWeight: 500, background: '#fff', cursor: canUpload ? 'pointer' : 'not-allowed' }}>
                  Choose File
                </button>
              </div>

              <input ref={fileInputRef} type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,application/pdf,image/jpeg,image/png"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* Uploaded documents — grouped by declaration so it's clear which attachments belong to which record */}
          {uploadedDocs.length > 0 && (
            <UploadedDocsByDeclaration docs={uploadedDocs} declOrder={rows.map(r => r.declarationNo)} onRemove={removeDoc} itemLabel={itemLabel} />
          )}

          <ClaimantBrokerDetail />

        </div>
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <div className="flex items-center gap-[12px]">
            {!hideSaveExit && (
              <button data-secondary-btn onClick={() => setShowSaveModal(true)}
                className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: FONT, fontWeight: 500 }}>
                Save &amp; Exit
              </button>
            )}
            <button onClick={onContinue}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', fontFamily: FONT, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Proceed
            </button>
          </div>
        }
      />
      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing} />}
    </div>
  );
}
