import { useState } from 'react';
import type { DdoPartyData } from './DdoFlow';

interface Props {
  partyType: 'bl' | 'ddo';
  requestingParty: string;
  blParty?: DdoPartyData;
  data: DdoPartyData;
  onSave: (data: DdoPartyData) => void;
  onCancel: () => void;
}

export default function DdoPartyForm({ partyType, requestingParty, blParty, data, onSave, onCancel }: Props) {
  const [form, setForm] = useState<DdoPartyData>({ ...data });
  const [sameAsRequesting, setSameAsRequesting] = useState(false);
  const [sameAsBL, setSameAsBL] = useState(false);

  const isBlParty = partyType === 'bl';
  const title = isBlParty ? 'B/L Party' : 'DDO Party';
  const subtitle = isBlParty ? 'Bill of Lading Party Information' : 'Delivery Order Party Information';
  const nameLabel = isBlParty ? 'B/L Party Name' : 'DDO Party Name';

  const handleSameAsRequesting = () => {
    const next = !sameAsRequesting;
    setSameAsRequesting(next);
    if (next) {
      setSameAsBL(false);
      setForm({ partyName: requestingParty, representative: '', email: '', phone: '' });
    }
  };

  const handleSameAsBL = () => {
    const next = !sameAsBL;
    setSameAsBL(next);
    if (next && blParty) {
      setSameAsRequesting(false);
      setForm({ ...blParty });
    }
  };

  const update = (field: keyof DdoPartyData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSameAsRequesting(false);
    setSameAsBL(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8faff] flex flex-col">
      <div className="bg-[#1e2d4d] flex items-center gap-4 px-6 py-4 flex-shrink-0 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
        <button
          onClick={onCancel}
          className="bg-white rounded-full size-11 flex items-center justify-center flex-shrink-0 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-[#1e2d4d]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-dubai font-bold text-[20px] leading-tight">{title}</h1>
          <p className="text-white font-dubai text-[12px] opacity-80">{subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-6 py-6 flex flex-col gap-5">

          {/* Same As Requesting Party */}
          <button
            onClick={handleSameAsRequesting}
            className="bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] border border-[#dbeafe] rounded-[16px] px-5 py-4 flex items-center gap-3 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] w-full text-left hover:shadow-md transition-shadow"
          >
            <div className={`size-6 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${sameAsRequesting ? 'bg-[#1e6fff] border-[#1e6fff]' : 'border-[#1360d2] bg-white'}`}>
              {sameAsRequesting && (
                <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-[#1e2939] font-dubai font-bold text-[16px]">Same As Requesting Party</span>
          </button>

          {/* Same As B/L Party (DDO only) */}
          {!isBlParty && (
            <button
              onClick={handleSameAsBL}
              className="bg-gradient-to-r from-[#faf5ff] to-[#fdf2f8] border border-[#f3e8ff] rounded-[16px] px-5 py-4 flex items-center gap-3 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] w-full text-left hover:shadow-md transition-shadow"
            >
              <div className={`size-6 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${sameAsBL ? 'bg-[#ff5a83] border-[#ff5a83]' : 'border-[#ff5a83] bg-white'}`}>
                {sameAsBL && (
                  <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-[#1e2939] font-dubai font-medium text-[16px]">Same As B/L Party</span>
            </button>
          )}

          {/* Form fields */}
          <div className="flex flex-col gap-5">
            {/* Party Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#364153] font-dubai font-bold text-[16px]">{nameLabel}</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <input
                  type="text"
                  value={form.partyName}
                  onChange={e => update('partyName', e.target.value)}
                  placeholder="Enter party name"
                  className="w-full bg-white border border-[#e5e7eb] rounded-[14px] pl-12 pr-4 py-4 text-[#1e2939] font-dubai text-[16px] placeholder-[#99a1af] outline-none focus:border-[#1360d2] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] transition-colors"
                />
              </div>
            </div>

            {/* Representative Person */}
            <div className="flex flex-col gap-2">
              <label className="text-[#364153] font-dubai font-bold text-[16px]">Representative Person</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  value={form.representative}
                  onChange={e => update('representative', e.target.value)}
                  placeholder="Enter representative name"
                  className="w-full bg-white border border-[#e5e7eb] rounded-[14px] pl-12 pr-4 py-4 text-[#1e2939] font-dubai text-[16px] placeholder-[#99a1af] outline-none focus:border-[#1360d2] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#364153] font-dubai font-bold text-[16px]">Email</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-white border border-[#e5e7eb] rounded-[14px] pl-12 pr-4 py-4 text-[#1e2939] font-dubai text-[16px] placeholder-[#99a1af] outline-none focus:border-[#1360d2] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-[#364153] font-dubai font-bold text-[16px]">Phone Number</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.77 9.79 19.79 19.79 0 01.7 1.11 2 2 0 012.68 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.41a16 16 0 006.29 6.29l.59-.59a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full bg-white border border-[#e5e7eb] rounded-[14px] pl-12 pr-4 py-4 text-[#1e2939] font-dubai text-[16px] placeholder-[#99a1af] outline-none focus:border-[#1360d2] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onSave(form)}
            className="w-full bg-[#1360d2] text-white rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] hover:bg-[#1150b8] transition-colors"
          >
            Save and Return
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-white text-[#1360d2] rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] hover:bg-[#f0f7ff] transition-colors mb-6"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
