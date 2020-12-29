import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Application } from "src/app/models/application";
import { STATUS } from 'src/app/models/constants';
import { Journey } from "src/app/models/journey";
import { ApplicationViewComponent } from "./application-view.component";

@Component({
  selector: "app-application-view",
  templateUrl: "./application-view.component.html",
  styleUrls: ["./application-view.component.css"],
})
export class NewApplicationViewComponent
  extends ApplicationViewComponent
  implements OnInit {
  newApp = true;
  wishlistApp = false;
  existingApp = false;
  parentJourney: Journey;

  ngOnInit() {
    const parentID = this.route.snapshot.paramMap.get("id");
    if (parentID) {
      this.wishlistApp = false;
      this.parentJourney = this.userStore.getJourney(parentID);
      if (!this.parentJourney) {
        // parent not resolved yet
        // redirect to journey list
        this.router.navigate([this.routerManager.getParentRoute(2)]);
        return;
      }
      this.titleService.setTitle(`New Application | ${this.parentJourney.title} | Traccio`);
    } else {
      this.wishlistApp = true;
      this.titleService.setTitle(`New Application | Wishlist | Traccio`);
    }
    // Specify application details in formGroup
    this.currApplicationDetails = new Application();
    this.appFormGroup.setValue({
      positionTitle: this.currApplicationDetails.positionTitle,
      companyName: this.currApplicationDetails.companyName,
      appDate: this.currApplicationDetails.appDate,
      status: this.currApplicationDetails.status,
      source: this.currApplicationDetails.source,
      timeline: this.currApplicationDetails.timeline,
      notes: this.currApplicationDetails.notes,
    });

    // Set breadcrumbs
    const currUrl = `${this.routerManager.getParentRoute()}/new-app`;
    const breadcrumbPaths = this.wishlistApp
      ? [{ name: "Wishlist", url: this.routerManager.getParentRoute() }]
      : [
          { name: "Journeys", url: this.routerManager.getParentRoute(2) },
          {
            name: this.parentJourney.title,
            url: this.routerManager.getParentRoute(),
          },
        ];
    this.breadcrumbsData.current.name = "Application";
    this.breadcrumbsData.current.url = currUrl;
    this.breadcrumbsData.paths.push(...breadcrumbPaths);

    // Set session storage
    if (!this.wishlistApp) {
      sessionStorage.setItem("journeyRoute", this.breadcrumbsData.current.url);
    }
  }

  saveChanges() {
    this._setAppDetails();
    if (this.wishlistApp) {
      this.userStore.addNewWishlistApplication(this.currApplicationDetails)
        .then(response => {
          if (response.successful) {
            this.currApplicationDetails = response.payload;
            this.notificationService.sendNotification('Wishlist application created!', 'success');
            sessionStorage.setItem('wishlistRoute', `${this.routerManager.getParentRoute()}/${this.currApplicationDetails.id}`);
            this.router.navigate([this.routerManager.getParentRoute(), this.currApplicationDetails.id]);
            return;
          } else {
            this.notificationService.sendNotification(response.message, 'error');
          }
        });
    } else {
      this.userStore.addNewApplication(this.parentJourney.id, this.currApplicationDetails)
        .then(response => {
          if (response.successful) {
            this.currApplicationDetails = response.payload;
            this.detailsUpdated = false;
            sessionStorage.setItem('journeyRoute', `${this.routerManager.getParentRoute()}/${this.currApplicationDetails.id}`);
            this.router.navigate([this.routerManager.getParentRoute(), response.payload.id]);
            return;
          } else {
            this.notificationService.sendNotification(response.message, 'error');
          }
        });
    }
    this.dateUpdated = false;
  }

  private _setAppDetails() {
    this.currApplicationDetails.positionTitle = this.appFormGroup.get('positionTitle').value;
    this.currApplicationDetails.companyName = this.appFormGroup.get('companyName').value;
    this.currApplicationDetails.appDate = this.appFormGroup.get('appDate').value;
    this.currApplicationDetails.source = this.appFormGroup.get('source').value;
    this.currApplicationDetails.notes = this.appFormGroup.get('notes').value;
    this.currApplicationDetails.setStatus(STATUS.IN_REVIEW, this.currApplicationDetails.appDate);

  }
}
