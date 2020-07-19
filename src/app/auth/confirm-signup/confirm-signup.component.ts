import { Component, OnInit } from '@angular/core';
import { AuthStoreService } from 'src/app/controllers/auth-store.service';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { UserStoreService } from 'src/app/models/user-store.service';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';

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
    this.userStore.user.subscribe(user => {
      this.email = user.email;
    });
  }

  async confirmSignup() {
    if (!this.email) {
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
    await this.authWrapper.resendSignUp(this.email);
  }

}
