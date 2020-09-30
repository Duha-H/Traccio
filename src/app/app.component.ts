import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { UserStoreService } from './models/user-store.service';
import { AuthWrapperService } from './auth/auth-wrapper.service';
import { PreferencesStoreService } from './controllers/preferences-store.service';
import { LoaderService } from './controllers/loader.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

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
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private userStore: UserStoreService,
    public router: Router,
    private authWrapper: AuthWrapperService,
    private prefStore: PreferencesStoreService,
  ) {  }

  async ngOnInit() {
    this.prefStore.reset();
    try {
      this.fireAuth.authState.subscribe(async user => { // fireAuth.authState is only triggered on sign-in/sign-out
        this.signedIn = user ? true : false;
        // this.signedIn = authState.state === "signedIn";
        console.log("state changed", this.signedIn);
        if (!this.signedIn) {
          this.user = null;
          this.authWrapper.authState.signedIn = false;
        } else {
          this.user = user;
          this.authWrapper.authState.signedIn = true;
          // set user attributes and navigate to dashboard
          const identityProvder = 'DEFAULT';
          const userInfo = (await this.fireStore.collection('users').doc(user.uid).get().toPromise()).data();
          this.userStore.setUser(
            userInfo.firstName,
            userInfo.lastName,
            user.uid,
            user.email,
            user.emailVerified,
            identityProvder,
          );
          this.userStore.updateJourneyData();
          // retrieve and set user preferences
          this.prefStore.init(user.uid);
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
