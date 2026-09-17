import { z } from 'zod';
import { getDay, parseISO } from 'date-fns';
import { SEX_OPTIONS, ZONES } from '../constants/client.constants';
import { appToday, isIsoDate } from '../utils/date';

const dateField = z.string().refine(isIsoDate, 'must be YYYY-MM-DD');
const healthList = z.array(z.string().trim().min(1).max(200)).max(50).default([]);

const isWeekday = (date: string): boolean => {
  const day = getDay(parseISO(`${date}T12:00:00`));
  return day >= 1 && day <= 5;
};

export const publicClientIntakeSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    sex: z.enum(SEX_OPTIONS),
    dateOfBirth: dateField.refine(
      (date) => date <= appToday(),
      'date of birth cannot be in the future',
    ),
    phoneNumber: z.string().trim().min(1).max(50),
    address: z.string().trim().min(1).max(1000),
    deliveryZone: z.enum(ZONES),
    preferredStartDate: dateField
      .refine((date) => date > appToday(), 'preferred start date must be after today')
      .refine(isWeekday, 'preferred start date must be a weekday'),
    weight: z.coerce.number().positive(),
    height: z.coerce.number().positive(),
    restrictions: healthList,
    underlyingDiseases: healthList,
    otherUnderlyingDisease: z.string().trim().max(200).optional(),
    operations: healthList,
    medications: healthList,
    website: z.literal('').default(''),
  })
  .superRefine((data, context) => {
    if (data.underlyingDiseases.includes('Other') && !data.otherUnderlyingDisease) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['otherUnderlyingDisease'],
        message: 'other underlying disease is required',
      });
    }
  });

export type PublicClientIntakeDto = z.infer<typeof publicClientIntakeSchema>;
