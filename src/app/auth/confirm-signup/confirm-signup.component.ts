import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthStoreService } from '../../controllers/auth-store.service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { UserStoreService } from 'src/app/models/user-store.service';
import { AuthWrapperService } from '../auth-wrapper.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent implements OnInit {

  code = '';
  email = '';
  error = '';
  success = false;

  constructor(
    private router: Router,
    private authStore: AuthStoreService,
    private api: APIService,
    private userStore: UserStoreService,
    private authWrapper: AuthWrapperService
  ) { }

  ngOnInit() {
    // this.email = this.authStore.email;
    this.email = this.userStore.user.email;
  }

  async confirmSignup() {
    // if (this.email === '') {
    //   this.router.navigate(['signin']);
    //   return;
    // } else if (this.code === '') {
    //   this.error = 'A confirmation code must be provided';
    //   return;
    // }

    // try {
    //   await Auth.confirmSignUp(this.authStore.email, this.code);
    //   console.log('sign up confirmed');
    //   // this.router.navigate(['signin']);
    //   this.success = true;
    // } catch (error) {
    //   console.log('Error confirming sign up:', error);
    //   if (error.code === 'CodeMismatchException') {
    //     this.error = 'The code provide is incorrect or no longer valid, please try again.';
    //   } else {
    //     this.error = error.message;
    //   }
    // }
    if (this.email === '') {
      this.router.navigate(['signin']);
      return;
    }

    const response = await this.authWrapper.confirmSignup(this.email, this.code);
    if (response.successful) {
      this.success = true;
    } else {
      this.error = response.message;
    }
  }

  async handleResend() {
    // try {
    //   Auth.resendSignUp(this.authStore.email);
    // } catch (error) {
    //   console.log('Error resending code:', error);
    // }
    await this.authWrapper.resendSignUp(this.email);
  }

}
