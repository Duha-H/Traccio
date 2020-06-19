import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Guards
import { AuthGuardService as AuthGuard } from "./controllers/auth-guard.service";
import { SignInGuard } from "./auth/guards/signin-guard.service";
import { SignUpGuard } from "./auth/guards/signup-guard.service";
import { ConfirmSignUpGuard } from "./auth/guards/confirm-signup-guard.service";
import { AccountRecoveryGuard } from "./auth/guards/recovery-guard.service";
// Views
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { ConfirmSignupComponent } from "./auth/confirm-signup/confirm-signup.component";
import { JourneysComponent } from "./views/journeys/journeys.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { SearchComponent } from "./views/search/search.component";
import { JourneyViewComponent } from "./views/journey-view/journey-view.component";
import { JourneyListComponent } from "./views/journey-list/journey-list.component";
import { AppWrapperComponent } from './views/app-wrapper/app-wrapper.component';
import { AccountRecoveryComponent } from './auth/account-recovery/account-recovery.component';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { ApplicationViewComponent } from './views/application-view/application-view.component';

const routes: Routes = [
  { path: "", canActivate: [AuthGuard], component: AppWrapperComponent,
    children: [
      { path: "", component: DashboardComponent },
      {
        path: "journeys",
        component: JourneysComponent,
        children: [
          { path: "", component: JourneyListComponent },
          { path: ":id", component: JourneyViewComponent, data: { appref: '' } },
          { path: ":id/:appref", component: ApplicationViewComponent },
        ],
      },
      { path: "wishlist", component: WishlistComponent, canActivate: [AuthGuard] },
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: "signin", component: SignInComponent, canActivate: [SignInGuard] },
  { path: "signup", component: SignUpComponent, canActivate: [SignInGuard] },
  { path: "confirmsignup", component: ConfirmSignupComponent, canActivate: [ConfirmSignUpGuard] },
  { path: "accountrecovery", component: AccountRecoveryComponent, canActivate: [AccountRecoveryGuard] },
  { path: '**', redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
