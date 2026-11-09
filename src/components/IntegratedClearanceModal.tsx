// @ts-ignore
import integratedClearanceSrc from '../assets/icon-integrated-clearance.svg';

type Props = {
  onClose: () => void;
  onCargoClearance: () => void;
};

export default function IntegratedClearanceModal({ onClose, onCargoClearance }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(14,27,61,0.53)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] overflow-hidden relative"
        style={{ width: 892, minHeight: 423 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] size-[32px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity z-10"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <p
          className="text-[#111838] text-[24px] text-center pt-[67px] pb-0 px-[40px]"
          style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: '29px' }}
        >
          How would you like to Proceed with the Journey?
        </p>

        {/* Cards */}
        <div className="flex gap-[27px] px-[41px] pt-[36px] pb-[41px]">
          {/* Card 1: Cargo Clearance */}
          <button
            onClick={onCargoClearance}
            className="flex flex-col text-left bg-white rounded-[7px] overflow-hidden flex-1 hover:shadow-[0_4px_20px_rgba(19,96,210,0.2)] transition-shadow"
            style={{ border: '1.5px solid #1360d2', minHeight: 194 }}
          >
            <div className="flex flex-col gap-[11px] px-[30px] pt-[24px] pb-[14px]">
              {/* Icon */}
              <div className="size-[35px] flex-shrink-0">
                <img src={integratedClearanceSrc} alt="" className="size-full" />
              </div>
              <p
                className="text-[#0e1b3d] text-[20px]"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: '24px' }}
              >
                Cargo Clearance
              </p>
            </div>
            {/* Blue description box */}
            <div
              className="flex-1 px-[28px] py-[12px] flex items-center"
              style={{ background: '#e2ebf9' }}
            >
              <p
                className="text-[#0e1b3d] text-[16px]"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, lineHeight: '24px', width: 314 }}
              >
                Declare and obtain clearance for the movement of goods in and out of the emirate of Dubai
              </p>
            </div>
          </button>

          {/* Card 2: Permit / Certificate Request Submission */}
          <div
            className="flex flex-col bg-white rounded-[7px] overflow-hidden flex-1 cursor-pointer hover:shadow-[0_4px_20px_rgba(209,227,255,0.6)] transition-shadow"
            style={{ border: '1.5px solid #d1e3ff', minHeight: 194 }}
          >
            <div className="flex flex-col gap-[11px] px-[30px] pt-[24px] pb-[14px]">
              {/* Permit icon – document SVG */}
              <div className="size-[43px] flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 30 30" width="30" height="30" fill="none">
                  <rect x="4" y="2" width="18" height="22" rx="2" fill="#1360d2" opacity="0.15" stroke="#1360d2" strokeWidth="1.5"/>
                  <rect x="4" y="2" width="18" height="22" rx="2" fill="none" stroke="#1360d2" strokeWidth="1.5"/>
                  <line x1="8" y1="9" x2="18" y2="9" stroke="#1360d2" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="8" y1="13" x2="18" y2="13" stroke="#1360d2" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="8" y1="17" x2="14" y2="17" stroke="#1360d2" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="21" cy="21" r="6" fill="#1360d2"/>
                  <line x1="18" y1="21" x2="24" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="21" y1="18" x2="21" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p
                className="text-[#0e1b3d] text-[20px]"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: '24px', width: 347 }}
              >
                Permit / Certificate Request Submission
              </p>
            </div>
            {/* Blue description box */}
            <div
              className="flex-1 px-[28px] py-[12px] flex items-center"
              style={{ background: '#e2ebf9' }}
            >
              <p
                className="text-[#0e1b3d] text-[16px]"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, lineHeight: '24px', width: 314 }}
              >
                Submit the request for permits and continue to submit for clearance of movement of goods
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
