import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Views
import { JourneysComponent } from "./journeys.component";
import { JourneyViewComponent } from "./journey-view/journey-view.component";
import { JourneyListComponent } from "./journey-list/journey-list.component";
import { ApplicationViewComponent } from 'src/app/shared-components/application-view/application-view.component';
import { NewApplicationViewComponent } from 'src/app/shared-components/application-view/new-application-view.component';
import { ExistingApplicationViewComponent } from 'src/app/shared-components/application-view/existing-application-view.component';

const routes: Routes = [
  { path: "", component: JourneyListComponent, },
  { path: ":id", component: JourneyViewComponent, data: { appref: '' } },
  { path: ":id/new-app", component: NewApplicationViewComponent },
  { path: ":id/:appref", component: ExistingApplicationViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneysRoutingModule { }
