import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountDropdownComponent } from 'src/app/shared-components/account-dropdown/account-dropdown.component';
import { OverflowWrapperComponent } from 'src/app/shared-components/overflow-wrapper/overflow-wrapper.component';
import { ViewsSharedModule } from 'src/app/views-shared.module';
import { KeysPipe } from 'src/app/utils/keys.pipe';
import { SearchPipe } from '../search/search-pipe.pipe';
import { PreferenceSettingsComponent } from '../settings/preference-settings.component';
import { ProfileSettingsComponent } from '../settings/profile-settings.component';
import { AppWrapperComponent } from './app-wrapper.component';
import { BaseSharedModule } from 'src/app/base-shared.module';
import { SearchComponent } from '../search/search.component';
import { AppWrapperRoutingModule } from './app-wrapper-routing.module';
import { InfoComponent } from '../info/info.component';
import { SafeHTMLPipe } from 'src/app/utils/safe-html.pipe';
import { SettingsComponent } from '../settings/settings.component';

@NgModule({
  declarations: [
    AppWrapperComponent,
    AccountDropdownComponent,
    InfoComponent,
    // SearchPipe,
    // KeysPipe,
    // ValuesPipe,
    SettingsComponent,
    ProfileSettingsComponent,
    PreferenceSettingsComponent,
    OverflowWrapperComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    BaseSharedModule,
    ViewsSharedModule,
    MatGridListModule,
    MatDatepickerModule,
    MatTabsModule,
    AppWrapperRoutingModule,
  ],
  providers: [
    SearchPipe,
    SafeHTMLPipe,
    KeysPipe,
    // ValuesPipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppWrapperModule { }
