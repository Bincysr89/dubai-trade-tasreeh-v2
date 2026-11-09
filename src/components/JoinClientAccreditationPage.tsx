import React, { useState } from 'react';
import Header from './Header';
import { DhAmount } from './Dh';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

const AUTOFILL_USER = {
  name: 'Ahmed Al Mansoori',
  company: 'Dubai Trade LLC',
  contactPerson: 'Ahmed Al Mansoori',
  email: 'ahmed.almansoori@dubaitrade.ae',
  phone: '42123456',
  mobile: '551234567',
};

/* ── Shared helpers ─────────────────────────────────────────────────────── */
function FloatField({
  label, value, onChange, readOnly, hint, required,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  readOnly?: boolean; hint?: string; required?: boolean;
}) {
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ minWidth: 0 }}>
      <div className="dc-float-field">
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          style={readOnly ? { background: '#f5f7fa', cursor: 'default', color: '#697498' } : undefined}
        />
        <label className="dc-float-label">
          {label}{required && <span className="dc-req"> *</span>}
        </label>
      </div>
      {hint && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4, color: '#5e6b7a', fontSize: 13 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {hint}
        </div>
      )}
    </div>
  );
}

function FloatFieldFull({
  label, value, onChange, required,
}: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="dc-float-wrapper" style={{ flex: 1, minWidth: 0 }}>
      <div className="dc-float-field">
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => onChange?.(e.target.value)}
        />
        <label className="dc-float-label">
          {label}{required && <span className="dc-req"> *</span>}
        </label>
      </div>
    </div>
  );
}

