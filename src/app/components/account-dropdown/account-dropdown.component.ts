import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { DropdownItem } from 'src/app/components/types';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.css']
})
export class AccountDropdownComponent implements OnInit, OnChanges {

  toggleClick = false;
  @Input() dropdownItems: DropdownItem[];
  @Input() displayDropdown: boolean;
  @ViewChild("dropdownContainer") dropdownRef: ElementRef;

  constructor() { }

  ngOnInit(): void {
    if (!this.dropdownItems) {
      throw new TypeError('AccountDropdown: No dropdown items specified.');
    }
  }

  ngOnChanges() {
    if (this.dropdownRef) {
      if (this.displayDropdown) {
        this.dropdownRef.nativeElement.className = 'dropdown-container visible';
      } else {
        this.dropdownRef.nativeElement.className = 'dropdown-container hidden';
        this.toggleClick = false;
      }
    }
  }

  onItemClick(item: DropdownItem) {
    if (item.callback) {
      item.callback();
    }
    if (item.type === 'toggle') {
      this.toggleClick = !this.toggleClick;
    }
  }

}
