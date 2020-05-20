import { Component, OnInit, Input } from '@angular/core';
import { DropdownItem } from 'src/app/views/app-wrapper/app-wrapper.component';
import { UserStoreService } from 'src/app/models/user-store.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.css']
})
export class AccountDropdownComponent implements OnInit {

  @Input() dropdownItems: DropdownItem[];

  constructor(private userStore: UserStoreService) { }

  ngOnInit(): void {
    if (!this.dropdownItems) {
      throw new TypeError('AccountDropdown: No dropdown items specified.');
    }
  }

}
