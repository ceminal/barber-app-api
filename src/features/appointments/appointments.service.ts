import { Appointment } from './appointment.model';
import { IAppointment } from './appointment.interface';
import { Types } from 'mongoose';

export class AppointmentsService {
    async createAppointment(appointmentData: Partial<IAppointment>) {
        const appointment = new Appointment(appointmentData);
        return await appointment.save();
    }

    async getCustomerAppointments(customerId: string) {
        return await Appointment.find({ customerId: new Types.ObjectId(customerId) }).sort({ date: -1 });
    }

    async getAllAppointments(filterDate?: string) {
        let query: any = {};
        if (filterDate) {
            const start = new Date(filterDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(filterDate);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }
        return await Appointment.find(query).populate('customerId', 'firstName lastName phoneNumber').sort({ date: 1 });
    }

    async getBusySlots(barberName: string, appointmentDate: string) {
        const appointments = await Appointment.find({
            barberName,
            appointmentDate,
            status: { $ne: 'CANCELLED' }
        });
        return appointments.map(app => app.appointmentTime);
    }

    async updateAppointmentStatus(id: string, status: string) {
        return await Appointment.findByIdAndUpdate(id, { status }, { new: true }).populate('customerId', 'firstName lastName phoneNumber');
    }
}
