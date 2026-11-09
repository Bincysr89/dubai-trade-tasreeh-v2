import React, { useState } from 'react';
import ClaimStepper, { VALIDITY_EXT_STEPS } from './ClaimStepper';
import Dh from './Dh';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

export type ExtensionDetails = { rows: { declarationNo: string; depositType: string; days: string }[]; reason: string; documents: { name: string; sizeKb: string }[] };
type UploadedFile = { id: string; name: string; sizeKb: string };
const formatSizeKb = (bytes: number) => `${Math.max(0.1, bytes / 1024).toFixed(1)}`;

const DOC_TYPES = [
  { docName: 'Supporting Letter', docNature: 'Copy', mandatory: true  },
  { docName: 'Extension Justification', docNature: 'Copy', mandatory: false },
  { docName: 'Other Documents', docNature: 'Any',  mandatory: false },
];
const OTHER_DOC_TYPES = ['Certificate of Origin', 'Insurance Certificate', 'Bank Guarantee', 'Other'];

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};

function CloudUploadIcon() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#6d707e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20v-8M12 16l4-4 4 4" />
      <path d="M8 24a6 6 0 0 1-2-11.6A8 8 0 0 1 22 8a6 6 0 0 1 2 11.6" />
    </svg>
  );
}

/* Plain bordered dropdown — Other Documents type detail (dropdown, not free text). */
function PlainSelect({ value, onChange, options, placeholder = 'Select document type' }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center px-[12px]"
        style={{ height: 44, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font, background: '#fff', cursor: 'pointer' }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: value ? '#0e1b3d' : '#697498' }}>{value || placeholder}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 48, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontWeight: opt === value ? 500 : 400, fontFamily: font }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Props = {
  rows: Row[];
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: (details: ExtensionDetails) => void;
  onDeclarationOpen?: (declNo: string) => void;
};

