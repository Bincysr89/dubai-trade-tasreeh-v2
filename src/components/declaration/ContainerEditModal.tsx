import React from 'react';
import DeclarationModal from './DeclarationModal';
import { chevronSrc, font } from './DeclarationUI';

type Props = { containerNo?: string; onClose: () => void; onSave?: () => void };

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>{label}</span>
    </div>
  );
}

/** Add/Edit Container — Figma 2650:91113, opened from the Container Details row action. */
export default function ContainerEditModal({ containerNo = 'C1234556', onClose, onSave }: Props) {
  return (
    <DeclarationModal title="Add/Edit Container" onClose={onClose} maxWidth={860}>
      <p className="text-[18px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Edit Container Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled label="Container Number">
          <input readOnly defaultValue={containerNo}
            className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none"
            style={{ fontFamily: font, background: '#f4f4f4' }} />
        </Labelled>
        <Labelled label="Seal Number">
          <input readOnly defaultValue="S2345667"
            className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none"
            style={{ fontFamily: font, background: '#f4f4f4' }} />
        </Labelled>
        <Labelled label="Container Size">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 text-[16px] text-[#0e1b3d]">20</span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </Labelled>
        <Labelled label="Container Type">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 text-[16px] text-[#0e1b3d]">Empty Container</span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </Labelled>
      </div>

      <div className="flex justify-end gap-[16px] mt-[36px]">
        <button data-secondary-btn type="button" onClick={onClose}
          className="h-[48px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button type="button" onClick={() => { onSave?.(); onClose(); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Save</button>
      </div>
    </DeclarationModal>
  );
}
