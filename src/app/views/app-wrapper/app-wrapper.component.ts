import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, QueryList } from "@angular/core";
import { Auth } from "aws-amplify";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DropdownItem } from 'src/app/shared-components/types';
import { TextFieldComponent } from 'src/app/shared-components/text-field/text-field.component';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ResizeService } from 'src/app/controllers/resize.service';
import { NotificationService } from 'src/app/controllers/notification.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: "app-wrapper",
  templateUrl: "./app-wrapper.component.html",
  styleUrls: ["./app-wrapper.component.css"],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    "(document:click)": "onWrapperClick($event)",
  },
})
export class AppWrapperComponent implements OnInit {
  signedIn: boolean;
  displayDropdown = false;
  dropdownItems: DropdownItem[] = [
    { text: "Signed in as: user@email.com", type: "item"},
    { text: "Account settings", type: "link", link: "/settings"},
    { text: "Theme: dark", type: "toggle", callback: this.toggleTheme.bind(this) },
    { text: "Sign out", type: "button", callback: this.signOut.bind(this) },
  ];
  searchQuery = '';
  searchSubject: BehaviorSubject<string> = new BehaviorSubject(this.searchQuery);

  @Output() submitSearch = new EventEmitter();
  @ViewChild("navHomeIcon", { read: ElementRef }) currNavIconRef: HTMLElement;
  @ViewChild("dropdownButton") dropdownRef: ElementRef;
  @ViewChild("searchField", { static: false, read: ElementRef }) searchFieldElement: ElementRef;
  @ViewChild(TextFieldComponent) searchField: TextFieldComponent;
  @ViewChild("activateSearchButton", { static: false, read: ElementRef }) activateSearchButton: ElementRef;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
    private prefStore: PreferencesStoreService,
    public resizeService: ResizeService,
    public notificationService: NotificationService,
  ) {  }

  ngOnInit() {
    this.prefStore.preferences.subscribe(preferences => {
      this.dropdownItems[2].text = `Theme: ${preferences.theme.name}`; // TODO: update text dynamically
    });

    this.userStore.user.subscribe(user => {
      this.dropdownItems[0].text = `Signed in as: ${user.email}`;
    });
  }

  async signOut() {
    try {
      await Auth.signOut();
      this.signedIn = false;
      this.userStore.clearData();
      this.router.navigate(["signin"]);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  onNavIconClick(ref: HTMLElement) {  }

  onWrapperClick(event: Event) {
    // If a click is registered outside of the dropdown toggle button
    // hide the dropdown
    if (!this.dropdownRef.nativeElement.contains(event.target)) {
      this.displayDropdown = false;
    }
    // If a click is registered outside of the search field toggle button
    // and mobile size is active, hide the search field
    if (
      this.activateSearchButton &&
      !this.activateSearchButton.nativeElement.contains(event.target) &&
      this.resizeService.mobileSize$.value &&
      !this.searchQuery
    ) {
      this.searchFieldElement.nativeElement.classList = 'toolbar-search';
      this.activateSearchButton.nativeElement.style.display = 'block';
    }
  }

  toggleAccountDropdown() {
    this.displayDropdown = !this.displayDropdown;
  }

  displaySearchField() {
    this.searchFieldElement.nativeElement.classList += ' visible';
    this.searchField.focus();
    this.activateSearchButton.nativeElement.style.display = 'none';
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  clearSearch() {
    // use to clear search field when navigating away or on the field's clearEvent
    this.searchQuery = '';
    this.searchField.resetValue('');
  }

  toggleTheme() {
    this.prefStore.toggleTheme();
  }
}
