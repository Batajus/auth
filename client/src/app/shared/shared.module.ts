import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordsComponent } from '../control/passwords.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [PasswordsComponent],
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    providers: [],
    exports: [PasswordsComponent]
})
export class SharedModule {}
