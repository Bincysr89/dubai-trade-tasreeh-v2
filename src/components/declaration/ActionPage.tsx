import React from 'react';
import { font } from './DeclarationUI';

type Props = {
  title: React.ReactNode;
  /** Trailing breadcrumb crumb; the leading crumbs are always Home / Service Catalog. */
  crumb?: string;
  onHome?: () => void;
  /** Rendered on the same line as the title, pushed to the right. */
  titleAction?: React.ReactNode;
  /** Shown under the title, e.g. "Declaration No: 123456". */
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  /** Bottom bar; omitted when there is nothing to do. */
  onBack?: () => void;
  footerRight?: React.ReactNode;
};

/**
 * Shell shared by the declaration row actions — Cancel, Declaration History,
 * Suspension History and the Declarant's Response. Breadcrumb and agent banner on top,
 * a scrolling body, and a sticky bottom bar.
 */
export default function ActionPage({
  title, crumb = 'Integrated Clearance', onHome, titleAction, subtitle, children, onBack, footerRight,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onHome} className="text-[16px] text-[#8f94ae] hover:underline">Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Service Catalog</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>{crumb}</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[32px]">
        <div className="flex items-start justify-between gap-[16px] flex-wrap mb-[8px]">
          <h1 className="text-[32px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{title}</h1>
          {titleAction}
        </div>
        {subtitle && <p className="text-[24px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>{subtitle}</p>}
        <div className="mt-[16px]">{children}</div>
      </div>

      {(onBack || footerRight) && (
        <div className="flex-shrink-0 bg-white flex items-center justify-between gap-[16px] px-4 sm:px-10 py-[16px] flex-wrap"
          style={{ boxShadow: '0px -4px 20px rgba(143,155,186,0.16)' }}>
          {onBack ? (
            <button data-secondary-btn type="button" onClick={onBack}
              className="h-[48px] px-[34px] rounded-[4px] border bg-white text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
            >Back</button>
          ) : <span />}
          <div className="flex items-center gap-[12px] flex-wrap">{footerRight}</div>
        </div>
      )}
    </div>
  );
}

export function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="h-[48px] px-[34px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
      style={{ background: '#1360d2', fontWeight: 500, fontFamily: font }}
    >{children}</button>
  );
}

export function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button data-secondary-btn type="button" onClick={onClick}
      className="h-[48px] px-[34px] rounded-[4px] border bg-white text-[16px] transition-colors"
      style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}
    >{children}</button>
  );
}
