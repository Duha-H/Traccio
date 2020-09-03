import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormControl, Validators } from '@angular/forms';
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: "text-field",
  templateUrl: './text-field.component.html',
  styleUrls: ["./text-field.component.css"],
})
export class TextFieldComponent implements OnInit {
  @Input() text: string;
  @Input() label = '';
  @Input() type = 'text';
  @Input() required = false;
  @Input() displayLabel = true;
  @Input() displayPlaceholder = true;
  @Input() suffixIcon = '';
  @Input() width = 350;
  @Input() height = 18;
  @Input() fontSize = 10;
  @Input() fontColor = 'var(--text)';
  @Input() center = true;
  @Input() showUpdatedBorder = false; // unique border color if field value has been changed
  @Input() displayErrorMessage = false;
  @Input() displayFeedback = false;
  @Input() maxLength = 60;
  @Input() control = new FormControl('', [
    Validators.required,
  ]);
  @Output() inputChange = new EventEmitter();
  @Output() inputFocus = new EventEmitter();
  @ViewChild('textfield', { static: true }) input: ElementRef;
  fieldEmpty = true;
  fieldLabel = this.label;
  valueUpdated = false;
  visibilityIconName = "visibility_off";
  currType = this.type; // using a second type property because it might change (e.g. password visibility)
  value = this.text;
  inFocus = false;
  // invalid = false;

  constructor(public rs: ResizeService) {}

  ngOnInit() {
    this.currType = this.type;
    this.value = this.text;
    this._setLabel();
  }

  onInput() {
    this.valueUpdated = true;
    this.inputChange.emit(this.value);
    this._setLabel();
  }

  togglePasswordVisibility() {
    if (this.visibilityIconName === "visibility") {
      this.visibilityIconName = "visibility_off";
      this.currType = "password";
    } else {
      this.visibilityIconName = "visibility";
      this.currType = "text";
    }
  }

  resetValue(value?: string) {
    this.value = value !== undefined ? value : this.text;
  }

  focus() {
    this.input.nativeElement.focus();
  }

  onFocus() {
    this.inputFocus.emit(true);
    this.inFocus = true;
  }

  onFocusOut() {
    this.inFocus = false;
    this.inputFocus.emit(false);
    // this.invalid = this.control.invalid;
  }

  private _setLabel() {
    if (this.value === undefined) { // verbose check because value can be an empty string
      this.fieldLabel = "\n";
    } else {
      this.fieldLabel = this.label;
    }
  }
}
