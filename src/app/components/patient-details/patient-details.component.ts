import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { Appointment } from '../../models/appointment.model';
import { Treatment } from '../../models/treatment.model';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { TreatmentService } from '../../services/treatment.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient | null = null;
  appointments: Appointment[] = [];
  treatments: Treatment[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatientDetails(id);
    }
  }

  loadPatientDetails(id: string): void {
    this.loading = true;

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loadAppointments(id);
        this.loadTreatments(id);
      },
      error: (err) => {
        this.error = 'Patient non trouvé';
        this.loading = false;
        console.error('Error loading patient:', err);
      }
    });
  }

  loadAppointments(patientId: string): void {
    this.appointmentService.getAppointmentsByPatientId(patientId).subscribe({
      next: (appointments) => {
        this.appointments = appointments.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loading = false;
      }
    });
  }

  loadTreatments(patientId: string): void {
    this.treatmentService.getTreatmentsByPatientId(patientId).subscribe({
      next: (treatments) => {
        this.treatments = treatments;
      },
      error: (err) => {
        console.error('Error loading treatments:', err);
      }
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

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'scheduled':
        return 'badge-primary';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Effectué';
      case 'scheduled':
        return 'Programmé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }

  isPastAppointment(appointment: Appointment): boolean {
    return new Date(appointment.date) < new Date();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Pagination for appointments
  currentPage = 1;
  itemsPerPage = 3; // Show 3 appointments per page

  get totalPages(): number {
    return Math.ceil(this.appointments.length / this.itemsPerPage);
  }

  getPaginatedAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.appointments.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Expose Math to template
  protected readonly Math = Math;
}

