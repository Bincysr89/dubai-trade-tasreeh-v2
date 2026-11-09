import React from 'react';
import Dh from './Dh';
import ActionPage from './declaration/ActionPage';
import { JourneyTable, JourneyTd, JourneyThead, font } from './declaration/DeclarationUI';
import StatusPill from './PaymentStatusPill';

export type PaymentHistoryRow = {
  txDate: string;
  /** The transaction's type — or, for a settlement, the types of the bills it paid. */
  txType: string | string[];
  amount: string;
  status: string;
};


type Props = {
  /** The transaction the history belongs to. */
  subject?: string;
  rows: PaymentHistoryRow[];
  onHome?: () => void;
  onBack?: () => void;
};

/**
 * Payment History — the attempts one transaction took, in the same read-only table
 * the Declaration History uses.
 */
export default function PaymentHistoryPage({ subject, rows, onHome, onBack }: Props) {
  return (
    <ActionPage title="Payment History" crumb="Bill Payment" onHome={onHome} onBack={onBack}
      subtitle={subject ? `Transaction No: ${subject}` : undefined}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)', fontFamily: font }}>
        {rows.length === 0 ? (
          <p className="text-[16px] text-[#697498] text-center" style={{ padding: '32px 16px' }}>No payments recorded yet.</p>
        ) : (
          <JourneyTable minWidth={700}>
            <JourneyThead columns={[
              { label: 'Transaction Date' }, { label: 'Transaction Type' },
              { label: 'Status' }, { label: 'Amount (AED)' },
            ]} />
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.txDate}-${r.status}-${i}`}>
                  <JourneyTd first>{r.txDate}</JourneyTd>
                  <JourneyTd>
                    {Array.isArray(r.txType) ? (
                      /* A settlement paid several bills, so it lists what they were */
                      <span className="flex flex-col gap-[2px]">
                        {r.txType.map((t, j) => <span key={`${t}-${j}`}>{t}</span>)}
                      </span>
                    ) : r.txType}
                  </JourneyTd>
                  <JourneyTd><StatusPill status={r.status} /></JourneyTd>
                  <JourneyTd>
                    <span className="inline-flex items-baseline gap-[3px] whitespace-nowrap"><Dh style={{ fontSize: 15 }} />{r.amount}</span>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        )}
      </div>

    </ActionPage>
  );
}
