import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent {
  patientForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  success = false;
  currentStep = 1;
  totalSteps = 4;
  
  healthConditions: string[] = [];
  newCondition = '';
  hasHealthConditions = false;
  overallHealth = 'Fair';
  gpName = 'Bath Row medical Practice';
  gpPhone = '0121 236 6687';
  gpCountryCode = '+44';

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
      street: [''],
      city: [''],
      postalCode: [''],
      country: [''],
      medicalHistory: [''],
      remarks: ['']
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validate current step before proceeding
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      // Personal details validation
      const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone'];
      let isValid = true;
      required.forEach(field => {
        if (!this.patientForm.get(field)?.valid) {
          this.patientForm.get(field)?.markAsTouched();
          isValid = false;
        }
      });
      return isValid;
    }
    return true;
  }

  addCondition(): void {
    if (this.newCondition.trim() && !this.healthConditions.includes(this.newCondition.trim())) {
      this.healthConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(condition: string): void {
    this.healthConditions = this.healthConditions.filter(c => c !== condition);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.patientForm.invalid) {
      return;
    }

    this.loading = true;
    const patientData = {
      ...this.patientForm.value,
      overallHealth: this.overallHealth,
      gpName: this.gpName,
      gpPhone: this.gpPhone,
      healthConditions: this.healthConditions,
      address: this.patientForm.value.street 
        ? `${this.patientForm.value.street}, ${this.patientForm.value.city}, ${this.patientForm.value.postalCode}, ${this.patientForm.value.country}`
        : this.patientForm.value.address
    };

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
