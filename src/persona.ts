/* Tasreeh persona chosen on the customer-type popup.
   visitor          → Visitor
   visitor-company  → Visitor Company (the standard Tasreeh service flows)
   host-company     → Host Company (Gate Pass: All Requests + Pass Approvals)
   individual       → UAE PASS basic (individual) account — Gate Pass only */
export type Persona = 'visitor' | 'visitor-company' | 'host-company' | 'individual' | 'other';

const KEY = 'dt-persona';

export function setPersona(p: Persona) {
  try { sessionStorage.setItem(KEY, p); } catch { /* ignore */ }
}

export function getPersona(): Persona {
  try { return (sessionStorage.getItem(KEY) as Persona) || 'visitor-company'; } catch { return 'visitor-company'; }
}

/* Individual (UAE PASS) account linked to a business unit → it becomes a Visitor Company account */
const LINKED = 'dt-bu-linked';
export function markBuLinked() {
  try { sessionStorage.setItem(LINKED, '1'); } catch { /* ignore */ }
  setPersona('visitor-company');
}
export function isBuLinked(): boolean {
  try { return sessionStorage.getItem(LINKED) === '1'; } catch { return false; }
}
/* Home page for the current account */
export const homeRoute = () => (getPersona() === 'individual' ? '/landing/individual' : '/landing/shipping-agent');
