import { NgModule } from '@angular/core';
import { RegistrationComponent } from './registration.component';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        RegistrationComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RegistrationRoutingModule
    ],
    providers: []
})
export class RegistrationModule { }
