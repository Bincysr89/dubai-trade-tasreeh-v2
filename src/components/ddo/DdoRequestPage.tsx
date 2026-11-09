import { useState } from 'react';
import type { DdoPartyData } from './DdoFlow';

const TIME_SLOTS = ['8 - 9 AM', '9 - 10 AM', '10 - 11 AM', '11 - 12 AM', '12 - 1 PM', '2 - 3 PM', '3 - 4 PM'];

const DATES = [
  { day: 'Mon', date: '11' },
  { day: 'Tue', date: '12' },
  { day: 'Wed', date: '13' },
  { day: 'Thu', date: '14' },
  { day: 'Fri', date: '15' },
  { day: 'Sat', date: '16' },
  { day: 'Sun', date: '17' },
];

interface Props {
  bol: string;
  requestingParty: string;
  blParty: DdoPartyData | null;
  ddoParty: DdoPartyData | null;
  documentsDone: boolean;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  remarks: string;
  setRemarks: (r: string) => void;
  onBack: () => void;
  onBLParty: () => void;
  onDDOParty: () => void;
  onDocuments: () => void;
  onPay: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 rounded-full bg-[#1360d2]" />
      <h2 className="text-[#1e2939] font-dubai font-bold text-[17px]">{children}</h2>
    </div>
  );
}

