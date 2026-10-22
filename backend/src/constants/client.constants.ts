export const CLIENT_STATUS = {
  ACTIVE: 'active',
  EXPIRING: 'expiring',
  PAUSED: 'paused',
  ENDED: 'ended',
} as const;

export const ZONES = ['Centro', 'Sur'] as const;
export const DELIVERIES = ['La Oliva', 'Otro'] as const;
export const DELIVERY_SHIFTS = ['day', 'night'] as const;
export const SEX_OPTIONS = ['male', 'female'] as const;

export type Zone = (typeof ZONES)[number];
export type Delivery = (typeof DELIVERIES)[number];
export type DeliveryShift = (typeof DELIVERY_SHIFTS)[number];
export type SexOption = (typeof SEX_OPTIONS)[number];
