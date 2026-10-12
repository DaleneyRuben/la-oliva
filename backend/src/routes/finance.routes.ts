import { Router } from 'express';
import financeController from '../controllers/finance.controller';
import { requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import {
  createCategorySchema,
  createExpenseSchema,
  updateCategorySchema,
  updateExpenseSchema,
} from '../schemas/finance.schema';
import { ROLES } from '../constants/roles.constants';

const router = Router();

const adminOnly = requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN);
const financeReadOnly = requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.AUDIT);

router.get('/', financeReadOnly, financeController.getOverview);
router.get('/categories', financeReadOnly, financeController.getCategories);

// There is no DELETE for a category: expenses already filed against one must keep naming it, so
// the only way out is archiving it through PATCH (business-rules.md → Finanzas, and
// deactivateCategory's comment).
router.post(
  '/categories',
  adminOnly,
  validate(createCategorySchema),
  financeController.createCategory,
);
router.patch(
  '/categories/:id',
  adminOnly,
  validate(updateCategorySchema),
  financeController.updateCategory,
);

// There is no POST for income: a payment is only ever born from marking a subscription paid
// (ADR-008). The asymmetry with expenses is deliberate, not an omission.
router.post('/expenses', adminOnly, validate(createExpenseSchema), financeController.createExpense);
router.patch(
  '/expenses/:id',
  adminOnly,
  validate(updateExpenseSchema),
  financeController.updateExpense,
);
router.delete('/expenses/:id', adminOnly, financeController.removeExpense);
router.delete('/payments/:id', adminOnly, financeController.voidPayment);

export default router;
