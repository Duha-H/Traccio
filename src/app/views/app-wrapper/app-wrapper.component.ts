import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, QueryList } from "@angular/core";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DropdownItem } from 'src/app/shared-components/types';
import { TextFieldComponent } from 'src/app/shared-components/text-field/text-field.component';
import { PreferencesStoreService } from 'src/app/controllers/preferences-store.service';
import { ResizeService } from 'src/app/controllers/resize.service';
import { NotificationService } from 'src/app/controllers/notification.service';
import { Notification } from 'src/app/models/notification';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { LoaderService } from 'src/app/controllers/loader.service';

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
    { text: "Account Preferences", type: "link", link: "/home/settings", params: { tab: 'preferences' } },
    { text: "Theme: dark", type: "theme-toggle", callback: this.toggleTheme.bind(this) },
    { text: "About Traccio", type: "link", link: "/home/info"},
    { text: "Sign out", type: "button", callback: this.signOut.bind(this) },
  ];
  searchQuery = '';
  previous = false;

  @Output() submitSearch = new EventEmitter();
  @ViewChild("navHomeIcon", { read: ElementRef }) currNavIconRef: HTMLElement;
  @ViewChild("dropdownButton") dropdownRef: ElementRef;
  @ViewChild("searchField", { static: false, read: ElementRef }) searchFieldElement: ElementRef;
  @ViewChild(TextFieldComponent) searchField: TextFieldComponent;
  @ViewChild("activateSearchButton", { static: false, read: ElementRef }) activateSearchButton: ElementRef;

  constructor(
    private userStore: UserStoreService,
    public router: Router,
    public prefStore: PreferencesStoreService,
    public resizeService: ResizeService,
    public notificationService: NotificationService,
    private authWrapper: AuthWrapperService,
    public loaderService: LoaderService,
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
    const response = await this.authWrapper.signOut();
    if (!response.successful) {
      console.log("error signing out: ", response.error, response.payload);
      return;
    }
    this.signedIn = false;
    this.userStore.clearData();
    this.prefStore.setToDefault();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['']);
  }

  onNavIconClick(ref: HTMLElement) {  }

  onWrapperClick(event: Event) {
    // this.loaderService.setLoadingState(this.previous);
    this.previous = !this.previous;
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
      !this.searchFieldElement.nativeElement.contains(event.target) &&
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
  }

  clearSearch() {
    // use to clear search field when navigating away or on the field's clearEvent
    this.searchQuery = '';
    this.searchField.resetValue('');
  }

  toggleTheme() {
    this.prefStore.toggleTheme();
  }

  navigate(routeID: 'journeyRoute' | 'wishlistRoute') {
    const storedRoute = sessionStorage.getItem(routeID);
    let route: string;
    if (storedRoute) {
      route = storedRoute;
    } else {
      if (routeID === 'journeyRoute') {
        route = '/home/journeys';
      } else if (routeID === 'wishlistRoute') {
        route = '/home/wishlist';
      }
    }
    this.clearSearch();
    this.router.navigate([route]);
  }
}
