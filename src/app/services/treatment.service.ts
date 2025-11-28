import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treatment } from '../models/treatment.model';

@Injectable({
    providedIn: 'root'
})
export class TreatmentService {
    private apiUrl = 'http://localhost:3000/treatments';

    constructor(private http: HttpClient) { }

    getAllTreatments(): Observable<Treatment[]> {
        return this.http.get<Treatment[]>(this.apiUrl);
    }

    getTreatmentById(id: string): Observable<Treatment> {
        return this.http.get<Treatment>(`${this.apiUrl}/${id}`);
    }

    getTreatmentsByPatientId(patientId: string): Observable<Treatment[]> {
        return this.http.get<Treatment[]>(`${this.apiUrl}?patientId=${patientId}`);
    }

    createTreatment(treatment: Treatment): Observable<Treatment> {
        return this.http.post<Treatment>(this.apiUrl, treatment);
    }

    updateTreatment(id: string, treatment: Treatment): Observable<Treatment> {
        return this.http.put<Treatment>(`${this.apiUrl}/${id}`, treatment);
    }

    deleteTreatment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
