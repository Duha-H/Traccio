import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from "@angular/core";
import { Auth } from "aws-amplify";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { DropdownItem } from 'src/app/components/types';
import { TextFieldComponent } from 'src/app/components/text-field/text-field.component';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ResizeService } from 'src/app/controllers/resize.service';

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
  @ViewChild(TextFieldComponent) searchField: TextFieldComponent;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
    private prefStore: PreferencesStoreService,
    public resizeService: ResizeService
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
      console.log(this);
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
  }

  toggleAccountDropdown() {
    this.displayDropdown = !this.displayDropdown;
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
