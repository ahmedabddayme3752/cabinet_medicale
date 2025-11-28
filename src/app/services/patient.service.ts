import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = 'http://localhost:3000/patients';

    constructor(private http: HttpClient) { }

    getAllPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl);
    }

    getPatientById(id: string): Observable<Patient> {
        return this.http.get<Patient>(`${this.apiUrl}/${id}`);
    }

    createPatient(patient: Patient): Observable<Patient> {
        return this.http.post<Patient>(this.apiUrl, patient);
    }

    updatePatient(id: string, patient: Patient): Observable<Patient> {
        return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
    }

    deletePatient(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    searchPatients(searchTerm: string): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${this.apiUrl}?q=${searchTerm}`);
    }

    filterPatients(filters: any): Observable<Patient[]> {
        let queryParams = '';
        if (filters.gender) {
            queryParams += `gender=${filters.gender}&`;
        }
        if (filters.dateFrom) {
            queryParams += `lastAppointment_gte=${filters.dateFrom}&`;
        }
        if (filters.dateTo) {
            queryParams += `lastAppointment_lte=${filters.dateTo}&`;
        }
        return this.http.get<Patient[]>(`${this.apiUrl}?${queryParams}`);
    }
}
