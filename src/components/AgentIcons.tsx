import traderSrc from '../assets/icon-trader.svg';
import shippingAgentSrc from '../assets/icon-shipping-agent.svg';
import airlineAgentSrc from '../assets/icon-airline-agent.svg';
import freightForwarderSrc from '../assets/icon-freight-forwarder.svg';
import tradePlusSrc from '../assets/icon-trade-plus.svg';
import integratedClearanceSrc from '../assets/icon-integrated-clearance.svg';
import paymentsSrc from '../assets/icon-payments.svg';
import berthBookingSrc from '../assets/icon-berth-booking.svg';
import ediSrc from '../assets/icon-edi.svg';
import manifestSrc from '../assets/icon-manifest.svg';
import bookingExecutionSrc from '../assets/icon-booking-execution.svg';

type IconProps = { size?: number; className?: string };

const make = (src: string) =>
  function Icon({ size = 60, className = '' }: IconProps) {
    return <img src={src} alt="" width={size} height={size} className={className} style={{ width: size, height: size }} />;
  };

export const TraderIcon = make(traderSrc);
export const ShippingAgentIcon = make(shippingAgentSrc);
export const AirlineAgentIcon = make(airlineAgentSrc);
export const OtherAgentIcon = make(freightForwarderSrc);

export const TradePlusIcon = make(tradePlusSrc);
export const IntegratedClearanceIcon = make(integratedClearanceSrc);
export const PaymentsIcon = make(paymentsSrc);
export const BerthBookingIcon = make(berthBookingSrc);
export const EdiIcon = make(ediSrc);
export const ManifestIcon = make(manifestSrc);
export const BookingExecutionIcon = make(bookingExecutionSrc);
