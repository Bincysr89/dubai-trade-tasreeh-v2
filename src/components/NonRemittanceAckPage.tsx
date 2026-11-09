import React from 'react';
import type { Row } from './EligibleDeclarationsPage';
import type { AuctionLotRow } from './AuctionLotDetailsPage';
import type { AuctionClaimDetail } from './AuctionClaimDetailsPage';
import { depositFieldsFor, refundFieldsFor, type DepositMethod, type RefundMode } from './ClaimHeaderDetails';
import { claimHeaderDefaultsFor } from './claimHeaderDefaults';
import Dh from './Dh';

const font = "'Dubai', 'Segoe UI', sans-serif";

function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
      <span className="text-[14px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function Amount({ value, bold }: { value: string; bold?: boolean }) {
  return (
    <span className="text-[16px] inline-flex items-baseline gap-[3px] whitespace-nowrap"
      style={{ color: '#051937', fontFamily: font, fontWeight: bold ? 700 : 400 }}>
      <Dh style={{ fontSize: 15 }} />{value}
    </span>
  );
}

function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h2 className="text-[20px] px-[4px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

type Props = {
  onBack: () => void;
  selectedRows: Row[];
  /** Which claim the receipt is for — it decides what the Claim Details table lists. */
  claimType?: string;
  /** Auction claims list lots instead of declarations. */
  auctionLots?: AuctionLotRow[];
  auctionClaimDetails?: AuctionClaimDetail[];
  customsBroker?: string;
  depositMethod?: DepositMethod;
  depositAccountNo?: string;
  depositAccountName?: string;
  refundMode?: RefundMode;
  bankAccountNo?: string;
  bankAccountName?: string;
  bankName?: string;
  iban?: string;
  refundAccountNo?: string;
  refundAccountName?: string;
  maskedCardNo?: string;
  cardType?: string;
  cardHolderName?: string;
};

/** The claim amount for a declaration line — the flow's own figure where it has one. */
const DEMO_CLAIM_AMOUNT = '1,000.00';
const DEMO_CP_ADVICE = 'CP-2026-00418';

/** Props left out must not blank a default out. */
function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function toAmount(value: string) {
  return parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
}

