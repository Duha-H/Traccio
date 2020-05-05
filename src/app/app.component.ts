import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { Auth } from 'aws-amplify';
import { UserStoreService } from './models/user-store.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Tracker";
  signedIn: boolean;
  user: any; // I don't like this

  constructor(
    public amplifyService: AmplifyService,
    private userStore: UserStoreService,
    public router: Router) {
    this.router = router;
    this.amplifyService = amplifyService;
    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.signedIn = authState.state === "signedIn";
      console.log("state changed");
      if (!this.signedIn) {
        this.user = null;
      } else {
        this.user = authState.user;
        this.userStore = userStore;
        // set user attributes and navigate to dashboard
        this.userStore.setUser(
          this.user.attributes.given_name,
          this.user.attributes.family_name,
          this.user.attributes.sub
        );
        // this.router.navigate(['']);
      }
    });

  }

  ngOnInit() {
    console.log("app init!");
  }

  ngDoBootstrap() { }

  public isAuthenticated(): boolean {
    return this.signedIn;
  }

  async signOut() {
    try {
        await Auth.signOut();
        this.signedIn = false;
        this.userStore.clearData();
        this.router.navigate(['login']);
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
}
