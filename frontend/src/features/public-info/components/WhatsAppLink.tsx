import type { ReactNode } from 'react';
import { WHATSAPP_URL } from '@/constants/contact.constants';
import { PublicInfoIcon } from './PublicInfoIcon';

interface Props {
  children: ReactNode;
  icon?: string;
  className?: string;
}

/**
 * The slides' call-to-action pill. It is a link, not a button: every one of them opens the
 * business WhatsApp chat in a new tab.
 */
export function WhatsAppLink({ children, icon = 'whatsapp', className = '' }: Props) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-full bg-public-olive px-[26px] py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-public-cream no-underline transition hover:bg-public-ink ${className}`}
    >
      <PublicInfoIcon name={icon} size={20} stroke={1.8} />
      {children}
      <PublicInfoIcon name="chevron-right" size={16} stroke={2.2} />
    </a>
  );
}
