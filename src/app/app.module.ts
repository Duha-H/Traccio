import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { AuthModule } from './auth/auth.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { JourneysComponent } from './views/journeys/journeys.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SettingsComponent } from './views/settings/settings.component';
import { RectItemComponent } from './components/rect-item/rect-item.component';
import { JourneyInputComponent } from './components/journey-input/journey-input.component';
import { JourneyViewComponent } from './views/journey-view/journey-view.component';
import { ApplicationListComponent } from './views/journey-view/application-list.component';
import { UserStoreService } from './models/user-store.service';
import { JourneyListComponent } from './views/journey-list/journey-list.component';
import { ApplicationInputComponent } from './components/application-input/application-input.component';
import { SearchComponent } from './views/search/search.component';
import { ConfirmSignupComponent } from './auth/confirm-signup/confirm-signup.component';
import { ResponsiveCalendarComponent } from './components/responsive-calendar.component';
import { ResponsivePieComponent } from './components/responsive-pie.component';
import { AppWrapperComponent } from './views/app-wrapper/app-wrapper.component';
import { OnDirtyErrorStateMatcher } from './controllers/on-dirty-error-state-matcher';
import { AccountDropdownComponent } from './components/account-dropdown/account-dropdown.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { AccountRecoveryComponent } from './auth/account-recovery/account-recovery.component';
import { ForgotPasswordComponent } from './auth/account-recovery/forgot-password.component';
import { NewPasswordComponent } from './auth/account-recovery/new-password.component';
import { ResetSuccessfulComponent } from './auth/account-recovery/reset-successful.component';
import { SignupSuccessfulComponent } from './auth/confirm-signup/signup-successful.component';
import { AppFilterPipe } from './views/dashboard/app-filter.pipe';
import { SearchPipe } from './views/search/search-pipe.pipe';
import { KeysPipe } from './views/search/keys-pipe.pipe';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { ProfileSettingsComponent } from './views/settings/profile-settings.component';
import { PreferenceSettingsComponent } from './views/settings/preference-settings.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ApplicationViewComponent } from './views/application-view/application-view.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineTooltipComponent } from './components/timeline/timeline-tooltip.component';
import { WishlistWrapperComponent } from './views/wishlist/wishlist-wrapper.component';
import { OverflowWrapperComponent } from './components/overflow-wrapper/overflow-wrapper.component';
import { SliderContainerComponent } from './components/slider-container/slider-container.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JourneysComponent,
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
    RectItemComponent,
    JourneyInputComponent,
    JourneyViewComponent,
    JourneyListComponent,
    ApplicationInputComponent,
    SearchComponent,
    ConfirmSignupComponent,
    ResponsiveCalendarComponent,
    ResponsivePieComponent,
    AppWrapperComponent,
    AccountDropdownComponent,
    TextFieldComponent,
    AccountRecoveryComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    ResetSuccessfulComponent,
    SignupSuccessfulComponent,
    AppFilterPipe,
    SearchPipe,
    KeysPipe,
    WishlistComponent,
    ApplicationListComponent,
    OverlayComponent,
    ProfileSettingsComponent,
    PreferenceSettingsComponent,
    BreadcrumbsComponent,
    ApplicationViewComponent,
    TimelineComponent,
    TimelineTooltipComponent,
    WishlistWrapperComponent,
    OverflowWrapperComponent,
    SliderContainerComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    CommonModule,
    AppRoutingModule,
    // AmplifyUIAngularModule,
    AmplifyAngularModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatGridListModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    AuthModule,
  ],
  providers: [
    AmplifyService,
    UserStoreService,
    { provide: ErrorStateMatcher, useClass: OnDirtyErrorStateMatcher },
    AppFilterPipe,
    SearchPipe,
    KeysPipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    RectItemComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule {

}
