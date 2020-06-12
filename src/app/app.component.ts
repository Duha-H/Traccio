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
    public router: Router) {  }

  async ngOnInit() {
    try {
      this.amplifyService.authStateChange$.subscribe(async (authState) => {
        this.signedIn = authState.state === "signedIn";
        console.log("state changed");
        if (!this.signedIn) {
          this.user = null;
        } else {
          this.user = authState.user;
          // this.router.navigate(['']);
          // set user attributes and navigate to dashboard
          await this.userStore.setUser(
            this.user.attributes.given_name,
            this.user.attributes.family_name,
            this.user.attributes.sub,
            this.user.attributes.email,
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
