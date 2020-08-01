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
import { TextFieldComponent } from './components/text-field/text-field.component';

@NgModule({
  declarations: [
    ArrayFilterPipe,
    TextFieldComponent,
  ],
  imports: [
    // CommonModule,
    // FormsModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: OnDirtyErrorStateMatcher },
    ArrayFilterPipe,
  ],
  exports: [
    CommonModule,
    // BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    ArrayFilterPipe,
  ]
})
export class SharedModule { }