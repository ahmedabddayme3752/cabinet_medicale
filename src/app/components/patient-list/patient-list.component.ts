import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { SearchFilterComponent } from '../search-filter/search-filter.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchFilterComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = true;
  error = '';

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des patients';
        this.loading = false;
        console.error('Error loading patients:', err);
      }
    });
  }

  onFilterChange(filters: any): void {
    this.filteredPatients = this.patients.filter(patient => {
      let matches = true;

      // Search by name
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        matches = matches && (
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower)
        );
      }

      // Filter by gender
      if (filters.gender) {
        matches = matches && patient.gender === filters.gender;
      }

      // Filter by date range
      if (filters.dateFrom && patient.lastAppointment) {
        matches = matches && patient.lastAppointment >= filters.dateFrom;
      }
      if (filters.dateTo && patient.lastAppointment) {
        matches = matches && patient.lastAppointment <= filters.dateTo;
      }

      return matches;
    });
  }

  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Aucun';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
