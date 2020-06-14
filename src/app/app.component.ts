import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { Auth } from 'aws-amplify';
import { UserStoreService } from './models/user-store.service';
import { AuthWrapperService } from './auth/auth-wrapper.service';

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
    public router: Router,
    private authWrapper: AuthWrapperService,
  ) {  }

  async ngOnInit() {
    try {
      this.amplifyService.authStateChange$.subscribe(async (authState) => {
        this.signedIn = authState.state === "signedIn";
        console.log("state changed");
        if (!this.signedIn) {
          this.user = null;
          this.authWrapper.authState.signedIn = false;
        } else {
          this.user = authState.user;
          this.authWrapper.authState.signedIn = true;
          // this.router.navigate(['']);
          // set user attributes and navigate to dashboard
          console.log(this.user);
          await this.userStore.setUser(
            this.user.attributes.given_name,
            this.user.attributes.family_name,
            this.user.attributes.sub,
            this.user.attributes.email,
            this.user.attributes.email_verified,
          );
          // await this.userStore.fetchData();
          console.log("App init: user authenticated and data fetched");
        }
      });
    } catch (error) {
      console.log("App init: user not initialized:", error);
    }
  }

  ngDoBootstrap() { }

  public isAuthenticated(): boolean {
    return this.signedIn;
  }

}
