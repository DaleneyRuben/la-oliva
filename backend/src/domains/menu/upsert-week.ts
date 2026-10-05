import { Op, Transaction } from 'sequelize';
import { withTransaction } from '../../database/with-transaction';
import Menu from '../../models/Menu';
import { MenuDayDto } from '../../schemas/menu.schema';
import { appToday } from '../../utils/date';
import { badRequestError } from '../../utils/errors';
import { getMenuWindow } from './_helpers';

type MenuFields = Omit<MenuDayDto, 'date'>;

// A blank dish means the manager cleared it, so it is stored as no dish at all.
const normalize = (fields: MenuFields): MenuFields =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value?.trim() ? value.trim() : null]),
  );

const assertEditable = (dates: string[]): void => {
  const today = appToday();
  const { end } = getMenuWindow();
  if (dates.some((date) => date < today)) {
    throw badRequestError('No puedes modificar el menú de un día que ya pasó.');
  }
  if (dates.some((date) => date > end)) {
    throw badRequestError('Solo puedes cargar el menú de esta semana o de la próxima.');
  }
};

const saveDay = async (
  { date, ...fields }: MenuDayDto,
  transaction: Transaction,
): Promise<Menu> => {
  const data = normalize(fields);
  const existing = await Menu.findOne({ where: { date }, transaction });
  if (existing) return existing.update(data, { transaction });
  return Menu.create({ date, ...data } as never, { transaction });
};

export const upsertWeek = async (
  menus: MenuDayDto[],
  transaction?: Transaction,
): Promise<Menu[]> => {
  assertEditable(menus.map((menu) => menu.date));

  return withTransaction(transaction, async (t) => {
    // chained, not Promise.all: one transaction connection serves one query at a time
    const saved = await menus.reduce<Promise<Menu[]>>(
      async (previous, menu) => [...(await previous), await saveDay(menu, t)],
      Promise.resolve([]),
    );
    const { start, end } = getMenuWindow();
    await Menu.destroy({ where: { date: { [Op.notBetween]: [start, end] } }, transaction: t });
    return saved;
  });
};
