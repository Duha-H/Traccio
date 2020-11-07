import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Application } from "src/app/models/application";
import { STATUS, STATUS_COLORS } from 'src/app/models/constants';
import { Journey } from "src/app/models/journey";
import { MESSAGES } from 'src/assets/template-messages';
import { ApplicationViewComponent } from "./application-view.component";

@Component({
  selector: "app-application-view",
  templateUrl: "./application-view.component.html",
  styleUrls: ["./application-view.component.css"],
})
export class ExistingApplicationViewComponent
  extends ApplicationViewComponent
  implements OnInit {
  newApp = false;
  wishlistApp = false;
  existingApp = true;
  parentJourney: Journey;

  ngOnInit() {
    const appid = this.route.snapshot.paramMap.get("appref");
    const parentID = this.route.snapshot.paramMap.get("id");
    if (parentID) {
      this.userStore.journeys.subscribe(journeys => {
        this.parentJourney = journeys.filter(journey => journey.id === parentID)[0];
      });
      if (!this.parentJourney) {
        // parent not resolved yet
        // redirect to journey list
        console.log("ExistingApplicationViewComponent: journey not resolved yet");
        this.router.navigate(["/home/journeys"]);
        return;
      }
      this.currApplicationDetails = Object.create(this.userStore.getApplication(this.parentJourney.id, appid));
    }

    if (!this.currApplicationDetails) {
      console.log("ExistingApplicationViewComponent: app not resolved");
      this.router.navigate(['/home/journeys']);
      return;
    }
    // Specify application details in formGroup
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
    this.titleService.setTitle(`${this.currApplicationDetails.positionTitle} @ ${this.currApplicationDetails.companyName} | ${this.parentJourney.title} | Traccio`);

    // Set breadcrumbs
    this.breadcrumbsData.current.name = "Application";
    this.breadcrumbsData.current.url = `/home/journeys/${this.parentJourney.id}/${appid}`;
    this.breadcrumbsData.paths.push(
      { name: "Journeys", url: "/home/journeys" },
      {
        name: this.parentJourney.title,
        url: `/home/journeys/${this.parentJourney.id}`,
      },
    );

    // Set session storage
    sessionStorage.setItem("journeyRoute", this.breadcrumbsData.current.url);

    // Set timeline props
    this.timelineProps = {
      data: this.appFormGroup.get('timeline').value,
      colorMappings: STATUS_COLORS
    };
  }

  saveChanges() {
    this._setAppDetails();
    this.userStore.updateExistingApplication(this.parentJourney.id, this.currApplicationDetails)
      .then(response => {
        if (!response.successful) {
          this.notificationService.sendNotification(response.message, 'error');
        } else {
          this.detailsUpdated = false;
        }
      });
    // if details were successfully updated and app.status was set to 'OFFER'
    // deploy confetti!
    if (this.statusUpdated && this.currApplicationDetails.status === STATUS.OFFER) {
      setTimeout(() => {
        this.confetti.draw();
        this.notificationService.sendNotification(MESSAGES.congratulatory[Math.floor(Math.random() * Object.keys(MESSAGES.congratulatory).length)], 'success', 8000);
      }, 800);
      this.statusUpdated = false;
    }
    this.dateUpdated = false;
  }

  private _setAppDetails() {
    this.currApplicationDetails.positionTitle = this.appFormGroup.get('positionTitle').value;
    this.currApplicationDetails.companyName = this.appFormGroup.get('companyName').value;
    this.currApplicationDetails.appDate = this.appFormGroup.get('appDate').value;
    this.currApplicationDetails.source = this.appFormGroup.get('source').value;
    this.currApplicationDetails.notes = this.appFormGroup.get('notes').value;
    this.currApplicationDetails.status = this.appFormGroup.get('status').value;
    this.currApplicationDetails.timeline = this.appFormGroup.get('timeline').value;
  }
}
