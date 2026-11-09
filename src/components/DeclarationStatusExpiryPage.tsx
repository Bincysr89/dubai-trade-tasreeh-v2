import React, { useState } from 'react';
import { DateInput } from './DatePicker';
import Dh from './Dh';

const font = "'Dubai', sans-serif";

type Row = {
  declNo: string;
  declDate: string;
  depositType: string;
  depositAmount: string;
  claimExpiry: string;
  exportExpiry: string;
  owner: string;
  clientRef: string;
};

const ROWS: Row[] = [
  { declNo: '3030004090826', declDate: '19/06/2026', depositType: 'Non Remittance Claim', depositAmount: '0', claimExpiry: '17/08/2026', exportExpiry: '18/07/2026', owner: 'AE-8122453 VIK JA FZE L.L.C', clientRef: 'dsaf' },
  { declNo: '3030004095226', declDate: '07/07/2026', depositType: 'Non Remittance Claim', depositAmount: '0', claimExpiry: '04/09/2026', exportExpiry: '05/08/2026', owner: 'AE-8122453 VIK JA FZE L.L.C', clientRef: 'dsaf' },
  { declNo: '3030004096626', declDate: '14/07/2026', depositType: 'Non Remittance Claim', depositAmount: '0', claimExpiry: '11/09/2026', exportExpiry: '12/08/2026', owner: 'AE-8122453 VIK JA FZE L.L.C', clientRef: 'S12121' },
];

const CLAIM_TYPES = ['Refund of Deposits', 'Non-Remittance Claim', 'Both'];
const DEPOSIT_TYPES = ['All', 'Alternative Duty Deposit', 'Anti Dumping Deposit', 'Safeguard Deposit', 'Duty', 'CDM Deposit'];
const DEPOSIT_METHODS = ['Standing Guarantee', 'Cash'];
const SG_ACCOUNTS = ['2113180-XVXCVXVSDFWE23', '4487210-SW LOGISTICS LLC'];

function flLabel(active: boolean): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: '#0e1b3d',
    background: active ? '#fff' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}
function FSelect({ label, value, onChange, options, req }: { label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean }) {
  const [open, setOpen] = useState(false);
  const active = open || value !== '';
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] bg-white focus:outline-none text-left"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}>
        <span className="flex-1 truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.2"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span style={flLabel(active)}>{req && <span style={{ color: '#dc3545' }}>*</span>}{label}</span>
      {open && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full px-[14px] py-[10px] text-left text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ fontFamily: font, color: opt === value ? '#1360d2' : '#0e1b3d', fontWeight: opt === value ? 500 : 400 }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SortArrows = () => (
  <span className="inline-flex flex-col ml-[4px]" style={{ verticalAlign: 'middle' }}>
    <svg viewBox="0 0 10 6" width="8" height="5" fill="#8f94ae"><path d="M5 0l5 6H0z" /></svg>
    <svg viewBox="0 0 10 6" width="8" height="5" fill="#c7cde0" style={{ marginTop: 1 }}><path d="M5 6L0 0h10z" /></svg>
  </span>
);

type Props = { onBack: () => void };

