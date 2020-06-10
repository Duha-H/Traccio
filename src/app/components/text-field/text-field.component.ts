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
    <div class="input-container" style="max-width: {{width}}px;">\
      <p *ngIf="type == \'email\' && field.invalid" class="warning-text">{{label}} is not valid</p>\
      <div style="height: {{height}}px;">\
        <input type="{{currType}}" [(ngModel)]="text" [value]="text" (input)="onInput()" maxLength="60" \
          style="font-size: {{fontSize}}pt; color: {{fontColor}};" \
          name="inputField" #field="ngModel" placeholder="{{label}}" class="input" email="{{type == \'email\'}}"/>\
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
  @Input() fontColor = 'var(--text-dark)';
  @Input() text: string;
  @Output() inputChange = new EventEmitter();
  fieldEmpty = true;
  fieldLabel = this.label;
  visibilityIconName = "visibility_off";
  currType = this.type; // using a second type property because it might change (e.g. password visibility)

  constructor() {}

  ngOnInit() {
    this.currType = this.type;
  }

  onInput() {
    this.inputChange.emit(this.text);
    if (this.text === "") {
      this.fieldLabel = "\n";
    } else {
      this.fieldLabel = this.label;
    }
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
}
