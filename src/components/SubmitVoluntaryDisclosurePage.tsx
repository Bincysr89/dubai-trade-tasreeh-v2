import React, { useState } from 'react';
import Header from './Header';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

function FloatField({
  label, value, onChange, readOnly, required,
}: {
  label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; required?: boolean;
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
    </div>
  );
}

function FloatSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ minWidth: 0 }}>
      <div className="dc-float-field" style={{ position: 'relative' }}>
        <select
          className="dc-float-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 32 }}
        >
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <label className="dc-float-label" style={{ pointerEvents: 'none', top: 0, transform: 'translateY(-50%)', fontSize: '12px', color: '#1360D2', fontWeight: 500, background: '#fff' }}>
          {label}{required && <span className="dc-req"> *</span>}
        </label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
            <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const DISCLOSURE_TYPES = [
  'Incorrect Declaration of Value',
  'Incorrect Declaration of Origin',
  'Incorrect HS Code',
  'Under-Declaration of Goods',
  'Prohibited Goods Declaration',
  'Other',
];

export default function SubmitVoluntaryDisclosurePage({ onBack }: { onBack: () => void }) {
  const [declarationNo, setDeclarationNo] = useState('');
  const [disclosureDate, setDisclosureDate] = useState('');
  const [disclosureType, setDisclosureType] = useState('');
  const [reason, setReason] = useState('');
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
            Voluntary Disclosure Request Submitted Successfully
          </h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 36px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', textAlign: 'center', maxWidth: 600 }}>
            <p style={{ color: '#697498', fontSize: 15, fontFamily: font, marginBottom: 12 }}>
              Your voluntary disclosure has been submitted and is under review.
            </p>
            <p style={{ fontWeight: 700, color: '#0e1b3d', fontSize: 16, fontFamily: font }}>
              Request Number: REQ-VD-560010547
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
            <span className="dc-breadcrumb__current">Submit Voluntary Disclosure</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <h2 className="dc-info-header__title">Submit Voluntary Disclosure</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Card 1 — Service Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Service Details</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {[
                  { label: 'Service Name', value: 'Submit Voluntary Disclosure' },
                  { label: 'Charges', value: 'No Charge' },
                  { label: 'Service Description', value: 'This service allows clients to voluntarily disclose incorrect or incomplete customs declarations to Dubai Customs.' },
                  { label: 'Requirements', value: 'Original declaration documents, Correction justification letter' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    flex: '1 1 calc(50% - 6px)', background: '#f5f9ff',
                    boxShadow: '0 1px 1.5px rgba(16,24,40,.06)', borderRadius: 12,
                    display: 'flex', gap: 14, padding: '16px 20px', alignItems: 'flex-start',
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#d7e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 15, color: '#9ca3af', fontFamily: font }}>{label}</span>
                      <span style={{ fontSize: 16, color: '#0e1b3d', fontFamily: font }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 — Disclosure Details */}
          <div className="dc-form-card">
            <div className="dc-form-section">
              <h4 className="dc-form-section__heading">Disclosure Details</h4>

              <div className="dc-form-row">
                <FloatField label="Declaration Number" value={declarationNo} onChange={setDeclarationNo} required />
                <FloatField label="Disclosure Date" value={disclosureDate} onChange={setDisclosureDate} required />
              </div>

              <div className="dc-form-row">
                <FloatSelect label="Disclosure Type" value={disclosureType} onChange={setDisclosureType} options={DISCLOSURE_TYPES} required />
              </div>

              {/* Reason textarea */}
              <div style={{ position: 'relative', marginTop: 4 }}>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder=" "
                  rows={5}
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
                  Reason for Disclosure <span style={{ color: '#ef4444' }}>*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 3 — Attachments */}
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
