import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdministrationComponent } from './administration.component';
import { UserFeaturesComponent } from './user-features/user-features.component';
import { SecurityComponent } from './security/security.component';
import { SharedModule } from '../shared/shared.module';
import { FeatureComponent } from './user-features/feature.component';
import { RightsPipe } from '../auth/rights.pipe';
import { FeatureDeletionComponent } from './user-features/feature-deletion.component';
import { GDPRComponent } from './gdpr/gdpr.component';
import { GDPRDeletionComponent } from './gdpr/gdpr-deletion.component';

@NgModule({
    declarations: [
        AdministrationComponent,
        UserFeaturesComponent,
        SecurityComponent,
        FeatureComponent,
        RightsPipe,
        FeatureDeletionComponent,
        GDPRComponent,
        GDPRDeletionComponent
    ],
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, AdministrationRoutingModule, SharedModule],
    providers: []
})
export class AdministrationModule {}
