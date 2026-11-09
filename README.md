# Dubai Trade — Tasreeh

React prototype of the Dubai Trade portal with the **Supplier** service catalogue and all eight
**Tasreeh** Gate Management services (PCFC Security):

- Gate Passes — port / zone access, visitor search, photography & maintenance pass types, drafts,
  payment-failed state, view pass, renew, report lost pass
- Delegation Visits
- Security Companies (incl. Renew Request), Security Personnel, Security Services,
  ISPS Services, Vessel Services, Media Services

Built on the same login, persona and landing pages as the main Dubai Trade prototype.

## Run locally

```bash
npm install
npm run dev
```

Opens on http://localhost:5191.

## Structure

- `src/components/gatepass/` — Gate Passes module and the shared Tasreeh field / page components
- `src/components/delegation/` — Delegation Visits module
- `src/components/tasreeh/` — config-driven engine for the other six services;
  per-service fields live in `serviceConfigs.tsx`
- `src/components/SupplierDetailModal.tsx` — Supplier catalogue (Gate Management column)
