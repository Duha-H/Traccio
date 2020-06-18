import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from "@angular/core";
import { Auth } from "aws-amplify";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { DropdownItem } from 'src/app/components/types';

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
    { text: "Account settings", type: "link", link: "/settings" },
    { text: "Theme: dark", type: "toggle" },
    { text: "Sign out", type: "button", callback: this.signOut.bind(this) },
  ];
  searchQuery = '';
  searchSubject: BehaviorSubject<string> = new BehaviorSubject(this.searchQuery);
  @Output() submitSearch = new EventEmitter();
  @ViewChild("navHomeIcon", { read: ElementRef }) currNavIconRef: HTMLElement;
  @ViewChild("dropdownButton") dropdownRef: ElementRef;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
  ) {  }

  ngOnInit() {  }

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
}
