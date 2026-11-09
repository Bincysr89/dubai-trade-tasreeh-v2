import React from 'react';
import InfoNote from './InfoNote';
import { ColumnFilter } from './ColumnFilter';

const font = "'Dubai', sans-serif";

export type SuspensionRequestRow = {
  requestNo: string;
  declNo: string;
  chargeType: string;
  requestNotes: string;
  status: string;
};

type Props = {
  title?: string;
  requestNo: string;
  claimType: string;
  chargeType: string;
  declarations: { declNo: string }[];
  onBack: () => void;
  onBackToListing?: () => void;
  onProvideResponse: (declNo: string) => void;
  /** Days the claimant has to respond before the request is rejected. */
  responseWindowDays?: number;
};

/** Multi-declaration list shown before the actual Suspension Response form — reached from the
    claims listing's Action menu when the user has not already narrowed to one declaration via
    a Declaration Number search (see DeclarationListPage's onSuspensionResponse wiring). */
export default function SuspensionResponseListPage({ title = 'Suspension Response', requestNo, claimType, chargeType, declarations, onBack, onBackToListing, onProvideResponse, responseWindowDays = 10 }: Props) {
  const rows: SuspensionRequestRow[] = declarations.map((d, i) => ({
    requestNo: `${requestNo}-${i + 1}`,
    declNo: d.declNo,
    chargeType,
    requestNotes: 'Additional information request',
    status: 'Suspended',
  }));

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button onClick={onBackToListing ?? onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Refund &amp; Claims</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Suspension Response</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="flex items-center gap-[16px] mb-[8px]">
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font }}>
            {title} — {claimType} — {requestNo}
          </h1>
        </div>
        <p className="text-[16px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>
          This claim has {rows.length} declaration{rows.length !== 1 ? 's' : ''} under suspension. Select a request to provide the response.
        </p>

        {/* How long the claimant has to answer before the requests lapse */}
        <InfoNote className="mb-[20px]">
          The Claim Request will be rejected if response not provided within {responseWindowDays} days
        </InfoNote>

        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto px-[16px] py-[16px]">
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
              <thead>
                <tr>
                  {[
                    { label: '#',               w: 48  },
                    { label: 'Request No.',    w: 160 },
                    { label: 'Declaration No.', w: 200 },
                    { label: 'Charge Type',    w: 220 },
                    { label: 'Request Notes',  w: 260 },
                    { label: 'Status',         w: 140 },
                  ].map((h, i) => (
                    <th key={h.label} style={{ width: h.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0 }}>
                      {h.label === '#' ? <span className="text-[16px] font-medium text-[#051937]">#</span> : <ColumnFilter label={h.label} labelClass="text-[16px] font-medium text-[#051937]" />}
                    </th>
                  ))}
                  <th style={{ width: 100, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                    <span className="text-[16px] text-[#051937] font-medium">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.requestNo}>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{i + 1}</span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{r.requestNo}</span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{r.declNo}</span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{r.chargeType}</span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{r.requestNotes}</span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <span className="text-[16px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: 'rgba(220,53,69,0.10)', color: '#dc3545', padding: '4px 12px', borderRadius: 4, fontWeight: 500, fontFamily: font }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                      <button
                        onClick={() => onProvideResponse(r.declNo)}
                        aria-label="Provide Response"
                        className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ background: 'rgba(19,96,210,0.10)', borderRadius: 4, width: 28, height: 28 }}
                      >
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
