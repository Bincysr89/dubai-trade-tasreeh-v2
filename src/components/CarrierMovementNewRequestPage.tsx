import React, { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';
import { DateInput } from './DatePicker';

const font = "'Dubai', sans-serif";

/* ─── Floating-label helpers — match the FInput/FSelect convention used across the app ─── */
function FInput({ label, value, onChange, req, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; placeholder?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <input value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={floated ? placeholder : ''}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: '0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: focused ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

function FSelect({ label, value, onChange, options, req, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: disabled ? 'default' : 'pointer', background: disabled ? '#f0f3fa' : '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        {!disabled && (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: open ? '#1360d2' : '#0e1b3d',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && !disabled && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const AIRCRAFT_TYPES = ['Cargo only', 'Combi', 'Passenger', 'Surface Flights', 'Truck'];

type FormState = {
  movementType: string;
  flightNo: string;
  arrDepDate: string;
  scheduleDate: string;
  eta: string;
  ata: string;
  aircraftType: string;
  airportLoadingCode: string;
  airportLoadingName: string;
  airportUnloadingCode: string;
  airportUnloadingName: string;
};
const BLANK: FormState = {
  movementType: '', flightNo: '', arrDepDate: '', scheduleDate: '', eta: '', ata: '', aircraftType: '',
  airportLoadingCode: '', airportLoadingName: '', airportUnloadingCode: '', airportUnloadingName: '',
};

const AIRPORT_NAMES: Record<string, string> = {
  MAA: 'Chennai (ex Madras)', DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport',
  LHR: 'London Heathrow Airport', JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport',
};

/* ─── Airport search combobox — single field, type/search by code, autofill dropdown with code + name ─── */
function AirportSearchField({ label, code, name, onSelect, req }: {
  label: string; code: string; name: string; onSelect: (code: string, name: string) => void; req?: boolean;
}) {
  const [query, setQuery] = useState(code);
  const [open, setOpen] = useState(false);
  React.useEffect(() => setQuery(code), [code]);

  const q = query.trim().toLowerCase();
  const matches = Object.entries(AIRPORT_NAMES).filter(([c, n]) =>
    !q || c.toLowerCase().includes(q) || n.toLowerCase().includes(q)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
      <div className="relative">
        <input
          value={query}
          onChange={e => { const v = e.target.value.toUpperCase(); setQuery(v); setOpen(true); if (!v) onSelect('', ''); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="e.g. MAA"
          className="w-full rounded-[4px] text-[16px]"
          style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, padding: '0 52px 0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: '#fff', transition: 'border-color 120ms' }} />
        <span className="absolute pointer-events-none" style={{
          left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12,
          color: open ? '#1360d2' : '#0e1b3d', fontFamily: font,
        }}>
          {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
        </span>
        <button type="button" onClick={() => setOpen(o => !o)} tabIndex={-1}
          className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
        </button>
        {open && matches.length > 0 && (
          <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {matches.map(([c, n]) => (
              <button key={c} type="button" onMouseDown={() => { onSelect(c, n); setQuery(c); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors" style={{ fontFamily: font }}>
                <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{c}</span>
                <span style={{ color: '#697498' }}> — {n}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <FInput label="Airport Name" value={name} onChange={() => {}} disabled />
    </div>
  );
}

type Step = 'start' | 'details' | 'success';

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
  onContinueToFlightManifest: () => void;
};

export default function CarrierMovementNewRequestPage({ onBack, onBackToListing, onContinueToFlightManifest }: Props) {
  const [step, setStep] = useState<Step>('start');
  const [form, setForm] = useState<FormState>(BLANK);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const step1Valid = form.movementType && form.flightNo.trim() && form.arrDepDate && form.scheduleDate;
  const step2Valid = form.airportLoadingCode.trim() && form.airportUnloadingCode.trim() && form.aircraftType;

  const Breadcrumb = () => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Service Catalog</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Submit Cargo Information</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New Carrier Movement</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[56px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>Carrier Movement Created Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[16px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Dear Customer Thank You For Using Carrier Movement Request Web Application.</p>
            </div>
            <button onClick={onContinueToFlightManifest}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Continue To Flight Manifest
            </button>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb />

      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0 flex-wrap">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>New Carrier Movement</h1>
        {step === 'details' && (
          <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2]" style={{ fontFamily: font }}>
            Need Help
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        {step === 'start' ? (
          <>
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Enter Information to Get Started</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                <FSelect label="Movement Type" value={form.movementType} onChange={v => set('movementType', v)} options={['Arrival', 'Departure']} req />
                <FInput label="Flight Number" value={form.flightNo} onChange={v => set('flightNo', v)} req />
                <DateInput label="Arrival/Departure Date" value={form.arrDepDate} onChange={v => set('arrDepDate', v)} required />
                <DateInput label="Scheduled Date of Arrival" value={form.scheduleDate} onChange={v => set('scheduleDate', v)} required />
              </div>
              <div>
                <button onClick={() => setStep('details')}
                  className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                  style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                  Next
                </button>
              </div>
            </div>

            {/* Help and Guides */}
            <div className="flex items-center gap-[8px]">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0e1b3d" strokeWidth="1.6"><path d="M4 5h7v15H4z" /><path d="M20 5h-7v15h7z" /></svg>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Help and Guides</p>
            </div>
            <div className="bg-white rounded-[8px] p-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex items-center gap-[8px]">
                <span className="text-[16px] px-[16px] py-[8px] rounded-[4px] text-white" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>Information</span>
                {['Tutorials', 'FAQ’S', 'Updates', 'Downloads'].map(t => (
                  <span key={t} className="text-[16px] px-[16px] py-[8px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[18px] text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font, fontWeight: 700 }}>About the Service</p>
              <p className="text-[16px] text-[#455174]" style={{ fontFamily: font, lineHeight: 1.5 }}>
                Submit Cargo Information lets registered carriers and agents notify Dubai Customs of a flight&apos;s
                arrival or departure movement, ahead of manifest and clearance filing.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <FSelect label="Movement Type" value={form.movementType} onChange={v => set('movementType', v)} options={['Arrival', 'Departure']} req />
              <FInput label="Flight Number" value={form.flightNo} onChange={v => set('flightNo', v)} req />
              <DateInput label="Arrival/Departure Date" value={form.arrDepDate} onChange={v => set('arrDepDate', v)} required />
              <DateInput label="Scheduled Date of Arrival" value={form.scheduleDate} onChange={v => set('scheduleDate', v)} required />
            </div>
            <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <DateInput label="Estimated Time of Arrival" value={form.eta} onChange={v => set('eta', v)} showTime />
              <DateInput label="Actual Time of Arrival" value={form.ata} onChange={v => set('ata', v)} showTime />
              <FSelect label="Aircraft Type" value={form.aircraftType} onChange={v => set('aircraftType', v)} options={AIRCRAFT_TYPES} req />
            </div>
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <AirportSearchField
                label="Airport of Loading" req
                code={form.airportLoadingCode} name={form.airportLoadingName}
                onSelect={(code, name) => setForm(f => ({ ...f, airportLoadingCode: code, airportLoadingName: name }))}
              />
              <AirportSearchField
                label="Airport of Unloading" req
                code={form.airportUnloadingCode} name={form.airportUnloadingName}
                onSelect={(code, name) => setForm(f => ({ ...f, airportUnloadingCode: code, airportUnloadingName: name }))}
              />
            </div>
          </>
        )}
      </div>

      {step === 'details' && (
        <BackToListingBar
          onBack={() => setStep('start')}
          rightContent={
            <div className="flex items-center gap-[12px]">
              <button data-secondary-btn onClick={() => setForm(f => ({ ...BLANK, movementType: f.movementType, flightNo: f.flightNo, arrDepDate: f.arrDepDate, scheduleDate: f.scheduleDate }))}
                className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Reset
              </button>
              <button onClick={() => setStep('success')}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
                Submit
              </button>
            </div>
          }
        />
      )}
      {step === 'start' && <BackToListingBar onBackToListing={onBackToListing} />}
    </div>
  );
}
