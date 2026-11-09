import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { JourneyTable, JourneyTd, JourneyThead, font } from './DeclarationUI';

type Props = { onClose: () => void; onSelect?: (row: string[]) => void };

const IMPORTERS = [
  ['AE-1000087', 'Maersk Shipping', 'Shipping line Agent', '87654321'],
  ['AE-1000255', 'STAR SAEED TECHNOLOGY MIDDLE EAST', 'Free zone', 'JEBEL ALI'],
  ['AE-1000375', '87654321', 'Light vehicle fog light kit', '87654321'],
  ['AE-1000507', '87654321', 'Armored vehicle', '87654321'],
];

/** Importer Code — Figma 2806:131210, opened from the Importers Code edit icon. */
export default function ImporterCodeModal({ onClose, onSelect }: Props) {
  const [query, setQuery] = useState('AE');

  return (
    <DeclarationModal title="Importer Code" onClose={onClose} maxWidth={900}>
      <div className="flex items-center gap-[10px] rounded-[4px] px-[16px] py-[12px] mb-[28px]"
        style={{ background: '#eef4ff', border: '1px solid #cfdcf8' }}>
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.6" className="flex-shrink-0">
          <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6h.01" strokeLinecap="round" />
        </svg>
        <span className="text-[16px] text-[#0e1b3d]">
          <span style={{ fontWeight: 600 }}>Please Note:</span>{' '}
          <span className="text-[#1360d2]">Changing Shipping Agent Or Importer May Result In Removal Of Shipping Information</span>
        </span>
      </div>

      <p className="text-[18px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 600 }}>Search by Importer Name</p>
      <div className="flex flex-wrap items-center gap-[16px] mb-[28px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[52px] w-full sm:w-[320px] rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] bg-white focus:outline-none focus:border-[#1360d2] transition-colors"
          style={{ fontFamily: font }}
        />
        <button type="button"
          className="h-[48px] px-[42px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Search</button>
      </div>

      <JourneyTable minWidth={760}>
        <JourneyThead columns={[
          { label: 'Importer Code', filter: false }, { label: 'Importer Name', filter: false },
          { label: 'Business Types', filter: false }, { label: 'Facility Locations', filter: false },
          { label: 'Action', w: 110, filter: false },
        ]} />
        <tbody>
          {IMPORTERS.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
              <JourneyTd>
                <button type="button" onClick={() => { onSelect?.(r); onClose(); }}
                  className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>Select</button>
              </JourneyTd>
            </tr>
          ))}
        </tbody>
      </JourneyTable>
    </DeclarationModal>
  );
}
