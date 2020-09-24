import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { UserStoreService } from './models/user-store.service';
import { AuthWrapperService } from './auth/auth-wrapper.service';
import { PreferencesStoreService } from './controllers/preferences-store.service';
import { LoaderService } from './controllers/loader.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Tracker";
  signedIn: boolean;
  user: any; // I don't like this
  theme = 'dark';

  constructor(
    public amplifyService: AmplifyService,
    private userStore: UserStoreService,
    public router: Router,
    private authWrapper: AuthWrapperService,
    private prefStore: PreferencesStoreService,
  ) {  }

  async ngOnInit() {
    this.prefStore.reset();
    try {
      this.amplifyService.authStateChange$.subscribe(async (authState) => {
        this.signedIn = authState.state === "signedIn";
        console.log("state changed", this.signedIn);
        if (!this.signedIn) {
          this.user = null;
          this.authWrapper.authState.signedIn = false;
        } else {
          this.user = authState.user;
          this.authWrapper.authState.signedIn = true;
          // set user attributes and navigate to dashboard
          let verified;
          let identityProvder: 'DEFAULT' | 'GOOGLE' = 'DEFAULT';
          if (this.user.attributes.identities) {
            verified = true; // if user is provided by a federated identity, we don't care if they're verified
            identityProvder = 'GOOGLE';
          } else {
            verified = this.user.attributes.email_verified;
          }
          await this.userStore.setUser(
            this.user.attributes.given_name,
            this.user.attributes.family_name,
            this.user.attributes.sub,
            this.user.attributes.email,
            verified,
            identityProvder,
          );
          this.userStore.loadData();
          // retrieve and set user preferences
          this.prefStore.init(this.user.attributes.sub);
          console.log("App init: user authenticated and data fetched");
          // this.router.navigate(['home']);
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
