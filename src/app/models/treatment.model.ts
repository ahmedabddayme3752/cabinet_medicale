export interface Treatment {
    id?: string;
    patientId: string;
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
    notes?: string;
}
