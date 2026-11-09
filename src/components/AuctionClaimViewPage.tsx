import React, { useState } from 'react';
import Dh from './Dh';
import ClaimHeaderDetails from './ClaimHeaderDetails';
import { claimHeaderDefaultsFor } from './claimHeaderDefaults';
import ChargesBreakupModal from './ChargesBreakupModal';
import ClaimApprovalDetailsModal from './ClaimApprovalDetailsModal';
import ClaimRequestVersions, { type ClaimVersionRow } from './ClaimRequestVersions';
import MoreIcon from './MoreIcon';
import RowFlyout, { anchorFrom, type FlyoutAnchor, type FlyoutItem } from './declaration/RowFlyout';
import { UploadedDocsByDeclaration, type UploadedDoc } from './NonRemittanceDocumentsPage';
import type { AuctionLotRow } from './AuctionLotDetailsPage';
import type { AuctionClaimDetail, TransportEntry, ContainerEntry } from './AuctionClaimDetailsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const versionRows: ClaimVersionRow[] = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', submittedBy: 'crnuser01', status: 'Under Processing', isCurrentlyViewing: true },
];

/* ─── A claimed lot's row menu — the lot's own detail, and what was approved on it. ─── */
const LOT_MENU_WIDTH = 260;
const lotMenuIcons = {
  claim: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M7.5 10h5M7.5 13h3.5" /></svg>,
  approval: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 10.2l2.4 2.4 4.6-4.9" /></svg>,
};
const LOT_MENU: FlyoutItem[] = [
  { label: 'View Claim Details',          icon: lotMenuIcons.claim },
  { label: 'View Claim Approval Details', icon: lotMenuIcons.approval },
];

function FieldItem({ label, value }: { label: string; value: React.ReactNode }) {
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

const DEFAULT_LOTS: AuctionLotRow[] = [
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000112', description: 'Assorted Electronics — Mobile Accessories', auctionDate: '14/03/2025', saleProceeds: '18,500.00' },
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000113', description: 'Assorted Electronics — Home Appliances',   auctionDate: '14/03/2025', saleProceeds: '42,300.00' },
];
const DEFAULT_CLAIM_DETAILS: AuctionClaimDetail[] = [
  { auctionLotNo: 'LOT-000112', claimAmount: '15,000.00', remarks: 'Refund against sale proceeds', transportDocs: [{ id: 't1', value: 'TRN-88213' }], containerNos: [{ id: 'c1', value: 'MSCU-1122334' }] },
  { auctionLotNo: 'LOT-000113', claimAmount: '38,000.00', remarks: '—', transportDocs: [{ id: 't2', value: 'TRN-88214' }, { id: 't3', value: 'TRN-88215' }], containerNos: [{ id: 'c2', value: 'MSCU-2233445' }, { id: 'c3', value: 'MSCU-3344556' }] },
];

/* ─── Transport & Container entries — read-only view popup (mirrors OutboundViewPopup), two
       independent lists side by side matching the split add-tables on the Claim Details step. ─── */
function TransportContainerPopup({ lotNo, transportDocs, containerNos, onClose }: { lotNo: string; transportDocs: TransportEntry[]; containerNos: ContainerEntry[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: 860, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-[12px] flex-wrap">
            <h2 className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0, fontFamily: font }}>Claim Details — {lotNo}</h2>
            <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: 'rgba(255,255,255,0.14)', color: '#f8fafd', fontWeight: 500, fontFamily: font }}>
              {transportDocs.length + containerNos.length} entr{transportDocs.length + containerNos.length !== 1 ? 'ies' : 'y'}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            <div>
              <p className="text-[16px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 500 }}>Transport Doc. No. Details</p>
              <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: font }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, width: 44 }}>#</th>
                      <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500 }}>Transport Doc. No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportDocs.length === 0 ? (
                      <tr><td colSpan={2} className="text-[15px] text-[#b0b8d0]" style={{ padding: '16px 12px' }}>No entries.</td></tr>
                    ) : transportDocs.map((e, i) => (
                      <tr key={e.id} style={{ borderTop: '1px solid #eef1f6' }}>
                        <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px' }}>{e.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="text-[16px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 500 }}>Container No. Details</p>
              <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: font }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, width: 44 }}>#</th>
                      <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500 }}>Container No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {containerNos.length === 0 ? (
                      <tr><td colSpan={2} className="text-[15px] text-[#b0b8d0]" style={{ padding: '16px 12px' }}>No entries.</td></tr>
                    ) : containerNos.map((e, i) => (
                      <tr key={e.id} style={{ borderTop: '1px solid #eef1f6' }}>
                        <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px' }}>{e.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eef1f6' }}>
          <button onClick={onClose}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500, cursor: 'pointer', boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  onBack: () => void;
  selectedLots?: AuctionLotRow[];
  claimDetails?: AuctionClaimDetail[];
  uploadedDocs?: UploadedDoc[];
  claimNo?: string;
  claimStatus?: string;
  submissionDate?: string;
  claimantName?: string;
};