export default function DdoRequestPage({
  bol, requestingParty, blParty, ddoParty, documentsDone,
  selectedSlot, setSelectedSlot, remarks, setRemarks,
  onBack, onBLParty, onDDOParty, onDocuments, onPay,
}: Props) {
  const [selectedDate, setSelectedDate] = useState('12');
  const [ddoValidityDate] = useState('15-12-2023');

  return (
    <div className="fixed inset-0 z-50 bg-[#f2f5fb] flex flex-col">

      {/* Header */}
      <div className="bg-[#1e2d4d] flex items-center gap-4 px-5 py-4 flex-shrink-0 shadow-[0px_4px_12px_rgba(0,0,0,0.2)]">
        <button
          onClick={onBack}
          className="bg-white/15 rounded-full size-10 flex items-center justify-center flex-shrink-0 hover:bg-white/25 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-dubai font-bold text-[20px] leading-tight">Request DDO</h1>
          <p className="text-white/60 font-dubai text-[12px]">{bol}</p>
        </div>
        <div className="ml-auto bg-white/10 rounded-full px-3 py-1">
          <span className="text-white/80 font-dubai text-[12px] font-medium">New Request</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-[560px] mx-auto px-4 py-5 flex flex-col gap-5">

          {/* BOL info card */}
          <div
            className="rounded-[20px] p-5 shadow-[0px_8px_24px_rgba(19,96,210,0.15)]"
            style={{ background: 'linear-gradient(135deg, #1e6fff 0%, #0f4fc8 100%)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white/20 rounded-[14px] size-14 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/70 font-dubai text-[11px] uppercase tracking-wide mb-0.5">Bill of Lading</p>
                <p className="text-white font-dubai font-bold text-[20px] truncate">{bol}</p>
                <button className="mt-1.5 bg-white/20 rounded-full px-3 py-0.5 text-white font-dubai text-[12px] font-medium hover:bg-white/30 transition-colors">
                  View Details →
                </button>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-white/60 font-dubai text-[10px] uppercase tracking-wide mb-0.5">Origin</p>
                <p className="text-white font-dubai font-bold text-[16px]">Dubai Port</p>
              </div>
              <div>
                <p className="text-white/60 font-dubai text-[10px] uppercase tracking-wide mb-0.5">Destination</p>
                <p className="text-white font-dubai font-bold text-[16px]">Abu Dhabi</p>
              </div>
              <div>
                <p className="text-white/60 font-dubai text-[10px] uppercase tracking-wide mb-0.5">Containers</p>
                <p className="text-white font-dubai font-bold text-[16px]">3 × 20ft</p>
              </div>
            </div>
          </div>

          {/* DDO Validity */}
          <div className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#eff6ff] rounded-[12px] size-11 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="size-5 text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#99a1af] font-dubai text-[11px] uppercase tracking-wide">DDO Validity</p>
                  <p className="text-[#1e2939] font-dubai font-bold text-[16px]">{ddoValidityDate}</p>
                </div>
              </div>
              <button className="bg-[#eff6ff] rounded-full size-9 flex items-center justify-center text-[#1360d2] hover:bg-[#dbeafe] transition-colors">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Party Information */}
          <div>
            <SectionLabel>Party Information</SectionLabel>
            <div className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.07)] overflow-hidden divide-y divide-[#f3f4f6]">

              {/* Requesting Party */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="bg-[#eff6ff] rounded-[14px] size-11 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="size-5 text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#99a1af] font-dubai text-[11px] uppercase tracking-wide">Requesting Party</p>
                  <p className="text-[#1e2939] font-dubai font-bold text-[15px] truncate">{requestingParty}</p>
                </div>
                <div className="bg-[#d1fae5] rounded-full size-6 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="size-3.5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* B/L Party */}
              <button onClick={onBLParty} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafbff] transition-colors text-left">
                <div className={`rounded-[14px] size-11 flex items-center justify-center flex-shrink-0 transition-colors ${blParty ? 'bg-[#f0fdf4]' : 'bg-[#fdf4ff]'}`}>
                  <svg viewBox="0 0 24 24" className={`size-5 ${blParty ? 'text-[#16a34a]' : 'text-[#a855f7]'}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#99a1af] font-dubai text-[11px] uppercase tracking-wide">B/L Party</p>
                  <p className={`font-dubai font-bold text-[15px] truncate ${blParty ? 'text-[#1e2939]' : 'text-[#c4b5fd]'}`}>
                    {blParty ? (blParty.partyName || 'Details saved') : 'Tap to add details'}
                  </p>
                </div>
                {blParty ? (
                  <div className="bg-[#d1fae5] rounded-full size-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="size-3.5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5 text-[#d1d5dc]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>

              {/* DDO Party */}
              <button onClick={onDDOParty} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafbff] transition-colors text-left">
                <div className={`rounded-[14px] size-11 flex items-center justify-center flex-shrink-0 transition-colors ${ddoParty ? 'bg-[#f0fdf4]' : 'bg-[#fff7ed]'}`}>
                  <svg viewBox="0 0 24 24" className={`size-5 ${ddoParty ? 'text-[#16a34a]' : 'text-[#f97316]'}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#99a1af] font-dubai text-[11px] uppercase tracking-wide">DDO Party</p>
                  <p className={`font-dubai font-bold text-[15px] truncate ${ddoParty ? 'text-[#1e2939]' : 'text-[#fdba74]'}`}>
                    {ddoParty ? (ddoParty.partyName || 'Details saved') : 'Tap to add details'}
                  </p>
                </div>
                {ddoParty ? (
                  <div className="bg-[#d1fae5] rounded-full size-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="size-3.5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5 text-[#d1d5dc]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>

              {/* Documents */}
              <button onClick={onDocuments} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafbff] transition-colors text-left">
                <div className={`rounded-[14px] size-11 flex items-center justify-center flex-shrink-0 transition-colors ${documentsDone ? 'bg-[#f0fdf4]' : 'bg-[#fefce8]'}`}>
                  <svg viewBox="0 0 24 24" className={`size-5 ${documentsDone ? 'text-[#16a34a]' : 'text-[#ca8a04]'}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#99a1af] font-dubai text-[11px] uppercase tracking-wide">Documents</p>
                  <p className={`font-dubai font-bold text-[15px] truncate ${documentsDone ? 'text-[#1e2939]' : 'text-[#fde047]'}`}
                     style={documentsDone ? {} : { color: '#ca8a04' }}>
                    {documentsDone ? 'Documents uploaded' : 'Tap to upload'}
                  </p>
                </div>
                {documentsDone ? (
                  <div className="bg-[#d1fae5] rounded-full size-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="size-3.5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5 text-[#d1d5dc]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* OBL Drop-Off Appointment */}
          <div>
            <SectionLabel>OBL Drop-Off Appointment</SectionLabel>
            <div className="bg-white rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">

              {/* Date strip */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#1e2939] font-dubai font-bold text-[15px]">November 2023</span>
                  <div className="flex items-center gap-1">
                    <button className="size-7 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#1360d2] hover:bg-[#dbeafe] transition-colors">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button className="size-7 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#1360d2] hover:bg-[#dbeafe] transition-colors">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {DATES.map(d => {
                    const isSelected = d.date === selectedDate;
                    return (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`flex flex-col items-center py-2 rounded-[12px] transition-all ${
                          isSelected
                            ? 'shadow-[0px_4px_8px_rgba(19,96,210,0.25)]'
                            : 'hover:bg-[#f3f4f6]'
                        }`}
                        style={isSelected ? { background: 'linear-gradient(160deg, #1e6fff 0%, #155dfc 100%)' } : {}}
                      >
                        <span className={`font-dubai text-[10px] font-medium mb-1 ${isSelected ? 'text-white/70' : 'text-[#99a1af]'}`}>{d.day}</span>
                        <span className={`font-dubai font-bold text-[16px] ${isSelected ? 'text-white' : 'text-[#1e2939]'}`}>{d.date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div className="border-t border-[#f3f4f6] px-4 py-4">
                <p className="text-[#6a7282] font-dubai font-medium text-[16px] mb-3 uppercase tracking-wide">Available Slots</p>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex items-center gap-2 rounded-[12px] py-3 px-4 text-[16px] font-dubai font-bold border-2 transition-all ${
                          isSelected
                            ? 'border-transparent text-white shadow-[0px_4px_8px_rgba(19,96,210,0.25)]'
                            : 'text-[#364153] border-[#e5e7eb] bg-white hover:border-[#bfdbfe] hover:bg-[#f8faff]'
                        }`}
                        style={isSelected ? { background: 'linear-gradient(90deg, #1e6fff 0%, #155dfc 100%)' } : {}}
                      >
                        <svg viewBox="0 0 24 24" className={`size-4 flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-[#99a1af]'}`} fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Invoices */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-[#1360d2]" />
              <h2 className="text-[#1e2939] font-dubai font-bold text-[17px]">Invoices</h2>
              <span className="ml-auto bg-[#eff6ff] text-[#1360d2] font-dubai font-bold text-[12px] rounded-full px-2.5 py-0.5">2 pending</span>
            </div>
            <p className="text-[#99a1af] font-dubai text-[12px] mb-3">Credit/Debit Card Online Payments Only, Once User Enter The Request Form</p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'INVSIT10899', amount: '100.00 AED', date: '10-11-2023' },
                { id: 'INVSIT10901', amount: '200.00 AED', date: '10-11-2023' },
              ].map(inv => (
                <div key={inv.id} className="bg-white rounded-[14px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
                  <div className="bg-[#eff6ff] rounded-[12px] size-11 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="size-5 text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1e2939] font-dubai font-bold text-[15px]">{inv.id}</p>
                    <p className="text-[#99a1af] font-dubai text-[12px]">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1360d2] font-dubai font-bold text-[15px]">{inv.amount}</p>
                    <span className="bg-[#fff7ed] text-[#f97316] font-dubai font-bold text-[11px] rounded-full px-2 py-0.5">Pending</span>
                  </div>
                  <button className="size-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#6a7282] hover:bg-[#e5e7eb] transition-colors flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Breakups */}
          <div>
            <SectionLabel>Payment Breakup</SectionLabel>
            <div
              className="rounded-[16px] p-5 shadow-[0px_4px_16px_rgba(19,96,210,0.12)]"
              style={{ background: 'linear-gradient(155deg, #eff6ff 0%, #eef2ff 100%)' }}
            >
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#6a7282] font-dubai text-[15px]">Invoice Amount</span>
                <span className="text-[#1e2939] font-dubai font-bold text-[15px]">300.00 AED</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-t border-[#dbeafe]">
                <span className="text-[#6a7282] font-dubai text-[15px]">Service Charge</span>
                <span className="text-[#1e2939] font-dubai font-bold text-[15px]">1.67 AED</span>
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 border-t-2 border-[#bfdbfe]">
                <span className="text-[#1e2939] font-dubai font-bold text-[17px]">Total Amount</span>
                <span className="font-dubai font-bold text-[26px]" style={{ color: '#1360d2' }}>301.67 AED</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <SectionLabel>Remarks</SectionLabel>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add any notes or remarks for this request…"
              className="w-full border-2 border-[#e5e7eb] rounded-[14px] p-4 text-[#1e2939] font-dubai text-[15px] outline-none focus:border-[#1360d2] resize-none h-[110px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] bg-white transition-colors placeholder:text-[#c4cad4]"
            />
          </div>

        </div>
      </div>

      {/* Sticky PAY footer */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #f2f5fb 60%, transparent)' }}>
        <div className="max-w-[560px] mx-auto px-4 pb-5 pt-8 pointer-events-auto">
          <button
            onClick={onPay}
            className="w-full rounded-[16px] py-4 text-[15px] uppercase font-dubai font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-[0px_8px_24px_rgba(19,96,210,0.35)]"
            style={{ background: 'linear-gradient(90deg, #1e6fff 0%, #155dfc 100%)', color: 'white' }}
          >
            Proceed to Pay · 301.67 AED
          </button>
        </div>
      </div>

    </div>
  );
}
