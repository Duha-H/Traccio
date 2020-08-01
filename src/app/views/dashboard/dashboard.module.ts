import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ResponsiveCalendarComponent } from 'src/app/components/responsive-calendar.component';
import { ResponsivePieComponent } from 'src/app/components/responsive-pie.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ResponsivePieComponent,
    ResponsiveCalendarComponent,
    ResponsivePieComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: [],
  exports: []
})
export class DashboardModule { }
