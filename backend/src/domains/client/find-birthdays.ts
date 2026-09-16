import { Op, fn, literal, where } from 'sequelize';
import { format, getMonth, parseISO } from 'date-fns';
import Client from '../../models/Client';
import Subscription from '../../models/Subscription';
import { appToday, nextDeliveryDay } from '../../utils/date';
import { getPrimarySubscription } from './_helpers';
import { deriveClientStatus } from './derive-client-status';

export type BirthdayPerson = {
  id: number;
  name: string;
  dateOfBirth: string;
  isToday: boolean;
  planStatus: 'active' | 'finalized';
};

export const findBirthdays = async (): Promise<BirthdayPerson[]> => {
  const today = nextDeliveryDay(appToday());
  const statusToday = appToday();
  const todayDate = parseISO(today);
  // getMonth returns 0-based; SQL EXTRACT(MONTH) is 1-based
  const currentMonth = getMonth(todayDate) + 1;
  const todayMonthDay = format(todayDate, 'MM-dd');

  const clients = await Client.findAll({
    attributes: ['id', 'name', 'dateOfBirth'],
    where: where(fn('EXTRACT', literal('MONTH FROM "dateOfBirth"')), Op.eq, currentMonth),
    include: [
      {
        model: Subscription,
        attributes: [
          'id',
          'startDate',
          'contractEndDate',
          'suspendedDates',
          'finalizedAt',
          'pausedSince',
          'paid',
        ],
        separate: true,
        order: [['id', 'DESC']],
      },
    ],
    order: [[literal('EXTRACT(DAY FROM "dateOfBirth")'), 'ASC']],
  });

  return clients.map((c) => {
    const currentPlan = getPrimarySubscription(
      (c.subscriptions ?? []).map((subscription) => ({
        id: Number(subscription.id),
        startDate: subscription.startDate,
        contractEndDate: subscription.contractEndDate,
        suspendedDates: subscription.suspendedDates,
        finalizedAt: subscription.finalizedAt,
        pausedSince: subscription.pausedSince,
        paid: subscription.paid,
      })),
    );
    const status = deriveClientStatus(
      currentPlan
        ? {
            startDate: currentPlan.startDate ?? null,
            contractEndDate: currentPlan.contractEndDate ?? null,
            suspendedDates: currentPlan.suspendedDates ?? [],
            finalizedAt: currentPlan.finalizedAt ?? null,
            pausedSince: currentPlan.pausedSince ?? null,
          }
        : null,
      statusToday,
    );

    return {
      id: c.id,
      name: c.name,
      dateOfBirth: c.dateOfBirth,
      isToday: format(parseISO(c.dateOfBirth), 'MM-dd') === todayMonthDay,
      planStatus: status === 'ended' ? 'finalized' : 'active',
    };
  });
};
