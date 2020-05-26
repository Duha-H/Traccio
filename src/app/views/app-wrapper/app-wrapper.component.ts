import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Auth } from "aws-amplify";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router } from "@angular/router";

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
  @ViewChild("dropdownButton") dropdownRef: ElementRef;

  constructor(private userStore: UserStoreService, private router: Router) {}

  ngOnInit(): void {}

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
}

export interface DropdownItem {
  text: string;
  readonly type: "button" | "link" | "item" | "toggle";
  readonly callback?: () => void;
  readonly link?: string;
}
