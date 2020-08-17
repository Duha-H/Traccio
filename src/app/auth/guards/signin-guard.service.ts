import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { AuthModule } from 'src/app/auth/auth.module';
import { UserStoreService } from 'src/app/models/user-store.service';

@Injectable({
  providedIn: AuthModule
})
export class SignInGuard implements CanActivate {

  constructor(
    public router: Router,
    private authWrapper: AuthWrapperService,
    private userStore: UserStoreService
  ) { }

  async canActivate(): Promise<boolean> {
    const authedUser = await this.authWrapper.currentAuthenticatedUser();
    if (this.authWrapper.authState.signedIn || authedUser) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
