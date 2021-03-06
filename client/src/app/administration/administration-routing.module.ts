import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { GDPRComponent } from './gdpr/gdpr.component';
import { SecurityComponent } from './security/security.component';
import { UserFeaturesComponent } from './user-features/user-features.component';

const routes: Routes = [
    {
        path: '',
        component: AdministrationComponent,
        children: [
            {
                path: '',
                redirectTo: 'features'
            },
            {
                path: 'features',
                component: UserFeaturesComponent
            },
            {
                path: 'security',
                component: SecurityComponent
            },
            {
                path: 'gdpr',
                component: GDPRComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule {}
