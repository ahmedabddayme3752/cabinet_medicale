export interface Patient {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'M' | 'F';
    phone: string;
    address?: string;
    medicalHistory?: string;
    remarks?: string;
    lastAppointment?: string;
}
