import { Router } from 'express';
import menuController from '../controllers/menu.controller';
import validate from '../middleware/validate';
import { upsertMenuWeekSchema } from '../schemas/menu.schema';

const router = Router();

router.get('/', menuController.getAll);
router.put('/week', validate(upsertMenuWeekSchema), menuController.saveWeek);
router.get('/:date', menuController.getByDate);

export default router;
