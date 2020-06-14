import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";
import { UserStoreService } from '../models/user-store.service';
import { Auth } from '@aws-amplify/auth';
import { AuthWrapperService } from '../auth/auth-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, private authWrapper: AuthWrapperService) { }

  async canActivate(): Promise<boolean> {
    if (await this.authWrapper.currentAuthenticatedUser()) {
      return true;
    } else {
      this.router.navigate(['signin']);
      return false;
    }
  }
}
