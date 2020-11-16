import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'registration',
        loadChildren: () =>
            import('./registration/registration.module').then(
                (m) => m.RegistrationModule
            )
    },
    {
        path: 'administration',
        loadChildren: () =>
            import('./administration/administration.module').then(
                (m) => m.AdministrationModule
            ),
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
