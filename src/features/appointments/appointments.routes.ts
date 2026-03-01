import { Router } from 'express';
import { createAppointment, getMyAppointments, getAllAppointments, getBusySlots, updateStatus } from './appointments.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from '../auth/user.interface';

const router = Router();

router.post('/', authenticate, authorize([UserRole.CUSTOMER, UserRole.ADMIN]), createAppointment);
router.get('/my', authenticate, authorize([UserRole.CUSTOMER]), getMyAppointments);

router.get('/all', authenticate, authorize([UserRole.ADMIN]), getAllAppointments);
router.get('/busy-slots', getBusySlots);
router.patch('/:id/status', authenticate, authorize([UserRole.ADMIN]), updateStatus);

export default router;
