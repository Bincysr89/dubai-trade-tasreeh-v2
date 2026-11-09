import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { font, GSection, Grid4, GInput, GSelect, PrimaryBtn, SecondaryBtn } from '../components/gatepass/GateFields';
import { setAuthenticated } from '../auth';
import { setPersona } from '../persona';
const uaePassLogoSrc = new URL('../assets/uaepass-logo.svg', import.meta.url).href;
const dtLogoSrc = new URL('../assets/dt-logo-login.svg', import.meta.url).href;

/* ──────────────────────────────────────────────────────────────
   UAE PASS sign-in for an individual (User Management Figma
   16178:28201 UAE PASS login · 17407:61879 Update Profile).
   ────────────────────────────────────────────────────────────── */

const uaeFont = "'Roboto', 'Helvetica Neue', Arial, sans-serif";
const Stripe = () => <div className="h-[5px] w-full" style={{ background: 'linear-gradient(90deg, #00857c 0%, #7cc6a6 50%, #f3d98b 100%)' }} />;

/* ── UAE PASS — Login (Figma 16178:28201) ── */
export function UaePassLoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('971559524462');
  const [remember, setRemember] = useState(true);

  const login = () => {
    setAuthenticated(true);
    try { sessionStorage.removeItem('dt-bu-linked'); } catch { /* ignore */ }
    setPersona('individual');
    navigate('/uaepass/link');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: uaeFont }}>
      <Stripe />
      <main className="flex-1 flex flex-col items-center px-4 pt-[56px] pb-16">
        <img src={uaePassLogoSrc} alt="UAE PASS" style={{ width: 66, height: 66 }} />
        <h1 className="text-[24px] font-semibold text-[#111] mt-[32px] mb-[30px]">Login to UAE PASS</h1>
        <form className="w-full max-w-[342px] flex flex-col" onSubmit={e => { e.preventDefault(); login(); }}>
          <input value={id} onChange={e => setId(e.target.value)} aria-label="Emirates ID, email or phone"
            placeholder="Emirates ID, email, or phone e.g. 971500000000"
            className="h-[40px] rounded-[6px] px-[13px] text-[15px] text-[#111] focus:outline-none"
            style={{ border: '1px solid #9fc6f5', boxShadow: '0 0 0 2px rgba(19,96,210,0.06)' }} />
          <label className="flex items-center gap-[10px] mt-[14px] text-[13px] text-[#222] cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="size-[16px] cursor-pointer" style={{ accentColor: '#e5195e' }} />
            Remember me
          </label>
          <button type="submit"
            className="h-[40px] mt-[14px] rounded-[4px] text-white text-[16px] font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#7a869e' }}>
            Login
          </button>
        </form>
        <div className="w-full max-w-[342px] h-px bg-[#e5e5e5] mt-[18px] mb-[18px]" />
        <p className="text-[12px] text-[#222]">
          Don&apos;t have UAEPASS account? <a href="#" onClick={e => e.preventDefault()} className="font-semibold" style={{ color: '#00a14b' }}>Create new account</a>
        </p>
        <a href="#" onClick={e => e.preventDefault()} className="text-[12px] font-semibold mt-[24px]" style={{ color: '#00a14b' }}>Recover your account</a>
      </main>
      <footer className="border-t border-[#eee] pt-[18px] flex flex-col items-center gap-[18px]">
        <nav className="flex flex-wrap justify-center gap-x-[22px] gap-y-2 text-[11px] text-[#444]">
          {['Home', 'About', 'Support', 'FAQ', 'Kiosk Locations', 'Service Provider'].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()} className="hover:underline">{l}</a>
          ))}
        </nav>
        <p className="text-[9px] text-[#444] mb-[12px]">Copyright © 2026 UAE PASS All rights reserved.</p>
        <Stripe />
      </footer>
    </div>
  );
}

/* ── Update Profile Information (Figma 17407:61879) ── */
const PROFILE_DEFAULTS = {
  title: 'Mr.', firstName: 'Ahmed', middleName: '', lastName: 'Al Marri', nationality: 'United Arab Emirates',
  poBox: '168901', ageGroup: '36 - 45', designation: 'Engineer', emiratesId: '784-1988-7654321-2',
  email: 'ahmed.almarri@gmail.com', confirmEmail: 'ahmed.almarri@gmail.com', companyPhone: '971 - 4 - 4337000',
  directPhone: '971 - 55 - 9524462', mobile: '971 - 55 - 9524462', fax: '',
};

