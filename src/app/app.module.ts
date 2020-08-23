import { HammerModule, BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';

import { AmplifyService } from 'aws-amplify-angular';
import { AuthModule } from './auth/auth.module';

/** Material imports */
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';

/** App Component imports */
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SettingsComponent } from './views/settings/settings.component';
import { LandingComponent } from './views/landing/landing.component';
import { ApplicationInputComponent } from './shared-components/application-input/application-input.component';
import { SearchComponent } from './views/search/search.component';
import { ConfirmSignupComponent } from './auth/confirm-signup/confirm-signup.component';
import { AppWrapperComponent } from './views/app-wrapper/app-wrapper.component';
import { AccountDropdownComponent } from './shared-components/account-dropdown/account-dropdown.component';
import { AccountRecoveryComponent } from './auth/account-recovery/account-recovery.component';
import { ForgotPasswordComponent } from './auth/account-recovery/forgot-password.component';
import { NewPasswordComponent } from './auth/account-recovery/new-password.component';
import { ResetSuccessfulComponent } from './auth/account-recovery/reset-successful.component';
import { SignupSuccessfulComponent } from './auth/confirm-signup/signup-successful.component';
import { SearchPipe } from './views/search/search-pipe.pipe';
import { KeysPipe } from './views/search/keys-pipe.pipe';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { ProfileSettingsComponent } from './views/settings/profile-settings.component';
import { PreferenceSettingsComponent } from './views/settings/preference-settings.component';
import { WishlistWrapperComponent } from './views/wishlist/wishlist-wrapper.component';
import { OverflowWrapperComponent } from './shared-components/overflow-wrapper/overflow-wrapper.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardGraphicComponent } from './views/landing/graphics/dashboard-graphic.component';
import { JourneysGraphicComponent } from './views/landing/graphics/journeys-graphic.component';
import { ApplicationGraphicComponent } from './views/landing/graphics/application-graphic.component';
import { SearchGraphicComponent } from './views/landing/graphics/search-graphic.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
    ApplicationInputComponent,
    SearchComponent,
    ConfirmSignupComponent,
    AppWrapperComponent,
    AccountDropdownComponent,
    AccountRecoveryComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    ResetSuccessfulComponent,
    SignupSuccessfulComponent,
    SearchPipe,
    KeysPipe,
    // WishlistComponent,
    ProfileSettingsComponent,
    PreferenceSettingsComponent,
    // WishlistWrapperComponent,
    OverflowWrapperComponent,
    DashboardGraphicComponent,
    JourneysGraphicComponent,
    ApplicationGraphicComponent,
    SearchGraphicComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatDatepickerModule,
    MatTabsModule,
    AuthModule,
  ],
  providers: [
    AmplifyService,
    SearchPipe,
    KeysPipe,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
