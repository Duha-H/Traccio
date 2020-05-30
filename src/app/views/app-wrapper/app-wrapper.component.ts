import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Auth } from "aws-amplify";
import { UserStoreService } from "src/app/models/user-store.service";
import { Router, ActivatedRoute } from "@angular/router";

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
  currClassName: string;
  @ViewChild("navHomeIcon", { read: ElementRef }) currNavIconRef: HTMLElement;
  @ViewChild("dropdownButton") dropdownRef: ElementRef;

  constructor(
    private userStore: UserStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {  }

  ngOnInit() {
    // this.currClassName = this.currNavIconRef._elementRef.nativeElement.className;
    // this.route.data.subscribe(data => {
    //   console.log("route:", data);
    // });
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

  onNavIconClick(ref: HTMLElement) {
    // console.log(this.currNavIconRef);
    // console.log("click?", ref);
    // this.currNavIconRef.className = "";
    // this.currNavIconRef = ref;
    // // this.currClassName = this.currNavIconRef._elementRef.nativeElement.className;
    // this.currNavIconRef.className = "active";
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
