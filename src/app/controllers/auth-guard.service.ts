import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { AmplifyService } from "aws-amplify-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, private authWrapper: AuthWrapperService, private amplifyService: AmplifyService) { }

  async canActivate(): Promise<boolean> {
    const authedUser = await this.authWrapper.currentAuthenticatedUser();
    if (authedUser || this.authWrapper.authState.signedIn) {
      console.log('user currently authenticated');
      return true;
    } else {
      console.log('user NOT authenticated');
      this.router.navigate(['']);
      return false;
    }
    // console.log(this.amplifyService.authState();
    // return true;
  }
}
