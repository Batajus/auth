import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feature } from 'src/app/models/Feature';
import { FeatureService } from './feature.service';

@Component({
    selector: 'feature-component',
    templateUrl: 'feature.component.html',
    styleUrls: ['feature.component.scss']
})
export class FeatureComponent implements OnInit {
    formGroup: FormGroup;

    private feature: Feature;

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { feature: Feature },
        public dialogRef: MatDialogRef<FeatureComponent>,
        private featureService: FeatureService
    ) {}

    ngOnInit() {
        this.feature = this.data.feature;

        this.formGroup = this.fb.group({
            name: [this.feature.name, Validators.required],
            url: [this.feature.url, Validators.required],
            shortDescription: [this.feature.shortDescription, Validators.required],
            description: [this.feature.description],
            // Solution to disable this kind of feature -> https://stackoverflow.com/a/48451375/4661771
            activationKey: new FormControl({ value: this.feature.activationKey, disabled: true }),
            navigable: [this.feature.navigable]
        });
    }

    submit() {
        if (!this.formGroup.valid) {
            return;
        }

        Object.assign(this.feature, this.formGroup.value);

        return this.featureService.storeFeature(this.feature).subscribe(() => {
            this.dialogRef.close();
        });
    }
}
