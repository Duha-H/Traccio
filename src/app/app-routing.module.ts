import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { AuthGuardService as AuthGuard } from "./controllers/auth-guard.service";
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
import { AppWrapperComponent } from './views/app-wrapper/app-wrapper.component';

const routes: Routes = [
  // { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "", canActivate: [AuthGuard], component: AppWrapperComponent,
    children: [
      { path: "", component: DashboardComponent },
      {
        path: "journeys",
        component: JourneysComponent,
        children: [
          { path: "", component: JourneyListComponent },
          { path: ":id", component: JourneyViewComponent },
        ],
        // canActivate: [AuthGuard]
      },
      { path: "search", component: SearchComponent, canActivate: [AuthGuard] },
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
    ]
  },
  // { path: "", component: SearchComponent },
  { path: "signin", component: SignInComponent },
  { path: "signup", component: SignUpComponent },
  { path: "confirmsignup", component: ConfirmSignupComponent },
  { path: "login", component: LoginComponent }, // temp
  // { path: 'applications', component: JourneyViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// children: [ { path: 'applications', component: JourneyViewComponent } ]