function PhoneField({ label, hint, disabled, defaultNum }: { label: string; hint?: string; disabled?: boolean; defaultNum?: string }) {
  const [code, setCode] = useState('+971');
  const [num, setNum] = useState(defaultNum ?? '');
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ minWidth: 0 }}>
      <div className="dc-float-field" style={{ display: 'flex', padding: 0, overflow: 'hidden', background: disabled ? '#f5f7fa' : undefined }}>
        {/* Country code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 12px', background: disabled ? '#edf0f5' : '#f8fafd', borderRight: `1px solid ${disabled ? '#e5e7eb' : '#d5ddfb'}`, flexShrink: 0, minWidth: 90 }}>
          <select value={code} disabled={disabled} onChange={e => !disabled && setCode(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: 15, color: disabled ? '#9ca3af' : '#0e1b3d', appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: font }}>
            <option value="+971">+971</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+91">+91</option>
          </select>
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" style={{ pointerEvents: 'none' }}>
            <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          className="dc-float-input"
          placeholder=" "
          value={num}
          readOnly={disabled}
          onChange={e => !disabled && setNum(e.target.value)}
          style={{ flex: 1, borderRadius: 0, border: 'none', paddingLeft: 14, background: 'transparent', color: disabled ? '#9ca3af' : undefined, cursor: disabled ? 'not-allowed' : undefined }}
        />
        <label className="dc-float-label" style={{ left: 105 }}>{label}</label>
      </div>
      {hint && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4, color: '#5e6b7a', fontSize: 13 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ── Service detail tile ────────────────────────────────────────────────── */
function ServiceTile({ icon, label, value, wide }: { icon: React.ReactNode; label: string; value: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      flex: wide ? '1 1 100%' : '1 1 calc(50% - 6px)',
      background: '#f5f9ff',
      boxShadow: '0 1px 1.5px rgba(16,24,40,.06)',
      borderRadius: 12,
      display: 'flex',
      gap: 14,
      padding: '16px 20px',
      alignItems: 'flex-start',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#d7e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 15, color: '#9ca3af', fontFamily: font }}>{label}</span>
        <span style={{ fontSize: 16, color: '#0e1b3d', fontFamily: font }}>{value}</span>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function JoinClientAccreditationPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState(AUTOFILL_USER.name);
  const [company, setCompany] = useState(AUTOFILL_USER.company);
  const [contactPerson, setContactPerson] = useState(AUTOFILL_USER.contactPerson);
  const [email, setEmail] = useState(AUTOFILL_USER.email);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-10">
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#27AE60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#27AE60', fontFamily: font, textAlign: 'center' }}>
            Join Client Accreditation Request Submitted Successfully
          </h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', textAlign: 'center', maxWidth: 600 }}>
            <p style={{ color: '#697498', fontSize: 15, fontFamily: font, marginBottom: 12 }}>
              Your request has been submitted. You will be notified once reviewed.
            </p>
            <p style={{ fontWeight: 700, color: '#0e1b3d', fontSize: 16, fontFamily: font }}>
              Request Number: REQ-JCA-560010546
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="dc-btn dc-btn--outline" onClick={onBack}>Back To Listing</button>
            <button className="dc-btn dc-btn--blue">Print</button>
            <button className="dc-btn dc-btn--blue" onClick={onBack}>View Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onBack} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item">
            <button className="dc-breadcrumb__link" onClick={onBack}>Home</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>DC - Service Request</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <span className="dc-breadcrumb__current">Join Client Accreditation</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <h2 className="dc-info-header__title">Join Client Accreditation</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Card 1 — Service Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Service Details</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <ServiceTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
                  label="Service Name"
                  value="Join Client Accreditation"
                />
                <ServiceTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
                  label="Charges"
                  value={<DhAmount value="200.00" style={{ fontSize: 20, fontWeight: 700, color: '#1360D2' }} />}
                />
                <ServiceTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
                  label="Service Description"
                  value="This service allows clients to submit a request for enrollment in Dubai Customs Client Accreditation Program."
                />
                <ServiceTile
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                  label="Requirements"
                  value="Copy of trade license"
                />
              </div>
            </div>
          </div>

          {/* Card 2 — Contact Information */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Contact Information</h4>

              <div className="dc-form-row">
                <FloatField label="Name" value={name} readOnly required />
                <FloatField label="Company" value={company} readOnly required />
              </div>

              <div className="dc-form-row">
                <FloatField label="Contact Person" value={contactPerson} readOnly required />
                {/* Email with Verified badge */}
                <div className="dc-float-wrapper dc-field--half" style={{ minWidth: 0 }}>
                  <div className="dc-float-field" style={{ display: 'flex', alignItems: 'center', paddingRight: 8, background: '#f5f7fa' }}>
                    <input
                      className="dc-float-input"
                      placeholder=" "
                      value={email}
                      readOnly
                      style={{ flex: 1, border: 'none', outline: 'none', paddingRight: 80, background: 'transparent', color: '#9ca3af', cursor: 'not-allowed' }}
                    />
                    <label className="dc-float-label">Email <span className="dc-req">*</span></label>
                    <span style={{
                        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                        background: '#edf7f0', color: '#16a34a', borderRadius: 6,
                        padding: '6px 14px', fontSize: 14, fontFamily: font, fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                      ✓ Verified
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4, color: '#5e6b7a', fontSize: 13 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Contact person email ID
                  </div>
                </div>
              </div>

              <div className="dc-form-row">
                <PhoneField label="Phone" hint="Numbers and hyphen only, e.g. 4-4177777" disabled defaultNum={AUTOFILL_USER.phone} />
                <PhoneField label="Mobile" hint="Contact person mobile number (numbers and hyphen)" disabled defaultNum={AUTOFILL_USER.mobile} />
              </div>
            </div>
          </div>

          {/* Card 3 — Request Information */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Request Information</h4>

              <div className="dc-form-row">
                <FloatFieldFull label="Subject" value={subject} onChange={setSubject} required />
              </div>

              {/* Description textarea */}
              <div style={{ position: 'relative', marginTop: 4 }}>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder=" "
                  rows={4}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1px solid #d5ddfb', borderRadius: 8, padding: '28px 16px 12px',
                    fontFamily: font, fontSize: 15, color: '#0e1b3d', resize: 'vertical',
                    outline: 'none', background: '#fff',
                  }}
                />
                <label style={{
                  position: 'absolute', top: 0, left: 16, transform: 'translateY(-50%)',
                  fontSize: 12, color: '#1360D2', fontWeight: 500, background: '#fff', padding: '0 4px',
                  pointerEvents: 'none',
                }}>
                  Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 4 — Attachments */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Attachments</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: '#5e6b7a', fontSize: 13, marginBottom: 12 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff is allowed, maximum 5MB per file
              </div>
              <div style={{
                border: '1px dashed #8f94ae', borderRadius: 4, background: '#f8fafd',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '20px 0', cursor: 'pointer',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: '#e2e5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <span style={{ color: '#6b7280', fontSize: 15, fontFamily: font }}>Drag and drop files here</span>
                <span style={{ color: '#9ca3af', fontSize: 15, fontFamily: font }}>-Or-</span>
                <button
                  type="button"
                  style={{ border: '1px solid #1360D2', borderRadius: 4, background: '#fff', color: '#1360D2', padding: '9px 17px', fontFamily: font, fontSize: 15, cursor: 'pointer' }}
                >
                  Browse File
                </button>
              </div>
            </div>
          </div>

          {/* Card 5 — CAPTCHA */}
          <div className="dc-form-card">
            <div className="dc-form-section" style={{ paddingBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 500 }}>
                {/* CAPTCHA display */}
                <div style={{
                  background: '#eef4ff', border: '1px solid #d5ddfb', borderRadius: 8,
                  height: 56, minWidth: 176, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Courier New, monospace', fontSize: 22, fontWeight: 700,
                  letterSpacing: 8, textDecoration: 'line-through', color: '#0e1b3d', flexShrink: 0,
                }}>
                  bpdx
                </div>
                {/* CAPTCHA input */}
                <div className="dc-float-wrapper" style={{ flex: 1 }}>
                  <div className="dc-float-field">
                    <input
                      className="dc-float-input"
                      placeholder=" "
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value)}
                    />
                    <label className="dc-float-label">Enter the code shown</label>
                  </div>
                </div>
                {/* Refresh */}
                <button
                  type="button"
                  style={{ width: 56, height: 56, borderRadius: 12, background: '#e7f2fe', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
      }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="dc-btn dc-btn--blue"
          onClick={() => setSubmitted(true)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
