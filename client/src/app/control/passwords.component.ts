import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'passwords-component',
    templateUrl: 'passwords.component.html',
    styleUrls: ['passwords.component.scss']
})
export class PasswordsComponent implements OnInit {
    // Boolean flag to show the password in the HTML
    hide: boolean = true;

    passwordFocus = false;

    // Reference to the password form group, so it is easier to
    // access it from within the HTML
    @Input()
    formGroup: FormGroup;

    pwCtrl: FormControl;

    constructor() {}

    ngOnInit() {
        this.pwCtrl = this.formGroup.get('password') as FormControl;

        if (!this.pwCtrl) {
            throw new Error('FormGroup is missing a "password" control');
        }
    }

    onBlur() {
        setTimeout(() => {
            this.passwordFocus = false;
        }, 125);
    }
}
