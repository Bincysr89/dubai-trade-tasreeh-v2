import { font, GatePage, GSection, NeedHelp, SecondaryBtn } from '../gatepass/GateFields';
import HelpGuides from '../gatepass/HelpGuides';
import type { ServiceConfig } from './serviceTypes';

/* Generic Tasreeh start page — intro + Proceed on one row, then Help and Guides */
export default function ServiceStartPage({ config: cfg, onHome, onBackToListing, onProceed }: {
  config: ServiceConfig; onHome: () => void; onBackToListing: () => void; onProceed: () => void;
}) {
  return (
    <GatePage
      title={cfg.title}
      crumb={cfg.title}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
    >
      <GSection title="Request Information">
        <div className="flex items-center gap-[30px] flex-wrap lg:flex-nowrap">
          <p className="flex-1 min-w-0 text-[16px] text-[#1a1a1a] leading-[26px]" style={{ fontFamily: font }}>{cfg.intro}</p>
          <button onClick={onProceed}
            className="h-[56px] w-[210px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
            Proceed
          </button>
        </div>
      </GSection>
      <HelpGuides content={cfg.help} />
    </GatePage>
  );
}
