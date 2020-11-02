import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdministrationComponent } from './administration.component';
import { UserFeaturesComponent } from './user-features/user-features.component';
import { SecurityComponent } from './security/security.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AdministrationComponent,
        UserFeaturesComponent,
        SecurityComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        AdministrationRoutingModule,
        SharedModule
    ],
    providers: []
})
export class AdministrationModule {}
