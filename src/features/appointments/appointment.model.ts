import { Schema, model, Types } from 'mongoose';
import { IAppointment, AppointmentStatus } from './appointment.interface';

const appointmentSchema = new Schema<IAppointment>(
    {
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        appointmentDate: { type: String, required: true },
        appointmentTime: { type: String, required: true },
        barberName: { type: String, required: true },
        status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.PENDING },
        serviceName: { type: String, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
