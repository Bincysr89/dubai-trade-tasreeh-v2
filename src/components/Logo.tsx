import logoSrc from '../assets/dt-logo-horizontal.svg';

type Props = {
  className?: string;
  height?: number;
  white?: boolean;
};

export default function Logo({ className = '', height = 40, white = false }: Props) {
  return (
    <img
      src={logoSrc}
      alt="Dubai Trade"
      style={{ height, width: 'auto', filter: white ? 'brightness(0) invert(1)' : undefined }}
      className={className}
    />
  );
}
