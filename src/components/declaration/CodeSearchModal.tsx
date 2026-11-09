import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { editSrc, font } from './DeclarationUI';

export type CodeSearchKind = 'importer' | 'personalCustomer';

/* Figma 2650:59736 (Importer Code) and 4866:152220 (Personal Customer Code) —
   one search box over a results table, differing in columns and row actions. */
const CONFIG = {
  importer: {
    title: 'Importer Code',
    heading: 'Search by Importer Name',
    columns: ['Importer Code', 'Importer Name', 'Business Types', 'Facility Locations'],
    rows: [
      ['AE-1000087', 'Maersk Shipping', 'Shipping line Agent', '87654321'],
      ['AE-1000255', 'STAR SAEED TECHNOLOGY MIDDLE EAST', 'Free zone', 'JEBEL ALI'],
      ['AE-1000375', '87654321', 'Light vehicle fog light kit', '87654321'],
      ['AE-1000507', '87654321', 'Armored vehicle', '87654321'],
    ],
    rowIcons: false,
  },
  personalCustomer: {
    title: 'Personal Customer Code',
    heading: 'Search by Personal Customer Code',
    columns: ['Code', 'Name', 'ID Doc Type', 'ID Doc No.', 'ID Doc Issuing Country', 'Mobile No.'],
    rows: [
      ['AE-1000087', 'John Doe', 'Passport', '11111111', 'India', '97111111111'],
      ['AE-1000255', 'John Doe', 'Passport', '11111111', 'India', '97111111111'],
      ['AE-1000375', 'John Doe', 'Passport', '11111111', 'India', '97111111111'],
      ['AE-1000507', 'John Doe', 'Passport', '11111111', 'India', '97111111111'],
    ],
    rowIcons: true,
  },
} as const;

type Props = {
  kind: CodeSearchKind;
  onClose: () => void;
  onSelect?: (row: readonly string[]) => void;
};

export default function CodeSearchModal({ kind, onClose, onSelect }: Props) {
  const cfg = CONFIG[kind];
  const [query, setQuery] = useState('AE');

  return (
    <DeclarationModal title={cfg.title} onClose={onClose} maxWidth={1000}>
      <p className="text-[18px] text-[#0e1b3d] mb-[20px]" style={{ fontWeight: 600 }}>{cfg.heading}</p>

      <div className="flex flex-wrap items-center gap-[16px] mb-[24px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[52px] flex-1 min-w-[220px] max-w-[380px] rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
          style={{ fontFamily: font }}
        />
        <button
          type="button"
          className="h-[52px] px-[34px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Search</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 820 }}>
          <thead>
            <tr style={{ background: '#a6c2e9' }}>
              {cfg.columns.map((c) => (
                <th key={c} className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
              <th className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, width: cfg.rowIcons ? 140 : 100 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 12px', whiteSpace: 'nowrap' }}>{cell}</td>
                ))}
                <td style={{ padding: '14px 12px' }}>
                  <span className="flex items-center gap-[12px]">
                    {cfg.rowIcons && (
                      <>
                        <button type="button" aria-label={`Edit ${r[0]}`} className="inline-flex items-center justify-center hover:opacity-70 transition-opacity">
                          <img src={editSrc} alt="" width={20} height={20} />
                        </button>
                        <button type="button" aria-label={`Print ${r[0]}`} className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#1360d2' }}>
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" />
                          </svg>
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => { onSelect?.(r); onClose(); }}
                      className="text-[16px] text-[#1360d2] hover:underline"
                      style={{ fontWeight: 500 }}
                    >Select</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DeclarationModal>
  );
}
