import React, { useRef, useState } from 'react';
import { JourneyTable, JourneyTd, JourneyThead, font } from './DeclarationUI';

const MAX_SIZE_MB = 50;

export type DocTypeOption = {
  label: string;
  required?: boolean;
  /** Grey badge naming what is expected — "Copy", "Original", "Any". */
  nature?: string;
  /** Green counter badge, e.g. "2/5" on Passport Copy. */
  count?: string;
  /** Blue "New" badge. */
  isNew?: boolean;
};

export type UploadedDocRow = {
  id: string;
  docType: string;
  authority: string;
  fileName: string;
  fileSize: number;
  uploadedOn: string;
  /** Already on the declaration before this amendment — download only, no delete. */
  locked?: boolean;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  title?: string;
  description?: string;
  /** Authority the files are filed against — named above the list and shown in the table. */
  authority?: string;
  docTypes: DocTypeOption[];
  initialDocs?: UploadedDocRow[];
  /** Extra content rendered inside the left card, below the document types. */
  children?: React.ReactNode;
  /** Numbers the uploaded rows, as the cancel and suspension pages do. */
  numbered?: boolean;
};

/**
 * Upload Documents — Figma 2650:50767. Document types on the left, the uploader on the
 * right, and the uploaded files listed underneath in the Refund & Claims table chrome.
 */
export default function DocumentUploadSection({
  title = 'Upload Documents',
  description = 'Select the document type and upload the file, we will share the documents with authorities.',
  authority = 'Dubai Customs',
  docTypes,
  initialDocs,
  children,
  numbered = false,
}: Props) {
  const [picked, setPicked] = useState<string>(docTypes[0]?.label ?? '');
  const [docs, setDocs] = useState<UploadedDocRow[]>(initialDocs ?? []);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const today = new Date().toLocaleDateString('en-GB');
  const canUpload = !!picked;

  const handleFile = (f: File) => {
    if (!canUpload || f.size > MAX_SIZE_MB * 1024 * 1024) return;
    counter.current += 1;
    setDocs((prev) => [...prev, {
      id: `${f.name}-${counter.current}`, docType: picked, authority,
      fileName: f.name, fileSize: f.size, uploadedOn: today,
    }]);
  };

  const removeDoc = (id: string) => setDocs((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="flex flex-col gap-[20px]" style={{ fontFamily: font }}>
      <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

        {/* Left card — document types */}
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
          style={{ flex: '0 0 calc(66% - 8px)', minWidth: 300, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

          <div className="flex flex-col gap-[4px]">
            <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{title}</p>
            <p className="text-[16px] text-[#455174]">{description}</p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{authority}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[8px]">
              {docTypes.map((o) => {
                const active = picked === o.label;
                return (
                  <label
                    key={o.label}
                    className="flex items-center gap-[10px] px-[12px] py-[12px] rounded-[6px] cursor-pointer transition-colors"
                    style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}
                  >
                    <input
                      type="radio"
                      name="docType"
                      checked={active}
                      onChange={() => setPicked(o.label)}
                      className="size-[17px] flex-shrink-0"
                      style={{ accentColor: '#1360d2' }}
                    />
                    <span className="flex items-center flex-wrap gap-[6px] min-w-0">
                      <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                        {o.required && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}
                        {o.label}
                      </span>
                      {o.nature && (
                        <span className="text-[14px] px-[6px] py-[1px] rounded-[4px] whitespace-nowrap"
                          style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500 }}>
                          {o.nature}
                        </span>
                      )}
                      {o.count && (
                        <span className="text-[12px] px-[8px] py-[1px] rounded-[10px] whitespace-nowrap"
                          style={{ background: '#e4f6e9', color: '#219653', fontWeight: 600 }}>{o.count}</span>
                      )}
                      {o.isNew && (
                        <span className="text-[12px] px-[8px] py-[1px] rounded-[10px] whitespace-nowrap"
                          style={{ background: '#1360d2', color: '#fff', fontWeight: 600 }}>New</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {children}
        </div>

        {/* Right card — uploader; kept to its own compact width rather than stretched */}
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
          style={{ flex: '0 0 calc(34% - 8px)', minWidth: 260, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>

          <div className="flex flex-col gap-[8px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Upload File</p>
            <p className="text-[16px] text-[#455174]">
              <span style={{ color: '#dc3545' }}>*</span>Supported file type of .pdf, .jpg etc , max file size up to {MAX_SIZE_MB}MB
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); if (canUpload) setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f && canUpload) handleFile(f);
            }}
            className="flex flex-col items-center justify-center gap-[12px] rounded-[6px] py-[32px] px-[16px] transition-colors"
            style={{
              border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`,
              background: dragging ? '#edf3ff' : '#fbfcfe',
              cursor: canUpload ? 'default' : 'not-allowed',
              opacity: canUpload ? 1 : 0.6,
            }}
          >
            <div className="size-[54px] rounded-full inline-flex items-center justify-center" style={{ background: '#eef1f6' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[16px] text-[#6d707e]">Drag and drop or</p>
            <button type="button" data-secondary-btn disabled={!canUpload}
              onClick={() => canUpload && fileInputRef.current?.click()}
              className="h-[42px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, cursor: canUpload ? 'pointer' : 'not-allowed' }}>
              Choose File
            </button>
          </div>

          <input ref={fileInputRef} type="file"
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      </div>

      {/* Uploaded files */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[10px]">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Documents Uploaded</p>
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]"
            style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500 }}>
            {docs.length} file{docs.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {docs.length === 0 ? (
            <p className="text-[16px] text-[#697498] text-center" style={{ padding: '32px 16px' }}>No files uploaded yet.</p>
          ) : (
            <JourneyTable minWidth={900}>
              <JourneyThead columns={[
                ...(numbered ? [{ label: '', w: 56, filter: false }] : []),
                { label: 'Document Name' }, { label: 'Authority Name' }, { label: 'Document Type' },
                { label: 'Uploaded size' }, { label: 'Uploaded on' }, { label: 'Action', w: 110, filter: false },
              ]} />
              <tbody>
                {docs.map((d, i) => (
                  <tr key={d.id}>
                    {numbered && <JourneyTd first width={56}>{i + 1}</JourneyTd>}
                    <JourneyTd first={!numbered}>{d.fileName}</JourneyTd>
                    <JourneyTd>{d.authority}</JourneyTd>
                    <JourneyTd>{d.docType}</JourneyTd>
                    <JourneyTd>{d.fileSize ? formatBytes(d.fileSize) : '50 MB'}</JourneyTd>
                    <JourneyTd>{d.uploadedOn}</JourneyTd>
                    <JourneyTd>
                      <span className="flex items-center gap-[16px]">
                        {!d.locked && (
                          <button type="button" aria-label={`Delete ${d.fileName}`} onClick={() => removeDoc(d.id)}
                            className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#dc3545' }}>
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12M9 8v6M11 8v6" />
                            </svg>
                          </button>
                        )}
                        <button type="button" aria-label={`Download ${d.fileName}`}
                          className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#1360d2' }}>
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
                          </svg>
                        </button>
                      </span>
                    </JourneyTd>
                  </tr>
                ))}
              </tbody>
            </JourneyTable>
          )}
        </div>
      </div>
    </div>
  );
}
