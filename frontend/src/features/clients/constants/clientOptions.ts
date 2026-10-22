export const ZONES = ['Centro', 'Sur'] as const;
export const DELIVERIES = ['La Oliva', 'Otro'] as const;
// Only La Oliva delivers in shifts; `Otro` clients have none.
export const SHIFT_DELIVERY = 'La Oliva';

export type DeliveryShift = 'day' | 'night';

export const DELIVERY_SHIFT_OPTIONS = [
  { value: 'day', label: 'Día', icon: 'sun', hint: 'En la mañana del día de la comida' },
  { value: 'night', label: 'Noche', icon: 'moon', hint: 'La noche anterior, de domingo a jueves' },
] as const satisfies readonly { value: DeliveryShift; label: string; icon: string; hint: string }[];

export const DELIVERY_SHIFT_LABELS: Record<DeliveryShift, string> = { day: 'Día', night: 'Noche' };

export const SEX_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
] as const;

export const SEX_LABELS: Record<string, string> = Object.fromEntries(
  SEX_OPTIONS.map((o) => [o.value, o.label]),
);
