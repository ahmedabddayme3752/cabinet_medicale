import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private apiUrl = 'http://localhost:3000/appointments';

    constructor(private http: HttpClient) { }

    getAllAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }

    getAppointmentById(id: string): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
    }

    getAppointmentsByPatientId(patientId: string): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.apiUrl}?patientId=${patientId}`);
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, appointment);
    }

    updateAppointment(id: string, appointment: Appointment): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
    }

    updateAppointmentStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled'): Observable<Appointment> {
        return this.http.patch<Appointment>(`${this.apiUrl}/${id}`, { status });
    }

    deleteAppointment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    filterAppointmentsByDate(dateFrom?: string, dateTo?: string): Observable<Appointment[]> {
        let queryParams = '';
        if (dateFrom) {
            queryParams += `date_gte=${dateFrom}&`;
        }
        if (dateTo) {
            queryParams += `date_lte=${dateTo}&`;
        }
        return this.http.get<Appointment[]>(`${this.apiUrl}?${queryParams}`);
    }
}
