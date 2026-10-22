export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  deliveryZone: string;
  address: string;
  isNew: boolean;
  delivery?: 'Otro';
}

export interface DeliveryGroup {
  groupToken: string;
  members: DeliveryPerson[];
}

export interface DeliveryZone {
  zone: string;
  deliveryCount: number;
  groups: DeliveryGroup[];
  singles: DeliveryPerson[];
}

export type DeliveryShiftRun = 'day' | 'night';

// One driver run: the stops for the meals of `mealDate`. A night run is driven the evening
// before, so its mealDate is the day after the route day it belongs to.
export interface DeliveryRun {
  mealDate: string;
  zones: DeliveryZone[];
}

export interface DeliveryDayRoute {
  day: DeliveryRun;
  night: DeliveryRun;
}

export type DeliveryRouteResponse = Record<string, DeliveryDayRoute>;
