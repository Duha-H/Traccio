import { HammerModule, BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ViewsSharedModule } from './views-shared.module';

import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

/** Material imports */
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';

/** App Component imports */
import { ForgotPasswordComponent } from './auth/account-recovery/forgot-password.component';
import { NewPasswordComponent } from './auth/account-recovery/new-password.component';
import { ResetSuccessfulComponent } from './auth/account-recovery/reset-successful.component';
import { SignupSuccessfulComponent } from './auth/confirm-signup/signup-successful.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardGraphicComponent } from './views/landing/graphics/dashboard-graphic.component';
import { JourneysGraphicComponent } from './views/landing/graphics/journeys-graphic.component';
import { ApplicationGraphicComponent } from './views/landing/graphics/application-graphic.component';
import { SearchGraphicComponent } from './views/landing/graphics/search-graphic.component';
import { BaseSharedModule } from './base-shared.module';
import { LandingModule } from './views/landing/landing.module';
import { AppWrapperModule } from './views/app-wrapper/app-wrapper.module';

@NgModule({
  declarations: [
    AppComponent,
    // ForgotPasswordComponent,
    // NewPasswordComponent,
    // ResetSuccessfulComponent,
    // SignupSuccessfulComponent,
    DashboardGraphicComponent,
    JourneysGraphicComponent,
    ApplicationGraphicComponent,
    SearchGraphicComponent,
  ],
  imports: [
    BaseSharedModule,
    ViewsSharedModule,
    LandingModule,
    AppWrapperModule,
    // CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatDatepickerModule,
    AuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [ ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
