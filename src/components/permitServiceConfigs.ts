import type { PermitServiceConfig } from './PermitServiceFlow';

const listRows = (species: string): (string | any)[][] => {
  const badges = ['Submitted', 'Pending', 'Rejected', 'Draft', 'Approved', 'Submitted', 'Pending', 'Rejected'];
  return badges.map((b, i) => ['D12345678', i === 0 ? 'Business' : 'Type 1', 'Brand 1', species, '19/02/24 11:28', b]);
};

/* 1 — Approval of Animal Food Identification Label */
export const ANIMAL_FOOD_LABEL: PermitServiceConfig = {
  title: 'Approval of Animal Food Identification Label',
  searchLabel: 'Application Number',
  columns: ['Application No.', 'Application Type', 'Brand Name', 'Target Animal Species', 'Submitted Date', 'Status'],
  rows: listRows('Species Type 1'),
  filters: [
    { label: 'Application Type', type: 'select' },
    { label: 'Brand Name', type: 'search' },
    { label: 'Target Animal Species', type: 'select' },
    { label: 'Manufacturing Country', type: 'select' },
    { label: 'Application Status', type: 'select' },
  ],
  flyout: ['View Request', 'Amend', 'Cancel', 'Initiate Payment', 'Permit History', 'Print Permit', 'Apply for Admit to Market'],
  applicationTypes: ['Business', 'Type 1'],
  proceed: [
    {
      title: 'Company Details', manualEntry: true,
      fields: [
        { label: 'License Activity', value: 'Department of Economic Development', required: true, type: 'select' },
        { label: 'Company License Number', required: true },
        { label: 'License Type', required: true, type: 'select' },
        { label: 'Company English Name', required: true },
        { label: 'Company Arabic Name', required: true },
        { label: 'Company Status', required: true, type: 'select' },
        { label: 'License Issue Date', required: true, type: 'date' },
        { label: 'License Expiry Date', required: true, type: 'date' },
      ],
    },
    {
      title: 'Company Activity List',
      fields: [
        { label: 'Activity Code', required: true, value: 'DED Activity Code' },
        { label: 'Activity Name', required: true, value: 'DED Activity Name' },
      ],
    },
    {
      title: 'Contact Information', manualEntry: true,
      fields: [
        { label: 'Mobile Number', required: true },
        { label: 'English Name', value: 'Customer' },
        { label: 'Email', value: 'example@dm.ae' },
        { label: 'Preferred Contact Channel', required: true, type: 'select' },
        { label: 'Preferred Payment Method', required: true, type: 'select' },
        { label: 'Preferred Communication Language', required: true, type: 'select' },
      ],
    },
    { title: 'Company Location Details', fields: [{ label: 'Emirates', required: true, type: 'select' }] },
    {
      title: 'Item Information',
      fields: [
        { label: 'Item Short Name', required: true },
        { label: 'Item Full Name', required: true },
        { label: 'Brand Name of Product', required: true },
        { label: 'Manufacturing Country', required: true, type: 'select' },
        { label: 'Purpose of Food/Feed', required: true, type: 'select' },
        { label: 'Target Animal Species', required: true, type: 'select' },
      ],
    },
    {
      title: 'Item Components',
      fields: [
        { label: 'Type of Food/Feed', required: true, type: 'select' },
        { label: 'Main Ingredients', required: true, type: 'select' },
        { label: 'Origin of Meat', required: true, type: 'select' },
        { label: 'Crude Protein Percentage' },
        { label: 'Crude Fiber Percentage' },
        { label: 'Ash Percentage' },
        { label: 'Crude Fat Percentage' },
        { label: 'Moisture Percentage' },
        { label: 'Additive' },
      ],
    },
    {
      title: 'Packaging Description',
      fields: [
        { label: 'Packing Type', required: true, type: 'select' },
        { label: 'Barcode Number', required: true },
        { label: 'Weigh Unit', required: true, type: 'select' },
        { label: 'Net Weight', required: true },
        { label: 'Shelf Life', required: true },
        { label: 'Storage Temperature', required: true },
      ],
    },
    {
      title: 'Transaction Attachments',
      note: 'Note: JPEG, PNG and PDF formats up to 0.5MB. Authorization letter is mandatory for BOL, BOL Type.',
      fields: [
        { label: 'Free Sale Certificate', required: true, type: 'search' },
        { label: 'Product Label and Image', required: true, type: 'search' },
      ],
    },
  ],
  success: {
    heading: 'Approval of Animal Food Identification Label',
    message: [
      'Dear Customer, thank you for using the Dubai Trade Permit application.',
      'Your food identification label has been submitted to Dubai Municipality.',
      'Please note your reference number and proceed with the payment to complete the request.',
    ],
  },
};

export const PERMIT_SERVICE_CONFIGS: Record<string, PermitServiceConfig> = {
  'Approval of Animal Food Identification Label': ANIMAL_FOOD_LABEL,
};
