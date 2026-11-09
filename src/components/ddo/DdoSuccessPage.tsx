interface Props {
  bol: string;
  onDone: () => void;
}

export default function DdoSuccessPage({ bol, onDone }: Props) {
  const refNumber = `REF-${Date.now().toString().slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] flex flex-col items-center justify-center px-6">
      <div className="max-w-[480px] w-full flex flex-col items-center text-center gap-6">

        {/* Success circle */}
        <div className="size-28 rounded-full bg-[#d1fae5] flex items-center justify-center shadow-[0px_8px_32px_rgba(16,185,129,0.25)]">
          <div className="size-20 rounded-full bg-[#a7f3d0] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="size-10 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-[#1e2939] font-dubai font-bold text-[26px] mb-2">DDO Request Submitted!</h1>
          <p className="text-[#6a7282] font-dubai text-[15px] leading-relaxed">
            Your Delivery Order request for{' '}
            <span className="text-[#1360d2] font-bold">{bol}</span>{' '}
            has been submitted successfully.
          </p>
        </div>

        {/* Reference card */}
        <div
          className="border border-[#dbeafe] rounded-[16px] p-5 w-full text-left shadow-[0px_4px_3px_rgba(0,0,0,0.1)]"
          style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)' }}
        >
          <p className="text-[#6a7282] font-dubai text-[16px] mb-1">Reference Number</p>
          <p className="text-[#1360d2] font-dubai font-bold text-[22px]">{refNumber}</p>
          <div className="mt-3 pt-3 border-t border-[#bedbff]">
            <p className="text-[#6a7282] font-dubai text-[16px] mb-1">B/L Number</p>
            <p className="text-[#1e2939] font-dubai font-bold text-[16px]">{bol}</p>
          </div>
        </div>

        <p className="text-[#6a7282] font-dubai text-[16px] leading-relaxed">
          You will receive a confirmation email with your DDO details shortly. Track your request status in the DDO records.
        </p>

        <button
          onClick={onDone}
          className="w-full bg-[#1360d2] text-white rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] hover:bg-[#1150b8] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
