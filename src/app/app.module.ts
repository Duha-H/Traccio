import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { JourneysComponent } from './views/journeys/journeys.component';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SettingsComponent } from './views/settings/settings.component';
import { RectItemComponent } from './components/rect-item/rect-item.component';
import { JourneyInputComponent } from './components/journey-input/journey-input.component';
import { JourneyViewComponent } from './views/journey-view/journey-view.component';
import { UserStoreService } from './models/user-store.service';
import { JourneyListComponent } from './views/journey-list/journey-list.component';
import { ApplicationInputComponent } from './components/application-input/application-input.component';
import { SearchComponent } from './views/search/search.component';
import { ConfirmSignupComponent } from './auth/confirm-signup/confirm-signup.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JourneysComponent,
    LoginComponent,
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
    RectItemComponent,
    JourneyInputComponent,
    JourneyViewComponent,
    JourneyListComponent,
    ApplicationInputComponent,
    SearchComponent,
    ConfirmSignupComponent
  ],
  imports: [
    BrowserModule,
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
  ],
  providers: [
    AmplifyService,
    UserStoreService,
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
