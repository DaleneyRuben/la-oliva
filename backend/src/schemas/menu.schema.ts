import { z } from 'zod';
import { parseISO } from 'date-fns';
import { checkIsWeekend } from '../utils/devFlags';

const dish = z.string().nullable().optional();

const menuDaySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
    .refine((d) => !checkIsWeekend(parseISO(d)), 'No hay entregas los fines de semana'),
  breakfast: dish,
  morningSnack: dish,
  salad: dish,
  lunch: dish,
  afternoonSnack: dish,
  dinner: dish,
  juice: dish,
});

export const upsertMenuWeekSchema = z.object({
  menus: z
    .array(menuDaySchema)
    .min(1, 'Envía al menos un día')
    .refine(
      (menus) => new Set(menus.map((m) => m.date)).size === menus.length,
      'Cada día solo puede enviarse una vez',
    ),
});

export type MenuDayDto = z.infer<typeof menuDaySchema>;
