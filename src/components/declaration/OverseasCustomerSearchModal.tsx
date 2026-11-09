import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { editSrc, font } from './DeclarationUI';

const TABS = ['Overseas Customer', 'Registered Business'] as const;
type Tab = (typeof TABS)[number];

const ROWS = [
  ['AE-1000087', 'Maersk Shipping', 'Shipping line Agent'],
  ['AE-1000255', 'STAR SAEED TECHNOLOGY MIDDLE EAST', 'Free zone'],
  ['AE-1000375', '87654321', 'Light vehicle fog light kit'],
  ['AE-1000507', '87654321', 'Armored vehicle'],
];

type Props = {
  onClose: () => void;
  onSelect?: (row: string[]) => void;
};

/**
 * Exporter lookup — Figma 2650:87238 (Overseas Customer tab) and
 * 18535:89549 (Registered Business tab). The tab only re-labels the
 * search fields and the first two columns.
 */
export default function OverseasCustomerSearchModal({ onClose, onSelect }: Props) {
  const [tab, setTab] = useState<Tab>(TABS[0]);
  const [code, setCode] = useState('B1234557657');
  const [name, setName] = useState('');

  const isBusiness = tab === 'Registered Business';
  const codeLabel = isBusiness ? 'Business Code' : 'Customer Code';
  const nameLabel = isBusiness ? 'Business Name' : 'Customer Name';

  const field = (label: string, value: string, set: (v: string) => void, placeholder?: string) => (
    <div className="relative flex-1 min-w-[220px] max-w-[300px]">
      <input
        type="text"
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="h-[56px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors"
        style={{ fontFamily: font, background: '#f4f4f4' }}
      />
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px' }}>{label}</span>
    </div>
  );

  return (
    <DeclarationModal title="Search Overseas Customer" onClose={onClose} maxWidth={960}>
      <div className="flex items-center gap-[10px] mb-[28px]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-[40px] px-[18px] rounded-[4px] text-[15px] transition-colors ${
              t === tab ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
            }`}
            style={{ fontWeight: 500 }}
          >{t}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[16px] mb-[28px]">
        {field(codeLabel, code, setCode)}
        <span className="text-[15px] text-[#455174] flex-shrink-0">Or</span>
        {field(nameLabel, name, setName, 'Name')}
        <button
          data-secondary-btn type="button"
          onClick={() => { setCode(''); setName(''); }}
          className="h-[52px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors flex-shrink-0"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button
          type="button"
          className="h-[52px] px-[36px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Save</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#a6c2e9' }}>
              {[codeLabel, nameLabel, 'Country'].map((c) => (
                <th key={c} className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
              <th className="text-left text-[16px]" style={{ padding: '12px 12px', color: '#051937', fontWeight: 500, width: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 12px' }}>{cell}</td>
                ))}
                <td style={{ padding: '14px 12px' }}>
                  <span className="flex items-center gap-[16px]">
                    <button
                      type="button"
                      onClick={() => { onSelect?.(r); onClose(); }}
                      className="text-[16px] text-[#1360d2] hover:underline"
                      style={{ fontWeight: 500 }}
                    >Select</button>
                    <button type="button" aria-label={`Edit ${r[0]}`} className="inline-flex items-center justify-center hover:opacity-70 transition-opacity">
                      <img src={editSrc} alt="" width={20} height={20} />
                    </button>
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
