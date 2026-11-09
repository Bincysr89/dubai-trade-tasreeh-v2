import React, { useState, useEffect, useRef, useMemo } from 'react';
import MoreIcon from './MoreIcon';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';
import Header from './Header';
import ClaimantCodePickerModal from './ClaimantCodePickerModal';
import VccTable, { type VccRow } from './VccTable';
import VccListPopup from './VccListPopup';
import VccRecheckSuccessModal from './VccRecheckSuccessModal';
import VccVehicleSearchTable from './VccVehicleSearchTable';
import CustomsDeclarationViewPage from './CustomsDeclarationViewPage';
import RequestVccPage from './RequestVccPage';
import VccSearchResultPage from './VccSearchResultPage';
import VccViewRequestPage from './VccViewRequestPage';
import VccPaymentSuccessPage from './VccPaymentSuccessPage';
import VccEPaymentPendingPage from './VccEPaymentPendingPage';
import VccEPaymentSuccessPage from './VccEPaymentSuccessPage';
import VccEPaymentConfirmedPage from './VccEPaymentConfirmedPage';
import VccEPaymentFailedPage from './VccEPaymentFailedPage';
import VccAuditHistoryPage from './VccAuditHistoryPage';
import VccUpdatePaymentModePage from './VccUpdatePaymentModePage';
import EPaymentsTable from './EPaymentsTable';
import CargoTransferTable from './CargoTransferTable';
import ClaimsTable, { type ClaimRow } from './ClaimsTable';
import AcknowledgementTable, { ACK_ROWS } from './AcknowledgementTable';
import { AckAcceptConfirmModal, AckDeclineReasonModal, AckDeclineConfirmModal, AckSuccessPage } from './AckModals';
import StatusFilterHeader from './StatusFilterHeader';
import EligibleDeclarationsPage from './EligibleDeclarationsPage';
import RaiseClaimRequestPage from './RaiseClaimRequestPage';
import type { ClaimType } from './ClaimTypeSelectionPage';
import { RDChargeFlowPage, isMissingDocCharge, type OutboundState, type ChargeDetail } from './RDChargeFlowPage';
import { REFUND_DEPOSIT_STEPS, REFUND_DEPOSIT_STEPS_NO_DOCS, REFUND_DEPOSIT_AMEND_STEPS, VALIDITY_EXT_STEPS, REFUND_AUCTION_STEPS, REFUND_AUCTION_AMEND_STEPS } from './ClaimStepper';
import AuctionLotDetailsPage, { type AuctionLotRow } from './AuctionLotDetailsPage';
import AuctionAmendLotDetailsPage from './AuctionAmendLotDetailsPage';
import AuctionClaimDetailsPage, { type AuctionClaimDetail } from './AuctionClaimDetailsPage';
import AuctionClaimReviewPage from './AuctionClaimReviewPage';
import AuctionClaimViewPage from './AuctionClaimViewPage';
import CargoTransferPrePage from './CargoTransferPrePage';
import CargoTransferRequestPage from './CargoTransferRequestPage';
import CargoTransferNewRequestPage from './CargoTransferNewRequestPage';
import CargoTransferSuccessPage from './CargoTransferSuccessPage';
import CargoTransferDocumentPage from './CargoTransferDocumentPage';
import CargoTransferStepperPage from './CargoTransferStepperPage';
import CargoTransferPaymentReviewPage from './CargoTransferPaymentReviewPage';
import CargoTransferViewPage from './CargoTransferViewPage';
import CargoTransferCancelFlow from './CargoTransferCancelFlow';
import ClaimCancelFlow from './ClaimCancelFlow';
import ClaimAmendFlow from './ClaimAmendFlow';
import RDAmendDeclarationDetailsPage from './RDAmendDeclarationDetailsPage';
import ClaimDocumentsPage from './ClaimDocumentsPage';
import PermitsCreatePage from './PermitsCreatePage';
import ClearanceJourneyPage from './ClearanceJourneyPage';
import CompleteJourneyPage from './CompleteJourneyPage';
import SiraFlowPage from './SiraFlowPage';
import DcaaFlowPage from './DcaaFlowPage';
import PermitServiceFlow from './PermitServiceFlow';
import { PERMIT_SERVICE_CONFIGS } from './permitServiceConfigs';
import CargoTransferReceiptReleasePage from './CargoTransferReceiptReleasePage';
import CargoTransferHistoryPage from './CargoTransferHistoryPage';
import CancelDeclarationFlow from './declaration/CancelDeclarationFlow';
import DeclarationHistoryPage from './declaration/DeclarationHistoryPage';
import DeclSuspensionHistoryPage from './declaration/SuspensionHistoryPage';
import DeclarantResponsePage from './declaration/DeclarantResponsePage';
import ViewDeclarationPage from './declaration/ViewDeclarationPage';
import ActionPage from './declaration/ActionPage';
import SuspensionHistoryPage from './SuspensionHistoryPage';
import SuspensionHistoryViewPage from './SuspensionHistoryViewPage';
import SuspensionResponsePage from './SuspensionResponsePage';
import DeclarationStatusExpiryPage from './DeclarationStatusExpiryPage';
import SuspensionResponseListPage from './SuspensionResponseListPage';
import CreateClaimFromRejectedListPage from './CreateClaimFromRejectedListPage';
import SuspensionSuccessModal from './SuspensionSuccessModal';
import NonRemittanceDocumentsPage, { type UploadedDoc as NRUploadedDoc } from './NonRemittanceDocumentsPage';
import ClaimTypeEntryPage from './ClaimTypeEntryPage';
import NonRemittanceChargesPage from './NonRemittanceChargesPage';
import NonRemittanceReviewPage from './NonRemittanceReviewPage';
import NonRemittanceSuccessPage from './NonRemittanceSuccessPage';
import ValidityExtensionEligiblePage from './ValidityExtensionEligiblePage';
import ValidityExtensionDetailsPage, { type ExtensionDetails } from './ValidityExtensionDetailsPage';
import ValidityExtensionViewRequestPage from './ValidityExtensionViewRequestPage';
import NonRemittanceAckPage from './NonRemittanceAckPage';
import NonRemittanceClaimViewPage from './NonRemittanceClaimViewPage';
import RefundDepositsClaimViewPage from './RefundDepositsClaimViewPage';
import ClaimsAuditHistoryPage from './ClaimsAuditHistoryPage';
import NRPaymentPendingPage from './NRPaymentPendingPage';
import NRPaymentProcessingPage from './NRPaymentProcessingPage';
import NRPaymentSuccessPage from './NRPaymentSuccessPage';
import NRPaymentRejectedPage from './NRPaymentRejectedPage';
import type { Row } from './EligibleDeclarationsPage';
import { ColumnFilter } from './ColumnFilter';
import { DateInput, StatusAsOnBadge } from './DatePicker';
// @ts-ignore
import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
// @ts-ignore
import integratedClearanceSrc from '../assets/integratedclearance.svg';
// @ts-ignore
import paymentsSrc from '../assets/payments.svg';
// @ts-ignore
import cargoWavesSrc from '../assets/cargowaves.svg';
// @ts-ignore
import declarationSrc from '../assets/declaration.svg';
// @ts-ignore
import acknowledgementSrc from '../assets/acknoeldgement.svg';
// @ts-ignore
import vccSrc from '../assets/VCC.svg';
// @ts-ignore
import refundsSrc from '../assets/REFUNDS.svg';
// @ts-ignore
import cargoTransferSrc from '../assets/cargotrasnfer.svg';
// @ts-ignore
import timeValidityExtensionSrc from '../assets/time-validity-extension.svg';
// @ts-ignore
import waveSrc from '../assets/wave.svg';

// Figma asset URLs (valid for 7 days)
const wlpLogoSrc = 'https://www.figma.com/api/mcp/asset/09b98e1a-ea9f-41ca-97a4-31b56c097b09';
const aeoLogoSrc = 'https://www.figma.com/api/mcp/asset/5de21541-f817-4a23-bf16-0ba8c4300be7';

