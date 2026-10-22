import { Icon } from '@ui/Icon';

export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-alert">
      <span aria-hidden="true" className="flex shrink-0">
        <Icon name="alert" size={13} stroke={2} />
      </span>
      {children}
    </p>
  );
}
