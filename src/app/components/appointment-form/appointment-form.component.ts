import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  patients: Patient[] = [];
  submitted = false;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.error = 'Erreur lors du chargement des patients';
      }
    });
  }

  get f() {
    return this.appointmentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.appointmentForm.invalid) {
      return;
    }

    this.loading = true;
    const appointmentData: Appointment = {
      ...this.appointmentForm.value,
      status: 'scheduled'
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du rendez-vous. Veuillez réessayer.';
        this.loading = false;
        console.error('Error creating appointment:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
