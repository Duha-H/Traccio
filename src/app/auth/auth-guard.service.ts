import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { UserStoreService } from '../models/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public amplifyService: AmplifyService,
    public router: Router,
    public userStore: UserStoreService) {
    this.amplifyService = amplifyService;
  }

  canActivate(): boolean {
    this.amplifyService.authStateChange$.subscribe((authState) => {
      if (authState.state !== "signedIn") {
        this.router.navigate(['signin']);
        return false;
      }
    });
    // if (this.userStore.user === undefined) {
    //     this.router.navigate(['']);
    //     return false;
    // }
    console.log("authed!");
    return true;
  }
}
