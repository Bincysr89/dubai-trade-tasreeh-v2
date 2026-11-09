import { useState } from 'react';

type PaymentMethod = 'advance-deposit' | 'prepaid-card' | 'credit-card';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  balance: string | null;
}[] = [
  {
    id: 'advance-deposit',
    label: 'Advance Deposit',
    description: 'Pay using your advance deposit balance',
    balance: '77,001.18 AED available',
  },
  {
    id: 'prepaid-card',
    label: 'Prepaid Card',
    description: 'Pay using your prepaid card balance',
    balance: '3,500.00 AED available',
  },
  {
    id: 'credit-card',
    label: 'Credit / Debit Card',
    description: 'Pay securely online with your card',
    balance: null,
  },
];

const METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  'advance-deposit': (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
  'prepaid-card': (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  'credit-card': (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <line x1="5" y1="15" x2="10" y2="15" />
      <line x1="14" y1="15" x2="19" y2="15" />
    </svg>
  ),
};

interface Props {
  amount: number;
  onBack: () => void;
  onConfirm: () => void;
}

export default function DdoPaymentPage({ amount, onBack, onConfirm }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] flex flex-col">
      <div className="bg-[#1e2d4d] flex items-center gap-4 px-6 py-4 flex-shrink-0 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
        <button
          onClick={onBack}
          className="bg-white rounded-full size-10 flex items-center justify-center flex-shrink-0 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-[#1e2d4d]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-dubai font-bold text-[20px]">Payment</h1>
          <p className="text-white font-dubai text-[12px] opacity-80">Select payment method</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-6 py-6 flex flex-col gap-5">

          {/* Amount summary */}
          <div
            className="border border-[#dbeafe] rounded-[16px] p-5 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]"
            style={{ background: 'linear-gradient(155deg, #eff6ff 0%, #eef2ff 100%)' }}
          >
            <p className="text-[#364153] font-dubai font-medium text-[16px] mb-1">Total Amount Due</p>
            <p className="text-[#1e6fff] font-dubai font-bold text-[32px]">{amount.toFixed(2)} AED</p>
            <div className="mt-3 pt-3 border-t border-[#bedbff] flex justify-between text-[16px] font-dubai">
              <span className="text-[#6a7282]">Invoice Amount</span>
              <span className="text-[#1e2939] font-bold">300.00 AED</span>
            </div>
            <div className="flex justify-between text-[16px] font-dubai mt-1">
              <span className="text-[#6a7282]">Service Charge</span>
              <span className="text-[#1e2939] font-bold">1.67 AED</span>
            </div>
          </div>

          <h2 className="text-[#1e2939] font-dubai font-bold text-[18px]">Select Payment Method</h2>

          {PAYMENT_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={`w-full bg-white border-2 rounded-[16px] p-5 flex items-center gap-4 text-left transition-all ${
                selected === method.id
                  ? 'border-[#1360d2] shadow-[0px_4px_7px_rgba(19,96,210,0.15)]'
                  : 'border-[#f3f4f6] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] hover:border-[#d1d5dc]'
              }`}
            >
              <div
                className={`size-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected === method.id ? 'bg-[#dbeafe] text-[#1360d2]' : 'bg-[#eff6ff] text-[#1360d2]'
                }`}
              >
                {METHOD_ICONS[method.id]}
              </div>
              <div className="flex-1">
                <p className="text-[#1e2939] font-dubai font-bold text-[16px]">{method.label}</p>
                <p className="text-[#6a7282] font-dubai text-[12px]">{method.description}</p>
                {method.balance && (
                  <p className="text-[#155dfc] font-dubai font-bold text-[16px] mt-1">{method.balance}</p>
                )}
              </div>
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected === method.id ? 'border-[#1360d2]' : 'border-[#d1d5dc]'
                }`}
              >
                {selected === method.id && <div className="size-3 rounded-full bg-[#1360d2]" />}
              </div>
            </button>
          ))}

          <button
            onClick={() => onConfirm()}
            className="w-full rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] transition-all bg-[#1360d2] text-white hover:bg-[#1150b8] mb-4"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
