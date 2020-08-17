import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// Guards
import { AuthGuardService as AuthGuard } from "./controllers/auth-guard.service";
import { SignInGuard } from "./auth/guards/signin-guard.service";
import { ConfirmSignUpGuard } from "./auth/guards/confirm-signup-guard.service";
import { AccountRecoveryGuard } from "./auth/guards/recovery-guard.service";
// Views
import { LandingComponent } from './views/landing/landing.component';
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { ConfirmSignupComponent } from "./auth/confirm-signup/confirm-signup.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { AppWrapperComponent } from './views/app-wrapper/app-wrapper.component';
import { AccountRecoveryComponent } from './auth/account-recovery/account-recovery.component';

const routes: Routes = [
  { path: "", component: LandingComponent, canActivate: [SignInGuard] },
  { path: "home", canActivate: [AuthGuard], component: AppWrapperComponent,
    children: [
      { path: "",
        loadChildren: () => import('src/app/views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: "journeys",
        loadChildren: () => import('src/app/views/journeys/journeys.module').then(m => m.JourneysModule)
      },
      {
        path: "wishlist",
        loadChildren: () => import('src/app/views/wishlist/wishlist.module').then(m => m.WishlistModule)
      },
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: "signin", component: SignInComponent, canActivate: [SignInGuard] },
  { path: "signup", component: SignUpComponent, canActivate: [SignInGuard] },
  { path: "confirmsignup", component: ConfirmSignupComponent, canActivate: [ConfirmSignUpGuard] },
  { path: "accountrecovery", component: AccountRecoveryComponent, canActivate: [AccountRecoveryGuard] },
  { path: '**', redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
