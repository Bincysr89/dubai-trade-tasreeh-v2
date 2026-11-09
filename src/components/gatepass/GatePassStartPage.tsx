import { useState } from 'react';
import { font, GatePage, GInput, GSection, GRadioCards, NeedHelp, SecondaryBtn } from './GateFields';
import { DhAmount } from '../Dh';
import { GATE_PASS_FORM_TITLE, GATE_ROWS, PASS_FEE, REISSUE_FEE, type GateRow, type PassCategory } from './gatePassData';

type Props = {
  onHome: () => void;
  onBackToListing: () => void;
  /** Old pass found → open the form prefilled from it. */
  onApplyFromOld: (row: GateRow) => void;
  onCreateNew: (category: PassCategory) => void;
  /** Open with "Apply from Old Pass" pre-selected (from the form's button). */
  initialMode?: 'old' | 'new';
};

/* ── Help & Guides tabs (Figma 3:25029) ── */
import HelpGuides, { type HelpContent } from './HelpGuides';

const HELP: HelpContent = {
  about: <>This service applies to all vessel calling Dubai Ports , Drydocks and Ship Yards.  Ship Agent must submit the
    Pre-Arrival Notification in line with procedure  PCFC-DPA-PS-CP-09. Please prepare the Pre-Arrival
    Notification Consent form as per the excel format.</>,
  accordions: [
    { title: 'Services Details', body: <>Tasreeh Gate Passes grant visitors, contractors and maintenance crews controlled access to port premises.
      Passes are issued per port (Apply from Old Pass) or per zone (Create New Pass) for the selected duration.</> },
    { title: 'Service Fee', body: (
      <div className="flex flex-col gap-[6px]">
        <span className="flex items-center gap-[8px]">Gate pass fee: <DhAmount value={PASS_FEE} className="font-medium text-[#0e1b3d]" /></span>
        <span className="flex items-center gap-[8px]">Lost pass reissuing fee: <DhAmount value={REISSUE_FEE} className="font-medium text-[#0e1b3d]" /></span>
      </div>
    ) },
    { title: 'Required Documents', body: <>Personal Photo, Passport, Emirates ID, Visa (for residents) and any other supporting documents.
      Files must be png/jpg/gif/pdf and no larger than 2MB each.</> },
  ],
  faqs: [
    { q: 'Who can apply for a Tasreeh gate pass?', a: 'Registered suppliers, shipping agents and their sub-users can request gate passes for visitors who need access to port premises.' },
    { q: 'Can I reuse the details of an old pass?', a: 'Yes. Choose "Apply from Old Pass", enter the pass reference or application number and the visitor details are filled in for you.' },
    { q: 'What happens if a pass is lost?', a: 'Use "Report Lost Pass" from the listing actions. A police report is required and a reissuing fee applies.' },
  ],
  updates: [
    { date: '14 Oct 2026', text: 'Gate passes can now be renewed directly from the listing.' },
    { date: '02 Sep 2026', text: 'Zone-based passes let one request cover a predefined group of ports.' },
  ],
  downloads: ['Tasreeh Gate Pass — User Manual (PDF)', 'Required documents checklist (PDF)'],
  tutorials: ['Applying from an old pass', 'Creating a zone pass', 'Renewing or reporting a lost pass'],
};

export default function GatePassStartPage({ onHome, onBackToListing, onApplyFromOld, onCreateNew, initialMode = 'new' }: Props) {
  const [mode, setMode] = useState<'old' | 'new'>(initialMode);
  const [ref, setRef] = useState('');
  const [category, setCategory] = useState<PassCategory | ''>('');

  /* No blocking validation — defaults keep the prototype moving. */
  const proceed = () => {
    if (mode === 'new') { onCreateNew(category || 'port'); return; }
    const q = ref.trim().toLowerCase();
    const found = GATE_ROWS.find(r => r.passRefNo.toLowerCase() === q || r.applicationNo === q
      || r.passRefNo.toLowerCase().replace('gp-', '') === q);
    onApplyFromOld(found ?? GATE_ROWS[0]);
  };

  return (
    <GatePage
      title={GATE_PASS_FORM_TITLE}
      titleExtra={<NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
    >
      {/* Request choice (Figma 3:25000) — Create New asks for the pass category first */}
      <GSection title="Request Information">
        <GRadioCards
          name="request-mode"
          value={mode}
          onChange={v => setMode(v as 'old' | 'new')}
          options={[
            { value: 'old', label: 'Apply from Old Pass', sub: 'Reuse the details of a previously issued pass' },
            { value: 'new', label: 'Create New Pass', sub: 'Start a fresh gate pass request' },
          ]}
        />

        <div className="mt-[26px]">
          {mode === 'new' ? (
            <>
              <p className="text-[16px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font, fontWeight: 600 }}>
                <span style={{ color: '#dc3545' }}>*</span> Pass Category
              </p>
              {/* Category cards and Proceed share one row */}
              <div className="flex items-center gap-[16px] flex-wrap lg:flex-nowrap">
                <div className="flex-1 min-w-0 max-w-[1056px]">
                  <GRadioCards
                    name="pass-category"
                    value={category}
                    onChange={v => setCategory(v as PassCategory)}
                    options={[
                      { value: 'port', label: 'Port Access', sub: 'You can only choose one port per request' },
                      { value: 'zone', label: 'Zone Access', sub: 'You can only choose zones(predefined group of ports) per request' },
                    ]}
                  />
                </div>
                <button onClick={proceed}
                className="h-[56px] w-[210px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
                style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
                Proceed
              </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-[16px] flex-wrap">
              <div className="w-full sm:w-[420px]">
                <GInput label="Pass Reference Number/Application Number" value={ref} onChange={setRef} />
              </div>
              <button onClick={proceed}
                className="h-[56px] w-[210px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
                style={{ background: '#1360d2', fontFamily: font, fontWeight: 600 }}>
                Proceed
              </button>
            </div>
          )}
        </div>
      </GSection>

      <HelpGuides content={HELP} />
    </GatePage>
  );
}
