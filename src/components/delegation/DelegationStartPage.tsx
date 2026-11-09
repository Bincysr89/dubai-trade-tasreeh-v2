import { font, GatePage, GSection, NeedHelp, SecondaryBtn } from '../gatepass/GateFields';
import HelpGuides, { type HelpContent } from '../gatepass/HelpGuides';
import { DELEGATION_TITLE } from './delegationData';

type Props = {
  onHome: () => void;
  onBackToListing: () => void;
  onProceed: () => void;
};

const INTRO =
  'The Delegation Visits service is designed to streamline and enhance the coordination of official visits within ' +
  'PCFC-managed areas. This service addresses challenges related to uncoordinated or last-minute visits by enabling ' +
  'companies and entities operating in PCFC zones to notify PCFC in advance and request any necessary support from the ' +
  'Security Department.';

const HELP: HelpContent = {
  about: <>This service applies to all companies and entities operating in PCFC-managed zones that host official delegations.
    Notify PCFC Security in advance with the visit programme, visitors and vehicles so access and escort can be arranged.</>,
  accordions: [
    { title: 'Services Details', body: <>Submit the visit date and time, port and gate, contact details, the visit programme and
      the locations to be visited, followed by each visitor and vehicle in the delegation.</> },
    { title: 'Service Fee', body: <>There is no fee for notifying PCFC of a delegation visit.</> },
    { title: 'Required Documents', body: <>ID of each visitor and any supporting documents (invitation letter, programme).
      Files must be png/jpg/gif/pdf and no larger than 2MB each.</> },
  ],
  faqs: [
    { q: 'How far in advance should a visit be notified?', a: 'Submit the request at least 48 hours before the visit so PCFC Security can arrange access and escort.' },
    { q: 'Can I add vehicles to the delegation?', a: 'Yes. Use "+ Add More Vehicle" on the form to list every vehicle entering with the delegation.' },
    { q: 'Can I cancel a request?', a: 'Use "Cancel Request" from the listing actions or the View Request page while the request is under review.' },
  ],
  updates: [
    { date: '10 Oct 2026', text: 'Visitor categories now include Media and Academic delegations.' },
    { date: '18 Aug 2026', text: 'Multiple vehicles can be registered on a single delegation request.' },
  ],
  downloads: ['Delegation Visits — User Manual (PDF)', 'Delegation visit programme template (DOCX)'],
  tutorials: ['Notifying a delegation visit', 'Adding visitors and vehicles', 'Tracking and cancelling a request'],
};

/* Delegation Visits — start page (Figma 3:14292) */
export default function DelegationStartPage({ onHome, onBackToListing, onProceed }: Props) {
  return (
    <GatePage
      title={DELEGATION_TITLE}
      crumb={DELEGATION_TITLE}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
    >
      <GSection title="Request Information">
        {/* Description and Proceed share one row */}
        <div className="flex items-center gap-[30px] flex-wrap lg:flex-nowrap">
          <p className="flex-1 min-w-0 text-[16px] text-[#1a1a1a] leading-[26px]" style={{ fontFamily: font }}>{INTRO}</p>
          <button onClick={onProceed}
            className="h-[56px] w-[210px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
            Proceed
          </button>
        </div>
      </GSection>

      <HelpGuides content={HELP} />
    </GatePage>
  );
}