export default function DeclarationStatusExpiryPage({ onBack }: Props) {
  const [expiredOnBefore, setExpiredOnBefore] = useState('');
  const [claimType, setClaimType] = useState('Both');
  const [depositType, setDepositType] = useState('All');
  const [depositMethod, setDepositMethod] = useState('Standing Guarantee');
  const [sgAccount, setSgAccount] = useState(SG_ACCOUNTS[0]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => { if (expiredOnBefore.trim()) setSearched(true); };
  const handleReset = () => {
    setExpiredOnBefore('');
    setClaimType('Both');
    setDepositType('All');
    setDepositMethod('Standing Guarantee');
    setSgAccount(SG_ACCOUNTS[0]);
    setSearched(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Refund &amp; Claims</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Declaration Status Expiry</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[40px]">
        <h1 className="text-[32px] text-[#111838] mb-[20px]" style={{ fontWeight: 500 }}>Declaration Status Expiry</h1>

        {/* Search card — no overflow-hidden: the Claim Type / Deposit Type / date-picker popups
            need to escape the card bounds instead of being clipped by its rounded corners. */}
        <div className="bg-white rounded-[8px] mb-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="px-[24px] py-[16px] border-b border-[#eef1f6] rounded-t-[8px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Search</p>
          </div>
          <div className="px-[24px] py-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[20px]">
            <DateInput label="Expired On/Before" value={expiredOnBefore} onChange={setExpiredOnBefore} required />
            <FSelect label="Claim Type" value={claimType} onChange={setClaimType} options={CLAIM_TYPES} />
            {/* Deposit-related fields don't apply to Non-Remittance Claim (there's no deposit involved). */}
            {claimType !== 'Non-Remittance Claim' && (
              <>
                <FSelect label="Deposit Type" value={depositType} onChange={setDepositType} options={DEPOSIT_TYPES} />
                <FSelect label="Deposit Method" value={depositMethod} onChange={setDepositMethod} options={DEPOSIT_METHODS} />
                {depositMethod === 'Standing Guarantee' && (
                  <FSelect label="SG Account" value={sgAccount} onChange={setSgAccount} options={SG_ACCOUNTS} />
                )}
              </>
            )}
            <div className="flex items-end gap-[10px]">
              <button type="button" onClick={handleSearch} disabled={!expiredOnBefore.trim()}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Search
              </button>
              <button data-secondary-btn type="button" onClick={handleReset}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] border transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {searched && (
          <>
            {/* Header row: title + Print/Export */}
            <div className="flex items-center justify-between mb-[12px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Declaration Details</p>
              <div className="flex items-center gap-[10px]">
                <button data-secondary-btn type="button"
                  className="h-[40px] px-[18px] rounded-[4px] text-[16px] border flex items-center gap-[8px] bg-white transition-colors"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 8V3h10v5M5 14h10v3H5z" /><path d="M4 8h12a1 1 0 0 1 1 1v5h-3M3 14v-5a1 1 0 0 1 1-1" />
                  </svg>
                  Print
                </button>
                <button data-secondary-btn type="button"
                  className="h-[40px] px-[18px] rounded-[4px] text-[16px] border flex items-center gap-[8px] bg-white transition-colors"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 3v9M6.5 9l3.5 3.5L13.5 9" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 15h12v2H4z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Info bar */}
            <div className="flex items-center gap-[10px] rounded-[6px] px-[16px] py-[12px] mb-[16px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Claim expiry date shown is final date of submission with late submission fine if applicable.</p>
            </div>

            <p className="text-[16px] text-[#697498] mb-[12px]" style={{ fontFamily: font }}>
              Available: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{ROWS.length}</span>
            </p>

            {/* Results table */}
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                  <thead>
                    <tr>
                      {[
                        { label: 'Declaration No.', w: 160 },
                        { label: 'Declaration Date', w: 140 },
                        { label: 'Deposit Type', w: 170 },
                        { label: 'Deposit Amount (AED)', w: 170 },
                        { label: 'Claim Expiry', w: 130 },
                        { label: 'Export Expiry', w: 130 },
                        { label: 'Declaration Owner', w: 220 },
                        { label: 'Client Reference No.', w: 160 },
                      ].map((h, i) => (
                        <th key={h.label} style={{ background: '#a6c2e9', padding: '12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', width: h.w, borderRadius: i === 0 ? '8px 0 0 0' : i === 7 ? '0 8px 0 0' : undefined }}>
                          {h.label}<SortArrows />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r) => (
                      <tr key={r.declNo}>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px]" style={{ color: '#1360d2', fontWeight: 500 }}>{r.declNo}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{r.declDate}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{r.depositType}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="inline-flex items-baseline gap-[4px] text-[16px] text-[#0e1b3d]"><Dh style={{ fontSize: 14 }} />{r.depositAmount}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px]" style={{ color: '#dc3545' }}>{r.claimExpiry}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px]" style={{ color: '#dc3545' }}>{r.exportExpiry}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{r.owner}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#0e1b3d]">{r.clientRef}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
