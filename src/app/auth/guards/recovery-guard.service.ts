import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { AuthModule } from 'src/app/auth/auth.module';

@Injectable({
  providedIn: AuthModule
})
export class AccountRecoveryGuard implements CanActivate {

  constructor(public router: Router, private authWrapper: AuthWrapperService) { }

  async canActivate(): Promise<boolean> {
    if (!this.authWrapper.authState.signedIn && !this.authWrapper.authState.signedUp) {
      return true;
    } else {
      this.router.navigate(['signin']);
      return false;
    }
  }
}
