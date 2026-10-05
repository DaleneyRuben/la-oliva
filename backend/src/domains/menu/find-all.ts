import { Op } from 'sequelize';
import Menu from '../../models/Menu';
import { getMenuWindow } from './_helpers';

export const findAll = (): Promise<Menu[]> => {
  const { start, end } = getMenuWindow();
  return Menu.findAll({
    where: { date: { [Op.between]: [start, end] } },
    order: [['date', 'ASC']],
  });
};
