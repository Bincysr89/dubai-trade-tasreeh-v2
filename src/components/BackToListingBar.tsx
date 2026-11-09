import React from 'react';

type Props = {
  /** Provide to render a "Back" button (returns to the previous screen). */
  onBack?: () => void;
  /** Provide to render a "Back to Listing" button (returns to the main listing). */
  onBackToListing?: () => void;
  rightContent?: React.ReactNode;
};

/**
 * Sticky bottom action bar. Reference: Figma node 71:123333.
 * Renders any combination of "Back" / "Back to Listing" depending on which
 * handlers are supplied.
 */
export default function BackToListingBar({ onBack, onBackToListing, rightContent }: Props) {
  return (
    <div
      className="bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between flex-shrink-0"
      style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', position: 'sticky', bottom: 0, zIndex: 10 }}
    >
      <div className="flex items-center gap-[12px]">
        {onBackToListing && (
          <button data-secondary-btn
            onClick={onBackToListing}
            className="h-[48px] px-[20px] py-[10px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, textTransform: 'capitalize' }}
          >
            Back to Listing
          </button>
        )}
        {onBack && (
          <button data-secondary-btn
            onClick={onBack}
            className="h-[48px] px-[20px] py-[10px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
          >
            Back
          </button>
        )}
      </div>
      {rightContent}
    </div>
  );
}
