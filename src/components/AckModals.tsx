import React, { useEffect, useRef, useState } from 'react';
import HappinessMeterBar from './HappinessMeterBar';

const Backdrop: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center px-[20px]"
    style={{ background: 'rgba(14,27,61,0.55)' }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    {children}
  </div>
);

const WarnIcon = () => (
  <div className="size-[64px] rounded-full inline-flex items-center justify-center" style={{ background: '#fbb500' }}>
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L22 21 L2 21 Z" />
      <path d="M12 10v5M12 18h.01" />
    </svg>
  </div>
);

/* ───────── Accept confirmation popup ───────── */
type AcceptProps = {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
};
export const AckAcceptConfirmModal: React.FC<AcceptProps> = ({ open, count, onClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(true);
  if (!open) return null;
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-[10px] flex flex-col items-center gap-[24px] py-[40px] px-4 sm:px-10" style={{ width: 'min(560px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <WarnIcon />
        <p className="text-[20px] text-[#0e1b3d] text-center" style={{ fontWeight: 500, lineHeight: 1.45 }}>
          Are you sure you want to accept acknowledgment for <br />({count}) declarations?
        </p>
        <label className="flex items-start gap-[10px] cursor-pointer">
          <button onClick={() => setAgreed(!agreed)} role="checkbox" aria-checked={agreed} className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]" style={{ border: `2px solid ${agreed ? '#1360d2' : '#a7abb2'}`, background: agreed ? '#1360d2' : '#fff' }}>
            {agreed && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
          </button>
          <span className="text-[16px] text-[#455174]" style={{ lineHeight: 1.4 }}>I/We hereby confirm the transfer of goods as described in the selected declaration's</span>
        </label>
        <div className="flex items-center gap-[12px]">
          <button onClick={onClose} data-secondary-btn className="h-[44px] px-[28px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors" style={{ fontWeight: 500 }}>Cancel</button>
          <button onClick={onConfirm} className="h-[44px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors" style={{ background: '#1360d2', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Accept</button>
        </div>
      </div>
    </Backdrop>
  );
};

/* ───────── Decline reason popup ───────── */
type DeclineReasonProps = {
  open: boolean;
  onClose: () => void;
  onDecline: (reason: string, other: string) => void;
};
export const AckDeclineReasonModal: React.FC<DeclineReasonProps> = ({ open, onClose, onDecline }) => {
  const [reason, setReason] = useState('');
  const [other, setOther] = useState('');
  const [otherFocused, setOtherFocused] = useState(false);
  const [open2, setOpen2] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open2) return;
    const onDoc = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen2(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open2]);
  if (!open) return null;
  const REASON_OPTIONS = ['New', 'Others'];
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(900px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]">
          <p className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500 }}>Decline Reason</p>
          <button onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div className="px-4 sm:px-10 py-[28px] flex flex-col gap-[24px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {/* Reason dropdown — floating label */}
            {(() => {
              const reasonFloated = !!reason || open2;
              return (
                <div className="relative" ref={dropRef}>
                  <div
                    tabIndex={0}
                    onClick={() => setOpen2(!open2)}
                    className={`h-[56px] border rounded-[4px] flex items-center px-[14px] cursor-pointer transition-colors bg-white ${open2 ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  >
                    <span className="text-[16px] text-[#0e1b3d] flex-1">{reason}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                  <span
                    className="absolute pointer-events-none transition-all"
                    style={{
                      left: reasonFloated ? 10 : 14,
                      top: reasonFloated ? -9 : '50%',
                      transform: reasonFloated ? 'none' : 'translateY(-50%)',
                      background: reasonFloated ? '#fff' : 'transparent',
                      padding: reasonFloated ? '0 4px' : 0,
                      fontSize: reasonFloated ? 12 : 14,
                      color: reasonFloated ? (open2 ? '#1360d2' : '#0e1b3d') : '#455174',
                      transitionDuration: '120ms',
                    }}
                  >
                    <span style={{ color: '#dc3545' }}>*</span>Decline Reason
                  </span>
                  {open2 && (
                    <div className="absolute z-[10] left-0 right-0 mt-[6px] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                      {REASON_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                          onClick={() => { setReason(opt); setOpen2(false); if (opt !== 'Others') setOther(''); }}
                        >
                          <span className="text-[#1360d2] group-hover:text-white flex-shrink-0">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="12" height="14" rx="1.5" /><path d="M7 7h6M7 10h6M7 13h4" /></svg>
                          </span>
                          <span className="text-[16px] text-[#111838] group-hover:text-white">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Other Reason input — floating label, enabled only when reason is "Others" */}
            {(() => {
              const otherEnabled = reason === 'Others';
              const otherFloated = otherFocused || !!other;
              const bg = otherEnabled ? '#fff' : '#f5f6f8';
              return (
                <div className="relative">
                  <input
                    type="text"
                    value={other}
                    disabled={!otherEnabled}
                    onFocus={() => setOtherFocused(true)}
                    onBlur={() => setOtherFocused(false)}
                    onChange={(e) => setOther(e.target.value)}
                    className="w-full h-[56px] border rounded-[4px] px-[14px] text-[16px] focus:outline-none transition-colors"
                    style={{
                      fontFamily: "'Dubai', sans-serif",
                      background: bg,
                      borderColor: otherFocused ? '#1360d2' : '#d5ddfb',
                      color: otherEnabled ? '#0e1b3d' : '#a7abb2',
                      cursor: otherEnabled ? 'text' : 'not-allowed',
                    }}
                  />
                  <span
                    className="absolute pointer-events-none transition-all"
                    style={{
                      left: otherFloated ? 10 : 14,
                      top: otherFloated ? -9 : '50%',
                      transform: otherFloated ? 'none' : 'translateY(-50%)',
                      background: otherFloated ? bg : 'transparent',
                      padding: otherFloated ? '0 4px' : 0,
                      fontSize: otherFloated ? 12 : 14,
                      color: otherEnabled
                        ? (otherFloated ? (otherFocused ? '#1360d2' : '#0e1b3d') : '#455174')
                        : '#a7abb2',
                      transitionDuration: '120ms',
                    }}
                  >
                    Other Reason
                  </span>
                </div>
              );
            })()}
          </div>
          <div className="flex items-center justify-center gap-[12px]">
            <button onClick={onClose} data-secondary-btn className="h-[44px] px-[28px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors" style={{ fontWeight: 500 }}>Close</button>
            <button onClick={() => onDecline(reason, other)} className="h-[44px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors hover:bg-[#0E4DB8]" style={{ background: '#1360d2', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Decline</button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

/* ───────── Decline confirm popup ───────── */
type DeclineConfirmProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
export const AckDeclineConfirmModal: React.FC<DeclineConfirmProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] py-[40px] px-4 sm:px-10" style={{ width: 'min(540px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: "'Dubai', sans-serif" }}>
        <WarnIcon />
        <div className="text-center text-[20px] text-[#0e1b3d]" style={{ fontWeight: 500, lineHeight: 1.5 }}>
          <p>Are you sure!</p>
          <p>you want to Decline the Acknowledgement?</p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button onClick={onClose} data-secondary-btn className="h-[44px] px-[28px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors" style={{ fontWeight: 500 }}>Cancel</button>
          <button onClick={onConfirm} className="h-[44px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors hover:bg-[#0E4DB8]" style={{ background: '#1360d2', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>Decline</button>
        </div>
      </div>
    </Backdrop>
  );
};

/* ───────── Success page (Accept / Decline) ───────── */
type SuccessProps = {
  mode: 'accept' | 'decline';
  count?: number;
  declarationNumbers: string[];
  onBack: () => void;
};
export const AckSuccessPage: React.FC<SuccessProps> = ({ mode, count, declarationNumbers, onBack }) => {
  const headline = mode === 'accept'
    ? `Acknowledgment successfully accepted for (${count ?? declarationNumbers.length}) Declarations.`
    : 'Acknowledgement Declined Successfully';

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Service Catalog</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Acknowledgement</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[60px]">
        <div className="flex flex-col items-center gap-[28px]">
          <div className="size-[100px] rounded-full inline-flex items-center justify-center" style={{ background: '#28A745' }}>
            <svg viewBox="0 0 100 100" width="60" height="60" fill="none">
              <path d="M30 51 l13 13 27 -29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <p className="text-[20px] text-[#28a745] text-center" style={{ fontWeight: 500 }}>{headline}</p>

          <div className="bg-white rounded-[8px] px-[28px] py-[20px] text-center max-w-[820px] w-full" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>Please find the Declaration Numbers below for reference.</p>
            <p className="text-[16px] text-[#455174] mt-[6px]">Delcaration Number: {declarationNumbers.join(', ')}</p>
          </div>

          {mode === 'accept' && (
            <div className="flex items-center gap-[12px]">
              <button data-secondary-btn className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors inline-flex items-center gap-[8px]" style={{ fontWeight: 500 }}>
                <span>Download</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v11M5 10l5 5 5-5M3 17h14" /></svg>
              </button>
              <button data-secondary-btn className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors inline-flex items-center gap-[8px]" style={{ fontWeight: 500 }}>
                <span>Share</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="10" r="2.2" /><circle cx="15" cy="5" r="2.2" /><circle cx="15" cy="15" r="2.2" /><path d="M7 9l6-3M7 11l6 3" /></svg>
              </button>
              <button data-secondary-btn className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors" style={{ fontWeight: 500 }}>
                View Declaration
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button data-secondary-btn onClick={onBack} className="h-[44px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors" style={{ fontWeight: 500 }}>
          Back To Listing
        </button>
        <HappinessMeterBar variant="inline" />
      </div>
    </div>
  );
};
