import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'passwords-component',
    templateUrl: 'passwords.component.html',
    styleUrls: [

        'passwords.component.scss'
    ]
})
export class PasswordComponent {
    // Boolean flag to show the password in the HTML
    hide: boolean = true;

    passwordFocus = false;

    // Reference to the password form group, so it is easier to
    // access it from within the HTML
    @Input()
    formGroup: FormGroup;

    constructor() {}

    ngOnInit() {
       
    }
    
}
