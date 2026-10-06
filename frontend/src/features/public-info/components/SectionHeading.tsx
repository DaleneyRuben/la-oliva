import type { ReactNode } from 'react';

type HeadingSize = 'lg' | 'md';

interface Props {
  children: ReactNode;
  size?: HeadingSize;
  align?: 'left' | 'center';
  className?: string;
}

const SIZE_CLS: Record<HeadingSize, string> = {
  lg: 'text-[36px] md:text-[48px]',
  md: 'text-[32px] md:text-[40px]',
};

export function SectionHeading({ children, size = 'md', align = 'left', className = '' }: Props) {
  return (
    <h2
      className={`m-0 font-public-display font-medium leading-[1.05] text-public-ink ${SIZE_CLS[size]} ${
        align === 'center' ? 'text-center' : ''
      } ${className}`}
    >
      {children}
    </h2>
  );
}
