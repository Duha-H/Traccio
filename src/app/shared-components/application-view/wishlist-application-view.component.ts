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
export class WishlistApplicationViewComponent
  extends ApplicationViewComponent
  implements OnInit {
  newApp = false;
  wishlistApp = true;
  existingApp = false;
  parentJourney: Journey;

  ngOnInit() {
    const appid = this.route.snapshot.paramMap.get("appref");
    const existingWishlistApp = this.userStore.getWishlistApplication(appid);

    // Specify application details in formGroup
    this.currApplicationDetails = Object.assign(new Application(), existingWishlistApp);
    if (!this.currApplicationDetails) {
      console.log("WishlistApplicationViewComponent: wishlist app not resolved");
      this.router.navigate(['/home/wishlist']);
      return;
    }
    this.appFormGroup.setValue({
      positionTitle: this.currApplicationDetails.positionTitle,
      companyName: this.currApplicationDetails.companyName,
      appDate: this.currApplicationDetails.appDate,
      status: this.currApplicationDetails.status,
      source: this.currApplicationDetails.source,
      timeline: this.currApplicationDetails.timeline,
      notes: this.currApplicationDetails.notes,
    });

    // Set title
    this.titleService.setTitle(`${this.currApplicationDetails.positionTitle} @ ${this.currApplicationDetails.companyName} | Wishlist | Traccio`);

    // Set breadcrumbs
    this.breadcrumbsData.current.name = "Application";
    this.breadcrumbsData.current.url = `/home/wishlist/${appid}`;
    this.breadcrumbsData.paths.push(
      { name: 'Wishlist', url: '/home/wishlist' },
    );

    // Set session storage
    sessionStorage.setItem('wishlistRoute', this.breadcrumbsData.current.url);

  }

  saveChanges() {
    this._setAppDetails();
    this.userStore.updateWishlistApplication(this.currApplicationDetails)
      .then(response => {
        if (!response.successful) {
          this.notificationService.sendNotification(response.message, 'error');
        } else {
          this.detailsUpdated = false;
        }
      });
    this.dateUpdated = false;
  }

  displayAddToJourneyOverlay() {
    this.displayAddOverlay = true;
  }

  addApplicationToJourney(journey: Journey) {
    const journeyid = journey.id;
    if (!journeyid) {
      console.log('WishlistApplicationView: trying to add to journey with invalid id:', journeyid);
      return;
    }
    // add appliaction to journey
    this.userStore.addNewApplication(journeyid, this.currApplicationDetails)
      .then(response => {
        if (response.successful) {
          // if successfully added, remove application from wishlist
          this.userStore.removeWishlistApplication(this.currApplicationDetails.id);
          this.router.navigate(['/home/journeys', journeyid, response.payload.id]);
          this.notificationService.sendNotification(`Application successfully added to ${journey.title}!`, 'success', 5000);
          // reset saved wishlistRoute
          sessionStorage.setItem('wishlistRoute', '/home/wishlist');
        } else {
          this.notificationService.sendNotification(response.message, 'error');
        }
      });
  }

  private _setAppDetails() {
    this.currApplicationDetails.positionTitle = this.appFormGroup.get('positionTitle').value;
    this.currApplicationDetails.companyName = this.appFormGroup.get('companyName').value;
    this.currApplicationDetails.appDate = this.appFormGroup.get('appDate').value;
    this.currApplicationDetails.source = this.appFormGroup.get('source').value;
    this.currApplicationDetails.notes = this.appFormGroup.get('notes').value;
    if (this.dateUpdated) {
      this.currApplicationDetails.updateAppDate(this.appFormGroup.get('status').value);
    }
  }
}
