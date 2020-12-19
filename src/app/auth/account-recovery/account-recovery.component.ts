import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { NewPasswordComponent } from './new-password.component';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.component.html',
  styleUrls: ['./account-recovery.component.css', '../auth.component.css']
})
export class AccountRecoveryComponent implements OnInit {

  forgotPass = false;
  error = '';
  email = '';
  mode:
    'forgotPassword' |
    'resetPassword' |
    'resetPasswordLinkSent' |
    'resetSuccessful' |
    'recoverEmail' |
    'verifyEmail' = 'forgotPassword';
  code = '';
  @ViewChild(NewPasswordComponent) newPasswordComp: NewPasswordComponent;

  constructor(
    private router: Router,
    private authWrapper: AuthWrapperService,
    private route: ActivatedRoute,
    private titleService: Title,
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Account Recovery | Traccio');
    const mode = this.route.snapshot.queryParams.mode;
    if (mode) {
      this.mode = mode;
    }
    const actionCode = this.route.snapshot.queryParams.oobCode;
    switch (this.mode) {
      case 'resetPassword': {
        await this.handleResetPassword(
          actionCode,
          this.route.snapshot.queryParams.continueUrl
        );
        break;
      }
      case 'recoverEmail': {
        await this.handleRecoverEmail(actionCode);
        break;
      }
      case 'verifyEmail': {
        await this.handleVerifyEmail(actionCode);
        break;
      }
      default:
        break;
    }
  }

  async handleResetPassword(actionCode: string, continueUrl: string) {
    this.code = actionCode;
    const response = await this.authWrapper.verifyPasswordResetCode(actionCode, continueUrl);
    if (response.successful) {
      this.email = response.payload.email;
      this.newPasswordComp.code = this.code;
      this.newPasswordComp.email = this.email;
    } else {
      this.error = response.message;
    }
  }

  async handleRecoverEmail(actionCode: string) {
    const response = await this.authWrapper.checkActionCode(actionCode);
    if (response.successful) {
      this.email = response.payload.email;
    } else {
      this.error = response.message;
    }
  }

  async handleVerifyEmail(actionCode: string) {
    const response = await this.authWrapper.applyActionCode(actionCode);
    if (!response.successful) {
      this.error = response.message;
    }
  }

  toggleView(state: boolean) {
    this.forgotPass = state;
  }

  async forgotPassword(email?: string) {
    this.email = email ? email : this.email; // if email is not specified, use stored value
    const response = await this.authWrapper.forgotPassword(this.email);
    if (response.successful) {
      this.forgotPass = false;
      this.mode = 'resetPasswordLinkSent';
    } else {
      this.error = response.message;
    }
  }

  async forgotPasswordSubmit(verificationData: {
    newPassword: string,
    confirmedPassword: string,
  }) {
    const response = await this.authWrapper.forgotPasswordSubmit(
      this.email,
      this.code,
      verificationData.newPassword,
      verificationData.confirmedPassword
    );
    if (response.successful) {
      this.mode = 'resetSuccessful';
    } else {
      this.error = response.message;
    }

  }

  async resendLink() {
    const response = await this.authWrapper.resendVerificationLink(this.email);
    if (!response.successful) {
      this.error = response.message;
    }
  }

}
