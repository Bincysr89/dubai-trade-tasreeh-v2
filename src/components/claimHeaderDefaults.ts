import type { DepositMethod, RefundMode } from './ClaimHeaderDetails';

/**
 * How a claim's deposit was lodged and where its refund goes. The View Claim page and the
 * acknowledgement receipt both read this, so the same claim cannot show one refund mode in
 * one place and another in the other.
 */
export type ClaimHeaderDefaults = {
  customsBroker: string;
  depositMethod: DepositMethod;
  depositAccountNo: string;
  depositAccountName: string;
  refundMode: RefundMode;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  iban: string;
  refundAccountNo: string;
  refundAccountName: string;
  maskedCardNo: string;
  cardType: string;
  cardHolderName: string;
};

const CUSTOMS_BROKER = "M&M's special holding private company associated with 1900 Waverly Co United arab emirates L.L.C (AE-8122451)";

const BASE: ClaimHeaderDefaults = {
  customsBroker: CUSTOMS_BROKER,
  depositMethod: 'Standing Guarantee',
  depositAccountNo: 'SG-100004120',
  depositAccountName: 'SW Logistics LLC',
  refundMode: 'Bank Transfer',
  bankAccountNo: '019100458921',
  bankAccountName: 'SW Logistics LLC',
  bankName: 'Emirates NBD',
  iban: 'AE070331234567890123456',
  refundAccountNo: 'A-100004121',
  refundAccountName: 'SW Logistics LLC',
  maskedCardNo: '**** **** **** 4821',
  cardType: 'Visa Credit',
  cardHolderName: 'SW Logistics LLC',
};

const CONSOLIDATED = 'CONSOLIDATED SHIPPING SERVICES L.L.C';

export function claimHeaderDefaultsFor(claimType?: string): ClaimHeaderDefaults {
  if (claimType && /auction/i.test(claimType)) {
    return { ...BASE, depositMethod: 'Cash', depositAccountNo: '—', depositAccountName: '—', refundMode: 'Card' };
  }
  if (claimType && /Refund of (Deposits|Duty)/i.test(claimType)) {
    return {
      ...BASE,
      depositMethod: 'Debit Account',
      depositAccountNo: 'A-100004120',
      depositAccountName: CONSOLIDATED,
      refundMode: 'Credit Account',
      refundAccountNo: 'A-100004121',
      refundAccountName: CONSOLIDATED,
    };
  }
  /* Non Remittance */
  return BASE;
}
