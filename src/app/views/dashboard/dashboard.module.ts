import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ResponsiveCalendarComponent } from 'src/app/components/responsive-calendar.component';
import { ResponsivePieComponent } from 'src/app/components/responsive-pie.component';
import { DashboardComponent } from './dashboard.component';
import { ArrayFormatterPipe } from 'src/app/utils/array-formatter.pipe';
import { AppFilterPipe } from './app-filter.pipe';
import { ResponsiveLineComponent } from 'src/app/components/responsive-line.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ResponsiveLineComponent,
    ResponsiveCalendarComponent,
    ResponsivePieComponent,
    ArrayFormatterPipe,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: [
    ArrayFormatterPipe,
  ],
  exports: []
})
export class DashboardModule { }
