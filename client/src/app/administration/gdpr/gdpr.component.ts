import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/User';
import { GDPRDeletionComponent } from './gdpr-deletion.component';
import { GDPRService } from './gdpr.service';

@Component({
    selector: 'gdpr-component',
    templateUrl: 'gdpr.component.html'
})
export class GDPRComponent {
    private user: User;

    constructor(private auth: AuthService, private dialog: MatDialog, private gdprService: GDPRService) {
        const subs = this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
            subs.unsubscribe();
        });
    }

    confirmAccountDeletion() {
        this.dialog.open(GDPRDeletionComponent, {
            autoFocus: false
        });
    }
}
