import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { font } from './DeclarationUI';

export type PartySearchKind = 'notifyParty' | 'cargoHandler' | 'agent';

type Config = {
  title: string;
  codeLabel: string;
  nameLabel: string;
  columns: string[];
  rows: string[][];
};

/* Figma 2650:87804 (Notify Party), 2650:89416 (Cargo Handler), 2650:88341 (Agent).
   Same shell throughout — only the field labels, columns and data differ. */
const CONFIG: Record<PartySearchKind, Config> = {
  notifyParty: {
    title: 'Search Notify Party',
    codeLabel: 'Customer Code',
    nameLabel: 'Customer Name',
    columns: ['Notify Party Code', 'Notify Party Name', 'Business Types', 'Facility Locations'],
    rows: [
      ['AE-1000087', 'Maersk Shipping', 'Shipping line Agent', '87654321'],
      ['AE-1000255', 'STAR SAEED TECHNOLOGY MIDDLE EAST', 'Free zone', 'JEBEL ALI'],
      ['AE-1000375', '87654321', 'Light vehicle fog light kit', '87654321'],
      ['AE-1000507', '87654321', 'Armored vehicle', '87654321'],
    ],
  },
  cargoHandler: {
    title: 'Search Cargo Handler',
    codeLabel: "Cargo Handler's Code",
    nameLabel: "Cargo Handler's Name",
    columns: ["Cargo Handler's Code", "Cargo Handler's Name", 'Customs Location', 'Premises', 'Address'],
    rows: [
      ['AE-1000087', 'Dubai Cargo Village', 'DUBAI AIRPORT(CARGO VILLAGE)', 'Dubai Cargo Village', 'Dubai Cargo Village Dubai Cargo Village'],
      ['AE-1000255', 'Dubai Cargo Village', 'DUBAI AIRPORT(CARGO VILLAGE)', 'Dubai Cargo Village', 'Dubai Cargo Village Dubai Cargo Village'],
      ['AE-1000375', 'Dubai Cargo Village', 'DUBAI AIRPORT(CARGO VILLAGE)', 'Dubai Cargo Village', 'Dubai Cargo Village Dubai Cargo Village'],
      ['AE-1000507', 'Dubai Cargo Village', 'DUBAI AIRPORT(CARGO VILLAGE)', 'Dubai Cargo Village', 'Dubai Cargo Village Dubai Cargo Village'],
    ],
  },
  agent: {
    title: 'Search Agent',
    codeLabel: "Agent's Code",
    nameLabel: "Agent's Name",
    columns: ["Agent's Code", "Agent's Name", 'Business Types', 'Facility Locations'],
    rows: [
      ['AE-1000087', 'Emirates-Govt Decree-4', 'Shipping line Agent', '87654321'],
      ['AE-1000255', 'Emirates-Govt Decree-4', 'Shipping line Agent', 'JEBEL ALI'],
      ['AE-1000375', 'Emirates-Govt Decree-4', 'Shipping line Agent', '87654321'],
      ['AE-1000507', 'Emirates-Govt Decree-4', 'Shipping line Agent', '87654321'],
    ],
  },
};

type Props = {
  kind: PartySearchKind;
  onClose: () => void;
  onSelect?: (row: string[]) => void;
};

export default function PartySearchModal({ kind, onClose, onSelect }: Props) {
  const cfg = CONFIG[kind];
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const input = (placeholder: string, value: string, set: (v: string) => void) => (
    <input
      type="text"
      value={value}
      onChange={(e) => set(e.target.value)}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
      style={{ fontFamily: font }}
    />
  );

  return (
    <DeclarationModal title={cfg.title} onClose={onClose}>
      <div className="flex flex-wrap items-center gap-[16px] mb-[24px]">
        <div className="flex-1 min-w-[200px] max-w-[280px]">{input(cfg.codeLabel, code, setCode)}</div>
        <span className="text-[15px] text-[#455174] flex-shrink-0">Or</span>
        <div className="flex-1 min-w-[220px] max-w-[300px]">{input(cfg.nameLabel, name, setName)}</div>
        <button
          data-secondary-btn type="button"
          onClick={() => { setCode(''); setName(''); }}
          className="h-[52px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors flex-shrink-0"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button
          type="button"
          className="h-[52px] px-[32px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Search</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ background: '#a6c2e9' }}>
              {cfg.columns.map((c) => (
                <th key={c} className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
              <th className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, width: 100 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 12px', lineHeight: 1.35 }}>{cell}</td>
                ))}
                <td style={{ padding: '14px 12px' }}>
                  <button
                    type="button"
                    onClick={() => { onSelect?.(r); onClose(); }}
                    className="text-[16px] text-[#1360d2] hover:underline"
                    style={{ fontWeight: 500 }}
                  >Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DeclarationModal>
  );
}
