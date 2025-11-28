import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss'
})
export class EditPatientComponent implements OnInit {
  patientForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  success = false;
  patientId = '';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = id;
      this.loadPatient(id);
    }
  }

  loadPatient(id: string): void {
    this.loading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue(patient);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du patient';
        this.loading = false;
        console.error('Error loading patient:', err);
      }
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

    this.patientService.updatePatient(this.patientId, patientData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/patient', this.patientId]);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification du patient. Veuillez réessayer.';
        this.loading = false;
        console.error('Error updating patient:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/patient', this.patientId]);
  }
}
