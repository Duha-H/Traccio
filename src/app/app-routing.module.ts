import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Guards
import { AuthGuardService as AuthGuard } from "./controllers/auth-guard.service";
import { SignInGuard } from "./auth/guards/signin-guard.service";
import { ConfirmSignUpGuard } from "./auth/guards/confirm-signup-guard.service";
import { AccountRecoveryGuard } from "./auth/guards/recovery-guard.service";
import { AngularFireAuthGuard, redirectLoggedInTo } from "@angular/fire/auth-guard";
// Views
import { LandingComponent } from "./views/landing/landing.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { ConfirmSignupComponent } from "./auth/confirm-signup/confirm-signup.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { AppWrapperComponent } from "./views/app-wrapper/app-wrapper.component";
import { AccountRecoveryComponent } from "./auth/account-recovery/account-recovery.component";
import { AboutComponent } from "./views/landing/about.component";
import { LandingWrapperComponent } from './views/landing/landing-wrapper.component';
import { InfoComponent } from './views/info/info.component';
import { LandingFAQComponent } from './views/landing/landing-faq.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['home']) },
    loadChildren: () =>
      import("src/app/views/landing/landing.module").then(
        (m) => m.LandingModule
      ),
    // component: LandingWrapperComponent,
    // children: [
    //   { path: "", component: LandingComponent },
    //   { path: "about", component: AboutComponent },
    //   { path: "faq", component: LandingFAQComponent },
    //   { path: "signin", component: SignInComponent, canActivate: [SignInGuard] },
    //   { path: "signup", component: SignUpComponent, canActivate: [SignInGuard] },
    //   {
    //     path: "confirmsignup",
    //     component: ConfirmSignupComponent,
    //     canActivate: [ConfirmSignUpGuard],
    //   },
    //   {
    //     path: "accountrecovery",
    //     component: AccountRecoveryComponent,
    //     canActivate: [AccountRecoveryGuard],
    //   },
    // ],
  },
  {
    path: "home",
    canActivate: [AngularFireAuthGuard],
    loadChildren: () =>
      import("src/app/views/app-wrapper/app-wrapper.module").then(
        (m) => m.AppWrapperModule
      ),
    // component: AppWrapperComponent,
    // children: [
    //   {
    //     path: "",
    //     loadChildren: () =>
    //       import("src/app/views/dashboard/dashboard.module").then(
    //         (m) => m.DashboardModule
    //       ),
    //   },
    //   {
    //     path: "journeys",
    //     loadChildren: () =>
    //       import("src/app/views/journeys/journeys.module").then(
    //         (m) => m.JourneysModule
    //       ),
    //   },
    //   {
    //     path: "wishlist",
    //     loadChildren: () =>
    //       import("src/app/views/wishlist/wishlist.module").then(
    //         (m) => m.WishlistModule
    //       ),
    //   },
    //   { path: "settings", component: SettingsComponent },
    //   { path: "info", component: InfoComponent },
    //   { path: "**", redirectTo: "" },
    // ],
  },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
