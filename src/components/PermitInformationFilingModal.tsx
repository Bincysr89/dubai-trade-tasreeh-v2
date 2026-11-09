import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const cancelSrc = new URL('../assets/declaration/cancel-24px.svg', import.meta.url).href;
const checkCircleSrc = new URL('../assets/declaration/check-circle-outline.svg', import.meta.url).href;
const stepCheckSrc = new URL('../assets/declaration/step-check.svg', import.meta.url).href;

const font = "'Dubai', sans-serif";

const STEPS = ['General Information', 'Shipment Details', 'Invoice & Attachments', 'Payment Details'];

type Props = {
  onClose: () => void;
  /** Fires once the filling animation finishes — the caller moves on to the review page. */
  onDone: () => void;
  /** How long the popup holds before calling onDone. */
  durationMs?: number;
};

/**
 * "Hang on! We are filling your information…" — shown while the declaration is assembled
 * from the journey, then hands over to the review page. Figma 2650:70259.
 */
export default function PermitInformationFilingModal({ onClose, onDone, durationMs = 2000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onDone, durationMs]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-[24px]"
      role="dialog"
      aria-modal="true"
      aria-label="Permit Information Filing"
      style={{ background: 'rgba(11,21,52,0.45)' }}
    >
      <div
        className="bg-white rounded-[8px] w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 868, boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px]" style={{ height: 65 }}>
          <p className="text-[20px] text-[#f8fafd]" style={{ fontWeight: 500, lineHeight: '20px' }}>
            Permit Information Filing
          </p>
          <button onClick={onClose} aria-label="Close" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
            <img src={cancelSrc} alt="" width={24} height={24} />
          </button>
        </div>

        <div className="flex flex-col items-center px-[24px] pt-[40px] pb-[48px]">
          <img src={checkCircleSrc} alt="" width={88} height={88} />

          <p className="text-[24px] text-[#111838] text-center mt-[40px]" style={{ fontWeight: 500 }}>
            Hang on! We are filling your information, so you can review and Submit
          </p>

          <div className="flex flex-col items-start gap-[4px] mt-[44px]">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
                    <div style={{ width: 2, height: 24, background: '#28a745' }} />
                  </div>
                )}
                <div className="flex items-start gap-[12px] py-[4px]">
                  <img src={stepCheckSrc} alt="" width={24} height={24} className="flex-shrink-0" />
                  <p className="text-[14px] text-[#219653]" style={{ fontWeight: 700 }}>{label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
