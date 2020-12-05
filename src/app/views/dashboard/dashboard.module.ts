import { NgModule } from '@angular/core';
import { ViewsSharedModule } from 'src/app/views-shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ResponsiveCalendarComponent } from 'src/app/shared-components/responsive-calendar.component';
import { ResponsivePieComponent } from 'src/app/shared-components/responsive-pie.component';
import { DashboardComponent } from './dashboard.component';
import { ArrayFormatterPipe } from 'src/app/utils/array-formatter.pipe';
import { AppFilterPipe } from './app-filter.pipe';
import { ResponsiveLineComponent } from 'src/app/shared-components/responsive-line.component';
// import { RecentStatsComponent } from './recent-stats.component';
// import { StatusBreakdownComponent } from './status-breakdown.component';
import { BaseSharedModule } from 'src/app/base-shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DashboardComponent,
    ResponsiveLineComponent,
    // RecentStatsComponent,
    // StatusBreakdownComponent,
    ResponsiveCalendarComponent,
    ResponsivePieComponent,
    ArrayFormatterPipe,
  ],
  imports: [
    CommonModule,
    BaseSharedModule,
    ViewsSharedModule,
    DashboardRoutingModule,
  ],
  providers: [
    ArrayFormatterPipe,
  ],
  exports: []
})
export class DashboardModule { }
