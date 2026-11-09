import React from 'react';
import { ColumnFilter } from './ColumnFilter';

const font = "'Dubai', sans-serif";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[12px] py-[12px] px-[12px]" style={{ width: 307, minWidth: 200 }}>
      <span className="text-[16px]" style={{ color: '#696f83', fontFamily: font }}>{label}</span>
      <span className="text-[16px] font-semibold" style={{ color: '#051937', fontFamily: font }}>{value}</span>
    </div>
  );
}

const DOC_ROWS = [
  { name: 'Invoice 12124.PDF',   type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 898486.xls',  type: 'Certificate of Origin', size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 189777.xls',  type: 'Invoice',               size: '50 MB', date: '08-12-2024' },
  { name: 'Invoice.xls',         type: 'Invoice',               size: '50 MB', date: '08-12-2024' },
];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
};

export default function SuspensionHistoryViewPage({ onBack, onBackToListing }: Props) {
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
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Cargo Transfer</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <button
              onClick={onBack}
              className="text-[16px] text-[#8f94ae] hover:underline"
              style={{ fontFamily: font }}
            >
              Suspension History
            </button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>View</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        {/* Page title */}
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 8 }}>
          Suspension History - CT - 601232423898
        </h1>
        <div className="flex flex-col gap-[24px]">

          {/* Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Request Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="To" value="AE123 Companies" />
                <InfoCard label="CDM Comments" value="Please upload Documents" />
                <InfoCard label="Customer Response" value="Lorum Ispum" />
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
                      { label: 'Document Name',   w: 255 },
                      { label: 'Document Type',   w: 296 },
                      { label: 'Uploaded size',   w: 240 },
                      { label: 'Uploaded on',     w: 312 },
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
                        <button className="hover:opacity-70 transition-opacity"><DownloadIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CDM Contact Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>CDM Contact Details</h2>
            <div className="bg-white rounded-[8px] px-[20px] py-[32px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="Contact Section Name" value="Customs Declaration Management" />
                <InfoCard label="Phone Number" value="04-34567890" />
                <InfoCard label="Fax Number" value="04-5876888" />
                <InfoCard label="Contact Time" value="08:00 - 14:00" />
                <InfoCard label="Contact Location" value="Dubai Customs HQ, Port Rashid, Dubai" />
                <InfoCard label="Contact Department" value="Customs Declaration Management" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom navigation — sticky */}
      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
