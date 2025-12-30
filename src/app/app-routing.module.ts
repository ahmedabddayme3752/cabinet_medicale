import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { EditPatientComponent } from './components/edit-patient/edit-patient.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';

const routes: Routes = [
    { path: '', component: PatientListComponent },
    { path: 'add-patient', component: AddPatientComponent },
    { path: 'patient/:id', component: PatientDetailsComponent },
    { path: 'edit-patient/:id', component: EditPatientComponent },
    { path: 'appointments', component: AppointmentListComponent },
    { path: 'add-appointment', component: AppointmentFormComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
