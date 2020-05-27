import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthStoreService } from '../../controllers/auth-store.service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent implements OnInit {

  code = '';
  email = '';
  error = '';
  success = true;

  constructor(private router: Router, private authStore: AuthStoreService, private api: APIService) { }

  ngOnInit() {
    this.email = this.authStore.email;
  }

  async confirmSignup() {
    if (this.email === '') {
      this.router.navigate(['signin']);
      return;
    } else if (this.code === '') {
      this.error = 'A confirmation code must be provided';
      return;
    }

    try {
      await Auth.confirmSignUp(this.authStore.email, this.code);
      console.log('sign up confirmed');
      // this.router.navigate(['signin']);
      this.success = true;
    } catch (error) {
      console.log('Error confirming sign up:', error);
      if (error.code === 'CodeMismatchException') {
        this.error = 'The code provide is incorrect or no longer valid, please try again.';
      } else {
        this.error = error.message;
      }
    }
  }

  handleResend() {
    try {
      Auth.resendSignUp(this.authStore.email);
    } catch (error) {
      console.log('Error resending code:', error);
    }
  }

}
