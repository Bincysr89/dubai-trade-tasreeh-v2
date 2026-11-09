import React from 'react';
import { StatusChip } from './declaration/DeclarationUI';
import ModalShell, { ModalTable, ModalTh, modalTd } from './ModalShell';

export type Waiver = { waiverNumber: string; waiverStatus: string };

const WAIVERS: Waiver[] = [{ waiverNumber: '1744', waiverStatus: 'Submitted' }];

type Props = {
  open: boolean;
  onClose: () => void;
  /** The sub-claim the waiver belongs to — named in the title bar. */
  subject?: string;
  waivers?: Waiver[];
};

/** Waiver Details — the waivers raised against the declaration and where each one stands. */
export default function WaiverDetailsModal({ open, onClose, subject, waivers = WAIVERS }: Props) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={620}
      title={`Waiver Details${subject ? ` — ${subject}` : ''}`}>
      <ModalTable>
        <thead>
          <tr>
            <ModalTh label="Waiver Number" />
            <ModalTh label="Waiver Status" />
          </tr>
        </thead>
        <tbody>
          {waivers.map((w) => (
            <tr key={w.waiverNumber} style={{ borderBottom: '1px solid #f0f3fa' }}>
              <td style={modalTd}><span className="text-[16px]" style={{ color: '#1360d2', fontWeight: 500 }}>{w.waiverNumber}</span></td>
              <td style={modalTd}><StatusChip status={w.waiverStatus} /></td>
            </tr>
          ))}
        </tbody>
      </ModalTable>
    </ModalShell>
  );
}
