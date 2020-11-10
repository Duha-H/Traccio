import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { KeysPipe } from './utils/keys.pipe';
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
import { ToastListComponent } from './shared-components/notification/toast-list.component';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { NewApplicationViewComponent } from './shared-components/application-view/new-application-view.component';
import { WishlistApplicationViewComponent } from './shared-components/application-view/wishlist-application-view.component';
import { ExistingApplicationViewComponent } from './shared-components/application-view/existing-application-view.component';
import { FAQComponent } from './shared-components/faqs/faq.component';
import { SafeHTMLPipe } from './utils/safe-html.pipe';
import { ValuesPipe } from './utils/values.pipe';
import { ScrollButtonComponent } from './shared-components/scroll-button/scroll-button.component';

@NgModule({
  declarations: [
    ArrayFilterPipe,
    AppFilterPipe,
    // KeysPipe,
    SafeHTMLPipe,
    TextFieldComponent,
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
    FAQComponent,
    ScrollButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnDirtyErrorStateMatcher },
    ArrayFilterPipe,
    AppFilterPipe,
    SafeHTMLPipe,
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
    MatCheckboxModule,
    ArrayFilterPipe,
    AppFilterPipe,
    TextFieldComponent,
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
    FAQComponent,
    ScrollButtonComponent,
  ]
})
export class SharedModule { }
