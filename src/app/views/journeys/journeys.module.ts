import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { JourneysComponent } from './journeys.component';
import { ApplicationListComponent } from './journey-view/application-list.component';
import { JourneyViewComponent } from './journey-view/journey-view.component';
import { JourneyListComponent } from './journey-list/journey-list.component';
import { SharedModule } from 'src/app/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppFilterPipe } from '../dashboard/app-filter.pipe';
import { JourneysRoutingModule } from './journeys-routing.module';
import { JourneyInputComponent } from 'src/app/shared-components/journey-input/journey-input.component';
import { RectItemComponent } from 'src/app/shared-components/rect-item/rect-item.component';
import { SliderContainerComponent } from 'src/app/shared-components/slider-container/slider-container.component';
import 'hammerjs';

@NgModule({
  declarations: [
    RectItemComponent,
    SliderContainerComponent,
    JourneysComponent,
    ApplicationListComponent,
    JourneyViewComponent,
    JourneyListComponent,
    JourneyInputComponent,
    // AppFilterPipe,
  ],
  imports: [
    SharedModule,
    HammerModule,
    JourneysRoutingModule,
    // MatGridListModule,
    // MatCheckboxModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [
    // AppFilterPipe,
  ],
  exports: []
})
export class JourneysModule { }
