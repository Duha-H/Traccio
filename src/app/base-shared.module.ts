import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OnDirtyErrorStateMatcher } from './controllers/on-dirty-error-state-matcher';
import { FAQComponent } from './shared-components/faqs/faq.component';
import { ScrollButtonComponent } from './shared-components/scroll-button/scroll-button.component';
import { TextFieldComponent } from './shared-components/text-field/text-field.component';
import { KeysPipe } from './utils/keys.pipe';
import { SafeHTMLPipe } from './utils/safe-html.pipe';
import { ValuesPipe } from './utils/values.pipe';
import { SearchPipe } from './views/search/search-pipe.pipe';

@NgModule({
  declarations: [
    // Components
    TextFieldComponent,
    FAQComponent,
    ScrollButtonComponent,
    // Pipes
    ValuesPipe,
    KeysPipe,
    SearchPipe,
    SafeHTMLPipe,
  ],
  imports: [
    // Global Module imports
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    TextFieldComponent,
    FAQComponent,
    SearchPipe,
    SafeHTMLPipe,
    KeysPipe,
    ScrollButtonComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnDirtyErrorStateMatcher },
    ValuesPipe,
    KeysPipe,
    SearchPipe,
    SafeHTMLPipe,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class BaseSharedModule { }