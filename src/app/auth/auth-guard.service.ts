import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AmplifyService } from "aws-amplify-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public amplifyService: AmplifyService, public router: Router) {
    this.amplifyService = amplifyService;
  }

  canActivate(): boolean {
    this.amplifyService.authStateChange$.subscribe((authState) => {
      if (authState.state !== "signedIn") {
        this.router.navigate(['login']);
        return false;
      }
    });
    console.log("authed!");
    return true;
  }
}
