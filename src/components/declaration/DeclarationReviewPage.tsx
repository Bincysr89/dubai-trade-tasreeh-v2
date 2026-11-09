import React, { useState } from 'react';
import {
  Field, JourneyStepper, PartyInformation, SectionCard, SectionTitle, helpSrc, font,
} from './DeclarationUI';

export type PartyLookup = 'exporter' | 'notifyParty' | 'cargoHandler' | 'agent';

type Props = {
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
  /** Amend greys out what cannot change and swaps the overseas-customer button for a link. */
  amend?: boolean;
  onEditImporter?: () => void;
  /** Opens the lookup popups hung off the Person/Parties search icons. */
  onLookup?: (field: PartyLookup) => void;
  onAddOverseasCustomer?: () => void;
};

/**
 * "Custom Declaration" General Information step — what the filing popup hands over to.
 * Figma 2650:43684.
 */
export default function DeclarationReviewPage({ onLookup, onAddOverseasCustomer, steps, stepIndex, amend, onEditImporter }: Props) {
  const [mraAeo, setMraAeo] = useState(false);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={stepIndex ?? 0} steps={steps} />

      {/* ── Declaration Header ── */}
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <SectionTitle>Declaration Header</SectionTitle>
          <button
            data-secondary-btn
            type="button"
            className="flex items-center gap-[10px] h-[48px] px-[20px] rounded-[4px] border bg-white transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >
            <img src={helpSrc} alt="" width={20} height={20} />
            <span className="text-[16px] capitalize">Go to Declaration Assistant</span>
          </button>
        </div>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Regime Type" label="Regime Type" labelRequired disabled trailing="chevron" />
            <Field value="Declaration Type" label="Declaration Type" labelRequired disabled trailing="chevron" />
            <Field value="Sea" label="Cargo Channel" labelRequired disabled trailing="chevron" />
            <Field value={amend ? '123rvg' : 'DO1321312453'} label="Client Decl. Ref. No" labelRequired />
          </div>
        </SectionCard>
      </div>

      {/* ── Person/Parties ── */}
      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Person/Parties</SectionTitle>
        <SectionCard>
          {/* Four columns on the same rhythm as the Declaration Header above */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px] items-start">
            <Field
              value="Importers Code" valueRequired disabled trailing="edit"
              trailingLabel="Edit Importer Code"
              onTrailingClick={onEditImporter}
              chips={['SONY GULF FZE']}
            />

            <Field
              value="Exporters Code" trailing="search"
              trailingLabel="Search Exporters Code"
              onTrailingClick={() => onLookup?.('exporter')}
              chips={['Maersk Shipping']}
            />

            {/* The alternative to an exporter code, so it sits in the column beside it.
                Amend offers it as a link under the field rather than a button (Figma 2650:45705). */}
            <div className={amend ? 'flex flex-col gap-[8px] pt-[8px]' : 'flex items-start gap-[10px]'}>
              <span className={`text-[16px] text-[#1e1e1e] ${amend ? '' : 'leading-[48px]'}`} style={{ fontWeight: 500 }}>OR</span>
              <div className="flex flex-col gap-[8px] items-start min-w-0">
                {amend ? (
                  <button type="button" onClick={onAddOverseasCustomer}
                    className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>
                    Add Overseas Customers
                  </button>
                ) : (
                  <button
                    data-secondary-btn
                    type="button"
                    onClick={onAddOverseasCustomer}
                    className="flex items-center justify-center h-[48px] px-[20px] rounded-[4px] border bg-white transition-colors w-full"
                    style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
                  >
                    <span className="text-[16px] capitalize whitespace-nowrap">Add Overseas Customer</span>
                  </button>
                )}
                <label className="flex items-center gap-[8px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mraAeo}
                    onChange={(e) => setMraAeo(e.target.checked)}
                    className="size-[18px] rounded-[2px]"
                    style={{ accentColor: '#1360d2' }}
                  />
                  <span className="text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>MRA AEO</span>
                </label>
              </div>
            </div>

            <Field
              value="Notify Party Code" trailing="search"
              trailingLabel="Search Notify Party Code"
              onTrailingClick={() => onLookup?.('notifyParty')}
              chips={['SONY GULF FZE']}
            />
            <Field
              value="Cargo Handlers Code" valueRequired disabled={amend}
              trailing={amend ? null : 'search'}
              trailingLabel="Search Cargo Handlers Code"
              onTrailingClick={() => onLookup?.('cargoHandler')}
              chips={['SONY GULF FZE']}
            />
            <Field
              value="Agent’s Code" valueRequired disabled={amend}
              trailing={amend ? null : 'search'}
              trailingLabel="Search Agent’s Code"
              onTrailingClick={() => onLookup?.('agent')}
              chips={amend ? ['SONY GULF FZE'] : ['Maersk Shipping']}
            />
            <Field value="Customs Broker" disabled />
            {amend
              ? <Field value="Trade Type" valueRequired disabled />
              : <Field value="E-Commerce" label="Trade Type" trailing="chevron" />}
          </div>
        </SectionCard>
      </div>

      <PartyInformation />
    </div>
  );
}
