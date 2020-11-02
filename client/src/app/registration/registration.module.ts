import { NgModule } from '@angular/core';
import { RegistrationComponent } from './registration.component';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [RegistrationComponent],
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, RegistrationRoutingModule, SharedModule],
    providers: []
})
export class RegistrationModule {}
