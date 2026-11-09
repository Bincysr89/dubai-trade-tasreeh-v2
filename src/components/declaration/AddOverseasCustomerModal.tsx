import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { chevronSrc, font } from './DeclarationUI';

type Props = { onClose: () => void; onSave?: () => void };

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>
        <span style={{ color: '#dc3545' }}>*</span>{label}
      </span>
    </div>
  );
}

const inputCls =
  'h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors bg-white';

/** Add Overseas Customers — Figma 2650:86718. */
export default function AddOverseasCustomerModal({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('55555555');

  const reset = () => { setName(''); setAddress(''); setPhone(''); };

  return (
    <DeclarationModal title="Add Overseas Customers" onClose={onClose} maxWidth={860}>
      <p className="text-[18px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Add New Exporter Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className={inputCls} style={{ fontFamily: font }} />
        </Labelled>

        <Labelled label="Address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Customer Address" className={inputCls} style={{ fontFamily: font }} />
        </Labelled>

        <Labelled label="Country">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 text-[16px] text-[#0e1b3d]">Select</span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </Labelled>

        <Labelled label="City">
          <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
            <span className="flex-1 text-[16px] text-[#0e1b3d]">Select</span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </div>
        </Labelled>

        <Labelled label="Mobile Phone Number">
          <div className="flex items-stretch h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden">
            <span className="flex items-center gap-[6px] px-[12px] flex-shrink-0" style={{ borderRight: '1px solid #d5ddfb' }}>
              {/* UAE flag */}
              <svg width="22" height="15" viewBox="0 0 22 15" aria-hidden="true">
                <rect width="22" height="5" y="0" fill="#00732f" />
                <rect width="22" height="5" y="5" fill="#fff" />
                <rect width="22" height="5" y="10" fill="#000" />
                <rect width="6" height="15" fill="#ff0000" />
              </svg>
              <span className="text-[15px] text-[#0e1b3d]">+971</span>
              <img src={chevronSrc} alt="" width={18} height={18} />
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 min-w-0 px-[14px] text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent"
              style={{ fontFamily: font }}
            />
          </div>
        </Labelled>
      </div>

      <div className="flex justify-end gap-[16px] mt-[36px]">
        <button
          data-secondary-btn type="button" onClick={reset}
          className="h-[48px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button
          type="button" onClick={() => { onSave?.(); onClose(); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Save</button>
      </div>
    </DeclarationModal>
  );
}
