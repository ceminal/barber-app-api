import { Router } from 'express';
import { register, login, getMe, updateProfile, getAllUsers } from './auth.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from './user.interface';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/update-profile', authenticate, updateProfile);
router.get('/users', authenticate, authorize([UserRole.ADMIN]), getAllUsers);

export default router;
