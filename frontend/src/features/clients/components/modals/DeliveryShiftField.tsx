import { Field } from '@ui/Field';
import { Icon } from '@ui/Icon';
import { DeliveryShiftPicker } from '@/features/clients/components/DeliveryShiftPicker';
import {
  DELIVERY_SHIFT_LABELS,
  type DeliveryShift,
} from '@/features/clients/constants/clientOptions';
import type { GroupMember } from '@/features/clients/types';

interface Props {
  shift: DeliveryShift;
  savedShift: DeliveryShift | null;
  groupMembers: GroupMember[];
  onChange: (shift: DeliveryShift) => void;
}

// "Ana", "Ana y Luis", "Ana, Luis y Rosa".
const listNames = (members: GroupMember[]) => {
  const names = members.map((m) => m.name);
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
};

// A group is one stop, so the backend moves every member to the new shift. Saying so before the
// save keeps that from looking like a side effect.
export function DeliveryShiftField({ shift, savedShift, groupMembers, onChange }: Props) {
  const movesGroup = groupMembers.length > 0 && shift !== savedShift;
  const names = listNames(groupMembers);

  return (
    <div className="flex flex-col gap-3">
      <Field label="Turno de entrega" htmlFor="em-deliveryShift" required variant="plain">
        <DeliveryShiftPicker value={shift} onChange={onChange} />
      </Field>
      {movesGroup && (
        <div
          role="note"
          className="flex gap-3 items-start bg-delivery-2-card-bg border border-delivery-2-card-border rounded-[10px] px-[14px] py-3"
        >
          <Icon name="users" size={17} className="text-delivery-2-chip-text shrink-0 mt-px" />
          <p className="text-[12.5px] leading-[1.5] text-ink">
            <span className="font-semibold">Entrega conjunta con {names}.</span> El turno es el
            mismo para todo el grupo: al guardar, {names}{' '}
            {groupMembers.length === 1 ? 'también pasa' : 'también pasan'} a{' '}
            <span className="font-semibold">{DELIVERY_SHIFT_LABELS[shift]}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
