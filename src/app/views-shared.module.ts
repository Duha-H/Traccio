import { NgModule } from '@angular/core';

/** Material imports */
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/** App module imports */
import { ArrayFilterPipe } from './utils/array-filter.pipe';
import { KeysPipe } from './utils/keys.pipe';
import { OverlayComponent } from './shared-components/overlay/overlay.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BreadcrumbsComponent } from './shared-components/breadcrumbs/breadcrumbs.component';
import { ApplicationViewComponent } from './shared-components/application-view/application-view.component';
import { TimelineComponent } from './shared-components/timeline/timeline.component';
import { TimelineTooltipComponent } from './shared-components/timeline/timeline-tooltip.component';
import { AppFilterPipe } from './views/dashboard/app-filter.pipe';
import { ConfettiComponent } from './shared-components/confetti/confetti.component';
import { ToastComponent } from './shared-components/notification/toast.component';
import { ToastListComponent } from './shared-components/notification/toast-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NewApplicationViewComponent } from './shared-components/application-view/new-application-view.component';
import { WishlistApplicationViewComponent } from './shared-components/application-view/wishlist-application-view.component';
import { ExistingApplicationViewComponent } from './shared-components/application-view/existing-application-view.component';
import { BaseSharedModule } from './base-shared.module';

@NgModule({
  declarations: [
    ArrayFilterPipe,
    AppFilterPipe,
    OverlayComponent,
    BreadcrumbsComponent,
    TimelineComponent,
    TimelineTooltipComponent,
    ApplicationViewComponent,
    NewApplicationViewComponent,
    WishlistApplicationViewComponent,
    ExistingApplicationViewComponent,
    ConfettiComponent,
    ToastListComponent,
    ToastComponent,
  ],
  imports: [
    BaseSharedModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
  providers: [
    ArrayFilterPipe,
    AppFilterPipe,
    KeysPipe,
  ],
  exports: [
    BaseSharedModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatListModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ArrayFilterPipe,
    AppFilterPipe,
    OverlayComponent,
    BreadcrumbsComponent,
    TimelineComponent,
    TimelineTooltipComponent,
    ApplicationViewComponent,
    NewApplicationViewComponent,
    WishlistApplicationViewComponent,
    ExistingApplicationViewComponent,
    ToastListComponent,
    ToastComponent,
  ]
})
export class ViewsSharedModule { }
