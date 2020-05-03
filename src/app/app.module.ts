import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { JourneysComponent } from './views/journeys/journeys.component';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { SettingsComponent } from './views/settings/settings.component';
import { RectItemComponent } from './components/rect-item/rect-item.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JourneysComponent,
    LoginComponent,
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
    RectItemComponent
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
  ],
  providers: [
    AmplifyService,
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
