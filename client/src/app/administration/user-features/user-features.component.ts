import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Feature } from '../../models/Feature';
import { FeatureComponent } from './feature.component';
import { FeatureService } from './feature.service';

@Component({
    selector: 'user-features-component',
    templateUrl: `user-features.component.html`,
    styleUrls: ['user-features.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserFeaturesComponent {
    registeredFeatures: UIFeature;
    notUsedFeatures: UIFeature;

    selectedTab: number = null;

    constructor(
        private auth: AuthService,
        private featureService: FeatureService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // Getting mat-tab index from routing params, so the selection is not resetted after reload
        this.selectedTab = +this.activeRoute.snapshot.paramMap.get('selected');

        // Init UI objects
        this.registeredFeatures = new UIFeature([], 'You are not using any features.');
        this.notUsedFeatures = new UIFeature([], 'There are no features, which you are not using.');

        this.auth.ensureUserLoaded().subscribe((user) => {
            // TODO Implement paging
            this.featureService.loadFeatures().subscribe((features) => {
                features.forEach((feature) => {
                    if (user.features.includes(feature._id)) {
                        return this.registeredFeatures.features.push(feature);
                    }
                    this.notUsedFeatures.features.push(feature);
                });
            });
        });
    }

    tabChange(tab: MatTabChangeEvent) {
        this.router.navigate(['./administration/features', { selected: tab.index }]);
    }

    copyUrl(url: string) {
        return navigator.clipboard.writeText(url).then(() => {
            console.info(`copied: ${url}`);
        });
    }

    openFeatureDialog(feature: Feature = new Feature()) {
        this.dialog.open(FeatureComponent, {
            autoFocus: false,
            width: '600px',
            data: { feature }
        });
    }
}

export class UIFeature {
    constructor(public features: Feature[], public placeholder: string) {}
}
