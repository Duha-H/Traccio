import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { AuthWrapperService } from '../auth-wrapper.service';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.css']
})
export class AccountRecoveryComponent implements OnInit {

  forgotPass = false;
  error = '';
  email = '';
  state: 'forgotPassword' | 'newPassword' | 'resetSuccessful' = 'forgotPassword';

  constructor(private router: Router, private authWrapper: AuthWrapperService) { }

  ngOnInit(): void {
  }

  toggleView(state: boolean) {
    this.forgotPass = state;
  }

  async forgotPassword(email?: string) {
    this.email = email ? email : this.email; // if email is not specified, use stored value
    const response = await this.authWrapper.forgotPassword(this.email);
    if (response.successful) {
      this.forgotPass = false;
      this.state = 'newPassword';
    } else {
      this.error = response.message;
    }
  }

  async forgotPasswordSubmit(verificationData: {[key: string]: string}) {
    const response = await this.authWrapper.forgotPasswordSubmit(
      this.email,
      verificationData.code,
      verificationData.newPassword,
      verificationData.confirmedPassword
    );
    if (response.successful) {
      this.state = 'resetSuccessful';
    } else {
      this.error = response.message;
    }

  }

}
