import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { UserStoreService } from '../models/user-store.service';
import { Auth } from '@aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public amplifyService: AmplifyService,
    public router: Router,
    private userStore: UserStoreService) {
    this.amplifyService = amplifyService;
  }

  canActivate(): Promise<boolean> {
    return new Promise((res) => {
      Auth.currentAuthenticatedUser()
      .then((user) => {
        // this.router.navigate(['']);
        return res(true);
      })
      .catch((error) => {
        console.log("Error:", error);
        this.router.navigate(['signin']);
        return res(false);
      });
    });
  }
}
