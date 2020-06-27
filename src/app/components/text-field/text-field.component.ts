import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "text-field",
  template:
    '\
  <form>\
    <div class="{{center ? \'input-container center\' : \'input-container\'}}" style="max-width: {{width}}px;">\
      <p *ngIf="type == \'email\' && field.invalid && displayError" class="warning-text">{{label}} is not valid</p>\
      <div class="{{showUpdatedBorder ? \'updated\' : \'\'}}">\
        <input type="{{currType}}" [(ngModel)]="value" [value]="value" (input)="onInput()" maxLength="60" \
          style="font-size: {{fontSize}}pt; color: {{fontColor}};" \
          name="inputField" #field="ngModel" placeholder="{{label}}"\
          email="{{type == \'email\'}}"/>\
        <mat-icon *ngIf="type == \'password\'" (click)="togglePasswordVisibility()">{{visibilityIconName}}</mat-icon>\
        <mat-icon *ngIf="suffixIcon && type != \'password\'">{{suffixIcon}}</mat-icon>\
      </div>\
      <label *ngIf="displayLabel" for="inputField" >{{fieldLabel}}</label>\
    </div>\
  </form>',
  styleUrls: ["./text-field.component.css"],
})
export class TextFieldComponent implements OnInit {
  @Input() label = "";
  @Input() type = "text";
  @Input() required = false;
  @Input() displayLabel = true;
  @Input() suffixIcon = '';
  @Input() width = 350;
  @Input() height = 18;
  @Input() fontSize = 10;
  @Input() fontColor = 'var(--text)';
  @Input() center = true;
  @Input() text: string;
  @Input() showUpdatedBorder = false; // unique border color if field value has been changed
  @Input() displayError = true;
  @Output() inputChange = new EventEmitter();
  fieldEmpty = true;
  fieldLabel = this.label;
  valueUpdated = false;
  visibilityIconName = "visibility_off";
  currType = this.type; // using a second type property because it might change (e.g. password visibility)
  value = this.text;

  constructor() {}

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

  private _setLabel() {
    if (this.value === undefined) { // verbose check because value can be an empty string
      this.fieldLabel = "\n";
    } else {
      this.fieldLabel = this.label;
    }
  }
}
