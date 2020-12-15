import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStoreService } from "src/app/controllers/auth-store.service";
import { UserStoreService } from "src/app/models/user-store.service";
import { AuthWrapperService } from 'src/app/auth/auth-wrapper.service';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ResizeService } from 'src/app/controllers/resize.service';
import { Title } from '@angular/platform-browser';
import { containsLowercaseValidator, containsNumberValidator, containsUppercaseValidator } from "src/app/utils/validators";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css", "../auth.component.css"],
})
export class SignUpComponent implements OnInit {
  // firstName = "";
  firstName = new FormControl('', [
    Validators.required,
  ]);
  lastName = new FormControl('', [
    Validators.required,
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    containsUppercaseValidator(), // atleast one upper-case letter
    containsLowercaseValidator(), // atleast one lower-case letter
    containsNumberValidator(), // atleast one number
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.pattern(this.password.value)
  ]);
  error = "";
  passwordFocus = false;
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(
    private router: Router,
    private authStore: AuthStoreService,
    private userStore: UserStoreService,
    private authWrapper: AuthWrapperService,
    public rs: ResizeService,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Sign Up | Traccio');
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.submitButton.nativeElement.click();
      }
    });
  }

  async signUp() {
    this.passwordFocus = false;
    // animate button press
    this.submitButton.nativeElement.classList.add('pulse');
    setTimeout(() => {
      this.submitButton.nativeElement.classList.remove('pulse');
    }, 200);
    if (this.password.invalid) { // check for password validity (here for now)
      this.error = 'The password you provided is invalid.\nMake sure that you provide a compliant password.';
      return;
    }

    // execute sign up
    const response = await this.authWrapper.signUp(
      this.firstName.value,
      this.lastName.value,
      this.email.value,
      this.password.value,
      this.confirmPassword.value
    );
    if (response.successful && response.payload) {
      const user: firebase.User = response.payload;
      this.userStore.setUser(
        user.uid,
        user.emailVerified
      );
      this.router.navigate(['confirmsignup']);
    } else {
      this.error = response.message;
      console.log('error', response);
    }
  }
}
