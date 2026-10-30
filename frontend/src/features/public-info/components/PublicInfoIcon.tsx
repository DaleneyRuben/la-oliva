import { Icon } from '@ui/Icon';

export const PUBLIC_INFO_ICON_NAMES = [
  'whatsapp',
  'file-text',
  'tag',
  'heart',
  'scales',
  'dumbbell',
  'heartbeat',
  'mother',
  'credit-card',
  'user',
  'chat',
  'cutlery',
] as const;

type PublicInfoIconName = (typeof PUBLIC_INFO_ICON_NAMES)[number];

interface Props {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
}

function isPublicInfoIcon(name: string): name is PublicInfoIconName {
  return (PUBLIC_INFO_ICON_NAMES as readonly string[]).includes(name);
}

/**
 * Glyphs the information slides use that the shared `Icon` set does not have. Any other name
 * falls through to `Icon`, so callers can mix both sets through one component.
 */
export function PublicInfoIcon({ name, size = 24, stroke = 1.6, className }: Props) {
  if (!isPublicInfoIcon(name)) {
    return <Icon name={name} size={size} stroke={stroke} className={className} />;
  }

  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };

  switch (name) {
    case 'cutlery':
      return (
        <svg {...props}>
          <path d="M7 2v20" />
          <path d="M4 2v6a3 3 0 0 0 6 0V2" />
          <path d="M17 22V2c-2.2 1.2-3.5 3.6-3.5 7v4H17" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...props}>
          <path d="M4 20l1.3-3.8A8.5 8.5 0 1 1 8 19.2L4 20z" />
          <path d="M9.5 9.5c.3 2.3 2.2 4.2 4.5 4.5l1.2-1.2 2 1-.4 1.6c-3.8.6-8.1-3.7-7.5-7.5L10.9 7l1 2-1.4 1.2z" />
        </svg>
      );
    case 'file-text':
      return (
        <svg {...props}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...props}>
          <path d="M3 12V4h8l9 9-8 8z" />
          <circle cx="7.5" cy="8.5" r="1.3" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...props}>
          <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
        </svg>
      );
    case 'scales':
      return (
        <svg {...props}>
          <path d="M12 3v18M4 21h16" />
          <path d="M6 7h12" />
          <path d="M6 7l-3 7h6zM18 7l-3 7h6z" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg {...props}>
          <path d="M7 12h10" />
          <rect x="3" y="8" width="3" height="8" rx="1" />
          <rect x="18" y="8" width="3" height="8" rx="1" />
          <path d="M6 10h1v4H6zM17 10h1v4h-1z" />
        </svg>
      );
    case 'heartbeat':
      return (
        <svg {...props}>
          <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
          <path d="M6 12h3l1.5-3 3 6 1.5-3h3" />
        </svg>
      );
    case 'mother':
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2.5" />
          <path d="M8 21v-6a4 4 0 0 1 8 0v6" />
          <path d="M9 13c-2 1-3 3-3 5M15 13c2 1 3 3 3 5" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...props}>
          <path d="M4 5h16v11H8l-4 4z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      );
    default:
      return null;
  }
}
