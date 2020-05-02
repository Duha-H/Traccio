import { Component } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import { Auth } from 'aws-amplify';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Tracker";
  signedIn: boolean;
  user: any; // I don't like this

  constructor(public amplifyService: AmplifyService) {
    this.amplifyService = amplifyService;
    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.signedIn = authState.state === "signedIn";
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
      }
    });
  }

  public isAuthenticated(): boolean {
    return this.signedIn;
  }

  async signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
}