/** Same 1,000.00 shape the lines above the total use. */
function formatAmount(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function NonRemittanceAckPage({
  onBack, selectedRows,
  claimType = 'Non Remittance Claim',
  auctionLots = [], auctionClaimDetails = [],
  ...overrides
}: Props) {
  /* The deposit and refund blocks come from the same place the View Claim page reads,
     so a claim cannot show one refund mode on one page and another on the other. */
  const {
    customsBroker, depositMethod, depositAccountNo, depositAccountName, refundMode,
    bankAccountNo, bankAccountName, bankName, iban,
    refundAccountNo, refundAccountName, maskedCardNo, cardType, cardHolderName,
  } = { ...claimHeaderDefaultsFor(claimType), ...stripUndefined(overrides) };
  const displayRows = selectedRows.length > 0 ? selectedRows : [{ declarationNo: '3030004738426', declarationDate: '', depositType: 'Non Remittance Claim', declarationCategory: null, depositAmount: 'N/A', depositMethod: 'N/A', claimExpiry: '', exportExpiry: '', remarks: '', kind: 'request' as const }];

  const isAuction = /auction/i.test(claimType);
  const depositFields = depositFieldsFor(depositMethod, depositAccountNo, depositAccountName);
  const refundFields = refundFieldsFor(refundMode, {
    bankAccountNo, bankAccountName, bankName, iban,
    refundAccountNo, refundAccountName, maskedCardNo, cardType, cardHolderName,
  });

  /* Auction claims are listed by lot; every other claim type by declaration. */
  const lotLines = auctionLots.map((lot, i) => ({
    key: `${lot.auctionLotNo}-${i}`,
    auctionNo: lot.auctionNo,
    auctionLotNo: lot.auctionLotNo,
    claimAmount: auctionClaimDetails.find(c => c.auctionLotNo === lot.auctionLotNo)?.claimAmount || DEMO_CLAIM_AMOUNT,
  }));
  const declLines = displayRows.map((row, i) => ({
    key: `${row.declarationNo}-${i}`,
    declarationNo: row.declarationNo,
    chargeType: row.depositType || claimType,
    cpAdviceNo: DEMO_CP_ADVICE,
    claimAmount: row.depositAmount && row.depositAmount !== 'N/A' ? row.depositAmount.replace(/^Dh\s*/, '') : DEMO_CLAIM_AMOUNT,
  }));
  const subTotal = (isAuction ? lotLines : declLines).reduce((sum, l) => sum + toAmount(l.claimAmount), 0);

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
        <div className="flex items-center justify-between mb-[20px] mt-[4px]">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>
            Claim Submission Acknowledgement Receipt
          </h1>
        </div>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details */}
          <Section title="Claim Header Details">
            <div className="flex flex-wrap">
              <FieldItem label="Claim No. & Version" value="2420390-1 (Under Processing)" />
              <FieldItem label="Claim Type" value={claimType} />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Claimant" value="SW Logistics LLC (Business - AE-9106286)" />
              <FieldItem label="Beneficiary" value="SW Logistics LLC (Business- AE-9106286)" />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Claim Registration Date" value="29/06/2026" />
              <FieldItem label="Customs Broker" value={customsBroker} />
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Deposit Method" value={depositMethod} />
              {depositFields.map(([l, v]) => <FieldItem key={l} label={l} value={v ?? ''} />)}
            </div>
            <Divider />
            <div className="flex flex-wrap">
              <FieldItem label="Refund Mode" value={refundMode} />
              {refundFields.map(([l, v]) => <FieldItem key={l} label={l} value={v ?? ''} />)}
            </div>
          </Section>

          {/* Claim Details — auction claims are listed by lot, the rest by declaration */}
          <Section title="Claim Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 720 }}>
                <thead>
                  <tr>
                    {(isAuction
                      ? ['Sr. No.', 'Auction Number', 'Auction Lots No.', 'Claim Amount (AED)']
                      : ['Sl. No.', 'Declaration Number', 'Charge Type', 'CP Advice No.', 'Claim Amount (AED)']
                    ).map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isAuction ? lotLines.map((l, i) => (
                    <tr key={l.key} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{l.auctionNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{l.auctionLotNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><Amount value={l.claimAmount} /></td>
                    </tr>
                  )) : declLines.map((l, i) => (
                    <tr key={l.key} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{i + 1}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{l.declarationNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{l.chargeType}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{l.cpAdviceNo}</span></td>
                      <td style={{ padding: '10px 14px' }}><Amount value={l.claimAmount} /></td>
                    </tr>
                  ))}
                  {/* What the claim adds up to */}
                  <tr style={{ background: '#dce8f7' }}>
                    <td colSpan={isAuction ? 3 : 4} style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Sub Total</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}><Amount value={formatAmount(subTotal)} bold /></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                  {[
                    { type: 'Claim Registration Charge', amt: '50.00', receipt: 'A-100650705' },
                    { type: 'Knowledge-Innovation Dirham', amt: '20.00', receipt: 'A-100650706' },
                  ].map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.amt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>Credit/Debit Account</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 SW LOGISTICS LLC</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>70.00</span></td>
                    <td colSpan={3} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Notes */}
          <div className="bg-white rounded-[8px] px-[20px] py-[20px]" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
            <ol className="flex flex-col gap-[8px]" style={{ listStyleType: 'decimal', paddingLeft: 20 }}>
              {[
                'If the Claim is in order refund cheques/Bank Transfer will normally be ready after one week from the date of registration.',
                'Please bring this acknowledgement for collecting refund cheques not later than three months from the date of registration.',
                'If the Claim is rejected, the resubmission date will be considered as a claim date for the same.',
                'All email messages, related to submission, suspension, approval or rejection of this claim, will be sent to shaheer.hassan@dubaitrade.ae for AE-9106286 - SW Logistics LLC',
              ].map((note, i) => (
                <li key={i} className="text-[14px] text-[#455174]" style={{ fontFamily: font, lineHeight: 1.6 }}>{note}</li>
              ))}
            </ol>
            <p className="text-[14px] mt-[12px]" style={{ fontFamily: font, color: '#c0392b', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 600 }}>Warning:</span> Please verify the Claims Acknowledgement Receipt details. In case of discrepancy contact Dubai Customs within one day from the Acknowledgement receipt date for modification.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back
        </button>
        <div className="flex items-center gap-[12px]">
          {[{ label: 'Print', icon: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 7V3h10v4M5 14H3a1 1 0 01-1-1V8a1 1 0 011-1h14a1 1 0 011 1v5a1 1 0 01-1 1h-2" strokeLinecap="round"/><rect x="5" y="12" width="10" height="6" rx="1" /></svg> }, { label: 'E-mail', icon: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 7l8 5 8-5" strokeLinecap="round"/></svg> }].map((btn) => (
            <button data-secondary-btn
              key={btn.label}
              className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors flex items-center gap-[8px]"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
