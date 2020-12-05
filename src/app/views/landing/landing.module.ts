import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccountRecoveryComponent } from 'src/app/auth/account-recovery/account-recovery.component';
import { ConfirmSignupComponent } from 'src/app/auth/confirm-signup/confirm-signup.component';
import { SignInComponent } from 'src/app/auth/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/auth/sign-up/sign-up.component';
import { BaseSharedModule } from 'src/app/base-shared.module';
import { ViewsSharedModule } from 'src/app/views-shared.module';
import { AboutComponent } from './about.component';
import { LandingFAQComponent } from './landing-faq.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingWrapperComponent } from './landing-wrapper.component';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [
    LandingWrapperComponent,
    LandingComponent,
    LandingFAQComponent,
    AboutComponent,
    SignInComponent,
    SignUpComponent,
    ConfirmSignupComponent,
    AccountRecoveryComponent,
  ],
  imports: [
    BaseSharedModule,
    LandingRoutingModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class LandingModule { }
