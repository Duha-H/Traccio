import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Views
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