export function UpdateProfilePage() {
  const navigate = useNavigate();
  const [p, setP] = useState(PROFILE_DEFAULTS);
  const set = (k: keyof typeof PROFILE_DEFAULTS) => (v: string) => setP(prev => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd]" style={{ fontFamily: font }}>
      <header className="relative h-[100px] flex items-center px-4 sm:px-[43px] overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(12.6deg, #0e1b3d 51%, #dc3545 146%)' }}>
        <Logo height={46} white />
      </header>

      <main className="flex-1 px-4 sm:px-[43px] pt-[27px] pb-[32px]">
        <h1 className="text-[24px] font-medium text-[#111838] mb-[24px]">Update Profile Information</h1>
        <GSection title="Profile Information">
          <Grid4>
            <GSelect label="Title" value={p.title} options={['Mr.', 'Mrs.', 'Ms.', 'Dr.']} onChange={set('title')} required />
            <GInput label="First Name" value={p.firstName} onChange={set('firstName')} required />
            <GInput label="Middle Name" value={p.middleName} onChange={set('middleName')} placeholder="--" />
            <GInput label="Last Name" value={p.lastName} onChange={set('lastName')} required />
            <GInput label="Nationality" value={p.nationality} readOnly />
            <GInput label="P.O Box" value={p.poBox} onChange={set('poBox')} required />
            <GSelect label="Age Group" value={p.ageGroup} options={['18 - 25', '26 - 35', '36 - 45', '46 - 55', '56+']} onChange={set('ageGroup')} />
            <GInput label="Designation" value={p.designation} onChange={set('designation')} required />
            <GInput label="Emirates ID" value={p.emiratesId} readOnly />
          </Grid4>
        </GSection>
        <GSection title="Contact Information">
          <Grid4>
            <GInput label="E-mail" value={p.email} onChange={set('email')} required />
            <GInput label="Confirm E-mail" value={p.confirmEmail} onChange={set('confirmEmail')} required />
            <GInput label="Company Telephone No" value={p.companyPhone} onChange={set('companyPhone')} required />
            <GInput label="Direct Telephone No" value={p.directPhone} onChange={set('directPhone')} required />
            <GInput label="Mobile No" value={p.mobile} onChange={set('mobile')} required />
            <GInput label="Fax No" value={p.fax} onChange={set('fax')} placeholder="971 - 4 - XXXXXXX" />
          </Grid4>
        </GSection>
      </main>

      <div className="bg-white flex items-center justify-between gap-[16px] px-4 sm:px-[40px] py-[16px] sticky bottom-0"
        style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
        <SecondaryBtn onClick={() => navigate('/login')}>Cancel</SecondaryBtn>
        <div className="flex items-center gap-[16px]">
          <SecondaryBtn onClick={() => setP(PROFILE_DEFAULTS)}>Reset</SecondaryBtn>
          <PrimaryBtn onClick={() => navigate('/landing/individual', { state: { welcome: true } })}>Submit</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   UAE PASS ↔ Dubai Trade profile linking (User Management Figma
   16140:24176 choose · 16140:24173 existing-account login)
   ────────────────────────────────────────────────────────────── */
function LinkShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center px-4 pt-[52px] pb-16" style={{ fontFamily: font }}>
      <p className="text-[13px] font-bold tracking-[0.6px] text-[#6b7a99] mb-[36px] text-center">UAE PASS — DUBAI TRADE PROFILE LINKING</p>
      <div className="flex items-center gap-[20px] mb-[44px]">
        <div className="flex flex-col items-center gap-[10px] w-[90px]">
          <img src={uaePassLogoSrc} alt="" style={{ width: 70, height: 70 }} />
          <span className="text-[13px] font-bold text-[#0e1b3d]">UAE PASS</span>
        </div>
        <div className="flex items-center mb-[26px]">
          <span className="w-[40px] h-[2px] bg-[#c9cfdd]" />
          <span className="size-[38px] rounded-full bg-white flex items-center justify-center" style={{ border: '2px solid #c9cfdd' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6b7a99" strokeWidth="2" strokeLinecap="round">
              <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
            </svg>
          </span>
          <span className="w-[40px] h-[2px] bg-[#c9cfdd]" />
        </div>
        <div className="flex flex-col items-center gap-[8px] w-[90px]">
          <img src={dtLogoSrc} alt="" style={{ height: 52, width: 'auto' }} />
          <span className="text-[13px] font-bold text-[#0e1b3d]">Dubai Trade</span>
        </div>
      </div>
      <div className="bg-white rounded-[16px] w-full max-w-[560px] px-[24px] sm:px-[40px] py-[40px]" style={{ boxShadow: '0 4px 24px rgba(14,27,61,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

const InfoIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" className="flex-shrink-0"><circle cx="10" cy="10" r="8" fill="#6b7a99" /><path d="M10 9v5M10 6.2v.01" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
const BackArrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8H3M7 4L3 8l4 4" /></svg>
);

/* ── Do you have an existing Dubai Trade account? (Figma 16140:24176) ── */
export function UaePassLinkChoicePage() {
  const navigate = useNavigate();
  const [pick, setPick] = useState<'existing' | 'new' | null>(null);
  const choose = (c: 'existing' | 'new') => {
    setPick(c);
    if (c === 'new') {
      /* New individual: a fresh, unlinked basic account */
      try { sessionStorage.removeItem('dt-bu-linked'); } catch { /* ignore */ }
      setPersona('individual');
    }
    setTimeout(() => navigate(c === 'existing' ? '/uaepass/existing' : '/uaepass/profile'), 150);
  };
  const options = [
    { id: 'existing' as const, title: 'Yes, I have an account', sub: 'Link UAE PASS to your existing Dubai Trade profile' },
    { id: 'new' as const, title: "No, I'm new here", sub: 'Create a Dubai Trade profile using your UAE PASS data' },
  ];
  return (
    <LinkShell>
      <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111] text-center">Do you have an existing Dubai Trade account?</h1>
      <p className="text-[14px] text-[#6b7a99] text-center mt-[12px] mb-[32px]">Select an option below to link or create your Dubai Trade profile.</p>
      <div className="flex flex-col gap-[14px]" role="radiogroup" aria-label="Dubai Trade account">
        {options.map(o => {
          const on = pick === o.id;
          return (
            <button key={o.id} role="radio" aria-checked={on} onClick={() => choose(o.id)}
              className="group flex items-center gap-[16px] rounded-[8px] px-[20px] py-[18px] text-left transition-colors hover:border-[#9db3e8]"
              style={{ border: `2px solid ${on ? '#c3d0f5' : '#dfe3ee'}`, background: on ? '#eef2fd' : '#f6f7fb' }}>
              <span className="size-[52px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: on ? '#0e1b3d' : '#7a849c' }}>
                {o.id === 'existing'
                  ? <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.2v.01" strokeLinecap="round" /></svg>}
              </span>
              <span>
                <span className="block text-[16px] font-bold text-[#0e1b3d]">{o.title}</span>
                <span className="block text-[13px] text-[#1a1a1a] mt-[4px]">{o.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-[10px] rounded-[8px] px-[16px] py-[14px] mt-[28px] text-[12.5px] text-[#3f4d66]" style={{ background: '#f6f7fb', border: '1px solid #e6e9f2' }}>
        <InfoIcon /> This is a one-time process. Future logins through UAE PASS will be seamless.
      </div>
      <button onClick={() => navigate('/login')} className="mx-auto mt-[16px] flex items-center gap-[6px] text-[13px] font-medium text-[#6b7a99] hover:text-[#1360d2]">
        <BackArrow /> Back to Login
      </button>
    </LinkShell>
  );
}

/* ── Login with your Dubai Trade Credentials (Figma 16140:24173) ── */
export function UaePassExistingLoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const ready = user.trim() !== '' && pass !== '';

  /* Existing Dubai Trade account → same as the username/password login: persona popup, then landing */
  const link = () => navigate('/customer-type');
  const inputCls = 'h-[52px] w-full rounded-[6px] px-[16px] text-[15px] text-[#0e1b3d] placeholder-[#9aa3b8] focus:outline-none focus:border-[#1360d2]';

  return (
    <LinkShell>
      <h1 className="text-[20px] sm:text-[22px] font-bold text-[#111] text-center">Login with your Dubai Trade Credentials</h1>
      <p className="text-[14px] text-[#6b7a99] text-center mt-[12px] mb-[32px]">Enter your credentials to link your UAE PASS account</p>
      <form onSubmit={e => { e.preventDefault(); if (ready) link(); }} className="flex flex-col">
        <label htmlFor="dt-user" className="text-[14px] font-bold text-[#0e1b3d] mb-[8px]">Username <span className="text-[#ea2428]">*</span></label>
        <input id="dt-user" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your username" autoComplete="username"
          className={inputCls} style={{ border: '1px solid #d5ddfb', background: '#f8fafd' }} />
        <label htmlFor="dt-pass" className="text-[14px] font-bold text-[#0e1b3d] mt-[26px] mb-[8px]">Password <span className="text-[#ea2428]">*</span></label>
        <div className="relative">
          <input id="dt-pass" type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password" autoComplete="current-password"
            className={`${inputCls} pr-[48px]`} style={{ border: '1px solid #d5ddfb', background: '#f8fafd' }} />
          <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9aa3b8] hover:text-[#1360d2]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" />
              {show && <path d="M3 3l18 18" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between mt-[18px]">
          <label className="flex items-center gap-[10px] text-[14px] text-[#1a1a1a] cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="size-[16px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
            Remember me
          </label>
          <a href="#" onClick={e => e.preventDefault()} className="text-[14px] font-bold text-[#1360d2] hover:underline">Forgot password?</a>
        </div>
        <button type="submit" disabled={!ready}
          className="h-[52px] mt-[18px] rounded-[6px] text-white text-[16px] font-bold flex items-center justify-center gap-[10px] transition-colors disabled:cursor-not-allowed"
          style={{ background: ready ? '#1360d2' : '#b3bacb' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
          </svg>
          Link Account with UAE PASS
        </button>
      </form>
      <div className="flex items-center gap-[10px] rounded-[8px] px-[16px] py-[14px] mt-[20px]" style={{ background: '#f6f7fb', border: '1px solid #e6e9f2' }}>
        <InfoIcon />
        <button onClick={() => navigate('/uaepass/link')} className="flex items-center gap-[6px] text-[12.5px] font-bold text-[#6b7a99] hover:text-[#1360d2]">
          <BackArrow /> Back to linking options
        </button>
      </div>

    </LinkShell>
  );
}
