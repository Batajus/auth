import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Feature } from '../../models/Feature';
import { FeatureService } from './feature.service';

@Component({
    selector: 'user-features-component',
    templateUrl: `user-features.component.html`,
    styleUrls: ['user-features.component.scss']
})
export class UserFeaturesComponent {
    registeredFeatures: UIFeature;
    notUsedFeatures: UIFeature;

    constructor(private auth: AuthService, private featureService: FeatureService) {}

    ngOnInit() {
        this.registeredFeatures = new UIFeature([], 'You are not using any features.');
        this.notUsedFeatures = new UIFeature([], 'There are no features, which you are not using.');

        this.auth.ensureUserLoaded().subscribe((user) => {
            this.featureService.loadFeatures().subscribe((features) => {
                features.forEach((feature) => {
                    if (user.features.includes(feature.id)) {
                        return this.registeredFeatures.features.push(feature);
                    }
                    this.notUsedFeatures.features.push(feature);
                });
            });
        });
    }
}

export class UIFeature {
    constructor(public features: Feature[], public placeholder: string) {}
}
