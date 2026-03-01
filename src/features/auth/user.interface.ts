export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}

export interface IUser {
    _id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}