/* Declarations of an existing Refund of Deposits claim being amended. */
const RD_AMEND_ROWS: Row[] = [
  { declarationNo: '105-01426431-24', declarationDate: '09/10/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Import for Re Export', depositAmount: 'Dh 1,000', depositMethod: 'Standing Guarantee', accountNumber: 'ACC-100234', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180' },
  { declarationNo: '404-09988123-24', declarationDate: '07/02/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Temporary Admission', depositAmount: 'Dh 5,000', depositMethod: 'Standing Guarantee', accountNumber: 'ACC-100567', claimExpiry: '07/01/2025', exportExpiry: '05/15/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180' },
];

/* Documents already uploaded on the Refund of Deposits claim being amended. */
const RD_AMEND_DOCS: NRUploadedDoc[] = [
  { id: 'rd-am-1', declNo: '105-01426431-24', docType: 'Export Bill',              fileName: 'Export-Bill-105.pdf',  fileSize: 2_400_000, uploadedOn: '10/09/2024', remarks: '' },
  { id: 'rd-am-2', declNo: '105-01426431-24', docType: 'Exit / Entry Certificate', fileName: 'Exit-Cert-105.pdf',    fileSize: 1_100_000, uploadedOn: '10/09/2024', remarks: '' },
  { id: 'rd-am-3', declNo: '404-09988123-24', docType: 'Export Bill',              fileName: 'Export-Bill-404.pdf',  fileSize: 3_200_000, uploadedOn: '02/07/2024', remarks: '' },
];

/* Auction lots of an existing Refund on Auction Proceed claim being amended — matches the
   ClaimsTable mock row (reqNo 4701850, claimNo 3842200). */
const AUCTION_AMEND_LOTS: AuctionLotRow[] = [
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000112', description: 'Assorted Electronics — Mobile Accessories', auctionDate: '14/03/2025', saleProceeds: '18,500.00' },
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000113', description: 'Assorted Electronics — Home Appliances',   auctionDate: '14/03/2025', saleProceeds: '42,300.00' },
];
const AUCTION_AMEND_CLAIM_DETAILS: AuctionClaimDetail[] = [
  { auctionLotNo: 'LOT-000112', claimAmount: '15000', remarks: 'Refund against sale proceeds', transportDocs: [{ id: 'auc-am-t1', value: 'TRN-88213' }], containerNos: [{ id: 'auc-am-c1', value: 'MSCU-1122334' }] },
  { auctionLotNo: 'LOT-000113', claimAmount: '38000', remarks: '', transportDocs: [{ id: 'auc-am-t2', value: 'TRN-88214' }, { id: 'auc-am-t3', value: 'TRN-88215' }], containerNos: [{ id: 'auc-am-c2', value: 'MSCU-2233445' }] },
];
/* Documents already uploaded on the Refund on Auction Proceed claim being amended. */
const AUCTION_AMEND_DOCS: NRUploadedDoc[] = [
  { id: 'auc-am-1', declNo: 'LOT-000112', docType: 'Export Bill', fileName: 'Export-Bill-LOT112.pdf', fileSize: 2_100_000, uploadedOn: '14/03/2025', remarks: '' },
  { id: 'auc-am-2', declNo: 'LOT-000113', docType: 'Export Bill', fileName: 'Export-Bill-LOT113.pdf', fileSize: 1_800_000, uploadedOn: '14/03/2025', remarks: '' },
];

type Props = {
  onClose: () => void;
  onServiceCatalogue?: () => void;
  /** Skip the listing and open the Integrated Clearance journey directly (from Trade+ continue). */
  autoStartJourney?: boolean;
  /** Default Cargo Channel / Regime Type for the declaration form. */
  journeyDefaults?: { cargoChannel?: string; regimeType?: string };
  /** Export context (Booking & Execution) — prefills the permit chatbot with Export / Air. */
  journeyExport?: boolean;
  /** Open the permit assistant chatbot directly (Export/Air preselected, choose consignment). */
  autoPermitChat?: boolean;
};


type BadgeType = 'both' | 'aeo' | 'wlp';
type DeclStatus = 'Cleared' | 'Submitted' | 'Payment Pending' | 'VAT Payment Pending' | 'Declined' | 'Cancelled' | 'Clearance Inspection' | 'Draft';

/* Same tints as the Refund & Claims status chips, so one status reads the same
   wherever it appears: a flat colour wash, no outline. */
const STATUS_STYLE: Record<DeclStatus, { bg: string; color: string }> = {
  'Cleared':              { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Submitted':            { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Payment Pending':      { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'VAT Payment Pending':  { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Declined':             { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Cancelled':            { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Clearance Inspection': { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Draft':                { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
};

// Figma asset URLs for flyout icons (valid 7 days)
const flyoutIcons = {
  eye:     'https://www.figma.com/api/mcp/asset/54f63cca-ab32-420e-9562-b3653ed20d3b',
  edit:    'https://www.figma.com/api/mcp/asset/747c197c-57e3-4b4b-8203-a9af9e05828d',
  cancel:  'https://www.figma.com/api/mcp/asset/19b4409e-4a30-4551-8af2-090cff64d382',
  payment: 'https://www.figma.com/api/mcp/asset/4c2f63a8-2be3-49c5-bf87-ffd8b832cb64',
  history: 'https://www.figma.com/api/mcp/asset/0795ebbf-9e2d-4a19-ba44-0dc98340a3d5',
  print:   'https://www.figma.com/api/mcp/asset/926990db-4fa2-436b-a237-0f2df32ca565',
  article: 'https://www.figma.com/api/mcp/asset/baf825bc-211b-41be-b088-a4a9dff64f7b',
};

const FLYOUT_ITEMS = [
  { icon: flyoutIcons.eye,     label: 'View Declaration' },
  { icon: flyoutIcons.edit,    label: 'Amend' },
  { icon: flyoutIcons.cancel,  label: 'Cancel' },
  { icon: flyoutIcons.payment, label: 'E-Payments' },
  { icon: flyoutIcons.history, label: 'Declaration History' },
  { icon: flyoutIcons.history, label: "Declarant's Suspension Response" },
  { icon: flyoutIcons.history, label: 'Suspension History' },
  { icon: flyoutIcons.print,   label: 'Print Declaration' },
  { icon: flyoutIcons.article, label: 'Apply for Permit' },
];

/* Drafts rows offer a different set of actions — Figma 2650:38914. */
const DRAFT_FLYOUT_ITEMS = [
  { icon: flyoutIcons.article, label: 'Proceed To DM' },
  { icon: flyoutIcons.article, label: 'Proceed to Declaration' },
  { icon: flyoutIcons.print,   label: 'Print' },
  { icon: flyoutIcons.payment, label: 'Share Via Email' },
];

const DECLARATIONS: {
  no: string; badge: BadgeType; type: string; date: string;
  owner: string; channel: string; reqNo: string; reqType: string;
  clientRef: string; carrierReg: string; mawb: string; hawb: string;
  doNo: string; permit: boolean; broker: string; createdBy: string;
  statusDate: string; status: DeclStatus; showInfo?: boolean;
}[] = [
  { no:'1012132132', badge:'both', type:'Export from Local',                               date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'JOB213354578',   carrierReg:'JOB213354578',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'NIL',       permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Cleared' },
  { no:'1012132132', badge:'aeo',  type:'Export Statistical',                               date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'PGH658916794',   carrierReg:'PGH658916794',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Submitted' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'GJF4589789487',  carrierReg:'GJF4589789487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:false, broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Submitted' },
  { no:'1012132132', badge:'both', type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'VNF215648748',   carrierReg:'VNF215648748',   mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Payment Pending' },
  { no:'1012132132', badge:'aeo',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'TYT4897879487',  carrierReg:'TYT4897879487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:false, broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'VAT Payment Pending' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'TYT4897879487',  carrierReg:'TYT4897879487',  mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Declined',   showInfo:true },
  { no:'1012132132', badge:'aeo',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'24/02/24, 09:30', carrierReg:'24/02/24, 09:30', mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Cancelled' },
  { no:'1012132132', badge:'wlp',  type:'Re Export to ROW (after import for re export)',    date:'05-Dec-24', owner:'code + name', channel:'Sea', reqNo:'12345788', reqType:'New', clientRef:'24/02/24, 09:30', carrierReg:'24/02/24, 09:30', mawb:'MAWB/MBOL', hawb:'HAWB/HBOL', doNo:'DO-123456', permit:true,  broker:'code + name. S', createdBy:'Username', statusDate:'08-Dec-24', status:'Clearance Inspection' },
];


export default function DeclarationListPage({ onClose, onServiceCatalogue, autoStartJourney, journeyDefaults, journeyExport, autoPermitChat }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'epay'>('all');
  const [ePayVccFilter, setEPayVccFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFromDate, setStatusFromDate] = useState('2022-12-28');
  const [statusToDate, setStatusToDate]     = useState('2023-01-10');
  // TODO: derive from auth context. For now broker login is enabled by default
  // so the Customer Type / Code filters are visible.
  const isBroker = true;
  const [showDrafts, setShowDrafts] = useState(false);
  const [showColModal, setShowColModal] = useState(false);

  /* Column widths are shared by the header and the body cells — one source of truth so
     the two stay in step when the Drafts toggle swaps the column set (Figma 2650:38914). */
  const DECL_COLUMNS: { label: string; w: number }[] = useMemo(() => (
    showDrafts
      ? [
        { label: 'Declaration Type',   w: 210 },
        { label: 'Declaration owner',  w: 120 },
        { label: 'Cargo Channel',      w: 100 },
        { label: 'Client Ref. No.',    w: 130 },
        { label: 'MAWB/MBOL',          w: 105 },
        { label: 'HAWB/HBOL',          w: 100 },
        { label: 'Carrier Reg No.',    w: 130 },
        { label: 'DO No.',             w: 95  },
        { label: 'Permit',             w: 72  },
        { label: 'Broker',             w: 110 },
      ]
      : [
        { label: 'Declaration No.',    w: 148 },
        { label: 'Declaration Type',   w: 210 },
        { label: 'Submitted Date',     w: 110 },
        { label: 'Declaration owner',  w: 120 },
        { label: 'Cargo Channel',      w: 100 },
        { label: 'Request No.',        w: 105 },
        { label: 'Request Type',       w: 95  },
        { label: 'Client Ref. No.',    w: 130 },
        { label: 'Carrier Reg No.',    w: 130 },
        { label: 'MAWB/MBOL',          w: 105 },
        { label: 'HAWB/HBOL',          w: 100 },
        { label: 'DO No.',             w: 95  },
        { label: 'Permit',             w: 72  },
        { label: 'Broker',             w: 110 },
        { label: 'Created by',         w: 100 },
        { label: 'Status Date',        w: 100 },
      ]
  ), [showDrafts]);
  const DECL_COL_DEFS: ColDef[] = useMemo(
    () => DECL_COLUMNS.map(c => ({ key: c.label, label: c.label })), [DECL_COLUMNS]);
  const DECL_LOCKED_COLS: ColDef[] = useMemo(() => [
    { key: showDrafts ? 'Status' : 'Declaration Status', label: showDrafts ? 'Status' : 'Declaration Status' },
    { key: 'Actions',            label: 'Actions'            },
  ], [showDrafts]);
  const [declVisibleCols, setDeclVisibleCols] = useState<string[]>(() => DECL_COL_DEFS.map(c => c.key));
  // Swapping the Drafts toggle swaps the column set — show all of the new set.
  useEffect(() => { setDeclVisibleCols(DECL_COL_DEFS.map(c => c.key)); setDeclStatusFilter(null); }, [showDrafts]);
  const [searchType, setSearchType] = useState('Declaration');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  /** Submitted query — populated only when the user presses Enter or clicks the search icon. */
  const [searchQuery, setSearchQuery] = useState('');
  const submitSearch = () => {
    if (searchValue.trim() !== '') setSearchQuery(searchValue.trim());
  };
  const [ePayReqType, setEPayReqType] = useState('');
  const [ePayReqTypeOpen, setEPayReqTypeOpen] = useState(false);

  // Toolbar Status filter — declared here; effect that depends on `activeMenu`
  // is placed below where `activeMenu` is defined to avoid a TDZ error.
  const [toolbarStatus, setToolbarStatus] = useState<string | null>(null);
  const [toolbarStatusOpen, setToolbarStatusOpen] = useState(false);
  const toolbarStatusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!toolbarStatusOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (toolbarStatusRef.current && !toolbarStatusRef.current.contains(e.target as Node)) setToolbarStatusOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [toolbarStatusOpen]);

  /* Below md the search bar collapses to an icon; tapping it opens this flyout. */
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  /* Claimant Type drives the Code field: it becomes Broker Code or Personal Customer Code,
     each with a trailing search button opening its own lookup. */
  const [rcClaimantTypeOpen, setRcClaimantTypeOpen] = useState(false);
  const [claimantPicker, setClaimantPicker] = useState<'broker' | 'personal' | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileTypeOpen, setMobileTypeOpen] = useState(false);

  // "Date Type" dropdown inside the Refund & Claims advanced filters.
  const [rcReqDateOpen, setRcReqDateOpen] = useState(false);
  const rcReqDateRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!rcReqDateOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (rcReqDateRef.current && !rcReqDateRef.current.contains(e.target as Node)) setRcReqDateOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [rcReqDateOpen]);
  const [vccStep, setVccStep] = useState<'list' | 'create' | 'searchResult' | 'retryRequest' | 'amend' | 'viewRequest' | 'paymentSuccess' | 'ePaymentPending' | 'ePaymentSuccess' | 'ePaymentProcessing' | 'ePaymentConfirmed' | 'ePaymentFailed' | 'auditHistory' | 'declarationView' | 'updatePaymentMode' | 'creditDebitFailed' | 'retryPayment'>('list');
  const [selectedVccStatus, setSelectedVccStatus] = useState('');
  const [vccListPopupRow, setVccListPopupRow] = useState<VccRow | null>(null);
  const [recheckModalOpen, setRecheckModalOpen] = useState(false);
  const [vccDeclNo, setVccDeclNo] = useState<string>('');
  const [vccRetryReqNo, setVccRetryReqNo] = useState<string>('');
  const [cargoStep, setCargoStep] = useState<'list' | 'pre' | 'create' | 'amend' | 'success' | 'amendSuccess' | 'document' | 'stepper' | 'paymentReview' | 'viewRequest' | 'cancel' | 'cargoHistory' | 'suspensionHistory' | 'suspensionHistoryView' | 'suspensionResponse' | 'receiptRelease'>('list');
  const [showSuspensionSuccess, setShowSuspensionSuccess] = useState(false);
  const [suspensionHistoryFrom, setSuspensionHistoryFrom] = useState<'list' | 'cargoHistory'>('list');
  const [cargoFlowMode, setCargoFlowMode] = useState<'create' | 'amend'>('create');
  const [cargoTransferNumber, setCargoTransferNumber] = useState('');
  const [stepperReturnStep, setStepperReturnStep] = useState(0);
  const [cargoPreValues, setCargoPreValues] = useState<{ cargoChannel: string; clientRef: string; carrierReg: string; transferType: string }>({ cargoChannel: 'Sea', clientRef: '', carrierReg: '', transferType: '' });
  const [cargoFormValues, setCargoFormValues] = useState<{ clientRef: string; carrierReg: string; mawb: string; transferorBizCode: string; transferorPremCode: string; transfereeBizCode: string; transfereePremCode: string }>({ clientRef: '', carrierReg: '', mawb: '', transferorBizCode: '', transferorPremCode: '', transfereeBizCode: '', transfereePremCode: '' });
  type ClaimSubStep = 'list' | 'claimTypeEntry' | 'eligible' | 'eligibleDeclView' | 'amendDeclDetails' | 'chargeDetails' | 'rdDocuments' | 'rdPayment' | 'rdReview' | 'nonRemittanceDocs' | 'nonRemittanceCharges' | 'nonRemittanceReview' | 'nonRemittanceSuccess' | 'nonRemittanceAck' | 'nonRemittanceClaimView' | 'rdClaimView' | 'claimListView' | 'claimHistory' | 'cancelClaim' | 'amendClaim' | 'claimDocs' | 'claimSuspensionList' | 'claimSuspension' | 'rdNrSuccess' | 'nrPaymentPending' | 'nrPaymentProcessing' | 'nrPaymentSuccess' | 'nrPaymentRejected' | 'rdPaymentPending' | 'rdPaymentProcessing' | 'rdPaymentSuccess' | 'rdPaymentRejected' | 'validityExtEligible' | 'validityExtDetails' | 'validityExtPayment' | 'validityExtReview' | 'validityExtSuccess' | 'declStatusExpiry' | 'createClaimFromRejectedList' | 'auctionLots' | 'amendAuctionLots' | 'auctionClaimDetails' | 'auctionDocuments' | 'auctionPayment' | 'auctionReview' | 'auctionClaimView' | 'auctionSuccess' | 'auctionPaymentPending' | 'auctionPaymentProcessing' | 'auctionPaymentSuccess' | 'auctionPaymentRejected';
  const [claimListDeclNo, setClaimListDeclNo] = useState<string>('');
  const [claimListDeclViewOpen, setClaimListDeclViewOpen] = useState(false);
  const [viewRequestRow, setViewRequestRow] = useState<ClaimRow | null>(null);
  const [claimSelectedRows, setClaimSelectedRows] = useState<import('./EligibleDeclarationsPage').Row[]>([]);
  // Amend mode reuses the Refund of Deposits new-claim steps with editable pre-filled fields.
  const [rdAmendMode, setRdAmendMode] = useState(false);
  // Missing/Document Deposit claims have no document upload step.
  const rdSkipDocs = claimSelectedRows.length > 0 && claimSelectedRows.every(r => isMissingDocCharge(r.depositType));
  const [claimChargeDetails, setClaimChargeDetails] = useState<ChargeDetail[]>([]);
  const [claimOutbounds, setClaimOutbounds] = useState<OutboundState>({});
  const [claimStep, setClaimStep] = useState<ClaimSubStep>('list');
  const [nonRemittanceRows, setNonRemittanceRows] = useState<Row[]>([]);
  const [nonRemittanceUploadedDocs, setNonRemittanceUploadedDocs] = useState<NRUploadedDoc[]>([]);
  const [nonRemittancePaymentMode, setNonRemittancePaymentMode] = useState('');
  const [nonRemittanceAccountNo, setNonRemittanceAccountNo] = useState('');
  const [selectedClaimTypeForFlow, setSelectedClaimTypeForFlow] = useState<ClaimType | null>(null);
  // Claim-type label (e.g. "Refund of Deposits") of the row the user clicked View/Cancel on —
  // routes to the matching read-only view / cancel flow instead of always showing the NR one.
  const [listClaimType, setListClaimType] = useState<string>('Non Remittance');
  // Full row of the claim the user clicked "View Claim" on — carries the actual charge type
  // and declaration list so the view page shows the right data and section layout for that claim.
  const [viewClaimRow, setViewClaimRow] = useState<ClaimRow | null>(null);
  // The claim row a Suspension Response action was triggered from, and (once chosen, either
  // directly via a Declaration Number search or via the multi-declaration list) which
  // declaration the response applies to.
  const [suspensionRow, setSuspensionRow] = useState<ClaimRow | null>(null);
  const [suspensionDeclNo, setSuspensionDeclNo] = useState<string>('');
  // The claim row a "Create New Claim Request from rejected sub claim" action was triggered from,
  // and the declaration numbers the user selected there — carried into Eligible Declarations as
  // a pre-selection, then into the Refund Details step to seed outbound details for just those
  // declarations (reusing their prior submission), while any additionally-added declarations stay empty.
  const [rejectedClaimRow, setRejectedClaimRow] = useState<ClaimRow | null>(null);
  const [rejectedPrefillDeclNos, setRejectedPrefillDeclNos] = useState<string[]>([]);
  // Validity Extension flow state — the single declaration picked, its extension details, and payment.
  const [validityExtRows, setValidityExtRows] = useState<Row[]>([]);
  const [validityExtDetails, setValidityExtDetails] = useState<ExtensionDetails | null>(null);
  const [validityExtPaymentMode, setValidityExtPaymentMode] = useState('');
  const [validityExtAccountNo, setValidityExtAccountNo] = useState('');
  // Refund on Auction Proceed flow state — selected auction lots, per-lot claim amount/remarks/
  // transport & container entries, uploaded documents, and payment mode.
  const [auctionSelectedLots, setAuctionSelectedLots] = useState<AuctionLotRow[]>([]);
  const [auctionClaimDetails, setAuctionClaimDetails] = useState<AuctionClaimDetail[]>([]);
  const [auctionUploadedDocs, setAuctionUploadedDocs] = useState<NRUploadedDoc[]>([]);
  const [auctionPaymentMode, setAuctionPaymentMode] = useState('');
  const [auctionAccountNo, setAuctionAccountNo] = useState('');
  const resetAuctionClaim = () => { setAuctionSelectedLots([]); setAuctionClaimDetails([]); setAuctionUploadedDocs([]); setAuctionPaymentMode(''); setAuctionAccountNo(''); };
  // Amend mode reuses the Refund on Auction Proceed new-claim steps with editable pre-filled fields.
  const [auctionAmendMode, setAuctionAmendMode] = useState(false);
  const [claimViewReturnStep, setClaimViewReturnStep] = useState<ClaimSubStep>('nonRemittanceSuccess');
  const [ackReturnStep, setAckReturnStep] = useState<ClaimSubStep>('nonRemittanceSuccess');
  /* The acknowledgement receipt is shared by all three claim flows, and its Claim
     Details table differs per claim type, so the flow says which one opened it. */
  const [ackClaimType, setAckClaimType] = useState<string>('Non Remittance Claim');
  const [ackStep, setAckStep] = useState<'list' | 'acceptSuccess' | 'declineSuccess'>('list');
  const [ackSelected, setAckSelected] = useState<Set<number>>(new Set());
  const [ackAcceptOpen, setAckAcceptOpen] = useState(false);
  const [ackDeclineReasonOpen, setAckDeclineReasonOpen] = useState(false);
  const [ackDeclineConfirmOpen, setAckDeclineConfirmOpen] = useState(false);
  const [ackDeclineRowIndex, setAckDeclineRowIndex] = useState<number | null>(null);
  const [declStatusFilter, setDeclStatusFilter] = useState<DeclStatus | null>(null);
  const DECL_STATUS_COLOR: Record<DeclStatus, string> = {
    'Cleared': '#28a745', 'Submitted': '#1360d2', 'Payment Pending': '#b45309',
    'VAT Payment Pending': '#b45309', 'Declined': '#dc3545',
    'Cancelled': '#697498', 'Clearance Inspection': '#28a745', 'Draft': '#697498',
  };
  /* The leading visible column and the rows shown for the current Drafts/status selection. */
  const declFirstCol = DECL_COLUMNS.find(c => declVisibleCols.includes(c.label))?.label;
  const declRows = useMemo(() => {
    const base: typeof DECLARATIONS = showDrafts
      ? DECLARATIONS.map(d => ({ ...d, status: 'Draft' as DeclStatus, showInfo: false }))
      : DECLARATIONS;
    return declStatusFilter ? base.filter(d => d.status === declStatusFilter) : base;
  }, [showDrafts, declStatusFilter]);
  const declTableMinWidth =
    DECL_COLUMNS.filter(c => declVisibleCols.includes(c.label)).reduce((t, c) => t + c.w, 0) + 226;
  const ackDeclarationNumbers = (() => {
    if (ackStep === 'acceptSuccess') return Array.from(ackSelected).map((i) => ACK_ROWS[i]?.declaration).filter(Boolean) as string[];
    if (ackStep === 'declineSuccess' && ackDeclineRowIndex !== null) return [ACK_ROWS[ackDeclineRowIndex]?.declaration].filter(Boolean) as string[];
    return [];
  })();
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [permitCreateOpen, setPermitCreateOpen] = useState(!!autoPermitChat);
  const [permitPrefill, setPermitPrefill] = useState<{ activity?: string; mode?: string; cargo?: string } | undefined>(
    autoPermitChat ? { activity: journeyExport ? 'Export' : 'Import', mode: journeyExport ? 'Air' : 'Sea' } : undefined
  );
  const [permitFromJourney, setPermitFromJourney] = useState(!!autoPermitChat);
  const [clearanceJourneyOpen, setClearanceJourneyOpen] = useState(!!autoStartJourney);
  /* Amend reuses the journey with the declaration it is editing — Figma 2650:57939. */
  const [amendDeclNo, setAmendDeclNo] = useState<string | null>(null);
  /* The other row actions — each takes over the page, as the cargo-transfer sub-flows do. */
  const [declAction, setDeclAction] = useState<'cancel' | 'history' | 'suspensionHistory' | 'declarantResponse' | 'viewDeclaration' | null>(null);
  const [declActionNo, setDeclActionNo] = useState('');
  /* Opened from the listing or from Declaration History — Back goes wherever it came from. */
  const [declActionFrom, setDeclActionFrom] = useState<'list' | 'history'>('list');
  const [completeJourneyOpen, setCompleteJourneyOpen] = useState(false);
  const [completeJourneyStart, setCompleteJourneyStart] = useState<'permits' | 'declInfo'>('permits');
  const [siraFlowOpen, setSiraFlowOpen] = useState(false);
  const [dcaaFlow, setDcaaFlow] = useState<{ variant: 'dangerous' | 'suspicious'; title: string } | null>(null);
  const [permitServiceKey, setPermitServiceKey] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<'Declaration' | 'Acknowledgement' | 'VCC' | 'Refund & Claims' | 'Claim Time Validity Extension' | 'Cargo Transfer' | 'E-Payment'>('Declaration');

  // Journey stepper horizontal scroll (responsive — arrows appear when steps overflow the card)
  const stepperScrollRef = useRef<HTMLDivElement>(null);
  const [stepperArrows, setStepperArrows] = useState({ left: false, right: false });
  const updateStepperArrows = () => {
    const el = stepperScrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    setStepperArrows({
      left: overflow && el.scrollLeft > 2,
      right: overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
    });
  };
  const scrollStepper = (dir: number) => {
    stepperScrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };
  useEffect(() => {
    updateStepperArrows();
    const t = setTimeout(updateStepperArrows, 120);
    window.addEventListener('resize', updateStepperArrows);
    return () => { clearTimeout(t); window.removeEventListener('resize', updateStepperArrows); };
  }, []);

  // Status options per menu — defined here so it can reference `activeMenu`.
  const TOOLBAR_STATUS_OPTIONS: Record<typeof activeMenu, string[]> = {
    'Declaration':       ['Cleared', 'Submitted', 'Payment Pending', 'VAT Payment Pending', 'Declined', 'Cancelled', 'Clearance Inspection'],
    'Acknowledgement':   ['Accepted', 'Pending', 'Declined'],
    'VCC':               ['Submitted', 'Payment Pending', 'Payment Failed', 'Under Processing', 'Completed'],
    'Refund & Claims':   ['Submitted', 'Registered', 'Under Processing', 'Rejected', 'Completed'],
    'Claim Time Validity Extension': ['Submitted', 'Registered', 'Under Processing', 'Rejected', 'Completed'],
    'Cargo Transfer':    ['Completed', 'Submitted', 'Cancelled'],
    'E-Payment':         ['Success', 'Payment Pending', 'Failed'],
  };
  // The toolbar status dropdown is named for what it filters in each module.
  const isEPayView = activeMenu === 'E-Payment' || activeTab === 'epay';
  /* Advanced Filters registry — the fields each module renders, in render order, with the
     label shown on the applied-filter tags. Keys match the filterValues entries. */
  const FILTER_LABELS: Record<string, string> = {
    ackDeclType: 'Declaration Type', ackStatus: 'Acknowledgement Status', ackPartyType: 'Party Type',
    ackBusinessCode: 'Business Code', ackDateType: 'Date Type', ackFromDate: 'From Date', ackToDate: 'To Date',
    vccDateFrom: 'Request Date From', vccDateTo: 'Request Date To', vccStatus: 'Status',
    vccCustomerType: 'Customer Type', vccCustomerCode: 'Customer Code', vccVehicleBrand: 'Vehicle Brand',
    vccVehicleModel: 'Vehicle Model', vccVehicleType: 'Vehicle Type',
    vccSpecStandard: 'Specification Standard Name', vccYearBuild: 'Vehicle Year Build',
    rcClaimType: 'Claim Type', rcClaimStatus: 'Claim Status', rcTimeInterval: 'Time Interval',
    rcRequestedDate: 'Date Type', rcFromDate: 'From Date', rcToDate: 'To Date',
    rcClaimantType: 'Claimant Type', rcCode: 'Code', rcName: 'Name',
    rcSubclaimStatus: 'Subclaim Status', rcSubmissionMode: 'Submission Mode',
    ctCargoChannel: 'Cargo Channel (inbound)', ctCarrierReg: 'Carrier Reg No.(inbound)',
    ctTransferType: 'Cargo Transfer Type', ctStatus: 'Cargo Transfer Status',
    ctTransferee: 'Transferee (Owner)', ctTransferor: 'Transferor',
    ctFromDate: 'From Date (15 days)', ctToDate: 'To Date', ctBrokerCode: 'Broker Code',
    cargoChannel: 'Cargo Channel', regimeType: 'Regime Type', declType: 'Declaration Type',
    permit: 'Permit', declStatus: 'Declaration Status', fromDate: 'From Date (15 days)',
    toDate: 'To Date', carrierReg: 'Carrier Registration No.', customerType: 'Customer Type',
    customerCode: 'Customer Code',
  };
  const moduleFilterKeys =
    activeMenu === 'Acknowledgement'
      ? ['ackDeclType', 'ackStatus', 'ackPartyType', 'ackBusinessCode', 'ackDateType', 'ackFromDate', 'ackToDate']
      : activeMenu === 'VCC'
      ? ['vccDateFrom', 'vccDateTo', 'vccStatus', 'vccCustomerType', 'vccCustomerCode', 'vccVehicleBrand', 'vccVehicleModel', 'vccVehicleType', 'vccSpecStandard', 'vccYearBuild']
      : activeMenu === 'Refund & Claims'
      ? ['rcClaimType', 'rcClaimStatus', 'rcTimeInterval', 'rcRequestedDate', 'rcFromDate', 'rcToDate', 'rcClaimantType', 'rcCode', 'rcName', 'rcSubclaimStatus', 'rcSubmissionMode']
      : activeMenu === 'Cargo Transfer'
      ? ['ctCargoChannel', 'ctCarrierReg', 'ctTransferType', 'ctStatus', 'ctTransferee', 'ctTransferor', 'ctFromDate', 'ctToDate', 'ctBrokerCode']
      : ['cargoChannel', 'regimeType', 'declType', 'permit', 'declStatus', 'fromDate', 'toDate', 'carrierReg', 'customerType', 'customerCode'];

  /* Advanced Filters owns the filtering while its panel is open, and keeps owning it for as
     long as filters stay applied — so the basic search, the status dropdown and the date
     pill stay greyed and inert after the panel is closed, until Reset clears the tags. */
  const filtersActive = showFilters || appliedFilters.length > 0;
  const filtersLock = filtersActive ? 'opacity-50 pointer-events-none' : '';

  const applyFilters = () => setAppliedFilters(moduleFilterKeys.filter((k) => (filterValues[k] ?? '').trim() !== ''));
  const resetFilters = () => {
    setFilterValues((v) => { const next = { ...v }; moduleFilterKeys.forEach((k) => delete next[k]); return next; });
    setAppliedFilters([]);
  };

  const searchTypeOptions =
    (activeMenu === 'E-Payment' || activeTab === 'epay')
      ? ['Declaration Number', 'Request Number']
      : activeMenu === 'VCC'
      ? ['Request Number', 'VCC Number', 'Chasis Number', 'Declaration Number']
      : activeMenu === 'Refund & Claims'
      ? ['Declaration Number', 'Claim Number', 'Request Number']
      : activeMenu === 'Claim Time Validity Extension'
      ? ['Request Number']
      : activeMenu === 'Cargo Transfer'
      ? ['Cargo Transfer No.', 'Request Number', 'Client Reference Number', 'Container Number', 'MAWB/MBOL']
      : ['Declaration', 'Client Ref Number', 'Container Number', 'HAWB/HBOL', 'MAWB/MBOL', 'Request Number', 'Vehicle Chassis Number'];
  const statusDropdownLabel = isEPayView
    ? 'Payment Status'
    : activeMenu === 'Refund & Claims' || activeMenu === 'Claim Time Validity Extension'
    ? 'Claim Status'
    : 'Status';
  /* ePayment listings default to no date filter at all — the Date Range card only appears
     once the user narrows Payment Status to Success. */
  const showDateRangeCard = !isEPayView || toolbarStatus === 'Success';

  // Reset toolbar status when switching tabs so previous filter doesn't leak.
  useEffect(() => { setToolbarStatus(null); }, [activeMenu]);
  // Applied-filter tags belong to one module's field set — clear them on a module change.
  useEffect(() => { setAppliedFilters([]); }, [activeMenu]);
  useEffect(() => { setToolbarStatus(null); }, [activeTab]);

  // Reset the search-type dropdown when switching modules or tabs so options stay consistent
  useEffect(() => {
    if (activeMenu === 'E-Payment' || activeTab === 'epay') {
      setSearchType('Declaration Number');
    } else {
      setSearchType(activeMenu === 'VCC' || activeMenu === 'Claim Time Validity Extension' ? 'Request Number' : activeMenu === 'Cargo Transfer' ? 'Cargo Transfer No.' : activeMenu === 'Refund & Claims' ? 'Declaration Number' : 'Declaration');
    }
    setSearchTypeOpen(false);
    setSearchValue('');
    setSearchQuery('');
    setEPayReqType('');
    setEPayReqTypeOpen(false);
  }, [activeMenu, activeTab]);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [filterFocused, setFilterFocused] = useState<Record<string, boolean>>({});
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  /* Claimant Type re-labels the Code field and picks which lookup its search button opens. */
  const claimantType = filterValues['rcClaimantType'] || '';
  const rcCodeLabel = claimantType === 'Broker' ? 'Broker Code'
    : claimantType === 'Personal Customer' ? 'Personal Customer Code'
    : 'Code';
  const flyoutRef = useRef<HTMLDivElement>(null);
  const {
    scrollRef: declScrollRef, atScrollStart: declAtScrollStart, atScrollEnd: declAtScrollEnd,
    handleScroll: declHandleScroll, scrollToStart: declScrollToStart, scrollToEnd: declScrollToEnd,
  } = useTableBehaviors();

  const isFloated = (key: string) => filterFocused[key] || !!filterValues[key];
  const floatLabel = (active: boolean): React.CSSProperties => ({
    position: 'absolute',
    left: 12,
    top: active ? 0 : '50%',
    transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: active ? '#697498' : '#0e1b3d',
    background: active ? 'white' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none',
    transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease, background 0.15s ease',
    fontFamily: "'Dubai', sans-serif",
    whiteSpace: 'nowrap',
    zIndex: 1,
  });
  const focusField = (key: string) => setFilterFocused(f => ({ ...f, [key]: true }));
  const blurField  = (key: string) => setFilterFocused(f => ({ ...f, [key]: false }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setOpenFlyout(null);
      }
    };
    if (openFlyout !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFlyout]);

  const resetNRClaim = () => { setNonRemittanceRows([]); setNonRemittancePaymentMode(''); setNonRemittanceAccountNo(''); };

  if (viewRequestRow) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ValidityExtensionViewRequestPage
            row={viewRequestRow}
            onBack={() => setViewRequestRow(null)}
          />
        </div>
      </div>
    );
  }

  if (claimListDeclViewOpen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          <CustomsDeclarationViewPage
            declarationNo={claimListDeclNo}
            onBack={() => setClaimListDeclViewOpen(false)}
            onServiceCatalogue={onServiceCatalogue}
            onHome={onClose}
          />
        </div>
      </div>
    );
  }

  // Refund of Deposits / Refund of Duty share the same stepper flow — switch
  // wording based on which claim type the user selected. Amend mode is only
  // reachable for Refund of Deposits claims, so it keeps its fixed wording.
  const rdClaimLabel = (!rdAmendMode && selectedClaimTypeForFlow === 'refundDuty') ? 'Refund of Duty' : 'Refund of Deposits';
  const rdFlowTitle = rdAmendMode ? 'Amend - Refund of Deposits - 3842063' : `Raise New Claim - ${rdClaimLabel}`;
  const rdChargeTitle = rdAmendMode ? 'Amend — Refund of Deposits - 3842063' : `Raise New Claim — ${rdClaimLabel}`;
  const rdBreadcrumbLast = rdAmendMode ? 'Amend Claim' : 'Raise New Claim';
  const exitRdAmend = () => { setRdAmendMode(false); setClaimStep('list'); };

  const auctionFlowTitle = auctionAmendMode ? 'Amend - Refund on Auction Proceed - 3842200' : 'Raise New Claim - Refund on Auction Proceed';
  const exitAuctionAmend = () => { setAuctionAmendMode(false); resetAuctionClaim(); setClaimStep('list'); };

  // Refund on Auction Proceed — Upload Documents / Payment Details reuse the generic
  // declaration-keyed components, so selected auction lots are mapped into the Row shape
  // those components expect, keyed by Auction Lot No. instead of a declaration number.
  const auctionLotsAsRows: Row[] = auctionSelectedLots.map((lot) => ({
    declarationNo: lot.auctionLotNo,
    declarationDate: lot.auctionDate,
    depositType: 'Refund on Auction Proceed',
    declarationCategory: lot.auctionNo,
    depositAmount: `Dh ${lot.saleProceeds}`,
    depositMethod: 'N/A',
    claimExpiry: '—',
    exportExpiry: '—',
    remarks: '—',
    kind: 'request',
  }));

  if (claimStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {claimStep === 'claimTypeEntry' && (
            <ClaimTypeEntryPage
              onBack={() => setClaimStep('list')}
              onContinue={(selectedType) => {
                setSelectedClaimTypeForFlow(selectedType);
                setClaimStep(selectedType === 'refundAuction' ? 'auctionLots' : 'eligible');
              }}
            />
          )}
          {claimStep === 'eligible' && (
            <EligibleDeclarationsPage
              initialClaimType={selectedClaimTypeForFlow}
              initialSelected={rejectedPrefillDeclNos}
              onBack={() => setClaimStep(rejectedPrefillDeclNos.length > 0 ? 'list' : 'claimTypeEntry')}
              onBackToListing={() => setClaimStep('list')}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimStep('eligibleDeclView'); }}
              onProceed={(rows, selectedClaimType) => {
                // Non Remittance goes to its own per-declaration docs page
                if (selectedClaimType === 'nonRemittance') {
                  setNonRemittanceRows(rows);
                  setClaimStep('nonRemittanceDocs');
                  return;
                }

                // Refund of Deposits / Refund of Duty → shared Charge Details stepper flow
                setClaimSelectedRows(rows);
                setClaimStep('chargeDetails');
              }}
            />
          )}
          {claimStep === 'eligibleDeclView' && (
            <CustomsDeclarationViewPage
              declarationNo={claimListDeclNo}
              onBack={() => setClaimStep('eligible')}
              onServiceCatalogue={onServiceCatalogue}
              onHome={onClose}
            />
          )}
          {claimStep === 'amendDeclDetails' && claimSelectedRows.length > 0 && (
            <RDAmendDeclarationDetailsPage
              rows={claimSelectedRows}
              onRowsChange={setClaimSelectedRows}
              claimNo="3842063"
              claimLabel={rdClaimLabel}
              steps={REFUND_DEPOSIT_AMEND_STEPS}
              onBack={exitRdAmend}
              onBackToListing={exitRdAmend}
              onProceed={() => setClaimStep('chargeDetails')}
            />
          )}
          {claimStep === 'chargeDetails' && claimSelectedRows.length > 0 && (
            <RDChargeFlowPage
              rows={claimSelectedRows}
              title={rdChargeTitle}
              breadcrumbLast={rdBreadcrumbLast}
              prefill={rdAmendMode}
              prefillDeclNos={rejectedPrefillDeclNos}
              hideSaveExit={rdAmendMode}
              steps={rdAmendMode ? REFUND_DEPOSIT_AMEND_STEPS : undefined}
              onBack={() => rdAmendMode ? setClaimStep('amendDeclDetails') : setClaimStep('eligible')}
              onBackToListing={() => rdAmendMode ? exitRdAmend() : setClaimStep('list')}
              onContinue={({ details, outbounds }) => {
                setClaimChargeDetails(details);
                setClaimOutbounds(outbounds);
                // Missing/Document Deposit claims have no document upload step.
                setClaimStep(rdSkipDocs ? 'rdPayment' : 'rdDocuments');
              }}
            />
          )}
          {claimStep === 'rdDocuments' && claimSelectedRows.length > 0 && (
            /* Same document upload design as the NR claim flow. */
            <NonRemittanceDocumentsPage
              rows={claimSelectedRows}
              title={rdFlowTitle}
              badge={rdClaimLabel}
              steps={rdAmendMode ? REFUND_DEPOSIT_AMEND_STEPS : REFUND_DEPOSIT_STEPS}
              activeIndex={2}
              initialDocs={rdAmendMode ? RD_AMEND_DOCS : undefined}
              hideSaveExit={rdAmendMode}
              onBack={() => setClaimStep('chargeDetails')}
              onContinue={() => setClaimStep(rdAmendMode ? 'rdReview' : 'rdPayment')}
              onBackToListing={() => rdAmendMode ? exitRdAmend() : setClaimStep('list')}
              onUploadedDocsChange={setNonRemittanceUploadedDocs}
            />
          )}
          {claimStep === 'rdPayment' && (
            /* Payment step uses the same design as the NR claim flow. */
            <NonRemittanceChargesPage
              selectedRows={claimSelectedRows}
              title={rdFlowTitle}
              typeColumnLabel="Charge Type"
              showChargeType
              hideSaveExit={rdAmendMode}
              chargesNote={rdAmendMode ? 'Charges not applicable for Refund of Deposits Claim' : undefined}
              steps={rdSkipDocs ? REFUND_DEPOSIT_STEPS_NO_DOCS : REFUND_DEPOSIT_STEPS}
              activeIndex={rdSkipDocs ? 2 : 3}
              onBack={() => setClaimStep(rdSkipDocs ? 'chargeDetails' : 'rdDocuments')}
              onBackToListing={() => rdAmendMode ? exitRdAmend() : setClaimStep('list')}
              onContinue={(mode, acct) => { setNonRemittancePaymentMode(mode); setNonRemittanceAccountNo(acct); setClaimStep('rdReview'); }}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            />
          )}
          {claimStep === 'rdReview' && (
            /* Review step uses the same design as the NR claim flow. */
            <NonRemittanceReviewPage
              selectedRows={claimSelectedRows}
              paymentMode={nonRemittancePaymentMode}
              accountNo={nonRemittanceAccountNo}
              title={rdFlowTitle}
              steps={rdAmendMode ? REFUND_DEPOSIT_AMEND_STEPS : (rdSkipDocs ? REFUND_DEPOSIT_STEPS_NO_DOCS : REFUND_DEPOSIT_STEPS)}
              activeIndex={rdAmendMode ? 3 : (rdSkipDocs ? 3 : 4)}
              claimType={rdClaimLabel}
              showAmendment={rdAmendMode}
              chargeDetails={claimChargeDetails}
              outbounds={claimOutbounds}
              uploadedDocs={nonRemittanceUploadedDocs}
              onBack={() => setClaimStep(rdAmendMode ? 'rdDocuments' : 'rdPayment')}
              onSubmit={() => nonRemittancePaymentMode === 'E-Payment' ? setClaimStep('rdPaymentPending') : setClaimStep('rdNrSuccess')}
              onSaveAndPreview={() => { setClaimViewReturnStep('rdReview'); setClaimStep('rdClaimView'); }}
              onViewClaim={() => { setClaimViewReturnStep('rdReview'); setClaimStep('rdClaimView'); }}
            />
          )}
          {claimStep === 'rdNrSuccess' && (
            /* Success page uses the same design as the NR claim flow. */
            <NonRemittanceSuccessPage
              title={rdFlowTitle}
              heading={rdAmendMode ? 'Refund of Deposits Claim Amendment Submitted Successfully' : `${rdClaimLabel} Claim Submitted Successfully`}
              message={rdAmendMode
                ? 'Your Refund of Deposits claim amendment request has been submitted successfully and is currently under processing. Please click on View Claim button for the details.'
                : `Your ${rdClaimLabel} Claim has been submitted successfully and is currently under processing. Please click on View Claim button for the details.`}
              onBack={exitRdAmend}
              onViewAck={() => { setAckClaimType(rdClaimLabel); setAckReturnStep('list'); setClaimStep('nonRemittanceAck'); }}
              onViewDocs={() => setClaimStep('claimDocs')}
              onViewClaim={() => { setClaimViewReturnStep('list'); setClaimStep('rdClaimView'); }}
            />
          )}
          {/* Refund of Deposits / Refund of Duty — e-Payment screens reuse the NR payment pages. */}
          {claimStep === 'rdPaymentPending' && (
            <NRPaymentPendingPage
              title={rdFlowTitle}
              badgeLabel={rdClaimLabel}
              claimLabel={rdClaimLabel}
              onBackToListing={() => setClaimStep('list')}
              onMakePayment={() => setClaimStep('rdPaymentProcessing')}
            />
          )}
          {claimStep === 'rdPaymentProcessing' && (
            <NRPaymentProcessingPage
              title={rdFlowTitle}
              onBackToListing={() => setClaimStep('list')}
              onCheckStatus={() => setClaimStep('rdPaymentSuccess')}
              onPaymentFailed={() => setClaimStep('rdPaymentRejected')}
            />
          )}
          {claimStep === 'rdPaymentSuccess' && (
            <NRPaymentSuccessPage
              title={rdFlowTitle}
              onBackToListing={() => setClaimStep('list')}
              onDownloadAck={() => { setAckClaimType(rdClaimLabel); setAckReturnStep('list'); setClaimStep('nonRemittanceAck'); }}
              onViewClaim={() => { setClaimViewReturnStep('list'); setClaimStep('rdClaimView'); }}
            />
          )}
          {claimStep === 'rdPaymentRejected' && (
            <NRPaymentRejectedPage
              title={rdFlowTitle}
              onBackToListing={() => setClaimStep('list')}
              onRetryPayment={() => setClaimStep('rdPaymentProcessing')}
            />
          )}
          {claimStep === 'nonRemittanceDocs' && nonRemittanceRows.length > 0 && (
            <NonRemittanceDocumentsPage
              rows={nonRemittanceRows}
              onBack={() => setClaimStep('eligible')}
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onContinue={() => setClaimStep('nonRemittanceCharges')}
              onUploadedDocsChange={setNonRemittanceUploadedDocs}
            />
          )}
          {claimStep === 'nonRemittanceCharges' && (
            <NonRemittanceChargesPage
              selectedRows={nonRemittanceRows}
              onBack={() => setClaimStep('nonRemittanceDocs')}
              onBackToListing={() => setClaimStep('list')}
              onContinue={(mode, acct) => { setNonRemittancePaymentMode(mode); setNonRemittanceAccountNo(acct); setClaimStep('nonRemittanceReview'); }}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            />
          )}
          {claimStep === 'nonRemittanceReview' && (
            <NonRemittanceReviewPage
              selectedRows={nonRemittanceRows}
              paymentMode={nonRemittancePaymentMode}
              accountNo={nonRemittanceAccountNo}
              uploadedDocs={nonRemittanceUploadedDocs}
              onBack={() => setClaimStep('nonRemittanceCharges')}
              onSubmit={() => nonRemittancePaymentMode === 'E-Payment' ? setClaimStep('nrPaymentPending') : setClaimStep('nonRemittanceSuccess')}
              onSaveAndPreview={() => { setClaimViewReturnStep('nonRemittanceReview'); setClaimStep('nonRemittanceClaimView'); }}
              onViewClaim={() => { setClaimViewReturnStep('nonRemittanceReview'); setClaimStep('nonRemittanceClaimView'); }}
            />
          )}
          {claimStep === 'nonRemittanceSuccess' && (
            <NonRemittanceSuccessPage
              onBack={() => { setClaimStep('list'); resetNRClaim(); }}
              onViewAck={() => { setAckClaimType('Non Remittance Claim'); setAckReturnStep('nonRemittanceSuccess'); setClaimStep('nonRemittanceAck'); }}
              onViewDocs={() => setClaimStep('claimDocs')}
              onViewClaim={() => { setClaimViewReturnStep('nonRemittanceSuccess'); setClaimStep('nonRemittanceClaimView'); }}
            />
          )}
          {claimStep === 'nonRemittanceAck' && (
            <NonRemittanceAckPage
              claimType={ackClaimType}
              selectedRows={/auction/i.test(ackClaimType) ? [] : /Refund of (Deposits|Duty)/i.test(ackClaimType) ? claimSelectedRows : nonRemittanceRows}
              auctionLots={auctionSelectedLots}
              auctionClaimDetails={auctionClaimDetails}
              onBack={() => setClaimStep(ackReturnStep)}
            />
          )}
          {claimStep === 'nonRemittanceClaimView' && (
            <NonRemittanceClaimViewPage
              selectedRows={nonRemittanceRows}
              uploadedDocs={nonRemittanceUploadedDocs}
              onBack={() => setClaimStep(claimViewReturnStep)}
            />
          )}
          {claimStep === 'rdClaimView' && (
            /* Refund of Deposits / Refund of Duty in-progress claim — View Claim uses the
               Alternative Duty Deposit-style claim view, not the Non Remittance one. Passing
               the real charge details/outbounds/uploaded docs captured on the earlier steps
               makes this reflect exactly what the user selected, per declaration, instead of
               generic mock content. */
            <RefundDepositsClaimViewPage
              claimType={rdClaimLabel}
              chargeType={claimSelectedRows[0]?.depositType}
              rows={claimSelectedRows}
              chargeDetails={claimChargeDetails}
              outbounds={claimOutbounds}
              uploadedDocs={nonRemittanceUploadedDocs}
              onBack={() => setClaimStep(claimViewReturnStep)}
            />
          )}
          {claimStep === 'claimListView' && (
            listClaimType === 'Refund of Deposits' || listClaimType === 'Refund of Duty' ? (
              <RefundDepositsClaimViewPage
                claimType={listClaimType}
                chargeType={viewClaimRow?.depositType}
                declarations={viewClaimRow?.declarations}
                claimNo={viewClaimRow?.claimNo}
                claimStatus={viewClaimRow?.status}
                submissionDate={viewClaimRow?.submissionDate}
                onBack={() => setClaimStep('list')}
              />
            ) : listClaimType === 'Refund on Auction Proceed' ? (
              <AuctionClaimViewPage
                claimNo={viewClaimRow?.claimNo}
                claimStatus={viewClaimRow?.status}
                submissionDate={viewClaimRow?.submissionDate}
                claimantName={viewClaimRow?.claimantName}
                onBack={() => setClaimStep('list')}
              />
            ) : (
              <NonRemittanceClaimViewPage
                selectedRows={[]}
                uploadedDocs={[]}
                onBack={() => setClaimStep('list')}
              />
            )
          )}
          {claimStep === 'cancelClaim' && (
            <ClaimCancelFlow claimType={listClaimType} onBack={() => setClaimStep('list')} />
          )}
          {claimStep === 'amendClaim' && (
            <ClaimAmendFlow onBack={() => setClaimStep('list')} />
          )}
          {claimStep === 'claimDocs' && (
            <ClaimDocumentsPage onBack={() => setClaimStep('list')} />
          )}
          {claimStep === 'claimSuspensionList' && suspensionRow && (
            <SuspensionResponseListPage
              requestNo={suspensionRow.reqNo}
              claimType={suspensionRow.claimType}
              chargeType={suspensionRow.depositType}
              declarations={suspensionRow.declarations}
              onBack={() => setClaimStep('list')}
              onBackToListing={() => setClaimStep('list')}
              onProvideResponse={(declNo) => { setSuspensionDeclNo(declNo); setClaimStep('claimSuspension'); }}
            />
          )}
          {claimStep === 'claimSuspension' && (() => {
            // Claim Time Validity Extension rows are non-claim "requests" — reword the copy and
            // identify them by Request No. (their claimNo is always '—') instead of Claim No.
            const isRequest = !!suspensionRow?.transactionType;
            const idLabel = isRequest ? (suspensionRow?.reqNo ?? '231626') : (suspensionRow?.claimNo ?? '2420390');
            const typeLabel = suspensionRow?.claimType ?? 'Refund of Deposits';
            return (
              <SuspensionResponsePage
                breadcrumbParent={isRequest ? 'Claim Time Validity Extension' : 'Refund & Claims'}
                title={`Suspension Response - ${typeLabel} - ${idLabel}${suspensionDeclNo ? ` - ${suspensionDeclNo}` : ''}`}
                successHeading="Suspension Response Submitted Successfully"
                successMessage={`Your suspension response for the ${typeLabel} ${isRequest ? 'request' : 'claim'} has been submitted successfully and is currently under processing.`}
                requestNumber={suspensionRow?.reqNo ?? '2588017'}
                onBack={() => setClaimStep(suspensionRow && suspensionRow.declarations.length > 1 && !suspensionDeclNo ? 'claimSuspensionList' : 'list')}
                onBackToListing={() => setClaimStep('list')}
                onSubmit={() => setClaimStep('list')}
              />
            );
          })()}
          {claimStep === 'declStatusExpiry' && (
            <DeclarationStatusExpiryPage onBack={() => setClaimStep('list')} />
          )}
          {claimStep === 'createClaimFromRejectedList' && rejectedClaimRow && (
            <CreateClaimFromRejectedListPage
              requestNo={rejectedClaimRow.reqNo}
              claimType={rejectedClaimRow.claimType}
              declarations={rejectedClaimRow.declarations.map((d, i) => ({
                declNo: d.declNo,
                declDate: d.date,
                declType: d.category,
                chargeType: rejectedClaimRow.depositType,
                depositMethod: 'Standing Guarantee',
                accountNumber: 'ACC-100234',
                ownerCode: d.ownerCode,
                exportExpiry: d.exportExpiry,
                claimExpiry: d.claimExpiry,
                // First two declarations represent the rejected sub claims, the rest completed —
                // matches this mock row's remark ("1 sub claim rejected" summary in the listing).
                subClaimStatus: i < 2 ? 'Rejected' : 'Completed',
              }))}
              onBack={() => setClaimStep('list')}
              onContinue={(selectedDeclNos) => {
                setRejectedPrefillDeclNos(selectedDeclNos);
                setSelectedClaimTypeForFlow('refundDeposit');
                setClaimStep('eligible');
              }}
            />
          )}
          {claimStep === 'validityExtEligible' && (
            <ValidityExtensionEligiblePage
              onBack={() => setClaimStep('list')}
              onBackToListing={() => setClaimStep('list')}
              onProceed={(rows) => { setValidityExtRows(rows); setClaimStep('validityExtDetails'); }}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            />
          )}
          {claimStep === 'validityExtDetails' && validityExtRows.length > 0 && (
            <ValidityExtensionDetailsPage
              rows={validityExtRows}
              onBack={() => setClaimStep('validityExtEligible')}
              onBackToListing={() => setClaimStep('list')}
              onProceed={(details) => { setValidityExtDetails(details); setClaimStep('validityExtPayment'); }}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            />
          )}
          {claimStep === 'validityExtPayment' && validityExtRows.length > 0 && (
            <NonRemittanceChargesPage
              title="Raise New Claim - Claim Time Validity Extension"
              steps={VALIDITY_EXT_STEPS}
              activeIndex={2}
              selectedRows={validityExtRows}
              hideClaimantBroker
              hideDeclarationCount
              onBack={() => setClaimStep('validityExtDetails')}
              onBackToListing={() => setClaimStep('list')}
              onContinue={(mode, acc) => { setValidityExtPaymentMode(mode); setValidityExtAccountNo(acc); setClaimStep('validityExtReview'); }}
            />
          )}
          {claimStep === 'validityExtReview' && validityExtRows.length > 0 && validityExtDetails && (
            <NonRemittanceReviewPage
              title="Raise New Claim - Claim Time Validity Extension"
              steps={VALIDITY_EXT_STEPS}
              activeIndex={3}
              claimType="Claim Time Validity Extension"
              selectedRows={validityExtRows}
              paymentMode={validityExtPaymentMode}
              accountNo={validityExtAccountNo}
              extensionEntries={validityExtRows.map(row => ({
                row,
                days: validityExtDetails.rows.find(r => r.declarationNo === row.declarationNo && r.depositType === row.depositType)?.days ?? '',
              }))}
              extensionReason={validityExtDetails.reason}
              extensionDocuments={validityExtDetails.documents}
              onBack={() => setClaimStep('validityExtPayment')}
              onSubmit={() => setClaimStep('validityExtSuccess')}
            />
          )}
          {claimStep === 'validityExtSuccess' && (
            <NonRemittanceSuccessPage
              title="Raise New Claim - Claim Time Validity Extension"
              heading="Claim Time Validity Extension - Confirmation"
              message="Your Claim Time Validity Extension request has been submitted successfully and is currently under processing."
              requestNumberLabel="Claim Time Validity Extension Request Number:"
              registrationNumberLabel="Registration Number:"
              hideViewClaim
              onBack={() => { setValidityExtRows([]); setValidityExtDetails(null); setClaimStep('list'); }}
              onViewAck={() => setClaimStep('list')}
            />
          )}
          {claimStep === 'claimHistory' && (
            <ClaimsAuditHistoryPage
              onBack={() => setClaimStep('list')}
            />
          )}
          {claimStep === 'nrPaymentPending' && (
            <NRPaymentPendingPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onMakePayment={() => setClaimStep('nrPaymentProcessing')}
            />
          )}
          {claimStep === 'nrPaymentProcessing' && (
            <NRPaymentProcessingPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onCheckStatus={() => setClaimStep('nrPaymentSuccess')}
              onPaymentFailed={() => setClaimStep('nrPaymentRejected')}
            />
          )}
          {claimStep === 'nrPaymentSuccess' && (
            <NRPaymentSuccessPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onDownloadAck={() => { setAckClaimType('Non Remittance Claim'); setAckReturnStep('nrPaymentSuccess'); setClaimStep('nonRemittanceAck'); }}
              onViewClaim={() => { setClaimViewReturnStep('nrPaymentSuccess'); setClaimStep('nonRemittanceClaimView'); }}
            />
          )}
          {claimStep === 'nrPaymentRejected' && (
            <NRPaymentRejectedPage
              onBackToListing={() => { setClaimStep('list'); resetNRClaim(); }}
              onRetryPayment={() => setClaimStep('nrPaymentProcessing')}
            />
          )}
          {claimStep === 'auctionLots' && (
            <AuctionLotDetailsPage
              onBack={() => setClaimStep('claimTypeEntry')}
              onBackToListing={() => setClaimStep('list')}
              onProceed={(lots) => { setAuctionSelectedLots(lots); setClaimStep('auctionClaimDetails'); }}
            />
          )}
          {claimStep === 'amendAuctionLots' && auctionSelectedLots.length > 0 && (
            <AuctionAmendLotDetailsPage
              rows={auctionSelectedLots}
              onRowsChange={setAuctionSelectedLots}
              claimNo="3842200"
              steps={REFUND_AUCTION_AMEND_STEPS}
              onBack={exitAuctionAmend}
              onBackToListing={exitAuctionAmend}
              onProceed={() => setClaimStep('auctionClaimDetails')}
            />
          )}
          {claimStep === 'auctionClaimDetails' && auctionSelectedLots.length > 0 && (
            <AuctionClaimDetailsPage
              rows={auctionSelectedLots}
              initialDetails={auctionClaimDetails.length > 0 ? auctionClaimDetails : undefined}
              title={auctionFlowTitle}
              steps={auctionAmendMode ? REFUND_AUCTION_AMEND_STEPS : REFUND_AUCTION_STEPS}
              hideSaveExit={auctionAmendMode}
              onBack={() => setClaimStep(auctionAmendMode ? 'amendAuctionLots' : 'auctionLots')}
              onBackToListing={() => auctionAmendMode ? exitAuctionAmend() : setClaimStep('list')}
              onProceed={(details) => { setAuctionClaimDetails(details); setClaimStep('auctionDocuments'); }}
            />
          )}
          {claimStep === 'auctionDocuments' && auctionSelectedLots.length > 0 && (
            <NonRemittanceDocumentsPage
              rows={auctionLotsAsRows}
              title={auctionFlowTitle}
              badge="Refund on Auction Proceed"
              steps={auctionAmendMode ? REFUND_AUCTION_AMEND_STEPS : REFUND_AUCTION_STEPS}
              activeIndex={2}
              itemLabel="Auction Lot"
              initialDocs={auctionUploadedDocs}
              hideSaveExit={auctionAmendMode}
              onBack={() => setClaimStep('auctionClaimDetails')}
              onBackToListing={() => { if (auctionAmendMode) { exitAuctionAmend(); } else { setClaimStep('list'); resetAuctionClaim(); } }}
              onContinue={() => setClaimStep(auctionAmendMode ? 'auctionReview' : 'auctionPayment')}
              onUploadedDocsChange={setAuctionUploadedDocs}
            />
          )}
          {claimStep === 'auctionPayment' && (
            <NonRemittanceChargesPage
              selectedRows={auctionLotsAsRows}
              title={auctionFlowTitle}
              steps={REFUND_AUCTION_STEPS}
              activeIndex={3}
              declNoColumnLabel="Auction Lot Number"
              typeColumnLabel="Auction Number"
              declarationCountLabel="No. of Auction Numbers applicable for registration fee"
              onBack={() => setClaimStep('auctionDocuments')}
              onBackToListing={() => { setClaimStep('list'); resetAuctionClaim(); }}
              onContinue={(mode, acct) => { setAuctionPaymentMode(mode); setAuctionAccountNo(acct); setClaimStep('auctionReview'); }}
              onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            />
          )}
          {claimStep === 'auctionReview' && (
            <AuctionClaimReviewPage
              selectedLots={auctionSelectedLots}
              claimDetails={auctionClaimDetails}
              paymentMode={auctionPaymentMode}
              accountNo={auctionAccountNo}
              uploadedDocs={auctionUploadedDocs}
              title={auctionFlowTitle}
              steps={auctionAmendMode ? REFUND_AUCTION_AMEND_STEPS : REFUND_AUCTION_STEPS}
              activeIndex={auctionAmendMode ? 3 : 4}
              showAmendment={auctionAmendMode}
              onBack={() => setClaimStep(auctionAmendMode ? 'auctionDocuments' : 'auctionPayment')}
              onSubmit={() => setClaimStep(auctionPaymentMode === 'E-Payment' ? 'auctionPaymentPending' : 'auctionSuccess')}
              onSaveAndPreview={() => { setClaimViewReturnStep('auctionReview'); setClaimStep('auctionClaimView'); }}
            />
          )}
          {claimStep === 'auctionClaimView' && (
            <AuctionClaimViewPage
              selectedLots={auctionSelectedLots}
              claimDetails={auctionClaimDetails}
              uploadedDocs={auctionUploadedDocs}
              onBack={() => setClaimStep(claimViewReturnStep)}
            />
          )}
          {claimStep === 'auctionSuccess' && (
            <NonRemittanceSuccessPage
              title={auctionFlowTitle}
              heading={auctionAmendMode ? 'Refund on Auction Proceed Claim Amendment Submitted Successfully' : 'Refund on Auction Proceed Claim Submitted Successfully'}
              message={auctionAmendMode
                ? 'Your Refund on Auction Proceed claim amendment request has been submitted successfully and is currently under processing. Please click on View Claim button for the details.'
                : 'Your Refund on Auction Proceed Claim has been submitted successfully and is currently under processing. Please click on View Claim button for the details.'}
              onBack={exitAuctionAmend}
              onViewAck={() => { setAckClaimType('Refund on Auction Proceed'); setAckReturnStep('list'); setClaimStep('nonRemittanceAck'); }}
              onViewDocs={() => setClaimStep('claimDocs')}
              onViewClaim={() => { setClaimViewReturnStep('list'); setClaimStep('auctionClaimView'); }}
            />
          )}
          {claimStep === 'auctionPaymentPending' && (
            <NRPaymentPendingPage
              title="Raise New Claim - Refund on Auction Proceed"
              badgeLabel="Refund on Auction Proceed"
              claimLabel="Refund on Auction Proceed"
              onBackToListing={() => { setClaimStep('list'); resetAuctionClaim(); }}
              onMakePayment={() => setClaimStep('auctionPaymentProcessing')}
            />
          )}
          {claimStep === 'auctionPaymentProcessing' && (
            <NRPaymentProcessingPage
              title="Raise New Claim - Refund on Auction Proceed"
              onBackToListing={() => { setClaimStep('list'); resetAuctionClaim(); }}
              onCheckStatus={() => setClaimStep('auctionPaymentSuccess')}
              onPaymentFailed={() => setClaimStep('auctionPaymentRejected')}
            />
          )}
          {claimStep === 'auctionPaymentSuccess' && (
            <NRPaymentSuccessPage
              title="Raise New Claim - Refund on Auction Proceed"
              onBackToListing={() => { setClaimStep('list'); resetAuctionClaim(); }}
              onDownloadAck={() => { setAckClaimType('Refund on Auction Proceed'); setAckReturnStep('list'); setClaimStep('nonRemittanceAck'); }}
              onViewClaim={() => { setClaimViewReturnStep('list'); setClaimStep('auctionClaimView'); }}
            />
          )}
          {claimStep === 'auctionPaymentRejected' && (
            <NRPaymentRejectedPage
              title="Raise New Claim - Refund on Auction Proceed"
              onBackToListing={() => { setClaimStep('list'); resetAuctionClaim(); }}
              onRetryPayment={() => setClaimStep('auctionPaymentProcessing')}
            />
          )}
        </div>
      </div>
    );
  }

  if (ackStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          <AckSuccessPage
            mode={ackStep === 'acceptSuccess' ? 'accept' : 'decline'}
            count={ackStep === 'acceptSuccess' ? ackSelected.size : undefined}
            declarationNumbers={ackDeclarationNumbers}
            onBack={() => {
              setAckStep('list');
              setAckSelected(new Set());
              setAckDeclineRowIndex(null);
            }}
          />
        </div>
      </div>
    );
  }

  /* Row actions from the declaration listing (and from Declaration History) take over the
     page the same way the cargo-transfer sub-flows do. */
  if (declAction) {
    const backToSource = () => {
      if (declActionFrom === 'history') { setDeclAction('history'); return; }
      setDeclAction(null);
    };
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {declAction === 'cancel' && (
            <CancelDeclarationFlow
              declarationNo={declActionNo}
              onClose={backToSource}
              onViewDeclaration={() => setDeclAction('viewDeclaration')}
            />
          )}
          {declAction === 'history' && (
            <DeclarationHistoryPage
              onHome={onClose}
              onBack={() => setDeclAction(null)}
              onAction={(action) => {
                setDeclActionFrom('history');
                if (action === 'amend') {
                  setDeclAction(null);
                  setAmendDeclNo(declActionNo);
                  setClearanceJourneyOpen(true);
                  return;
                }
                if (action === 'printDeclaration') return;
                setDeclAction(
                  action === 'cancel' ? 'cancel'
                  : action === 'suspensionHistory' ? 'suspensionHistory'
                  : action === 'viewDeclaration' ? 'viewDeclaration'
                  : 'declarantResponse',
                );
              }}
            />
          )}
          {declAction === 'suspensionHistory' && (
            <DeclSuspensionHistoryPage declarationNo={declActionNo} onHome={onClose} onBack={backToSource} />
          )}
          {declAction === 'declarantResponse' && (
            <DeclarantResponsePage
              declarationNumber={declActionNo}
              onHome={onClose}
              onBack={backToSource}
              onBackToListing={() => { setDeclActionFrom('list'); setDeclAction(null); }}
            />
          )}
          {declAction === 'viewDeclaration' && (
            <ActionPage title="View Declaration" onHome={onClose} onBack={backToSource}>
              <ViewDeclarationPage />
            </ActionPage>
          )}
        </div>
      </div>
    );
  }

  if (cargoStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {cargoStep === 'pre' && (
            <CargoTransferPrePage
              onBack={() => setCargoStep('list')}
              onStartJourney={(values) => { setCargoPreValues(values); setCargoStep('create'); }}
              initialValues={cargoFlowMode === 'amend' ? cargoPreValues : undefined}
              mode={cargoFlowMode}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'create' && (
            <CargoTransferNewRequestPage
              onBack={() => setCargoStep(cargoFlowMode === 'amend' ? 'list' : 'pre')}
              onSave={(values) => { setCargoFormValues(values); setStepperReturnStep(0); setCargoStep('stepper'); }}
              initialCargoChannel={cargoPreValues.cargoChannel}
              initialClientRef={cargoPreValues.clientRef}
              initialCarrierReg={cargoPreValues.carrierReg}
              initialMawb={cargoFormValues.mawb}
              initialTransferorBizCode={cargoFormValues.transferorBizCode}
              initialTransferorPremCode={cargoFormValues.transferorPremCode}
              initialTransfereeBizCode={cargoFormValues.transfereeBizCode}
              initialTransfereePremCode={cargoFormValues.transfereePremCode}
              initialTransferType={cargoPreValues.transferType}
              mode={cargoFlowMode}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'document' && (
            <CargoTransferDocumentPage
              onBack={() => setCargoStep('create')}
              onProceed={() => setCargoStep('stepper')}
            />
          )}
          {cargoStep === 'stepper' && (
            <CargoTransferStepperPage
              onBack={() => setCargoStep('create')}
              onSubmit={() => { setStepperReturnStep(cargoFlowMode === 'amend' ? 4 : 3); setCargoStep('paymentReview'); }}
              onSaveExit={() => setCargoStep('list')}
              mode={cargoFlowMode}
              initialStep={stepperReturnStep}
              initTransferType={cargoPreValues.transferType}
              initTransferNumber={cargoTransferNumber}
              initCargoChannel={cargoPreValues.cargoChannel}
              initClientRef={cargoFormValues.clientRef}
              initCarrierReg={cargoFormValues.carrierReg}
              initMasterDoc={cargoFormValues.mawb}
              initTransferorBiz={cargoFormValues.transferorBizCode}
              initTransferorPrem={cargoFormValues.transferorPremCode}
              initTransfereeBiz={cargoFormValues.transfereeBizCode}
              initTransfereePrem={cargoFormValues.transfereePremCode}
            />
          )}
          {cargoStep === 'paymentReview' && (
            <CargoTransferPaymentReviewPage
              onBack={() => setCargoStep('stepper')}
              onSubmit={() => setCargoStep(cargoFlowMode === 'amend' ? 'amendSuccess' : 'success')}
              onSaveExit={() => { setStepperReturnStep(0); setCargoStep('list'); }}
              mode={cargoFlowMode}
              onViewRequest={() => setCargoStep('viewRequest')}
              transferType={cargoPreValues.transferType}
              transferNumber={cargoTransferNumber}
            />
          )}
          {cargoStep === 'viewRequest' && (
            <CargoTransferViewPage
              onBack={() => setCargoStep('list')}
              onSubmit={() => setCargoStep(cargoFlowMode === 'amend' ? 'amendSuccess' : 'success')}
              transferNumber={cargoTransferNumber}
              onRefresh={() => setCargoStep('viewRequest')}
            />
          )}
          {cargoStep === 'success' && (
            <CargoTransferSuccessPage mode="create" onBack={() => setCargoStep('list')} onViewDetails={() => setCargoStep('viewRequest')} />
          )}
          {cargoStep === 'amendSuccess' && (
            <CargoTransferSuccessPage mode="amend" transferType={cargoPreValues.transferType} transferNumber={cargoTransferNumber} onBack={() => setCargoStep('list')} onViewDetails={() => setCargoStep('viewRequest')} />
          )}
          {cargoStep === 'cancel' && (
            <CargoTransferCancelFlow onBack={() => setCargoStep('list')} />
          )}
          {cargoStep === 'cargoHistory' && (
            <CargoTransferHistoryPage
              onBack={() => setCargoStep('list')}
              onBackToListing={() => setCargoStep('list')}
              onSuspensionHistory={() => { setSuspensionHistoryFrom('cargoHistory'); setCargoStep('suspensionHistory'); }}
              onSuspensionResponse={() => setCargoStep('suspensionResponse')}
              onViewRequest={() => setCargoStep('viewRequest')}
              onAmend={() => {
                setCargoPreValues({ transferType: 'From CTO to CH - Same Location', cargoChannel: 'Sea', clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543' });
                setCargoFormValues({ clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543', mawb: 'AWB-987654321', transferorBizCode: 'AE-1019056', transferorPremCode: 'PRE-001', transfereeBizCode: 'AE-1019057', transfereePremCode: 'PRE-002' });
                setCargoFlowMode('amend');
                setCargoTransferNumber('601001745352');
                setStepperReturnStep(0);
                setCargoStep('create');
              }}
              onCancel={() => setCargoStep('cancel')}
            />
          )}
          {cargoStep === 'suspensionHistory' && (
            <SuspensionHistoryPage
              onBack={() => setCargoStep(suspensionHistoryFrom)}
              onBackToListing={() => setCargoStep('list')}
              onView={() => setCargoStep('suspensionHistoryView')}
            />
          )}
          {cargoStep === 'suspensionHistoryView' && (
            <SuspensionHistoryViewPage
              onBack={() => setCargoStep('suspensionHistory')}
              onBackToListing={() => setCargoStep('list')}
            />
          )}
          {cargoStep === 'suspensionResponse' && (
            <SuspensionResponsePage
              onBack={() => setCargoStep('list')}
              onBackToListing={() => setCargoStep('list')}
              onSubmit={() => setShowSuspensionSuccess(true)}
            />
          )}
          {cargoStep === 'receiptRelease' && (
            <CargoTransferReceiptReleasePage
              onBack={() => setCargoStep('list')}
            />
          )}
          {showSuspensionSuccess && (
            <SuspensionSuccessModal
              onClose={() => { setShowSuspensionSuccess(false); setCargoStep('cargoHistory'); }}
              onBackToListing={() => { setShowSuspensionSuccess(false); setCargoStep('list'); }}
            />
          )}
        </div>
      </div>
    );
  }

  if (vccStep !== 'list') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-hidden">
        <div className="flex-shrink-0">
          <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
        </div>
        <div className="flex-1 overflow-hidden">
          {vccStep === 'create' && (
            <RequestVccPage
              onBack={() => setVccStep('list')}
              onSearch={() => setVccStep('searchResult')}
            />
          )}
          {vccStep === 'searchResult' && (
            <VccSearchResultPage
              onBack={() => setVccStep('create')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'amend' && (
            <VccSearchResultPage
              mode="amend"
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'retryRequest' && (
            <VccSearchResultPage
              mode="amend"
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('create')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'viewRequest' && (
            <VccViewRequestPage onBack={() => setVccStep('list')} status={selectedVccStatus} />
          )}
          {vccStep === 'paymentSuccess' && (
            <VccPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onShowPaymentFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'ePaymentPending' && (
            <VccEPaymentPendingPage
              onBackToListing={() => setVccStep('list')}
              onMakePayment={() => setVccStep('ePaymentProcessing')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'ePaymentSuccess' && (
            <VccEPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onRecheckStatus={() => setVccStep('ePaymentConfirmed')}
            />
          )}
          {vccStep === 'ePaymentProcessing' && (
            <VccEPaymentSuccessPage
              onBackToListing={() => setVccStep('list')}
              onRecheckStatus={() => setVccStep('ePaymentConfirmed')}
              onPaymentFailed={() => setVccStep('ePaymentFailed')}
            />
          )}
          {vccStep === 'ePaymentConfirmed' && (
            <VccEPaymentConfirmedPage
              onBackToListing={() => setVccStep('list')}
              onMakeEPayment={() => setActiveMenu('Declaration')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'ePaymentFailed' && (
            <VccEPaymentFailedPage
              onBackToListing={() => setVccStep('list')}
              onRetryPayment={() => setVccStep('ePaymentProcessing')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
            />
          )}
          {vccStep === 'updatePaymentMode' && (
            <VccUpdatePaymentModePage
              onBackToListing={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentProcessing' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'creditDebitFailed' && (
            <VccEPaymentFailedPage
              retryLabel="Retry Payment"
              onRetryPayment={() => setVccStep('retryPayment')}
              onChangePaymentMode={() => setVccStep('updatePaymentMode')}
              onBackToListing={() => setVccStep('list')}
            />
          )}
          {vccStep === 'retryPayment' && (
            <VccSearchResultPage
              mode="retry"
              requestNumber={vccRetryReqNo}
              initialSelected={['v0', 'v2', 'v4']}
              onBack={() => setVccStep('list')}
              onSubmit={(mode) => setVccStep(mode === 'epayment' ? 'ePaymentPending' : 'paymentSuccess')}
              onCreditDebitFailed={() => setVccStep('creditDebitFailed')}
            />
          )}
          {vccStep === 'auditHistory' && (
            <VccAuditHistoryPage onBack={() => setVccStep('list')} />
          )}
          {vccStep === 'declarationView' && (
            <CustomsDeclarationViewPage
              declarationNo={vccDeclNo}
              onBack={() => setVccStep('list')}
              onServiceCatalogue={onServiceCatalogue}
              onHome={onClose}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd] overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header onServiceCatalogue={onServiceCatalogue} onHome={onClose} />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[24px] z-[60] size-[36px] flex items-center justify-center text-white hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Body: side panel (starts at the breadcrumb line, full screen height) + right content column */}
      <div className="flex flex-1 px-4 md:px-10 pt-[14px] pb-[20px] gap-[12px] items-stretch">

        {/* Left action panel — same panel, moved up to start at the breadcrumb line */}
        <div
          className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300 max-md:!w-16"
          style={{
            width: panelCollapsed ? 64 : 180,
            background: '#e4efff',
            border: '1px solid #a6c2e9',
          }}
        >
          {/* Collapse / expand button — white circle with blue border */}
          <button
            onClick={() => setPanelCollapsed(c => !c)}
            className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] w-full flex-shrink-0"
            title={panelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <span
              className="size-[32px] rounded-full flex items-center justify-center bg-white transition-colors hover:bg-[#eef4ff]"
              style={{ border: '1.5px solid #a6c2e9' }}
            >
              <svg viewBox="0 0 20 20" className="size-[16px] transition-transform duration-300" style={{ transform: panelCollapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 15l-5-5 5-5" />
                <path d="M8 15l-5-5 5-5" />
              </svg>
            </span>
          </button>
          {/* Items */}
          {([
            { src: declarationSrc,    label: 'Declaration'     as const },
            { src: cargoTransferSrc,  label: 'Cargo Transfer'  as const },
            { src: acknowledgementSrc,label: 'Acknowledgement' as const },
            { src: refundsSrc,        label: 'Refund & Claims' as const },
            { src: timeValidityExtensionSrc, label: 'Claim Time Validity Extension' as const },
            { src: vccSrc,            label: 'VCC'             as const },
            { src: paymentsSrc,       label: 'E-Payment'       as const },
          ]).map((action, i) => {
            const isActive = activeMenu === action.label;
            return (
            <button
              key={action.label}
              onClick={() => setActiveMenu(action.label)}
              className="flex items-center w-full text-left transition-all hover:opacity-80 max-md:!gap-0 max-md:!px-3 max-md:!justify-center"
              style={{
                gap: panelCollapsed ? 0 : 10,
                padding: panelCollapsed ? '12px 12px' : '12px 14px',
                justifyContent: panelCollapsed ? 'center' : 'flex-start',
                ...(isActive
                  ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                  : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
              }}
              title={panelCollapsed ? action.label : undefined}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-[8px]"
                style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
              >
                <img src={action.src} alt={action.label} className="size-[20px] object-contain" />
              </div>
              {!panelCollapsed && (
                <span
                  className="hidden md:block text-[16px] text-[#0e1b3d] leading-tight flex-1 min-w-0"
                  style={{ fontFamily: "'Dubai', sans-serif", fontWeight: isActive ? 700 : 400, wordBreak: 'break-word' }}
                >
                  {action.label}
                </span>
              )}
            </button>
            );
          })}
        </div>

        {/* Right column: breadcrumb + stepper + content */}
        <div className="flex-1 flex flex-col min-w-0">

      {/* Breadcrumb + Journey stepper */}
      <div className="flex-shrink-0">
        {/* Breadcrumb + Agent banner */}
        <div className="flex items-center justify-between pb-[10px] flex-wrap gap-y-[6px]">
          <div className="flex items-center gap-[6px]">
            <span
              className="text-[#8f94ae] text-[16px] cursor-pointer hover:text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif" }}
              onClick={onClose}
            >Home</span>
            <span className="text-[#dc3545] text-[15px] leading-none">/</span>
            <span className="text-[#8f94ae] text-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>Service Catalog</span>
            <span className="text-[#dc3545] text-[15px] leading-none">/</span>
            <span className="text-[#111838] text-[16px] font-medium" style={{ fontFamily: "'Dubai', sans-serif" }}>Integrated Clearance</span>
          </div>
          {/* Agent banner */}
          <div
            className="px-[16px] py-[4px] rounded-[4px] text-[16px] text-[#0e1b3d]"
            style={{ background: '#e2ebf9', fontFamily: "'Dubai', sans-serif" }}
          >
            AE-1019056 — Dubai Customs - Test LLC
          </div>
        </div>

        {/* Journey stepper bar */}
        <div className="pt-[20px] pb-[40px] flex justify-center">
          <div
            className="bg-white rounded-[8px] pl-[16px] pr-[10px] py-[10px] flex items-center gap-[4px] w-full max-w-[1240px]"
            style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}
          >
            {/* Left scroll arrow — shown when steps overflow to the left */}
            {stepperArrows.left && (
              <button
                onClick={() => scrollStepper(-1)}
                aria-label="Scroll steps left"
                className="flex-shrink-0 size-[30px] rounded-full border border-[#d5ddfb] bg-white flex items-center justify-center text-[#1360d2] hover:bg-[#eef4ff] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            )}

            {/* Scrollable steps track */}
            <div
              ref={stepperScrollRef}
              onScroll={updateStepperArrows}
              className="flex-1 min-w-0 overflow-x-auto no-scrollbar"
            >
              <div className="flex items-center w-max mx-auto">
            {/* Import by Sea label */}
            <div className="flex items-center gap-[10px] flex-shrink-0">
              <img src={importBySeaSrc} alt="Import by Sea" className="h-[30px] w-auto flex-shrink-0" />
              <span className="text-[16px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Import by Sea
              </span>
            </div>

            {/* Red ) arc separator */}
            <div className="flex items-center flex-shrink-0 mx-[10px]">
              <svg viewBox="0 0 14 46" width="14" height="46" fill="none">
                <path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Step: Trade + */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={tradePlusSrc} alt="Trade +" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Trade +</span>
            </div>

            {/* Blue line connector */}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />

            {/* Step: Integrated Clearance (active) */}
            <div
              className="flex items-center gap-[8px] flex-shrink-0 px-[10px] py-[5px] rounded-[22px]"
              style={{ border: '2px solid #28a745', boxShadow: '0 0 18px 0 rgba(40,167,69,0.25)', background: '#fff' }}
            >
              <div className="size-[36px] rounded-full border-2 border-[#28a745] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={integratedClearanceSrc} alt="Integrated Clearance" className="size-[20px] object-contain" />
              </div>
              <span className="text-[18px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Integrated Clearance
              </span>
            </div>

            {/* Green wave connector (wave.svg) */}
            <div className="mx-[10px] flex items-center" style={{ width: 100 }}>
              <img src={waveSrc} alt="" style={{ width: 100, height: 16 }} />
            </div>

            {/* Step: Payments */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={paymentsSrc} alt="Payments" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Payments</span>
            </div>

            {/* Blue line connector */}
            <div className="mx-[10px] h-[1.5px] rounded-full" style={{ background: '#c5cef7', width: 100 }} />

            {/* Step: Cargo Waves */}
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[34px] rounded-full border-[1.5px] border-[#c5cef7] flex items-center justify-center flex-shrink-0 bg-white">
                <img src={cargoWavesSrc} alt="Cargo Waves" className="size-[18px] object-contain" style={{ filter: 'opacity(0.55)' }} />
              </div>
              <span className="text-[12px] text-[#5a6282] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>Cargo Waves</span>
            </div>
              </div>{/* end steps track */}
            </div>{/* end scroll container */}

            {/* Right scroll arrow — shown when steps overflow to the right */}
            {stepperArrows.right && (
              <button
                onClick={() => scrollStepper(1)}
                aria-label="Scroll steps right"
                className="flex-shrink-0 size-[30px] rounded-full border border-[#d5ddfb] bg-white flex items-center justify-center text-[#1360d2] hover:bg-[#eef4ff] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-[6px] size-[28px] rounded-full border border-[#d5ddfb] flex items-center justify-center text-[#8f94ae] hover:text-[#0e1b3d] hover:border-[#0e1b3d] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>{/* end breadcrumb+stepper */}

      {/* Main content */}
      <div className="flex flex-1 pt-[4px]">

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">

        {/* Controls row */}
        <div className="flex items-center mb-[12px] gap-[12px] flex-wrap">
          {/* Left: advanced filters button — hidden on ePayment tab and ePayments sidebar */}
          {activeTab !== 'epay' && activeMenu !== 'E-Payment' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-[8px] h-[48px] px-[12px] sm:px-[16px] py-[12px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
                showFilters
                  ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]'
                  : 'bg-white border-[#d4dcfa] text-[#000000]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              <span className="hidden sm:inline">Advanced Filters</span>
              <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Center: search bar */}
          <div className={`hidden md:flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[320px] max-w-[420px] relative ${filtersLock}`}>
            {/* Type dropdown */}
            <button
              type="button"
              onClick={() => setSearchTypeOpen(o => !o)}
              className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 hover:bg-[#f7faff] transition-colors"
            >
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                {searchType}
              </span>
              <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {searchTypeOpen && (
              <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 180, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                {searchTypeOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSearchType(opt); setSearchTypeOpen(false); setSearchValue(''); setSearchQuery(''); setEPayReqType(''); setEPayReqTypeOpen(false); }}
                    className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                    style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === searchType ? 500 : 400 }}
                  >{opt}</button>
                ))}
              </div>
            )}
            {/* Input */}
            <div className="flex items-center flex-1 min-w-0 pl-[12px] pr-[5px] relative">
              <input
                type="text"
                value={searchValue}
                onChange={e => { setSearchValue(e.target.value); if (searchQuery && e.target.value.trim() === '') setSearchQuery(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch(); } }}
                placeholder={
                  (searchType === 'VCC Number' || searchType === 'Chasis Number')
                    ? `Enter ${searchType.toLowerCase()} and press Enter`
                    : activeMenu === 'E-Payment' && searchType === 'Request Number'
                    ? 'Enter request number'
                    : activeMenu === 'Declaration' && activeTab !== 'epay'
                    ? (searchType === 'Declaration' ? 'Declaration no.' : 'Enter number')
                    : `${searchType.toLowerCase()}`
                }
                className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              />
              {searchValue !== '' && (
                <button
                  type="button"
                  onClick={() => { setSearchValue(''); setSearchQuery(''); }}
                  aria-label="Clear search"
                  className="flex-shrink-0 ml-[8px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] hover:text-[#0e1b3d] transition-colors"
                >
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 5l10 10M15 5l-10 10" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={submitSearch}
                aria-label="Search"
                className="flex-shrink-0 inline-flex items-center justify-center rounded-[6px] transition-opacity hover:opacity-90" style={{ width: 38, height: 38, background: '#1360d2' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#ffffff" /></svg>
              </button>
            </div>
          </div>

          {/* Search — collapsed to an icon below md; opens the flyout below */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search"
            className={`md:hidden flex items-center justify-center h-[48px] w-[48px] rounded-[4px] border border-[#d4dcfa] bg-white flex-shrink-0 ${filtersLock}`}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
            </svg>
          </button>


          {/* Request Type secondary dropdown — only for standalone ePayments + Request Number */}
          {activeMenu === 'E-Payment' && searchType === 'Request Number' && (
            <div className={`relative flex-shrink-0 ${filtersLock}`}>
              <button
                type="button"
                onClick={() => setEPayReqTypeOpen(o => !o)}
                className="flex items-center gap-[6px] h-[48px] px-[14px] bg-white border border-[#d5ddfb] rounded-[4px] hover:bg-[#f7faff] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                <span className="text-[16px] font-medium whitespace-nowrap" style={{ color: ePayReqType ? '#1360d2' : '#697498' }}>
                  {ePayReqType || 'Request Type'}
                </span>
                <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform ${ePayReqTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {ePayReqTypeOpen && (
                <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {['New Declaration', 'Amendment', 'VCC Request', 'VCC Amendment', 'New Cargo Transfer', 'Amend Transfer', 'Refund Request', 'Deposit Claim', 'Ack. Fee'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setEPayReqType(ePayReqType === opt ? '' : opt); setEPayReqTypeOpen(false); }}
                      className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                      style={{ color: opt === ePayReqType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === ePayReqType ? 500 : 400 }}
                    >{opt}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status dropdown — populated from the active table */}
          <div className={`relative flex-shrink-0 ${filtersLock}`} ref={toolbarStatusRef}>
            <button
              type="button"
              onClick={() => setToolbarStatusOpen((o) => !o)}
              className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={toolbarStatusOpen}
            >
              <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                {toolbarStatus ?? statusDropdownLabel}
              </span>
              <svg viewBox="0 0 24 24" className={`size-[22px] text-[#1360d2] transition-transform ${toolbarStatusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {toolbarStatusOpen && (
              <div
                className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
                style={{ minWidth: 220, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                role="listbox"
              >
                <button
                  onClick={() => { setToolbarStatus(null); setToolbarStatusOpen(false); }}
                  className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                  style={{ color: toolbarStatus === null ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: toolbarStatus === null ? 500 : 400 }}
                >
                  All Statuses
                </button>
                {TOOLBAR_STATUS_OPTIONS[activeMenu].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setToolbarStatus(opt); setToolbarStatusOpen(false); }}
                    className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                    style={{ color: opt === toolbarStatus ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === toolbarStatus ? 500 : 400 }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right-side group: pushes to end */}
          <div className="contents md:flex md:items-center md:gap-[12px] md:ml-auto md:flex-wrap">
            {/* Need Help */}
            <button className="flex items-center gap-[4px] h-[48px] px-[2px] flex-shrink-0">
              <span className="text-[16px] text-[#2950e5] font-medium" style={{ fontFamily: "'Dubai', sans-serif" }}>Need Help</span>
              <svg viewBox="0 0 24 24" className="size-[20px] text-[#2950e5]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
              </svg>
            </button>

            {/* CT Release / Receipt button — Cargo Transfer only (not on epay sub-tab) */}
            {activeMenu === 'Cargo Transfer' && activeTab !== 'epay' && (
              <button
                onClick={() => setCargoStep('receiptRelease')}
                data-secondary-btn className="h-[48px] px-[22px] rounded-[4px] text-[16px] flex-shrink-0 border border-[#1360d2] text-[#1360d2] bg-white transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
              >
                Cargo Release/Receipt
              </button>
            )}

            {/* Declaration Status Expiry — secondary button, Refund & Claims only, before Raise New Claim */}
            {activeMenu === 'Refund & Claims' && (
              <button
                onClick={() => setClaimStep('declStatusExpiry')}
                data-secondary-btn className="h-[48px] px-[22px] rounded-[4px] text-[16px] flex-shrink-0 border border-[#1360d2] text-[#1360d2] bg-white transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
              >
                Declaration Status Expiry
              </button>
            )}

            {/* Start Journey / Create New Request / Accept — hidden on ePayments views */}
            {activeMenu !== 'E-Payment' && activeTab !== 'epay' && (() => {
              const isAck = activeMenu === 'Acknowledgement';
              const ackDisabled = isAck && ackSelected.size === 0;
              return (
                <button
                  disabled={ackDisabled}
                  onClick={() => {
                    if (activeMenu === 'Declaration') setClearanceJourneyOpen(true);
                    if (activeMenu === 'VCC') setVccStep('create');
                    if (activeMenu === 'Cargo Transfer') { setCargoFlowMode('create'); setCargoStep('pre'); }
                    if (activeMenu === 'Refund & Claims') { setRejectedPrefillDeclNos([]); setClaimStep('claimTypeEntry'); }
                    if (activeMenu === 'Claim Time Validity Extension') setClaimStep('validityExtEligible');
                    if (activeMenu === 'Acknowledgement' && ackSelected.size > 0) setAckAcceptOpen(true);
                  }}
                  className="h-[48px] px-[22px] rounded-[4px] text-[16px] text-white flex-shrink-0 transition-colors"
                  style={{
                    background: ackDisabled ? '#a7c3eb' : '#1360d2',
                    cursor: ackDisabled ? 'not-allowed' : 'pointer',
                    fontFamily: "'Dubai', sans-serif",
                    fontWeight: 500,
                    boxShadow: ackDisabled ? 'none' : '0px 0px 8px 0px rgba(28,72,191,0.16)',
                  }}
                >
                  {activeMenu === 'VCC' || activeMenu === 'Cargo Transfer'
                    ? 'Create New Request'
                    : activeMenu === 'Claim Time Validity Extension'
                    ? 'Create New Extension Request'
                    : activeMenu === 'Refund & Claims'
                    ? 'Raise New Claim'
                    : activeMenu === 'Acknowledgement'
                    ? 'Accept'
                    : 'Start Journey'}
                </button>
              );
            })()}
          </div>
        </div>

        {/* Mobile search panel — opens below the toolbar, same treatment as Advanced Filters */}
        {mobileSearchOpen && (
          <div
            className="md:hidden bg-white rounded-[8px] mb-[12px] p-[20px]"
            style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)', fontFamily: "'Dubai', sans-serif" }}
          >
            <div className="flex items-center justify-between mb-[16px]">
              <span className="text-[16px] font-semibold text-[#0e1b3d]">Search</span>
              <button
                type="button"
                onClick={() => { setMobileSearchOpen(false); setMobileTypeOpen(false); }}
                aria-label="Close search"
                className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
              >
                <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 2l14 14M16 2L2 16" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-[12px]">
              {/* Which field to search — same options as the desktop bar */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileTypeOpen(o => !o)}
                  className="w-full h-[48px] flex items-center justify-between gap-[12px] rounded-[4px] border border-[#d5ddfb] bg-white px-[14px]"
                  aria-haspopup="listbox"
                  aria-expanded={mobileTypeOpen}
                >
                  <span className="text-[16px] text-[#1360d2] font-medium truncate">{searchType}</span>
                  <svg viewBox="0 0 24 24" className={`size-[20px] text-[#1360d2] flex-shrink-0 transition-transform ${mobileTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {mobileTypeOpen && (
                  <div
                    role="listbox"
                    className="absolute left-0 right-0 top-[52px] z-[20] bg-white rounded-[8px] py-[4px] overflow-hidden"
                    style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                  >
                    {searchTypeOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setSearchType(opt); setSearchValue(''); setSearchQuery(''); setMobileTypeOpen(false); }}
                        className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                        style={{ color: opt === searchType ? '#1360d2' : '#0e1b3d', fontWeight: opt === searchType ? 500 : 400 }}
                      >{opt}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white pl-[14px] pr-[5px] gap-[10px]">
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => { setSearchValue(e.target.value); if (searchQuery && e.target.value.trim() === '') setSearchQuery(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch(); setMobileSearchOpen(false); } }}
                  placeholder={searchType.toLowerCase()}
                  className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] placeholder:text-[#8f94ae] bg-transparent focus:outline-none"
                />
                {searchValue !== '' && (
                  <button
                    type="button"
                    onClick={() => { setSearchValue(''); setSearchQuery(''); }}
                    aria-label="Clear search"
                    className="flex-shrink-0 size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff]"
                  >
                    <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l10 10M15 5l-10 10" /></svg>
                  </button>
                )}
                <button type="button" onClick={() => { submitSearch(); setMobileSearchOpen(false); }} aria-label="Search" className="flex-shrink-0 inline-flex items-center justify-center rounded-[6px] transition-opacity hover:opacity-90" style={{ width: 38, height: 38, background: '#1360d2' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#ffffff" /></svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() => { submitSearch(); setMobileSearchOpen(false); }}
                disabled={searchValue.trim() === ''}
                className="h-[48px] w-full rounded-[4px] text-[16px] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#1360d2', fontWeight: 500 }}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {claimantPicker && (
          <ClaimantCodePickerModal
            open
            variant={claimantPicker}
            onClose={() => setClaimantPicker(null)}
            onSelect={(code, name) => setFilterValues(v => ({ ...v, rcCode: code, rcName: name }))}
          />
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div
            className="bg-white rounded-[8px] mb-[12px] p-[20px]"
            style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between mb-[20px]">
              <span
                className="text-[16px] font-semibold text-[#0e1b3d]"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Advanced Filters
              </span>
              <button
                onClick={() => setShowFilters(false)}
                className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjk3NDk4IiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMiAybDE0IDE0TTE2IDJMMiAxNiIvPjwvc3ZnPg=="
                  alt="Close"
                  className="size-[18px]"
                />
              </button>
            </div>

            {/* Filter fields — responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
              {activeMenu === 'Acknowledgement' ? (
                <>
                  {/* Declaration Type — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackDeclType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackDeclType')}
                      onBlur={() => blurField('ackDeclType')}
                    >
                      <span style={floatLabel(isFloated('ackDeclType'))}>Declaration Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackDeclType']}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Acknowledgement Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackStatus')}
                      onBlur={() => blurField('ackStatus')}
                    >
                      <span style={floatLabel(isFloated('ackStatus'))}>Acknowledgement Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackStatus']}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *Party Type — dropdown (default: Both) */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackPartyType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackPartyType')}
                      onBlur={() => blurField('ackPartyType')}
                    >
                      <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Party Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackPartyType'] || 'Both'}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *Business Code — search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['ackBusinessCode'] ?? '57316187'}
                      onChange={e => setFilterValues(v => ({ ...v, ackBusinessCode: e.target.value }))}
                      onFocus={() => focusField('ackBusinessCode')}
                      onBlur={() => blurField('ackBusinessCode')}
                      className={`h-[56px] w-full border rounded-[4px] pl-[12px] pr-[40px] text-[16px] text-[#697498] focus:outline-none transition-colors ${filterFocused['ackBusinessCode'] ? 'border-[#1360d2] bg-white' : 'border-[#d5ddfb] bg-[#f5f6f8]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Business Code</span>
                    <svg className="absolute right-[12px] top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>
                  </div>

                  {/* *Date Type — dropdown (default: Clearance Date) */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ackDateType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('ackDateType')}
                      onBlur={() => blurField('ackDateType')}
                    >
                      <span style={floatLabel(true)}><span style={{ color: '#e8212e' }}>*</span>Date Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ackDateType'] || 'Clearance Date'}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* *From Date — calendar */}
                  <DateInput
                    label="From Date"
                    required
                    value={filterValues['ackFromDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, ackFromDate: v }))}
                  />

                  {/* *To Date — calendar */}
                  <DateInput
                    label="To Date"
                    required
                    value={filterValues['ackToDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, ackToDate: v }))}
                  />
                </>
              ) : activeMenu === 'VCC' ? (
                <>
                  {/* *Request Date From — calendar (mandatory) */}
                  <DateInput
                    label="Request Date From"
                    required
                    value={filterValues['vccDateFrom'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, vccDateFrom: v }))}
                  />

                  {/* *Request Date To — calendar (mandatory) */}
                  <DateInput
                    label="Request Date To"
                    required
                    value={filterValues['vccDateTo'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, vccDateTo: v }))}
                  />

                  {/* Status dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['vccStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('vccStatus')}
                      onBlur={() => blurField('vccStatus')}
                    >
                      <span style={floatLabel(isFloated('vccStatus'))}>Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['vccStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Customer Type dropdown — broker only */}
                  {isBroker && (
                    <div className="relative">
                      <div
                        tabIndex={0}
                        className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['vccCustomerType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                        onClick={() => focusField('vccCustomerType')}
                        onBlur={() => blurField('vccCustomerType')}
                      >
                        <span style={floatLabel(isFloated('vccCustomerType'))}>Customer Type</span>
                        <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['vccCustomerType'] || ''}</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                      </div>
                    </div>
                  )}

                  {/* Customer Code text — broker only */}
                  {isBroker && (
                    <div className="relative">
                      <input
                        type="text"
                        value={filterValues['vccCustomerCode'] || ''}
                        onChange={e => setFilterValues(v => ({ ...v, vccCustomerCode: e.target.value }))}
                        onFocus={() => focusField('vccCustomerCode')}
                        onBlur={() => blurField('vccCustomerCode')}
                        className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccCustomerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                        style={{ fontFamily: "'Dubai', sans-serif" }}
                      />
                      <span style={floatLabel(isFloated('vccCustomerCode'))}>Customer Code</span>
                    </div>
                  )}

                  {/* Vehicle Brand */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleBrand'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleBrand: e.target.value }))}
                      onFocus={() => focusField('vccVehicleBrand')}
                      onBlur={() => blurField('vccVehicleBrand')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleBrand'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleBrand'))}>Vehicle Brand</span>
                  </div>

                  {/* Vehicle Model */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleModel'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleModel: e.target.value }))}
                      onFocus={() => focusField('vccVehicleModel')}
                      onBlur={() => blurField('vccVehicleModel')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleModel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleModel'))}>Vehicle Model</span>
                  </div>

                  {/* Vehicle Type */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccVehicleType'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccVehicleType: e.target.value }))}
                      onFocus={() => focusField('vccVehicleType')}
                      onBlur={() => blurField('vccVehicleType')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccVehicleType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccVehicleType'))}>Vehicle Type</span>
                  </div>

                  {/* Specification Standard Name */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccSpecStandard'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccSpecStandard: e.target.value }))}
                      onFocus={() => focusField('vccSpecStandard')}
                      onBlur={() => blurField('vccSpecStandard')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccSpecStandard'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccSpecStandard'))}>Specification Standard Name</span>
                  </div>

                  {/* Vehicle Year Build */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['vccYearBuild'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, vccYearBuild: e.target.value }))}
                      onFocus={() => focusField('vccYearBuild')}
                      onBlur={() => blurField('vccYearBuild')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['vccYearBuild'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('vccYearBuild'))}>Vehicle Year Build</span>
                  </div>
                </>
              ) : activeMenu === 'Refund & Claims' ? (
                <>
                  {/* Claim Type — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcClaimType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcClaimType')}
                      onBlur={() => blurField('rcClaimType')}
                    >
                      <span style={floatLabel(isFloated('rcClaimType'))}>Claim Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcClaimType'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Claim Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcClaimStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcClaimStatus')}
                      onBlur={() => blurField('rcClaimStatus')}
                    >
                      <span style={floatLabel(isFloated('rcClaimStatus'))}>Claim Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcClaimStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Time Interval — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcTimeInterval'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcTimeInterval')}
                      onBlur={() => blurField('rcTimeInterval')}
                    >
                      <span style={floatLabel(isFloated('rcTimeInterval'))}>Time Interval</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcTimeInterval'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Date Type — drives which date the range below applies to */}
                  <div className="relative" ref={rcReqDateRef}>
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${rcReqDateOpen || filterFocused['rcRequestedDate'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => setRcReqDateOpen(o => !o)}
                    >
                      <span style={floatLabel(true)}>Date Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                        {filterValues['rcRequestedDate'] || 'Claim Submission Date'}
                      </span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0, transform: rcReqDateOpen ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                    {rcReqDateOpen && (
                      <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {['Claim Submission Date', 'Claim Registration Date'].map(opt => {
                          const selected = (filterValues['rcRequestedDate'] || 'Claim Submission Date') === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => { setFilterValues(v => ({ ...v, rcRequestedDate: opt })); setRcReqDateOpen(false); }}
                              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                              style={{ color: selected ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: selected ? 500 : 400 }}
                            >{opt}</button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* From Date — calendar */}
                  <DateInput
                    label="From Date"
                    value={filterValues['rcFromDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, rcFromDate: v }))}
                  />

                  {/* To Date — calendar */}
                  <DateInput
                    label="To Date"
                    value={filterValues['rcToDate'] || ''}
                    onChange={v => setFilterValues(prev => ({ ...prev, rcToDate: v }))}
                  />

                  {/* Claimant Type — dropdown; picking one re-labels the Code field below */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${rcClaimantTypeOpen || filterFocused['rcClaimantType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => setRcClaimantTypeOpen(o => !o)}
                    >
                      <span style={floatLabel(isFloated('rcClaimantType') || !!claimantType)}>Claimant Type</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{claimantType}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0, transform: rcClaimantTypeOpen ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                    {rcClaimantTypeOpen && (
                      <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {['Broker', 'Personal Customer'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              // Switching claimant type invalidates any code picked for the other one.
                              setFilterValues(v => ({ ...v, rcClaimantType: opt, rcCode: '', rcName: '' }));
                              setRcClaimantTypeOpen(false);
                            }}
                            className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                            style={{ color: opt === claimantType ? '#1360d2' : '#0e1b3d', fontFamily: "'Dubai', sans-serif", fontWeight: opt === claimantType ? 500 : 400 }}
                          >{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Code — relabelled per claimant type, with a lookup once one is chosen */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['rcCode'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, rcCode: e.target.value }))}
                      onFocus={() => focusField('rcCode')}
                      onBlur={() => blurField('rcCode')}
                      className={`h-[56px] w-full border rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${claimantType ? 'pl-[12px] pr-[52px]' : 'px-[12px]'} ${filterFocused['rcCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('rcCode'))}>{rcCodeLabel}</span>
                    {claimantType && (
                      <button
                        type="button"
                        aria-label={`Search ${rcCodeLabel}`}
                        onClick={() => setClaimantPicker(claimantType === 'Broker' ? 'broker' : 'personal')}
                        className="absolute right-[5px] top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-[6px] transition-opacity hover:opacity-90"
                        style={{ width: 38, height: 38, background: '#1360d2' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#ffffff" /></svg>
                      </button>
                    )}
                  </div>

                  {/* Name — text */}
                  <div className="relative">
                    <input
                      type="text"
                      value={filterValues['rcName'] || ''}
                      onChange={e => setFilterValues(v => ({ ...v, rcName: e.target.value }))}
                      onFocus={() => focusField('rcName')}
                      onBlur={() => blurField('rcName')}
                      className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['rcName'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                      style={{ fontFamily: "'Dubai', sans-serif" }}
                    />
                    <span style={floatLabel(isFloated('rcName'))}>Name</span>
                  </div>

                  {/* Subclaim Status — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcSubclaimStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcSubclaimStatus')}
                      onBlur={() => blurField('rcSubclaimStatus')}
                    >
                      <span style={floatLabel(isFloated('rcSubclaimStatus'))}>Subclaim Status</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcSubclaimStatus'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>

                  {/* Submission Mode — dropdown */}
                  <div className="relative">
                    <div
                      tabIndex={0}
                      className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['rcSubmissionMode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                      onClick={() => focusField('rcSubmissionMode')}
                      onBlur={() => blurField('rcSubmissionMode')}
                    >
                      <span style={floatLabel(isFloated('rcSubmissionMode'))}>Submission Mode</span>
                      <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['rcSubmissionMode'] || ''}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>
                </>
              ) : activeMenu === 'Cargo Transfer' ? (
              <>

              {/* Cargo Channel (inbound) — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctCargoChannel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctCargoChannel')}
                  onBlur={() => blurField('ctCargoChannel')}
                >
                  <span style={floatLabel(isFloated('ctCargoChannel'))}>Cargo Channel (inbound)</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctCargoChannel'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Carrier Reg No.(inbound) — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctCarrierReg'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctCarrierReg: e.target.value }))}
                  onFocus={() => focusField('ctCarrierReg')}
                  onBlur={() => blurField('ctCarrierReg')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctCarrierReg'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctCarrierReg'))}>Carrier Reg No.(inbound)</span>
              </div>

              {/* Cargo Transfer Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctTransferType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctTransferType')}
                  onBlur={() => blurField('ctTransferType')}
                >
                  <span style={floatLabel(isFloated('ctTransferType'))}>Cargo Transfer Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctTransferType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Cargo Transfer Status — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['ctStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('ctStatus')}
                  onBlur={() => blurField('ctStatus')}
                >
                  <span style={floatLabel(isFloated('ctStatus'))}>Cargo Transfer Status</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['ctStatus'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Transferee (Owner) — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctTransferee'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctTransferee: e.target.value }))}
                  onFocus={() => focusField('ctTransferee')}
                  onBlur={() => blurField('ctTransferee')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctTransferee'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctTransferee'))}>Transferee (Owner)</span>
              </div>

              {/* Transferor — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctTransferor'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctTransferor: e.target.value }))}
                  onFocus={() => focusField('ctTransferor')}
                  onBlur={() => blurField('ctTransferor')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctTransferor'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctTransferor'))}>Transferor</span>
              </div>

              {/* *From Date — calendar */}
              <DateInput
                label="From Date (15 days)"
                required
                value={filterValues['ctFromDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, ctFromDate: v }))}
              />

              {/* *To Date — calendar */}
              <DateInput
                label="To Date"
                required
                value={filterValues['ctToDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, ctToDate: v }))}
              />

              {/* Broker Code — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['ctBrokerCode'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, ctBrokerCode: e.target.value }))}
                  onFocus={() => focusField('ctBrokerCode')}
                  onBlur={() => blurField('ctBrokerCode')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['ctBrokerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('ctBrokerCode'))}>Broker Code</span>
              </div>

              </>
              ) : (
              <>

              {/* Cargo Channel — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['cargoChannel'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('cargoChannel')}
                  onBlur={() => blurField('cargoChannel')}
                >
                  <span style={floatLabel(isFloated('cargoChannel'))}>Cargo Channel</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['cargoChannel'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Regime Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['regimeType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('regimeType')}
                  onBlur={() => blurField('regimeType')}
                >
                  <span style={floatLabel(isFloated('regimeType'))}>Regime Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['regimeType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Declaration Type — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['declType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('declType')}
                  onBlur={() => blurField('declType')}
                >
                  <span style={floatLabel(isFloated('declType'))}>Declaration Type</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['declType'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Permit — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['permit'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('permit')}
                  onBlur={() => blurField('permit')}
                >
                  <span style={floatLabel(isFloated('permit'))}>Permit</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['permit'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Declaration Status — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['declStatus'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('declStatus')}
                  onBlur={() => blurField('declStatus')}
                >
                  <span style={floatLabel(isFloated('declStatus'))}>Declaration Status</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['declStatus'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* *From Date — calendar */}
              <DateInput
                label="From Date (15 days)"
                required
                value={filterValues['fromDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, fromDate: v }))}
              />

              {/* *To Date — calendar */}
              <DateInput
                label="To Date"
                required
                value={filterValues['toDate'] || ''}
                onChange={v => setFilterValues(prev => ({ ...prev, toDate: v }))}
              />

              {/* Carrier Registration No. — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['carrierReg'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, carrierReg: e.target.value }))}
                  onFocus={() => focusField('carrierReg')}
                  onBlur={() => blurField('carrierReg')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['carrierReg'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('carrierReg'))}>Carrier Registration No.</span>
              </div>

              {/* Customer Type — text input */}
              <div className="relative">
                <input
                  type="text"
                  value={filterValues['customerType'] || ''}
                  onChange={e => setFilterValues(v => ({ ...v, customerType: e.target.value }))}
                  onFocus={() => focusField('customerType')}
                  onBlur={() => blurField('customerType')}
                  className={`h-[56px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none transition-colors bg-white ${filterFocused['customerType'] ? 'border-[#1360d2]' : 'border-[#d5ddfb]'}`}
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                />
                <span style={floatLabel(isFloated('customerType'))}>Customer Type</span>
              </div>

              {/* Customer Code — dropdown */}
              <div className="relative">
                <div
                  tabIndex={0}
                  className={`h-[56px] border rounded-[4px] flex items-center px-[12px] cursor-pointer transition-colors bg-white focus:outline-none ${filterFocused['customerCode'] ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
                  onClick={() => focusField('customerCode')}
                  onBlur={() => blurField('customerCode')}
                >
                  <span style={floatLabel(isFloated('customerCode'))}>Customer Code</span>
                  <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>{filterValues['customerCode'] || ''}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Importer Code / Broker Code — disabled */}
              <div className="relative">
                <div
                  className="h-[56px] border border-[#d5ddfb] rounded-[4px] flex items-center px-[12px] cursor-not-allowed"
                  style={{ background: '#e8e8e8' }}
                >
                  <span
                    style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, color: '#aaa', background: 'transparent', pointerEvents: 'none',
                      fontFamily: "'Dubai', sans-serif", whiteSpace: 'nowrap',
                    }}
                  >
                    Importer Code / Broker Code
                  </span>
                </div>
              </div>

              </>
              )}

              {/* Reset + Apply — inline in the grid, immediately after the last filter field */}
              <div className="flex items-center gap-[12px] h-[56px]">
                <button data-secondary-btn
                  onClick={resetFilters}
                  className="h-[48px] flex-1 rounded-[4px] text-[16px] font-medium transition-colors"
                  style={{ border: '1.5px solid #2950e5', color: '#2950e5', fontFamily: "'Dubai', sans-serif" }}
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="h-[48px] flex-1 rounded-[4px] text-[16px] font-medium text-white transition-colors hover:opacity-90"
                  style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif" }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applied filters — kept outside the panel so they stay visible once it is closed */}
        {appliedFilters.length > 0 && (
          <div className="flex items-center flex-wrap gap-[10px] mb-[12px]">
            {appliedFilters.map((k) => (
              <span
                key={k}
                className="inline-flex items-center h-[36px] px-[14px] rounded-[4px] text-[15px] text-[#0e1b3d] whitespace-nowrap"
                style={{ background: '#cfe0f7', fontFamily: "'Dubai', sans-serif" }}
                title={filterValues[k]}
              >
                {k === 'rcCode' ? rcCodeLabel : (FILTER_LABELS[k] ?? k)}
              </span>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-[6px] text-[16px] text-[#1360d2] font-medium hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              Reset
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" />
              </svg>
            </button>
          </div>
        )}

        {/* Tabs row + date filter + show drafts */}
        <div className="flex items-center mb-[12px] gap-[12px] flex-wrap">
          {/* Tabs — All Records | E-Payments (shown for all modules except the ePayments sidebar itself and Cargo Transfer) */}
          {activeMenu !== 'E-Payment' && activeMenu !== 'Cargo Transfer' && (
          <div className="bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] flex-shrink-0" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => { setActiveTab('all'); setEPayVccFilter(''); }}
              className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1360d2] text-white'
                  : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              All Records
            </button>
            <button
              onClick={() => { setActiveTab('epay'); setEPayVccFilter(''); }}
              className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors ${
                activeTab === 'epay'
                  ? 'bg-[#1360d2] text-white'
                  : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
              }`}
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              E-Payment
            </button>
          </div>
          )}

          {/* Date range pill — hidden on ePayment listings unless Payment Status is Success */}
          <div className="flex justify-center basis-full lg:basis-auto lg:flex-1">
            {showDateRangeCard && (
              <StatusAsOnBadge
                disabled={filtersActive}
                label={activeMenu === 'Refund & Claims' && activeTab !== 'epay' ? 'Claim Status' : 'Status'}
                fromValue={statusFromDate} toValue={statusToDate}
                onApply={(from, to) => { setStatusFromDate(from); setStatusToDate(to); }} />
            )}
          </div>

          {/* Drafts toggle — all tabs except VCC, ePayments sidebar, and epay sub-tabs */}
          {activeMenu !== 'VCC' && activeMenu !== 'E-Payment' && activeTab !== 'epay' && (
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <span className="text-[16px] text-[#0e1b3d] font-medium whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Drafts
              </span>
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                aria-pressed={showDrafts}
                aria-label="Show drafts"
                className={`relative w-[48px] h-[28px] rounded-full transition-colors ${showDrafts ? 'bg-[#1360d2]' : 'bg-[#e2ebf9]'}`}
              >
                <div className={`absolute top-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${showDrafts ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
              </button>
            </div>
          )}

          {/* Columns button */}
          <button
            onClick={() => setShowColModal(true)}
            className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[6px] bg-white border border-[#d5ddfb] text-[#1360d2] text-[16px] font-medium flex-shrink-0"
            style={{ fontFamily: "'Dubai', sans-serif", boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.6">
              <rect x="2" y="3" width="4" height="14" rx="1" />
              <rect x="8" y="3" width="4" height="14" rx="1" />
              <rect x="14" y="3" width="4" height="14" rx="1" />
            </svg>
            Columns
          </button>
        </div>

        {/* Table swap based on active sidebar menu */}
        {activeMenu === 'E-Payment' ? (
          <EPaymentsTable
            searchDeclNo={searchType === 'Declaration Number' ? searchQuery : undefined}
            searchReqNo={searchType === 'Request Number' ? searchQuery : undefined}
            searchReqType={searchType === 'Request Number' ? ePayReqType : undefined}
            externalStatus={toolbarStatus}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
          />
        ) : activeTab === 'epay' ? (
          <EPaymentsTable filterReqNo={ePayVccFilter || undefined} module={activeMenu} externalStatus={toolbarStatus} showColModal={showColModal} onCloseColModal={() => setShowColModal(false)} />
        ) : activeMenu === 'VCC' ? (
          (searchType === 'VCC Number' || searchType === 'Chasis Number') && searchQuery !== '' ? (
            <VccVehicleSearchTable
              searchTerm={searchQuery}
              searchType={searchType as 'VCC Number' | 'Chasis Number'}
              onViewRequest={() => setVccStep('viewRequest')}
            />
          ) : (
            <VccTable
              onView={(status) => { setSelectedVccStatus(status || ''); setVccStep('viewRequest'); }}
              onAmend={() => setVccStep('amend')}
              onAudit={() => setVccStep('auditHistory')}
              onVccCountOpen={(row) => setVccListPopupRow(row)}
              onDeclarationOpen={(declNo) => { setVccDeclNo(declNo); setVccStep('declarationView'); }}
              externalStatus={toolbarStatus}
              onMakePayment={(reqNo) => { setActiveMenu('Declaration'); setActiveTab('epay'); setEPayVccFilter(reqNo); }}
              onChangePaymentMode={() => setVccStep('ePaymentProcessing')}
              onUpdatePaymentMode={() => setVccStep('updatePaymentMode')}
              onCheckEPaymentStatus={() => setRecheckModalOpen(true)}
              onRetry={(reqNo) => { setVccRetryReqNo(reqNo); setVccStep('retryPayment'); }}
              onMakePaymentReview={(reqNo) => { setVccRetryReqNo(reqNo); setVccStep('retryPayment'); }}
              onRecheckStatus={() => setRecheckModalOpen(true)}
              showColModal={showColModal}
              onCloseColModal={() => setShowColModal(false)}
            />
          )
        ) : activeMenu === 'Cargo Transfer' ? (
          <CargoTransferTable
            showDrafts={showDrafts}
            onViewRequest={() => setCargoStep('viewRequest')}
            onCancel={() => setCargoStep('cancel')}
            onCargoHistory={() => setCargoStep('cargoHistory')}
            onSuspensionHistory={() => { setSuspensionHistoryFrom('list'); setCargoStep('suspensionHistory'); }}
            onSuspensionResponse={() => setCargoStep('suspensionResponse')}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
            onAmend={() => {
              setCargoPreValues({ transferType: 'From CTO to CH - Same Location', cargoChannel: 'Sea', clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543' });
              setCargoFormValues({ clientRef: 'CT-2024-00112', carrierReg: 'AE-9876543', mawb: 'AWB-987654321', transferorBizCode: 'AE-1019056', transferorPremCode: 'PRE-001', transfereeBizCode: 'AE-1019057', transfereePremCode: 'PRE-002' });
              setCargoFlowMode('amend');
              setCargoTransferNumber('601001745352');
              setStepperReturnStep(0);
              setCargoStep('create');
            }}
          />
        ) : activeMenu === 'Refund & Claims' ? (
          <ClaimsTable
            showDrafts={showDrafts}
            onView={(row) => { setListClaimType(row.claimType); setViewClaimRow(row); setClaimStep('claimListView'); }}
            onAmend={(ct) => {
              if (ct === 'Refund of Deposits') {
                // RD amend reuses the RD new-claim steps with editable pre-filled fields,
                // starting on a Declaration Details review step (not the full search UI).
                setClaimSelectedRows(RD_AMEND_ROWS);
                setRdAmendMode(true);
                setClaimStep('amendDeclDetails');
              } else if (ct === 'Refund on Auction Proceed') {
                // Auction amend reuses the auction new-claim steps with editable pre-filled
                // fields, starting on an Auction Lot Details review step (not the full search UI).
                setAuctionSelectedLots(AUCTION_AMEND_LOTS);
                setAuctionClaimDetails(AUCTION_AMEND_CLAIM_DETAILS);
                setAuctionUploadedDocs(AUCTION_AMEND_DOCS);
                setAuctionAmendMode(true);
                setClaimStep('amendAuctionLots');
              } else {
                setRdAmendMode(false);
                setClaimStep('amendClaim');
              }
            }}
            onCancel={(ct) => { setListClaimType(ct); setClaimStep('cancelClaim'); }}
            onViewDocs={() => setClaimStep('claimDocs')}
            onSuspensionResponse={(row) => {
              setSuspensionRow(row);
              // A Declaration Number search already narrows the row to one specific declaration —
              // skip the multi-declaration list and go straight to the response form for it.
              const declSearchActive = searchType === 'Declaration Number' && searchQuery.trim() !== '';
              if (declSearchActive) {
                setSuspensionDeclNo(searchQuery.trim());
                setClaimStep('claimSuspension');
              } else {
                setSuspensionDeclNo('');
                setClaimStep(row.declarations.length > 1 ? 'claimSuspensionList' : 'claimSuspension');
              }
            }}
            onPrint={(row) => { setAckClaimType(row?.claimType ?? 'Non Remittance Claim'); setAckReturnStep('list'); setClaimStep('nonRemittanceAck'); }}
            onHistory={() => setClaimStep('claimHistory')}
            onDeclarationOpen={(declNo) => { setClaimListDeclNo(declNo); setClaimListDeclViewOpen(true); }}
            onViewRequest={(row) => setViewRequestRow(row)}
            onCreateFromRejected={(row) => { setRejectedClaimRow(row); setClaimStep('createClaimFromRejectedList'); }}
            onMakePayment={(row) => { setActiveMenu('Declaration'); setActiveTab('epay'); setEPayVccFilter(row.reqNo); }}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
            searchDeclNo={searchType === 'Declaration Number' ? searchQuery : undefined}
            searchReqNo={searchType === 'Request Number' ? searchQuery : undefined}
          />
        ) : activeMenu === 'Claim Time Validity Extension' ? (
          <ClaimsTable
            showDrafts={showDrafts}
            requestsOnly
            onViewRequest={(row) => setViewRequestRow(row)}
            onSuspensionResponse={(row) => {
              setSuspensionRow(row);
              setSuspensionDeclNo(row.declarations[0]?.declNo ?? '');
              setClaimStep('claimSuspension');
            }}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
            searchReqNo={searchType === 'Request Number' ? searchQuery : undefined}
          />
        ) : activeMenu === 'Acknowledgement' ? (
          <AcknowledgementTable
            selected={ackSelected}
            onSelectedChange={setAckSelected}
            onDecline={(rowIndex) => { setAckDeclineRowIndex(rowIndex); setAckDeclineReasonOpen(true); }}
            showColModal={showColModal}
            onCloseColModal={() => setShowColModal(false)}
          />
        ) : (
          <div className="pb-[20px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={declAtScrollStart} atEnd={declAtScrollEnd} onLeft={declScrollToStart} onRight={declScrollToEnd} stickyWidth={226} />
            <div ref={declScrollRef} onScroll={declHandleScroll} className="overflow-x-auto">
            <table
              style={{
                minWidth: declTableMinWidth,
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
                fontFamily: "'Dubai', sans-serif",
              }}
              className="w-full"
            >
              {/* ── HEADER ── */}
              <thead>
                <tr>
                  {DECL_COLUMNS.filter(col => declVisibleCols.includes(col.label)).map((col, idx) => (
                    <th
                      key={col.label}
                      style={{ width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 8 }}
                    >
                      <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                    </th>
                  ))}
                  {/* STICKY: Declaration Status */}
                  <th style={{
                    position: 'sticky', right: 76, width: 150, minWidth: 150,
                    background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
                    boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
                  }}>
                    <StatusFilterHeader
                      label={showDrafts ? 'Status' : 'Declaration Status'}
                      options={Object.keys(STATUS_STYLE).filter((k) => (k === 'Draft') === showDrafts)}
                      value={declStatusFilter}
                      onChange={(v) => setDeclStatusFilter(v as DeclStatus | null)}
                      colorMap={DECL_STATUS_COLOR}
                    />
                  </th>
                  {/* STICKY: Actions */}
                  <th style={{
                    position: 'sticky', right: 0, width: 76, minWidth: 76,
                    background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2,
                    borderRadius: '0 8px 0 0',
                  }}>
                    <span className="text-[16px] text-[#051937]">Actions</span>
                  </th>
                </tr>
              </thead>

              {/* ── BODY ── */}
              <tbody>
                {declRows.map((decl, i) => {
                  const st = STATUS_STYLE[decl.status];
                  /* The leading visible column carries the row's left inset, whichever
                     column that happens to be once Drafts/column config change the set. */
                  const cell = (label: string, content: React.ReactNode, extra?: React.CSSProperties) => (
                    declVisibleCols.includes(label) ? (
                      <td key={label} style={{
                        background: '#fff', height: 46, verticalAlign: 'middle',
                        width: DECL_COLUMNS.find(c => c.label === label)?.w,
                        padding: label === declFirstCol ? '0 8px 0 16px' : '0 8px',
                        ...(extra || {}),
                      }}>{content}</td>
                    ) : null
                  );
                  const txt = (v: string) => (
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>
                  );
                  return (
                    <tr key={i}>
                      {/* Rendered in DECL_COLUMNS order so header and body never drift apart. */}
                      {DECL_COLUMNS.map(({ label }) => {
                        switch (label) {
                          case 'Declaration No.': return cell(label, (
                            <div className="flex items-center gap-[6px]">
                              <div className="flex items-center gap-[3px] flex-shrink-0">
                                {(decl.badge === 'both' || decl.badge === 'wlp') && (
                                  <img src={wlpLogoSrc} alt="WLP" style={{ height: 9 }} />
                                )}
                                {(decl.badge === 'both' || decl.badge === 'aeo') && (
                                  <img src={aeoLogoSrc} alt="AEO" style={{ height: 8 }} />
                                )}
                              </div>
                              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{decl.no}</span>
                            </div>
                          ));
                          case 'Permit': return cell(label, decl.permit
                            ? <span className="text-[16px] text-[#1360d2] cursor-pointer hover:underline">Yes</span>
                            : <span className="text-[16px] text-[#0e1b3d]">No</span>);
                          case 'Declaration Type':  return cell(label, txt(decl.type));
                          case 'Submitted Date':    return cell(label, txt(decl.date));
                          case 'Declaration owner': return cell(label, txt(decl.owner));
                          case 'Cargo Channel':     return cell(label, txt(decl.channel));
                          case 'Request No.':       return cell(label, txt(decl.reqNo));
                          case 'Request Type':      return cell(label, txt(decl.reqType));
                          case 'Client Ref. No.':   return cell(label, txt(decl.clientRef));
                          case 'Carrier Reg No.':   return cell(label, txt(decl.carrierReg));
                          case 'MAWB/MBOL':         return cell(label, txt(decl.mawb));
                          case 'HAWB/HBOL':         return cell(label, txt(decl.hawb));
                          case 'DO No.':            return cell(label, txt(decl.doNo));
                          case 'Broker':            return cell(label, txt(decl.broker));
                          case 'Created by':        return cell(label, txt(decl.createdBy));
                          case 'Status Date':       return cell(label, txt(decl.statusDate));
                          default: return null;
                        }
                      })}

                      {/* STICKY: Declaration Status */}
                      <td style={{
                        position: 'sticky', right: 76, background: '#fff',
                        padding: '0 8px', height: 46, verticalAlign: 'middle', width: 150,
                        boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                        zIndex: openFlyout === i ? 49 : 1,
                      }}>
                        <div className="flex items-center gap-[6px]">
                          <span
                            className="text-[16px] whitespace-nowrap inline-flex items-center justify-center"
                            style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500 }}
                          >
                            {decl.status}
                          </span>
                          {decl.showInfo && (
                            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6">
                              <circle cx="10" cy="10" r="8" />
                              <path d="M10 9v5M10 7h.01" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* STICKY: Actions */}
                      <td style={{
                        position: 'sticky', right: 0, background: '#fff',
                        padding: '0 8px', height: 46, verticalAlign: 'middle', width: 76,
                        zIndex: openFlyout === i ? 50 : 1,
                      }}>
                        <div className="flex items-center gap-[6px]" ref={openFlyout === i ? flyoutRef : undefined}>
                          {/* Three dots button */}
                          <div className="relative">
                            <button
                              className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                              onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                            >
                              <MoreIcon />
                            </button>

                            {/* Flyout menu */}
                            {openFlyout === i && (
                              <div
                                className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                                style={{
                                  right: '100%',
                                  top: 0,
                                  marginRight: 6,
                                  width: 210,
                                  boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
                                  border: '1px solid #f0f0f5',
                                }}
                              >
                                {(showDrafts ? DRAFT_FLYOUT_ITEMS : FLYOUT_ITEMS).map((item) => (
                                  <button
                                    key={item.label}
                                    className="flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left group hover:bg-[#1360d2] transition-colors"
                                    onClick={() => {
                                      setOpenFlyout(null);
                                      if (item.label === 'Apply for Permit') setPermitCreateOpen(true);
                                      if (item.label === 'Amend') { setAmendDeclNo(decl.no); setClearanceJourneyOpen(true); }
                                      if (item.label === 'Cancel' || item.label === 'Declaration History'
                                        || item.label === "Declarant's Suspension Response" || item.label === 'Suspension History'
                                        || item.label === 'View Declaration') {
                                        setDeclActionNo(decl.no);
                                        setDeclActionFrom('list');
                                        setDeclAction(
                                          item.label === 'Cancel' ? 'cancel'
                                          : item.label === 'Declaration History' ? 'history'
                                          : item.label === 'Suspension History' ? 'suspensionHistory'
                                          : item.label === 'View Declaration' ? 'viewDeclaration'
                                          : 'declarantResponse',
                                        );
                                      }
                                    }}
                                  >
                                    <img src={item.icon} alt="" className="size-[20px] object-contain flex-shrink-0 group-hover:brightness-0 group-hover:invert" />
                                    <span
                                      className="text-[16px] text-[#111838] leading-[20px] group-hover:text-white"
                                      style={{ fontFamily: "'Dubai', sans-serif" }}
                                    >
                                      {item.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <button className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
        </div>
      </div>
        </div>{/* end right content column */}
      </div>{/* end body row */}

      {/* Apply for Permit — opens the permit assistant chatbot at the consignment-type question */}
      {permitCreateOpen && (
        <PermitsCreatePage
          initialStep="cargo"
          prefill={permitPrefill}
          onClose={() => { setPermitCreateOpen(false); setPermitPrefill(undefined); setPermitFromJourney(false); }}
          onOpenService={(svc) => {
            setPermitCreateOpen(false); setPermitPrefill(undefined);
            if (svc.includes('SIRA')) { setPermitFromJourney(false); setSiraFlowOpen(true); }
            else if (svc.startsWith('DCAA')) { setPermitFromJourney(false); setDcaaFlow({ variant: svc.includes('Suspicious') ? 'suspicious' : 'dangerous', title: svc }); }
            else if (permitFromJourney) { setPermitFromJourney(false); setCompleteJourneyStart('permits'); setCompleteJourneyOpen(true); }
            else if (PERMIT_SERVICE_CONFIGS[svc]) setPermitServiceKey(svc);
          }}
        />
      )}

      {/* Permit service listing → form → proceed → success flow */}
      {permitServiceKey && PERMIT_SERVICE_CONFIGS[permitServiceKey] && (
        <PermitServiceFlow
          config={PERMIT_SERVICE_CONFIGS[permitServiceKey]}
          onClose={() => setPermitServiceKey(null)}
          onBackToPermits={() => setPermitServiceKey(null)}
        />
      )}

      {/* Start Journey — Integrated Clearance journey (start → carrier → invoice → line items) */}
      {clearanceJourneyOpen && (
        <ClearanceJourneyPage
          key={amendDeclNo ?? 'create'}
          onClose={() => { setClearanceJourneyOpen(false); setAmendDeclNo(null); }}
          amendDeclarationNo={amendDeclNo ?? undefined}
          defaults={journeyDefaults}
          onApplyPermits={() => { setPermitPrefill({ activity: journeyExport ? 'Export' : 'Import', mode: journeyExport ? 'Air' : 'Sea', cargo: journeyExport ? 'Dangerous Goods & Firearms' : 'Food & Hazardous Goods Consignment' }); setPermitFromJourney(true); setPermitCreateOpen(true); }}
        />
      )}

      {/* SIRA — Hazardous Goods Import NOC flow → continues to customs declaration */}
      {siraFlowOpen && (
        <SiraFlowPage
          onClose={() => setSiraFlowOpen(false)}
          onProceedToDeclaration={() => { setSiraFlowOpen(false); setCompleteJourneyStart('declInfo'); setCompleteJourneyOpen(true); }}
        />
      )}

      {/* DCAA — Dangerous Goods NOC / Inspect Suspicious Goods → continues to customs declaration */}
      {dcaaFlow && (
        <DcaaFlowPage
          variant={dcaaFlow.variant}
          title={dcaaFlow.title}
          onClose={() => setDcaaFlow(null)}
          onProceedToDeclaration={() => { setDcaaFlow(null); setCompleteJourneyStart('declInfo'); setCompleteJourneyOpen(true); }}
        />
      )}

      {/* Complete journey — Permits → Declaration → Payments → Cargo Waves */}
      {completeJourneyOpen && (
        <CompleteJourneyPage
          initialStep={completeJourneyStart}
          exportFinal={!!journeyExport}
          onClose={() => setCompleteJourneyOpen(false)}
          onBackToHome={() => { setCompleteJourneyOpen(false); setClearanceJourneyOpen(false); onClose(); }}
        />
      )}

      {/* Acknowledgement Accept confirm */}
      <AckAcceptConfirmModal
        open={ackAcceptOpen}
        count={ackSelected.size}
        onClose={() => setAckAcceptOpen(false)}
        onConfirm={() => { setAckAcceptOpen(false); setAckStep('acceptSuccess'); }}
      />

      {/* Acknowledgement Decline reason */}
      <AckDeclineReasonModal
        open={ackDeclineReasonOpen}
        onClose={() => setAckDeclineReasonOpen(false)}
        onDecline={() => { setAckDeclineReasonOpen(false); setAckDeclineConfirmOpen(true); }}
      />

      {/* Acknowledgement Decline confirm */}
      <AckDeclineConfirmModal
        open={ackDeclineConfirmOpen}
        onClose={() => setAckDeclineConfirmOpen(false)}
        onConfirm={() => { setAckDeclineConfirmOpen(false); setAckStep('declineSuccess'); }}
      />

      <VccRecheckSuccessModal open={recheckModalOpen} onClose={() => setRecheckModalOpen(false)} />
      {vccListPopupRow && (
        <VccListPopup row={vccListPopupRow} onClose={() => setVccListPopupRow(null)} />
      )}
      {showColModal && activeMenu === 'Declaration' && (
        <ManageColumnsModal
          columns={DECL_COL_DEFS}
          visible={declVisibleCols}
          lockedColumns={DECL_LOCKED_COLS}
          onSave={setDeclVisibleCols}
          onClose={() => setShowColModal(false)}
        />
      )}
    </div>
  );
}
