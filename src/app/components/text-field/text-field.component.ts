import { Component, OnInit, Input, Output, DoCheck, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'text-field',
  // templateUrl: './text-field.component.html',
  template: '\
  <form>\
    <div class="input-container">\
      <input type="{{type}}" [(ngModel)]="text" [value]="text" (input)="onInput()" \
        name="inputField" #field="ngModel" placeholder="{{label}}" />\
      <label for="inputField" >{{fieldLabel}}</label>\
    </div>\
  </form>',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements OnInit {

  @Input() label: string;
  @Input() type = "text";
  @Input() required = false;
  @Output() inputChange = new EventEmitter();
  text: string;
  fieldEmpty = true;
  fieldLabel = this.label;

  constructor() { }

  ngOnInit(): void {
  }

  onInput() {
    this.inputChange.emit(this.text);
    if (this.text === '') {
      this.fieldLabel = '\n';
    } else {
      this.fieldLabel = this.label;
    }
  }

}
