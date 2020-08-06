import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Material imports */
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/** App module imports */
import { OnDirtyErrorStateMatcher } from './controllers/on-dirty-error-state-matcher';
import { ArrayFilterPipe } from './utils/array-filter.pipe';
import { TextFieldComponent } from './shared-components/text-field/text-field.component';
import { KeysPipe } from './views/search/keys-pipe.pipe';
import { OverlayComponent } from './shared-components/overlay/overlay.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BreadcrumbsComponent } from './shared-components/breadcrumbs/breadcrumbs.component';
import { ApplicationViewComponent } from './shared-components/application-view/application-view.component';
import { TimelineComponent } from './shared-components/timeline/timeline.component';
import { TimelineTooltipComponent } from './shared-components/timeline/timeline-tooltip.component';
import { AppFilterPipe } from './views/dashboard/app-filter.pipe';
import { RouterModule } from '@angular/router';
import { ConfettiComponent } from './shared-components/confetti/confetti.component';
import { ToastComponent } from './shared-components/notification/toast.component';

@NgModule({
  declarations: [
    ArrayFilterPipe,
    AppFilterPipe,
    // KeysPipe,
    TextFieldComponent,
    OverlayComponent,
    BreadcrumbsComponent,
    TimelineComponent,
    TimelineTooltipComponent,
    ApplicationViewComponent,
    ConfettiComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnDirtyErrorStateMatcher },
    ArrayFilterPipe,
    AppFilterPipe,
    // KeysPipe,
  ],
  exports: [
    CommonModule,
    // BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    ArrayFilterPipe,
    AppFilterPipe,
    TextFieldComponent,
    OverlayComponent,
    BreadcrumbsComponent,
    TimelineComponent,
    TimelineTooltipComponent,
    ApplicationViewComponent,
    ToastComponent
  ]
})
export class SharedModule { }
