import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AppointmentsService } from './appointments.service';

const appointmentsService = new AppointmentsService();

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        console.log('[CREATE_APPOINTMENT] User:', JSON.stringify(req.user));
        console.log('[CREATE_APPOINTMENT] Body:', JSON.stringify(req.body));
        const { barberName, appointmentDate, appointmentTime, serviceName, notes } = req.body;

        const customerId = req.user?.id;
        if (!customerId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const appointmentData: any = {
            customerId: customerId,
            barberName,
            appointmentDate,
            appointmentTime,
            serviceName,
            notes,
            date: new Date(`${appointmentDate}T${appointmentTime}:00`),
        };

        const appointment = await appointmentsService.createAppointment(appointmentData);
        res.status(201).json(appointment);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await appointmentsService.getCustomerAppointments(req.user!.id);
        res.json(appointments);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const { date } = req.query;
        const appointments = await appointmentsService.getAllAppointments(date as string);
        res.json(appointments);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
export const getBusySlots = async (req: AuthRequest, res: Response) => {
    try {
        const { barberName, date } = req.query;
        if (!barberName || !date) {
            return res.status(400).json({ message: 'Barber name and date are required.' });
        }
        const busySlots = await appointmentsService.getBusySlots(barberName as string, date as string);
        res.json(busySlots);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const appointment = await appointmentsService.updateAppointmentStatus(id as string, status);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.json(appointment);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
