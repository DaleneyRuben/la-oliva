import { parseISO } from 'date-fns';
import Client from '../../models/Client';
import type Subscription from '../../models/Subscription';
import { ROLES } from '../../constants/roles.constants';
import type { UserRole } from '../../models/User';
import { appToday, addCalendarDays } from '../../utils/date';
import { checkIsWeekend } from '../../utils/devFlags';
import { findActiveSubscriptionsForDate } from '../subscription';
import { countStops } from './_helpers';

// Display order for the Entregas page — Sur first, matching the route layout, not the
// alphabetical order used for client-facing zone dropdowns elsewhere in the app.
const ZONE_ORDER = ['Sur', 'Centro'];

export type DeliveryPerson = {
  id: number;
  name: string;
  phone: string;
  deliveryZone: string;
  address: string;
  isNew: boolean;
  delivery?: 'Otro';
};

export type DeliveryGroup = {
  groupToken: string;
  members: DeliveryPerson[];
};

export type DeliveryZoneRoute = {
  zone: string;
  deliveryCount: number;
  groups: DeliveryGroup[];
  singles: DeliveryPerson[];
};

// One driver run: the stops for the meals of `mealDate`. A night run is driven the evening
// before its meal day, so its mealDate is the day after the route day it belongs to.
export type DeliveryRun = {
  mealDate: string;
  zones: DeliveryZoneRoute[];
};

export type DeliveryDayRoute = {
  day: DeliveryRun;
  night: DeliveryRun;
};

type DeliveryClientRow = {
  id: number;
  name: string;
  phoneNumber: string;
  deliveryZone: string;
  groupToken: string | null;
  address: string;
  startDate: string | null;
  delivery: string | null;
};

const byName = (a: DeliveryPerson, b: DeliveryPerson) => a.name.localeCompare(b.name, 'es');

// A client is "new" in the run whose meal day matches their subscription's start date — i.e.
// this is their first delivery, the evening before for a night client.
const toPerson = (c: DeliveryClientRow, date: string): DeliveryPerson => ({
  id: c.id,
  name: c.name,
  phone: c.phoneNumber,
  deliveryZone: c.deliveryZone,
  address: c.address,
  isNew: c.startDate === date,
  ...(c.delivery === 'Otro' ? { delivery: 'Otro' as const } : {}),
});

const buildZones = (clients: DeliveryClientRow[], date: string): DeliveryZoneRoute[] =>
  ZONE_ORDER.map((zone) => {
    const inZone = clients.filter((c) => c.deliveryZone === zone);

    const memberCount = (token: string) => inZone.filter((c) => c.groupToken === token).length;

    // A shared token with one member left on the route is not a group: the token is only cleared
    // when membership changes, so it survives the other members' contracts lapsing. One stop either
    // way, and a group card of one reads as a rendering fault.
    const isGrouped = (c: DeliveryClientRow) =>
      Boolean(c.groupToken) && memberCount(c.groupToken!) > 1;

    const groupTokens: string[] = [];
    inZone.forEach((c) => {
      if (isGrouped(c) && !groupTokens.includes(c.groupToken!)) groupTokens.push(c.groupToken!);
    });

    const groups: DeliveryGroup[] = groupTokens.map((groupToken) => ({
      groupToken,
      members: inZone
        .filter((c) => c.groupToken === groupToken)
        .map((c) => toPerson(c, date))
        .sort(byName),
    }));

    const singles = inZone
      .filter((c) => !isGrouped(c))
      .map((c) => toPerson(c, date))
      .sort(byName);

    return {
      zone,
      deliveryCount: countStops(inZone.map((c) => c.groupToken)),
      groups,
      singles,
    };
  }).filter((z) => z.deliveryCount > 0);

const isNightClient = (c: Client) => c.delivery === 'La Oliva' && c.deliveryShift === 'night';

const toRow = (s: Subscription): DeliveryClientRow => {
  const c = s.client as Client;
  return {
    id: c.id,
    name: c.name,
    phoneNumber: c.phoneNumber,
    deliveryZone: c.deliveryZone,
    groupToken: c.groupToken,
    address: c.address,
    startDate: s.startDate,
    delivery: c.delivery,
  };
};

// Meals exist only Mon–Fri, so a run whose meal day is a weekend is empty and never queried.
const findMealDaySubscriptions = async (mealDate: string): Promise<Subscription[]> =>
  checkIsWeekend(parseISO(mealDate)) ? [] : findActiveSubscriptionsForDate(mealDate);

const buildRun = (
  mealDate: string,
  subscriptions: Subscription[],
  role: UserRole,
  shift: 'day' | 'night',
): DeliveryRun => {
  const clients = subscriptions
    .filter((s) => role !== ROLES.DELIVERY || (s.client as Client).delivery !== 'Otro')
    // Otro clients and clients with no shift recorded are delivered as La Oliva always has: by day.
    .filter((s) => isNightClient(s.client as Client) === (shift === 'night'))
    .map(toRow);

  return { mealDate, zones: buildZones(clients, mealDate) };
};

export const findRoute = async (
  role: UserRole = ROLES.ADMIN,
): Promise<Record<string, DeliveryDayRoute>> => {
  const today = appToday();
  const tomorrow = addCalendarDays(today, 1);
  const afterTomorrow = addCalendarDays(today, 2);

  // Tomorrow's day run and today's night run feed the same meals, so they share one query.
  const [todaySubs, tomorrowSubs, afterTomorrowSubs] = await Promise.all(
    [today, tomorrow, afterTomorrow].map(findMealDaySubscriptions),
  );

  return {
    [today]: {
      day: buildRun(today, todaySubs, role, 'day'),
      night: buildRun(tomorrow, tomorrowSubs, role, 'night'),
    },
    [tomorrow]: {
      day: buildRun(tomorrow, tomorrowSubs, role, 'day'),
      night: buildRun(afterTomorrow, afterTomorrowSubs, role, 'night'),
    },
  };
};
