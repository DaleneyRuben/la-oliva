import { Router } from 'express';
import productionController from '../controllers/production.controller';
import { requireRole } from '../middleware/auth';
import { ROLES } from '../constants/roles.constants';

const router = Router();

router.get('/', productionController.getOverview);

// Stacked on top of the router-level guard (which also admits kitchen):
// kitchen cannot navigate weeks or inspect active-client lists.
router.get(
  '/weekly-counts',
  requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.AUDIT),
  productionController.getWeeklyCounts,
);
router.get(
  '/day-clients',
  requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.AUDIT),
  productionController.getDayClients,
);

export default router;
