import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { AuthGuardService as AuthGuard } from "./auth/auth-guard.service";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { ConfirmSignupComponent } from "./auth/confirm-signup/confirm-signup.component";
import { JourneysComponent } from "./views/journeys/journeys.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { SearchComponent } from "./views/search/search.component";
import { JourneyViewComponent } from "./views/journey-view/journey-view.component";
import { JourneyListComponent } from "./views/journey-list/journey-list.component";

const routes: Routes = [
  { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "signin", component: SignInComponent },
  { path: "signup", component: SignUpComponent },
  { path: "confirmsignup", component: ConfirmSignupComponent },
  { path: "login", component: LoginComponent }, // temp
  {
    path: "journeys",
    component: JourneysComponent,
    children: [
      { path: "", component: JourneyListComponent },
      { path: ":id", component: JourneyViewComponent },
    ],
  },
  // { path: 'applications', component: JourneyViewComponent },
  { path: "search", component: SearchComponent },
  { path: "settings", component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// children: [ { path: 'applications', component: JourneyViewComponent } ]
