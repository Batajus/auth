import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Feature } from 'src/app/models/Feature';
import { FeatureService } from './feature.service';

@Component({
    selector: 'feature-deletion-component',
    template: ` <h1 mat-dialog-title>Logout</h1>
        <mat-dialog-content>Are you sure you want to delete the feature <b>{{this.data.feature.name}}</b>?</mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-raised-button color="warn" (click)="delete()">Delete</button>
        </mat-dialog-actions>`
})
export class FeatureDeletionComponent {
    constructor(
        private featureService: FeatureService,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { feature: Feature },
        private dialogRef: MatDialogRef<FeatureDeletionComponent>
    ) {}

    delete() {
        return this.featureService.deleteFeature(this.data.feature).subscribe((successful) => {
            if (!successful) {
                this.snackBar.open("The deletion was not successful. Please try again later.", null, {
                    duration: 1500
                });
                return;
            }
            this.dialogRef.close(true);
        })
    }
}
