import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/user/user.service';
import { Feature } from '../../models/Feature';
import { FeatureDeletionComponent } from './feature-deletion.component';
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

    private user: User;

    constructor(
        private auth: AuthService,
        private featureService: FeatureService,
        private dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit() {
        // Getting mat-tab index from routing params, so the selection is not resetted after reload
        this.selectedTab = +this.activeRoute.snapshot.paramMap.get('selected');

        // Init UI objects
        this.registeredFeatures = new UIFeature([], 'You are not using any features.');
        this.notUsedFeatures = new UIFeature([], 'There are no features, which you are not using.');

        this.auth.ensureUserLoaded().subscribe((user) => {
            this.user = user;
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

    deleteFeature(features: Feature[], feature: Feature, idx: number) {
        const ref = this.dialog.open(FeatureDeletionComponent, {
            autoFocus: false,
            data: { feature }
        });

        const subs = ref.afterClosed().subscribe((successful) => {
            subs.unsubscribe();
            if (successful) {
                features.splice(idx, 1);
            }
        });
    }

    activateFeature(feature: Feature, idx: number) {
        if (this.user.features.includes(feature._id)) {
            return;
        }

        this.user.features.push(feature._id);

        return this.userService.activateFeature(this.user).subscribe(() => {
            this.notUsedFeatures.features.splice(idx, 1);
            this.registeredFeatures.features.push(feature);
        });
    }
}

export class UIFeature {
    constructor(public features: Feature[], public placeholder: string) {}
}
