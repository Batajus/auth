import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    Validators,
    FormBuilder,
} from '@angular/forms';

@Component({
    selector: 'registration-component',
    templateUrl: 'registration.component.html',
})
export class RegistrationComponent implements OnInit {
    formGroup: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.initFormGroups();
    }

    submit(): Promise<void> {
        // TODO: Implement registration logic
        return Promise.resolve();
    }

    private initFormGroups() {
        this.formGroup = this.fb.group({
            user: this.fb.group({
                username: ['user', Validators.required],
                password: ['user', Validators.required],
            }),
            mail: this.fb.group({
                email: ['user@user.user', Validators.email],
            }),
        });
    }
}
