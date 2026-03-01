import { Types } from 'mongoose';

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface IAppointment {
    _id?: string;
    customerId: Types.ObjectId;
    date: Date;
    appointmentDate: string;
    appointmentTime: string;
    barberName: string;
    status: AppointmentStatus;
    serviceName: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

