import React, { useState } from 'react';
import { ColumnFilter } from './ColumnFilter';

const DOC_TYPES = [
  { label: 'Passport Copy', count: 2 },
  { label: 'Trade License copy', count: 0 },
  { label: 'Certificate Of Origin issued by the Ministry', count: 0 },
  { label: 'Organizational Structure/Profile Copy', count: 0 },
  { label: 'Invoice Consumption Request Letter', count: 0 },
  { label: 'Letter of Undertaking for Shipping Agent', count: 0 },
];

const UPLOADED_ROWS = [
  { name: 'Passport Copy',                         type: 'Invoice Consumption Requ..', size: '50 MB', date: '08-12-2024' },
  { name: 'Trade License copy',                    type: 'Trade License Copy',         size: '50 MB', date: '08-12-2024' },
  { name: 'Certificate Of Origin...',              type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Organizational Structure/Profile Copy', type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Invoice Consumption Request Letter',    type: 'Cert. of Origin',            size: '50 MB', date: '08-12-2024' },
  { name: 'Laboratory 123234.pdf',                 type: 'Laboratory Results',         size: '50 MB', date: '08-12-2024' },
];

const TABLE_COLS = ['Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'];

type Props = { onBack: () => void; onProceed: () => void };

export default function CargoTransferDocumentPage({ onBack, onProceed }: Props) {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [dragging, setDragging] = useState(false);

  const font = "'Dubai', sans-serif";

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
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[40px]">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>
          Cargo Transfer - New Request
        </h1>
        <div className="flex flex-col gap-[24px]">

          {/* Upload row — Upload Documents (66%) + Upload File (28%) */}
          <div className="flex gap-[24px]">
            {/* Upload Documents card — 66% width */}
            <div className="bg-white rounded-[8px] p-[24px]" style={{ flex: '0 0 66%', boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.08)' }}>
              <h2 className="text-[24px] text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Documents</h2>
              <p className="text-[16px] text-[#323c64] mb-[20px]" style={{ fontFamily: font }}>
                Select the document type and upload the file, we will share the documents with authorities.
              </p>
              <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font, fontWeight: 600 }}>Dubai Customs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
                {DOC_TYPES.map((d, i) => (
                  <label key={i} className="flex items-center gap-[12px] cursor-pointer select-none">
                    <div
                      onClick={() => setSelectedDoc(i)}
                      className="flex-shrink-0 size-[20px] rounded-full border-[2px] flex items-center justify-center transition-colors"
                      style={{ borderColor: selectedDoc === i ? '#1360d2' : '#d5ddfb' }}
                    >
                      {selectedDoc === i && <div className="size-[10px] rounded-full bg-[#1360d2]" />}
                    </div>
                    <span className="text-[16px] text-[#0e1b3d] flex-1" style={{ fontFamily: font }}>
                      {i === 0 && <span style={{ color: '#dc3545' }}>*</span>}{d.label}
                    </span>
                    {d.count > 0 && (
                      <span className="text-[12px] px-[8px] py-[2px] rounded-[4px]" style={{ background: '#c8f4d2', color: '#219653', fontFamily: font, fontWeight: 500 }}>
                        {d.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <p className="text-[12px] text-[#697498] mt-[16px]" style={{ fontFamily: font }}>
                *Number in this <span className="px-[6px] py-[1px] rounded" style={{ background: '#c8f4d2', color: '#219653' }}>2</span> Indicates the number of documents uploaded
              </p>
            </div>

            {/* Upload File card — 28% width */}
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ flex: '0 0 28%', boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.08)' }}>
              <h2 className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Upload File</h2>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[16px] text-[#323c64]" style={{ fontFamily: font }}>*Supported file type of .pdf, .jpg etc, max file size up to 50MB</p>
                <p className="text-[16px] text-[#323c64]" style={{ fontFamily: font }}>*Only 05 number of files are allowed</p>
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className="flex-1 min-h-[140px] flex flex-col items-center justify-center gap-[12px] rounded-[8px] transition-colors"
                style={{
                  background: dragging ? '#e2ebf9' : '#f8fafd',
                  border: `2px dashed ${dragging ? '#1360d2' : '#8f94ae'}`,
                }}
              >
                <div className="size-[48px] rounded-full bg-[#e2ebf9] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Drag and drop or</p>
                <button data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[20px] py-[8px] text-[16px] text-[#1360d2] transition-colors" style={{ fontFamily: font }}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Documents Uploaded table */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.08)' }}>
            <h2 className="text-[24px] text-[#0e1b3d] mb-[20px]" style={{ fontFamily: font, fontWeight: 500 }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {TABLE_COLS.map((col, idx) => (
                      <th key={col} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : idx === TABLE_COLS.length - 1 ? '0 8px 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 12 }}>
                        {col === 'Action' ? (
                          <span className="text-[16px] text-[#051937] font-semibold whitespace-nowrap" style={{ fontFamily: font }}>{col}</span>
                        ) : (
                          <ColumnFilter label={col} labelClass="text-[16px] font-medium text-[#051937]" />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UPLOADED_ROWS.map((row, i) => (
                    <tr key={i}>
                      {[row.name, row.type, row.size, row.date].map((val, j) => (
                        <td key={j} style={{ background: '#fff', padding: j === 0 ? '10px 12px 10px 16px' : '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{val}</span>
                        </td>
                      ))}
                      <td style={{ background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                        <div className="flex items-center gap-[16px]">
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#fdf2f3] transition-colors" title="Delete">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                            </svg>
                          </button>
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors" title="Download">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v13M7 11l5 5 5-5" /><path d="M3 20h18" />
                            </svg>
                          </button>
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

      {/* Bottom nav */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]"
        style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] border transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back
        </button>
        <button
          onClick={onProceed}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
