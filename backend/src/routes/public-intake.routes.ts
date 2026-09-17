import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import publicIntakeController from '../controllers/public-intake.controller';
import validate from '../middleware/validate';
import { publicClientIntakeSchema } from '../schemas/public-intake.schema';

const router = Router();

router.post(
  '/client-intakes',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }),
  validate(publicClientIntakeSchema),
  publicIntakeController.create,
);

export default router;
