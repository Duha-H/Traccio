import { OnInit, Component, EventEmitter, Output, Input, ElementRef, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { containsLowercaseValidator, containsNumberValidator, containsUppercaseValidator } from "src/app/utils/validators";

@Component({
  selector: 'new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ["./account-recovery.component.css"],
})
export class NewPasswordComponent implements OnInit {

  code = '';
  newPassword = '';
  confirmedPassword = '';
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    containsUppercaseValidator(),
    containsLowercaseValidator(),
    containsNumberValidator(),
  ]);
  @Input() error = '';
  @Input() email = 'your email';
  @Output() submitNewPassword = new EventEmitter();
  @Output() resendCode = new EventEmitter();
  @ViewChild('submitButton') submitButton: ElementRef;

  ngOnInit() {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
    console.log(this.email);
  }

  handleSubmit() {
    // animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
		// submit
    const verificationData = {
      newPassword: this.newPassword,
      confirmedPassword: this.confirmedPassword
    };
    this.submitNewPassword.emit(verificationData);
  }

  handleResend() {
    this.resendCode.emit();
  }
}
