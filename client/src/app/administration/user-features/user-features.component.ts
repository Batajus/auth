import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Feature } from './features.api';

@Component({
    selector: 'user-features-component',
    templateUrl: `user-features.component.html`,
    styleUrls: ['user-features.component.scss']
})
export class UserFeaturesComponent {
    enrolledFeatures: any[] = [1, 2, 3, 4];

    usedFeatures: UIFeatureContext;
    notUsedFeatures: UIFeatureContext;

    constructor(private auth: AuthService) {}

    ngOnInit() {
        this.usedFeatures = new UIFeatureContext([], 'You are not using any features.');
        this.notUsedFeatures = new UIFeatureContext([], 'There are no features, which you are not using.');
    }
}

export class UIFeatureContext {
    constructor(public features: Feature[], public placeholder: string) {}
}
