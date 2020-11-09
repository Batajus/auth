import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Feature } from '../../models/Feature';

@Component({
    selector: 'user-features-component',
    templateUrl: `user-features.component.html`,
    styleUrls: ['user-features.component.scss']
})
export class UserFeaturesComponent {
    registeredFeatures: UIFeatureContext;
    notUsedFeatures: UIFeatureContext;

    constructor(private auth: AuthService) {}

    ngOnInit() {
        this.registeredFeatures = new UIFeatureContext([], 'You are not using any features.');
        this.notUsedFeatures = new UIFeatureContext([], 'There are no features, which you are not using.');
    }
}

export class UIFeatureContext {
    constructor(public features: Feature[], public placeholder: string) {}
}
