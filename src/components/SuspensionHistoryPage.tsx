import React from 'react';
import { ColumnFilter } from './ColumnFilter';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

type SuspRow = {
  suspensionDate: string;
  cdmComments: string;
  responseDate: string;
  customerResponse: string;
};

const ROWS: SuspRow[] = [
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Please upload required documents', responseDate: '24/02/24, 09:30', customerResponse: 'Please upload required documents' },
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Document Uploaded',                responseDate: '24/02/24, 09:30', customerResponse: 'Document Uploaded' },
  { suspensionDate: '24/02/24, 09:30', cdmComments: 'Charges Paid',                     responseDate: '24/02/24, 09:30', customerResponse: 'Charges Paid' },
];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
  onView: () => void;
};

export default function SuspensionHistoryPage({ onBack, onBackToListing, onView }: Props) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const headers: { label: string; w: number }[] = [
    { label: 'Suspension Date',   w: 160 },
    { label: 'CDM Comments',      w: 352 },
    { label: 'Response Date',     w: 200 },
    { label: 'Customer Response', w: 362 },
  ];

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
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Suspension History</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        {/* Page title */}
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 8 }}>
          Suspension History
        </h1>
        <div className="pb-[20px]" style={{ position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={210} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
          <table style={{ minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {headers.map((col, idx) => (
                  <th
                    key={col.label}
                    style={{
                      width: col.w,
                      minWidth: col.w,
                      background: '#a6c2e9',
                      padding: '10px 8px',
                      textAlign: 'left',
                      fontWeight: 500,
                      borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
                      paddingLeft: idx === 0 ? 16 : 8,
                    }}
                  >
                    <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                  </th>
                ))}
                <th style={{
                  width: 210, minWidth: 210, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                  borderRadius: '0 8px 0 0', position: 'sticky', right: 0,
                  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                }}>
                  <span className="text-[16px] font-medium text-[#051937]">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const cell = (content: React.ReactNode, w: number, extra?: React.CSSProperties) => (
                  <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8', ...extra }}>{content}</td>
                );
                return (
                  <tr key={i}>
                    {cell(<span className="text-[16px] text-[#051937] whitespace-nowrap">{row.suspensionDate}</span>, 160, { paddingLeft: 16 })}
                    {cell(<span className="text-[16px] text-[#051937] whitespace-nowrap">{row.cdmComments}</span>, 352)}
                    {cell(<span className="text-[16px] text-[#051937] whitespace-nowrap">{row.responseDate}</span>, 200)}
                    {cell(<span className="text-[16px] text-[#051937] whitespace-nowrap">{row.customerResponse}</span>, 362)}
                    <td style={{
                      background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 210,
                      borderBottom: '1px solid #f8f8f8', position: 'sticky', right: 0,
                      boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                    }}>
                      <button
                        onClick={onView}
                        className="text-[16px] underline"
                        style={{ color: '#1360d2', fontFamily: font, letterSpacing: '0.07px' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
