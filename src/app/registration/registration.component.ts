import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'registration-component',
    templateUrl: 'registration.component.html'
})
export class RegistrationComponent implements OnInit {

    fgUsername: FormGroup;
    fgMail: FormGroup;
    fgPassword: FormGroup;

    constructor(){}

    ngOnInit() {
        this.initFormGroups();
    }


    private initFormGroups(){
        this.fgUsername = new FormGroup({
            username: new FormControl('', Validators.required)
        })

        this.fgMail = new FormGroup({
            mail: new FormControl('', Validators.required)
        })
    }
    
}