import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent {
  patientForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]+$/)]],
      address: [''],
      medicalHistory: [''],
      remarks: ['']
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.patientForm.invalid) {
      return;
    }

    this.loading = true;
    const patientData = this.patientForm.value;

    this.patientService.createPatient(patientData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'ajout du patient. Veuillez réessayer.';
        this.loading = false;
        console.error('Error creating patient:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
