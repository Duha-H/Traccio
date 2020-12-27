import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountRecoveryComponent } from 'src/app/auth/account-recovery/account-recovery.component';
import { ConfirmSignupComponent } from 'src/app/auth/confirm-signup/confirm-signup.component';
import { ConfirmSignUpGuard } from 'src/app/auth/guards/confirm-signup-guard.service';
import { AccountRecoveryGuard } from 'src/app/auth/guards/recovery-guard.service';
import { SignInGuard } from 'src/app/auth/guards/signin-guard.service';
import { SignInComponent } from 'src/app/auth/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/auth/sign-up/sign-up.component';
import { AboutComponent } from './about.component';
import { LandingFAQComponent } from './landing-faq.component';
import { LandingWrapperComponent } from './landing-wrapper.component';
import { LandingComponent } from './landing.component';
import { NotFoundComponent } from './not-found.component';
import { PrivacyComponent } from './privacy.component';


const routes: Routes = [
  {
    path: "",
    component: LandingWrapperComponent,
    children: [
      { path: "", component: LandingComponent },
      { path: "about", component: AboutComponent },
      { path: "faq", component: LandingFAQComponent },
      { path: "signin", component: SignInComponent, canActivate: [SignInGuard] },
      { path: "signup", component: SignUpComponent, canActivate: [SignInGuard] },
      {
        path: "confirmsignup",
        component: ConfirmSignupComponent,
        canActivate: [ConfirmSignUpGuard],
      },
      {
        path: "accountrecovery",
        component: AccountRecoveryComponent,
        canActivate: [AccountRecoveryGuard],
      },
      { path: "privacy", component: PrivacyComponent },
      { path: "404", component: NotFoundComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule { }
