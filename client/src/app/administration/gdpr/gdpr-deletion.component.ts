import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GDPRService } from './gdpr.service';

@Component({
    selector: 'gdpr-deletion-component',
    template: ` <h1 mat-dialog-title>Account Deletion</h1>
        <mat-dialog-content
            >Are you sure you want to delete your account? This operation is irreversible!</mat-dialog-content
        >
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Abort</button>
            <button mat-raised-button color="warn" (click)="deleteAccount()">Delete Account</button>
        </mat-dialog-actions>`
})
export class GDPRDeletionComponent {
    constructor(
        private router: Router,
        private gdprService: GDPRService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<GDPRDeletionComponent>
    ) {}

    deleteAccount() {
        this.gdprService.deleteAccount().subscribe(() => {
            this.dialogRef.close();
            this.snackBar.open('Your Account is successfully deleted.', null, { duration: 3000 });
            this.router.navigate(['/']);
        });
    }
}
