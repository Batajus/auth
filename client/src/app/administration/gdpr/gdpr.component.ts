import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Feature } from 'src/app/models/Feature';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/User';
import { GDPRDeletionComponent } from './gdpr-deletion.component';
import { GDPRService } from './gdpr.service';

@Component({
    selector: 'gdpr-component',
    templateUrl: 'gdpr.component.html',
    styleUrls: ['gdpr.component.scss']
})
export class GDPRComponent {
    user: User;
    features: Feature[];

    constructor(private auth: AuthService, private dialog: MatDialog, private userSerivce: UserService) {
        this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
            this.userSerivce.loadFeatureOfUser(user).subscribe((features) => {
                this.features = features;
            });
        });
    }

    confirmAccountDeletion() {
        this.dialog.open(GDPRDeletionComponent, {
            autoFocus: false
        });
    }
}
