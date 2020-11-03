import { OnInit, Component, EventEmitter, Output, Input, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: 'new-password',
  template: '\
  <div class="recovery-component">\
    <p>Awesome! A verification code was sent to {{email}}.<br>\
    Enter the verification code below.</p>\
    <br>\
		<text-field [width]="360" (inputChange)="code=$event" [label]="\'Verification Code\'"></text-field>\
		<text-field [width]="360" (inputChange)="newPassword=$event" [label]="\'New Password\'" [type]="\'password\'"></text-field>\
		<text-field (inputChange)="confirmedPassword=$event" [label]="\'Re-enter Your New Password\'" [type]="\'password\'"></text-field>\
		<p class="warning-text">{{error}}<br></p>\
    <button (click)="handleSubmit()" class="submit-btn" #submitButton>Set New Password</button>\
	  <p>Didn\'t receive a verification code? <a href="" (click)="handleResend()" class="login-link">Resend code</a></p>\
	</div>',
  styleUrls: ["./account-recovery.component.css"],
})
export class NewPasswordComponent implements OnInit {

  code = '';
  newPassword = '';
  confirmedPassword = '';
  @Input() error = '';
  @Input() email = '';
  @Output() submitNewPassword = new EventEmitter();
  @Output() resendCode = new EventEmitter();
  @ViewChild('submitButton') submitButton: ElementRef;

  ngOnInit() {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
  }

  handleSubmit() {
    // animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
		// submit
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
