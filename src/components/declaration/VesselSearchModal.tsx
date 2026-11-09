import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { JourneyTable, JourneyTd, JourneyThead, chevronSrc, font, todaySrc } from './DeclarationUI';

type Props = {
  onClose: () => void;
  /** Picks a vessel's rotation number back into the Carrier Registration Number field. */
  onSelect?: (vesselName: string, rotationNumber: string) => void;
};

const VESSELS = [
  ['STK 1026', '623595', '20/11/2024'],
  ['STK 1026', '623600', '20/10/2024'],
  ['APL QINGDAO', '623575', '10/10/2024'],
  ['MOL ASANTE', '623608', '10/09/2024'],
];

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      {children}
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>{label}</span>
    </div>
  );
}

/** Search Vessel — Figma 5892:146172, opened from the Carrier Registration Number search icon. */
export default function VesselSearchModal({ onClose, onSelect }: Props) {
  const [vesselName, setVesselName] = useState('');

  return (
    <DeclarationModal title="Search Vessel" onClose={onClose} maxWidth={940}>
      <div className="flex flex-wrap items-start gap-[20px]">
        <Labelled label="Vessel Name">
          <input
            value={vesselName}
            onChange={(e) => setVesselName(e.target.value)}
            placeholder="Enter Vessel Name"
            className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] bg-white focus:outline-none focus:border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          />
        </Labelled>

        <Labelled label="Calling Port">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">Select Calling Port</span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </Labelled>

        <div className="relative flex-1 min-w-[220px]">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">From Date (one month)</span>
            <img src={todaySrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </div>

        <div className="relative flex-1 min-w-[220px]">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">To Date</span>
            <img src={todaySrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </div>

        {/* Reset / Apply sit inline right after the last field */}
        <button data-secondary-btn type="button" onClick={() => setVesselName('')}
          className="h-[52px] px-[34px] rounded-[4px] border bg-white text-[16px] transition-colors flex-shrink-0"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button type="button"
          className="h-[52px] px-[38px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Apply</button>
      </div>

      <div className="mt-[32px]">
        <JourneyTable minWidth={720}>
          <JourneyThead columns={[
            { label: 'Vessel Name' }, { label: 'Rotation Number' }, { label: 'Date' },
            { label: 'Action', w: 120, filter: false },
          ]} />
          <tbody>
            {VESSELS.map((v, i) => (
              <tr key={i}>
                {v.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
                <JourneyTd>
                  <button type="button"
                    onClick={() => { onSelect?.(v[0], v[1]); onClose(); }}
                    className="text-[16px] text-[#1360d2] hover:underline"
                    style={{ fontWeight: 500 }}
                  >Select</button>
                </JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>
    </DeclarationModal>
  );
}