export default function ValidityExtensionDetailsPage({ rows, onBack, onBackToListing, onProceed, onDeclarationOpen }: Props) {
  const [daysByDecl, setDaysByDecl] = useState<Record<string, string>>({});
  const [reason, setReason] = useState('');
  const [selectedDocTypes, setSelectedDocTypes] = useState<Set<string>>(new Set());
  const [otherDocType, setOtherDocType] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
  const toggleDocType = (name: string) => setSelectedDocTypes(prev => {
    const next = new Set(prev);
    if (next.has(name)) next.delete(name); else next.add(name);
    return next;
  });
  const addUploadFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 10 - uploadFiles.length).map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name, sizeKb: formatSizeKb(f.size) }));
    setUploadFiles(p => [...p, ...next]);
  };
  const removeUploadFile = (id: string) => setUploadFiles(p => p.filter(f => f.id !== id));
  const canProceed = rows.length > 0 && rows.every(r => (daysByDecl[`${r.declarationNo}__${r.depositType}`] ?? '').trim() !== '') && reason.trim() !== '';
  const ownerName = (row: Row) => row.importerCode ? IMPORTER_CODE_NAMES[row.importerCode] : undefined;
  // A declaration can appear more than once in `rows` (one entry per selected charge type) —
  // the Declaration Details card is shown once per unique Declaration Number.
  const uniqueDeclarations = Array.from(new Map(rows.map(r => [r.declarationNo, r])).values());

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[16px] pb-[8px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim — Claim Time Validity Extension</h1>
        <div className="mb-[24px]">
          <ClaimStepper activeIndex={1} steps={VALIDITY_EXT_STEPS} />
        </div>

        <div className="flex flex-col gap-[24px]">

          {/* Declaration Details — one card per unique selected declaration */}
          {uniqueDeclarations.map(row => (
            <div key={row.declarationNo} className="flex flex-col gap-[14px]">
              <div className="flex items-center justify-between flex-wrap gap-[10px]">
                <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Declaration Details — {row.declarationNo}</h2>
                {onDeclarationOpen && (
                  <button data-secondary-btn
                    type="button"
                    onClick={() => onDeclarationOpen(row.declarationNo)}
                    className="h-[38px] px-[16px] rounded-[4px] border text-[15px] transition-colors"
                    style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
                  >
                    View Declaration
                  </button>
                )}
              </div>
              <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
                  {[
                    { label: 'Declaration Number', value: row.declarationNo },
                    { label: 'Declaration Type',   value: row.declarationCategory ?? '—' },
                    { label: 'Declaration Date',   value: row.declarationDate },
                    { label: 'Declaration Owner',  value: row.importerCode ? `${row.importerCode}${ownerName(row) ? ` - ${ownerName(row)}` : ''}` : '—' },
                    { label: 'Broker',             value: row.brokerCode ? `${row.brokerCode} - ${row.brokerName}` : '—' },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-[4px]">
                      <span className="text-[16px] text-[#697498]">{f.label}</span>
                      <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Request Details</h2>
            <div className="bg-white rounded-[8px] px-[14px] pt-[24px] pb-[20px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 780, fontFamily: font }}>
                  <thead>
                    <tr>
                      {['Declaration Number', 'Charge Type', 'Amount', 'Claim Expiry', 'Export Expiry', 'Extension Required (in days)'].map((h, i) => (
                        <th key={h} style={{ background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRadius: i === 0 ? '8px 0 0 0' : i === 5 ? '0 8px 0 0' : 0, paddingLeft: i === 0 ? 16 : 8 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={`${row.declarationNo}__${row.depositType}`} style={{ borderTop: '1px solid #eef1f6' }}>
                        <td style={{ padding: '16px 8px 16px 16px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{row.declarationNo}</span>
                        </td>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                          <span className="text-[16px] text-[#051937]">{row.depositType}</span>
                        </td>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                          <span className="inline-flex items-center gap-[4px] text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>
                            <Dh style={{ fontSize: 14 }} />{row.depositAmount.replace('Dh ', '')}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                          <span className="text-[16px]" style={{ color: '#dc3545' }}>{row.claimExpiry}</span>
                        </td>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                          <span className="text-[16px]" style={{ color: '#dc3545' }}>{row.exportExpiry}</span>
                        </td>
                        <td style={{ padding: '16px 8px', verticalAlign: 'middle', width: 200 }}>
                          <input
                            type="number"
                            min={1}
                            value={daysByDecl[`${row.declarationNo}__${row.depositType}`] ?? ''}
                            onChange={(e) => setDaysByDecl(prev => ({ ...prev, [`${row.declarationNo}__${row.depositType}`]: e.target.value }))}
                            placeholder="e.g. 30"
                            className="h-[44px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] transition-colors"
                            style={{ borderColor: '#d5ddfb', fontFamily: font }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reason for Extension */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Reason for Extension</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <label className="text-[16px] mb-[8px] block" style={{ color: '#696f83', fontFamily: font }}>
                <span className="text-[#ea2428]">* </span>Extension Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for extension"
                className="w-full border rounded-[4px] px-[16px] py-[12px] text-[16px] text-[#0e1b3d] resize-none focus:outline-none transition-colors"
                style={{ borderColor: '#d5ddfb', fontFamily: font, maxWidth: 720 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#1360d2'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#d5ddfb'; }}
              />
            </div>
          </div>

          {/* Upload Documents — same design as the Suspension Response upload section */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Upload Documents</h2>
            <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">
              <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
                style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                  <p className="text-[16px] text-[#697498]">Choose the document type and upload the supporting file.</p>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Document Type <span style={{ color: '#697498', fontWeight: 400 }}>(select all that apply)</span></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[8px]">
                    {DOC_TYPES.map((doc) => {
                      const active = selectedDocTypes.has(doc.docName);
                      return (
                        <label key={doc.docName} onClick={() => toggleDocType(doc.docName)}
                          className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                          style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}>
                          <span className="size-[17px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                            style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: active ? '#1360d2' : '#fff' }}>
                            {active && <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                          </span>
                          <input type="checkbox" className="sr-only" name="ext-doc-type" value={doc.docName}
                            checked={active} onChange={() => toggleDocType(doc.docName)} />
                          <div className="flex items-center flex-wrap gap-[5px]">
                            <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                              {doc.mandatory && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}{doc.docName}
                            </span>
                            <span className="text-[14px] px-[6px] py-[1px] rounded-[4px]"
                              style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {doc.docNature}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selectedDocTypes.has('Other Documents') && (
                    <div className="flex flex-col gap-[6px] mt-[4px]" style={{ maxWidth: 420 }}>
                      <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                        <span className="text-[#ea2428]">* </span>Document Type
                      </label>
                      <PlainSelect value={otherDocType} onChange={setOtherDocType} options={OTHER_DOC_TYPES} />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
                style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                  <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
                </div>
                <label className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] flex-1 cursor-pointer"
                  style={{ border: '1.5px dashed #b5c8e8', background: '#f8fafd' }}>
                  <input type="file" multiple className="hidden" onChange={(e) => { addUploadFiles(e.target.files); e.target.value = ''; }} />
                  <div className="size-[56px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
                    <CloudUploadIcon />
                  </div>
                  <p className="text-[16px] text-[#697498] text-center">Drag and drop or</p>
                  <span
                    className="h-[40px] px-[20px] rounded-[4px] text-[16px] inline-flex items-center"
                    style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
                    Choose File
                  </span>
                </label>
                {uploadFiles.length > 0 && (
                  <div className="flex flex-col gap-[8px]">
                    {uploadFiles.map(f => (
                      <div key={f.id} className="flex items-center justify-between gap-[10px] rounded-[6px] px-[12px] py-[8px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                        <div className="flex items-center gap-[8px] min-w-0">
                          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.8" className="flex-shrink-0"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3" /></svg>
                          <span className="text-[15px] text-[#0e1b3d] truncate">{f.name}</span>
                          <span className="text-[13px] text-[#8f94ae] flex-shrink-0">{f.sizeKb} KB</span>
                        </div>
                        <button type="button" onClick={() => removeUploadFile(f.id)} aria-label={`Remove ${f.name}`} className="text-[#8f94ae] hover:text-[#dc3545] flex-shrink-0">
                          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center justify-between px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
          <button
            onClick={() => canProceed && onProceed({
              rows: rows.map(r => ({ declarationNo: r.declarationNo, depositType: r.depositType, days: daysByDecl[`${r.declarationNo}__${r.depositType}`] ?? '' })),
              reason,
              documents: uploadFiles.map(f => ({ name: f.name, sizeKb: f.sizeKb })),
            })}
            disabled={!canProceed}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: canProceed ? '#1360d2' : '#a7c3eb', cursor: canProceed ? 'pointer' : 'not-allowed', fontFamily: font }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
