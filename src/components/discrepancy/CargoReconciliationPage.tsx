import { useState } from 'react';
import DiscrepancyFeedbackListingPage from './DiscrepancyFeedbackListingPage';
import InvoiceDetailsListingPage from './InvoiceDetailsListingPage';
import CargoReconciliationSidebar, { type CargoReconMenuKey } from './CargoReconciliationSidebar';

type Props = { onBack: () => void };

/**
 * Top-level "Cargo Reconciliation" entry point (Sea catalogue) — owns the shared
 * collapsible sidebar and switches between its two services: Provide Discrepancy
 * Feedback and View Invoice Details.
 */
export default function CargoReconciliationPage({ onBack }: Props) {
  const [active, setActive] = useState<CargoReconMenuKey>('discrepancy');
  const [collapsed, setCollapsed] = useState(false);

  const sidebar = (
    <CargoReconciliationSidebar
      active={active}
      onSelect={setActive}
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed(c => !c)}
    />
  );

  return active === 'invoices'
    ? <InvoiceDetailsListingPage onBack={onBack} sidebar={sidebar} />
    : <DiscrepancyFeedbackListingPage onBack={onBack} sidebar={sidebar} />;
}
