export interface Appointment {
    id?: string;
    patientId: string;
    date: string;
    time: string;
    reason: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
}
