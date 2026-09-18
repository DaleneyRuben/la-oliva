import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { loginRateLimit } from '../middleware/login-rate-limit';
import validate from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), loginRateLimit, authController.login);

export default router;
