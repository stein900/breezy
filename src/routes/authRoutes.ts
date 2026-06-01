import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate, ensureNotSuspended, validate } from '../middleware/auth';
import { loginValidation, registerValidation } from '../validators';

const router = Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.get('/me', authenticate, ensureNotSuspended, authController.me);

export default router;
