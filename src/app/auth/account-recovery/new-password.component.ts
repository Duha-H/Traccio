import { OnInit, Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'new-password',
  template: '\
  <div class="recovery-component">\
    <p>Awesome! A verification code was sent to your email.<br>\
    Enter the verification code below.</p>\
    <br>\
		<text-field [width]="360" (inputChange)="code=$event" [label]="\'Verification Code\'"></text-field>\
		<text-field [width]="360" (inputChange)="newPassword=$event" [label]="\'New Password\'" [type]="\'password\'"></text-field>\
		<text-field (inputChange)="confirmedPassword=$event" [label]="\'Re-enter Your New Password\'" [type]="\'password\'"></text-field>\
		<p class="warning-text">{{error}}<br></p>\
    <button (click)="handleSubmit()" class="submit-button">Set New Password</button>\
	  <p>Didn\'t receive a verification code? <a href="" (click)="handleResend()" class="login-link">Resend code</a></p>\
	</div>',
  styleUrls: ["./account-recovery.component.css"],
})
export class NewPasswordComponent implements OnInit {

  code = '';
  newPassword = '';
  confirmedPassword = '';
  @Input() error = '';
  @Output() submitNewPassword = new EventEmitter();
  @Output() resendCode = new EventEmitter();

  ngOnInit() {
  }

  handleSubmit() {
    const verificationData = {
      code: this.code,
      newPassword: this.newPassword,
      confirmedPassword: this.confirmedPassword
    };
    this.submitNewPassword.emit(verificationData);
  }

  handleResend() {
    this.resendCode.emit();
  }
}
