import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import DeclarationModal from './DeclarationModal';
import { chevronSrc, todaySrc, font } from './DeclarationUI';

const inputCls =
  'h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors bg-white';

function Labelled({ label, required = true, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
      <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
      <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
    </div>
  );
}

function DateBox({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
      <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
      <img src={todaySrc} alt="" width={24} height={24} className="flex-shrink-0" />
    </div>
  );
}

/** Personal-customer registration succeeded — Figma 4866:154770. */
export function CustomerRegisteredModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-[24px]"
      role="dialog" aria-modal="true" aria-label="Customer registered"
      style={{ background: 'rgba(11,21,52,0.45)', fontFamily: font }}>
      <div className="bg-white rounded-[8px] w-full flex flex-col items-center px-[32px] py-[40px] gap-[20px]"
        style={{ maxWidth: 600, boxShadow: '0px 12px 40px rgba(0,0,0,0.18)' }}>
        <span className="inline-flex items-center justify-center rounded-full" style={{ width: 58, height: 58, background: '#219653' }}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="text-[18px] text-[#0e1b3d] text-center" style={{ fontWeight: 600 }}>
          Personal details of (test) - Id PC00073009 has been added.
        </p>
        <p className="text-[15px] text-[#455174] text-center">Customer Id assigned is PC00073009</p>
        <div className="flex items-center gap-[16px] mt-[8px]">
          <button data-secondary-btn type="button" onClick={onClose}
            className="h-[46px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >Close</button>
          <button type="button"
            className="h-[46px] px-[30px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[10px] hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontWeight: 500 }}>
            Print
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type Props = { onClose: () => void; onSubmitted?: () => void };

/** Customer Registration — Figma 2650:60810. */
export default function CustomerRegistrationModal({ onClose, onSubmitted }: Props) {
  const [undertaking, setUndertaking] = useState(false);

  return (
    <DeclarationModal title="Customer Registration" onClose={onClose} maxWidth={860}>
      <p className="text-[18px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Personal Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled label="Name"><input defaultValue="Customer Name" className={inputCls} style={{ fontFamily: font }} /></Labelled>
        <Labelled label="Address"><input defaultValue="Customer Address" className={inputCls} style={{ fontFamily: font }} /></Labelled>
        <Labelled label="Country"><SelectBox value="Select" /></Labelled>
        <Labelled label="City"><SelectBox value="Select" /></Labelled>
        <Labelled label="Mobile Phone Number"><SelectBox value="Select" /></Labelled>
        {/* "Date of Berth" is spelled this way in the design */}
        <Labelled label="Date of Berth"><DateBox value="08/17/1983" /></Labelled>
        <Labelled label="E-mail id"><input defaultValue="Johndoe@gmail.com" className={inputCls} style={{ fontFamily: font }} /></Labelled>
      </div>

      <p className="text-[18px] text-[#0e1b3d] mt-[36px] mb-[28px]" style={{ fontWeight: 600 }}>Document Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled label="ID Document Type"><SelectBox value="Passport" /></Labelled>
        <Labelled label="ID Issuing Country"><SelectBox value="Select" /></Labelled>
        <Labelled label="ID Document Number"><input placeholder="Enter" className={inputCls} style={{ fontFamily: font }} /></Labelled>
        <Labelled label="ID Document Expiration Date" required={false}><DateBox value="08/17/2025" /></Labelled>
      </div>

      <p className="text-[18px] text-[#0e1b3d] mt-[36px] mb-[28px]" style={{ fontWeight: 600 }}>UAE National ID Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled label="ID Number"><input defaultValue="UAE-123456778" className={inputCls} style={{ fontFamily: font }} /></Labelled>
      </div>

      <label className="flex items-start gap-[12px] mt-[36px] px-[16px] py-[16px] rounded-[4px] cursor-pointer select-none" style={{ background: '#f8fafd' }}>
        <input
          type="checkbox"
          checked={undertaking}
          onChange={(e) => setUndertaking(e.target.checked)}
          className="mt-[2px] size-[18px] flex-shrink-0 rounded-[2px]"
          style={{ accentColor: '#1360d2' }}
        />
        <span className="text-[14px] text-[#455174]" style={{ lineHeight: 1.6 }}>
          Lorem ipsum dolor sit amet consectetur. Et scelerisque montes turpis phasellus pulvinar dui vitae.
          Augue enim id nullam faucibus adipiscing venenatis. Ut cras ut enim morbi. Morbi nibh morbi sed id
          vitae accumsan id non adipiscing.
          <br />
          We undertake to retain the copies of the personal documents given in the above form.
        </span>
      </label>

      <div className="flex justify-end gap-[16px] mt-[32px]">
        <button data-secondary-btn type="button"
          className="h-[48px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button type="button" onClick={() => { onSubmitted?.(); onClose(); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Submit</button>
      </div>
    </DeclarationModal>
  );
}
