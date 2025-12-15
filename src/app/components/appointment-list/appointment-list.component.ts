import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  patients: Patient[] = [];
  loading = true;
  error = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Filters
  dateFilter: string = 'all'; // 'all', 'today', 'week', 'month', 'custom'
  customDateFrom: string = '';
  customDateTo: string = '';
  statusFilter: string = 'all'; // 'all', 'scheduled', 'completed', 'cancelled'

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rendez-vous';
        this.loading = false;
      }
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  }

  updateStatus(appointmentId: string | undefined, status: 'completed' | 'cancelled'): void {
    if (!appointmentId) return;

    this.appointmentService.updateAppointmentStatus(appointmentId, status).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error updating appointment status:', err);
      }
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
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

  applyFilters(): void {
    let filtered = [...this.appointments];

    // Filter by date
    if (this.dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (this.dateFilter) {
        case 'today':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
          });
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= today && aptDate <= weekFromNow;
          });
          break;
        case 'month':
          const monthFromNow = new Date(today);
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= today && aptDate <= monthFromNow;
          });
          break;
        case 'custom':
          if (this.customDateFrom) {
            const fromDate = new Date(this.customDateFrom);
            fromDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(apt => {
              const aptDate = new Date(apt.date);
              aptDate.setHours(0, 0, 0, 0);
              return aptDate >= fromDate;
            });
          }
          if (this.customDateTo) {
            const toDate = new Date(this.customDateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(apt => {
              const aptDate = new Date(apt.date);
              aptDate.setHours(0, 0, 0, 0);
              return aptDate <= toDate;
            });
          }
          break;
      }
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === this.statusFilter);
    }

    this.filteredAppointments = filtered;
    this.currentPage = 1;
    this.calculatePagination();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onCustomDateChange(): void {
    if (this.dateFilter === 'custom') {
      this.applyFilters();
    }
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  getPaginatedAppointments(): Appointment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAppointments.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Expose Math to template
  Math = Math;
}
