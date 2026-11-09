import React, { useState } from 'react';
import HappinessMeterBar from './HappinessMeterBar';
import { ColumnFilter } from './ColumnFilter';

const font = "'Dubai', sans-serif";

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#6d707e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20v-8M12 16l4-4 4 4" />
      <path d="M8 24a6 6 0 0 1-2-11.6A8 8 0 0 1 22 8a6 6 0 0 1 2 11.6" />
    </svg>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[12px] py-[12px] px-[12px]" style={{ flex: '1 1 260px', minWidth: 220 }}>
      <span className="text-[16px]" style={{ color: '#696f83', fontFamily: font }}>{label}</span>
      <span className="text-[16px] font-semibold" style={{ color: '#051937', fontFamily: font }}>{value}</span>
    </div>
  );
}

const DOC_ROWS = [
  { name: 'Invoice 12124.PDF',   type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024', canDelete: true },
  { name: 'Invoice 898486.xls',  type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024', canDelete: true },
  { name: 'Invoice 189777.xls',  type: 'Invoice',               size: '50 MB', date: '08-12-2024', canDelete: false },
  { name: 'Invoice.xls',         type: 'Invoice',               size: '50 MB', date: '08-12-2024', canDelete: false },
];

const DOC_TYPES = [
  { docName: 'Packing List',    docNature: 'Copy', mandatory: true  },
  { docName: 'BOL',             docNature: 'Copy', mandatory: false },
  { docName: 'Other Documents', docNature: 'Any',  mandatory: false },
];

const OTHER_DOC_TYPES = ['Certificate of Origin', 'Insurance Certificate', 'Bank Guarantee', 'Other'];

/* Plain bordered dropdown — used for the Other Documents type detail (dropdown, not free text). */
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

const REQUEST_DETAILS = [
  { label: 'Request Date',             value: '08/07/2026' },
  { label: 'Request Status',           value: 'Suspended' },
  { label: 'Requesting Business Unit', value: 'Refund and claim' },
  { label: 'Requested By',             value: 'RNSMANAGER1' },
  { label: 'Doc Delivery Method',      value: 'Uploading' },
  { label: 'Requested Notes',          value: 'additional information request' },
];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
  onSubmit: () => void;
  /** Overrides for reuse outside the Cargo Transfer flow (e.g. Refund & Claims). */
  breadcrumbParent?: string;
  title?: string;
  /** When set, submitting shows an internal success screen instead of calling onSubmit directly. */
  successHeading?: string;
  successMessage?: string;
  requestNumber?: string;
};

export default function SuspensionResponsePage({ onBack, onBackToListing, onSubmit, breadcrumbParent = 'Cargo Transfer', title = 'Suspension Response - CT - 601232423898', successHeading, successMessage, requestNumber = '2588017' }: Props) {
  const [response, setResponse] = useState('');
  const [selectedDocTypes, setSelectedDocTypes] = useState<Set<string>>(new Set());
  const [otherDocType, setOtherDocType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const toggleDocType = (name: string) => setSelectedDocTypes(prev => {
    const next = new Set(prev);
    if (next.has(name)) next.delete(name); else next.add(name);
    return next;
  });

  const handleSubmit = () => { if (successHeading) setSubmitted(true); else onSubmit(); };

  if (submitted && successHeading) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
        <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[16px] pb-[8px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Suspension Response</span>
        </div>
        <div className="flex-1 overflow-auto px-4 sm:px-10 py-[24px]">
          <h1 className="text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>{title}</h1>
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[28px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="44" fill="#28A745" />
              <path d="M30 51 l13 13 27-29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontWeight: 500 }}>{successHeading}</p>
            <p className="text-[16px] text-[#696f83] text-center max-w-[640px]" style={{ lineHeight: 1.5 }}>
              {successMessage ?? 'Your suspension response has been submitted successfully and is currently under processing.'}
            </p>
            <div className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[16px] text-[#696f83]">Claim Request Number:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>{requestNumber}</span>
            </div>
            <button
              onClick={onBackToListing ?? onSubmit}
              className="h-[52px] px-[32px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Back to Listing
            </button>
          </div>
        </div>
        <HappinessMeterBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb — sticky */}
      <div className="flex-shrink-0 bg-[#f8fafd]">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button
              onClick={onBackToListing ?? onBack}
              className="text-[16px] text-[#8f94ae] hover:underline"
              style={{ fontFamily: font }}
            >
              Home
            </button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>{breadcrumbParent}</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Suspension Response</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        {/* Page title */}
        <div className="flex items-center gap-[16px] mb-[8px]">
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font }}>
            {title}
          </h1>
          <span className="text-[16px] font-medium px-[12px] py-[4px] rounded-[4px]" style={{ background: 'rgba(220,53,69,0.10)', color: '#dc3545', fontFamily: font }}>
            Suspended
          </span>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Additional Information Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Additional Information Request Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                {REQUEST_DETAILS.map(f => <InfoCard key={f.label} label={f.label} value={f.value} />)}
              </div>
            </div>
          </div>

          {/* Response */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Response</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <label className="text-[16px] mb-[8px] block" style={{ color: '#696f83', fontFamily: font }}>
                <span className="text-[#ea2428]">* </span>Response Description
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={3}
                placeholder="Enter Response Description"
                className="w-full border rounded-[4px] px-[16px] py-[12px] text-[16px] text-[#0e1b3d] resize-none focus:outline-none transition-colors"
                style={{ borderColor: '#d5ddfb', fontFamily: font, maxWidth: 720 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#1360d2'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#d5ddfb'; }}
              />
            </div>
          </div>

          {/* Upload Documents — same design as the new claim upload flow */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

            {/* Left card — Doc type + Remarks */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
              style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[16px] text-[#697498]">Choose the document type and upload the supporting file.</p>
              </div>

              {/* Document types — checkboxes, same pattern as the raise new claim flow */}
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
                        <input type="checkbox" className="sr-only" name="doc-type" value={doc.docName}
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
                {/* Other Documents checked — document type detail is a dropdown, not free text */}
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

            {/* Right card — File uploader */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] flex-1"
                style={{ border: '1.5px dashed #b5c8e8', background: '#f8fafd' }}>
                <div className="size-[56px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
                  <CloudUploadIcon />
                </div>
                <p className="text-[16px] text-[#697498] text-center">Drag and drop or</p>
                <button type="button"
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px]"
                  style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="bg-white rounded-[8px] px-[14px] pt-[24px] pb-[20px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 className="text-[24px] font-medium text-[#051937] mb-[20px]" style={{ fontFamily: font }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ width: 60, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '8px 0 0 0', paddingLeft: 16 }} />
                    {[
                      { label: 'Document Name',  w: 255 },
                      { label: 'Document Type',  w: 296 },
                      { label: 'Uploaded size',  w: 240 },
                      { label: 'Uploaded on',    w: 312 },
                    ].map((col) => (
                      <th key={col.label} style={{ width: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left' }}>
                        <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                      </th>
                    ))}
                    <th style={{ width: 169, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>
                      <span className="text-[16px] text-[#051937] font-medium">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOC_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: '16px 8px 16px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#051937]">{i + 1}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.name}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.type}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.size}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#051937]">{row.date}</span>
                      </td>
                      <td style={{ padding: '16px 8px', verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-[16px]">
                          {row.canDelete && (
                            <button className="hover:opacity-70 transition-opacity"><DeleteIcon /></button>
                          )}
                          <button className="hover:opacity-70 transition-opacity"><DownloadIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom navigation — sticky */}
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
            onClick={handleSubmit}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
