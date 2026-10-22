import { Icon } from '@ui/Icon';

export function FormErrorSummary({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <p role="alert" className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
      <span aria-hidden="true" className="flex shrink-0 text-alert">
        <Icon name="alert" size={14} stroke={2} />
      </span>
      Revisa {count} {count === 1 ? 'campo' : 'campos'} antes de continuar
    </p>
  );
}
