import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Views
import { JourneysComponent } from "./journeys.component";
import { JourneyViewComponent } from "./journey-view/journey-view.component";
import { JourneyListComponent } from "./journey-list/journey-list.component";
import { ApplicationViewComponent } from '../application-view/application-view.component';

const routes: Routes = [
  { path: "", component: JourneyListComponent, },
  { path: ":id", component: JourneyViewComponent, data: { appref: '' } },
  { path: ":id/:appref", component: ApplicationViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneysRoutingModule { }
