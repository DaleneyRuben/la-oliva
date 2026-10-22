import { Button } from '@ui/Button';
import { Icon } from '@ui/Icon';
import {
  DELIVERY_SHIFT_OPTIONS,
  type DeliveryShift,
} from '@/features/clients/constants/clientOptions';

interface Props {
  value: DeliveryShift;
  onChange: (shift: DeliveryShift) => void;
}

// Night is drawn dark and day warm, the same pairing the Entregas runs use, so the choice reads
// the same way on both screens.
const SELECTED_CLS: Record<DeliveryShift, { card: string; icon: string; hint: string }> = {
  day: {
    card: 'bg-delivery-2-card-bg border-delivery-2-accent text-ink',
    icon: 'bg-delivery-2-chip-bg text-delivery-2-chip-text',
    hint: 'text-ink-2',
  },
  night: {
    card: 'bg-olive-900 border-olive-900 text-paper',
    icon: 'bg-olive-800 text-delivery-2-chip-bg',
    hint: 'text-cream-2',
  },
};

const IDLE_CLS = {
  card: 'bg-paper border-rule text-ink hover:border-olive-700',
  icon: 'bg-delivery-2-chip-bg text-delivery-2-chip-text',
  hint: 'text-ink-2',
};

export function DeliveryShiftPicker({ value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Turno de entrega" className="grid grid-cols-2 gap-[7px]">
      {DELIVERY_SHIFT_OPTIONS.map((option) => {
        const selected = value === option.value;
        const cls = selected ? SELECTED_CLS[option.value] : IDLE_CLS;
        return (
          <Button
            key={option.value}
            variant="bare"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`justify-start items-start text-left gap-[10px] px-3 py-[11px] rounded-[10px] border ${cls.card}`}
          >
            <span
              className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 ${cls.icon}`}
            >
              <Icon name={option.icon} size={14} stroke={2} />
            </span>
            <span className="flex flex-col gap-[3px]">
              <span className="text-[13px] font-semibold">{option.label}</span>
              <span className={`text-[11px] leading-[1.35] ${cls.hint}`}>{option.hint}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