export default function AuctionClaimViewPage({
  onBack, selectedLots = DEFAULT_LOTS, claimDetails = DEFAULT_CLAIM_DETAILS, uploadedDocs = [],
  claimNo = '3842200', claimStatus = 'Under Processing', submissionDate = '29/06/2026', claimantName = 'SW LOGISTICS LLC',
}: Props) {
  const [viewLot, setViewLot] = useState<{ lotNo: string; transportDocs: TransportEntry[]; containerNos: ContainerEntry[] } | null>(null);
  const [breakupOpen, setBreakupOpen] = useState(false);
  const [lotMenu, setLotMenu] = useState<{ at: FlyoutAnchor; lotNo: string; transportDocs: TransportEntry[]; containerNos: ContainerEntry[] } | null>(null);
  const [approvalLot, setApprovalLot] = useState<string | null>(null);
  /* The card's amounts are the per-declaration charges totalled up, so they agree
     with the sub totals and grand total in the Charges breakup popup. */
  const breakupDeclarations = selectedLots.map(l => l.auctionLotNo);
  const breakupCount = Math.max(1, breakupDeclarations.length);
  const chargeRows = [
    { type: 'Claim Registration Charge', amt: (50 * breakupCount).toFixed(2), receipt: 'A-100650705' },
    { type: 'Knowledge & Innovation Dirham', amt: (20 * breakupCount).toFixed(2), receipt: 'A-100650706' },
  ];
  const chargeTotal = (70 * breakupCount).toFixed(2);
  const docDeclNos = selectedLots.map(l => l.auctionLotNo);

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
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{claimantName}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[28px] text-[#111838] mb-[20px] mt-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>
          View Claim
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details */}
          <Section title="Claim Header Details">
            <ClaimHeaderDetails
              claimType="Refund on Auction Proceed"
              claimNo={claimNo}
              claimStatus={claimStatus}
              requestStatus={claimStatus}
              requestDate={submissionDate}
              submissionDate={submissionDate}
              registrationDate={submissionDate}
              claimant={claimantName}
              beneficiary={claimantName}
              {...claimHeaderDefaultsFor('Refund on Auction Proceed')}
              /* An auction claim is against sale proceeds, so there is no deposit to name. */
              showDepositMethod={false}
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
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 {claimantName}</span></td>
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

          {/* Claim Details — Auction No./Lot No./Claim Amount/Remarks/Transport/Container/Status */}
          <Section title="Claim Details" badge={`${selectedLots.length} lot${selectedLots.length !== 1 ? 's' : ''}`}>
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 1080 }}>
                <thead>
                  <tr>
                    {['Auction No.', 'Auction Lot No.', 'Claim Amount (AED)', 'Remarks', 'Transport Doc. No.', 'Container No.', 'Status', 'Action'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedLots.map(lot => {
                    const d = claimDetails.find(c => c.auctionLotNo === lot.auctionLotNo);
                    const transportDocs = d?.transportDocs ?? [];
                    const containerNos = d?.containerNos ?? [];
                    return (
                      <tr key={lot.auctionLotNo} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{lot.auctionNo}</span></td>
                        <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>{lot.auctionLotNo}</span></td>
                        <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}><Dh style={{ fontSize: 15 }} />{d?.claimAmount || '0.00'}</span></td>
                        <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{d?.remarks || '—'}</span></td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font }}>
                            {transportDocs.length === 0 ? '—' : transportDocs.length === 1 ? transportDocs[0].value : `${transportDocs.length} entries`}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font }}>
                            {containerNos.length === 0 ? '—' : containerNos.length === 1 ? containerNos[0].value : `${containerNos.length} entries`}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[16px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                            Submitted
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <button type="button" aria-label={`Lot ${lot.auctionLotNo} actions`}
                            onClick={(e) => { e.stopPropagation(); setLotMenu({ at: anchorFrom(e, LOT_MENU.length, LOT_MENU_WIDTH), lotNo: lot.auctionLotNo, transportDocs, containerNos }); }}
                            className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
                            <MoreIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Claim Request Versions */}
          <Section title="Claim Request Versions">
            <ClaimRequestVersions rows={versionRows} />
          </Section>

          {/* Uploaded Documents — one accordion per auction lot; also serves as "View Attachments" */}
          <UploadedDocsByDeclaration docs={uploadedDocs} declOrder={docDeclNos} itemLabel="Auction Lot" />
        </div>
      </div>

      {lotMenu && (
        <RowFlyout items={LOT_MENU} at={lotMenu.at} width={LOT_MENU_WIDTH}
          onPick={(label) => {
            if (label === 'View Claim Details') setViewLot({ lotNo: lotMenu.lotNo, transportDocs: lotMenu.transportDocs, containerNos: lotMenu.containerNos });
            else setApprovalLot(lotMenu.lotNo);
          }}
          onClose={() => setLotMenu(null)} />
      )}

      <ClaimApprovalDetailsModal open={!!approvalLot} subject={approvalLot ?? undefined}
        onClose={() => setApprovalLot(null)} />

      <ChargesBreakupModal open={breakupOpen} onClose={() => setBreakupOpen(false)}

        declarations={breakupDeclarations} itemLabel="Lot Number" />


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

      {viewLot && <TransportContainerPopup lotNo={viewLot.lotNo} transportDocs={viewLot.transportDocs} containerNos={viewLot.containerNos} onClose={() => setViewLot(null)} />}
    </div>
  );
}
