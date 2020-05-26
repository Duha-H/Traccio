import { Component, OnInit, Input, Output, DoCheck, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'text-field',
  template: '\
  <form>\
    <div class="input-container">\
      <div>\
        <input type="{{currType}}" [(ngModel)]="text" [value]="text" (input)="onInput()" \
          name="inputField" #field="ngModel" placeholder="{{label}}" class="input"/>\
        <mat-icon *ngIf="type == \'password\'" (click)="togglePasswordVisibility()" >{{visibilityIconName}}</mat-icon>\
      </div>\
      <label *ngIf="displayLabel" for="inputField" >{{fieldLabel}}</label>\
    </div>\
  </form>',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements OnInit {

  @Input() label = '';
  @Input() type = 'text';
  @Input() required = false;
  @Input() displayLabel = true;
  @Output() inputChange = new EventEmitter();
  text: string;
  fieldEmpty = true;
  fieldLabel = this.label;
  visibilityIconName = 'visibility_off';
  currType = this.type;

  constructor() { }

  ngOnInit() {
    this.currType = this.type;
  }

  onInput() {
    this.inputChange.emit(this.text);
    if (this.text === '') {
      this.fieldLabel = '\n';
    } else {
      this.fieldLabel = this.label;
    }
  }

  togglePasswordVisibility() {
    if (this.visibilityIconName === 'visibility') {
      this.visibilityIconName = 'visibility_off';
      this.currType = 'password';
    } else {
      this.visibilityIconName = 'visibility';
      this.currType = 'text';
    }
  }

}
